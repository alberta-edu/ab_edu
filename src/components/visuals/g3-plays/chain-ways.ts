// Four ways to show the same food chain (SCI3-OI4-GQ1-LO1 K1.2): a picture, a diagram, a story and
// words. Grass, then a ground squirrel, then a hawk.
import { only, type PlayScene } from '../g3-sprites.ts';

const n = 4;
const scene: PlayScene = {
  w: 480,
  h: 240,
  mode: 'jump',
  states: [
    { label: '🖼️ Picture', say: 'A picture shows the plants and animals in their home.' },
    { label: '➡️ Diagram', say: 'A diagram uses arrows. Each arrow points to the one that eats it.' },
    { label: '📖 Story', say: 'A story tells what happens: a squirrel munches grass, and a hawk swoops down to catch it.' },
    { label: '🔤 Words', say: 'Words can show it too: grass, ground squirrel, hawk.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="240"/>',
  sprites: [
    // picture
    only({ kind: 'rect', x: 0, y: 190, w: 480, h: 50, cls: 'g3s-grass' }, 0, n),
    ...[60, 150, 330, 420].map((x) => only({ kind: 'emoji', text: '🌿', x, y: 190, size: 40 }, 0, n)),
    only({ kind: 'emoji', text: '🐿️', x: 240, y: 170, size: 54 }, 0, n),
    only({ kind: 'emoji', text: '🦅', x: 340, y: 60, size: 60 }, 0, n),
    // diagram
    ...[[80, '🌿'], [240, '🐿️'], [400, '🦅']].map(([x, t]) => only({ kind: 'emoji', text: t as string, x: x as number, y: 110, size: 64 }, 1, n)),
    only({ kind: 'arrow', x: 120, y: 110, w: 76, h: 10, r: 0, cls: 'g3s-push' }, 1, n),
    only({ kind: 'arrow', x: 280, y: 110, w: 76, h: 10, r: 0, cls: 'g3s-push' }, 1, n),
    ...[[80, 'Grass'], [240, 'Squirrel'], [400, 'Hawk']].map(([x, t]) => only({ kind: 'text', text: t as string, x: x as number, y: 170, size: 20, cls: 'g3s-label' }, 1, n)),
    // story
    only({ kind: 'emoji', text: '📖', x: 240, y: 110, size: 110 }, 2, n),
    only({ kind: 'text', text: 'Once upon a time…', x: 240, y: 210, size: 22, cls: 'g3s-label' }, 2, n),
    // words
    only({ kind: 'text', text: 'grass, ground squirrel, hawk', x: 240, y: 120, size: 26, cls: 'g3s-label' }, 3, n),
  ],
};
export default scene;
