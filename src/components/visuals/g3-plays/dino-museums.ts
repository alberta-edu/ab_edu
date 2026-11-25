// Where to see dinosaur fossils on display in Alberta (SCI3-OI3-GQ1-LO1 K4.8, S4.4): the Royal
// Tyrrell Museum in Drumheller and the Philip J. Currie Dinosaur Museum in Wembley, near Grande
// Prairie and the Pipestone Creek bonebed. Sources: Royal Tyrrell Museum (Black Beauty, the
// Borealopelta nodosaur); Philip J. Currie Dinosaur Museum (Pachyrhinosaurus lakustai).
import { only, type PlayScene, type Sprite } from '../g3-sprites.ts';
import { albertaPath, at } from '../g3-alberta.ts';

const n = 2;
const pin = (p: Parameters<typeof at>[0], i: number): Sprite[] => {
  const [x, y] = at(p);
  return [
    { kind: 'ellipse', x, y, w: 10, h: 10, cls: 'g3s-label' },
    only({ kind: 'emoji', text: '📍', x, y: y - 16, size: 34 }, i, n),
  ];
};
const museum = (i: number, dino: string, x: number): Sprite[] => [
  only({ kind: 'path', d: 'M230,130 L345,80 L460,130 Z', cls: 'g3s-rock' }, i, n),
  only({ kind: 'rect', x: 240, y: 130, w: 210, h: 120, cls: 'g3s-plate' }, i, n),
  only({ kind: 'emoji', text: dino, x, y: 200, size: 80 }, i, n),
  only({ kind: 'emoji', text: '🧒', x: 420, y: 226, size: 34 }, i, n),
];

const scene: PlayScene = {
  w: 480,
  h: 300,
  mode: 'jump',
  states: [
    { label: '🏛️ Royal Tyrrell Museum', say: 'The Royal Tyrrell Museum is in Drumheller. You can see the T. rex called Black Beauty and the Fort McMurray nodosaur.' },
    { label: '🏛️ Philip J. Currie Museum', say: 'The Philip J. Currie Dinosaur Museum is in Wembley, near Grande Prairie. It shows horned dinosaurs found nearby.' },
  ],
  bg: `<rect class="g3s-sky" width="480" height="300"/><path class="g3s-grass g3s-stroke" d="${albertaPath}"/>`,
  sprites: [
    ...pin('drumheller', 0),
    ...pin('wembley', 1),
    ...museum(0, '🦖', 330),
    ...museum(1, '🦕', 330),
    only({ kind: 'text', text: 'Drumheller', x: 345, y: 272, size: 18, cls: 'g3s-label' }, 0, n),
    only({ kind: 'text', text: 'Wembley', x: 345, y: 272, size: 18, cls: 'g3s-label' }, 1, n),
  ],
};
export default scene;
