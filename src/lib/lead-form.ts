import { $, $$ } from './dom';
import { trackLead, trackEvent } from './tracking';

// Tap-to-call is counted as a Lead. Rationale:
// FB's lead-optimization algorithm needs enough conversion signal to learn what works.
// In this industry most conversions are calls, not form fills, so omitting them
// would starve the algorithm. Switch to trackEvent('Contact', ...) if you'd rather
// keep the Lead event reserved for completed form submissions.
const COUNT_CALLS_AS_LEAD = true;

type LeadPayload = Record<string, string>;

// Where to POST leads. Replace with your CRM webhook, Zapier hook, or backend endpoint.
const LEAD_ENDPOINT = ''; // e.g. 'https://hooks.zapier.com/hooks/catch/123/abc/'

export function wireLeadForms() {
  $$('form[data-form]').forEach(formEl => {
    const form = formEl as HTMLFormElement;
    form.addEventListener('submit', (e) => onSubmit(e, form));
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
    if (LEAD_ENDPOINT) {
      await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: form.dataset.form, page: location.href }),
      });
    } else {
      // No endpoint wired yet — log locally so it's obvious during dev.
      console.info('[lead] (no endpoint configured) would have sent:', data);
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

    form.reset();
    showStatus(status, 'success', "Thanks — we got it. We'll text or call you the same business day.");
    if (submitBtn) submitBtn.textContent = 'Sent ✓';
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

function validate(form: HTMLFormElement, data: LeadPayload): boolean {
  // clear previous
  $$('.input', form).forEach(el => el.classList.remove('ring-2', 'ring-red-500'));
  const required = ['name', 'phone', 'service'];
  let ok = true;
  for (const f of required) {
    if (!data[f]) {
      ok = false;
      const el = form.querySelector(`[name="${f}"]`) as HTMLElement | null;
      el?.classList.add('ring-2', 'ring-red-500');
    }
  }
  if (data.zip && !/^\d{5}$/.test(data.zip)) {
    ok = false;
    (form.querySelector('[name="zip"]') as HTMLElement | null)?.classList.add('ring-2', 'ring-red-500');
  }
  if (!ok) {
    const status = form.querySelector<HTMLElement>('[data-form-status]');
    showStatus(status, 'error', 'Please fill in your name, phone, and the service you need.');
  }
  return ok;
}

function showStatus(el: HTMLElement | null, kind: 'success' | 'error', msg: string) {
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden', 'text-red-300', 'text-brand-300');
  el.classList.add(kind === 'success' ? 'text-brand-300' : 'text-red-300');
}

// silence unused import in some builds
void $;
