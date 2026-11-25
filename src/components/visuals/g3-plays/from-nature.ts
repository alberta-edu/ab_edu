// Natural and processed materials (SCI3-OI1-GQ1-LO1 K1.1, S1.1): tap a processed material to see
// the natural material it was made from.
import { only, type PlayScene, type Sprite } from '../g3-sprites.ts';

const pairs = [
  { from: '🌳', fromLabel: 'Tree', to: '📄', toLabel: 'Paper', button: '📄 Paper', say: 'Paper starts as trees. The wood is mashed into mush, then pressed and dried into thin sheets.' },
  { from: '🏖️', fromLabel: 'Sand', to: '🪟', toLabel: 'Glass', button: '🪟 Glass', say: 'Glass starts as sand. The sand is melted in a very hot oven and shaped while it is soft.' },
  { from: '🐑', fromLabel: 'Sheep’s wool', to: '🧣', toLabel: 'Wool scarf', button: '🧣 Scarf', say: 'A wool scarf starts on a sheep. The wool is cut, washed, spun into yarn and knitted.' },
  { from: '🛢️', fromLabel: 'Oil', to: '🥤', toLabel: 'Plastic cup', button: '🥤 Plastic', say: 'Plastic starts as oil from deep under the ground. Factories change the oil into plastic.' },
];
const n = pairs.length;
const sprites: Sprite[] = [];
pairs.forEach((p, i) => {
  sprites.push(
    only({ kind: 'emoji', text: p.from, x: 90, y: 120, size: 84 }, i, n),
    only({ kind: 'text', text: p.fromLabel, x: 90, y: 200, size: 24, cls: 'g3s-label' }, i, n),
    only({ kind: 'emoji', text: p.to, x: 390, y: 120, size: 84 }, i, n),
    only({ kind: 'text', text: p.toLabel, x: 390, y: 200, size: 24, cls: 'g3s-label' }, i, n),
  );
});

const scene: PlayScene = {
  w: 480,
  h: 260,
  mode: 'jump',
  states: pairs.map((p) => ({ label: p.button, say: p.say })),
  bg: '<text class="g3s-soft" x="90" y="242" font-size="21" text-anchor="middle" font-weight="700">NATURAL</text><text class="g3s-soft" x="390" y="242" font-size="21" text-anchor="middle" font-weight="700">PROCESSED</text>',
  sprites: [
    { kind: 'arrow', x: 160, y: 120, w: 160, h: 10, r: 0, cls: 'g3s-push' },
    { kind: 'emoji', text: '🏭', x: 240, y: 84, size: 44 },
    { kind: 'text', text: 'People change it', x: 240, y: 154, size: 20, cls: 'g3s-soft' },
    ...sprites,
  ],
};
export default scene;
