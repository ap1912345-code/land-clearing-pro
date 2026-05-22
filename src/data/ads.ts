// Manifest for static Facebook ad creatives. Read by scripts/generate-ads.ts.
//
// Design system (kept consistent across the ad set so the brand reads at a glance):
//   - Brand green panel:    #2d4220 (forest-green text background)
//   - Brand ember badge:    #e0651b (orange CTA badge)
//   - Yellow CTA badge:     #facc15 (high-contrast tap-cue)
//   - White headline text:  bold condensed sans-serif, all caps
//   - Trust strip:          "★★★★★  INSURED · LOCAL · 17 YEARS"
//
// AI-text best practices baked into every prompt:
//   - Headlines 3–5 words, ALL CAPS, no apostrophes (those are where AI text-rendering fails)
//   - Text always lives on a solid colored panel (not over a noisy photo) for crisp rendering
//   - Each text element is explicitly quoted and positioned
//   - Only 2–3 text elements per ad (headline + badge + small trust strip)
//
// Geography: Central Massachusetts / Hubbardston area — mixed hardwood + white pine woods,
// glacial granite boulders, weathered fieldstone walls, overgrown old hayfields.

import type { ImageSize } from '../../scripts/_image-api.ts';

export type AdCopy = {
  headline: string;
  primaryText: string;
  cta: 'Get Quote' | 'Learn More' | 'Call Now' | 'Get Offer' | 'Sign Up' | 'Contact Us';
};

export type AdCreative = {
  id: string;
  concept: 'offer-strip' | 'before-after' | 'question-hook' | 'stat-badge' | 'urgency' | 'reclaim' | 'repair' | 'multi-service';
  format: 'feed' | 'story';
  size: ImageSize;
  prompt: string;
  copy: AdCopy;
  notes?: string;
};

// ── Shared style fragments ────────────────────────────────────────────
const TEXT_RULES =
  'All text must be perfectly spelled, crisp, sharp-edged, no artifacts, no double letters, no extra characters, no garbled glyphs. ' +
  'Use a single bold condensed sans-serif typeface throughout (Oswald or Bebas style). ' +
  'No logos, no watermarks, no other graphic elements beyond what is described.';

const TRUST_STRIP =
  `A slim horizontal strip across the very top of the image (about 6% of total height) with a solid black background. ` +
  `Centered on the strip in small white bold sans-serif all-caps: the exact text "★★★★★  INSURED · LOCAL · 17 YEARS". ` +
  `Five gold star characters at the left of that text. The strip spans full width.`;

// Helper for the most common template: photo on top, color band on bottom with headline + CTA badge.
function offerStrip({
  photoDesc,
  panelColor,
  headline1,
  headline2,
  ctaText,
  ctaColor,
}: {
  photoDesc: string;
  panelColor: string;
  headline1: string;
  headline2: string;
  ctaText: string;
  ctaColor: 'yellow' | 'orange';
}) {
  const ctaHex = ctaColor === 'yellow' ? '#facc15' : '#e0651b';
  const ctaTextColor = ctaColor === 'yellow' ? 'black' : 'white';
  return `Direct-response Facebook ad design. Square layout divided into TWO zones plus a top trust strip.

${TRUST_STRIP}

TOP PHOTO ZONE — occupies roughly the top 60% of the image, immediately below the trust strip:
${photoDesc}

BOTTOM TEXT PANEL — occupies the bottom ~40% of the image. A solid flat color panel of hex ${panelColor} (no gradient, no texture). On this panel, render exactly these text elements:
  • HEADLINE LINE 1: the exact text "${headline1}" in large bold condensed white sans-serif all-caps, left-aligned with generous left padding (~6% of width), positioned in the upper third of the panel.
  • HEADLINE LINE 2: the exact text "${headline2}" in the same style as line 1, slightly larger if needed, immediately below line 1.
  • CTA BADGE: a rounded-corner rectangle in the bottom-right of the panel (with 6% padding from edges), color ${ctaHex}. Inside the badge in bold sans-serif all-caps ${ctaTextColor} text: the exact text "${ctaText}".

${TEXT_RULES}`;
}

function offerStripStory({
  photoDesc,
  panelColor,
  headline1,
  headline2,
  ctaText,
  ctaColor,
}: {
  photoDesc: string;
  panelColor: string;
  headline1: string;
  headline2: string;
  ctaText: string;
  ctaColor: 'yellow' | 'orange';
}) {
  const ctaHex = ctaColor === 'yellow' ? '#facc15' : '#e0651b';
  const ctaTextColor = ctaColor === 'yellow' ? 'black' : 'white';
  return `Direct-response Facebook story ad. Vertical layout (taller than wide) with three zones.

${TRUST_STRIP}

PHOTO ZONE — occupies the middle ~55% of the image, below the trust strip:
${photoDesc}

BOTTOM TEXT PANEL — occupies the bottom ~40%. Solid flat color panel of hex ${panelColor} (no gradient). On this panel render exactly:
  • HEADLINE LINE 1: the exact text "${headline1}" in large bold condensed white sans-serif all-caps, centered horizontally, in the upper third of the panel.
  • HEADLINE LINE 2: the exact text "${headline2}" same style as line 1, centered, just below line 1.
  • CTA BADGE: a wide rounded-corner rectangle centered at the bottom of the panel, color ${ctaHex}. Inside in bold sans-serif all-caps ${ctaTextColor} text: the exact text "${ctaText}".

${TEXT_RULES}`;
}

