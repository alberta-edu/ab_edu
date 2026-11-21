// Solids, liquids and gases (SCI3-OI1-GQ1-LO1 K3.1-K3.5, S3.2): a solid, a liquid and a gas each
// move from a tall, narrow box into a wide, short one.
import { showFrom, type RunScene, type Sprite } from '../../visuals/g3-sprites.ts';

const T0 = 0.15;
const T1 = 0.75;
const cols: Sprite[] = [];
const names = ['Solid', 'Liquid', 'Gas'];
const ends = ['Same shape', 'Flat on the bottom', 'Fills it all'];
[90, 240, 390].forEach((cx, i) => {
  if (i === 0) cols.push({ kind: 'rect', x: cx - 22, y: 176, w: 44, h: 44, rx: 4, cls: 'g3s-ice' });
  if (i === 1) cols.push({ kind: 'rect', x: cx - 28, y: 130, w: 56, h: 90, cls: 'g3s-juice', keys: [{ t: T0, x: cx - 28, y: 130, w: 56, h: 90 }, { t: T1, x: cx - 63, y: 180, w: 126, h: 40 }] });
  if (i === 2) cols.push({ kind: 'rect', x: cx - 28, y: 82, w: 56, h: 136, cls: 'g3s-gas', keys: [{ t: T0, x: cx - 28, y: 82, w: 56, h: 136 }, { t: T1, x: cx - 63, y: 152, w: 126, h: 66 }] });
  cols.push(
    { kind: 'rect', x: cx - 30, y: 80, w: 60, h: 140, rx: 4, cls: 'g3s-box', keys: [{ t: T0, x: cx - 30, y: 80, w: 60, h: 140 }, { t: T1, x: cx - 65, y: 150, w: 130, h: 70 }] },
    { kind: 'text', text: names[i], x: cx, y: 250, size: 26, cls: 'g3s-label' },
    showFrom({ kind: 'text', text: ends[i], x: cx, y: 282, size: 18, cls: 'g3s-soft' }, 0.85),
  );
});

const scene: RunScene = {
  w: 480,
  h: 300,
  ms: 5000,
  live: 'The solid kept its shape. The liquid spread out flat across the bottom. The gas spread out to fill the whole box.',
  bg: '<rect class="g3s-sky" width="480" height="300"/>',
  sprites: [{ kind: 'text', text: 'Tall box → wide box', x: 240, y: 34, size: 22, cls: 'g3s-label' }, ...cols],
};
export default scene;
