import { $, $$, esc } from './dom';
import { trackLead, trackEvent } from './tracking';
import { BUSINESS } from './env';

// Tap-to-call is counted as a Lead. Rationale:
// FB's lead-optimization algorithm needs enough conversion signal to learn what works.
// In this industry most conversions are calls, not form fills, so omitting them
// would starve the algorithm. Switch to trackEvent('Contact', ...) if you'd rather
// keep the Lead event reserved for completed form submissions.
const COUNT_CALLS_AS_LEAD = true;

type LeadPayload = Record<string, string>;

// Web3Forms delivers form submissions to a verified email. Access key is safe to
// expose in browser JS — Web3Forms handles abuse server-side. Configured via
// VITE_WEB3FORMS_KEY in .env.
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY ?? '';
const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

export function wireLeadForms() {
  $$('form[data-form]').forEach(formEl => {
    const form = formEl as HTMLFormElement;
    form.addEventListener('submit', (e) => onSubmit(e, form));
    // When the user starts editing a field that had an error, clear the error
    // immediately so they get the feedback that they're on the right track.
    $$('.input', form).forEach(input => {
      input.addEventListener('input', () => {
        const name = (input as HTMLInputElement).name;
        if (name) clearFieldError(form, name);
      });
      input.addEventListener('change', () => {
        const name = (input as HTMLInputElement).name;
        if (name) clearFieldError(form, name);
      });
    });
  });

  // Track CTA / phone clicks for funnel analytics.
  // If the element is a tel: link, also fire the standard Lead event so Meta
  // can optimize ad delivery for users likely to call.
  $$('[data-track]').forEach(el => {
    el.addEventListener('click', () => {
      const name = (el as HTMLElement).dataset.track!;
      trackEvent(name);

      const href = (el as HTMLAnchorElement).getAttribute?.('href') ?? '';
      if (COUNT_CALLS_AS_LEAD && href.startsWith('tel:')) {
        // Phone number from the tel: link gives us a value for advanced matching,
        // which boosts FB's ability to match the click back to a user profile.
        const phone = href.replace(/^tel:/, '');
        void trackLead({ method: 'phone_tap', source: name, phone });
      }
    });
  });
}

async function onSubmit(e: SubmitEvent, form: HTMLFormElement) {
  e.preventDefault();

  // honeypot
  const company = (form.elements.namedItem('company') as HTMLInputElement | null)?.value?.trim();
  if (company) return; // silent drop

  const data = collect(form);
  if (!validate(form, data)) return;

  const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

  const status = form.querySelector<HTMLElement>('[data-form-status]');

  try {
    if (WEB3FORMS_KEY) {
      const res = await fetch(WEB3FORMS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          // Subject line used by Web3Forms when emailing you. Includes service so
          // urgent inquiries (e.g. tree removal vs equipment rental) sort easily.
          subject: `New lead: ${data.name || 'Unknown'}${data.service ? ` — ${data.service}` : ''}`,
          from_name: 'Prentiss Services website',
          // Form fields — Web3Forms emails these with their field names as labels.
          name: data.name,
          phone: data.phone,
          email: data.email || '(not provided)',
          zip: data.zip,
          acreage: data.acreage || '(not specified)',
          service: data.service,
          notes: data.notes || '(none)',
          // Context for which form on the page and the page URL.
          source: form.dataset.form,
          page: location.href,
          // Web3Forms server-side honeypot.
          botcheck: '',
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || (json as { success?: boolean }).success === false) {
        throw new Error(`Web3Forms ${res.status}: ${JSON.stringify(json).slice(0, 200)}`);
      }
    } else {
      // No key configured — log locally so it's obvious during dev.
      console.info('[lead] (VITE_WEB3FORMS_KEY not set) would have sent:', data);
      await new Promise(r => setTimeout(r, 400));
    }

    // Pass PII for hashed advanced matching — raises Meta match rate ~50% → ~85%.
    void trackLead({
      method: 'form',
      source: form.dataset.form,
      service: data.service,
      email: data.email || undefined,
      phone: data.phone || undefined,
      firstName: data.name ? data.name.split(/\s+/)[0] : undefined,
      lastName:  data.name ? data.name.split(/\s+/).slice(1).join(' ') || undefined : undefined,
      zip: data.zip || undefined,
    });

    // Replace the form with a clear success card so the user knows it went through.
    const firstName = (data.name || '').split(/\s+/)[0] || '';
    renderSuccessState(form, firstName);
  } catch (err) {
    console.error('Lead submit failed', err);
    showStatus(status, 'error', 'Something went wrong sending that. Please call us instead.');
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Try again'; }
  }
}

function collect(form: HTMLFormElement): LeadPayload {
  const out: LeadPayload = {};
  new FormData(form).forEach((v, k) => { out[k] = String(v).trim(); });
  return out;
}

type FieldError = { field: string; msg: string };

