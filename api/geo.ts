// Edge function that returns the visitor's coarse geo derived from request
// headers their host injects. Works on Vercel out of the box; on Netlify, the
// x-nf-geo header is parsed as a fallback.
//
// Returned shape is intentionally minimal — the client uses formatArea() in
// src/data/locations.ts to turn it into display text.
//
// Privacy: only city / region / country / approximate lat-lon are returned.
// No IP, no precise location.

export const config = { runtime: 'edge' };

type GeoPayload = {
  city: string | null;
  region: string | null;
  country: string | null;
  lat: number | null;
  lon: number | null;
};

export default function handler(req: Request): Response {
  const h = req.headers;

  // 1) Vercel edge headers (https://vercel.com/docs/edge-network/headers)
  let city    = decode(h.get('x-vercel-ip-city'));
  let region  = h.get('x-vercel-ip-country-region');
  let country = h.get('x-vercel-ip-country');
  let lat     = num(h.get('x-vercel-ip-latitude'));
  let lon     = num(h.get('x-vercel-ip-longitude'));

  // 2) Netlify fallback — geo is JSON-encoded in `x-nf-geo`.
  if (!city && !country) {
    const nf = h.get('x-nf-geo');
    if (nf) {
      try {
        const j = JSON.parse(nf) as {
          city?: string;
          country?: { code?: string };
          subdivision?: { code?: string };
          latitude?: number;
          longitude?: number;
        };
        city    = j.city ?? null;
        region  = j.subdivision?.code ?? null;
        country = j.country?.code ?? null;
        lat     = typeof j.latitude  === 'number' ? j.latitude  : null;
        lon     = typeof j.longitude === 'number' ? j.longitude : null;
      } catch { /* ignore malformed header */ }
    }
  }

  const body: GeoPayload = { city, region, country, lat, lon };

  return new Response(JSON.stringify(body), {
    headers: {
      'content-type': 'application/json',
      // Cache at the edge briefly so we don't re-derive headers per request,
      // but never cache in the browser (geo varies per visitor).
      'cache-control': 'private, no-store',
    },
  });
}

function decode(v: string | null): string | null {
  if (!v) return null;
  try { return decodeURIComponent(v); } catch { return v; }
}

function num(v: string | null): number | null {
  if (!v) return null;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}
