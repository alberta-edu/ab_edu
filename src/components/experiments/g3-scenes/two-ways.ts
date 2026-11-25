// The same outcome in different ways (SCI3-OI6-GQ1-LO1 K2.1, U2.1, S2.1): Ava and Ben write two
// different sets of instructions to get from home to school. Ava goes up, then right. Ben goes
// right, then up. Both arrive.
import { showFrom, ticker, type RunScene, type Sprite } from '../../visuals/g3-sprites.ts';

const cx = (c: number) => 50 + 60 * c;
const cy = (r: number) => 90 + 60 * r;
const A = 0.08; // Ava sets off
const B = 0.48; // Ben sets off
// a trail that grows from (c0, r0) to (c1, r1) between t0 and t1
const trail = (cls: string, c0: number, r0: number, c1: number, r1: number, t0: number, t1: number): Sprite =>
  showFrom({ kind: 'line', cls, x: cx(c0), y: cy(r0), x2: cx(c0), y2: cy(r0), keys: [{ t: t0, x2: cx(c0), y2: cy(r0) }, { t: t1, x2: cx(c1), y2: cy(r1) }] }, t0, undefined, 0.01);
const label = (y: number, text: string, size = 19): Sprite => ({ kind: 'text', text, x: 300, y, size, anchor: 'start', cls: 'g3s-label' });

const scene: RunScene = {
  w: 480,
  h: 290,
  ms: 8000,
  live: 'Ava went up 2, then right 3, and got to school. Ben went right 3, then up 2, and got to school too. Two different sets of steps had the same outcome.',
  bg:
    '<rect class="g3s-sky" width="480" height="290"/>' +
    [0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => `<rect class="g3s-chip" x="${22 + 60 * c}" y="${62 + 60 * r}" width="56" height="56" rx="6"/>`).join('')).join('') +
    '<rect class="g3s-grass" x="82" y="122" width="116" height="56" rx="6"/>' +
    '<rect class="g3s-plate" x="286" y="62" width="186" height="176" rx="10"/>',
  sprites: [
    { kind: 'emoji', text: '🌳', x: cx(1), y: cy(1), size: 38 },
    { kind: 'emoji', text: '🌳', x: cx(2), y: cy(1), size: 38 },
    { kind: 'emoji', text: '🏠', x: cx(0), y: cy(2), size: 40 },
    { kind: 'emoji', text: '🏫', x: cx(3), y: cy(0), size: 40, keys: [{ t: 0.84, s: 1 }, { t: 0.9, s: 1.3 }] },
    trail('g3s-trail-a', 0, 2, 0, 0, A, A + 0.14),
    trail('g3s-trail-a', 0, 0, 3, 0, A + 0.16, A + 0.32),
    trail('g3s-trail-b', 0, 2, 3, 2, B, B + 0.16),
    trail('g3s-trail-b', 3, 2, 3, 0, B + 0.18, B + 0.32),
    {
      kind: 'emoji', text: '👧', x: cx(0), y: cy(2), size: 36,
      keys: [{ t: A, x: cx(0), y: cy(2) }, { t: A + 0.14, x: cx(0), y: cy(0) }, { t: A + 0.16, x: cx(0) }, { t: A + 0.32, x: cx(3) }, { t: A + 0.34, o: 1 }, { t: A + 0.37, o: 0 }],
    },
    showFrom({
      kind: 'emoji', text: '👦', x: cx(0), y: cy(2), size: 36,
      keys: [{ t: B, x: cx(0), y: cy(2) }, { t: B + 0.16, x: cx(3), y: cy(2) }, { t: B + 0.18, y: cy(2) }, { t: B + 0.32, y: cy(0) }, { t: B + 0.34, o: 1 }, { t: B + 0.37, o: 0 }],
    }, B - 0.04),
    label(92, '👧 Ava'),
    label(120, 'Up 2, Right 3', 17),
    label(172, '👦 Ben'),
    label(200, 'Right 3, Up 2', 17),
    showFrom({ kind: 'emoji', text: '✅', x: 446, y: 92, size: 26 }, A + 0.34),
    showFrom({ kind: 'emoji', text: '✅', x: 446, y: 172, size: 26 }, B + 0.34),
    ticker(240, 28, [[0, 'Two ways to school'], [A, 'Ava’s steps…'], [B - 0.04, 'Ben’s steps…'], [0.84, 'Both got to school!']], 20, 'middle'),
  ],
};
export default scene;
