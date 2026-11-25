// Plants and animals change Earth's surface (SCI3-OI3-GQ1-LO1 K3.2, S3.2, U3.1): overpopulation,
// mountain pine beetles, and animals burrowing.
import { only, type PlayScene, type Sprite } from '../g3-sprites.ts';

const n = 3;
const pine = (x: number, fill: string, i: number): Sprite =>
  only({ kind: 'path', d: 'M0,-70 L26,0 L-26,0 Z M-4,0 h8 v14 h-8 Z', x, y: 186, fill, stroke: '#3a2a1a', sw: 1.5 }, i, n);
const scene: PlayScene = {
  w: 480,
  h: 240,
  mode: 'jump',
  states: [
    { label: 'Too many deer', say: 'Overpopulation: when there are too many deer, they eat almost every plant. The ground is left bare.' },
    { label: 'Pine beetles', say: 'Mountain pine beetles live under pine bark. Too many of them kill whole forests. The trees turn red, then grey.' },
    { label: 'Burrows', say: 'Burrowing: ground squirrels dig tunnels under the prairie and push up mounds of soil.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="240"/><rect class="g3s-grass" y="170" width="480" height="70"/>',
  sprites: [
    // too many deer on bare ground
    only({ kind: 'rect', x: 0, y: 170, w: 480, h: 70, cls: 'g3s-ground' }, 0, n),
    ...[60, 150, 250, 340, 420].map((x, i) => only({ kind: 'emoji', text: '🦌', x, y: 150 + (i % 2) * 30, size: 54 }, 0, n)),
    only({ kind: 'path', d: 'M110,200 l0,-14 M200,215 l0,-12 M300,205 l0,-14 M390,215 l0,-12', cls: 'g3s-line' }, 0, n),
    // a pine forest with beetle-killed trees
    ...[50, 120, 190, 260, 330, 400].map((x, i) => pine(x, ['#3f8f3f', '#c0392b', '#3f8f3f', '#c0392b', '#8a8a8a', '#c0392b'][i], 1)),
    only({ kind: 'emoji', text: '🪲', x: 440, y: 60, size: 40 }, 1, n),
    // a cut-away view of tunnels
    only({ kind: 'rect', x: 0, y: 176, w: 480, h: 64, cls: 'g3s-dark' }, 2, n),
    only({ kind: 'path', d: 'M120,176 Q130,200 170,210 L300,214 Q340,216 350,190 L356,176', fill: 'none', stroke: '#c9a26b', sw: 14 }, 2, n),
    only({ kind: 'ellipse', x: 120, y: 172, w: 50, h: 18, cls: 'g3s-mud' }, 2, n),
    only({ kind: 'ellipse', x: 356, y: 172, w: 50, h: 18, cls: 'g3s-mud' }, 2, n),
    only({ kind: 'emoji', text: '🐿️', x: 240, y: 208, size: 30 }, 2, n),
    only({ kind: 'emoji', text: '🐿️', x: 356, y: 146, size: 40 }, 2, n),
  ],
};
export default scene;
