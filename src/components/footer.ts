import { BUSINESS } from '../lib/env';
import { esc } from '../lib/dom';

export function Footer() {
  const year = new Date().getFullYear();
  return `
  <footer class="bg-ink-900 border-t border-white/5 py-12">
    <div class="container-x grid md:grid-cols-3 gap-8 items-start">
      <div>
        <div class="font-display text-xl">${esc(BUSINESS.name)}</div>
        <p class="text-stone-400 text-sm mt-2">
          Serving ${esc(BUSINESS.area)}. Family-owned and operated. Fully licensed and insured.
        </p>
      </div>
      <div class="text-sm text-stone-300">
        <div class="font-semibold text-white mb-2">Get in touch</div>
        <div>
          <a href="tel:${esc(BUSINESS.phoneTel)}" data-track="call_footer" class="hover:text-white">
            ${esc(BUSINESS.phone)}
          </a>
        </div>
        <div class="mt-1"><a href="#lead-form" class="hover:text-white">Request a quote →</a></div>
      </div>
      <div class="text-sm text-stone-300">
        <div class="font-semibold text-white mb-2">Services</div>
        <ul class="grid grid-cols-2 gap-y-1">
          <li><a href="#services" class="hover:text-white">Tree removal</a></li>
          <li><a href="#services" class="hover:text-white">Brush mulching</a></li>
          <li><a href="#services" class="hover:text-white">Stump grinding</a></li>
          <li><a href="#services" class="hover:text-white">Boulder removal</a></li>
          <li><a href="#services" class="hover:text-white">Excavation</a></li>
          <li><a href="#services" class="hover:text-white">Grading</a></li>
          <li><a href="#services" class="hover:text-white">Equipment rental</a></li>
          <li><a href="#services" class="hover:text-white">Equipment repair</a></li>
        </ul>
      </div>
    </div>
    <div class="container-x mt-10 text-xs text-stone-500">
      &copy; ${year} ${esc(BUSINESS.name)}. All rights reserved.
    </div>
    <!-- mobile sticky call/quote bar -->
    <div class="md:hidden fixed bottom-0 inset-x-0 z-50 bg-ink-900/95 backdrop-blur border-t border-white/10 grid grid-cols-2">
      <a href="tel:${esc(BUSINESS.phoneTel)}" data-track="call_sticky"
         class="flex items-center justify-center gap-2 py-3 font-semibold text-white">
        <svg class="h-4 w-4 text-ember-500" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.4 11.4 0 00.57 3.6 1 1 0 01-.25 1l-2.22 2.2z"/></svg>
        Call now
      </a>
      <a href="#lead-form" data-track="cta_sticky_quote"
         class="flex items-center justify-center gap-2 py-3 bg-ember-500 hover:bg-ember-600 text-white font-semibold">
        Free quote
      </a>
    </div>
    <div class="md:hidden h-14" aria-hidden="true"></div>
  </footer>`;
}
