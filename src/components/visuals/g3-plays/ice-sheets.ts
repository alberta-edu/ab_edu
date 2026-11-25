// Glaciers are what is left of the ice sheets (SCI3-OI3-GQ1-LO1 K2.2): long ago, very thick ice
// covered all of Canada. It melted back, and today's glaciers are what remains.
import { only, type PlayScene } from '../g3-sprites.ts';

const n = 3;
const scene: PlayScene = {
  w: 480,
  h: 250,
  mode: 'steps',
  next: 'Next ▶',
  back: '◀ Back',
  states: [
    { label: 'Long ago', say: 'Long ago, ice sheets much thicker than the tallest buildings covered all of Canada.' },
    { label: 'Melting', say: 'As Earth warmed, the giant ice sheets slowly melted away.' },
    { label: 'Today', say: 'Today, glaciers high in the mountains are what is left of those giant ice sheets.' },
  ],
  bg:
    '<rect class="g3s-sky" width="480" height="250"/><rect class="g3s-grass" y="200" width="480" height="50"/>' +
    '<path class="g3s-rock" d="M0,200 L40,100 L80,150 L120,80 L170,160 L210,120 L250,200 Z"/>',
  sprites: [
    only({ kind: 'path', d: 'M0,200 L0,30 Q240,10 480,40 L480,200 Z', cls: 'g3s-ice' }, 0, n),
    only({ kind: 'path', d: 'M0,200 L0,70 Q150,60 300,150 Q340,190 360,200 Z', cls: 'g3s-ice' }, 1, n),
    only({ kind: 'path', d: 'M28,130 L40,100 L54,120 Z M106,110 L120,80 L136,112 Z', cls: 'g3s-ice' }, 2, n),
    only({ kind: 'emoji', text: '🏙️', x: 400, y: 180, size: 50 }, 2, n),
    only({ kind: 'text', text: 'Canada', x: 400, y: 228, size: 20, cls: 'g3s-label' }, 0, n),
    only({ kind: 'text', text: 'Glaciers', x: 80, y: 60, size: 20, cls: 'g3s-label' }, 2, n),
    only({ kind: 'emoji', text: '☀️', x: 430, y: 50, size: 50 }, 1, n),
  ],
};
export default scene;
