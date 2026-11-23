// How paleontologists know dinosaurs lived millions of years ago (SCI3-OI3-GQ1-LO1 K4.1, K4.2,
// U4.1, S4.2): fossil bones lie in deep, old layers that took millions of years to pile up, and they
// are found in many places around the world, on every continent.
import { only, type PlayScene, type Sprite } from '../g3-sprites.ts';

const n = 3;
const cliff = (i: number): Sprite[] =>
  ['g3s-l1', 'g3s-l3', 'g3s-l2', 'g3s-l4', 'g3s-l1', 'g3s-l5'].map((cls, k) => only({ kind: 'rect', x: 40, y: 40 + k * 34, w: 400, h: 34, cls }, i, n));

const scene: PlayScene = {
  w: 480,
  h: 260,
  mode: 'steps',
  next: 'Next ▶',
  back: '◀ Back',
  states: [
    { label: 'Deep down', say: 'Dinosaur bones are found in rock layers deep below the surface. Deeper layers are older.' },
    { label: 'Slow layers', say: 'A layer of rock takes a very long time to pile up. So many layers took millions of years.' },
    { label: 'All over the world', say: 'Dinosaur bones are found in many places around the world, on every continent, even icy Antarctica.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="260"/>',
  sprites: [
    ...cliff(0),
    only({ kind: 'emoji', text: '🦴', x: 300, y: 210, size: 34 }, 0, n),
    only({ kind: 'text', text: 'Older ▼', x: 460, y: 140, size: 18, anchor: 'end', cls: 'g3s-label' }, 0, n),
    ...cliff(1),
    ...[0, 1, 2, 3, 4, 5].map((k) => only({ kind: 'text', text: '⏳', x: 240, y: 57 + k * 34, size: 20 }, 1, n)),
    only({ kind: 'text', text: 'Millions of years', x: 240, y: 20, size: 20, cls: 'g3s-label' }, 1, n),
    only({ kind: 'emoji', text: '🌎', x: 100, y: 130, size: 100 }, 2, n),
    only({ kind: 'emoji', text: '🌍', x: 240, y: 130, size: 100 }, 2, n),
    only({ kind: 'emoji', text: '🌏', x: 380, y: 130, size: 100 }, 2, n),
    ...[[80, 110], [120, 150], [230, 110], [260, 160], [370, 120], [400, 165]].map(([x, y]) => only({ kind: 'emoji', text: '🦴', x, y, size: 26 }, 2, n)),
  ],
};
export default scene;
