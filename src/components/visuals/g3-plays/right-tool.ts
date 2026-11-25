// Choosing the appropriate tool (SCI3-OI7-GQ1-LO1 K1.1, S1.2): a thermometer for how warm, a ruler
// for how long, a timer for how much time and a scale for how heavy.
import { only, type PlayScene, type Sprite, type Key } from '../g3-sprites.ts';

const n = 4;
const tools: [string, number, number][] = [['🌡️', 280, 75], ['📏', 400, 75], ['⏱️', 280, 175], ['⚖️', 400, 175]];
const things = ['🍲', '🐛', '🧊', '🎃'];
const scene: PlayScene = {
  w: 480,
  h: 250,
  mode: 'jump',
  states: [
    { label: '🍲 How warm?', say: 'How warm is the soup? A thermometer measures temperature.' },
    { label: '🐛 How long?', say: 'How long is the caterpillar? A ruler measures length.' },
    { label: '🧊 How much time?', say: 'How long does the ice take to melt? A timer measures time.' },
    { label: '🎃 How heavy?', say: 'How heavy is the pumpkin? A scale measures how heavy it is.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="250"/><rect class="g3s-plate" x="220" y="20" width="240" height="210" rx="12"/>',
  sprites: [
    ...things.map((text, i): Sprite => only({ kind: 'emoji', text, x: 110, y: 125, size: 100 }, i, n)),
    ...tools.map(([, x, y], i): Sprite => only({ kind: 'ellipse', x, y, w: 86, h: 86, cls: 'g3s-hl' }, i, n)),
    ...tools.map(([text, x, y], i): Sprite => ({
      kind: 'emoji', text, x, y, size: 54, cls: i ? 'g3s-ghost' : undefined,
      keys: things.map((_, t): Key => ({ t, cls: t === i ? '' : 'g3s-ghost' })),
    })),
  ],
};
export default scene;
