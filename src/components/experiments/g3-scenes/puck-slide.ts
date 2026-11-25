// Newton's first law (SCI3-OI2-GQ1-LO1 K1.2, S1.4, S1.5): a puck sits still on smooth ice until a
// stick hits it. Then it slides across the rink until the boards stop it.
import { ticker, type RunScene } from '../../visuals/g3-sprites.ts';

const HIT = 0.35;
const WALL = 0.8;
const scene: RunScene = {
  w: 480,
  h: 260,
  ms: 6500,
  live: 'The puck stayed still until the stick hit it. Then it slid across the ice and kept going until it hit the boards.',
  bg: '<rect class="g3s-ice" x="0" y="40" width="480" height="200"/><rect class="g3s-wood" x="452" y="40" width="28" height="200"/><line class="g3s-thin" x1="240" y1="40" x2="240" y2="240"/>',
  sprites: [
    { kind: 'emoji', text: '🏒', x: 20, y: 150, size: 64, r: -30, keys: [{ t: HIT - 0.12, x: 20, r: -30 }, { t: HIT, x: 56, r: 0 }, { t: HIT + 0.1, x: 40, r: -10 }] },
    { kind: 'ellipse', x: 110, y: 170, w: 50, h: 18, cls: 'g3s-road', keys: [{ t: HIT, x: 110 }, { t: WALL, x: 430 }, { t: WALL + 0.06, x: 418 }] },
    { kind: 'arrow', x: 60, y: 130, w: 0, h: 12, r: 0, cls: 'g3s-push', keys: [{ t: HIT - 0.02, w: 0, o: 1 }, { t: HIT + 0.02, w: 50 }, { t: HIT + 0.12, w: 50, o: 1 }, { t: HIT + 0.16, o: 0 }] },
    { kind: 'arrow', x: 450, y: 130, w: 0, h: 12, r: 180, cls: 'g3s-push', keys: [{ t: WALL - 0.02, w: 0, o: 1 }, { t: WALL + 0.02, w: 40 }, { t: WALL + 0.12, w: 40, o: 1 }, { t: WALL + 0.16, o: 0 }] },
    ticker(240, 22, [[0, 'Nothing touches the puck…'], [HIT, 'The stick pushes it!'], [HIT + 0.12, 'It keeps sliding…'], [WALL, 'The boards push back. Stop!']], 22, 'middle'),
    { kind: 'text', text: 'Not moving', x: 110, y: 210, size: 20, cls: 'g3s-soft', keys: [{ t: HIT - 0.06, o: 1 }, { t: HIT - 0.02, o: 0 }] },
  ],
};
export default scene;
