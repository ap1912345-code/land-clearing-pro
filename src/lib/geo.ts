// Client-side geo: fetch /api/geo, derive display text + apply to the DOM.
//
// The HTML rendered on first paint already contains the fallback text
// ("Central Massachusetts" today; could be changed later to anything safe).
// applyLocalization() runs after first paint and swaps any element marked
// with `data-loc-area` to the localized string. Testimonials marked with
// `data-loc-testimonials` are re-ordered nearest-first when we have coords.

import { formatArea, haversineMiles, type GeoInput } from '../data/locations';

type GeoPayload = GeoInput & { lat: number | null; lon: number | null };

export type Localization = {
  displayArea: string;          // "Worcester, MA" / "Massachusetts" / "your area"
  userLat: number | null;
  userLon: number | null;
};

// Returns null if we couldn't get a usable geo answer (network error, dev
// server, missing endpoint). Callers should leave the default HTML text in
// place when null is returned — never overwrite "Central Massachusetts" with
// "your area" just because the lookup failed.
export async function detectLocalization(): Promise<Localization | null> {
  try {
    const r = await fetch('/api/geo', { cache: 'no-store' });
    if (!r.ok) return null;
    const ct = r.headers.get('content-type') ?? '';
    if (!ct.includes('application/json')) return null;
    const geo = (await r.json()) as GeoPayload;
    return {
      displayArea: formatArea(geo),
      userLat: geo.lat,
      userLon: geo.lon,
    };
  } catch {
    return null;
  }
}

export function applyLocalization(loc: Localization | null): void {
  if (!loc) return;
  // Swap any area-bound text. Skip the swap if it would just say "your area"
  // and the element is part of a sentence where the default reads better.
  document.querySelectorAll<HTMLElement>('[data-loc-area]').forEach(el => {
    el.textContent = loc.displayArea;
  });

  // Re-order testimonials by proximity if we have coordinates on both ends.
  if (loc.userLat == null || loc.userLon == null) return;
  const container = document.querySelector<HTMLElement>('[data-loc-testimonials]');
  if (!container) return;

  const cards = Array.from(
    container.querySelectorAll<HTMLElement>('[data-lat][data-lon]'),
  );
  if (cards.length < 2) return;

  const scored = cards.map(el => ({
    el,
    d: haversineMiles(
      loc.userLat!, loc.userLon!,
      parseFloat(el.dataset.lat ?? 'NaN'),
      parseFloat(el.dataset.lon ?? 'NaN'),
    ),
  }));
  scored.sort((a, b) => a.d - b.d);
  for (const { el } of scored) container.appendChild(el);
}
