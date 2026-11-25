// Two ways to share how the land changed (SCI3-OI3-GQ1-LO1 K1.3, U1.2, S1.2): the Okotoks Erratic,
// Big Rock, in scientific knowledge and in a Blackfoot story. Sources: Government of Alberta,
// "Okotoks Erratic – Big Rock"; Alberta's Historic Places, "Our Record in Stone: Blackfoot
// Perspectives of Okotoks" (Blair First Rider and Laura Golebiowski).
import { only, type PlayScene, type Sprite } from '../g3-sprites.ts';

const n = 4;
/** Shown in every state but the glacier one. */
const notIce = (sp: Sprite): Sprite => ({ ...sp, o: 1, keys: [0, 1, 2, 3].map((t) => ({ t, o: t === 1 ? 0 : 1 })) });

const scene: PlayScene = {
  w: 480,
  h: 250,
  mode: 'steps',
  next: 'Next ▶',
  back: '◀ Back',
  states: [
    { label: 'Big Rock', say: 'Big Rock sits on the prairie near Okotoks, Alberta. It is about as tall as a three-storey building.' },
    { label: 'Science', say: 'Scientific knowledge: long ago, a glacier carried the rock from the mountains near Jasper. When the ice melted, the rock stayed.' },
    { label: 'A Blackfoot story', say: 'A Blackfoot story: Napi took back the robe he gave the rock. The rock rolled after him until bats split it.' },
    { label: 'Respect', say: 'The name Okotoks comes from okatok, the Blackfoot word for rock. Big Rock is special, so visitors stay off it.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="250"/><rect class="g3s-grass" y="210" width="480" height="40"/>',
  sprites: [
    // the split rock on the prairie
    notIce({ kind: 'path', d: 'M120,212 L140,130 L220,112 L232,212 Z', cls: 'g3s-rock' }),
    notIce({ kind: 'path', d: 'M244,212 L250,110 L330,124 L360,212 Z', cls: 'g3s-rock' }),
    only({ kind: 'emoji', text: '🧍', x: 410, y: 186, size: 40 }, 0, n),
    // the glacier carries the rock out of the mountains
    only({ kind: 'path', d: 'M0,210 L0,60 L60,20 L110,80 L150,40 L200,210 Z', cls: 'g3s-l5' }, 1, n),
    only({ kind: 'path', d: 'M0,140 Q240,120 470,190 L470,210 L0,210 Z', cls: 'g3s-ice' }, 1, n),
    only({ kind: 'path', d: 'M260,150 L272,118 L310,112 L320,150 Z', cls: 'g3s-rock' }, 1, n),
    only({ kind: 'arrow', x: 250, y: 90, w: 110, h: 12, r: 8, cls: 'g3s-push' }, 1, n),
    only({ kind: 'text', text: 'Glacier', x: 120, y: 170, size: 22, cls: 'g3s-label' }, 1, n),
    // Napi runs, bats split the rock
    only({ kind: 'emoji', text: '🏃', x: 430, y: 180, size: 50 }, 2, n),
    only({ kind: 'emoji', text: '🦇', x: 220, y: 60, size: 40 }, 2, n),
    only({ kind: 'emoji', text: '🦇', x: 270, y: 40, size: 34 }, 2, n),
    only({ kind: 'arrow', x: 370, y: 160, w: 40, h: 10, r: 0, cls: 'g3s-soft' }, 2, n),
    // visitors stay back
    only({ kind: 'emoji', text: '🧍', x: 420, y: 196, size: 34 }, 3, n),
    only({ kind: 'emoji', text: '🧍', x: 450, y: 196, size: 34 }, 3, n),
    only({ kind: 'text', text: 'okatok = rock', x: 240, y: 50, size: 24, cls: 'g3s-label' }, 3, n),
  ],
};
export default scene;
