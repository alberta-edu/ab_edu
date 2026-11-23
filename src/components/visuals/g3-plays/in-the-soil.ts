// What soil is made of (SCI3-OI3-GQ1-LO1 K5.1, S5.1): a slice of soil holds rock bits, living
// plants and animals, decaying plants and animals, air and water. Tap each part to find it.
import { only, type PlayScene, type Sprite } from '../g3-sprites.ts';

const n = 5;
const ring = (x: number, y: number, i: number, w = 70, h = 56): Sprite => only({ kind: 'ellipse', x, y, w, h, cls: 'g3s-hl' }, i, n);

const scene: PlayScene = {
  w: 480,
  h: 270,
  mode: 'jump',
  states: [
    { label: '🪨 Rock bits', say: 'Most of soil is tiny bits of rock, like sand. They broke off bigger rocks long ago.' },
    { label: '🪱 Living things', say: 'Living plants and animals are in soil, like roots, worms, ants and beetles.' },
    { label: '🍂 Decaying things', say: 'Dead leaves, roots and animals slowly rot away in the soil. They become part of it.' },
    { label: '💨 Air', say: 'Tiny spaces between the bits of soil are full of air.' },
    { label: '💧 Water', say: 'Rain soaks into the soil. Water fills some of the tiny spaces.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="270"/><rect class="g3s-grass" y="60" width="480" height="16"/><rect class="g3s-dark" y="76" width="480" height="194"/>',
  sprites: [
    // the soil slice: everything is always there
    { kind: 'emoji', text: '🌱', x: 120, y: 40, size: 40 },
    { kind: 'path', d: 'M120,70 Q110,110 125,140 M120,90 Q140,110 150,130 M118,100 Q95,120 90,150', cls: 'g3s-line' },
    { kind: 'emoji', text: '🪨', x: 60, y: 210, size: 30 },
    { kind: 'emoji', text: '🪨', x: 300, y: 230, size: 24 },
    ...[[210, 200], [230, 214], [250, 198], [270, 216], [380, 120], [395, 136]].map(([x, y]) => ({ kind: 'ellipse', x, y, w: 9, h: 7, cls: 'g3s-sand' }) as Sprite),
    { kind: 'emoji', text: '🪱', x: 240, y: 120, size: 38 },
    { kind: 'emoji', text: '🐜', x: 410, y: 210, size: 26 },
    { kind: 'emoji', text: '🍂', x: 330, y: 90, size: 30 },
    { kind: 'emoji', text: '🍂', x: 180, y: 160, size: 24 },
    ...[[60, 120], [75, 132], [330, 170], [345, 160], [450, 110]].map(([x, y]) => ({ kind: 'ellipse', x, y, w: 10, h: 10, cls: 'g3s-snow' }) as Sprite),
    ...[[150, 230], [440, 160], [100, 250]].map(([x, y]) => ({ kind: 'emoji', text: '💧', x, y, size: 22 }) as Sprite),
    // what each button points to
    ring(60, 210, 0),
    ring(240, 207, 0, 100, 44),
    ring(240, 120, 1),
    ring(410, 210, 1, 50, 44),
    ring(120, 110, 1, 80, 90),
    ring(330, 90, 2, 56, 46),
    ring(180, 160, 2, 50, 40),
    ring(68, 126, 3, 50, 40),
    ring(338, 165, 3, 50, 40),
    ring(450, 110, 3, 36, 34),
    ring(150, 230, 4, 44, 40),
    ring(440, 160, 4, 44, 40),
    ring(100, 250, 4, 44, 36),
  ],
};
export default scene;
