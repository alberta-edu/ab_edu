// Four dinosaurs that lived in Alberta (SCI3-OI3-GQ1-LO1 K4.7, S4.3). Albertosaurus: first found by
// Joseph B. Tyrrell near Drumheller in 1884. Edmontosaurus: a duck-billed plant eater named after
// Edmonton. Nodosaurus: an armoured plant eater; its cousin Borealopelta, a nodosaur, was found near
// Fort McMurray. Tyrannosaurus rex: "Black Beauty" was found by teenagers on a fishing trip in the
// Crowsnest Pass. Sources: Royal Tyrrell Museum; The Canadian Encyclopedia, "Albertosaurus",
// "Tyrannosaurus rex"; Brown et al. 2017.
import { only, type PlayScene } from '../g3-sprites.ts';

const n = 4;
const scene: PlayScene = {
  w: 480,
  h: 240,
  mode: 'jump',
  states: [
    { label: 'Albertosaurus', say: 'Albertosaurus means “Alberta lizard.” This meat eater was first found near Drumheller, in 1884.' },
    { label: 'Edmontosaurus', say: 'Edmontosaurus is named after Edmonton. This big plant eater had a wide, flat mouth like a duck’s bill.' },
    { label: 'Nodosaurus', say: 'Nodosaurus was a plant eater covered in bony armour. A cousin of it was found near Fort McMurray.' },
    { label: 'Tyrannosaurus', say: 'Tyrannosaurus rex was a huge meat eater. Teenagers on a fishing trip found one in Alberta. It is called Black Beauty.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="240"/><rect class="g3s-grass" y="200" width="480" height="40"/>',
  sprites: [
    only({ kind: 'emoji', text: '🦖', x: 180, y: 140, size: 110 }, 0, n),
    only({ kind: 'emoji', text: '🍖', x: 340, y: 180, size: 40 }, 0, n),
    only({ kind: 'emoji', text: '🦕', x: 180, y: 130, size: 130 }, 1, n),
    only({ kind: 'emoji', text: '🌿', x: 340, y: 180, size: 44 }, 1, n),
    only({ kind: 'path', d: 'M-80,0 Q-60,-50 0,-55 Q60,-50 80,0 Z', x: 180, y: 190, cls: 'g3s-rock' }, 2, n),
    ...[-55, -25, 5, 35, 60].map((dx) => only({ kind: 'path', d: 'M-8,0 L0,-16 L8,0 Z', x: 180 + dx, y: 150 + Math.abs(dx) * 0.4, cls: 'g3s-l5' }, 2, n)),
    only({ kind: 'ellipse', x: 270, y: 178, w: 30, h: 24, cls: 'g3s-rock' }, 2, n),
    only({ kind: 'emoji', text: '🌿', x: 340, y: 180, size: 44 }, 2, n),
    only({ kind: 'emoji', text: '🦖', x: 190, y: 120, size: 160 }, 3, n),
    only({ kind: 'emoji', text: '🍖', x: 370, y: 180, size: 40 }, 3, n),
    only({ kind: 'text', text: 'Meat eater', x: 400, y: 40, size: 20, cls: 'g3s-label' }, 0, n),
    only({ kind: 'text', text: 'Plant eater', x: 400, y: 40, size: 20, cls: 'g3s-label' }, 1, n),
    only({ kind: 'text', text: 'Plant eater', x: 400, y: 40, size: 20, cls: 'g3s-label' }, 2, n),
    only({ kind: 'text', text: 'Meat eater', x: 400, y: 40, size: 20, cls: 'g3s-label' }, 3, n),
  ],
};
export default scene;
