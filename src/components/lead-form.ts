import { BUSINESS } from '../lib/env';
import { esc } from '../lib/dom';
import { img } from '../lib/env';

export function LeadFormSection() {
  return `
  <section id="lead-form" class="relative py-20 lg:py-28">
    <div class="absolute inset-0 -z-10">
      <img src="${img('trust-handshake')}" alt="" class="w-full h-full object-cover" loading="lazy" />
      <div class="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/85 to-ink-900/60"></div>
    </div>
    <div class="container-x grid lg:grid-cols-12 gap-10 items-center">
      <div class="lg:col-span-6">
        <span class="eyebrow">Free estimate</span>
        <h2 class="h-section mt-3">Tell us about your property.</h2>
        <p class="mt-4 text-stone-200 text-lg max-w-xl">
          The more you can share, the more accurate your quote. We'll text or call you the same business day —
          usually within a couple of hours.
        </p>
        <ul class="mt-6 space-y-2 text-stone-200">
          <li class="flex gap-3"><span class="text-brand-300">✓</span>No-obligation, no high-pressure sales.</li>
          <li class="flex gap-3"><span class="text-brand-300">✓</span>Written, line-item pricing.</li>
          <li class="flex gap-3"><span class="text-brand-300">✓</span>$2M general liability + workers' comp.</li>
        </ul>
        <a href="tel:${esc(BUSINESS.phoneTel)}" data-track="call_form_section"
           class="mt-8 inline-flex items-center gap-2 text-2xl font-display text-white hover:text-ember-500">
          <svg class="h-6 w-6 text-ember-500" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.4 11.4 0 00.57 3.6 1 1 0 01-.25 1l-2.22 2.2z"/></svg>
          ${esc(BUSINESS.phone)}
        </a>
      </div>
      <div class="lg:col-span-6">
        <form id="main-lead-form" data-form="main" class="card p-6 lg:p-8" novalidate>
          <div class="grid sm:grid-cols-2 gap-3">
            <label class="block sm:col-span-2">
              <span class="sr-only">Your name</span>
              <input class="input" name="name" type="text" autocomplete="name" placeholder="Your name" required />
            </label>
            <label class="block">
              <span class="sr-only">Phone</span>
              <input class="input" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="Phone" required />
            </label>
            <label class="block">
              <span class="sr-only">Email</span>
              <input class="input" name="email" type="email" autocomplete="email" placeholder="Email (optional)" />
            </label>
            <label class="block">
              <span class="sr-only">Property ZIP</span>
              <input class="input" name="zip" type="text" inputmode="numeric" autocomplete="postal-code" placeholder="Property ZIP" required pattern="[0-9]{5}" />
            </label>
            <label class="block">
              <span class="sr-only">Approximate acreage</span>
              <select class="input" name="acreage">
                <option value="">Approx. acreage</option>
                <option>Less than 1/2 acre</option>
                <option>1/2 to 1 acre</option>
                <option>1 to 5 acres</option>
                <option>5 to 20 acres</option>
                <option>20+ acres</option>
                <option>Not sure</option>
              </select>
            </label>
            <label class="block sm:col-span-2">
              <span class="sr-only">Service needed</span>
              <select class="input" name="service" required>
                <option value="">Service needed</option>
                <option>Tree removal</option>
                <option>Dense brush / forestry mulching</option>
                <option>Stump grinding</option>
                <option>Boulder / large rock removal</option>
                <option>Excavation (pad, pond, trench)</option>
                <option>Grading / land reforming</option>
                <option>Equipment rental</option>
                <option>Equipment repair</option>
                <option>Equipment purchase</option>
                <option>Multiple / not sure</option>
              </select>
            </label>
            <label class="block sm:col-span-2">
              <span class="sr-only">Details</span>
              <textarea class="input" name="notes" rows="3"
                placeholder="Tell us about the property — what you want done, timeline, access, anything we should know."></textarea>
            </label>
            <!-- honeypot -->
            <input type="text" name="company" tabindex="-1" autocomplete="off" class="hidden" />
          </div>
          <button type="submit" class="btn-primary w-full mt-5 text-base">
            Request my free quote
          </button>
          <p class="text-xs text-stone-400 mt-3">
            By submitting, you agree we can contact you about this job. We never sell or share your info.
          </p>
          <div data-form-status class="mt-4 hidden text-sm"></div>
        </form>
      </div>
    </div>
  </section>`;
}
