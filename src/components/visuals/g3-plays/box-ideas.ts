// Divergent thinking (SCI3-OI6-GQ1-LO1 K2.2, U2.1, U2.2): one cardboard box, many different ideas.
// Imagination turns it into a race car, a castle and a robot costume.
import { only, from, type PlayScene, type Sprite } from '../g3-sprites.ts';

const n = 4;
const scene: PlayScene = {
  w: 480,
  h: 250,
  mode: 'steps',
  next: 'Another idea ▶',
  back: '◀ Back',
  states: [
    { label: 'A box', say: 'What could this box be? Think of as many ideas as you can!' },
    { label: 'Race car', say: 'Add wheels and a driver. It’s a race car!' },
    { label: 'Castle', say: 'Cut out towers and a door. It’s a castle!' },
    { label: 'Robot', say: 'Add eyes and an antenna. It’s a robot! Thinking up lots of different ideas is called divergent thinking.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="250"/><rect class="g3s-wood" y="215" width="480" height="35"/>',
  sprites: [
    only({ kind: 'emoji', text: '🤔', x: 400, y: 80, size: 54 }, 0, n),
    // the castle's towers sit behind the box
    ...[150, 330].map((x): Sprite => only({ kind: 'rect', x: x - 22, y: 70, w: 44, h: 145, cls: 'g3s-hide' }, 2, n)),
    ...[136, 164, 316, 344].map((x): Sprite => only({ kind: 'rect', x: x - 8, y: 56, w: 16, h: 16, cls: 'g3s-hide' }, 2, n)),
    { kind: 'rect', x: 160, y: 110, w: 160, h: 100, rx: 4, cls: 'g3s-hide' },
    // race car
    only({ kind: 'emoji', text: '🧒', x: 240, y: 92, size: 44 }, 1, n),
    ...[190, 290].map((x): Sprite => only({ kind: 'ellipse', x, y: 212, w: 40, h: 40, cls: 'g3s-road' }, 1, n)),
    only({ kind: 'emoji', text: '🏁', x: 410, y: 120, size: 50 }, 1, n),
    // castle
    only({ kind: 'path', d: 'M-22,50 L-22,10 Q0,-14 22,10 L22,50 Z', x: 240, y: 160, cls: 'g3s-dark' }, 2, n),
    only({ kind: 'emoji', text: '🚩', x: 156, y: 36, size: 30 }, 2, n),
    // robot
    ...[205, 275].map((x): Sprite => only({ kind: 'ellipse', x, y: 145, w: 34, h: 34, cls: 'g3s-paint' }, 3, n)),
    ...[205, 275].map((x): Sprite => only({ kind: 'ellipse', x, y: 145, w: 14, h: 14, cls: 'g3s-road' }, 3, n)),
    only({ kind: 'rect', x: 210, y: 178, w: 60, h: 12, rx: 4, cls: 'g3s-metal' }, 3, n),
    only({ kind: 'line', x: 240, y: 110, x2: 240, y2: 80, cls: 'g3s-line' }, 3, n),
    only({ kind: 'ellipse', x: 240, y: 76, w: 16, h: 16, cls: 'g3s-hot' }, 3, n),
    from({ kind: 'text', text: '💡 Many ideas', x: 400, y: 80, size: 20, cls: 'g3s-label' }, 3, n),
  ],
};
export default scene;
