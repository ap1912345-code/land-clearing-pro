import { img } from '../lib/env';

const STEPS = [
  {
    n: '01',
    title: 'Walk the property',
    body:
      'Free on-site estimate. We walk every acre with you, mark what stays and what goes, ' +
      'and price the job in writing. No high-pressure sales pitch.',
    imageId: 'process-walk',
  },
  {
    n: '02',
    title: 'Schedule & mobilize',
    body:
      'Most jobs start within 5–10 business days. We bring our own equipment, fuel, and crew — ' +
      'you don\'t coordinate anything.',
    imageId: 'process-crew',
  },
  {
    n: '03',
    title: 'Finish clean',
    body:
      'When we leave, the property is the way we said it would be. Stumps below grade, mulch spread, ' +
      'debris hauled or stacked exactly where you asked.',
    imageId: 'process-finish',
  },
];

export function Process() {
  return `
  <section id="process" class="py-20 lg:py-28 bg-ink-800/40">
    <div class="container-x">
      <div class="max-w-3xl">
        <span class="eyebrow">How it works</span>
        <h2 class="h-section mt-3">Three steps. No surprises.</h2>
      </div>
      <ol class="mt-12 grid md:grid-cols-3 gap-6">
        ${STEPS.map(s => `
        <li class="card flex flex-col">
          <img src="${img(s.imageId)}" alt="" loading="lazy"
               class="aspect-[4/3] object-cover" />
          <div class="p-6">
            <div class="font-display text-ember-500 text-sm tracking-widest">${s.n}</div>
            <h3 class="font-display text-2xl mt-1">${s.title}</h3>
            <p class="text-stone-300 mt-3 text-sm">${s.body}</p>
          </div>
        </li>`).join('')}
      </ol>
    </div>
  </section>`;
}
