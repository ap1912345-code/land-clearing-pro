export type Service = {
  slug: string;
  title: string;
  short: string;        // one-line hook
  body: string;         // 1–2 sentence body
  bullets: string[];    // 3–4 quick-scan bullets
  imageId: string;      // matches SiteImage.id
};

export const SERVICES: Service[] = [
  {
    slug: 'tree-removal',
    title: 'Tree Removal',
    short: 'Hazardous, oversized, or in-the-way — we take them down clean.',
    body:
      'From a single dying hardwood over your roofline to dozens of trees blocking a build site, ' +
      'we drop, section, and haul with full insurance and zero damage to what you want kept.',
    bullets: [
      'Crane-assisted removals in tight spaces',
      'Storm-damage and emergency response',
      'Selective clearing — we keep what you love',
      'Debris hauled off or chipped on-site',
    ],
    imageId: 'service-tree-removal',
  },
  {
    slug: 'dense-brush',
    title: 'Dense Brush & Mulching',
    short: 'Acres of cedar and yaupon turned to mulch in a single day.',
    body:
      'Forestry mulching is the fastest, lowest-impact way to clear thick underbrush. ' +
      'The brush stays on site as nutrient mulch — no piles, no burns, no hauling fees.',
    bullets: [
      'Up to 2 acres per day in heavy brush',
      'No burn permits, no smoke',
      'Keeps soil in place — no erosion',
      'Selective: we work around mature trees',
    ],
    imageId: 'service-brush',
  },
  {
    slug: 'stump-grinding',
    title: 'Stump Grinding',
    short: 'Below grade, backfilled, and ready for sod or build.',
    body:
      'We grind every stump 8–12" below grade, mix the chips back in, and leave a clean ' +
      'fill-ready surface. One stump or fifty — same crew, same equipment.',
    bullets: [
      'Stumps up to 60" diameter',
      'Backfill with topsoil available',
      'Surface roots traced and ground out',
      'Same-week scheduling on most jobs',
    ],
    imageId: 'service-stump-grinding',
  },
  {
    slug: 'boulder-removal',
    title: 'Boulder & Large Rock Removal',
    short: 'From basketball-sized to backhoe-sized — we move it.',
    body:
      'Rock grapples, hydraulic breakers, and 20-ton excavators. We pull, break, and stockpile ' +
      'or haul off rock that\'s been blocking your build or pasture for decades.',
    bullets: [
      'Hydraulic rock breakers for buried rock',
      'On-site stockpiling for retaining-wall use',
      'Full haul-off available',
      'Pasture rock-picking by the acre',
    ],
    imageId: 'service-boulder',
  },
  {
    slug: 'excavation',
    title: 'Excavation',
    short: 'Pads, ponds, trenches, and driveways — dug right the first time.',
    body:
      'Building pads, septic, ponds, utility trenches, and driveway cuts. ' +
      'We laser-grade to spec, manage spoils, and coordinate with your concrete and septic crews.',
    bullets: [
      'House pads, shop pads, RV pads',
      'Ponds 1/4 acre to 5+ acres',
      'Utility trenching with safe spoils handling',
      'Driveway cuts with culvert install',
    ],
    imageId: 'service-excavation',
  },
  {
    slug: 'land-reforming',
    title: 'Land Reforming & Grading',
    short: 'Reshape the land — drainage, slopes, and build-ready surfaces.',
    body:
      'Finish grading, drainage swales, terracing, fill placement, and rough-to-finish reshaping. ' +
      'We make raw acreage usable and we make problem lots drain.',
    bullets: [
      'Positive-drainage finish grade',
      'Swales, berms, and terracing',
      'Imported fill placement and compaction',
      'Erosion-control measures included',
    ],
    imageId: 'service-land-reforming',
  },
  {
    slug: 'equipment',
    title: 'Equipment Rental, Repair & Sales',
    short: 'Operate it yourself — or let us fix the one you have.',
    body:
      'Daily, weekly, and monthly rentals on tracked loaders, excavators, and attachments. ' +
      'Full mechanical service on most makes. Quality used machines for sale.',
    bullets: [
      'Skid-steers, excavators, mulchers, grapples',
      'Delivery available within our service area',
      'Hydraulic, drivetrain, and engine repair',
      'Inspected, serviced used equipment for sale',
    ],
    imageId: 'service-equipment',
  },
];
