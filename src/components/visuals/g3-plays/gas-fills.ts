// Gases fill their container (SCI3-OI1-GQ1-LO1 K3.4, K3.5): open a small jar of coloured gas into an
// empty box, then make the box bigger. The gas always spreads to fill all of it.
import { type PlayScene } from '../g3-sprites.ts';

const scene: PlayScene = {
  w: 480,
  h: 270,
  mode: 'steps',
  next: 'Next ▶',
  back: '◀ Back',
  states: [
    { label: 'Jar', say: 'A small jar is full of a purple gas. The big box next to it is empty.' },
    { label: 'Open', say: 'Open the gap. The gas flows into the box and spreads out to fill all of it.' },
    { label: 'Bigger', say: 'Make the box even bigger. The gas spreads out again to fill the new space.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="270"/>',
  sprites: [
    // the jar's gas: dark at first, then as light as the gas in the box
    { kind: 'rect', x: 32, y: 112, w: 94, h: 96, cls: 'g3s-gas', o: 1, keys: [{ t: 1, o: 0.6 }, { t: 2, o: 0.45 }] },
    { kind: 'rect', x: 130, y: 62, w: 196, h: 146, cls: 'g3s-gas', o: 0, keys: [{ t: 0, o: 0, w: 0 }, { t: 1, o: 0.6, w: 196 }, { t: 2, o: 0.45, w: 316 }] },
    { kind: 'rect', x: 30, y: 110, w: 98, h: 100, rx: 4, cls: 'g3s-box' },
    { kind: 'rect', x: 128, y: 60, w: 200, h: 150, rx: 4, cls: 'g3s-box', keys: [{ t: 1, w: 200 }, { t: 2, w: 320 }] },
    { kind: 'rect', x: 125, y: 124, w: 6, h: 76, cls: 'g3s-sky', o: 0, keys: [{ t: 0, o: 0 }, { t: 0.3, o: 1 }] },
    { kind: 'rect', x: 125, y: 124, w: 6, h: 76, cls: 'g3s-gas', o: 0, keys: [{ t: 0, o: 0 }, { t: 0.3, o: 0.6 }, { t: 2, o: 0.45 }] },
    { kind: 'text', text: 'Gas', x: 79, y: 236, size: 24, cls: 'g3s-label' },
    { kind: 'text', text: 'Empty box', x: 228, y: 236, size: 24, cls: 'g3s-label', keys: [{ t: 1, text: 'Full of gas', x: 228 }, { t: 2, x: 288 }] },
  ],
};
export default scene;
