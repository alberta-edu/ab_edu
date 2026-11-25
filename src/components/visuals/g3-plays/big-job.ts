// Breaking a task into smaller chunks (SCI3-OI6-GQ1-LO1 K1.1, S1.2): a messy room is one big job.
// Split into three chunks (toys, books, clothes), each chunk is small and quick, and the room gets
// clean one chunk at a time.
import { from, type PlayScene, type Sprite } from '../g3-sprites.ts';

const n = 4;
// [emoji, messy x, messy y, tidy x, tidy y, the chunk that tidies it]
const things: [string, number, number, number, number, number][] = [
  ['🧸', 150, 200, 66, 150, 1], ['🪀', 330, 214, 98, 152, 1], ['⚽', 250, 196, 82, 128, 1],
  ['📕', 200, 226, 216, 74, 2], ['📗', 390, 196, 240, 74, 2], ['📘', 100, 228, 264, 74, 2],
  ['👕', 290, 230, 392, 118, 3], ['🧦', 430, 226, 420, 118, 3], ['👖', 60, 206, 406, 150, 3],
];
const tag = (i: number, text: string): Sprite => from({ kind: 'text', text, x: 30 + 140 * (i - 1), y: 26, size: 19, anchor: 'start', cls: 'g3s-label' }, i, n);

const scene: PlayScene = {
  w: 480,
  h: 250,
  mode: 'steps',
  next: 'Next chunk ▶',
  back: '◀ Back',
  states: [
    { label: 'Big job', say: 'Clean your room! It looks like one huge job. Where do you even start?' },
    { label: 'Toys', say: 'Break it into chunks. Chunk 1: put the toys in the bin.' },
    { label: 'Books', say: 'Chunk 2: put the books on the shelf.' },
    { label: 'Clothes', say: 'Chunk 3: put the clothes in the drawer. Small chunks made the big job easy!' },
  ],
  bg:
    '<rect class="g3s-sky" width="480" height="250"/><rect class="g3s-wood" y="180" width="480" height="70"/>' +
    '<rect class="g3s-chip" x="40" y="120" width="88" height="60" rx="6"/>' +
    '<rect class="g3s-wood" x="196" y="92" width="96" height="10"/>' +
    '<rect class="g3s-wood" x="370" y="100" width="70" height="80" rx="4"/><line class="g3s-line" x1="370" y1="140" x2="440" y2="140"/>',
  sprites: [
    ...things.map(([text, x, y, x2, y2, c]): Sprite => ({
      kind: 'emoji', text, x, y, size: 32, keys: [{ t: c - 1, x, y }, { t: c, x: x2, y: y2 }],
    })),
    tag(1, '✅ Toys'),
    tag(2, '✅ Books'),
    tag(3, '✅ Clothes'),
  ],
};
export default scene;
