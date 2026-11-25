// Plants and animals depend on each other (SCI3-OI4-GQ1-LO1 K4.2, S4.3): animals need plants for food
// and homes, and plants need animals to carry their pollen and seeds.
import { only, type PlayScene } from '../g3-sprites.ts';

const n = 4;
const scene: PlayScene = {
  w: 480,
  h: 250,
  mode: 'jump',
  states: [
    { label: '🍃 Food', say: 'A moose eats willow twigs and leaves. Animals depend on plants for food.' },
    { label: '🏠 Habitat', say: 'A woodpecker carves a hole in a tree to make its nest. Plants give animals homes.' },
    { label: '🐝 Pollen', say: 'A bee drinks from flowers and carries pollen from one to the next. Then the plants can make seeds.' },
    { label: '🌱 Seeds', say: 'A bird eats berries and drops the seeds far away. New plants grow there.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="250"/><rect class="g3s-grass" y="200" width="480" height="50"/>',
  sprites: [
    only({ kind: 'emoji', text: '🌿', x: 330, y: 170, size: 70 }, 0, n),
    only({ kind: 'emoji', text: '🫎', x: 180, y: 150, size: 100 }, 0, n),
    only({ kind: 'rect', x: 210, y: 60, w: 50, h: 145, cls: 'g3s-wood' }, 1, n),
    only({ kind: 'emoji', text: '🌳', x: 235, y: 50, size: 110 }, 1, n),
    only({ kind: 'ellipse', x: 235, y: 130, w: 24, h: 30, cls: 'g3s-dark' }, 1, n),
    only({ kind: 'emoji', text: '🐦', x: 285, y: 128, size: 40 }, 1, n),
    ...[120, 240, 360].map((x) => only({ kind: 'emoji', text: '🌼', x, y: 180, size: 50 }, 2, n)),
    only({ kind: 'path', d: 'M120,150 Q180,90 240,150 Q300,90 360,150', cls: 'g3s-thin' }, 2, n),
    only({ kind: 'emoji', text: '🐝', x: 300, y: 112, size: 40 }, 2, n),
    only({ kind: 'emoji', text: '🫐', x: 80, y: 150, size: 46 }, 3, n),
    only({ kind: 'emoji', text: '🐦', x: 240, y: 70, size: 50 }, 3, n),
    only({ kind: 'path', d: 'M100,120 Q170,40 240,90 Q330,140 380,180', cls: 'g3s-thin' }, 3, n),
    only({ kind: 'emoji', text: '🌱', x: 390, y: 185, size: 40 }, 3, n),
  ],
};
export default scene;
