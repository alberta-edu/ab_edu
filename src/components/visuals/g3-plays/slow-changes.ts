// Slow changes to Earth's surface (SCI3-OI3-GQ1-LO1 K1.1, U1.1): rivers changing course, lakes
// drying out and refilling, and glaciers advancing and receding.
import { only, type PlayScene } from '../g3-sprites.ts';

const n = 3;
const scene: PlayScene = {
  w: 480,
  h: 260,
  mode: 'jump',
  states: [
    { label: 'River', say: 'Over many years, a river wears away its banks and slowly moves to a new path.' },
    { label: 'Lake', say: 'Lakes and seas can dry out over many dry years, then fill up again when wet years come.' },
    { label: 'Glacier', say: 'A glacier is a huge, slow river of ice. Over many years it moves forward, then melts back.' },
  ],
  bg: '<rect class="g3s-grass" width="480" height="260"/>',
  sprites: [
    // river: the old, dry path and the river now
    only({ kind: 'path', d: 'M0,60 C120,60 120,200 240,200 S360,60 480,60', cls: 'g3s-thin' }, 0, n),
    only({ kind: 'path', d: 'M0,60 C160,40 160,160 240,150 S340,50 480,70', cls: 'g3s-river' }, 0, n),
    only({ kind: 'text', text: 'Old, dry path', x: 240, y: 230, size: 20, cls: 'g3s-label' }, 0, n),
    only({ kind: 'text', text: 'River now', x: 240, y: 118, size: 20, cls: 'g3s-label' }, 0, n),
    // lake: the old shore and the smaller lake now
    only({ kind: 'ellipse', x: 240, y: 130, w: 380, h: 200, cls: 'g3s-sand' }, 1, n),
    only({ kind: 'ellipse', x: 240, y: 140, w: 200, h: 100, cls: 'g3s-water' }, 1, n),
    only({ kind: 'text', text: 'Old shore', x: 240, y: 52, size: 20, cls: 'g3s-label' }, 1, n),
    only({ kind: 'text', text: 'Lake now', x: 240, y: 140, size: 20, cls: 'g3s-label' }, 1, n),
    // glacier: mountains, the ice now, and how far it reached long ago
    only({ kind: 'rect', x: 0, y: 0, w: 480, h: 260, cls: 'g3s-sky' }, 2, n),
    only({ kind: 'path', d: 'M0,200 L70,40 L150,150 L240,30 L330,150 L410,50 L480,170 L480,260 L0,260 Z', cls: 'g3s-rock' }, 2, n),
    only({ kind: 'path', d: 'M200,70 L280,70 L300,160 Q240,180 180,160 Z', cls: 'g3s-ice' }, 2, n),
    only({ kind: 'path', d: 'M180,160 L150,245 L330,245 L300,160', cls: 'g3s-thin' }, 2, n),
    only({ kind: 'text', text: 'Ice reached here long ago', x: 240, y: 225, size: 18, cls: 'g3s-label' }, 2, n),
  ],
};
export default scene;
