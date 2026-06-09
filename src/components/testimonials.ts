import { TESTIMONIALS } from '../data/testimonials';
import { esc } from '../lib/dom';

export function Testimonials() {
  return `
  <section id="reviews" class="py-20 lg:py-28 bg-ink-900">
    <div class="container-x">
      <div class="max-w-3xl">
        <span class="eyebrow">What clients say</span>
        <h2 class="h-section mt-3">Real jobs, real people, real results.</h2>
      </div>
      <div class="mt-12 grid md:grid-cols-2 gap-6" data-loc-testimonials>
        ${TESTIMONIALS.map(t => `
        <figure class="card p-6" data-lat="${t.lat}" data-lon="${t.lon}">
          <div class="flex gap-1 text-ember-500" aria-label="5 out of 5 stars">
            ${'★'.repeat(5)}
          </div>
          <blockquote class="mt-3 text-stone-100 text-lg leading-snug">
            "${esc(t.quote)}"
          </blockquote>
          <figcaption class="mt-4 text-sm text-stone-400">
            <span class="text-stone-200 font-semibold">${esc(t.name)}</span>
            · ${esc(t.location)} · ${esc(t.job)}
          </figcaption>
        </figure>`).join('')}
      </div>
    </div>
  </section>`;
}
