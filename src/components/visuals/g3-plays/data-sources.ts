// Data can come from many sources (SCI3-OI7-GQ1-LO1 K1.4), the curriculum's list: investigations,
// texts, websites, Elders or Knowledge Keepers, community members and personal observations.
import { only, type PlayScene, type Sprite } from '../g3-sprites.ts';

const n = 6;
const pics: [string, string][] = [['🔬', '🌱'], ['📚', '📖'], ['💻', '🌦️'], ['🧓', '🗣️'], ['👩‍🌾', '🌾'], ['👀', '🐦']];
const scene: PlayScene = {
  w: 480,
  h: 220,
  mode: 'jump',
  states: [
    { label: '🔬 Investigations', say: 'You can get data from an investigation, like planting seeds and measuring them.' },
    { label: '📚 Texts', say: 'Books and other texts hold data that other people collected.' },
    { label: '💻 Websites', say: 'Websites can have data, like today’s weather.' },
    { label: '🧓 Elders', say: 'Elders and Knowledge Keepers share knowledge learned and passed down over a very long time.' },
    { label: '🏘️ Community', say: 'People in your community know things too, like a farmer who knows the soil.' },
    { label: '👀 You', say: 'What you see yourself is data too, like counting the birds in your yard.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="220"/><rect class="g3s-plate" x="300" y="40" width="140" height="140" rx="12"/>',
  sprites: [
    ...pics.flatMap(([a, b], i): Sprite[] => [
      only({ kind: 'emoji', text: a, x: 150, y: 110, size: 110 }, i, n),
      only({ kind: 'emoji', text: b, x: 370, y: 110, size: 80 }, i, n),
    ]),
    { kind: 'arrow', x: 222, y: 110, w: 64, h: 10, r: 0, cls: 'g3s-push' },
  ],
};
export default scene;
