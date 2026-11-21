// People change Earth's surface (SCI3-OI3-GQ1-LO1 K3.1, S3.1, U3.1): living on the land, building
// towns and cities, getting resources, farming, polluting and stewardship.
import { only, type PlayScene } from '../g3-sprites.ts';

const n = 6;
const scene: PlayScene = {
  w: 480,
  h: 240,
  mode: 'jump',
  states: [
    { label: '🏡 Homes', say: 'Living on the land: people clear land for homes, roads and yards.' },
    { label: '🏙️ Cities', say: 'Building towns and cities: land is covered with buildings, roads and parking lots.' },
    { label: '⛏️ Resources', say: 'Getting resources: people dig pits and mines for gravel and coal, and cut trees for wood.' },
    { label: '🚜 Farms', say: 'Farming: the soil is turned over and crops are planted in long rows.' },
    { label: '🗑️ Pollution', say: 'Polluting: garbage and spills make land and water dirty, and harm living things.' },
    { label: '🌱 Stewardship', say: 'Stewardship: caring for the land, like planting trees and cleaning up, helps it heal.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="240"/><rect class="g3s-grass" y="170" width="480" height="70"/>',
  sprites: [
    // homes
    only({ kind: 'rect', x: 0, y: 200, w: 480, h: 16, cls: 'g3s-road' }, 0, n),
    only({ kind: 'emoji', text: '🏡', x: 120, y: 150, size: 80 }, 0, n),
    only({ kind: 'emoji', text: '🏡', x: 340, y: 150, size: 80 }, 0, n),
    // city
    only({ kind: 'rect', x: 0, y: 170, w: 480, h: 70, cls: 'g3s-pave' }, 1, n),
    only({ kind: 'emoji', text: '🏙️', x: 240, y: 110, size: 150 }, 1, n),
    only({ kind: 'rect', x: 0, y: 205, w: 480, h: 20, cls: 'g3s-road' }, 1, n),
    // a gravel pit
    only({ kind: 'path', d: 'M80,170 L130,225 L350,225 L400,170 Z', cls: 'g3s-ground' }, 2, n),
    only({ kind: 'emoji', text: '🚜', x: 240, y: 200, size: 50 }, 2, n),
    only({ kind: 'emoji', text: '🪨', x: 440, y: 155, size: 36 }, 2, n),
    only({ kind: 'emoji', text: '⛏️', x: 60, y: 150, size: 40 }, 2, n),
    // farm rows
    only({ kind: 'rect', x: 0, y: 170, w: 480, h: 70, cls: 'g3s-field', o: 0.6 }, 3, n),
    only({ kind: 'path', d: 'M0,180 H480 M0,196 H480 M0,212 H480 M0,228 H480', cls: 'g3s-line' }, 3, n),
    only({ kind: 'emoji', text: '🚜', x: 360, y: 150, size: 60 }, 3, n),
    only({ kind: 'emoji', text: '🌾', x: 100, y: 150, size: 50 }, 3, n),
    only({ kind: 'emoji', text: '🌾', x: 170, y: 150, size: 50 }, 3, n),
    // pollution
    only({ kind: 'ellipse', x: 300, y: 200, w: 180, h: 40, cls: 'g3s-wet' }, 4, n),
    only({ kind: 'emoji', text: '🗑️', x: 100, y: 170, size: 50 }, 4, n),
    only({ kind: 'emoji', text: '🥤', x: 170, y: 200, size: 30 }, 4, n),
    only({ kind: 'emoji', text: '🛍️', x: 230, y: 190, size: 30 }, 4, n),
    only({ kind: 'emoji', text: '🐟', x: 330, y: 205, size: 26, r: 180 }, 4, n),
    // stewardship
    only({ kind: 'emoji', text: '🧒', x: 140, y: 140, size: 60 }, 5, n),
    only({ kind: 'emoji', text: '🌱', x: 210, y: 165, size: 40 }, 5, n),
    only({ kind: 'emoji', text: '🌳', x: 330, y: 120, size: 90 }, 5, n),
    only({ kind: 'emoji', text: '🌳', x: 420, y: 130, size: 70 }, 5, n),
  ],
};
export default scene;
