// Animals change the land (SCI3-OI3-GQ1-LO1 K3.2, S3.2, U3.1): beavers cut trees and dam a stream.
// Water backs up behind the dam and floods the meadow into a pond.
import { showFrom, ticker, type RunScene } from '../../visuals/g3-sprites.ts';

const CUT = 0.18;
const DAM = 0.45;
const scene: RunScene = {
  w: 480,
  h: 290,
  ms: 7000,
  live: 'The beavers cut down trees and built a dam across the stream. Water backed up behind the dam and flooded the meadow into a pond.',
  bg: '<rect class="g3s-grass" width="480" height="290"/>',
  sprites: [
    // the pond grows behind the dam (drawn under the stream)
    { kind: 'ellipse', x: 170, y: 160, w: 0, h: 0, cls: 'g3s-water', keys: [{ t: DAM, w: 60, h: 30 }, { t: 0.9, w: 330, h: 190 }] },
    { kind: 'rect', x: 0, y: 145, w: 480, h: 30, cls: 'g3s-water' },
    // downstream gets smaller once the dam is built
    { kind: 'rect', x: 300, y: 145, w: 180, h: 30, cls: 'g3s-grass', o: 0, keys: [{ t: DAM, o: 0 }, { t: 0.75, o: 0.7 }] },
    { kind: 'emoji', text: '🌼', x: 120, y: 110, size: 26, keys: [{ t: 0.6, o: 1 }, { t: 0.75, o: 0 }] },
    { kind: 'emoji', text: '🌼', x: 200, y: 210, size: 26, keys: [{ t: 0.6, o: 1 }, { t: 0.75, o: 0 }] },
    // trees: two get cut and turn into the dam
    { kind: 'emoji', text: '🌳', x: 400, y: 70, size: 60 },
    { kind: 'emoji', text: '🌳', x: 60, y: 250, size: 60 },
    { kind: 'emoji', text: '🌳', x: 330, y: 80, size: 60, keys: [{ t: CUT, r: 0, x: 330, y: 80, o: 1 }, { t: CUT + 0.08, r: 90, x: 320, y: 110 }, { t: DAM - 0.05, r: 90, x: 300, y: 140, o: 1 }, { t: DAM, o: 0 }] },
    { kind: 'emoji', text: '🌳', x: 360, y: 240, size: 60, keys: [{ t: CUT + 0.06, r: 0, x: 360, y: 240, o: 1 }, { t: CUT + 0.14, r: -90, x: 340, y: 210 }, { t: DAM - 0.03, r: -90, x: 305, y: 180, o: 1 }, { t: DAM + 0.02, o: 0 }] },
    // the dam: a wall of sticks across the stream
    { kind: 'rect', x: 290, y: 128, w: 22, h: 64, rx: 6, cls: 'g3s-wood', o: 0, keys: [{ t: DAM - 0.04, o: 0 }, { t: DAM, o: 1 }] },
    { kind: 'emoji', text: '🦫', x: 380, y: 120, size: 40, keys: [{ t: CUT - 0.08, x: 380, y: 120 }, { t: CUT, x: 350, y: 100 }, { t: DAM, x: 330, y: 150 }, { t: 0.7, x: 250, y: 160 }] },
    showFrom({ kind: 'text', text: 'Dam', x: 300, y: 216, size: 20, cls: 'g3s-label' }, DAM),
    showFrom({ kind: 'text', text: 'New pond', x: 150, y: 160, size: 22, cls: 'g3s-label' }, 0.85),
    ticker(240, 24, [[0, 'A stream in a meadow'], [CUT, 'Chomp, chomp…'], [DAM, 'A few weeks later…']], 20, 'middle'),
  ],
};
export default scene;
