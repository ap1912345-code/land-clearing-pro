// Tiny helpers so component files stay readable.
export const esc = (s: string) =>
  s.replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]!));

export const $  = <T extends Element = Element>(sel: string, root: ParentNode = document) =>
  root.querySelector(sel) as T | null;

export const $$ = <T extends Element = Element>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll(sel)) as T[];
