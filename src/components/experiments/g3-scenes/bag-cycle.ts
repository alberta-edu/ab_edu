// The water cycle in a bag (SCI3-OI1-GQ1-LO1 K5.2, K5.4, U5.1, S5.1): a sealed bag of water taped to
// a sunny window. Water evaporates, condenses into drops near the top, and the drops run back down.
import { showFrom, ticker, type RunScene, type Sprite } from '../../visuals/g3-sprites.ts';

const WAVE = 'M0,0 q7,-9 0,-18 q-7,-9 0,-18';
const vapour: Sprite[] = [];
for (let i = 0; i < 8; i++) {
  const t0 = 0.08 + i * 0.05;
  vapour.push({ kind: 'path', d: WAVE, x: 190 + (i % 4) * 34, y: 196, cls: 'g3s-vapour', o: 0, keys: [{ t: t0, o: 0, y: 196 }, { t: t0 + 0.03, o: 1 }, { t: t0 + 0.16, y: 110, o: 0 }] });
}
// Drops form near the top, then run down the sides.
const drops: Sprite[] = [[186, 84], [218, 76], [252, 82], [286, 74], [306, 90], [200, 100], [272, 98]].map(([x, y], i) => ({
  kind: 'ellipse', x, y, w: 0, h: 0, cls: 'g3s-drop',
  keys: [{ t: 0.36 + i * 0.03, w: 0, h: 0 }, { t: 0.46 + i * 0.03, w: 12, h: 16 }, { t: 0.68 + (i % 3) * 0.04, y }, { t: 0.86 + (i % 3) * 0.04, y: 192, w: 12, h: 16 }, { t: 0.9 + (i % 3) * 0.04, w: 0, h: 0 }],
}));

const scene: RunScene = {
  w: 480,
  h: 300,
  ms: 7000,
  live: 'Water evaporated from the bottom of the bag. Drops formed near the top, then ran back down to the water.',
  bg: '<rect class="g3s-sky" width="480" height="300"/><rect class="g3s-wood" x="130" y="30" width="220" height="10"/><rect class="g3s-wood" x="130" y="236" width="220" height="10"/>',
  sprites: [
    { kind: 'emoji', text: '☀️', x: 410, y: 70, size: 64 },
    { kind: 'rect', x: 172, y: 182, w: 146, h: 34, cls: 'g3s-water' },
    ...vapour,
    ...drops,
    { kind: 'rect', x: 168, y: 58, w: 154, h: 160, rx: 14, cls: 'g3s-glass' },
    { kind: 'rect', x: 168, y: 58, w: 154, h: 12, cls: 'g3s-pull' },
    ticker(240, 274, [[0, 'A sealed bag of water'], [0.08, 'Evaporation ↑'], [0.4, 'Condensation: drops form'], [0.68, 'Precipitation: drops fall ↓']], 22, 'middle'),
    showFrom({ kind: 'text', text: 'Around and around!', x: 240, y: 22, size: 22, cls: 'g3s-label' }, 0.92),
  ],
};
export default scene;
