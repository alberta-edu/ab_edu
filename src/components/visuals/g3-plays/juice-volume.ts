// Liquids keep their volume (SCI3-OI1-GQ1-LO1 K3.2, K3.3, K3.6): pour the same cup of juice into
// three containers. Its shape changes. The space it takes up does not.
import { type PlayScene } from '../g3-sprites.ts';

// Each container's inside is w wide; the juice is w × h with the same area (9 600) each time.
const box = [
  { x: 190, y: 50, w: 100, h: 170 },
  { x: 120, y: 140, w: 240, h: 80 },
  { x: 205, y: 30, w: 70, h: 190 },
];
const juice = box.map((b) => ({ x: b.x + 2, w: b.w - 4, h: 9600 / (b.w - 4) })).map((j) => ({ ...j, y: 218 - j.h }));

const scene: PlayScene = {
  w: 480,
  h: 270,
  mode: 'jump',
  states: [
    { label: 'Tall glass', say: 'One cup of juice in a tall glass. It takes the shape of the glass.' },
    { label: 'Wide bowl', say: 'Pour it into a wide bowl. The shape changes, but it is still one cup.' },
    { label: 'Thin bottle', say: 'Pour it into a thin bottle. It looks like more, but it is still one cup.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="270"/><rect class="g3s-ground" y="220" width="480" height="50"/>',
  sprites: [
    { kind: 'rect', cls: 'g3s-juice', ...juice[0], keys: juice.map((j, t) => ({ t, ...j })) },
    { kind: 'rect', cls: 'g3s-box', rx: 6, ...box[0], keys: box.map((b, t) => ({ t, ...b })) },
    { kind: 'text', text: '1 cup of juice', x: 240, y: 248, size: 24, cls: 'g3s-label' },
  ],
};
export default scene;
