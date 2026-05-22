#!/usr/bin/env tsx
/**
 * Converts every PNG in public/images/ to optimized WebP and (by default) deletes
 * the source PNG. WebP is ~96% browser-supported and typically 60-85% smaller
 * than PNG for photographic content with no visible quality loss at q≥80.
 *
 * Usage:
 *   npm run optimize:images                    # convert all, delete source PNGs
 *   npm run optimize:images -- --keep-png      # keep PNGs alongside WebPs
 *   npm run optimize:images -- --dry-run       # report savings, change nothing
 *   npm run optimize:images -- --quality 88    # tune WebP quality 0-100 (default 82)
 *
 * The site code references .webp paths; rerun this after `npm run generate:images`.
 */
import { readdir, stat, unlink } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const IMAGES_DIR = join(PROJECT_ROOT, 'public', 'images');

const args = process.argv.slice(2);
const DRY_RUN  = args.includes('--dry-run');
const KEEP_PNG = args.includes('--keep-png');
const qIdx = args.indexOf('--quality');
const QUALITY = Math.max(0, Math.min(100, Number((qIdx >= 0 ? args[qIdx + 1] : undefined) ?? 82)));
const EFFORT = 6; // sharp WebP effort 0–6. 6 = slowest encode, smallest file.

type Result = { file: string; before: number; after: number };

async function optimize(file: string): Promise<Result> {
  const pngPath  = join(IMAGES_DIR, file);
  const webpPath = pngPath.replace(/\.png$/i, '.webp');

  const pngSize = (await stat(pngPath)).size;

  if (DRY_RUN) {
    console.log(`  ·  ${file}  ${(pngSize / 1024).toFixed(0)} KB  (would convert)`);
    return { file, before: pngSize, after: 0 };
  }

  await sharp(pngPath)
    .webp({ quality: QUALITY, effort: EFFORT, smartSubsample: true })
    .toFile(webpPath);

  const webpSize = (await stat(webpPath)).size;
  const pct = ((1 - webpSize / pngSize) * 100).toFixed(0);

  if (!KEEP_PNG) await unlink(pngPath);

  console.log(`  ✔  ${file.padEnd(36)} ${String((pngSize / 1024).toFixed(0)).padStart(5)} KB → ${String((webpSize / 1024).toFixed(0)).padStart(5)} KB  (-${pct}%)`);
  return { file, before: pngSize, after: webpSize };
}

async function main() {
  const all = await readdir(IMAGES_DIR);
  const pngs = all.filter(f => /\.png$/i.test(f)).sort();

  console.log(`Image optimization`);
  console.log(`  dir:     ${IMAGES_DIR}`);
  console.log(`  pngs:    ${pngs.length}`);
  console.log(`  quality: ${QUALITY}  effort: ${EFFORT}`);
  console.log(`  mode:    ${DRY_RUN ? 'DRY RUN' : KEEP_PNG ? 'KEEP PNGs alongside WebPs' : 'DELETE source PNGs'}`);
  console.log('');

  if (pngs.length === 0) {
    console.log('No PNGs to optimize. Run `npm run generate:images` first.');
    return;
  }

  const results: Result[] = [];
  for (const f of pngs) results.push(await optimize(f));

  const totalBefore = results.reduce((s, r) => s + r.before, 0);
  const totalAfter  = results.reduce((s, r) => s + r.after, 0);
  const totalPct = totalBefore > 0 ? ((1 - totalAfter / totalBefore) * 100).toFixed(0) : '0';

  console.log('');
  console.log(`Total: ${(totalBefore / 1024 / 1024).toFixed(1)} MB → ${(totalAfter / 1024 / 1024).toFixed(1)} MB  (-${totalPct}%)`);
}

main().catch(err => { console.error(err); process.exit(1); });
