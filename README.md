# Land Clearing — Vite + TS landing site

Picture-heavy, lead-optimized landing page for a land-clearing business. Built to be the destination of Facebook ad traffic.

## Quick start

```bash
npm install
cp .env.example .env       # fill in OPENAI_API_KEY and (optionally) FB pixel / GA4 ids
npm run generate:images    # creates everything declared in src/data/images.ts under public/images/
npm run dev                # http://localhost:5173
```

To build for production: `npm run build` (output in `dist/`).

## Image generation

All image specs live in `src/data/images.ts`. The generator script (`scripts/generate-images.ts`) reads that file and writes PNGs to `public/images/`.

```bash
npm run generate:images                       # generate every missing image
npm run generate:images -- --force            # overwrite existing
npm run generate:images -- --only hero-main   # one specific image
npm run generate:images:dry                   # show what would be generated
```

Defaults to `OPENAI_IMAGE_MODEL=gpt-image-2` (configurable in `.env`). If that model name isn't accepted by the API, the script auto-falls-back to `gpt-image-1`.

To add a new image: append an entry to `SITE_IMAGES` (single) or `BEFORE_AFTER` (paired) in `src/data/images.ts`, then re-run the generator.

## Lead form

The form posts to `LEAD_ENDPOINT` in `src/lib/lead-form.ts` — point it at your CRM webhook, Zapier catch hook, or your own backend. With the endpoint blank, submissions are logged to the browser console (useful for QA before wiring infra).

Forms fire two analytics events:
- **FB Pixel**: `Lead` (standard event, optimizable by FB for lead-gen ad campaigns)
- **GA4**: `generate_lead`

CTA clicks and phone clicks fire `trackEvent(name)` for both — see `data-track` attributes throughout the markup.

## FB ads tips

- Set `VITE_FB_PIXEL_ID` in `.env` before deploying so the pixel fires on page load and on `Lead`.
- In Ads Manager, choose **Leads** as the campaign objective and optimize for the `Lead` standard event from this pixel.
- The hero form, mid-page form, sticky mobile bar, click-to-call links, and every service card all funnel to the same `#lead-form` anchor or the same phone number.
- Page is mobile-first; >70% of FB ad traffic is mobile.
