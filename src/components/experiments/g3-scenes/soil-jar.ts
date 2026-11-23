// What is in soil? (SCI3-OI3-GQ1-LO1 K5.1, S5.1): shake garden soil in a jar of water and let it
// settle. Rock bits sink into layers, the heaviest first. Bits of dead leaves float to the top, and
// bubbles of air rise out of the soil.
import { showFrom, ticker, type RunScene, type Sprite } from '../../visuals/g3-sprites.ts';

const SHAKE = 0.12;
const STILL = 0.36;
const X = 170;
const W = 140;
const BOT = 262;
// settled layers: pebbles, sand, then fine mud on top
const settle = (h: number, top: number, cls: string, t0: number): Sprite => ({ kind: 'rect', x: X, y: BOT, w: W, h: 0, cls, keys: [{ t: t0, y: BOT - top, h: 0 }, { t: t0 + 0.18, y: BOT - top - h, h }] });
/** x keys that wobble the jar and everything in it from side to side. */
const shake = (x0: number) => [0, -12, 12, -12, 12].map((dx, i) => ({ t: SHAKE + i * 0.04, x: x0 + dx })).concat([{ t: STILL - 0.04, x: x0 }]);
const bubbles: Sprite[] = [0, 1, 2, 3, 4].map((i) => {
  const t0 = SHAKE + 0.02 + i * 0.05;
  const x = X + 25 + i * 22;
  return { kind: 'ellipse', x, y: 230, w: 10, h: 10, cls: 'g3s-snow', o: 0, keys: [{ t: t0, o: 0, y: 230 }, { t: t0 + 0.01, o: 1 }, { t: t0 + 0.14, y: 96, o: 1 }, { t: t0 + 0.16, o: 0 }] };
});

const scene: RunScene = {
  w: 480,
  h: 290,
  ms: 7000,
  live: 'The soil swirled around in the water. Then it settled into layers: pebbles at the bottom, then sand, then fine mud. Bits of dead leaves floated to the top, and air bubbles rose out of the soil.',
  bg: '<rect class="g3s-sky" width="480" height="290"/><rect class="g3s-wood" x="60" y="268" width="360" height="14" rx="4"/>',
  sprites: [
    { kind: 'rect', x: X, y: 90, w: W, h: 172, cls: 'g3s-water', keys: shake(X) },
    // the soil before shaking
    { kind: 'rect', x: X, y: 196, w: W, h: 66, cls: 'g3s-dark', keys: [{ t: SHAKE, o: 1 }, { t: SHAKE + 0.06, o: 0 }, ...shake(X)] },
    // muddy water while it swirls, clearing as it settles
    { kind: 'rect', x: X, y: 90, w: W, h: 172, cls: 'g3s-mud', o: 0, keys: [...shake(X), { t: SHAKE, o: 0 }, { t: SHAKE + 0.06, o: 0.9 }, { t: STILL, o: 0.9 }, { t: 0.85, o: 0.15 }] },
    settle(22, 0, 'g3s-rock', STILL),
    settle(22, 22, 'g3s-sand', STILL + 0.12),
    settle(22, 44, 'g3s-mud', STILL + 0.24),
    ...bubbles,
    showFrom({ kind: 'emoji', text: '🍂', x: X + 40, y: 100, size: 26 }, STILL + 0.3),
    showFrom({ kind: 'emoji', text: '🍂', x: X + 100, y: 102, size: 22 }, STILL + 0.34),
    // the jar shakes
    { kind: 'path', d: `M${X - 6},80 V266 H${X + W + 6} V80`, cls: 'g3s-box', keys: shake(0) },
    showFrom({ kind: 'text', text: 'Leaf bits', x: X + W + 16, y: 104, size: 17, anchor: 'start', cls: 'g3s-label' }, 0.85),
    showFrom({ kind: 'text', text: 'Mud', x: X + W + 16, y: BOT - 55, size: 17, anchor: 'start', cls: 'g3s-label' }, 0.85),
    showFrom({ kind: 'text', text: 'Sand', x: X + W + 16, y: BOT - 33, size: 17, anchor: 'start', cls: 'g3s-label' }, 0.85),
    showFrom({ kind: 'text', text: 'Pebbles', x: X + W + 16, y: BOT - 11, size: 17, anchor: 'start', cls: 'g3s-label' }, 0.85),
    ticker(240, 30, [[0, 'Soil and water in a jar'], [SHAKE, 'Shake, shake!'], [STILL, 'Let it sit…']], 20, 'middle'),
  ],
};
export default scene;
