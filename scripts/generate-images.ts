#!/usr/bin/env tsx
/**
 * Generates every image declared in src/data/images.ts via the OpenAI image API.
 *
 * Two kinds of jobs are processed:
 *   - SimpleJob: a single image generated from a fresh prompt.
 *   - PairJob:   a before/after pair. The BEFORE is generated normally; the AFTER
 *                is produced by sending the BEFORE bytes back to /v1/images/edits
 *                with `editPrompt` as the instruction. This locks camera angle,
 *                lighting, sky, and surrounding trees between the two images, so
 *                the pair actually looks like the same property over time.
 *
 * Usage:
 *   npm run generate:images                              # generate all missing, 4 in parallel
 *   npm run generate:images:dry                          # print what would be generated, do nothing
 *   npx tsx scripts/generate-images.ts --concurrency 6   # tune parallelism
 *   npx tsx scripts/generate-images.ts --only hero-main ba-cedar-thicket
 *   npx tsx scripts/generate-images.ts --force           # overwrite existing
 *
 * Env (.env at project root):
 *   OPENAI_API_KEY=sk-...
 *   OPENAI_IMAGE_MODEL=gpt-image-2     # falls back to gpt-image-1 on "model_not_found"
 *   IMAGE_CONCURRENCY=4                # default parallelism; --concurrency overrides
 */
import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadEnv } from 'dotenv';

import { SITE_IMAGES, BEFORE_AFTER, type SiteImage, type BeforeAfter } from '../src/data/images.ts';
import { makeClient, runPool } from './_image-api.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
loadEnv({ path: join(PROJECT_ROOT, '.env') });

const OUT_DIR = join(PROJECT_ROOT, 'public', 'images');
const PRIMARY_MODEL = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2';
const API_KEY = process.env.OPENAI_API_KEY;

// ---- args ----
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const FORCE   = args.includes('--force');
const onlyIdx = args.indexOf('--only');
const ONLY = onlyIdx >= 0 ? new Set(args.slice(onlyIdx + 1).filter(a => !a.startsWith('--'))) : null;
const ccIdx = args.indexOf('--concurrency');
const CONCURRENCY = Math.max(1, Number(
  (ccIdx >= 0 ? args[ccIdx + 1] : undefined) ?? process.env.IMAGE_CONCURRENCY ?? 4,
));

// ---- job model ----
type SimpleJob = { kind: 'simple'; file: string; image: SiteImage };
type PairJob   = { kind: 'pair';   ba: BeforeAfter };
type Job       = SimpleJob | PairJob;

const JOBS: Job[] = [
  ...SITE_IMAGES.map<SimpleJob>(img => ({ kind: 'simple', file: `${img.id}.png`, image: img })),
  ...BEFORE_AFTER.map<PairJob>(ba => ({ kind: 'pair', ba })),
];

// ---- helpers ----
async function exists(p: string) {
  try { await access(p); return true; } catch { return false; }
}

function jobMatches(job: Job, only: Set<string>): boolean {
  if (job.kind === 'simple') {
    return only.has(job.image.id) || only.has(job.file.replace(/\.png$/, ''));
  }
  // Pair matches if user asks for the base id, the -before, or the -after.
  return only.has(job.ba.id) || only.has(`${job.ba.id}-before`) || only.has(`${job.ba.id}-after`);
}

function jobFiles(job: Job): string[] {
  return job.kind === 'simple'
    ? [job.file]
    : [`${job.ba.id}-before.png`, `${job.ba.id}-after.png`];
}

function jobLabel(job: Job): string {
  return job.kind === 'simple' ? job.file : `${job.ba.id} (pair)`;
}

const client = makeClient({ apiKey: API_KEY ?? '', model: PRIMARY_MODEL });

// ---- workers ----
async function runSimple(job: SimpleJob, total: number, counter: { done: number; failed: number }) {
  const outPath = join(OUT_DIR, job.file);
  const t0 = Date.now();
  console.log(`  …  ${job.file}  (starting)`);
  try {
    const buf = await client.generate({ id: job.file, prompt: job.image.prompt, size: job.image.size });
    await writeFile(outPath, buf);
    counter.done++;
    const dt = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(`  ✔  ${job.file}  (${(buf.length / 1024).toFixed(0)} KB, ${dt}s)  [${counter.done + counter.failed}/${total}]`);
  } catch (err) {
    counter.failed++;
    console.log(`  ✗  ${job.file}  ${(err as Error).message}  [${counter.done + counter.failed}/${total}]`);
  }
}

