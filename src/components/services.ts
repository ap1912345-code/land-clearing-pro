import { SERVICES } from '../data/services';
import { esc } from '../lib/dom';
import { img } from '../lib/env';

export function Services() {
  return `
  <section id="services" class="py-20 lg:py-28 bg-ink-900">
    <div class="container-x">
      <div class="max-w-3xl">
        <span class="eyebrow">What we do</span>
        <h2 class="h-section mt-3">Seven services. One crew. No subcontractors.</h2>
        <p class="mt-4 text-stone-300 text-lg">
          We own the equipment, we run the equipment, and we fix the equipment. That's why our jobs
          start on time and finish on the day we said they would.
        </p>
      </div>

      <div class="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${SERVICES.map(s => `
        <article class="card group flex flex-col">
          <div class="relative aspect-[4/3] overflow-hidden">
            <img src="${img(s.imageId)}" alt="${esc(s.title)}" loading="lazy" decoding="async"
                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900 to-transparent h-2/3"></div>
            <h3 class="absolute bottom-3 left-4 right-4 font-display text-2xl">${esc(s.title)}</h3>
          </div>
          <div class="p-5 flex-1 flex flex-col">
            <p class="text-stone-200 font-medium">${esc(s.short)}</p>
            <p class="text-stone-400 text-sm mt-2">${esc(s.body)}</p>
            <ul class="mt-4 space-y-1.5 text-sm text-stone-300">
              ${s.bullets.map(b => `
                <li class="flex gap-2"><span class="text-brand-300 mt-1">✓</span><span>${esc(b)}</span></li>
              `).join('')}
            </ul>
            <a href="#lead-form" data-track="cta_service_${esc(s.slug)}"
               class="mt-5 inline-flex items-center gap-1.5 text-ember-500 font-semibold hover:text-ember-600">
              Get a quote on this →
            </a>
          </div>
        </article>`).join('')}
      </div>
    </div>
  </section>`;
}
