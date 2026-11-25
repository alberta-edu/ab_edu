// Simple machines (SCI3-OI2-GQ1-LO1 K2.1, U2.1): a lever, wheels and an inclined plane.
import { only, type PlayScene } from '../g3-sprites.ts';

const n = 3;
const scene: PlayScene = {
  w: 480,
  h: 250,
  mode: 'jump',
  states: [
    { label: 'Lever', say: 'Lever: a bar that turns on a log or a point. Push down on the long end, and a heavy load goes up.' },
    { label: 'Wheel', say: 'Wheels roll instead of sliding. A wagon of rocks is much easier to pull than dragging the rocks.' },
    { label: 'Inclined plane', say: 'Inclined plane: a ramp. Pushing a load up a ramp takes a smaller push than lifting it straight up.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="250"/><rect class="g3s-grass" y="215" width="480" height="35"/>',
  sprites: [
    // lever
    only({ kind: 'ellipse', x: 150, y: 197, w: 36, h: 36, cls: 'g3s-wood' }, 0, n),
    only({ kind: 'path', d: 'M-100,-12 H260 V0 H-100 Z', x: 150, y: 180, r: -20, cls: 'g3s-wood' }, 0, n),
    only({ kind: 'emoji', text: '🪨', x: 67, y: 172, size: 46 }, 0, n),
    only({ kind: 'emoji', text: '🫳', x: 365, y: 70, size: 44 }, 0, n),
    only({ kind: 'arrow', x: 420, y: 40, w: 50, h: 12, r: 90, cls: 'g3s-push' }, 0, n),
    only({ kind: 'arrow', x: 67, y: 140, w: 44, h: 12, r: -90, cls: 'g3s-pull' }, 0, n),
    // wheel: a wagon of rocks
    only({ kind: 'rect', x: 150, y: 140, w: 150, h: 46, rx: 4, cls: 'g3s-wool' }, 1, n),
    only({ kind: 'emoji', text: '🪨', x: 195, y: 124, size: 38 }, 1, n),
    only({ kind: 'emoji', text: '🪨', x: 255, y: 124, size: 38 }, 1, n),
    only({ kind: 'ellipse', x: 180, y: 194, w: 40, h: 40, cls: 'g3s-metal' }, 1, n),
    only({ kind: 'ellipse', x: 270, y: 194, w: 40, h: 40, cls: 'g3s-metal' }, 1, n),
    only({ kind: 'line', x: 300, y: 160, x2: 380, y2: 130, cls: 'g3s-line' }, 1, n),
    only({ kind: 'emoji', text: '✊', x: 396, y: 126, size: 40 }, 1, n),
    only({ kind: 'arrow', x: 330, y: 100, w: 70, h: 10, r: 0, cls: 'g3s-pull' }, 1, n),
    // inclined plane: a box on a ramp
    only({ kind: 'path', d: 'M80,215 L360,215 L360,105 Z', cls: 'g3s-rock' }, 2, n),
    only({ kind: 'rect', x: 195, y: 125, w: 36, h: 36, rx: 3, r: -21.4, cls: 'g3s-coat' }, 2, n),
    only({ kind: 'arrow', x: 160, y: 162, w: 30, h: 8, r: -21.4, cls: 'g3s-push' }, 2, n),
    only({ kind: 'text', text: 'Small push', x: 150, y: 110, size: 20, cls: 'g3s-label' }, 2, n),
  ],
};
export default scene;
