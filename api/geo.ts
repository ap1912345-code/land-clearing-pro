// Edge function that returns the visitor's coarse geo.
//
// Primary source: ipify Geolocation API (https://geo.ipify.org), which is
// more accurate than the city-level data that arrives in the platform's edge
// headers. Key lives in GEO_IPIFY_API_KEY — never in the repo.
//
// Fallbacks (in order): Vercel x-vercel-ip-* headers → Netlify x-nf-geo →
// nulls. The client treats null/missing fields as "leave default text".
//
// Privacy: only city / region / country / approximate lat-lon are returned.
// No IP is echoed to the browser.

export const config = { runtime: 'edge' };

type GeoPayload = {
  city: string | null;
  region: string | null;   // US state code, e.g. "MA"
  country: string | null;  // ISO-3166 alpha-2, e.g. "US"
  lat: number | null;
  lon: number | null;
};

export default async function handler(req: Request): Promise<Response> {
  const apiKey = (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env?.GEO_IPIFY_API_KEY;

  const ip = visitorIp(req);
  const ipify = apiKey && ip ? await lookupIpify(apiKey, ip) : null;
  const payload = ipify ?? edgeHeaderFallback(req);

  return new Response(JSON.stringify(payload), {
    headers: {
      'content-type': 'application/json',
      // Browser caches per-user, so the same visitor reloading the page won't
      // burn another ipify request. Edge does not cache (Vary-by-IP isn't a
      // thing on Vercel's CDN), so each unique IP costs one upstream call.
      'cache-control': 'private, max-age=3600',
    },
  });
}

async function lookupIpify(apiKey: string, ip: string): Promise<GeoPayload | null> {
  try {
    const url =
      `https://geo.ipify.org/api/v2/country,city` +
      `?apiKey=${encodeURIComponent(apiKey)}` +
      `&ipAddress=${encodeURIComponent(ip)}`;
    const r = await fetch(url, { headers: { accept: 'application/json' } });
    if (!r.ok) return null;
    const data = (await r.json()) as {
      location?: {
        country?: string;
        region?: string;
        city?: string;
        lat?: number;
        lng?: number;
      };
    };
    const loc = data.location ?? {};
    return {
      city: loc.city ?? null,
      region: loc.region ? US_STATE_CODE[loc.region] ?? null : null,
      country: loc.country ?? null,
      lat: typeof loc.lat === 'number' ? loc.lat : null,
      lon: typeof loc.lng === 'number' ? loc.lng : null,
    };
  } catch {
    return null;
  }
}

function edgeHeaderFallback(req: Request): GeoPayload {
  const h = req.headers;

  // Vercel
  let city    = decode(h.get('x-vercel-ip-city'));
  let region  = h.get('x-vercel-ip-country-region');
  let country = h.get('x-vercel-ip-country');
  let lat     = num(h.get('x-vercel-ip-latitude'));
  let lon     = num(h.get('x-vercel-ip-longitude'));

  // Netlify
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

  return { city, region, country, lat, lon };
}

function visitorIp(req: Request): string | null {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) {
    // x-forwarded-for is a comma-separated chain; the left-most entry is the
    // original client.
    const first = fwd.split(',')[0]?.trim();
    if (first) return first;
  }
  return req.headers.get('x-real-ip') ?? null;
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

// ipify returns the full state name ("Massachusetts"). The client formatter
// expects the 2-letter code ("MA"), so we translate here.
const US_STATE_CODE: Record<string, string> = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR', California: 'CA',
  Colorado: 'CO', Connecticut: 'CT', Delaware: 'DE', Florida: 'FL', Georgia: 'GA',
  Hawaii: 'HI', Idaho: 'ID', Illinois: 'IL', Indiana: 'IN', Iowa: 'IA',
  Kansas: 'KS', Kentucky: 'KY', Louisiana: 'LA', Maine: 'ME', Maryland: 'MD',
  Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN', Mississippi: 'MS', Missouri: 'MO',
  Montana: 'MT', Nebraska: 'NE', Nevada: 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', Ohio: 'OH',
  Oklahoma: 'OK', Oregon: 'OR', Pennsylvania: 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', Tennessee: 'TN', Texas: 'TX', Utah: 'UT', Vermont: 'VT',
  Virginia: 'VA', Washington: 'WA', 'West Virginia': 'WV', Wisconsin: 'WI', Wyoming: 'WY',
  'District of Columbia': 'DC',
};
