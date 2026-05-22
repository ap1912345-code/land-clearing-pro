import { img } from '../lib/env';

export function Equipment() {
  return `
  <section id="equipment" class="py-20 lg:py-28 bg-ink-900">
    <div class="container-x grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <span class="eyebrow">The iron</span>
        <h2 class="h-section mt-3">Our equipment is the difference.</h2>
        <p class="mt-4 text-stone-300 text-lg">
          We run high-flow tracked loaders with carbide mulcher heads, mid-size excavators with rock grapples
          and hydraulic breakers, dedicated stump grinders, and finish-grade dozers. We bring the right
          machine for the job, not the only one we own.
        </p>
        <dl class="mt-8 grid grid-cols-3 gap-4 max-w-md">
          <div>
            <dt class="text-stone-400 text-xs uppercase tracking-wider">Years running</dt>
            <dd class="font-display text-3xl text-white mt-1">17+</dd>
          </div>
          <div>
            <dt class="text-stone-400 text-xs uppercase tracking-wider">Acres cleared</dt>
            <dd class="font-display text-3xl text-white mt-1">4,200+</dd>
          </div>
          <div>
            <dt class="text-stone-400 text-xs uppercase tracking-wider">Insured to</dt>
            <dd class="font-display text-3xl text-white mt-1">$2M</dd>
          </div>
        </dl>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <img src="${img('equipment-mulcher')}"   alt="Forestry mulcher head detail" loading="lazy"
             class="rounded-xl border border-white/5 aspect-[4/3] object-cover col-span-2" />
        <img src="${img('equipment-excavator')}" alt="Mid-size tracked excavator"  loading="lazy"
             class="rounded-xl border border-white/5 aspect-[4/3] object-cover" />
        <img src="${img('trust-truck')}"         alt="Equipment trailer on a job site" loading="lazy"
             class="rounded-xl border border-white/5 aspect-[4/3] object-cover" />
      </div>
    </div>
  </section>`;
}
