import { BEFORE_AFTER } from '../data/images';
import { esc } from '../lib/dom';
import { IMAGES_BASE } from '../lib/env';

export function Gallery() {
  return `
  <section id="gallery" class="py-20 lg:py-28 bg-ink-800/40">
    <div class="container-x">
      <div class="max-w-3xl">
        <span class="eyebrow">Before & after</span>
        <h2 class="h-section mt-3">The land tells you everything.</h2>
        <p class="mt-4 text-stone-300 text-lg">
          Slide each image to see the same property, same angle, same lighting — before our crew rolled in,
          and after we wrapped.
        </p>
      </div>

      <div class="mt-12 grid md:grid-cols-2 gap-8">
        ${BEFORE_AFTER.map(ba => `
        <figure>
          <div class="ba-wrap rounded-xl overflow-hidden border border-white/5 shadow-card"
               data-ba-id="${esc(ba.id)}" style="aspect-ratio: 3/2;">
            <img src="${IMAGES_BASE}/${esc(ba.id)}-before.png"
                 alt="${esc(ba.before.alt)}" loading="lazy" decoding="async"
                 class="absolute inset-0 w-full h-full object-cover" />
            <div class="ba-after" style="width:50%;">
              <img src="${IMAGES_BASE}/${esc(ba.id)}-after.png"
                   alt="${esc(ba.after.alt)}" loading="lazy" decoding="async" />
            </div>
            <div class="ba-handle" style="left:50%;"></div>
            <div class="absolute top-2 left-2 text-[10px] tracking-widest uppercase bg-black/60 text-white px-2 py-1 rounded">Before</div>
            <div class="absolute top-2 right-2 text-[10px] tracking-widest uppercase bg-ember-500/90 text-white px-2 py-1 rounded">After</div>
          </div>
          <figcaption class="mt-3 text-stone-300 text-sm">${esc(ba.label)}</figcaption>
        </figure>`).join('')}
      </div>
    </div>
  </section>`;
}
