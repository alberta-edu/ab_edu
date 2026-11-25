// Glaciers are melting faster (SCI3-OI3-GQ1-LO1 K2.4): the Athabasca Glacier has melted back more
// than 1.5 km in about 125 years. Sources: Parks Canada, Jasper National Park, "Glaciers and
// icefields"; CBC News (2014), "Athabasca Glacier could disappear within generation".
import { from, only, type PlayScene } from '../g3-sprites.ts';

const n = 3;
const scene: PlayScene = {
  w: 480,
  h: 230,
  mode: 'steps',
  next: 'Next ▶',
  back: '◀ Back',
  states: [
    { label: 'Long ago', say: 'About 125 years ago, the Athabasca Glacier reached all the way down to here.' },
    { label: 'Today', say: 'Today it ends more than 1.5 km farther back. A lake fills where ice once was.' },
    { label: 'Why?', say: 'Earth is warming up, from natural causes and from things people do. So glaciers now melt even faster.' },
  ],
  bg:
    '<rect class="g3s-sky" width="480" height="230"/><path class="g3s-rock" d="M0,40 L80,20 L170,120 L480,120 L480,230 L0,230 Z"/>',
  sprites: [
    { kind: 'path', d: 'M0,45 L80,25 L125,75 L0,75 Z', cls: 'g3s-snow' },
    { kind: 'rect', x: -20, y: 70, w: 440, h: 50, rx: 20, cls: 'g3s-ice', keys: [{ t: 1, w: 270 }, { t: 2, w: 240 }] },
    from({ kind: 'ellipse', x: 330, y: 122, w: 120, h: 14, cls: 'g3s-water' }, 1, n),
    { kind: 'emoji', text: '🚩', x: 420, y: 104, size: 30 },
    { kind: 'text', text: 'Long ago', x: 420, y: 146, size: 18, cls: 'g3s-label' },
    from({ kind: 'emoji', text: '🚩', x: 250, y: 104, size: 30 }, 1, n),
    from({ kind: 'text', text: 'Today', x: 250, y: 146, size: 18, cls: 'g3s-label' }, 1, n),
    from({ kind: 'text', text: '1.5 km', x: 335, y: 190, size: 20, cls: 'g3s-label' }, 1, n),
    only({ kind: 'emoji', text: '☀️', x: 420, y: 40, size: 60 }, 2, n),
    only({ kind: 'emoji', text: '💧', x: 200, y: 134, size: 22 }, 2, n),
    only({ kind: 'emoji', text: '💧', x: 150, y: 134, size: 22 }, 2, n),
  ],
};
export default scene;
