// How a dinosaur bone becomes a fossil we can find (SCI3-OI3-GQ1-LO1 K4.1, K4.2, K4.4, S4.2): a
// dinosaur dies by a river, mud buries it, layers pile up for millions of years and the bone turns
// to stone, then wind and water wear the layers away until the bone shows at the surface.
import { only, from, type PlayScene, type Sprite } from '../g3-sprites.ts';

const n = 4;
const layer = (y: number, cls: string, i: number): Sprite => from({ kind: 'rect', x: 0, y, w: 480, h: 34, cls }, i, n, 2);

const scene: PlayScene = {
  w: 480,
  h: 260,
  mode: 'steps',
  next: 'Next ▶',
  back: '◀ Back',
  states: [
    { label: 'Long ago', say: 'Millions of years ago, a dinosaur died beside a river.' },
    { label: 'Buried', say: 'Mud and sand from the river covered its bones.' },
    { label: 'Turned to stone', say: 'More layers piled on top. Over millions of years, the bones slowly turned to stone. They became fossils.' },
    { label: 'Found!', say: 'Wind and water wore the top layers away. Now a fossil bone pokes out of the hill.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="260"/><rect class="g3s-l5" y="226" width="480" height="34"/>',
  sprites: [
    // a river bank, long ago
    only({ kind: 'rect', x: 0, y: 192, w: 480, h: 34, cls: 'g3s-grass' }, 0, n),
    from({ kind: 'rect', x: 320, y: 196, w: 160, h: 30, cls: 'g3s-water' }, 0, n, 1),
    only({ kind: 'emoji', text: '🌴', x: 60, y: 140, size: 70 }, 0, n),
    only({ kind: 'emoji', text: '🦕', x: 200, y: 160, size: 70 }, 0, n),
    // mud and layers pile up over the bones
    layer(192, 'g3s-mud', 1),
    layer(158, 'g3s-l2', 2),
    layer(124, 'g3s-l3', 2),
    layer(90, 'g3s-l1', 2),
    only({ kind: 'path', d: 'M0,226 L0,190 Q120,130 240,180 Q340,210 480,200 L480,226 Z', cls: 'g3s-l2' }, 3, n),
    // the bones, deep in the layers, then at the surface of a hill
    { kind: 'emoji', text: '🦴', x: 200, y: 210, size: 36, o: 0, keys: [{ t: 0, o: 0 }, { t: 1, o: 1, y: 210 }, { t: 2, o: 1, y: 210 }, { t: 3, o: 1, y: 178 }] },
    only({ kind: 'text', text: 'Fossil', x: 270, y: 210, size: 20, cls: 'g3s-label' }, 2, n),
    only({ kind: 'emoji', text: '💨', x: 380, y: 120, size: 44 }, 3, n),
    only({ kind: 'emoji', text: '🌧️', x: 100, y: 60, size: 50 }, 3, n),
  ],
};
export default scene;
