// One animal is part of many food chains (SCI3-OI4-GQ1-LO1 K1.3, K1.4): a deer mouse eats seeds, and
// owls, foxes and badgers all eat deer mice. Each chain is just one way they connect.
import { type PlayScene, type Sprite } from '../g3-sprites.ts';

const n = 4;
const eaters: [string, string, number][] = [['🦉', 'Owl', 70], ['🦊', 'Fox', 240], ['🦡', 'Badger', 410]];
/** Hidden before chain i, bright at chain i and at the end, dim in between. */
const lit = (sp: Sprite, i: number): Sprite => ({ ...sp, o: 0, keys: [0, 1, 2, 3].map((t) => ({ t, o: t < i ? 0 : t === i || t === n - 1 ? 1 : 0.35 })) });

const scene: PlayScene = {
  w: 480,
  h: 270,
  mode: 'steps',
  next: 'Next ▶',
  back: '◀ Back',
  states: [
    { label: 'Mouse', say: 'A deer mouse eats seeds. Who eats the mouse?' },
    { label: 'Owl', say: 'Chain 1: seeds, mouse, owl.' },
    { label: 'Fox', say: 'Chain 2: seeds, mouse, fox.' },
    { label: 'Weasel', say: 'Chain 3: seeds, mouse, badger. The mouse is part of many food chains!' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="270"/>',
  sprites: [
    { kind: 'emoji', text: '🌾', x: 240, y: 236, size: 46 },
    { kind: 'arrow', x: 240, y: 208, w: 40, h: 10, r: -90, cls: 'g3s-push' },
    { kind: 'emoji', text: '🐭', x: 240, y: 140, size: 56 },
    ...eaters.flatMap(([emoji, name, x], k): Sprite[] => [
      lit({ kind: 'arrow', x: 240 + (x - 240) * 0.18, y: 110, w: Math.hypot(x - 240, 60) * 0.55, h: 10, r: (Math.atan2(-60, x - 240) * 180) / Math.PI, cls: 'g3s-push' }, k + 1),
      lit({ kind: 'emoji', text: emoji, x, y: 50, size: 56 }, k + 1),
      lit({ kind: 'text', text: name, x, y: 12, size: 18, cls: 'g3s-label' }, k + 1),
    ]),
  ],
};
export default scene;
