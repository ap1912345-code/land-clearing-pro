// Shared OpenAI image-generation client + worker-pool runner.
// Used by scripts/generate-images.ts and scripts/generate-ads.ts.

import { Buffer } from 'node:buffer';

const GEN_URL = 'https://api.openai.com/v1/images/generations';
const EDIT_URL = 'https://api.openai.com/v1/images/edits';
const FALLBACK_MODEL = 'gpt-image-1';

export type ImageSize = '1024x1024' | '1536x1024' | '1024x1536';

export type GenJob = {
  id: string;                 // for logs
  prompt: string;
  size?: ImageSize;
};

export type EditJob = {
  id: string;                 // for logs
  prompt: string;             // describes the edit to apply
  imageBuf: Buffer;           // the source image to edit (PNG bytes)
  size?: ImageSize;
};

export type ClientOpts = {
  apiKey: string;
  model: string;              // primary model (auto-falls-back to FALLBACK_MODEL on model_not_found)
  maxAttempts?: number;       // total attempts (including first); default 5
};

export function makeClient(opts: ClientOpts) {
  const maxAttempts = opts.maxAttempts ?? 5;
  let activeModel = opts.model;

  async function generate(job: GenJob, attempt = 1): Promise<Buffer> {
    const body = {
      model: activeModel,
      prompt: job.prompt,
      size: job.size ?? '1024x1024',
      n: 1,
    };

    let res: Response;
    try {
      res = await fetch(GEN_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${opts.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      if (attempt < maxAttempts) {
        const backoff = 1000 * Math.pow(2, attempt);
        console.warn(`  ↳ network error on ${job.id} (${(err as Error).message}), retry ${attempt}/${maxAttempts - 1} in ${backoff}ms`);
        await sleep(backoff);
        return generate(job, attempt + 1);
      }
      throw err;
    }

    if (!res.ok) {
      const text = await res.text();
      if (
        activeModel !== FALLBACK_MODEL &&
        (text.includes('model_not_found') || text.includes('does not exist') || res.status === 404)
      ) {
        console.warn(`  ↳ model "${activeModel}" not available, falling back to "${FALLBACK_MODEL}"`);
        activeModel = FALLBACK_MODEL;
        return generate(job, attempt);
      }
      if ((res.status === 429 || res.status >= 500) && attempt < maxAttempts) {
        const backoff = 1000 * Math.pow(2, attempt);
        console.warn(`  ↳ ${res.status} on ${job.id}, retry ${attempt}/${maxAttempts - 1} in ${backoff}ms`);
        await sleep(backoff);
        return generate(job, attempt + 1);
      }
      throw new Error(`OpenAI ${res.status}: ${text.slice(0, 400)}`);
    }

    const json = await res.json() as { data: Array<{ b64_json?: string; url?: string }> };
    const item = json.data?.[0];
    if (!item) throw new Error('No image in response');

    if (item.b64_json) return Buffer.from(item.b64_json, 'base64');
    if (item.url) {
      const imgRes = await fetch(item.url);
      if (!imgRes.ok) throw new Error(`Failed to download image from ${item.url}`);
      return Buffer.from(await imgRes.arrayBuffer());
    }
    throw new Error('Response had neither b64_json nor url');
  }

  // Edit an existing image. Sends multipart/form-data to /v1/images/edits.
  // The model re-imagines the input image according to the prompt while
  // preserving overall composition, lighting, and camera angle — exactly
  // what we want for before/after pairs that need to look like the same property.
  async function edit(job: EditJob, attempt = 1): Promise<Buffer> {
    const form = new FormData();
    // Node 18+ supports Blob and FormData natively. Pass the image buffer as a Blob.
    form.append('image', new Blob([new Uint8Array(job.imageBuf)], { type: 'image/png' }), `${job.id}.png`);
    form.append('prompt', job.prompt);
    form.append('model', activeModel);
    form.append('size', job.size ?? '1024x1024');
    form.append('n', '1');

    let res: Response;
    try {
      res = await fetch(EDIT_URL, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${opts.apiKey}` },
        body: form,
      });
    } catch (err) {
      if (attempt < maxAttempts) {
        const backoff = 1000 * Math.pow(2, attempt);
        console.warn(`  ↳ network error on edit ${job.id} (${(err as Error).message}), retry ${attempt}/${maxAttempts - 1} in ${backoff}ms`);
        await sleep(backoff);
        return edit(job, attempt + 1);
      }
      throw err;
    }

    if (!res.ok) {
      const text = await res.text();
      if (
        activeModel !== FALLBACK_MODEL &&
        (text.includes('model_not_found') || text.includes('does not exist') || res.status === 404)
      ) {
        console.warn(`  ↳ edit model "${activeModel}" not available, falling back to "${FALLBACK_MODEL}"`);
        activeModel = FALLBACK_MODEL;
        return edit(job, attempt);
      }
      if ((res.status === 429 || res.status >= 500) && attempt < maxAttempts) {
        const backoff = 1000 * Math.pow(2, attempt);
        console.warn(`  ↳ ${res.status} on edit ${job.id}, retry ${attempt}/${maxAttempts - 1} in ${backoff}ms`);
        await sleep(backoff);
        return edit(job, attempt + 1);
      }
      throw new Error(`OpenAI edit ${res.status}: ${text.slice(0, 400)}`);
    }

    const json = await res.json() as { data: Array<{ b64_json?: string; url?: string }> };
    const item = json.data?.[0];
    if (!item) throw new Error('No image in edit response');
    if (item.b64_json) return Buffer.from(item.b64_json, 'base64');
    if (item.url) {
      const imgRes = await fetch(item.url);
      if (!imgRes.ok) throw new Error(`Failed to download edited image from ${item.url}`);
      return Buffer.from(await imgRes.arrayBuffer());
    }
    throw new Error('Edit response had neither b64_json nor url');
  }

  return {
    generate,
    edit,
    getActiveModel: () => activeModel,
  };
}

// Worker-pool style parallel execution. Workers pull from a shared queue.
export async function runPool<T>(items: T[], workers: number, fn: (item: T) => Promise<void>): Promise<void> {
  const queue = items.slice();
  const next = async () => {
    while (queue.length) {
      const item = queue.shift();
      if (item === undefined) return;
      await fn(item);
    }
  };
  await Promise.all(Array.from({ length: Math.min(workers, items.length) }, next));
}

export function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}
