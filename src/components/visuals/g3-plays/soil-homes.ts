// Soil is a habitat (SCI3-OI3-GQ1-LO1 K5.2, K5.3, S5.2): animals found in Alberta make their homes
// in soil. Earthworms tunnel, ants build nests of tunnels and rooms, and Richardson's ground
// squirrels dig burrows in prairie soil.
import { only, type PlayScene } from '../g3-sprites.ts';

const n = 3;
const scene: PlayScene = {
  w: 480,
  h: 260,
  mode: 'jump',
  states: [
    { label: '🪱 Earthworm', say: 'Earthworms live in the soil all their lives. They tunnel through it, looking for food.' },
    { label: '🐜 Ants', say: 'Ants dig a nest under the ground, with tunnels and little rooms for their eggs and food.' },
    { label: '🐿️ Ground squirrel', say: 'Ground squirrels dig burrows in prairie soil. They sleep there all winter, safe from the cold.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="260"/><rect class="g3s-grass" y="64" width="480" height="12"/><rect class="g3s-ground" y="76" width="480" height="184"/>',
  sprites: [
    // worm tunnels
    only({ kind: 'path', d: 'M60,76 Q90,130 160,140 Q240,150 260,200 Q280,240 360,220', cls: 'g3s-tunnel' }, 0, n),
    only({ kind: 'emoji', text: '🪱', x: 300, y: 222, size: 50 }, 0, n),
    only({ kind: 'emoji', text: '🪱', x: 150, y: 140, size: 40 }, 0, n),
    // an ant nest
    only({ kind: 'path', d: 'M240,76 V120 M240,120 L180,160 M240,120 L310,170 M180,160 V210 M310,170 L340,220', cls: 'g3s-tunnel' }, 1, n),
    ...[[180, 214], [340, 222], [240, 124]].map(([x, y]) => only({ kind: 'ellipse', x, y, w: 50, h: 26, cls: 'g3s-dark' }, 1, n)),
    only({ kind: 'path', d: 'M215,64 Q240,40 265,64 Z', cls: 'g3s-ground' }, 1, n),
    ...[[200, 160], [300, 160], [180, 212], [340, 220]].map(([x, y]) => only({ kind: 'emoji', text: '🐜', x, y, size: 24 }, 1, n)),
    // a ground squirrel burrow
    only({ kind: 'path', d: 'M80,76 Q110,140 200,170 Q280,190 330,200', cls: 'g3s-tunnel' }, 2, n),
    only({ kind: 'ellipse', x: 350, y: 200, w: 110, h: 60, cls: 'g3s-dark' }, 2, n),
    only({ kind: 'emoji', text: '🐿️', x: 350, y: 200, size: 46 }, 2, n),
    only({ kind: 'emoji', text: '💤', x: 400, y: 170, size: 26 }, 2, n),
    only({ kind: 'path', d: 'M55,64 Q80,48 105,64 Z', cls: 'g3s-ground' }, 2, n),
  ],
};
export default scene;
