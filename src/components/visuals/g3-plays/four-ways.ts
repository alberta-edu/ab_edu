// Ways to apply a contact force (SCI3-OI2-GQ1-LO1 K1.5): stretching, pulling, squeezing and pushing.
import { only, type PlayScene, type Sprite } from '../g3-sprites.ts';

const n = 5;
const sprites: Sprite[] = [
  // 0 start: a hand ready
  only({ kind: 'emoji', text: '✋', x: 240, y: 110, size: 90 }, 0, n),
  // 1 stretching an elastic band
  { kind: 'rect', x: 200, y: 112, w: 80, h: 14, rx: 7, cls: 'g3s-wool', o: 0, keys: [{ t: 0, o: 0, x: 200, w: 80 }, { t: 0.6, o: 1 }, { t: 1, x: 120, w: 240 }, { t: 1.4, o: 1 }, { t: 1.6, o: 0, x: 200, w: 80 }] },
  only({ kind: 'arrow', x: 120, y: 160, w: 70, h: 12, r: 180, cls: 'g3s-pull' }, 1, n),
  only({ kind: 'arrow', x: 360, y: 160, w: 70, h: 12, r: 0, cls: 'g3s-pull' }, 1, n),
  // 2 pulling a sled
  { kind: 'emoji', text: '🛷', x: 140, y: 140, size: 70, o: 0, keys: [{ t: 1, o: 0, x: 140 }, { t: 1.5, o: 1 }, { t: 2, x: 260 }, { t: 2.4, o: 1 }, { t: 2.6, o: 0, x: 140 }] },
  only({ kind: 'arrow', x: 330, y: 132, w: 90, h: 12, r: 0, cls: 'g3s-pull' }, 2, n),
  // 3 squeezing play dough
  { kind: 'ellipse', x: 240, y: 130, w: 100, h: 100, cls: 'g3s-clay', o: 0, keys: [{ t: 2, o: 0, w: 100, h: 100 }, { t: 2.6, o: 1 }, { t: 3, w: 170, h: 50 }, { t: 3.4, o: 1 }, { t: 3.6, o: 0, w: 100, h: 100 }] },
  only({ kind: 'arrow', x: 240, y: 20, w: 60, h: 12, r: 90, cls: 'g3s-push' }, 3, n),
  only({ kind: 'arrow', x: 240, y: 240, w: 60, h: 12, r: -90, cls: 'g3s-push' }, 3, n),
  // 4 pushing a box
  { kind: 'rect', x: 150, y: 90, w: 90, h: 80, rx: 4, cls: 'g3s-wood', o: 0, keys: [{ t: 3, o: 0, x: 150 }, { t: 3.6, o: 1 }, { t: 4, x: 290 }] },
  only({ kind: 'arrow', x: 200, y: 130, w: 80, h: 12, r: 0, cls: 'g3s-push' }, 4, n),
];

const scene: PlayScene = {
  w: 480,
  h: 250,
  mode: 'jump',
  states: [
    { label: '✋ Ready', say: 'Your hands can give a force in four ways. Tap each one.' },
    { label: 'Stretch', say: 'Stretching: pull an elastic band from both ends. It gets longer.' },
    { label: 'Pull', say: 'Pulling: the rope pulls the sled toward you.' },
    { label: 'Squeeze', say: 'Squeezing: press play dough from both sides. It gets flatter.' },
    { label: 'Push', say: 'Pushing: push a box away from you, and it slides.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="250"/><rect class="g3s-ground" y="210" width="480" height="40"/>',
  sprites,
};
export default scene;