function validate(form: HTMLFormElement, data: LeadPayload): boolean {
  clearAllErrors(form);
  const errors: FieldError[] = [];

  if (!data.name) {
    errors.push({ field: 'name', msg: 'Please enter your name' });
  } else if (data.name.length < 2) {
    errors.push({ field: 'name', msg: 'That name looks too short' });
  }

  if (!data.phone) {
    errors.push({ field: 'phone', msg: 'Phone number is required so we can call you back' });
  } else if (!isValidPhone(data.phone)) {
    errors.push({ field: 'phone', msg: 'That doesn\'t look like a valid phone number' });
  }

  if (!data.service) {
    errors.push({ field: 'service', msg: 'Pick what you need help with' });
  }

  if (data.zip && !/^\d{5}$/.test(data.zip)) {
    errors.push({ field: 'zip', msg: 'ZIP should be 5 digits' });
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.push({ field: 'email', msg: 'That doesn\'t look like a valid email' });
  }

  if (errors.length === 0) return true;

  for (const e of errors) showFieldError(form, e.field, e.msg);

  // Top-level summary so the user knows *something* is wrong even if the first
  // error is scrolled off-screen.
  const summary = errors.length === 1
    ? errors[0].msg
    : `Please fix ${errors.length} fields before sending`;
  const status = ensureStatusEl(form);
  showStatus(status, 'error', summary);

  // Focus + scroll the first invalid field into view.
  const firstEl = form.querySelector(`[name="${errors[0].field}"]`) as HTMLElement | null;
  if (firstEl) {
    firstEl.focus({ preventScroll: true });
    firstEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return false;
}

function clearAllErrors(form: HTMLFormElement) {
  $$('.input', form).forEach(el => {
    el.classList.remove('ring-2', 'ring-red-500');
    el.removeAttribute('aria-invalid');
  });
  $$('[data-field-error]', form).forEach(el => el.remove());
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  status?.classList.add('hidden');
}

function clearFieldError(form: HTMLFormElement, field: string) {
  const el = form.querySelector(`[name="${field}"]`) as HTMLElement | null;
  el?.classList.remove('ring-2', 'ring-red-500');
  el?.removeAttribute('aria-invalid');
  form.querySelector(`[data-field-error="${field}"]`)?.remove();
  // If no errors remain, hide the top-level summary too.
  if (form.querySelectorAll('[data-field-error]').length === 0) {
    const status = form.querySelector<HTMLElement>('[data-form-status]');
    status?.classList.add('hidden');
  }
}

function showFieldError(form: HTMLFormElement, field: string, msg: string) {
  const el = form.querySelector(`[name="${field}"]`) as HTMLElement | null;
  if (!el) return;
  el.classList.add('ring-2', 'ring-red-500');
  el.setAttribute('aria-invalid', 'true');
  const err = document.createElement('p');
  err.className = 'text-red-300 text-xs mt-1 flex items-center gap-1';
  err.setAttribute('data-field-error', field);
  err.innerHTML = `<svg class="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg><span>${msg}</span>`;
  // Insert after the input (or after its wrapping label, whichever is the
  // direct sibling in the form's grid layout).
  const sibling = el.closest('label, .input-wrap') ?? el;
  sibling.parentElement?.insertBefore(err, sibling.nextSibling);
}

// Hero form doesn't ship with a [data-form-status] element; inject one before
// the submit button if it's missing.
function ensureStatusEl(form: HTMLFormElement): HTMLElement {
  let status = form.querySelector<HTMLElement>('[data-form-status]');
  if (!status) {
    status = document.createElement('div');
    status.setAttribute('data-form-status', '');
    status.className = 'hidden text-sm mt-3';
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn?.parentElement?.insertBefore(status, submitBtn);
  }
  return status;
}

function isValidPhone(s: string): boolean {
  const digits = s.replace(/\D+/g, '');
  // US: 10 digits, or 11 with leading 1 country code.
  return digits.length === 10 || (digits.length === 11 && digits.startsWith('1'));
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function showStatus(el: HTMLElement | null, kind: 'success' | 'error', msg: string) {
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden', 'text-red-300', 'text-brand-300');
  el.classList.add(kind === 'success' ? 'text-brand-300' : 'text-red-300');
}

// Replace the form's contents with a confirmation card. Keeps the surrounding
// `.card` styling and works for both the hero form and the main form.
function renderSuccessState(form: HTMLFormElement, firstName: string) {
  const greeting = firstName ? `Thanks, ${esc(firstName)}!` : 'Thanks — we got it.';
  form.innerHTML = `
    <div class="text-center py-4 success-enter">
      <div class="mx-auto w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center mb-5">
        <svg class="w-9 h-9 text-brand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M5 12l5 5L20 7"/>
        </svg>
      </div>
      <h2 class="font-display text-3xl mb-3">${greeting}</h2>
      <p class="text-stone-200 max-w-md mx-auto mb-6 leading-relaxed">
        We got your request. We'll text or call you the same business day —
        usually within a couple of hours.
      </p>
      <div class="border-t border-white/10 pt-5 mt-5">
        <p class="text-sm text-stone-400 mb-3">Need an answer right now?</p>
        <a href="tel:${esc(BUSINESS.phoneTel)}" data-track="call_after_submit"
           class="btn-primary text-base inline-flex">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.4 11.4 0 00.57 3.6 1 1 0 01-.25 1l-2.22 2.2z"/></svg>
          Call ${esc(BUSINESS.phone)}
        </a>
      </div>
    </div>
  `;
  // Wire up the new call button for analytics + Lead tracking.
  const callBtn = form.querySelector('[data-track="call_after_submit"]');
  callBtn?.addEventListener('click', () => {
    trackEvent('call_after_submit');
    void trackLead({ method: 'phone_tap', source: 'call_after_submit' });
  });
  // Scroll the success card into view if the user submitted from above the fold.
  form.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// silence unused import in some builds
void $;
