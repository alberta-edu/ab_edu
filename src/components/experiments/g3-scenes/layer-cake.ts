// Layers hold the past (SCI3-OI3-GQ1-LO1 K4.1, U4.1, S4.1): flood after flood drops mud and sand
// on the bottom of a lake. Each new layer lands on top, so the bottom layer is the oldest. A shell
// and a bone are buried in the layers on the way.
import { showFrom, ticker, falling, type RunScene, type Sprite } from '../../visuals/g3-sprites.ts';

const BASE = 262;
const H = 38;
const cls = ['g3s-l5', 'g3s-l4', 'g3s-l2', 'g3s-l3', 'g3s-l1'];
const start = (i: number) => 0.08 + i * 0.15;
const layers: Sprite[] = cls.map((c, i) => {
  const bottom = BASE - H * i;
  return { kind: 'rect', x: 40, y: bottom, w: 400, h: 0, cls: c, keys: [{ t: start(i), y: bottom, h: 0 }, { t: start(i) + 0.12, y: bottom - H, h: H }] };
});

const scene: RunScene = {
  w: 480,
  h: 290,
  ms: 7500,
  live: 'Flood after flood dropped mud and sand in the lake. Each new layer landed on top of the last one. A shell and a bone got buried. The bottom layer is the oldest, and the top layer is the newest.',
  bg: '<rect class="g3s-sky" width="480" height="290"/><rect class="g3s-water" x="40" y="40" width="400" height="222"/><rect class="g3s-rock" x="40" y="262" width="400" height="20"/><path class="g3s-box" d="M40,30 V282 H440 V30"/>',
  sprites: [
    ...layers,
    showFrom({ kind: 'emoji', text: '🐚', x: 120, y: BASE - 20, size: 34 }, start(0) + 0.1),
    showFrom({ kind: 'emoji', text: '🦴', x: 300, y: BASE - H - 20, size: 36 }, start(1) + 0.1),
    ...falling('💧', 10, 60, 420, 42, 76, 0.05, 0.85, 16),
    showFrom({ kind: 'text', text: 'Oldest', x: 430, y: BASE - 19, size: 18, anchor: 'end', cls: 'g3s-label' }, 0.88),
    showFrom({ kind: 'text', text: 'Newest', x: 430, y: BASE - H * 4 - 19, size: 18, anchor: 'end', cls: 'g3s-label' }, 0.88),
    ticker(240, 16, [[0, 'A lake, long ago'], [start(1), 'Flood after flood…'], [0.88, 'Millions of years later']], 20, 'middle'),
  ],
};
export default scene;
