import { $$ } from './dom';

export function wireBeforeAfter() {
  $$('.ba-wrap').forEach(initOne);
}

function initOne(root: Element) {
  const wrap   = root as HTMLElement;
  const after  = wrap.querySelector<HTMLElement>('.ba-after');
  const handle = wrap.querySelector<HTMLElement>('.ba-handle');
  if (!after || !handle) return;

  let dragging = false;

  const setPct = (pct: number) => {
    const p = Math.max(0, Math.min(100, pct));
    after.style.width = `${p}%`;
    handle.style.left = `${p}%`;
  };

  const pctFromEvent = (clientX: number) => {
    const rect = wrap.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  };

  const onDown = (e: PointerEvent) => {
    dragging = true;
    wrap.setPointerCapture(e.pointerId);
    setPct(pctFromEvent(e.clientX));
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    setPct(pctFromEvent(e.clientX));
  };
  const onUp = (e: PointerEvent) => {
    dragging = false;
    try { wrap.releasePointerCapture(e.pointerId); } catch { /* noop */ }
  };

  wrap.addEventListener('pointerdown', onDown);
  wrap.addEventListener('pointermove', onMove);
  wrap.addEventListener('pointerup', onUp);
  wrap.addEventListener('pointercancel', onUp);

  // keyboard accessibility
  wrap.tabIndex = 0;
  wrap.setAttribute('role', 'slider');
  wrap.setAttribute('aria-valuemin', '0');
  wrap.setAttribute('aria-valuemax', '100');
  wrap.setAttribute('aria-valuenow', '50');
  wrap.addEventListener('keydown', (e) => {
    const current = parseFloat(handle.style.left || '50');
    if (e.key === 'ArrowLeft')  { setPct(current - 5); wrap.setAttribute('aria-valuenow', String(Math.max(0, current - 5))); }
    if (e.key === 'ArrowRight') { setPct(current + 5); wrap.setAttribute('aria-valuenow', String(Math.min(100, current + 5))); }
  });
}
