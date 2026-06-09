import { BUSINESS } from '../lib/env';
import { esc } from '../lib/dom';
import { img } from '../lib/env';

export function Hero() {
  return `
  <section id="top" class="relative isolate overflow-hidden">
    <picture class="absolute inset-0 -z-10">
      <source media="(max-width: 640px)" srcset="${img('hero-mobile')}">
      <img src="${img('hero-main')}" alt="" class="w-full h-full object-cover" fetchpriority="high" />
    </picture>
    <div class="absolute inset-0 -z-10 bg-gradient-to-b from-ink-900/85 via-ink-900/60 to-ink-900"></div>

    <div class="container-x pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-12 gap-10 items-center">
      <div class="lg:col-span-7">
        <span class="eyebrow">Family-owned · Fully insured · <span data-loc-area>${esc(BUSINESS.area)}</span></span>
        <h1 class="h-display mt-3">
          Raw land, cleared right.<br/>
          <span class="text-brand-300">Trees. Brush. Stumps. Rock.</span>
        </h1>
        <p class="mt-5 text-lg sm:text-xl text-stone-200/90 max-w-2xl">
          From a single problem tree to fifty wild acres — we drop, mulch, grind, dig, and grade
          with our own heavy equipment. No surprise invoices.
        </p>
        <ul class="mt-6 flex flex-wrap gap-2">
          <li class="chip">Free on-site estimate</li>
          <li class="chip">Same-week start on most jobs</li>
          <li class="chip">$2M liability insured</li>
        </ul>
        <div class="mt-8 flex flex-wrap gap-3">
          <a href="#lead-form" data-track="cta_hero_quote" class="btn-primary text-base">
            Get my free quote
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </a>
          <a href="tel:${esc(BUSINESS.phoneTel)}" data-track="call_hero" class="btn-outline text-base">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.4 11.4 0 00.57 3.6 1 1 0 01-.25 1l-2.22 2.2z"/></svg>
            Call ${esc(BUSINESS.phone)}
          </a>
        </div>
      </div>
      <div class="lg:col-span-5">
        ${HeroLeadCard()}
      </div>
    </div>
  </section>`;
}

// Compact above-the-fold lead form. Mirrors the full one below.
function HeroLeadCard() {
  return `
  <form id="hero-lead-form" data-form="hero" class="card p-6 lg:p-7 backdrop-blur" novalidate>
    <h2 class="font-display text-2xl mb-1">Free estimate in 60 seconds</h2>
    <p class="text-sm text-stone-300 mb-5">Tell us about the property — we'll text or call back same business day.</p>
    <div class="space-y-3">
      <input class="input" name="name" type="text" autocomplete="name" placeholder="Your name" required />
      <input class="input" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="Phone number" required />
      <input class="input" name="zip" type="text" inputmode="numeric" autocomplete="postal-code" placeholder="Property ZIP" required pattern="[0-9]{5}" />
      <select class="input" name="service" required>
        <option value="">What do you need?</option>
        <option>Tree removal</option>
        <option>Dense brush / mulching</option>
        <option>Stump grinding</option>
        <option>Boulder / rock removal</option>
        <option>Excavation / pad / pond</option>
        <option>Grading / land reforming</option>
        <option>Equipment rental or sales</option>
        <option>Not sure — please advise</option>
      </select>
    </div>
    <button type="submit" class="btn-primary w-full mt-5 text-base">
      Get my quote
    </button>
    <p class="text-xs text-stone-400 mt-3">No spam. Your info is used only to contact you about this job.</p>
  </form>`;
}
