// Animals use their senses to find food, notice predators and find each other (SCI3-OI4-GQ1-LO1
// K3.2, U3.1): a black bear smells berries from far away, a Richardson's ground squirrel sees a hawk
// and gives a warning whistle, and wolf pups hear their pack howl.
import { only, type PlayScene } from '../g3-sprites.ts';

const n = 3;
const scene: PlayScene = {
  w: 480,
  h: 250,
  mode: 'jump',
  states: [
    { label: '🫐 Food', say: 'A bear can smell berries from far away. It follows the smell to find food.' },
    { label: '🦅 Predator', say: 'A ground squirrel sees a hawk. It whistles a warning and dives into its burrow.' },
    { label: '🐺 Each other', say: 'Wolf pups hear their pack howl. They know where their family is.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="250"/><rect class="g3s-grass" y="190" width="480" height="60"/>',
  sprites: [
    // food
    only({ kind: 'emoji', text: '🐻', x: 90, y: 160, size: 80 }, 0, n),
    only({ kind: 'path', d: 'M180,120 Q220,100 260,120 Q300,140 340,120', cls: 'g3s-thin' }, 0, n),
    only({ kind: 'emoji', text: '🫐', x: 390, y: 160, size: 50 }, 0, n),
    only({ kind: 'emoji', text: '🌳', x: 420, y: 130, size: 90 }, 0, n),
    // predator
    only({ kind: 'emoji', text: '🦅', x: 330, y: 60, size: 60 }, 1, n),
    only({ kind: 'path', d: 'M150,150 L300,72', cls: 'g3s-thin' }, 1, n),
    only({ kind: 'emoji', text: '🐿️', x: 130, y: 166, size: 50 }, 1, n),
    only({ kind: 'text', text: 'Peep!', x: 80, y: 120, size: 22, cls: 'g3s-label' }, 1, n),
    only({ kind: 'ellipse', x: 210, y: 196, w: 50, h: 18, cls: 'g3s-dark' }, 1, n),
    // each other
    only({ kind: 'emoji', text: '🐺', x: 380, y: 140, size: 70 }, 2, n),
    only({ kind: 'text', text: 'Awoooo!', x: 380, y: 70, size: 24, cls: 'g3s-label' }, 2, n),
    only({ kind: 'emoji', text: '🐺', x: 110, y: 170, size: 40 }, 2, n),
    only({ kind: 'emoji', text: '🐺', x: 160, y: 174, size: 36 }, 2, n),
    only({ kind: 'emoji', text: '👂', x: 135, y: 120, size: 30 }, 2, n),
  ],
};
export default scene;
