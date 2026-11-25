// Classify the animals in a food chain (SCI3-OI4-GQ1-LO1 S2.1, U2.1): grass, grasshopper (herbivore),
// striped skunk (omnivore: insects, eggs, berries) and great horned owl (carnivore, a main hunter of
// skunks). Source: Alberta Conservation Association; Government of Alberta, Wild Species.
import { from, type PlayScene, type Sprite } from '../g3-sprites.ts';

const n = 4;
const xs = [60, 180, 300, 420];
const items: [string, string][] = [['🌾', 'Plant'], ['🦗', 'Herbivore'], ['🦨', 'Omnivore'], ['🦉', 'Carnivore']];
const cls = ['g3s-grass', 'g3s-ok', 'g3s-pull', 'g3s-bad'];

const scene: PlayScene = {
  w: 480,
  h: 220,
  mode: 'steps',
  next: 'Next ▶',
  back: '◀ Back',
  states: [
    { label: 'Grass', say: 'This prairie food chain starts with grass, a plant.' },
    { label: 'Grasshopper', say: 'Grasshoppers eat only plants. A grasshopper is a herbivore.' },
    { label: 'Skunk', say: 'Skunks eat grasshoppers, and berries too. A skunk eats both, so it is an omnivore.' },
    { label: 'Owl', say: 'Great horned owls hunt skunks and eat mostly meat. An owl is a carnivore.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="220"/>',
  sprites: [
    ...items.flatMap(([emoji, kind], i): Sprite[] => [
      { kind: 'emoji', text: emoji, x: xs[i], y: 90, size: 56 },
      from({ kind: 'rect', x: xs[i] - 56, y: 140, w: 112, h: 34, rx: 17, cls: cls[i] }, i, n),
      from({ kind: 'text', text: kind, x: xs[i], y: 157, size: 19, cls: i ? 'g3s-paint' : 'g3s-label' }, i, n),
    ]),
    ...[0, 1, 2].map((i) => ({ kind: 'arrow', x: xs[i] + 30, y: 90, w: 58, h: 8, r: 0, cls: 'g3s-push' }) as Sprite),
  ],
};
export default scene;
