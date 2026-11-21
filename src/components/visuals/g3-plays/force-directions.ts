// The direction of a force (SCI3-OI2-GQ1-LO1 K1.7, S1.2): arrows show where each push or pull comes from.
import { only, type PlayScene, type Sprite } from '../g3-sprites.ts';

const C = { x: 240, y: 130 };
type Arrow = [x: number, y: number, r: number];
const dirs: { button: string; thing: string; example: string; say: string; arrows: Arrow[] }[] = [
  { button: '⬆️ Upward', thing: '🎒', example: 'Lifting a backpack', say: 'Lifting a backpack: your pull is upward.', arrows: [[C.x, 240, -90]] },
  { button: '⬇️ Downward', thing: '🎹', example: 'Pressing a piano key', say: 'Pressing a piano key: your push is downward.', arrows: [[C.x, 20, 90]] },
  { button: '➡️ From the left', thing: '⚽', example: 'Kicking a ball', say: 'Kicking a ball: the push comes from the left.', arrows: [[110, C.y, 0]] },
  { button: '⬅️ From the right', thing: '🚪', example: 'Pushing a door shut', say: 'Pushing a door shut: the push comes from the right.', arrows: [[370, C.y, 180]] },
  { button: '↔️ From both sides', thing: '🧃', example: 'Squeezing a juice box', say: 'Squeezing a juice box: the push comes from both sides.', arrows: [[110, C.y, 0], [370, C.y, 180]] },
  { button: '✳️ From all directions', thing: '🟠', example: 'Squeezing a stress ball', say: 'Squeezing a stress ball: the push comes from all directions.', arrows: [[110, C.y, 0], [370, C.y, 180], [C.x, 20, 90], [C.x, 240, -90], [150, 40, 45], [330, 40, 135], [150, 220, -45], [330, 220, -135]] },
];
const n = dirs.length;
const sprites: Sprite[] = [];
dirs.forEach((d, i) => {
  sprites.push(only({ kind: 'emoji', text: d.thing, x: C.x, y: C.y, size: 72 }, i, n));
  for (const [x, y, r] of d.arrows) {
    const len = Math.abs(r) % 90 === 45 ? 52 : 66;
    sprites.push(only({ kind: 'arrow', x, y, w: len, h: 12, r, cls: 'g3s-push' }, i, n));
  }
  sprites.push(only({ kind: 'text', text: d.example, x: C.x, y: 272, size: 24, cls: 'g3s-label' }, i, n));
});

const scene: PlayScene = {
  w: 480,
  h: 290,
  mode: 'jump',
  states: dirs.map((d) => ({ label: d.button, say: d.say })),
  bg: '<rect class="g3s-sky" width="480" height="290"/>',
  sprites,
};
export default scene;
