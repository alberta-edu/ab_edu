// Kinds of contact forces (SCI3-OI2-GQ1-LO1 K1.3, K1.4): applied, friction, tension and elastic.
import { only, type PlayScene, type Sprite } from '../g3-sprites.ts';

const n = 4;
const sprites: Sprite[] = [
  // applied: a hand pushes a box
  only({ kind: 'emoji', text: '🫷', x: 130, y: 140, size: 64 }, 0, n),
  only({ kind: 'rect', x: 180, y: 96, w: 100, h: 90, rx: 4, cls: 'g3s-wood' }, 0, n),
  only({ kind: 'arrow', x: 290, y: 140, w: 80, h: 12, r: 0, cls: 'g3s-push' }, 0, n),
  // friction: a box slides on a rough floor, and the rubbing pushes back
  only({ kind: 'rect', x: 180, y: 96, w: 100, h: 90, rx: 4, cls: 'g3s-wood' }, 1, n),
  only({ kind: 'path', d: 'M40,190 l10,-8 l10,8 l10,-8 l10,8 l10,-8 l10,8 l10,-8 l10,8 l10,-8 l10,8 l10,-8 l10,8 l10,-8 l10,8 l10,-8 l10,8 l10,-8 l10,8 l10,-8 l10,8 l10,-8 l10,8 l10,-8 l10,8 l10,-8 l10,8 l10,-8 l10,8 l10,-8 l10,8 l10,-8 l10,8 l10,-8 l10,8 l10,-8 l10,8 l10,-8 l10,8 l10,-8 l10,8', cls: 'g3s-line' }, 1, n),
  only({ kind: 'arrow', x: 290, y: 120, w: 70, h: 10, r: 0, cls: 'g3s-soft' }, 1, n),
  only({ kind: 'arrow', x: 260, y: 200, w: 70, h: 12, r: 180, cls: 'g3s-rub' }, 1, n),
  // tension: a rope pulls a sled
  only({ kind: 'emoji', text: '🛷', x: 150, y: 160, size: 70 }, 2, n),
  only({ kind: 'line', x: 186, y: 150, x2: 380, y2: 110, cls: 'g3s-line' }, 2, n),
  only({ kind: 'emoji', text: '✊', x: 396, y: 106, size: 44 }, 2, n),
  only({ kind: 'arrow', x: 240, y: 112, w: 80, h: 10, r: -12, cls: 'g3s-pull' }, 2, n),
  // elastic: a trampoline stretches and springs back
  only({ kind: 'path', d: 'M80,190 Q240,240 400,190', cls: 'g3s-line' }, 3, n),
  only({ kind: 'emoji', text: '🤸', x: 240, y: 150, size: 64 }, 3, n),
  only({ kind: 'arrow', x: 330, y: 200, w: 110, h: 12, r: -90, cls: 'g3s-push' }, 3, n),
];

const scene: PlayScene = {
  w: 480,
  h: 250,
  mode: 'jump',
  states: [
    { label: 'Applied', say: 'Applied force: a person or object pushes or pulls another object, like a hand pushing a box.' },
    { label: 'Friction', say: 'Friction: surfaces rub as they slide. The rubbing pushes back and slows the box.' },
    { label: 'Tension', say: 'Tension: a pulled rope or string pulls on the object tied to it.' },
    { label: 'Elastic', say: 'Elastic force: a stretched or squeezed thing pushes back, like a trampoline bouncing you up.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="250"/>',
  sprites,
};
export default scene;
