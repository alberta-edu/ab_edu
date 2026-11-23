// Two ways to collect fossil bones (SCI3-OI3-GQ1-LO1 K4.4, K4.9): picking them up where they show
// at the surface, or digging (excavating) down through the layers. A paleontologist does both.
import { only, type PlayScene } from '../g3-sprites.ts';

const n = 3;
const scene: PlayScene = {
  w: 480,
  h: 250,
  mode: 'jump',
  states: [
    { label: '👀 On the surface', say: 'Rain washes a fossil bone out of a hillside. A paleontologist spots it on the ground and collects it.' },
    { label: '⛏️ Digging', say: 'Some fossils are buried deep. Paleontologists dig down through the layers, slowly and carefully. This is called excavating.' },
    { label: '🔬 Studying', say: 'Back in the lab, paleontologists study the bones. They learn what the dinosaur looked like and how it lived.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="250"/>',
  sprites: [
    // a bare hill, a bone on the ground
    only({ kind: 'path', d: 'M0,250 L0,150 Q150,70 300,160 Q380,200 480,190 L480,250 Z', cls: 'g3s-l1' }, 0, n),
    only({ kind: 'path', d: 'M0,190 Q150,120 300,190 Q380,225 480,220', cls: 'g3s-thin' }, 0, n),
    only({ kind: 'emoji', text: '🦴', x: 330, y: 184, size: 34 }, 0, n),
    only({ kind: 'emoji', text: '🧑‍🔬', x: 400, y: 160, size: 56 }, 0, n),
    only({ kind: 'emoji', text: '🌧️', x: 140, y: 50, size: 50 }, 0, n),
    // a dig pit through the layers
    only({ kind: 'rect', x: 0, y: 110, w: 480, h: 40, cls: 'g3s-l1' }, 1, n),
    only({ kind: 'rect', x: 0, y: 150, w: 480, h: 50, cls: 'g3s-l2' }, 1, n),
    only({ kind: 'rect', x: 0, y: 200, w: 480, h: 50, cls: 'g3s-l4' }, 1, n),
    only({ kind: 'rect', x: 170, y: 110, w: 160, h: 110, cls: 'g3s-sky' }, 1, n),
    only({ kind: 'emoji', text: '🦴', x: 250, y: 214, size: 36 }, 1, n),
    only({ kind: 'emoji', text: '🧑‍🔬', x: 210, y: 180, size: 50 }, 1, n),
    only({ kind: 'emoji', text: '⛏️', x: 290, y: 190, size: 36 }, 1, n),
    only({ kind: 'emoji', text: '🖌️', x: 120, y: 90, size: 34 }, 1, n),
    // the lab
    only({ kind: 'rect', x: 60, y: 170, w: 360, h: 18, rx: 6, cls: 'g3s-wood' }, 2, n),
    only({ kind: 'emoji', text: '🦴', x: 180, y: 150, size: 44 }, 2, n),
    only({ kind: 'emoji', text: '🔍', x: 250, y: 130, size: 40 }, 2, n),
    only({ kind: 'emoji', text: '🧑‍🔬', x: 340, y: 130, size: 64 }, 2, n),
    only({ kind: 'emoji', text: '🦖', x: 110, y: 60, size: 50 }, 2, n),
    only({ kind: 'text', text: 'Paleontologist', x: 340, y: 222, size: 20, cls: 'g3s-label' }, 2, n),
  ],
};
export default scene;
