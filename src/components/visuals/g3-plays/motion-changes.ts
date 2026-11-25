// How forces change movement (SCI3-OI2-GQ1-LO1 K1.8, U1.1): a force can start, speed up, turn or
// stop a ball.
import { only, type PlayScene, type Sprite } from '../g3-sprites.ts';

const n = 4;
const trail = (i: number, x0: number, x1: number, y: number): Sprite => only({ kind: 'line', x: x0, y, x2: x1, y2: y, cls: 'g3s-thin' }, i, n);
const sprites: Sprite[] = [
  // 0 start: a still ball is kicked
  only({ kind: 'emoji', text: '⚽', x: 300, y: 140, size: 50 }, 0, n),
  only({ kind: 'emoji', text: '⚽', x: 120, y: 140, size: 50, cls: 'g3s-ghost' }, 0, n),
  only({ kind: 'arrow', x: 40, y: 140, w: 50, h: 12, r: 0, cls: 'g3s-push' }, 0, n),
  trail(0, 150, 270, 140),
  // 1 speed up: a second push from behind
  only({ kind: 'emoji', text: '⚽', x: 420, y: 140, size: 50 }, 1, n),
  only({ kind: 'emoji', text: '⚽', x: 200, y: 140, size: 50, cls: 'g3s-ghost' }, 1, n),
  only({ kind: 'arrow', x: 120, y: 140, w: 50, h: 12, r: 0, cls: 'g3s-push' }, 1, n),
  only({ kind: 'line', x: 230, y: 126, x2: 390, y2: 126, cls: 'g3s-thin' }, 1, n),
  trail(1, 230, 390, 140),
  only({ kind: 'line', x: 230, y: 154, x2: 390, y2: 154, cls: 'g3s-thin' }, 1, n),
  // 2 change direction: bounce off a wall
  only({ kind: 'rect', x: 440, y: 40, w: 24, h: 200, cls: 'g3s-wood' }, 2, n),
  only({ kind: 'emoji', text: '⚽', x: 220, y: 70, size: 50 }, 2, n),
  only({ kind: 'path', d: 'M80,220 L410,140 L250,80', cls: 'g3s-thin' }, 2, n),
  only({ kind: 'arrow', x: 438, y: 140, w: 46, h: 12, r: 180, cls: 'g3s-push' }, 2, n),
  // 3 stop: a goalie's glove
  only({ kind: 'emoji', text: '🧤', x: 380, y: 140, size: 60 }, 3, n),
  only({ kind: 'emoji', text: '⚽', x: 330, y: 140, size: 50 }, 3, n),
  only({ kind: 'arrow', x: 420, y: 186, w: 50, h: 12, r: 180, cls: 'g3s-push' }, 3, n),
  trail(3, 60, 300, 140),
];

const scene: PlayScene = {
  w: 480,
  h: 260,
  mode: 'jump',
  states: [
    { label: '▶️ Start', say: 'Starting: the ball sat still until a kick pushed it. Then it began to move.' },
    { label: '⏩ Speed up', say: 'Speeding up: another push from behind makes the rolling ball go faster.' },
    { label: '↩️ Turn', say: 'Changing direction: the wall pushes back on the ball, and it goes a new way.' },
    { label: '⏹️ Stop', say: 'Stopping: the goalie’s glove pushes against the ball and stops it.' },
  ],
  bg: '<rect class="g3s-grass" width="480" height="260"/>',
  sprites,
};
export default scene;
