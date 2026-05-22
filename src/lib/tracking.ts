import { TRACKING } from './env';

// Lightweight FB Pixel + GA4 loaders. No-ops when IDs are blank.
type FbqFn = ((cmd: string, ...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };
declare global {
  interface Window {
    fbq?: FbqFn;
    _fbq?: FbqFn;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// Per-lead value used to signal lead quality to Meta. Phone-taps are higher
// intent than form fills in this industry, so we score them higher.
const LEAD_VALUE = { phone_tap: 100, form: 50 } as const;
const CURRENCY = 'USD';

export function installPixels() {
  captureFbclid();
  if (TRACKING.fbPixelId) installFbPixel(TRACKING.fbPixelId);
  if (TRACKING.ga4Id) installGa4(TRACKING.ga4Id);
}

// Persist fbclid as the _fbc cookie so a future server-side CAPI integration
// can match the conversion back to the click. Meta's docs spec this format.
function captureFbclid() {
  try {
    const fbclid = new URLSearchParams(location.search).get('fbclid');
    if (!fbclid) return;
    const fbc = `fb.1.${Date.now()}.${fbclid}`;
    document.cookie = `_fbc=${fbc}; path=/; max-age=${60 * 60 * 24 * 90}; SameSite=Lax`;
  } catch { /* ignore */ }
}

function installFbPixel(id: string) {
  if (window.fbq) return;
  const f: FbqFn = function (...args: unknown[]) {
    // @ts-expect-error queue pattern
    (f.callMethod ? f.callMethod.apply(f, args) : f.queue!.push(args));
  } as FbqFn;
  window.fbq = f;
  if (!window._fbq) window._fbq = f;
  f.push = f;
  f.loaded = true;
  f.version = '2.0';
  f.queue = [];
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(s);
  window.fbq!('init', id);
  window.fbq!('track', 'PageView');
}

function installGa4(id: string) {
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: unknown[]) { window.dataLayer!.push(args); };
  window.gtag('js', new Date());
  window.gtag('config', id);
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  window.fbq?.('trackCustom', name, params);
  window.gtag?.('event', name, params);
  console.debug('[track]', name, params);
}

export type LeadInput = {
  method: 'form' | 'phone_tap';
  source?: string;       // where on the page the action happened
  service?: string;      // which service the user asked about
  email?: string;        // raw; will be hashed before sending
  phone?: string;        // raw; will be hashed before sending
  firstName?: string;
  lastName?: string;
  zip?: string;
};

// Fire the standard Meta `Lead` event with proper optimization signals:
//   - value/currency tell the algorithm lead worth (phone > form)
//   - content_category gives the service so audiences can be segmented
//   - eventID enables deduplication if you add server-side CAPI later
//   - advanced matching (hashed em/ph/fn/ln/zp) raises FB match rate dramatically
export async function trackLead(input: LeadInput): Promise<void> {
  const value = LEAD_VALUE[input.method];
  const eventId = newEventId();

  const params: Record<string, unknown> = {
    content_category: input.service ?? 'land_clearing',
    value,
    currency: CURRENCY,
    lead_method: input.method,
    lead_source: input.source,
  };

  // Advanced matching: hash PII before passing to fbq. SHA-256 hex per Meta spec.
  const am: Record<string, string> = {};
  if (input.email)     am.em = await sha256(normalizeEmail(input.email));
  if (input.phone)     am.ph = await sha256(normalizePhone(input.phone));
  if (input.firstName) am.fn = await sha256(input.firstName.trim().toLowerCase());
  if (input.lastName)  am.ln = await sha256(input.lastName.trim().toLowerCase());
  if (input.zip)       am.zp = await sha256(input.zip.trim());

  // Fire the Pixel Lead event with eventID for CAPI dedup. The 4th arg to
  // fbq('track', ...) is the event-config object; eventID belongs there.
  window.fbq?.('track', 'Lead', params, { eventID: eventId });
  // Advanced matching is set via the init-config object; Meta merges across calls.
  if (Object.keys(am).length > 0 && TRACKING.fbPixelId) {
    window.fbq?.('init', TRACKING.fbPixelId, am);
  }

  // GA4 mirror — standard `generate_lead` event.
  window.gtag?.('event', 'generate_lead', {
    value,
    currency: CURRENCY,
    method: input.method,
    source: input.source,
    service: input.service,
  });

  console.debug('[track] Lead', { eventId, value, ...input });
}

function newEventId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeEmail(s: string): string {
  return s.trim().toLowerCase();
}

function normalizePhone(s: string): string {
  // Strip non-digits per Meta spec; keep leading country code if present.
  const digits = s.replace(/\D+/g, '');
  // Default to US country code if missing and the number is 10 digits.
  return digits.length === 10 ? `1${digits}` : digits;
}

async function sha256(s: string): Promise<string> {
  const bytes = new TextEncoder().encode(s);
  const buf = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
