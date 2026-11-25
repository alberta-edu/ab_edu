// Finding patterns and the important details (SCI3-OI6-GQ1-LO1 K1.1, S1.2): planting a row of seeds
// repeats the same three steps, and a note about meeting at the park has two details that matter
// (the time and the street) and one that does not (a blue shirt).
import { only, type PlayScene, type Sprite } from '../g3-sprites.ts';

const n = 2;
const seedRow = [90, 240, 390].flatMap((x): Sprite[] => [
  only({ kind: 'rect', x: x - 62, y: 60, w: 124, h: 110, rx: 10, cls: 'g3s-plate' }, 0, n),
  only({ kind: 'emoji', text: '🌱', x, y: 104, size: 46 }, 0, n),
  only({ kind: 'text', text: 'Dig, drop, cover', x, y: 150, size: 16, cls: 'g3s-label' }, 0, n),
]);
const note = (y: number, text: string, keep: boolean): Sprite[] => [
  only({ kind: 'rect', x: 60, y: y - 20, w: 360, h: 40, rx: 8, cls: keep ? 'g3s-hl' : 'g3s-plate' }, 1, n),
  only({ kind: 'text', text, x: 80, y, size: 20, anchor: 'start', cls: keep ? 'g3s-label' : 'g3s-soft' }, 1, n),
  only({ kind: 'emoji', text: keep ? '✅' : '❌', x: 396, y, size: 24 }, 1, n),
];

const scene: PlayScene = {
  w: 480,
  h: 230,
  mode: 'jump',
  states: [
    { label: '🧩 Pattern', say: 'Every seed gets the same steps: dig, drop, cover. Spot the pattern, and you know what comes next.' },
    { label: '🔎 Details', say: 'Meet at the park! The time and the street matter. The colour of your shirt does not.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="230"/>',
  sprites: [
    only({ kind: 'rect', x: 0, y: 190, w: 480, h: 40, cls: 'g3s-ground' }, 0, n),
    ...seedRow,
    ...note(60, '⏰ At 4 o’clock', true),
    ...note(115, '📍 On Elm Street', true),
    ...note(170, '👕 My shirt is blue', false),
  ],
};
export default scene;
