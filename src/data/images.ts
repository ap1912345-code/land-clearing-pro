// Single source of truth for every image the site uses.
// The generator script reads this; the site imports it for paths + alt text.

export type SiteImage = {
  id: string;            // filename stem; final file is `${id}.png`
  alt: string;           // accessibility + SEO
  prompt: string;        // sent to the image model
  size?: '1024x1024' | '1536x1024' | '1024x1536';
  group?: string;        // grouping tag, e.g. 'hero', 'service', 'gallery'
};

export type BeforeAfter = {
  id: string;            // shared stem; files are `${id}-before.png` / `${id}-after.png`
  label: string;
  // The BEFORE image is generated fresh from `before.prompt`.
  // The AFTER image is produced by sending the BEFORE bytes back to OpenAI's
  // /v1/images/edits endpoint with `after.editPrompt` as the instruction.
  // This keeps camera angle, lighting, sky, and surrounding trees locked between
  // the two images, so it actually looks like the same property over time.
  before: { alt: string; prompt: string };
  after:  { alt: string; editPrompt: string };
  size?: '1024x1024' | '1536x1024' | '1024x1536';
};

const PHOTO_STYLE =
  'Photorealistic, shot on a full-frame DSLR with a 35mm lens, natural daylight, ' +
  'crisp detail, deep depth of field, no text, no watermarks, no logos, no people facing camera. ' +
  'Documentary photojournalism style, not stock-photo glossy.';

// Region-specific descriptors used across prompts (Central Massachusetts / Hubbardston area).
const REGION =
  'Central Massachusetts / Worcester County rural setting: mixed hardwood and white pine forest, ' +
  'stone walls of weathered fieldstone, glacial granite boulders with lichen, mature sugar maples and oaks, ' +
  'pockets of overgrown invasive brush (multiflora rose, autumn olive, bittersweet vines), ' +
  'rolling wooded New England terrain, damp leaf litter on the ground.';

