// Condensation (SCI3-OI1-GQ1-LO1 K2.6, U2.1): on a warm day, water vapour in the air cools on a glass
// of ice water and turns back into liquid drops on the outside.
import { type PlayScene, type Sprite } from '../g3-sprites.ts';

const drops: Sprite[] = [];
const spots = [[193, 104], [287, 96], [192, 150], [288, 140], [194, 196], [286, 186], [230, 92], [254, 210], [220, 170], [262, 120]];
spots.forEach(([x, y], i) => drops.push({ kind: 'ellipse', x, y, w: 0, h: 0, cls: 'g3s-drop', keys: [{ t: 0, w: 0, h: 0 }, { t: 1, w: 11 + (i % 3) * 3, h: 15 + (i % 3) * 3 }] }));
const air: Sprite[] = [];
for (let i = 0; i < 8; i++) {
  const x = i % 2 ? 90 + i * 6 : 380 - i * 6;
  const y = 70 + i * 22;
  air.push({ kind: 'ellipse', x, y, w: 8, h: 8, cls: 'g3s-steam', keys: [{ t: 0, x, y, o: 1 }, { t: 1, x: x < 240 ? 200 : 280, y, o: 0 }] });
}

const scene: PlayScene = {
  w: 480,
  h: 270,
  mode: 'jump',
  states: [
    { label: 'Just poured', say: 'A glass of ice water on a warm day. The outside of the glass is dry.' },
    { label: '5 minutes later', say: 'Drops cover the outside! Water vapour in the air cooled on the glass and became liquid.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="270"/><rect class="g3s-wood" x="0" y="226" width="480" height="44"/>',
  sprites: [
    ...air,
    { kind: 'rect', x: 196, y: 100, w: 88, h: 124, cls: 'g3s-water' },
    { kind: 'rect', x: 206, y: 108, w: 30, h: 30, rx: 4, cls: 'g3s-ice' },
    { kind: 'rect', x: 242, y: 128, w: 30, h: 30, rx: 4, cls: 'g3s-ice' },
    { kind: 'rect', x: 192, y: 76, w: 96, h: 150, rx: 6, cls: 'g3s-glass' },
    { kind: 'ellipse', x: 240, y: 228, w: 0, h: 0, cls: 'g3s-drop', keys: [{ t: 0, w: 0, h: 0 }, { t: 1, w: 130, h: 10 }] },
    ...drops,
    { kind: 'text', text: 'Dots: water vapour (really invisible)', x: 240, y: 34, size: 20, cls: 'g3s-soft' },
  ],
};
export default scene;
