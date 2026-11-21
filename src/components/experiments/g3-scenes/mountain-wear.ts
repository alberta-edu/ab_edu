// Slow changes to Earth's surface (SCI3-OI3-GQ1-LO1 K1.1, U1.1, S1.1): rain, ice and wind break
// bits off a tall, sharp mountain. Over a very long time it wears down, low and round.
import { falling, ticker, type RunScene, type Sprite } from '../../visuals/g3-sprites.ts';

const TALL = 'M40,250 L150,70 L190,120 L240,40 L300,130 L340,90 L440,250 Z';
const MID = 'M40,250 L150,105 L190,135 L240,85 L300,145 L340,125 L440,250 Z';
const LOW = 'M40,250 Q140,150 240,140 Q340,150 440,250 Z';
const fade = (d: string, keys: { t: number; o: number }[]): Sprite => ({ kind: 'path', d, cls: 'g3s-rock', o: keys[0].o, keys });

const pebbles: Sprite[] = [];
for (let i = 0; i < 7; i++) {
  const t0 = 0.12 + i * 0.1;
  const left = i % 2 === 0;
  pebbles.push({ kind: 'ellipse', x: 240 + (left ? -20 : 20), y: 70 + i * 6, w: 12, h: 10, cls: 'g3s-l4', o: 0, keys: [{ t: t0 - 0.01, o: 0 }, { t: t0, o: 1, x: 240 + (left ? -20 : 20), y: 70 + i * 6 }, { t: t0 + 0.12, x: left ? 90 + i * 6 : 390 - i * 6, y: 244, o: 1 }, { t: Math.min(1, t0 + 0.16), o: 0 }] });
}

const scene: RunScene = {
  w: 480,
  h: 300,
  ms: 7000,
  live: 'Rain, snow and wind broke tiny bits off the mountain, a little at a time. After about a million years, the tall, sharp mountain was low and round.',
  bg: '<rect class="g3s-sky" width="480" height="300"/><rect class="g3s-grass" y="250" width="480" height="50"/>',
  sprites: [
    fade(TALL, [{ t: 0, o: 1 }, { t: 0.3, o: 1 }, { t: 0.42, o: 0 }]),
    fade(MID, [{ t: 0, o: 0 }, { t: 0.3, o: 0 }, { t: 0.42, o: 1 }, { t: 0.62, o: 1 }, { t: 0.74, o: 0 }]),
    fade(LOW, [{ t: 0, o: 0 }, { t: 0.62, o: 0 }, { t: 0.74, o: 1 }]),
    ...pebbles,
    { kind: 'ellipse', x: 80, y: 250, w: 0, h: 0, cls: 'g3s-l4', keys: [{ t: 0.15, w: 0, h: 0 }, { t: 0.9, w: 110, h: 26 }] },
    { kind: 'ellipse', x: 400, y: 250, w: 0, h: 0, cls: 'g3s-l4', keys: [{ t: 0.15, w: 0, h: 0 }, { t: 0.9, w: 110, h: 26 }] },
    ...falling('💧', 6, 60, 420, 20, 140, 0.05, 0.95, 18),
    ...falling('❄️', 5, 100, 380, 20, 120, 0.1, 0.9, 18),
    { kind: 'emoji', text: '💨', x: 20, y: 120, size: 34, keys: [{ t: 0.1, x: 20 }, { t: 0.9, x: 460 }] },
    ticker(240, 280, [[0, 'Now'], [0.3, 'Thousands of years later…'], [0.62, 'About a million years later!']], 22, 'middle'),
  ],
};
export default scene;
