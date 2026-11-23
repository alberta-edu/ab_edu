// Blackfoot (Niitsitapi) knowledge of plants and animals (SCI3-OI4-GQ1-LO1 K4.3, S4.4): buffalo
// behaviour (Head-Smashed-In Buffalo Jump), food from buffalo, berries and wild turnip, buffalo
// wintering in sheltered river valleys and moving onto the plains in spring and summer, and times of
// year named for signs in nature. Sources: UNESCO, "Head-Smashed-In Buffalo Jump"; Galt Museum,
// "Niitsitapiiksi: The Blackfoot People"; Trail Tribes (University of Montana), "Camp Life and
// Seasonal Round" (Blackfeet).
import { only, type PlayScene } from '../g3-sprites.ts';

const n = 4;
const scene: PlayScene = {
  w: 480,
  h: 250,
  mode: 'jump',
  states: [
    { label: '🦬 Behaviour', say: 'Blackfoot hunters knew how buffalo move as a herd. They used this to hunt at Head-Smashed-In Buffalo Jump.' },
    { label: '🫐 Food', say: 'The Blackfoot knew where to find food: buffalo, berries and wild turnip.' },
    { label: '🧭 Moving', say: 'Buffalo spent winter in sheltered river valleys. In spring, they moved onto the open plains, and the Blackfoot followed.' },
    { label: '🍂 Seasons', say: 'Times of year were named for signs in nature, like when the geese come and when berries are ripe.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="250"/><rect class="g3s-field" y="180" width="480" height="70"/>',
  sprites: [
    // a herd moving together
    ...[[120, 150], [180, 140], [240, 155], [300, 142], [200, 170]].map(([x, y]) => only({ kind: 'emoji', text: '🦬', x, y, size: 50 }, 0, n)),
    only({ kind: 'arrow', x: 330, y: 150, w: 80, h: 10, r: 0, cls: 'g3s-push' }, 0, n),
    // food
    only({ kind: 'emoji', text: '🦬', x: 100, y: 150, size: 70 }, 1, n),
    only({ kind: 'emoji', text: '🫐', x: 240, y: 160, size: 60 }, 1, n),
    only({ kind: 'emoji', text: '🌱', x: 370, y: 140, size: 50 }, 1, n),
    only({ kind: 'ellipse', x: 370, y: 190, w: 34, h: 24, cls: 'g3s-wax' }, 1, n),
    only({ kind: 'text', text: 'Wild turnip', x: 370, y: 226, size: 18, cls: 'g3s-label' }, 1, n),
    // winter valley to summer plains
    only({ kind: 'path', d: 'M0,180 L0,100 Q60,180 140,180 Z', cls: 'g3s-l2' }, 2, n),
    only({ kind: 'path', d: 'M30,186 Q90,196 150,186', cls: 'g3s-river' }, 2, n),
    only({ kind: 'emoji', text: '🌲', x: 50, y: 150, size: 40 }, 2, n),
    only({ kind: 'emoji', text: '❄️', x: 70, y: 60, size: 34 }, 2, n),
    only({ kind: 'emoji', text: '☀️', x: 400, y: 50, size: 44 }, 2, n),
    only({ kind: 'arrow', x: 150, y: 150, w: 160, h: 10, r: 0, cls: 'g3s-push' }, 2, n),
    only({ kind: 'emoji', text: '🦬', x: 360, y: 150, size: 54 }, 2, n),
    only({ kind: 'emoji', text: '⛺', x: 430, y: 160, size: 44 }, 2, n),
    // signs of the seasons
    only({ kind: 'emoji', text: '🪿', x: 120, y: 70, size: 44 }, 3, n),
    only({ kind: 'emoji', text: '🪿', x: 170, y: 90, size: 36 }, 3, n),
    only({ kind: 'emoji', text: '🫐', x: 340, y: 150, size: 54 }, 3, n),
    only({ kind: 'emoji', text: '🌿', x: 400, y: 160, size: 50 }, 3, n),
  ],
};
export default scene;
