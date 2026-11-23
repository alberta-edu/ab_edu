// Food chains in Alberta and other parts of Canada (SCI3-OI4-GQ1-LO1 S1.1, K1.1): prairie (grass,
// Richardson's ground squirrel, ferruginous hawk), boreal forest (willow, snowshoe hare, lynx), Rocky
// Mountains (grass, bighorn sheep, cougar) and Arctic tundra (grass, lemming, Arctic fox).
import { only, type PlayScene, type Sprite } from '../g3-sprites.ts';

const n = 4;
const chain = (i: number, bg: string, items: [string, string][]): Sprite[] => [
  only({ kind: 'rect', x: 0, y: 170, w: 480, h: 70, cls: bg }, i, n),
  ...items.flatMap(([emoji, name], k) => [
    only({ kind: 'emoji', text: emoji, x: 80 + k * 160, y: 100, size: 64 }, i, n),
    only({ kind: 'text', text: name, x: 80 + k * 160, y: 200, size: 19, cls: 'g3s-label' }, i, n),
  ]),
  only({ kind: 'arrow', x: 120, y: 100, w: 76, h: 10, r: 0, cls: 'g3s-push' }, i, n),
  only({ kind: 'arrow', x: 280, y: 100, w: 76, h: 10, r: 0, cls: 'g3s-push' }, i, n),
];

const scene: PlayScene = {
  w: 480,
  h: 240,
  mode: 'jump',
  states: [
    { label: '🌾 Prairie', say: 'On the Alberta prairie, ground squirrels eat grass. Hawks eat ground squirrels.' },
    { label: '🌲 Forest', say: 'In the northern forest, snowshoe hares eat willow twigs. Lynx eat snowshoe hares.' },
    { label: '⛰️ Mountains', say: 'In the Rocky Mountains, bighorn sheep eat grass. Cougars eat bighorn sheep.' },
    { label: '❄️ Arctic', say: 'On the Arctic tundra, lemmings eat grasses. Arctic foxes eat lemmings.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="240"/>',
  sprites: [
    ...chain(0, 'g3s-field', [['🌾', 'Grass'], ['🐿️', 'Ground squirrel'], ['🦅', 'Hawk']]),
    ...chain(1, 'g3s-grass', [['🌿', 'Willow'], ['🐇', 'Snowshoe hare'], ['🐈', 'Lynx']]),
    ...chain(2, 'g3s-rock', [['🌱', 'Grass'], ['🐏', 'Bighorn sheep'], ['🐆', 'Cougar']]),
    ...chain(3, 'g3s-snow', [['🌱', 'Grasses'], ['🐹', 'Lemming'], ['🦊', 'Arctic fox']]),
  ],
};
export default scene;