export const SITE_IMAGES: SiteImage[] = [
  // ---------- HERO ----------
  {
    id: 'hero-main',
    group: 'hero',
    size: '1536x1024',
    alt: 'Heavy-duty forestry mulcher clearing dense brush on a wooded Central Massachusetts property at golden hour',
    prompt:
      `Wide cinematic shot of a tracked compact loader with a forestry mulcher head ` +
      `tearing through dense overgrown brush (multiflora rose, autumn olive, scrub) on a rolling wooded New England hillside. ` +
      `Cloud of wood chips in mid-air, churned damp earth in the foreground, mature sugar maples and white pines standing in the background, ` +
      `a low fieldstone wall visible at the edge of the frame. Late-afternoon golden light raking through the trees, long shadows, dust haze. ` +
      `${REGION} ${PHOTO_STYLE}`,
  },
  {
    id: 'hero-mobile',
    group: 'hero',
    size: '1024x1536',
    alt: 'Mulcher operator clearing brush in a New England forest, vertical hero crop',
    prompt:
      `Vertical composition: tracked skid-steer with mulcher attachment grinding heavy brush in a Central Massachusetts woodland, ` +
      `wood debris flying, late-afternoon light. Strong vertical lines from standing white pines and mature oaks on the right edge, ` +
      `a weathered fieldstone wall in the lower foreground. ${PHOTO_STYLE}`,
  },

  // ---------- SERVICES (1 image each) ----------
  {
    id: 'service-tree-removal',
    group: 'service',
    size: '1024x1024',
    alt: 'Climber roping down a large oak limb with crane support',
    prompt:
      `A certified arborist mid-removal high in a mature New England oak, rigging a heavy lateral limb on ropes. ` +
      `A small crane is positioned in the yard below. Clean residential property in a wooded Central Massachusetts setting, ` +
      `clapboard house partially visible, morning light. ${PHOTO_STYLE}`,
  },
  {
    id: 'service-brush',
    group: 'service',
    size: '1024x1024',
    alt: 'Forestry mulcher chewing through dense overgrown brush in New England woods',
    prompt:
      `Close-mid shot of a forestry mulcher drum biting into a thick wall of overgrown brush and invasive vines ` +
      `(multiflora rose, autumn olive, bittersweet) in a Central Massachusetts woodland, chips spraying outward. ` +
      `Sunlight breaking through the dust. Rugged tracks visible at frame bottom, mature hardwoods in the deep background. ` +
      `${PHOTO_STYLE}`,
  },
  {
    id: 'service-stump-grinding',
    group: 'service',
    size: '1024x1024',
    alt: 'Self-propelled stump grinder reducing a large hardwood stump to chips',
    prompt:
      `Powerful self-propelled stump grinder mid-cut on a 30-inch hardwood stump, ` +
      `fresh chips piled around the base, operator at the controls in PPE (helmet, face shield, hearing protection). ` +
      `New England backyard with a low fieldstone wall in the background, dappled afternoon light through maples. ` +
      `${PHOTO_STYLE}`,
  },
  {
    id: 'service-boulder',
    group: 'service',
    size: '1024x1024',
    alt: 'Excavator lifting a massive glacial granite boulder with a rock grapple',
    prompt:
      `A large tracked excavator with a hydraulic rock grapple lifting a refrigerator-sized glacial granite boulder, ` +
      `mossy and lichen-flecked, out of a cleared pad in a Central Massachusetts woodland. ` +
      `Pile of similarly sized granite boulders staged to the side. Dust in the air, hard noon sunlight filtering through tall pines. ` +
      `${PHOTO_STYLE}`,
  },
  {
    id: 'service-excavation',
    group: 'service',
    size: '1024x1024',
    alt: 'Excavator digging a foundation pad with neat spoils pile in a New England woodland',
    prompt:
      `Mid-size tracked excavator carving a clean rectangular building pad into a wooded New England hillside, ` +
      `bucket full of dark brown rocky soil mid-swing, spoil pile neatly staged. Survey stakes with pink ribbon visible, ` +
      `mature white pines and sugar maples framing the lot. ${PHOTO_STYLE}`,
  },
  {
    id: 'service-land-reforming',
    group: 'service',
    size: '1024x1024',
    alt: 'Bulldozer finish-grading a freshly cleared homesite in central Massachusetts',
    prompt:
      `A bulldozer in finish-grading pass across a freshly cleared homesite in Central Massachusetts, ` +
      `smooth fan of soil behind the blade, gently rolling contours, fresh tracks. ` +
      `Surrounding tree line of mixed hardwoods preserved. Evening light, soft warm tones. ${PHOTO_STYLE}`,
  },
  {
    id: 'service-equipment',
    group: 'service',
    size: '1024x1024',
    alt: 'Lineup of compact loaders, excavators and attachments on a gravel yard',
    prompt:
      `A clean equipment yard at a rural Central Massachusetts shop: a row of three tracked compact loaders, ` +
      `a mid-size excavator, and a rack of attachments (mulcher head, grapple, bucket, auger). ` +
      `Gravel apron, metal shop building behind, surrounded by mature New England woods, crisp morning light. ${PHOTO_STYLE}`,
  },

  // ---------- EQUIPMENT DETAIL ----------
  {
    id: 'equipment-mulcher',
    group: 'equipment',
    size: '1536x1024',
    alt: 'Detail of a forestry mulcher head with carbide teeth',
    prompt:
      `Close-up detail of a forestry mulcher drum with carbide teeth, mounted to a compact track loader, ` +
      `metal worn shiny from use, wood pulp caked in the housing. Shop lighting, slightly low angle, hero-product feel. ` +
      `${PHOTO_STYLE}`,
  },
  {
    id: 'equipment-excavator',
    group: 'equipment',
    size: '1536x1024',
    alt: 'Mid-size tracked excavator parked on a cleared site',
    prompt:
      `Three-quarter view of a clean mid-size tracked excavator parked on a freshly cleared pad in a Central Massachusetts woodland, ` +
      `bucket resting on the ground, late-afternoon light, wooded ridge of mixed hardwoods in the distant background. ${PHOTO_STYLE}`,
  },

  // ---------- PROCESS ICONS / STEP IMAGES ----------
  {
    id: 'process-walk',
    group: 'process',
    size: '1024x1024',
    alt: 'Crew lead walking a property with a clipboard while pointing out brush lines',
    prompt:
      `A crew lead in work clothes and a cap walking a rural Massachusetts property line with a clipboard, ` +
      `gesturing toward a stand of overgrown pines and brush. Truck visible in background, low fieldstone wall along the property edge. ` +
      `Friendly, professional, mid-morning light. ${PHOTO_STYLE}`,
  },
  {
    id: 'process-crew',
    group: 'process',
    size: '1024x1024',
    alt: 'Two-machine crew working in tandem on a clearing job',
    prompt:
      `Two pieces of equipment working together on a clearing job in a Central Massachusetts woodland: ` +
      `a mulcher knocking down brush in foreground, an excavator stacking debris in the mid-ground. ` +
      `Coordinated, busy, productive feel. ${PHOTO_STYLE}`,
  },
  {
    id: 'process-finish',
    group: 'process',
    size: '1024x1024',
    alt: 'Finished cleared homesite with neatly graded soil',
    prompt:
      `A finished cleared building pad in a Central Massachusetts woodland: cleanly graded soil, no stumps, no debris, gentle slope, ` +
      `surrounding tree line of mixed hardwoods and white pines preserved. Late-day light, satisfying "after" feel. ${PHOTO_STYLE}`,
  },

  // ---------- TRUST / TEAM ----------
  {
    id: 'trust-truck',
    group: 'trust',
    size: '1536x1024',
    alt: 'Heavy-duty work truck with equipment trailer at a job site',
    prompt:
      `A heavy-duty pickup truck towing a flatbed equipment trailer loaded with a tracked loader, ` +
      `parked at the edge of a rural Central Massachusetts job site. Unmarked truck (no logos). ` +
      `Early morning, mist drifting through the trees, a stone wall along the dirt road. ${PHOTO_STYLE}`,
  },
  {
    id: 'trust-handshake',
    group: 'trust',
    size: '1024x1024',
    alt: 'Operator shaking hands with a property owner on a cleared lot',
    prompt:
      `An operator in work clothes shaking hands with a property owner on a freshly cleared New England lot. ` +
      `Both seen from the side, faces partly turned away. Warm late-day light, trust and completion feel. ${PHOTO_STYLE}`,
  },
];

