// Wind and water shape the land (SCI3-OI3-GQ1-LO1 K2.1, K2.5, S2.1, U2.1): rain and wind wear away
// soft rock, but hard stones on top protect the rock under them. Tall pillars, hoodoos, are left,
// as in Alberta's badlands near Drumheller.
import { falling, ticker, type RunScene, type Sprite } from '../../visuals/g3-sprites.ts';

const T0 = 0.12;
const T1 = 0.85;
const TOP = 110;
const pillars = [100, 250, 390];
const hoodoo = (x: number): Sprite[] => [
  { kind: 'path', d: 'M-16,0 L16,0 L30,130 L-30,130 Z', x, y: TOP + 6, cls: 'g3s-l1' },
  { kind: 'rect', x: x - 26, y: TOP + 50, w: 52, h: 12, cls: 'g3s-l3' },
  { kind: 'rect', x: x - 30, y: TOP - 8, w: 60, h: 16, rx: 6, cls: 'g3s-l5' },
];
const bits: Sprite[] = [];
for (let i = 0; i < 8; i++) {
  const t0 = T0 + i * 0.08;
  bits.push({ kind: 'ellipse', x: 40 + i * 50, y: 252, w: 10, h: 8, cls: 'g3s-l2', o: 0, keys: [{ t: t0, o: 0, x: 40 + i * 50 }, { t: t0 + 0.02, o: 1 }, { t: t0 + 0.14, x: 480, o: 1 }] });
}

const scene: RunScene = {
  w: 480,
  h: 270,
  ms: 7000,
  live: 'Rain and wind carried the soft rock away, bit by bit. Under each hard stone, the rock was protected. Tall pillars called hoodoos were left.',
  bg: '<rect class="g3s-sky" width="480" height="270"/><rect class="g3s-water" y="240" width="480" height="30"/>',
  sprites: [
    ...pillars.flatMap(hoodoo).filter((s) => s.cls !== 'g3s-l5'),
    // the soft rock layer wears down around the pillars
    { kind: 'rect', x: 0, y: TOP, w: 480, h: 130, cls: 'g3s-l1', keys: [{ t: T0, y: TOP, h: 130 }, { t: T1, y: 226, h: 14 }] },
    { kind: 'rect', x: 0, y: TOP + 50, w: 480, h: 12, cls: 'g3s-l3', keys: [{ t: T0, o: 1 }, { t: (T0 + T1) / 2 - 0.05, o: 1 }, { t: (T0 + T1) / 2, o: 0 }] },
    ...pillars.flatMap(hoodoo).filter((s) => s.cls === 'g3s-l5'),
    ...bits,
    ...falling('💧', 8, 30, 450, 20, 100, 0.05, 0.9, 18),
    { kind: 'emoji', text: '💨', x: 10, y: 60, size: 34, keys: [{ t: 0.1, x: 10 }, { t: 0.9, x: 470 }] },
    ticker(240, 24, [[0, 'Soft rock with hard stones on top'], [T0 + 0.1, 'Thousands of years later…'], [T1, 'Hoodoos!']], 20, 'middle'),
  ],
};
export default scene;
