// Melting and freezing (SCI3-OI1-GQ1-LO1 K2.3, K2.4, U2.1): heat an ice cube and it melts into a
// puddle. Cool the puddle and it freezes solid again.
import { type PlayScene } from '../g3-sprites.ts';

const scene: PlayScene = {
  w: 480,
  h: 260,
  mode: 'steps',
  next: 'Next ▶',
  back: '◀ Back',
  states: [
    { label: 'Ice', say: 'An ice cube is a solid. It keeps its own shape.' },
    { label: 'Heat', say: 'Heat it. The ice melts into liquid water. That is melting.' },
    { label: 'Cool', say: 'Cool it in the freezer. The water freezes into solid ice again. That is freezing.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="260"/>',
  sprites: [
    { kind: 'ellipse', x: 240, y: 186, w: 300, h: 40, cls: 'g3s-plate' },
    { kind: 'ellipse', x: 240, y: 184, w: 0, h: 0, cls: 'g3s-water', keys: [{ t: 0, w: 0, h: 0 }, { t: 1, w: 220, h: 22 }] },
    { kind: 'ellipse', x: 240, y: 184, w: 220, h: 22, cls: 'g3s-ice', o: 0, keys: [{ t: 1, o: 0 }, { t: 2, o: 1 }] },
    { kind: 'rect', x: 195, y: 90, w: 90, h: 90, rx: 8, cls: 'g3s-ice', keys: [{ t: 0, x: 195, y: 90, w: 90, h: 90 }, { t: 1, x: 240, y: 182, w: 0, h: 0 }] },
    { kind: 'emoji', text: '🔥', x: 240, y: 228, size: 40, o: 0, keys: [{ t: 0, o: 0 }, { t: 1, o: 1 }, { t: 2, o: 0 }] },
    { kind: 'emoji', text: '❄️', x: 400, y: 70, size: 54, o: 0, keys: [{ t: 1, o: 0 }, { t: 2, o: 1 }] },
    { kind: 'text', text: 'Solid', x: 240, y: 40, size: 28, cls: 'g3s-label', keys: [{ t: 0.6, text: 'Liquid' }, { t: 1.6, text: 'Solid again' }] },
  ],
};
export default scene;
