// Centralized access to build-time public env vars, with sane defaults.
export const BUSINESS = {
  name:      import.meta.env.VITE_BUSINESS_NAME      ?? 'Prentiss Services LLC',
  phone:     import.meta.env.VITE_BUSINESS_PHONE     ?? '(555) 123-4567',
  phoneTel:  import.meta.env.VITE_BUSINESS_PHONE_TEL ?? '+15551234567',
  area:      import.meta.env.VITE_SERVICE_AREA       ?? 'Central Massachusetts',
};

export const TRACKING = {
  fbPixelId: import.meta.env.VITE_FB_PIXEL_ID ?? '',
  ga4Id:     import.meta.env.VITE_GA4_ID ?? '',
};

export const IMAGES_BASE = '/images';
export const img = (id: string) => `${IMAGES_BASE}/${id}.png`;
