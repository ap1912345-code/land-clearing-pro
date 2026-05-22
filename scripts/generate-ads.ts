#!/usr/bin/env tsx
/**
 * Generates static Facebook ad creatives declared in src/data/ads.ts.
 * Writes images to ./ads/ and an INDEX.md catalog with each ad's suggested copy.
 *
 * Usage:
 *   npm run generate:ads                                  # generate all missing, 4 in parallel
 *   npm run generate:ads:dry                              # show what would be generated
 *   npx tsx scripts/generate-ads.ts --concept hook        # only one concept
 *   npx tsx scripts/generate-ads.ts --format story        # only one format
 *   npx tsx scripts/generate-ads.ts --only hook-cedar-headline transform-cedar-split
 *   npx tsx scripts/generate-ads.ts --concurrency 6
 *   npx tsx scripts/generate-ads.ts --force               # overwrite existing
 *
 * Env (.env at project root):
 *   OPENAI_API_KEY=sk-...
 *   OPENAI_IMAGE_MODEL=gpt-image-2     # primary; auto-falls-back to gpt-image-1 on model_not_found
 *   IMAGE_CONCURRENCY=4                # default parallelism; --concurrency overrides
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadEnv } from 'dotenv';

import { AD_CREATIVES, type AdCreative } from '../src/data/ads.ts';
import { makeClient, runPool } from './_image-api.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
loadEnv({ path: join(PROJECT_ROOT, '.env') });

const OUT_DIR = join(PROJECT_ROOT, 'ads');
const PRIMARY_MODEL = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2';
const API_KEY = process.env.OPENAI_API_KEY;

// ---- args ----
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const FORCE   = args.includes('--force');
const NO_INDEX = args.includes('--no-index');

const onlyIdx = args.indexOf('--only');
const ONLY = onlyIdx >= 0 ? new Set(args.slice(onlyIdx + 1).filter(a => !a.startsWith('--'))) : null;

const conceptIdx = args.indexOf('--concept');
const CONCEPT_FILTER = conceptIdx >= 0 ? args[conceptIdx + 1] : null;

const formatIdx = args.indexOf('--format');
const FORMAT_FILTER = formatIdx >= 0 ? args[formatIdx + 1] : null;

const ccIdx = args.indexOf('--concurrency');
const CONCURRENCY = Math.max(1, Number(
  (ccIdx >= 0 ? args[ccIdx + 1] : undefined) ?? process.env.IMAGE_CONCURRENCY ?? 4,
));

const client = makeClient({ apiKey: API_KEY ?? '', model: PRIMARY_MODEL });

async function exists(p: string) {
  try { await access(p); return true; } catch { return false; }
}

function passesFilters(ad: AdCreative): boolean {
  if (ONLY && !ONLY.has(ad.id)) return false;
  if (CONCEPT_FILTER && ad.concept !== CONCEPT_FILTER) return false;
  if (FORMAT_FILTER && ad.format !== FORMAT_FILTER) return false;
  return true;
}

async function writeIndex(ads: AdCreative[]) {
  const byConcept = new Map<string, AdCreative[]>();
  for (const ad of ads) {
    const list = byConcept.get(ad.concept) ?? [];
    list.push(ad);
    byConcept.set(ad.concept, list);
  }

  const conceptHeader: Record<string, string> = {
    'before-after': '## Concept 1 — Before/After stack (strongest hook)\n\nStacked photos with red "BEFORE" / green "AFTER" labels and a black pill badge showing job duration. Historically the highest-converting style for service businesses. Lead with these.',
    'offer-strip': '## Concept 2 — Offer strip\n\nPhoto on top, solid green panel below with a bold 2-line headline and a yellow/orange CTA badge. The workhorse — pair across many services for ad-set rotation.',
    'question-hook': '## Concept 3 — Question hook\n\nDarkened photo background with a centered big-text question and a yellow CTA pill. Strong for cold audiences and stop-the-scroll.',
    'reclaim': '## Concept 4 — Reclaim overgrowth\n\nFor landowners with old hayfields, lost yards, brush-eaten property edges. Emotional/heritage angle: "your land had a purpose; let us give it back to you." Strong for rural Worcester County.',
    'stat-badge': '## Concept 5 — Stat badge\n\nLightly-darkened photo with a massive numeric stat (4,200+, $2M, ZERO) and credibility line. Best for retargeting and trust-building.',
    'urgency': '## Concept 6 — Urgency\n\nRed panel offer-strip variants with booking-urgency headlines. Use when calendar is filling up or for limited-time campaigns.',
    'repair': '## Concept 7 — Equipment repair\n\nTargets other contractors, hobby farmers, and small outfits with downed iron. Pain point is dealer rates + dealer wait times. Best run as a separate ad set with its own audience.',
  };

  const lines: string[] = [
    '# Facebook Ad Creative Catalog',
    '',
    `Generated ${new Date().toISOString().slice(0, 10)}. ${ads.length} creatives across 4 concepts.`,
    '',
    '## How to use',
    '',
    '1. In Meta Ads Manager, create a **Leads** campaign optimized for the `Lead` event from your pixel.',
    '2. At the ad-set level, create one ad set per concept (so FB can learn what each concept does).',
    '3. Upload 2–4 creatives per ad set. FB will auto-rotate and find winners.',
    '4. Copy the suggested **Primary Text**, **Headline**, and **CTA** for each ad below.',
    '5. Link destination: your site\'s `#lead-form` anchor — e.g. `https://yoursite.com/#lead-form`.',
    '',
    '## Sizes',
    '',
    '- `1024x1024` (1:1) → Feed, In-Stream, Marketplace, Right Column',
    '- `1024x1536` (≈2:3) → Stories, Reels (FB will pad to 9:16 on placement)',
    '',
    '---',
    '',
  ];

  for (const concept of ['before-after', 'offer-strip', 'question-hook', 'reclaim', 'stat-badge', 'urgency', 'repair']) {
    const list = byConcept.get(concept);
    if (!list || list.length === 0) continue;
    lines.push(conceptHeader[concept] ?? `## ${concept}`);
    lines.push('');
    for (const ad of list) {
      lines.push(`### \`${ad.id}\` · ${ad.format} · ${ad.size}`);
      lines.push('');
      lines.push(`![${ad.id}](./${ad.id}.png)`);
      lines.push('');
      lines.push(`- **Headline:** ${ad.copy.headline}`);
      lines.push(`- **Primary text:** ${ad.copy.primaryText}`);
      lines.push(`- **CTA button:** ${ad.copy.cta}`);
      if (ad.notes) lines.push(`- **Notes:** ${ad.notes}`);
      lines.push('');
    }
    lines.push('---');
    lines.push('');
  }

  await writeFile(join(OUT_DIR, 'INDEX.md'), lines.join('\n'));
}

async function main() {
  if (!DRY_RUN && !API_KEY) {
    console.error('ERROR: OPENAI_API_KEY is not set. Add it to .env or pass --dry-run.');
    process.exit(1);
  }
  await mkdir(OUT_DIR, { recursive: true });

  const filtered = AD_CREATIVES.filter(passesFilters);

  // Pre-flight: decide which jobs will actually run.
  const toRun: AdCreative[] = [];
  let skipped = 0;
  for (const ad of filtered) {
    const outPath = join(OUT_DIR, `${ad.id}.png`);
    const already = await exists(outPath);
    if (already && !FORCE) {
      console.log(`  ✔  ${ad.id}.png  (exists, skipping)`);
      skipped++;
      continue;
    }
    if (DRY_RUN) {
      console.log(`  ·  ${ad.id}.png  [${ad.size}]  ${ad.concept}/${ad.format}  would generate`);
      continue;
    }
    toRun.push(ad);
  }

  console.log('');
  console.log(`Ad generation`);
  console.log(`  model:       ${client.getActiveModel()}`);
  console.log(`  out:         ${OUT_DIR}`);
  console.log(`  to generate: ${toRun.length}  (${skipped} already exist, ${AD_CREATIVES.length} total, ${filtered.length} after filters)`);
  console.log(`  concurrency: ${CONCURRENCY}`);
  console.log(`  mode:        ${DRY_RUN ? 'DRY RUN' : FORCE ? 'FORCE OVERWRITE' : 'skip existing'}`);
  if (CONCEPT_FILTER) console.log(`  --concept:   ${CONCEPT_FILTER}`);
  if (FORMAT_FILTER)  console.log(`  --format:    ${FORMAT_FILTER}`);
  console.log('');

  if (DRY_RUN) {
    console.log(`Done. (dry run)`);
    return;
  }

  let done = 0, failed = 0;
  const total = toRun.length;
  const startedAt = Date.now();

  if (total > 0) {
    await runPool(toRun, CONCURRENCY, async (ad) => {
      const outPath = join(OUT_DIR, `${ad.id}.png`);
      const t0 = Date.now();
      console.log(`  …  ${ad.id}.png  (starting)`);
      try {
        const buf = await client.generate({ id: ad.id, prompt: ad.prompt, size: ad.size });
        await writeFile(outPath, buf);
        done++;
        const dt = ((Date.now() - t0) / 1000).toFixed(1);
        console.log(`  ✔  ${ad.id}.png  (${(buf.length / 1024).toFixed(0)} KB, ${dt}s)  [${done + failed}/${total}]`);
      } catch (err) {
        failed++;
        console.log(`  ✗  ${ad.id}.png  ${(err as Error).message}  [${done + failed}/${total}]`);
      }
    });
  }

  // Always refresh the catalog (so existing-skipped ads still get indexed).
  if (!NO_INDEX) {
    await writeIndex(filtered);
    console.log(`  ✎  INDEX.md  written`);
  }

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log('');
  console.log(`Done in ${elapsed}s.  generated=${done}  skipped=${skipped}  failed=${failed}`);
  if (failed > 0) process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
