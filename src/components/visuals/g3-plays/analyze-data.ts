// Ways to analyze data (SCI3-OI7-GQ1-LO1 K1.6, S1.3, K1.7): notice changes, compare for accuracy,
// make connections to what you already know, discuss and collaborate, and ask questions. The data is
// an invented bean plant measured on days 1, 3 and 5.
import { only, type PlayScene, type Sprite } from '../g3-sprites.ts';

const n = 5;
const days: [string, number][] = [['Day 1', 0], ['Day 3', 2], ['Day 5', 5]];
const BASE = 190;
const scene: PlayScene = {
  w: 480,
  h: 230,
  mode: 'jump',
  states: [
    { label: '📈 Changes', say: 'Notice changes. The bean plant grew taller each time it was measured.' },
    { label: '🔍 Compare', say: 'Compare with a friend’s measurement. If they match, the data is more likely accurate.' },
    { label: '🔗 Connect', say: 'Connect it to what you already know. Plants need light, so the sunny window helped it grow.' },
    { label: '🗣️ Discuss', say: 'Talk about the data with your group. Working together, you notice more.' },
    { label: '❓ Ask', say: 'Ask questions. Would it grow faster with more water? That is a new question to test!' },
  ],
  bg:
    '<rect class="g3s-sky" width="480" height="230"/>' +
    `<line class="g3s-line" x1="30" y1="${BASE}" x2="240" y2="${BASE}"/>` +
    days.map(([d, cm], i) => `<rect class="g3s-grass" x="${46 + 66 * i}" y="${BASE - 4 - 22 * cm}" width="48" height="${4 + 22 * cm}" rx="3"/>` +
      `<text class="g3s-label" x="${70 + 66 * i}" y="${BASE + 20}" font-size="15" font-weight="700" text-anchor="middle">${d}</text>` +
      `<text class="g3s-label" x="${70 + 66 * i}" y="${BASE - 16 - 22 * cm}" font-size="15" font-weight="700" text-anchor="middle">${cm} cm</text>`).join(''),
  sprites: [
    // changes
    only({ kind: 'arrow', x: 254, y: 186, w: 110, h: 8, r: -90, cls: 'g3s-push' }, 0, n),
    only({ kind: 'emoji', text: '🌱', x: 360, y: 110, size: 90 }, 0, n),
    // compare
    ...[['👧 Mira', 80], ['👦 Sam', 150]].flatMap(([who, y]): Sprite[] => [
      only({ kind: 'rect', x: 280, y: (y as number) - 26, w: 180, h: 52, rx: 10, cls: 'g3s-plate' }, 1, n),
      only({ kind: 'text', text: `${who}: 5 cm`, x: 296, y: y as number, size: 20, anchor: 'start', cls: 'g3s-label' }, 1, n),
    ]),
    // connect
    only({ kind: 'emoji', text: '💡', x: 300, y: 110, size: 60 }, 2, n),
    only({ kind: 'emoji', text: '☀️', x: 400, y: 110, size: 70 }, 2, n),
    // discuss
    only({ kind: 'emoji', text: '👧', x: 300, y: 130, size: 56 }, 3, n),
    only({ kind: 'emoji', text: '👦', x: 370, y: 130, size: 56 }, 3, n),
    only({ kind: 'emoji', text: '🧒', x: 440, y: 130, size: 56 }, 3, n),
    only({ kind: 'emoji', text: '💬', x: 335, y: 70, size: 40 }, 3, n),
    only({ kind: 'emoji', text: '💬', x: 410, y: 70, size: 40 }, 3, n),
    // ask
    only({ kind: 'emoji', text: '❓', x: 320, y: 100, size: 70 }, 4, n),
    only({ kind: 'emoji', text: '💧', x: 410, y: 120, size: 60 }, 4, n),
  ],
};
export default scene;