async function runPair(job: PairJob, total: number, counter: { done: number; failed: number }) {
  const { ba } = job;
  const beforePath = join(OUT_DIR, `${ba.id}-before.png`);
  const afterPath  = join(OUT_DIR, `${ba.id}-after.png`);
  const t0 = Date.now();

  // Step 1: produce the BEFORE bytes (from disk if it already exists, else generate).
  let beforeBuf: Buffer | null = null;
  if (!FORCE && await exists(beforePath)) {
    beforeBuf = await readFile(beforePath);
    console.log(`  ✔  ${ba.id}-before.png  (exists, reusing for edit)`);
  } else {
    console.log(`  …  ${ba.id}-before.png  (generating)`);
    try {
      beforeBuf = await client.generate({ id: `${ba.id}-before`, prompt: ba.before.prompt, size: ba.size });
      await writeFile(beforePath, beforeBuf);
      counter.done++;
      const dt = ((Date.now() - t0) / 1000).toFixed(1);
      console.log(`  ✔  ${ba.id}-before.png  (${(beforeBuf.length / 1024).toFixed(0)} KB, ${dt}s)  [${counter.done + counter.failed}/${total}]`);
    } catch (err) {
      counter.failed++;
      console.log(`  ✗  ${ba.id}-before.png  ${(err as Error).message}  [${counter.done + counter.failed}/${total}]`);
      return; // can't make AFTER without BEFORE
    }
  }

  // Step 2: edit BEFORE → AFTER (skip if already exists and not forcing).
  if (!FORCE && await exists(afterPath)) {
    console.log(`  ✔  ${ba.id}-after.png  (exists, skipping)`);
    return;
  }
  const t1 = Date.now();
  console.log(`  …  ${ba.id}-after.png  (editing from before)`);
  try {
    const afterBuf = await client.edit({
      id: `${ba.id}-after`,
      prompt: ba.after.editPrompt,
      imageBuf: beforeBuf,
      size: ba.size,
    });
    await writeFile(afterPath, afterBuf);
    counter.done++;
    const dt = ((Date.now() - t1) / 1000).toFixed(1);
    console.log(`  ✔  ${ba.id}-after.png  (${(afterBuf.length / 1024).toFixed(0)} KB, ${dt}s, edit)  [${counter.done + counter.failed}/${total}]`);
  } catch (err) {
    counter.failed++;
    console.log(`  ✗  ${ba.id}-after.png  ${(err as Error).message}  [${counter.done + counter.failed}/${total}]`);
  }
}

// ---- main ----
async function main() {
  if (!DRY_RUN && !API_KEY) {
    console.error('ERROR: OPENAI_API_KEY is not set. Add it to .env or pass --dry-run.');
    process.exit(1);
  }
  await mkdir(OUT_DIR, { recursive: true });

  const filtered = ONLY ? JOBS.filter(j => jobMatches(j, ONLY)) : JOBS;

  // Count how many actual image files need to be produced. A pair contributes
  // 0, 1, or 2 depending on what's on disk and whether --force is set.
  const toRun: Job[] = [];
  let skipped = 0;
  let totalImageCount = 0;

  for (const job of filtered) {
    const files = jobFiles(job);
    const existsArr = await Promise.all(files.map(f => exists(join(OUT_DIR, f))));
    const missing = files.filter((_, i) => FORCE || !existsArr[i]);

    if (DRY_RUN) {
      for (const f of files) {
        const existed = existsArr[files.indexOf(f)];
        const verb = (existed && !FORCE) ? '✔ (exists)' : '· would generate' + (job.kind === 'pair' && f.endsWith('-after.png') ? ' [via edit]' : '');
        console.log(`  ${verb}  ${f}`);
      }
      continue;
    }

    if (missing.length === 0) {
      for (const f of files) console.log(`  ✔  ${f}  (exists, skipping)`);
      skipped += files.length;
      continue;
    }
    toRun.push(job);
    totalImageCount += missing.length;
  }

  console.log('');
  console.log(`Image generation`);
  console.log(`  model:       ${client.getActiveModel()}`);
  console.log(`  out:         ${OUT_DIR}`);
  console.log(`  to generate: ${totalImageCount} image file(s) across ${toRun.length} job(s)  (${skipped} already exist)`);
  console.log(`  concurrency: ${CONCURRENCY}`);
  console.log(`  mode:        ${DRY_RUN ? 'DRY RUN' : FORCE ? 'FORCE OVERWRITE' : 'skip existing'}`);
  console.log('');

  if (DRY_RUN || toRun.length === 0) {
    console.log(`Done. generated=0  skipped=${skipped}  failed=0`);
    return;
  }

  const counter = { done: 0, failed: 0 };
  const startedAt = Date.now();

  await runPool(toRun, CONCURRENCY, async (job) => {
    if (job.kind === 'simple') {
      await runSimple(job, totalImageCount, counter);
    } else {
      await runPair(job, totalImageCount, counter);
    }
    // Silence "label unused" — we keep jobLabel for future diagnostics.
    void jobLabel;
  });

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log('');
  console.log(`Done in ${elapsed}s.  generated=${counter.done}  skipped=${skipped}  failed=${counter.failed}`);
  if (counter.failed > 0) process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
