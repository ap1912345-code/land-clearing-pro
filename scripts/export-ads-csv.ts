#!/usr/bin/env tsx
/**
 * Exports every ad in src/data/ads.ts to ads/ads.csv.
 * Columns include both human-readable fields (Image File, Concept, Notes) and
 * the Meta-recognized field names (Title, Body, Description, Call to Action
 * Type) so the same file can be used as a working reference OR pasted into
 * Meta's bulk-import template.
 *
 * Usage:
 *   npm run export:ads-csv
 *   npx tsx scripts/export-ads-csv.ts --url https://yoursite.com/#lead-form
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { AD_CREATIVES, type AdCopy } from '../src/data/ads.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const OUT_PATH = join(PROJECT_ROOT, 'ads', 'ads.csv');

const args = process.argv.slice(2);
const urlIdx = args.indexOf('--url');
const DESTINATION_URL = urlIdx >= 0 ? args[urlIdx + 1] : 'https://YOUR-DOMAIN.com/#lead-form';

// Meta's enum values for the Call to Action Type column in bulk import.
const CTA_TO_META: Record<AdCopy['cta'], string> = {
  'Get Quote':    'GET_QUOTE',
  'Learn More':   'LEARN_MORE',
  'Call Now':     'CALL_NOW',
  'Get Offer':    'GET_OFFER',
  'Sign Up':      'SIGN_UP',
  'Contact Us':   'CONTACT_US',
};

function csvCell(s: unknown): string {
  const v = String(s ?? '');
  // Always quote — keeps Excel/Sheets happy with our line breaks in Body field.
  return `"${v.replace(/"/g, '""')}"`;
}

function row(cells: unknown[]): string {
  return cells.map(csvCell).join(',');
}

async function main() {
  await mkdir(dirname(OUT_PATH), { recursive: true });

  const headers = [
    // Practical reference columns (Meta ignores these on import)
    'Ad Name',
    'Concept',
    'Format',
    'Image File',
    'Image Size',
    // Meta bulk-import columns (case matters if you reuse for import)
    'Body',                  // Primary text
    'Title',                 // Headline (max 40 chars)
    'Link Description',      // Description below headline
    'Call to Action Type',   // Meta enum
    'CTA Button (display)',  // human-readable equivalent
    'Link',                  // destination URL
    'Notes',
  ];

  const rows: string[] = [row(headers)];

  for (const ad of AD_CREATIVES) {
    rows.push(row([
      ad.id,
      ad.concept,
      ad.format,
      `${ad.id}.png`,
      ad.size,
      ad.copy.primaryText,
      ad.copy.headline,
      ad.copy.cta === 'Get Quote'
        ? 'Free on-site quote — same week start'
        : 'Family-owned · Insured · Central Mass',
      CTA_TO_META[ad.copy.cta],
      ad.copy.cta,
      DESTINATION_URL,
      ad.notes ?? '',
    ]));
  }

  await writeFile(OUT_PATH, rows.join('\n') + '\n', 'utf8');
  console.log(`✔  Wrote ${AD_CREATIVES.length} ads to ${OUT_PATH}`);
  console.log(`   Destination URL: ${DESTINATION_URL}`);
  console.log('');
  console.log('Re-run with --url to set a different destination:');
  console.log('   npx tsx scripts/export-ads-csv.ts --url https://prentiss-services.com/#lead-form');
}

main().catch(err => { console.error(err); process.exit(1); });