// Region-specific photo descriptors used across many prompts.
const PHOTO = {
  mulcherAction:
    'A photorealistic action shot of a forestry mulcher head tearing through dense overgrown brush and invasive vines (multiflora rose, autumn olive, bittersweet) in a Central Massachusetts woodland, wood chips spraying in mid-air, hard afternoon light through tall white pines, dust haze.',
  mulcherActionStory:
    'A vertical photorealistic action shot of a forestry mulcher tearing through dense overgrown brush in a New England woodland, wood chips spraying upward, hard afternoon light through tall pines.',
  stumpGrinder:
    'A photorealistic shot of a self-propelled stump grinder mid-cut on a large hardwood stump in a New England backyard with a low fieldstone wall behind, fresh chips fanning out, sharp focus on the grinding wheel.',
  boulderLift:
    'A photorealistic shot of a tracked excavator with a hydraulic rock grapple lifting a refrigerator-sized lichen-flecked glacial granite boulder out of a cleared pad in a Central Massachusetts woodland. Dust in the air, dramatic side light.',
  drivewayCut:
    'A photorealistic shot of a freshly cut and graded gravel driveway curving back into a wooded Central Massachusetts property at midday, culvert installed, mature hardwoods and pines on either side.',
  buildReady:
    'A sweeping wide photorealistic shot of a finished cleared homesite in a Central Massachusetts woodland at golden hour, gently graded soil, mature sugar maples and white pines preserved at the edges, no stumps, no debris.',
  pondGolden:
    'A photorealistic shot of a newly dug New England ranch pond at golden hour, clean banked edges, water just beginning to fill, sky reflected, mature hardwoods on the far bank.',
  fieldRestored:
    'A wide pastoral photorealistic shot of a freshly reclaimed old Massachusetts hayfield at sunrise, clean open ground rolling toward a distant tree line and a low fieldstone wall, dew on the grass.',
  equipmentYard:
    'A photorealistic shot of a clean equipment yard at sunrise — tracked loaders, an excavator, and a rack of attachments on gravel, surrounded by mature New England woods.',
  truckTrailer:
    'A photorealistic wide shot of a heavy-duty pickup truck towing a flatbed trailer loaded with a tracked loader at sunrise on a rural Central Massachusetts road, mist drifting through the trees.',
  treeRemoval:
    'A photorealistic shot of a crane-assisted tree removal, a large hardwood limb being lowered on rigging ropes near a residential property in a wooded New England setting, morning light.',
  cleanExcavator:
    'A photorealistic three-quarter view of a clean mid-size tracked excavator parked on a freshly cleared pad in a Central Massachusetts woodland at late afternoon, bucket resting on the ground.',
  overgrownProperty:
    'A photorealistic wide shot of a long-abandoned Central Massachusetts property, a small clapboard house barely visible behind a wall of invasive brush, rusted yard equipment in the foreground choked by multiflora rose and bittersweet vine.',
  overgrownField:
    'A photorealistic wide shot of an old Central Massachusetts hayfield long overrun by saplings, brush, and tangled invasive vines, a weathered fieldstone wall snaking through the middle, a forgotten apple tree poking up out of the chaos.',
  twoMachine:
    'A photorealistic two-machine action shot — a forestry mulcher in the foreground and an excavator in the mid-ground working in tandem on a clearing job in a Central Massachusetts woodland.',
  stumpyard:
    'A photorealistic shot of a New England yard with multiple large hardwood stumps scattered across the grass, slightly tilted dramatic angle.',
  homeBuildReady:
    'A photorealistic sweeping wide shot of an aspirational finished cleared homesite in a Central Massachusetts woodland at golden hour with mature trees preserved at the edges.',
  // Equipment repair photos
  repairShop:
    'A photorealistic shot of a clean rural Central Massachusetts equipment repair shop interior with a tracked excavator on jack stands mid-service, a mechanic in coveralls working on the undercarriage, organized tool walls, overhead bay lights, big roll-up door behind.',
  repairBench:
    'A photorealistic close-up shot of a hydraulic pump being rebuilt on a shop bench, parts laid out in a clean orderly array, mechanics hands and tools in frame, shop fluorescent light.',
  mobileService:
    'A photorealistic shot of an unmarked service truck parked next to a downed mid-size excavator on a rural Central Massachusetts job site, a mechanic in coveralls with a toolbox and pressure-gauge set diagnosing a hydraulic leak, woods in the background.',
  downedMachine:
    'A photorealistic moody late-afternoon shot of a tracked excavator sitting still and unused on a Central Massachusetts job site, hydraulic fluid pooling underneath, lights off, abandoned at the end of a workday, broken work day implied.',
  oldIron:
    'A photorealistic dignified shot of a well-worn but rebuildable older tractor or compact loader parked in a Central Massachusetts equipment shop, faded paint but solid bones, sunlight through a high shop window picking out the dust.',
};

