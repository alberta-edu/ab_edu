// Plants respond to light (SCI3-OI4-GQ1-LO1 K3.1, U3.1, S3.1): a bean plant on a windowsill bends
// toward the window over a week, to get more light.
import { ticker, type RunScene, type Sprite, type Key } from '../../visuals/g3-sprites.ts';

const BX = 200;
const BY = 226;
const LEN = 100;
const bend = [0, 0, 8, 18, 28, 34];
const ts = [0, 0.15, 0.35, 0.55, 0.75, 0.9];
const tip = (deg: number) => [BX + LEN * Math.sin((deg * Math.PI) / 180), BY - LEN * Math.cos((deg * Math.PI) / 180)];
const leaf = (dx: number, size: number): Sprite => ({
  kind: 'emoji', text: '🌿', size, x: tip(0)[0] + dx, y: tip(0)[1],
  keys: ts.map((t, i): Key => ({ t, x: tip(bend[i])[0] + dx, y: tip(bend[i])[1], r: bend[i] })),
});

const scene: RunScene = {
  w: 480,
  h: 280,
  ms: 7000,
  live: 'Day by day, the bean plant bent toward the window. It grew toward the light.',
  bg:
    '<rect class="g3s-sky" width="480" height="280"/>' +
    '<rect class="g3s-chip" x="360" y="20" width="110" height="200" rx="4"/><rect class="g3s-beam" x="368" y="28" width="94" height="184"/>' +
    '<path class="g3s-beam" d="M362,40 L362,210 L180,262 L120,262 Z"/>' +
    '<rect class="g3s-wood" x="0" y="262" width="480" height="18"/><path class="g3s-clay" d="M160,226 L240,226 L232,262 L168,262 Z"/>',
  sprites: [
    { kind: 'path', d: `M0,0 L0,${-LEN}`, x: BX, y: BY, fill: 'none', stroke: '#3f9a40', sw: 7, r: 0, keys: ts.map((t, i) => ({ t, r: bend[i] })) },
    leaf(-14, 34),
    leaf(14, 30),
    { kind: 'emoji', text: '☀️', x: 415, y: 70, size: 48 },
    ticker(20, 28, [[0, 'Day 1'], [ts[2], 'Day 3'], [ts[3], 'Day 5'], [ts[5], 'Day 7']], 22),
  ],
};
export default scene;
