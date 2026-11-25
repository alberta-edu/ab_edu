// Animals sense and respond to water, temperature and light (SCI3-OI4-GQ1-LO1 K3.1, U3.1, S3.1):
// a thirsty moose goes to the lake, a garter snake warms up on a sunny rock and moves to the shade
// when it is hot, and sowbugs hide from light under a rock.
import { only, type PlayScene } from '../g3-sprites.ts';

const n = 3;
const scene: PlayScene = {
  w: 480,
  h: 250,
  mode: 'jump',
  states: [
    { label: '💧 Water', say: 'A thirsty moose smells and sees the lake. It walks to the water to drink.' },
    { label: '🌡️ Temperature', say: 'A garter snake lies on a sunny rock to warm up. When it gets too hot, it moves into the shade.' },
    { label: '💡 Light', say: 'Lift a rock, and sowbugs hurry away from the light. They hide where it is dark and damp.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="250"/><rect class="g3s-grass" y="180" width="480" height="70"/>',
  sprites: [
    // water
    only({ kind: 'ellipse', x: 360, y: 210, w: 220, h: 60, cls: 'g3s-water' }, 0, n),
    only({ kind: 'emoji', text: '🫎', x: 170, y: 150, size: 80 }, 0, n),
    only({ kind: 'arrow', x: 220, y: 190, w: 70, h: 10, r: 10, cls: 'g3s-push' }, 0, n),
    // temperature
    only({ kind: 'emoji', text: '☀️', x: 70, y: 50, size: 54 }, 1, n),
    only({ kind: 'path', d: 'M80,190 Q140,140 200,190 Z', cls: 'g3s-rock' }, 1, n),
    only({ kind: 'emoji', text: '🐍', x: 140, y: 160, size: 44 }, 1, n),
    only({ kind: 'emoji', text: '🌳', x: 380, y: 120, size: 120 }, 1, n),
    only({ kind: 'ellipse', x: 380, y: 196, w: 150, h: 26, cls: 'g3s-wet' }, 1, n),
    only({ kind: 'arrow', x: 210, y: 175, w: 110, h: 10, r: 0, cls: 'g3s-push' }, 1, n),
    // light
    only({ kind: 'path', d: 'M180,170 Q250,90 320,150 Z', cls: 'g3s-rock' }, 2, n),
    only({ kind: 'ellipse', x: 240, y: 200, w: 160, h: 30, cls: 'g3s-dark' }, 2, n),
    // sowbugs: small grey bugs, heading for the dark under the rock
    ...[[110, 214], [140, 226], [370, 220]].flatMap(([x, y]) => [
      only({ kind: 'ellipse', x, y, w: 26, h: 16, cls: 'g3s-rock' }, 2, n),
      only({ kind: 'arrow', x: x + (x < 240 ? 18 : -18), y, w: 30, h: 6, r: x < 240 ? 0 : 180, cls: 'g3s-soft' }, 2, n),
    ]),
    only({ kind: 'text', text: 'Sowbugs', x: 125, y: 238, size: 17, cls: 'g3s-label' }, 2, n),
    only({ kind: 'emoji', text: '🔦', x: 90, y: 90, size: 50 }, 2, n),
  ],
};
export default scene;
