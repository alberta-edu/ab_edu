// Measuring carefully (SCI3-OI7-GQ1-LO1 K1.1, K1.2, S1.2): line the object up with the 0 on the
// ruler, read a measuring cup with your eye level with the water, and write the number down right
// away, so the recorded observation is correct.
import { only, type PlayScene, type Sprite } from '../g3-sprites.ts';

const n = 3;
const cm = (c: number) => 60 + 36 * c;
const scene: PlayScene = {
  w: 480,
  h: 240,
  mode: 'jump',
  states: [
    { label: '0️⃣ Start at 0', say: 'Line up the end of the pencil with the 0 on the ruler, not with the edge of the ruler.' },
    { label: '👀 Eye level', say: 'Bend down so your eye is level with the water. Then read the line.' },
    { label: '✍️ Write it down', say: 'Write the number down right away, so you don’t forget it or mix it up.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="240"/>',
  sprites: [
    // ruler and pencil
    only({ kind: 'rect', x: 40, y: 130, w: 400, h: 54, rx: 4, cls: 'g3s-coat' }, 0, n),
    ...Array.from({ length: 11 }, (_, c): Sprite[] => [
      only({ kind: 'line', x: cm(c), y: 130, x2: cm(c), y2: 146, cls: 'g3s-line' }, 0, n),
      only({ kind: 'text', text: String(c), x: cm(c), y: 164, size: 15, cls: 'g3s-label' }, 0, n),
    ]).flat(),
    only({ kind: 'path', d: 'M0,-10 L230,-10 L252,0 L230,10 L0,10 Z', x: cm(0), y: 112, fill: '#f2c230', stroke: '#6b4423', sw: 2 }, 0, n),
    only({ kind: 'line', x: cm(0), y: 96, x2: cm(0), y2: 146, cls: 'g3s-thin' }, 0, n),
    only({ kind: 'text', text: '7 cm ✅', x: 380, y: 80, size: 22, cls: 'g3s-label' }, 0, n),
    // measuring cup
    only({ kind: 'rect', x: 183, y: 120, w: 114, h: 87, cls: 'g3s-water' }, 1, n),
    only({ kind: 'rect', x: 180, y: 50, w: 120, h: 160, rx: 6, cls: 'g3s-glass' }, 1, n),
    ...[90, 120, 150, 180].map((y): Sprite => only({ kind: 'line', x: 180, y, x2: 204, y2: y, cls: 'g3s-line' }, 1, n)),
    only({ kind: 'line', x: 304, y: 120, x2: 370, y2: 120, cls: 'g3s-thin' }, 1, n),
    only({ kind: 'emoji', text: '👁️', x: 395, y: 120, size: 44 }, 1, n),
    // notebook
    only({ kind: 'rect', x: 140, y: 40, w: 200, h: 170, rx: 8, cls: 'g3s-plate' }, 2, n),
    ...[90, 130, 170].map((y): Sprite => only({ kind: 'line', x: 160, y, x2: 320, y2: y, cls: 'g3s-thin' }, 2, n)),
    only({ kind: 'text', text: 'Pencil: 7 cm', x: 164, y: 76, size: 22, anchor: 'start', cls: 'g3s-label' }, 2, n),
    only({ kind: 'emoji', text: '✏️', x: 380, y: 110, size: 50 }, 2, n),
  ],
};
export default scene;
