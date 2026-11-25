// Choosing an appropriate tool improves accuracy (SCI3-OI7-GQ1-LO1 K1.1, K1.2, S1.2): Lee and Mo
// measure the same 90 cm table with their hands and get different numbers (6 small hands, 4 big
// hands). With a metre stick, they both record 90 cm.
import { showFrom, ticker, type RunScene, type Sprite } from '../../visuals/g3-sprites.ts';

const X0 = 60; // the table runs from x = 60 to 420: 90 cm at 4 px per cm
const LEE = 0.08;
const MO = 0.4;
const STICK = 0.66;
const hands = (n: number, size: number, t0: number, gap: number, t1: number): Sprite[] =>
  Array.from({ length: n }, (_, i) => showFrom({ kind: 'emoji', text: '🖐️', x: X0 + (360 / n) * (i + 0.5), y: 150 - size / 2, size }, t0 + i * gap, t1, 0.02));
const row = (y: number, text: string): Sprite => ({ kind: 'text', text, x: 20, y, size: 19, anchor: 'start', cls: 'g3s-label' });

const scene: RunScene = {
  w: 480,
  h: 290,
  ms: 8500,
  live: 'Lee measured the table with his hands and got 6 hands. Mo has bigger hands and got 4 hands. With a metre stick, they both got 90 centimetres.',
  bg:
    '<rect class="g3s-sky" width="480" height="290"/><rect class="g3s-wood" y="250" width="480" height="40"/>' +
    '<rect class="g3s-wood" x="60" y="150" width="360" height="16" rx="3"/><rect class="g3s-wood" x="72" y="166" width="14" height="84"/><rect class="g3s-wood" x="394" y="166" width="14" height="84"/>',
  sprites: [
    ...hands(6, 40, LEE, 0.045, MO - 0.04),
    ...hands(4, 60, MO, 0.06, STICK - 0.04),
    // the metre stick
    showFrom({ kind: 'rect', x: X0, y: 120, w: 360, h: 30, cls: 'g3s-coat' }, STICK),
    ...Array.from({ length: 10 }, (_, i) => showFrom({ kind: 'line', x: X0 + 40 * i, y: 120, x2: X0 + 40 * i, y2: i % 3 ? 130 : 138, cls: 'g3s-line' }, STICK)),
    ...[0, 30, 60, 90].map((cm) => showFrom({ kind: 'text', text: String(cm), x: X0 + 4 * cm + (cm === 90 ? -14 : cm ? 0 : 12), y: 142, size: 13, cls: 'g3s-label' }, STICK)),
    ticker(20, 26, [[0, '🧒 Lee:'], [LEE + 0.03, '🧒 Lee: 1 hand'], [LEE + 0.075, '🧒 Lee: 2 hands'], [LEE + 0.12, '🧒 Lee: 3 hands'], [LEE + 0.165, '🧒 Lee: 4 hands'], [LEE + 0.21, '🧒 Lee: 5 hands'], [LEE + 0.255, '🧒 Lee: 6 hands']], 19),
    showFrom(row(56, '🧑 Mo:'), MO - 0.02, MO + 0.03, 0.02),
    showFrom(ticker(20, 56, [[MO + 0.03, '🧑 Mo: 1 hand'], [MO + 0.09, '🧑 Mo: 2 hands'], [MO + 0.15, '🧑 Mo: 3 hands'], [MO + 0.21, '🧑 Mo: 4 hands']], 19), MO + 0.03, undefined, 0.01),
    showFrom({ ...row(26, '→ 90 cm ✅'), x: 250 }, 0.8),
    showFrom({ ...row(56, '→ 90 cm ✅'), x: 250 }, 0.84),
    ticker(240, 274, [[0, 'Measure the same table'], [LEE, 'Lee’s hands…'], [MO, 'Mo’s bigger hands…'], [STICK, 'Now a metre stick…'], [0.86, 'The same answer!']], 19, 'middle'),
  ],
};
export default scene;
