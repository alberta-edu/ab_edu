// Farming changes the land and feeds us (SCI3-OI3-GQ1-LO1 S3.4, K3.1): prairie grass becomes a
// ploughed field, then a wheat crop, then bread and cereal on the table.
import { only, type PlayScene } from '../g3-sprites.ts';

const n = 4;
const scene: PlayScene = {
  w: 480,
  h: 240,
  mode: 'steps',
  next: 'Next ▶',
  back: '◀ Back',
  states: [
    { label: 'Prairie', say: 'Long ago, much of southern Alberta was covered with prairie grass.' },
    { label: 'Field', say: 'Farmers turn over the soil and plant seeds in rows. This changes Earth’s surface.' },
    { label: 'Crops', say: 'Wheat, canola and other crops grow in the fields all summer.' },
    { label: 'Your table', say: 'Crops become foods like bread, cereal and cooking oil, and food for farm animals.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="240"/>',
  sprites: [
    // prairie grass
    only({ kind: 'path', d: 'M0,240 L0,150 Q30,120 60,150 Q90,115 120,150 Q150,120 180,150 Q210,115 240,150 Q270,120 300,150 Q330,115 360,150 Q390,120 420,150 Q450,115 480,150 L480,240 Z', cls: 'g3s-grass' }, 0, n),
    only({ kind: 'emoji', text: '🌼', x: 140, y: 170, size: 28 }, 0, n),
    only({ kind: 'emoji', text: '🦬', x: 340, y: 140, size: 60 }, 0, n),
    // ploughed rows
    only({ kind: 'rect', x: 0, y: 150, w: 480, h: 90, cls: 'g3s-ground' }, 1, n),
    only({ kind: 'path', d: 'M0,170 H480 M0,190 H480 M0,210 H480 M0,230 H480', cls: 'g3s-line' }, 1, n),
    only({ kind: 'emoji', text: '🚜', x: 380, y: 130, size: 64 }, 1, n),
    // wheat
    only({ kind: 'rect', x: 0, y: 150, w: 480, h: 90, cls: 'g3s-field' }, 2, n),
    ...[40, 110, 180, 250, 320, 390, 450].map((x) => only({ kind: 'emoji', text: '🌾', x, y: 160, size: 50 }, 2, n)),
    only({ kind: 'emoji', text: '☀️', x: 420, y: 40, size: 50 }, 2, n),
    // the table
    only({ kind: 'rect', x: 40, y: 170, w: 400, h: 20, rx: 6, cls: 'g3s-wood' }, 3, n),
    only({ kind: 'emoji', text: '🍞', x: 130, y: 140, size: 60 }, 3, n),
    only({ kind: 'emoji', text: '🥣', x: 240, y: 140, size: 60 }, 3, n),
    only({ kind: 'emoji', text: '🐄', x: 370, y: 136, size: 64 }, 3, n),
  ],
};
export default scene;
