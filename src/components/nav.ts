import { BUSINESS } from '../lib/env';
import { esc } from '../lib/dom';

export function Nav() {
  return `
  <header class="sticky top-0 z-40 bg-ink-900/85 backdrop-blur border-b border-white/5">
    <div class="container-x flex items-center justify-between h-16">
      <a href="#top" class="flex items-center gap-2 font-display text-xl">
        <svg class="h-7 w-7 text-ember-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2l2.9 5.9L21 9l-4.7 4.5L17.7 20 12 16.9 6.3 20l1.4-6.5L3 9l6.1-1.1L12 2z"/>
        </svg>
        <span class="tracking-wide">${esc(BUSINESS.name)}</span>
      </a>
      <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
        <a href="#services" class="hover:text-white">Services</a>
        <a href="#gallery"  class="hover:text-white">Before / After</a>
        <a href="#equipment" class="hover:text-white">Equipment</a>
        <a href="#process"  class="hover:text-white">Process</a>
        <a href="#reviews"  class="hover:text-white">Reviews</a>
      </nav>
      <div class="flex items-center gap-2">
        <a href="tel:${esc(BUSINESS.phoneTel)}" data-track="call_header" class="hidden sm:inline-flex btn-outline text-sm px-3 py-2">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.4 11.4 0 00.57 3.6 1 1 0 01-.25 1l-2.22 2.2z"/></svg>
          ${esc(BUSINESS.phone)}
        </a>
        <a href="#lead-form" data-track="cta_nav_quote" class="btn-primary text-sm px-3 py-2">Free Quote</a>
      </div>
    </div>
  </header>`;
}
