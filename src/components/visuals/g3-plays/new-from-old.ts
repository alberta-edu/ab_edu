// Creativity combines, changes or reapplies ideas that already exist (SCI3-OI6-GQ1-LO1 K2.4, U2.2,
// S2.3). Combine: a pencil with an eraser on top (patented by Hymen Lipman, 1858). Change: a bike
// with no pedals, for learning to balance. Reapply: George de Mestral looked closely at burdock burrs
// stuck to his dog’s fur and invented hook-and-loop fasteners (Velcro), now used on shoes.
import { only, type PlayScene, type Sprite } from '../g3-sprites.ts';

const n = 3;
const arrow = (i: number): Sprite => only({ kind: 'arrow', x: 200, y: 120, w: 70, h: 10, r: 0, cls: 'g3s-push' }, i, n);
const scene: PlayScene = {
  w: 480,
  h: 230,
  mode: 'jump',
  states: [
    { label: '➕ Combine', say: 'Combine: put two ideas together. A pencil plus an eraser made a pencil with an eraser on top.' },
    { label: '🔄 Change', say: 'Change: make an idea different. A bike with no pedals helps little kids learn to balance.' },
    { label: '🔁 Reapply', say: 'Reapply: use an idea in a new place. Burrs stuck on a dog gave an inventor the idea for sticky shoe straps.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="230"/>',
  sprites: [
    // combine
    only({ kind: 'emoji', text: '✏️', x: 70, y: 120, size: 60 }, 0, n),
    only({ kind: 'text', text: '+', x: 122, y: 120, size: 40, cls: 'g3s-label' }, 0, n),
    only({ kind: 'rect', x: 146, y: 104, w: 40, h: 32, rx: 6, fill: '#f29bb0', stroke: '#9a4a5e', sw: 2 }, 0, n),
    arrow(0),
    only({ kind: 'path', d: 'M0,-10 L110,-10 L110,10 L0,10 L-22,0 Z', x: 320, y: 120, fill: '#f2c230', stroke: '#6b4423', sw: 2 }, 0, n),
    only({ kind: 'rect', x: 430, y: 110, w: 26, h: 20, rx: 4, fill: '#f29bb0', stroke: '#9a4a5e', sw: 2 }, 0, n),
    // change
    only({ kind: 'emoji', text: '🚲', x: 100, y: 120, size: 90 }, 1, n),
    arrow(1),
    only({ kind: 'emoji', text: '🚲', x: 370, y: 130, size: 60 }, 1, n),
    only({ kind: 'text', text: 'No pedals', x: 370, y: 180, size: 18, cls: 'g3s-label' }, 1, n),
    // reapply
    only({ kind: 'emoji', text: '🐕', x: 100, y: 130, size: 90 }, 2, n),
    ...[[80, 112], [124, 142]].map(([x, y]): Sprite => only({ kind: 'emoji', text: '🌰', x, y, size: 24 }, 2, n)),
    only({ kind: 'emoji', text: '🔍', x: 160, y: 70, size: 40 }, 2, n),
    arrow(2),
    only({ kind: 'emoji', text: '👟', x: 370, y: 120, size: 90 }, 2, n),
  ],
};
export default scene;