// ──────────────────────────────────────────────────────────────────────
export const AD_CREATIVES: AdCreative[] = [
  // ── CONCEPT: OFFER STRIP (12 ads) ─────────────────────────────────
  {
    id: 'offer-brush-gone',
    concept: 'offer-strip',
    format: 'feed',
    size: '1024x1024',
    prompt: offerStrip({
      photoDesc: PHOTO.mulcherAction,
      panelColor: '#2d4220',
      headline1: 'ACRES OF BRUSH',
      headline2: 'GONE IN A DAY',
      ctaText: 'FREE QUOTE →',
      ctaColor: 'yellow',
    }),
    copy: {
      headline: 'Acres of brush, gone in a day',
      primaryText: 'Forestry mulching clears 1–2 acres of heavy brush a day. No burning, no piles, no hauling fees. Free on-site quote.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'offer-brush-gone-story',
    concept: 'offer-strip',
    format: 'story',
    size: '1024x1536',
    prompt: offerStripStory({
      photoDesc: PHOTO.mulcherActionStory,
      panelColor: '#2d4220',
      headline1: 'ACRES OF BRUSH',
      headline2: 'GONE IN A DAY',
      ctaText: 'FREE QUOTE →',
      ctaColor: 'yellow',
    }),
    copy: {
      headline: 'Acres of brush, gone in a day',
      primaryText: 'Forestry mulching. Same-week start.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'offer-stumps-below-grade',
    concept: 'offer-strip',
    format: 'feed',
    size: '1024x1024',
    prompt: offerStrip({
      photoDesc: PHOTO.stumpGrinder,
      panelColor: '#2d4220',
      headline1: 'EVERY STUMP',
      headline2: 'BELOW GRADE',
      ctaText: 'FREE QUOTE →',
      ctaColor: 'yellow',
    }),
    copy: {
      headline: 'Every stump, ground below grade',
      primaryText: 'We grind every stump 8–12" below grade and backfill with topsoil. One stump or fifty.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'offer-boulder-gone',
    concept: 'offer-strip',
    format: 'feed',
    size: '1024x1024',
    prompt: offerStrip({
      photoDesc: PHOTO.boulderLift,
      panelColor: '#2d4220',
      headline1: 'ROCK WONT BUDGE',
      headline2: 'WE MOVE IT',
      ctaText: 'FREE QUOTE →',
      ctaColor: 'yellow',
    }),
    copy: {
      headline: 'Buried rock? We move it',
      primaryText: 'Hydraulic breakers and 20-ton excavators for glacial boulders and buried stone. Stockpile for walls or haul off.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'offer-driveway-friday',
    concept: 'offer-strip',
    format: 'feed',
    size: '1024x1024',
    prompt: offerStrip({
      photoDesc: PHOTO.drivewayCut,
      panelColor: '#2d4220',
      headline1: 'NO DRIVEWAY',
      headline2: 'NEW ONE BY FRIDAY',
      ctaText: 'FREE QUOTE →',
      ctaColor: 'yellow',
    }),
    copy: {
      headline: 'No access? Driveway by Friday',
      primaryText: 'Driveways cut, graded, gravel-based, culvert included. Same-week start on most jobs.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'offer-buildready',
    concept: 'offer-strip',
    format: 'feed',
    size: '1024x1024',
    prompt: offerStrip({
      photoDesc: PHOTO.buildReady,
      panelColor: '#2d4220',
      headline1: 'WILD LAND',
      headline2: 'BUILD READY',
      ctaText: 'FREE QUOTE →',
      ctaColor: 'yellow',
    }),
    copy: {
      headline: 'Wild land, build-ready',
      primaryText: 'Clear, mulch, grade, drain. One crew, one invoice, one timeline.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'offer-pond-this-month',
    concept: 'offer-strip',
    format: 'feed',
    size: '1024x1024',
    prompt: offerStrip({
      photoDesc: PHOTO.pondGolden,
      panelColor: '#2d4220',
      headline1: 'YOUR POND',
      headline2: 'DUG THIS MONTH',
      ctaText: 'FREE QUOTE →',
      ctaColor: 'yellow',
    }),
    copy: {
      headline: 'Your pond, dug this month',
      primaryText: 'Ponds 1/4 acre to 5+ acres. We dig, shape, and bank — done before the rain.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'offer-field-restored',
    concept: 'offer-strip',
    format: 'feed',
    size: '1024x1024',
    prompt: offerStrip({
      photoDesc: PHOTO.fieldRestored,
      panelColor: '#2d4220',
      headline1: 'OVERGROWN FIELD',
      headline2: 'OPEN GROUND AGAIN',
      ctaText: 'FREE QUOTE →',
      ctaColor: 'yellow',
    }),
    copy: {
      headline: 'Overgrown field, restored',
      primaryText: 'Clear brush, pick rock, reseed. We restore overgrown New England fields to working ground.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'offer-one-crew',
    concept: 'offer-strip',
    format: 'feed',
    size: '1024x1024',
    prompt: offerStrip({
      photoDesc: PHOTO.equipmentYard,
      panelColor: '#2d4220',
      headline1: 'ONE CALL',
      headline2: 'ONE CREW · DONE',
      ctaText: 'FREE QUOTE →',
      ctaColor: 'orange',
    }),
    copy: {
      headline: 'One call, one crew, done',
      primaryText: 'We own the equipment. No subcontractors. Jobs start on time and finish on the day we said.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'offer-free-onsite',
    concept: 'offer-strip',
    format: 'feed',
    size: '1024x1024',
    prompt: offerStrip({
      photoDesc: PHOTO.truckTrailer,
      panelColor: '#2d4220',
      headline1: 'FREE ON SITE',
      headline2: 'QUOTE TODAY',
      ctaText: 'TAP TO BOOK →',
      ctaColor: 'orange',
    }),
    copy: {
      headline: 'Free on-site quote — today',
      primaryText: 'We walk every acre, mark what stays, and price the job in writing. No high-pressure pitch.',
      cta: 'Get Offer',
    },
  },
  {
    id: 'offer-tree-removal',
    concept: 'offer-strip',
    format: 'feed',
    size: '1024x1024',
    prompt: offerStrip({
      photoDesc: PHOTO.treeRemoval,
      panelColor: '#2d4220',
      headline1: 'BIG TREE',
      headline2: 'TIGHT SPACE · GONE',
      ctaText: 'FREE QUOTE →',
      ctaColor: 'yellow',
    }),
    copy: {
      headline: 'Big tree, tight space, gone',
      primaryText: 'Crane-assisted removals over roofs and tight yards. Fully insured.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'offer-licensed-insured',
    concept: 'offer-strip',
    format: 'feed',
    size: '1024x1024',
    prompt: offerStrip({
      photoDesc: PHOTO.cleanExcavator,
      panelColor: '#2d4220',
      headline1: 'LICENSED · INSURED',
      headline2: 'LOCAL · 17 YEARS',
      ctaText: 'FREE QUOTE →',
      ctaColor: 'orange',
    }),
    copy: {
      headline: 'Licensed. Insured. Local.',
      primaryText: 'Family-owned, fully insured, serving Central Massachusetts for 17 years.',
      cta: 'Learn More',
    },
  },

  // ── CONCEPT: BEFORE/AFTER STACKED LABELS (5 ads) ──────────────────
  {
    id: 'ba-brush-stack',
    concept: 'before-after',
    format: 'feed',
    size: '1024x1024',
    prompt: `Direct-response Facebook ad design, before/after split. Square image divided into two equal stacked photos with a clean white horizontal dividing line.

${TRUST_STRIP}

TOP HALF photo: A wild Central Massachusetts wooded hillside completely choked with dense overgrown brush, multiflora rose, autumn olive, and bittersweet vines smothering young saplings, no visibility. In the top-left corner, a solid red rectangle (hex #c2521a) about 18% wide and 8% tall, containing the exact text "BEFORE" in white bold condensed sans-serif all-caps.

BOTTOM HALF photo: The exact same hillside, same camera angle and lighting, fully cleared and finish-graded into a clean building pad with preserved sugar maples and white pines at the edges. In the top-left corner of this half, a solid green rectangle (hex #4a6c2c) about 18% wide and 8% tall, containing the exact text "AFTER" in white bold condensed sans-serif all-caps.

CENTERED across the dividing line, a solid black pill-shaped badge containing the exact text "BRUSH · CLEARED · 2 DAYS" in white bold sans-serif all-caps.

${TEXT_RULES}`,
    copy: {
      headline: 'Wild brush to build-ready in 2 days',
      primaryText: 'Real Central Mass property. Before-and-after on the same hillside. Tap to see what we can do for yours.',
      cta: 'Get Quote',
    },
    notes: 'Strongest converter historically. Lead with this ad.',
  },
  {
    id: 'ba-stumps-stack',
    concept: 'before-after',
    format: 'feed',
    size: '1024x1024',
    prompt: `Direct-response Facebook ad design, before/after split. Square image divided into two equal stacked photos with a clean white horizontal dividing line.

${TRUST_STRIP}

TOP HALF photo: A New England residential backyard with six large hardwood stumps of varying sizes dotting an otherwise grassy lawn, fieldstone wall in the background, soft overcast daylight. In the top-left corner, a solid red rectangle (hex #c2521a) about 18% wide and 8% tall, containing the exact text "BEFORE" in white bold condensed sans-serif all-caps.

BOTTOM HALF photo: The exact same backyard, same composition, every stump fully ground out and backfilled with topsoil, ready for sod. Same fieldstone wall, same overcast daylight. In the top-left corner, a solid green rectangle (hex #4a6c2c) containing the exact text "AFTER" in white bold condensed sans-serif all-caps.

CENTERED across the dividing line, a solid black pill-shaped badge containing the exact text "STUMPS · GONE · 1 DAY" in white bold sans-serif all-caps.

${TEXT_RULES}`,
    copy: {
      headline: 'Stumps ground out in one day',
      primaryText: 'Every stump 8–12" below grade, backfilled with topsoil. Ready for sod or seed.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'ba-rocky-stack',
    concept: 'before-after',
    format: 'feed',
    size: '1024x1024',
    prompt: `Direct-response Facebook ad design, before/after split. Square image divided into two equal stacked photos with a clean white horizontal dividing line.

${TRUST_STRIP}

TOP HALF photo: An old Central Massachusetts hayfield littered with dozens of glacial granite boulders and rocks, weathered fieldstone wall along the back, dry grass, unusable. Top-left corner: solid red rectangle (hex #c2521a) with the exact text "BEFORE" in white bold condensed sans-serif all-caps.

BOTTOM HALF photo: The exact same field, same camera position and lighting, cleared of all surface rock and lightly groomed, visibly usable open ground. Same fieldstone wall visible. Top-left corner: solid green rectangle (hex #4a6c2c) with the exact text "AFTER" in white bold condensed sans-serif all-caps.

CENTERED across the dividing line, a solid black pill-shaped badge containing the exact text "ROCK · PICKED · 3 DAYS" in white bold sans-serif all-caps.

${TEXT_RULES}`,
    copy: {
      headline: 'From rock pile to real field',
      primaryText: 'Rock-picking by the acre. Pasture, food plots, building pads — usable ground.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'ba-driveway-stack',
    concept: 'before-after',
    format: 'feed',
    size: '1024x1024',
    prompt: `Direct-response Facebook ad design, before/after split. Square image divided into two equal stacked photos with a clean white horizontal dividing line.

${TRUST_STRIP}

TOP HALF photo: Looking from a quiet country road into a Central Massachusetts wooded property, a solid wall of mixed hardwood and white pine with no driveway, no opening, overgrown brush at the base. Top-left corner: solid red rectangle (hex #c2521a) with the exact text "BEFORE" in white bold condensed sans-serif all-caps.

BOTTOM HALF photo: The exact same vantage, now with a cleanly cut and graded gravel driveway curving back into the trees, culvert installed. Top-left corner: solid green rectangle (hex #4a6c2c) with the exact text "AFTER" in white bold condensed sans-serif all-caps.

CENTERED across the dividing line, a solid black pill-shaped badge containing the exact text "DRIVEWAY · CUT · 4 DAYS" in white bold sans-serif all-caps.

${TEXT_RULES}`,
    copy: {
      headline: 'Driveway through the woods in 4 days',
      primaryText: 'Cut, graded, gravel-based, culvert installed. Drive on it by the weekend.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'ba-yard-edge-stack',
    concept: 'before-after',
    format: 'feed',
    size: '1024x1024',
    prompt: `Direct-response Facebook ad design, before/after split. Square image divided into two equal stacked photos with a clean white horizontal dividing line.

${TRUST_STRIP}

TOP HALF photo: A Central Massachusetts backyard where invasive brush (multiflora rose, autumn olive, bittersweet vine) has eaten 30 feet into the lawn from the property edge, ragged uneven line, overgrown shrubs swallowing lawn furniture and an old swing set. Top-left corner: solid red rectangle (hex #c2521a) about 18% wide and 8% tall, containing the exact text "BEFORE" in white bold condensed sans-serif all-caps.

BOTTOM HALF photo: The exact same backyard, same camera angle and lighting, with the property line pushed cleanly back to its original boundary — open lawn, clean wood line, lawn furniture visible again. Top-left corner: solid green rectangle (hex #4a6c2c) containing the exact text "AFTER" in white bold condensed sans-serif all-caps.

CENTERED across the dividing line, a solid black pill-shaped badge containing the exact text "YARD · RECLAIMED · 1 DAY" in white bold sans-serif all-caps.

${TEXT_RULES}`,
    copy: {
      headline: 'Get your yard back from the woods',
      primaryText: 'Invasive brush eats yards back 3–5 feet a year. We push the line back and keep it back.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'ba-stone-wall-stack',
    concept: 'before-after',
    format: 'feed',
    size: '1024x1024',
    prompt: `Direct-response Facebook ad design, before/after split. Square image divided into two equal stacked photos with a clean white horizontal dividing line.

${TRUST_STRIP}

TOP HALF photo: A wooded section of Central Massachusetts property where dense overgrown brush, vines, and saplings completely hide an old weathered fieldstone wall — only a single stone or two peek through the green chaos. Top-left corner: solid red rectangle (hex #c2521a) with the exact text "BEFORE" in white bold condensed sans-serif all-caps.

BOTTOM HALF photo: The exact same section of property, same camera angle and lighting, brush cleared away to reveal a beautiful weathered fieldstone wall stretching off into the woods, lichen on the stones, late-afternoon golden light. Top-left corner: solid green rectangle (hex #4a6c2c) with the exact text "AFTER" in white bold condensed sans-serif all-caps.

CENTERED across the dividing line, a solid black pill-shaped badge containing the exact text "WALL · UNCOVERED · 2 DAYS" in white bold sans-serif all-caps.

${TEXT_RULES}`,
    copy: {
      headline: 'Find the stone walls under your brush',
      primaryText: 'New England land has stories under the green. We uncover the walls, fields, and acreage hiding on your property.',
      cta: 'Get Quote',
    },
    notes: 'Heritage angle — very strong for rural Worcester County landowners.',
  },
  {
    id: 'ba-pasture-stack',
    concept: 'before-after',
    format: 'feed',
    size: '1024x1024',
    prompt: `Direct-response Facebook ad design, before/after split. Square image divided into two equal stacked photos with a clean white horizontal dividing line.

${TRUST_STRIP}

TOP HALF photo: An old Central Massachusetts pasture completely lost under saplings, dense brush, and tangled invasive vines, a low fieldstone wall barely visible snaking through the middle, looking abandoned. Top-left corner: solid red rectangle (hex #c2521a) with the exact text "BEFORE" in white bold condensed sans-serif all-caps.

BOTTOM HALF photo: The exact same pasture, same angle and lighting, fully restored to clean open ground, the fieldstone wall newly visible along its full length, rolling open grass ready for hay or grazing. Top-left corner: solid green rectangle (hex #4a6c2c) with the exact text "AFTER" in white bold condensed sans-serif all-caps.

CENTERED across the dividing line, a solid black pill-shaped badge containing the exact text "PASTURE · RESTORED · 1 WEEK" in white bold sans-serif all-caps.

${TEXT_RULES}`,
    copy: {
      headline: 'Old pasture, working ground again',
      primaryText: 'Lost hayfields and pasture restored to usable open ground. Clear brush, pick rock, reseed.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'ba-canopy-stack',
    concept: 'before-after',
    format: 'feed',
    size: '1024x1024',
    prompt: `Direct-response Facebook ad design, before/after split. Square image divided into two equal stacked photos with a clean white horizontal dividing line.

${TRUST_STRIP}

TOP HALF photo: A New England clapboard house dwarfed and partially obscured by an overgrown tangle of mature trees and brush pressing in from all sides — branches over the roof, vegetation crowding the foundation, dark and closed in. Top-left corner: solid red rectangle (hex #c2521a) with the exact text "BEFORE" in white bold condensed sans-serif all-caps.

BOTTOM HALF photo: The exact same house, same camera angle, with surrounding trees thinned, dangerous branches cleared, brush pushed back from the foundation — the house now visible, with light reaching the yard, a healthy sugar maple still kept at the side. Top-left corner: solid green rectangle (hex #4a6c2c) with the exact text "AFTER" in white bold condensed sans-serif all-caps.

CENTERED across the dividing line, a solid black pill-shaped badge containing the exact text "CANOPY · OPENED · 1 DAY" in white bold sans-serif all-caps.

${TEXT_RULES}`,
    copy: {
      headline: 'See your house again',
      primaryText: 'Selective tree work and brush clearing around homes. We keep what you love, clear what crowds you.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'ba-side-by-side-brush',
    concept: 'before-after',
    format: 'feed',
    size: '1024x1024',
    prompt: `Direct-response Facebook ad design, before/after split. Square image divided into two equal vertical photos with a clean white vertical dividing line down the middle.

${TRUST_STRIP}

LEFT HALF photo: A wild Central Massachusetts wooded hillside completely choked with dense overgrown brush, multiflora rose, autumn olive, and bittersweet vines, no visibility. Top-left corner of this half: solid red rectangle (hex #c2521a) about 25% wide and 10% tall containing the exact text "BEFORE" in white bold condensed sans-serif all-caps.

RIGHT HALF photo: The exact same hillside, same camera angle and lighting, fully cleared into a clean building pad with preserved sugar maples and white pines at the edges. Top-left corner of this half: solid green rectangle (hex #4a6c2c) about 25% wide and 10% tall containing the exact text "AFTER" in white bold condensed sans-serif all-caps.

BOTTOM ZONE (slim strip across the very bottom, ~10% tall): A solid forest-green panel (hex #2d4220) containing centered the exact text "WILD LAND TO BUILD READY · 2 DAYS" in white bold sans-serif all-caps.

${TEXT_RULES}`,
    copy: {
      headline: 'Wild to build-ready, side by side',
      primaryText: 'Same hillside. Two photos. Two days apart.',
      cta: 'Get Quote',
    },
    notes: 'Side-by-side variation for visual variety alongside the stacked B/A ads.',
  },
  {
    id: 'ba-brush-stack-story',
    concept: 'before-after',
    format: 'story',
    size: '1024x1536',
    prompt: `Direct-response Facebook story ad, vertical before/after split. Image divided into two equal stacked photos with a clean white horizontal dividing line in the middle.

${TRUST_STRIP}

TOP HALF photo (fills the upper middle portion): A wild Central Massachusetts wooded hillside choked with dense overgrown brush and invasive vines. Top-left corner of this photo: solid red rectangle (hex #c2521a) with the exact text "BEFORE" in white bold condensed sans-serif all-caps.

BOTTOM HALF photo (fills the lower middle portion): The same hillside, fully cleared and graded with preserved sugar maples and pines at the edges. Top-left corner: solid green rectangle (hex #4a6c2c) with the exact text "AFTER" in white bold condensed sans-serif all-caps.

BOTTOM ZONE (lower ~12% of image): A solid forest-green panel (hex #2d4220) containing centered text: line 1 "WILD LAND TO BUILD READY" in large bold white sans-serif all-caps, and immediately below a yellow pill badge (hex #facc15) containing the exact text "TAP FOR FREE QUOTE" in black bold sans-serif all-caps.

${TEXT_RULES}`,
    copy: {
      headline: 'Wild land to build-ready',
      primaryText: 'Real before/after on a Central Mass property.',
      cta: 'Get Quote',
    },
  },

  // ── CONCEPT: QUESTION HOOK (5 ads) ────────────────────────────────
  {
    id: 'hook-drowning-brush',
    concept: 'question-hook',
    format: 'feed',
    size: '1024x1024',
    prompt: `Direct-response Facebook ad. Square image with a high-impact question overlay design.

PHOTO BACKGROUND (entire image): A photorealistic wide shot of an overgrown Central Massachusetts property choked with dense brush, multiflora rose, autumn olive, and bittersweet vines, the brush nearly reaching the camera. The image is heavily darkened by a strong dark overlay (~60% opacity black) to make text pop. Cinematic, moody.

${TRUST_STRIP}

HEADLINE (centered vertically and horizontally, occupying the middle third of the image): The exact text "DROWNING" on the first line and "IN BRUSH?" on the second line, in massive bold condensed white sans-serif all-caps. Each line is its own line, perfectly centered. The text has a slight subtle drop shadow for readability.

CTA BADGE (bottom-center, with ~8% padding from the bottom edge): A bright yellow pill-shaped rounded rectangle (hex #facc15) containing the exact text "TAP FOR FREE QUOTE" in bold black sans-serif all-caps.

${TEXT_RULES}`,
    copy: {
      headline: 'Drowning in brush?',
      primaryText: 'Forestry mulching clears 1–2 acres a day. No burn permits, no piles, no hauling. Free on-site quote.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'hook-stumps-winning',
    concept: 'question-hook',
    format: 'feed',
    size: '1024x1024',
    prompt: `Direct-response Facebook ad. Square image with a high-impact question overlay design.

PHOTO BACKGROUND (entire image): ${PHOTO.stumpyard} Heavily darkened by a strong dark overlay (~60% opacity black) so text pops.

${TRUST_STRIP}

HEADLINE (centered vertically and horizontally, middle third of image): The exact text "TIRED OF" on the first line and "MOWING AROUND" on the second line and "STUMPS?" on the third line, in massive bold condensed white sans-serif all-caps. Each line centered, with a subtle drop shadow.

CTA BADGE (bottom-center, ~8% padding from bottom): A bright yellow pill-shaped rounded rectangle (hex #facc15) with the exact text "GRIND THEM OUT →" in bold black sans-serif all-caps.

${TEXT_RULES}`,
    copy: {
      headline: 'Tired of mowing around stumps?',
      primaryText: 'We grind every stump 8–12" below grade and backfill. Sod-ready in a day.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'hook-cant-find-land',
    concept: 'question-hook',
    format: 'feed',
    size: '1024x1024',
    prompt: `Direct-response Facebook ad. Square image with a high-impact question overlay design.

PHOTO BACKGROUND (entire image): ${PHOTO.overgrownProperty} Heavily darkened by a strong dark overlay (~55% opacity black) so text pops.

${TRUST_STRIP}

HEADLINE (centered vertically, middle third of image): The exact text "CANT FIND" on the first line and "YOUR OWN LAND?" on the second line, in massive bold condensed white sans-serif all-caps. Each line centered, subtle drop shadow.

CTA BADGE (bottom-center, ~8% padding from bottom): A bright yellow pill-shaped rounded rectangle (hex #facc15) with the exact text "TAKE IT BACK →" in bold black sans-serif all-caps.

${TEXT_RULES}`,
    copy: {
      headline: 'Cant find your own land?',
      primaryText: 'Forestry mulching, tree removal, brush hauling. We clear what you cant. Free on-site quote.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'hook-ready-to-build',
    concept: 'question-hook',
    format: 'feed',
    size: '1024x1024',
    prompt: `Direct-response Facebook ad. Square image with a high-impact question overlay design.

PHOTO BACKGROUND (entire image): ${PHOTO.homeBuildReady} A medium dark overlay (~40% opacity black) so the warm light still glows but text is readable.

${TRUST_STRIP}

HEADLINE (centered vertically, middle third of image): The exact text "READY TO BUILD?" on the first line and "WERE READY TO CLEAR." on the second line, in massive bold condensed white sans-serif all-caps. Each line centered, subtle drop shadow.

CTA BADGE (bottom-center, ~8% padding from bottom): A bright yellow pill-shaped rounded rectangle (hex #facc15) with the exact text "BOOK MY QUOTE →" in bold black sans-serif all-caps.

${TEXT_RULES}`,
    copy: {
      headline: 'Ready to build?',
      primaryText: 'Pads, driveways, drainage — done before your foundation crew shows up.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'hook-need-it-fast-story',
    concept: 'question-hook',
    format: 'story',
    size: '1024x1536',
    prompt: `Direct-response Facebook story ad. Vertical image with a high-impact question overlay design.

PHOTO BACKGROUND (entire image): A vertical version of ${PHOTO.twoMachine} Darkened by a strong dark overlay (~55% opacity black) so text pops.

${TRUST_STRIP}

HEADLINE (centered vertically, middle third of image): The exact text "NEED IT" on the first line and "GONE FAST?" on the second line, in massive bold condensed white sans-serif all-caps. Each line centered, subtle drop shadow.

CTA BADGE (bottom-center, ~10% padding from bottom): A wide bright yellow pill-shaped rounded rectangle (hex #facc15) with the exact text "SAME WEEK START →" in bold black sans-serif all-caps.

${TEXT_RULES}`,
    copy: {
      headline: 'Need it gone fast?',
      primaryText: 'Same-week start on most jobs. Free on-site quote.',
      cta: 'Get Quote',
    },
  },

  // ── CONCEPT: STAT BADGE (4 ads) ───────────────────────────────────
  {
    id: 'stat-acres-cleared',
    concept: 'stat-badge',
    format: 'feed',
    size: '1024x1024',
    prompt: `Direct-response Facebook ad. Square image, photo background with a massive stat overlay.

PHOTO BACKGROUND (entire image): ${PHOTO.equipmentYard} Lightly darkened (~30% opacity black) so the photo still reads but text pops.

${TRUST_STRIP}

BIG STAT BLOCK (centered, occupies the middle 50% of the image): A large vertical stack of text:
  • Line 1 (huge): the exact text "4,200+" in MASSIVE bold condensed white sans-serif (the biggest text on the image, almost half the width of the frame).
  • Line 2 (smaller, under line 1): the exact text "ACRES CLEARED" in bold condensed white sans-serif all-caps.
  • Line 3 (smaller still, under line 2): the exact text "ACROSS CENTRAL MASS" in regular sans-serif all-caps.

CTA BADGE (bottom-center, ~6% padding from bottom): A bright orange pill-shaped rounded rectangle (hex #e0651b) with the exact text "BOOK A FREE QUOTE →" in bold white sans-serif all-caps.

${TEXT_RULES}`,
    copy: {
      headline: '4,200+ acres cleared',
      primaryText: '17 years. 4,200+ acres across Central Mass. Same crew owns the equipment, runs it, and fixes it.',
      cta: 'Learn More',
    },
  },
  {
    id: 'stat-five-star',
    concept: 'stat-badge',
    format: 'feed',
    size: '1024x1024',
    prompt: `Direct-response Facebook ad. Square image, photo background with a big stat/review overlay.

PHOTO BACKGROUND (entire image): A photorealistic late-day shot of a heavy-duty work truck with an equipment trailer parked at the edge of a Central Massachusetts job site, mature New England woods behind. Lightly darkened (~30% opacity black).

${TRUST_STRIP}

CENTER OVERLAY (occupies the middle 50% of the image, vertically stacked):
  • Top line: five large gold star characters "★★★★★" rendered side by side, centered, roughly 40% of image width.
  • Middle (large): the exact text "500+ JOBS" in massive bold condensed white sans-serif all-caps.
  • Below middle (smaller): the exact text "SAME CREW · LOCAL · INSURED" in bold sans-serif all-caps white.

CTA BADGE (bottom-center, ~6% padding from bottom): A bright yellow pill-shaped rounded rectangle (hex #facc15) with the exact text "BOOK A FREE QUOTE →" in bold black sans-serif all-caps.

${TEXT_RULES}`,
    copy: {
      headline: 'Five stars, 500+ jobs',
      primaryText: 'No subcontractors. Same crew shows up. Same crew finishes.',
      cta: 'Learn More',
    },
  },
  {
    id: 'stat-2m-insured',
    concept: 'stat-badge',
    format: 'feed',
    size: '1024x1024',
    prompt: `Direct-response Facebook ad. Square image, photo background with a massive stat overlay.

PHOTO BACKGROUND (entire image): ${PHOTO.cleanExcavator} Lightly darkened (~30% opacity black).

${TRUST_STRIP}

BIG STAT BLOCK (centered, middle 50% of image, vertical stack):
  • Line 1 (massive): the exact text "$2M" in HUGE bold condensed white sans-serif (biggest text on the image).
  • Line 2 (smaller): the exact text "GENERAL LIABILITY" in bold condensed white sans-serif all-caps.
  • Line 3 (smaller still): the exact text "WORKERS COMP · LICENSED" in regular sans-serif all-caps white.

CTA BADGE (bottom-center): A bright orange pill (hex #e0651b) with the exact text "FREE QUOTE →" in bold white sans-serif all-caps.

${TEXT_RULES}`,
    copy: {
      headline: '$2M insured. Workers comp. Licensed.',
      primaryText: 'Big jobs need real coverage. Were the crew you want on your property.',
      cta: 'Learn More',
    },
  },
  {
    id: 'stat-no-subs',
    concept: 'stat-badge',
    format: 'feed',
    size: '1024x1024',
    prompt: `Direct-response Facebook ad. Square image, photo background with a big stat overlay.

PHOTO BACKGROUND (entire image): ${PHOTO.twoMachine} Lightly darkened (~30% opacity black).

${TRUST_STRIP}

BIG STAT BLOCK (centered, middle 50% of image, vertical stack):
  • Line 1 (massive): the exact text "ZERO" in HUGE bold condensed white sans-serif.
  • Line 2 (smaller but still very large): the exact text "SUBCONTRACTORS" in bold condensed white sans-serif all-caps.
  • Line 3 (smaller): the exact text "OUR CREW · OUR IRON · OUR JOB" in regular sans-serif all-caps white.

CTA BADGE (bottom-center): A bright yellow pill (hex #facc15) with the exact text "GET MY QUOTE →" in bold black sans-serif all-caps.

${TEXT_RULES}`,
    copy: {
      headline: 'Zero subcontractors',
      primaryText: 'We own the equipment, run the equipment, and fix the equipment. Thats why our jobs finish on the day we said they would.',
      cta: 'Get Quote',
    },
  },

  // ── CONCEPT: URGENCY (3 ads) ──────────────────────────────────────
  {
    id: 'urgency-booking-fast',
    concept: 'urgency',
    format: 'feed',
    size: '1024x1024',
    prompt: offerStrip({
      photoDesc: PHOTO.equipmentYard,
      panelColor: '#c2521a',
      headline1: 'BOOKING FAST',
      headline2: 'SAME WEEK START',
      ctaText: 'TAP TO BOOK →',
      ctaColor: 'yellow',
    }),
    copy: {
      headline: 'Booking fast. Same-week start.',
      primaryText: 'Our calendar fills weeks ahead in spring. Get your free quote today and lock a date.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'urgency-spring-rush',
    concept: 'urgency',
    format: 'feed',
    size: '1024x1024',
    prompt: offerStrip({
      photoDesc: PHOTO.mulcherAction,
      panelColor: '#c2521a',
      headline1: 'SPRING RUSH IS HERE',
      headline2: 'LOCK YOUR DATE',
      ctaText: 'FREE QUOTE →',
      ctaColor: 'yellow',
    }),
    copy: {
      headline: 'Spring rush is here',
      primaryText: 'Clearing dates booked 3–4 weeks out. Quote now to hold a slot.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'urgency-60-seconds',
    concept: 'urgency',
    format: 'feed',
    size: '1024x1024',
    prompt: offerStrip({
      photoDesc:
        'A photorealistic shot of an operator walking a Central Massachusetts property with a clipboard, mid-stride, mature hardwoods in the background, late-morning light.',
      panelColor: '#2d4220',
      headline1: 'FREE QUOTE',
      headline2: 'IN 60 SECONDS',
      ctaText: 'TAP TO START →',
      ctaColor: 'yellow',
    }),
    copy: {
      headline: 'Free quote in 60 seconds',
      primaryText: 'Tell us about your property. Well text or call back same business day.',
      cta: 'Get Offer',
    },
  },

  // ── CONCEPT: RECLAIM OVERGROWTH (5 ads — NEW) ─────────────────────
  // For overgrown old fields, lost yards, abandoned pasture, brush-eaten property edges.
  // The emotional hook: "your land had a purpose; let's give it back to you."
  {
    id: 'reclaim-take-back-field',
    concept: 'reclaim',
    format: 'feed',
    size: '1024x1024',
    prompt: offerStrip({
      photoDesc: PHOTO.overgrownField,
      panelColor: '#2d4220',
      headline1: 'TAKE BACK',
      headline2: 'YOUR OLD FIELD',
      ctaText: 'FREE QUOTE →',
      ctaColor: 'yellow',
    }),
    copy: {
      headline: 'Take back your old field',
      primaryText: 'That hayfield that grew over? We clear the brush, pick the rock, and hand it back open. Free on-site quote.',
      cta: 'Get Quote',
    },
    notes: 'Targets landowners with old farmland that has gone fallow. Strong for rural Worcester County.',
  },
  {
    id: 'reclaim-where-did-go',
    concept: 'reclaim',
    format: 'feed',
    size: '1024x1024',
    prompt: `Direct-response Facebook ad. Square image, dramatic question overlay design.

PHOTO BACKGROUND (entire image): ${PHOTO.overgrownField} Heavily darkened by a strong dark overlay (~55% opacity black) so text pops.

${TRUST_STRIP}

HEADLINE (centered vertically and horizontally, middle third of image): The exact text "WHERE DID" on the first line and "YOUR FIELD GO?" on the second line, in massive bold condensed white sans-serif all-caps. Each line centered, subtle drop shadow.

SUBHEAD (just below the headline, smaller): the exact text "WE WILL HELP YOU FIND IT" in regular sans-serif all-caps white.

CTA BADGE (bottom-center, ~8% padding from bottom): A bright yellow pill-shaped rounded rectangle (hex #facc15) with the exact text "RECLAIM IT →" in bold black sans-serif all-caps.

${TEXT_RULES}`,
    copy: {
      headline: 'Where did your field go?',
      primaryText: 'Old hayfields, pastures, and yard edges lost to brush. We give them back to you. Free on-site quote.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'reclaim-yard-eaten',
    concept: 'reclaim',
    format: 'feed',
    size: '1024x1024',
    prompt: offerStrip({
      photoDesc:
        'A photorealistic shot of a Central Massachusetts backyard where invasive multiflora rose and bittersweet vines have eaten 30 feet into the lawn from the property edge, swallowing an old swing set and lawn furniture, late afternoon light.',
      panelColor: '#2d4220',
      headline1: 'YARD EATEN',
      headline2: 'BY THE WOODS?',
      ctaText: 'WE FIX IT →',
      ctaColor: 'yellow',
    }),
    copy: {
      headline: 'Yard eaten by the woods?',
      primaryText: 'Invasive brush eats yards back 3–5 feet a year. We push the line back and keep it back.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'reclaim-buy-back-acres',
    concept: 'reclaim',
    format: 'feed',
    size: '1024x1024',
    prompt: `Direct-response Facebook ad design. Square image, before/after split with reclaim messaging.

${TRUST_STRIP}

TOP HALF photo: An old Central Massachusetts pasture completely lost under saplings, brush, and invasive vines, a forgotten stone wall snaking through the chaos, a single forgotten apple tree visible. Top-left corner: solid red rectangle (hex #c2521a) about 18% wide and 8% tall containing the exact text "LOST" in white bold condensed sans-serif all-caps.

BOTTOM HALF photo: The same field, same angle, fully restored to open pasture, the fieldstone wall newly visible along its full length, the old apple tree alone in the middle of clear ground. Top-left corner: solid green rectangle (hex #4a6c2c) containing the exact text "FOUND" in white bold condensed sans-serif all-caps.

CENTERED across the dividing line, a solid black pill-shaped badge containing the exact text "ACRES · RECLAIMED · 1 WEEK" in white bold sans-serif all-caps.

${TEXT_RULES}`,
    copy: {
      headline: 'Acres you forgot you owned',
      primaryText: 'That patch beyond the brush line? Its still yours. Let us give it back to you. Free on-site quote.',
      cta: 'Get Quote',
    },
  },
  // ── CONCEPT: EQUIPMENT REPAIR (6 ads) ─────────────────────────────
  // Targets other contractors, farmers, homesteaders, and small outfits with downed iron.
  // Pain point: dealer rates + dealer wait times. We do hydraulic, drivetrain, engine on most makes.
  {
    id: 'repair-equipment-down',
    concept: 'repair',
    format: 'feed',
    size: '1024x1024',
    prompt: offerStrip({
      photoDesc: PHOTO.downedMachine,
      panelColor: '#2d4220',
      headline1: 'EQUIPMENT DOWN',
      headline2: 'GET IT MOVING',
      ctaText: 'BOOK REPAIR →',
      ctaColor: 'yellow',
    }),
    copy: {
      headline: 'Equipment down? Get it moving.',
      primaryText: 'Hydraulic, drivetrain, engine work on most makes. Same-week diagnosis. We come to you or you come to us.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'repair-hydraulics-drivetrain',
    concept: 'repair',
    format: 'feed',
    size: '1024x1024',
    prompt: offerStrip({
      photoDesc: PHOTO.repairShop,
      panelColor: '#2d4220',
      headline1: 'HYDRAULICS · DRIVETRAIN',
      headline2: 'ENGINE WORK',
      ctaText: 'FREE QUOTE →',
      ctaColor: 'yellow',
    }),
    copy: {
      headline: 'Hydraulics. Drivetrain. Engine.',
      primaryText: 'Full mechanical service on excavators, skid steers, tractors, and attachments. Most makes, most models.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'repair-mobile-service',
    concept: 'repair',
    format: 'feed',
    size: '1024x1024',
    prompt: offerStrip({
      photoDesc: PHOTO.mobileService,
      panelColor: '#2d4220',
      headline1: 'MOBILE SERVICE',
      headline2: 'ON YOUR JOB SITE',
      ctaText: 'CALL NOW →',
      ctaColor: 'orange',
    }),
    copy: {
      headline: 'Mobile service. On your site.',
      primaryText: 'No need to haul a broken machine. We diagnose and repair on-site across Central Mass.',
      cta: 'Call Now',
    },
  },
  {
    id: 'repair-dealer-rates',
    concept: 'repair',
    format: 'feed',
    size: '1024x1024',
    prompt: `Direct-response Facebook ad. Square image, dramatic question overlay design.

PHOTO BACKGROUND (entire image): ${PHOTO.downedMachine} Heavily darkened by a strong dark overlay (~55% opacity black) so text pops.

${TRUST_STRIP}

HEADLINE (centered vertically and horizontally, middle third of image): The exact text "WAITING ON" on the first line and "THE DEALER?" on the second line, in massive bold condensed white sans-serif all-caps. Each line centered, subtle drop shadow.

SUBHEAD (just below the headline, smaller): the exact text "WE FIX IT FASTER · FAIR PRICE" in regular sans-serif all-caps white.

CTA BADGE (bottom-center, ~8% padding from bottom): A bright yellow pill-shaped rounded rectangle (hex #facc15) with the exact text "BOOK REPAIR →" in bold black sans-serif all-caps.

${TEXT_RULES}`,
    copy: {
      headline: 'Waiting on the dealer?',
      primaryText: 'Same-week diagnosis. Honest pricing. No dealer markup on parts or labor.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'repair-old-iron',
    concept: 'repair',
    format: 'feed',
    size: '1024x1024',
    prompt: offerStrip({
      photoDesc: PHOTO.oldIron,
      panelColor: '#2d4220',
      headline1: 'OLD IRON',
      headline2: 'NEW MILES',
      ctaText: 'FREE QUOTE →',
      ctaColor: 'yellow',
    }),
    copy: {
      headline: 'Old iron, new miles',
      primaryText: 'That older loader has years left. We rebuild hydraulics, replace bushings, and bring tired machines back.',
      cta: 'Get Quote',
    },
    notes: 'Heritage/value angle. Targets owners reluctant to replace beloved older equipment.',
  },
  {
    id: 'repair-same-week-diag',
    concept: 'repair',
    format: 'feed',
    size: '1024x1024',
    prompt: `Direct-response Facebook ad. Square image, photo background with a massive stat overlay.

PHOTO BACKGROUND (entire image): ${PHOTO.repairBench} Lightly darkened (~30% opacity black).

${TRUST_STRIP}

BIG STAT BLOCK (centered, middle 50% of image, vertical stack):
  • Line 1 (massive): the exact text "SAME WEEK" in HUGE bold condensed white sans-serif (biggest text on the image).
  • Line 2 (smaller): the exact text "DIAGNOSIS" in bold condensed white sans-serif all-caps.
  • Line 3 (smaller still): the exact text "HYDRAULIC · DRIVETRAIN · ENGINE" in regular sans-serif all-caps white.

CTA BADGE (bottom-center, ~6% padding from bottom): A bright orange pill (hex #e0651b) with the exact text "BOOK A SLOT →" in bold white sans-serif all-caps.

${TEXT_RULES}`,
    copy: {
      headline: 'Same-week diagnosis on most makes',
      primaryText: 'Excavators, skid steers, tractors, attachments. Most repairs back in your hands within the week.',
      cta: 'Get Quote',
    },
  },
  {
    id: 'reclaim-stone-wall',
    concept: 'reclaim',
    format: 'feed',
    size: '1024x1024',
    prompt: offerStrip({
      photoDesc:
        'A photorealistic shot of a newly cleared swath of land in Central Massachusetts revealing a beautiful weathered fieldstone wall that had been completely hidden by overgrown brush for decades. Late-afternoon golden light hitting the lichen on the stones, the wall stretching off into the woods.',
      panelColor: '#2d4220',
      headline1: 'FIND YOUR',
      headline2: 'STONE WALLS AGAIN',
      ctaText: 'FREE QUOTE →',
      ctaColor: 'yellow',
    }),
    copy: {
      headline: 'Find your stone walls again',
      primaryText: 'New England land has stories under the brush. We uncover the walls, fields, and acreage hiding on your property.',
      cta: 'Get Quote',
    },
    notes: 'Emotional/heritage angle — great for rural MA landowners who appreciate New England character.',
  },
];
