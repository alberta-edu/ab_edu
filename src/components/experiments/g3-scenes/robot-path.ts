// Computational thinking (SCI3-OI6-GQ1-LO1 K1.1, S1.1, U1.1): a robot follows three instructions,
// meets a bug (it turns too soon and bumps a rock), works backward through the steps to find the
// wrong one, fixes it and reaches the apple.
import { ticker, showFrom, type RunScene, type Sprite, type Key } from '../../visuals/g3-sprites.ts';

const cx = (c: number) => 50 + 60 * c;
const cy = (r: number) => 90 + 60 * r;
// [t, column, row, facing in degrees: 0 = right, -90 = up]
const path: [number, number, number, number][] = [
  // run 1: forward 2, turn left, forward 2 … bump!
  [0.06, 0, 2, 0], [0.18, 2, 2, 0], [0.24, 2, 2, -90], [0.32, 2, 1.45, -90], [0.34, 2, 1.6, -90],
  // working backward: undo step 3, step 2, step 1
  [0.46, 2, 1.6, -90], [0.5, 2, 2, -90], [0.54, 2, 2, 0], [0.6, 0, 2, 0],
  // run 2 with the fixed step 1: forward 4, turn left, forward 2
  [0.66, 0, 2, 0], [0.76, 4, 2, 0], [0.8, 4, 2, -90], [0.9, 4, 0, -90],
];
const robot: Sprite = { kind: 'emoji', text: '🤖', size: 44, x: cx(0), y: cy(2), keys: path.map(([t, c, r]): Key => ({ t, x: cx(c), y: cy(r) })) };
const facing: Sprite = {
  kind: 'arrow', w: 26, h: 6, cls: 'g3s-push', x: cx(0) + 24, y: cy(2), r: 0,
  keys: path.map(([t, c, r, d]): Key => ({ t, x: cx(c) + (d === 0 ? 24 : 0), y: cy(r) + (d === 0 ? 0 : -24), r: d })),
};
const line = (i: number, text: string): Sprite => ({ kind: 'text', text, x: 350, y: 106 + i * 36, size: 19, anchor: 'start', cls: 'g3s-label' });
const FIX = 0.57;
// which instruction is running (rows at y = 90, 126, 162)
const hl: Sprite = {
  kind: 'rect', x: 340, y: 90, w: 128, h: 32, rx: 8, cls: 'g3s-hl', o: 0,
  keys: [
    { t: 0.06, o: 0, y: 90 }, { t: 0.07, o: 1 }, { t: 0.19, y: 90 }, { t: 0.2, y: 126 }, { t: 0.24, y: 126 }, { t: 0.25, y: 162 },
    // backward: step 3, then 2, then 1
    { t: 0.5, y: 162 }, { t: 0.51, y: 126 }, { t: 0.54, y: 126 }, { t: 0.55, y: 90 },
    // run again
    { t: 0.76, y: 90 }, { t: 0.77, y: 126 }, { t: 0.8, y: 126 }, { t: 0.81, y: 162 }, { t: 0.92, o: 1 }, { t: 0.95, o: 0 },
  ],
};

const scene: RunScene = {
  w: 480,
  h: 290,
  ms: 9000,
  live: 'The robot went forward 2, turned left, and bumped into the rock. That was a bug. Working backward, step 1 was wrong. It was changed to forward 4. Then the robot reached the apple.',
  bg:
    '<rect class="g3s-sky" width="480" height="290"/>' +
    [0, 1, 2].map((r) => [0, 1, 2, 3, 4].map((c) => `<rect class="g3s-chip" x="${22 + 60 * c}" y="${62 + 60 * r}" width="56" height="56" rx="6"/>`).join('')).join('') +
    '<rect class="g3s-plate" x="334" y="62" width="140" height="176" rx="10"/>',
  sprites: [
    { kind: 'emoji', text: '🪨', x: cx(2), y: cy(1), size: 40 },
    { kind: 'emoji', text: '🍎', x: cx(4), y: cy(0), size: 40, keys: [{ t: 0.92, s: 1 }, { t: 0.97, s: 1.4 }] },
    hl,
    { ...line(0, '1. Forward 2'), keys: [{ t: FIX - 0.03, o: 1 }, { t: FIX, o: 0 }] },
    showFrom({ ...line(0, '1. Forward 4'), cls: 'g3s-push' }, FIX + 0.03, undefined, 0.03),
    line(1, '2. Turn left'),
    line(2, '3. Forward 2'),
    facing,
    robot,
    showFrom({ kind: 'emoji', text: '💥', x: cx(2), y: cy(1.4), size: 34 }, 0.33, 0.44),
    ticker(240, 28, [[0, 'Get the robot to the apple'], [0.33, 'Oops! A bug.'], [0.46, 'Work backward…'], [FIX, 'Fix step 1'], [0.66, 'Try again'], [0.92, 'It worked!']], 20, 'middle'),
  ],
};
export default scene;
