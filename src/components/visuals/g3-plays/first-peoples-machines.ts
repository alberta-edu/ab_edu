// Simple machines of First Nations, Métis and Inuit (SCI3-OI2-GQ1-LO1 K2.2, S2.4): an antler wedge,
// a canoe paddle and an ulu. Sources: Royal BC Museum Learning Portal (antler wedge in use);
// Canada's History, "Indispensable Ulu".
import { only, type PlayScene } from '../g3-sprites.ts';

const n = 3;
const scene: PlayScene = {
  w: 480,
  h: 250,
  mode: 'jump',
  states: [
    { label: 'Antler wedge', say: 'Antler wedge: First Nations on the West Coast hammer antler wedges into a log. The wedge splits off a flat plank.' },
    { label: 'Paddle', say: 'Paddle: a lever. Cree, Dene and Métis paddlers push the water back, and the canoe moves forward.' },
    { label: 'Ulu', say: 'Ulu: an Inuit knife with a curved blade. Its thin edge is a wedge that cuts and scrapes hides, fish and meat.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="250"/>',
  sprites: [
    // antler wedge splitting a log
    only({ kind: 'rect', x: 0, y: 215, w: 480, h: 35, cls: 'g3s-grass' }, 0, n),
    only({ kind: 'rect', x: 60, y: 150, w: 330, h: 64, rx: 10, cls: 'g3s-wood' }, 0, n),
    only({ kind: 'path', d: 'M200,150 L200,214', cls: 'g3s-line' }, 0, n),
    only({ kind: 'path', d: 'M184,104 L216,104 L200,170 Z', cls: 'g3s-hide' }, 0, n),
    only({ kind: 'emoji', text: '🪨', x: 200, y: 66, size: 46 }, 0, n),
    only({ kind: 'arrow', x: 250, y: 50, w: 50, h: 12, r: 90, cls: 'g3s-push' }, 0, n),
    only({ kind: 'text', text: 'Split!', x: 300, y: 130, size: 22, cls: 'g3s-label' }, 0, n),
    // paddle and canoe
    only({ kind: 'rect', x: 0, y: 170, w: 480, h: 80, cls: 'g3s-water' }, 1, n),
    only({ kind: 'path', d: 'M100,140 Q250,205 400,140 Z', cls: 'g3s-wood' }, 1, n),
    only({ kind: 'emoji', text: '🧑', x: 290, y: 118, size: 50 }, 1, n),
    only({ kind: 'line', x: 262, y: 90, x2: 200, y2: 210, cls: 'g3s-line' }, 1, n),
    only({ kind: 'ellipse', x: 198, y: 212, w: 18, h: 40, cls: 'g3s-wood' }, 1, n),
    only({ kind: 'arrow', x: 170, y: 225, w: 80, h: 10, r: 180, cls: 'g3s-rub' }, 1, n),
    only({ kind: 'arrow', x: 320, y: 100, w: 90, h: 12, r: 0, cls: 'g3s-push' }, 1, n),
    only({ kind: 'text', text: 'Water back', x: 20, y: 200, size: 18, anchor: 'start', cls: 'g3s-label' }, 1, n),
    only({ kind: 'text', text: 'Canoe forward', x: 460, y: 72, size: 18, anchor: 'end', cls: 'g3s-label' }, 1, n),
    // ulu scraping a hide
    only({ kind: 'path', d: 'M40,200 Q240,170 440,200 L440,240 L40,240 Z', cls: 'g3s-hide' }, 2, n),
    only({ kind: 'rect', x: 190, y: 60, w: 100, h: 22, rx: 8, cls: 'g3s-wood' }, 2, n),
    only({ kind: 'rect', x: 232, y: 80, w: 16, h: 24, cls: 'g3s-wood' }, 2, n),
    only({ kind: 'path', d: 'M170,104 L310,104 Q300,180 240,184 Q180,180 170,104 Z', cls: 'g3s-shine' }, 2, n),
    only({ kind: 'arrow', x: 320, y: 196, w: 90, h: 10, r: 0, cls: 'g3s-push' }, 2, n),
    only({ kind: 'text', text: 'Thin edge', x: 140, y: 175, size: 18, anchor: 'end', cls: 'g3s-label' }, 2, n),
  ],
};
export default scene;