// Edit prompts are instructions applied to the BEFORE image — they tell the
// model what to change, while preserving everything else. Phrasing pattern:
//   "Edit this image so that ... Preserve ... exactly. Keep the same camera angle,
//    sky, lighting, and surrounding trees."
export const BEFORE_AFTER: BeforeAfter[] = [
  {
    id: 'ba-cedar-thicket',
    label: 'Dense overgrown thicket → cleared homesite',
    size: '1536x1024',
    before: {
      alt: 'Before: an impenetrable wall of brush and overgrown vines covering a New England hillside',
      prompt:
        `A photograph of a Central Massachusetts wooded hillside completely choked with dense overgrown brush — ` +
        `multiflora rose, autumn olive, and bittersweet vine smothering scrub pine and young saplings. ` +
        `Mature sugar maples and white pines standing tall in the background, weathered fieldstone wall at the edge of the frame. ` +
        `No paths, no visibility through the brush. Wide landscape composition framed for a future homesite pad. ${PHOTO_STYLE}`,
    },
    after: {
      alt: 'After: same hillside cleared, graded, and ready for construction',
      editPrompt:
        `Edit this exact image so that all of the dense overgrown brush, vines, scrub, and young saplings in the foreground and mid-ground are completely cleared away, ` +
        `revealing finish-graded smooth dark earth ready for a building pad. ` +
        `Preserve the surrounding mature sugar maples, white pines, and the weathered fieldstone wall in EXACTLY the same positions. ` +
        `Keep the same camera angle, same focal length, same sky, same lighting, same time of day, same color grading. ` +
        `Do not change the background trees or the horizon line. Photorealistic.`,
    },
  },
  {
    id: 'ba-stump-yard',
    label: 'Stump-filled yard → smooth lawn-ready surface',
    size: '1536x1024',
    before: {
      alt: 'Before: residential backyard with several large hardwood stumps',
      prompt:
        `A photograph of a New England residential backyard with five large hardwood stumps of varying sizes ` +
        `dotting an otherwise grassy lawn. Soft overcast daylight, a low weathered fieldstone wall along the back of the yard, ` +
        `mature trees visible behind the wall. Wide landscape composition. ${PHOTO_STYLE}`,
    },
    after: {
      alt: 'After: same backyard with all stumps ground out and topsoiled',
      editPrompt:
        `Edit this exact image so that every hardwood stump is completely removed and ground out, ` +
        `the spots where stumps were are filled with fresh dark topsoil patches blending into the surrounding lawn, ` +
        `ready for sod or seed. Preserve the lawn, the low weathered fieldstone wall, and the mature trees behind it in EXACTLY their original positions. ` +
        `Keep the same camera angle, same focal length, same overcast sky, same lighting, same color grading. ` +
        `Do not change anything except removing the stumps. Photorealistic.`,
    },
  },
  {
    id: 'ba-rocky-pasture',
    label: 'Rocky field → usable open field',
    size: '1536x1024',
    before: {
      alt: 'Before: old hayfield strewn with glacial granite boulders and rocks of all sizes',
      prompt:
        `A photograph of an old Central Massachusetts hayfield littered with dozens of glacial granite boulders and rocks of all sizes, ` +
        `from softball-size to refrigerator-size, making the field unusable. A weathered fieldstone wall along the back edge, ` +
        `dry winter-tan grass, overcast soft sky, mature mixed-hardwood tree line in the distance. Wide landscape composition. ${PHOTO_STYLE}`,
    },
    after: {
      alt: 'After: same field cleared of rock, smooth and usable',
      editPrompt:
        `Edit this exact image so that every glacial granite boulder and rock in the foreground and mid-ground is completely removed, ` +
        `leaving the same dry winter-tan grass underneath, lightly groomed and visibly usable open ground. ` +
        `Preserve the weathered fieldstone wall along the back edge and the mature tree line in the distance in EXACTLY the same positions. ` +
        `Keep the same camera angle, same focal length, same overcast sky, same lighting, same color grading. ` +
        `Do not change the wall or the trees — only remove the rocks. Photorealistic.`,
    },
  },
  {
    id: 'ba-driveway-cut',
    label: 'No access → graded driveway through the woods',
    size: '1536x1024',
    before: {
      alt: 'Before: a wall of New England trees with no driveway access',
      prompt:
        `A photograph from a quiet country road looking into a wooded Central Massachusetts property — a solid edge of mixed hardwood and white pine forest ` +
        `with overgrown brush at the base, no driveway, no opening, no break in the tree line. Wide landscape composition with the road running across the foreground. ${PHOTO_STYLE}`,
    },
    after: {
      alt: 'After: a cleanly cut and graded gravel driveway leading into the property',
      editPrompt:
        `Edit this exact image so that a cleanly cut, graded, gravel-base driveway emerges from the road in the foreground and curves back into the trees, ` +
        `with a small culvert installed where it meets the road and feathered edges along its length. ` +
        `Preserve the country road, the surrounding mature hardwoods and white pines, the sky, and the horizon line in EXACTLY their original positions. ` +
        `Keep the same camera angle, same focal length, same lighting, same color grading. ` +
        `Do not change the existing trees beside the driveway — only add the driveway itself. Photorealistic.`,
    },
  },
];
