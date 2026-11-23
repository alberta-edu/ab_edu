// Plants and animals keep changing soil (SCI3-OI3-GQ1-LO1 K5.4, U5.1, S5.3): leaves fall, worms
// pull them down and eat them, worm tunnels let in air and water, plant roots grow through the
// soil, and dead plants decay into it. Soil is always changing.
import { only, from, type PlayScene } from '../g3-sprites.ts';

const n = 4;
const scene: PlayScene = {
  w: 480,
  h: 260,
  mode: 'steps',
  next: 'Next ▶',
  back: '◀ Back',
  states: [
    { label: 'Fall', say: 'In fall, dead leaves drop onto the soil.' },
    { label: 'Worms eat', say: 'Worms pull the leaves down and eat them. Their droppings make the soil richer.' },
    { label: 'Tunnels', say: 'Worm tunnels mix the soil and let air and water in.' },
    { label: 'Plants grow', say: 'In spring, plants and crops grow. Their roots spread through the soil and change it too.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="260"/><rect class="g3s-ground" y="90" width="480" height="170"/>',
  sprites: [
    // leaves on top, then pulled down and gone
    ...[60, 150, 250, 350, 430].map((x, i) => ({ kind: 'emoji' as const, text: '🍂', x, y: 80, size: 34, keys: [{ t: 1, y: i % 2 ? 130 : 82, o: 1 }, { t: 2, o: i % 2 ? 0 : 0.6 }, { t: 3, o: 0 }] })),
    // worms and their tunnels
    from({ kind: 'path', d: 'M150,92 Q160,150 220,170 Q300,190 330,240 M350,92 Q330,140 380,180', cls: 'g3s-tunnel', o: 0 }, 2, n),
    { kind: 'emoji', text: '🪱', x: 150, y: 120, size: 40, o: 0, keys: [{ t: 0, o: 0 }, { t: 1, o: 1, x: 150, y: 120 }, { t: 2, x: 230, y: 172 }, { t: 3, o: 1 }] },
    { kind: 'emoji', text: '🪱', x: 350, y: 120, size: 36, o: 0, keys: [{ t: 0, o: 0 }, { t: 1, o: 1, x: 350, y: 120 }, { t: 2, x: 380, y: 182 }, { t: 3, o: 1 }] },
    ...[[200, 160], [270, 186], [365, 150]].map(([x, y]) => from({ kind: 'emoji', text: '💧', x, y, size: 20 }, 2, n)),
    ...[[180, 140], [300, 200], [372, 120]].map(([x, y]) => from({ kind: 'ellipse', x, y, w: 10, h: 10, cls: 'g3s-snow' }, 2, n)),
    // plants and roots
    ...[90, 270, 420].flatMap((x) => [
      only({ kind: 'emoji', text: '🌾', x, y: 60, size: 56 }, 3, n),
      only({ kind: 'path', d: 'M0,0 Q-10,40 -20,80 M0,0 Q5,50 0,110 M0,0 Q15,40 30,70', x, y: 92, cls: 'g3s-line' }, 3, n),
    ]),
    only({ kind: 'text', text: 'Roots', x: 300, y: 240, size: 20, cls: 'g3s-snow' }, 3, n),
  ],
};
export default scene;
