// Simple machines (SCI3-OI2-GQ1-LO1 K2.1, U2.1, S2.1): lift a box straight up onto a table, or push
// it up a ramp. The ramp needs a much smaller push.
import { showFrom, type RunScene } from '../../visuals/g3-sprites.ts';

const T0 = 0.15;
const T1 = 0.7;
// The ramp climbs from (260, 260) to (400, 180), about 30 degrees.
const TILT = -29.7;

const scene: RunScene = {
  w: 480,
  h: 300,
  ms: 6000,
  live: 'Lifting the box straight up took a big push. Pushing it up the ramp took a much smaller push, and the box got to the same table.',
  bg:
    '<rect class="g3s-sky" width="480" height="300"/><rect class="g3s-grass" y="260" width="480" height="40"/>' +
        '<rect class="g3s-wood" x="120" y="180" width="70" height="80"/><rect class="g3s-wood" x="400" y="180" width="80" height="80"/>' +
    '<path class="g3s-rock" d="M260,260 L400,180 L400,260 Z"/>',
  sprites: [
    { kind: 'text', text: 'Lift it', x: 16, y: 30, size: 22, anchor: 'start', cls: 'g3s-label' },
    { kind: 'text', text: 'Use a ramp', x: 256, y: 30, size: 22, anchor: 'start', cls: 'g3s-label' },
    // lift: the box goes straight up, then onto the table
    { kind: 'emoji', text: '🧒', x: 50, y: 232, size: 50 },
    { kind: 'arrow', x: 98, y: 242, w: 0, h: 18, r: -90, cls: 'g3s-push', keys: [{ t: T0 - 0.08, w: 0, y: 242 }, { t: T0, w: 66, y: 242 }, { t: T1 - 0.12, w: 66, y: 148, o: 1 }, { t: T1 - 0.08, o: 0 }] },
    { kind: 'rect', x: 80, y: 224, w: 36, h: 36, rx: 3, cls: 'g3s-coat', keys: [{ t: T0, y: 224, x: 80 }, { t: T1 - 0.12, y: 130, x: 80 }, { t: T1, y: 144, x: 137 }] },
    // ramp: the box slides up the slope with a small push
    { kind: 'emoji', text: '🧒', x: 215, y: 236, size: 44, keys: [{ t: T0, x: 215, y: 236 }, { t: T1 - 0.05, x: 320, y: 203 }] },
    { kind: 'rect', x: 253, y: 218, w: 36, h: 36, rx: 3, r: TILT, cls: 'g3s-coat', keys: [{ t: T0, x: 253, y: 218, r: TILT }, { t: T1 - 0.05, x: 363, y: 155, r: TILT }, { t: T1, x: 412, y: 144, r: 0 }] },
    { kind: 'arrow', x: 238, y: 252, w: 0, h: 8, r: TILT, cls: 'g3s-push', keys: [{ t: T0 - 0.08, w: 0 }, { t: T0, w: 24, x: 238, y: 252 }, { t: T1 - 0.05, w: 24, x: 348, y: 189, o: 1 }, { t: T1 - 0.01, o: 0 }] },
    showFrom({ kind: 'text', text: 'Big push!', x: 100, y: 58, size: 22, cls: 'g3s-label' }, T0 + 0.05),
    showFrom({ kind: 'text', text: 'Small push', x: 360, y: 58, size: 22, cls: 'g3s-label' }, T0 + 0.05),
    showFrom({ kind: 'emoji', text: '✅', x: 155, y: 120, size: 30 }, T1 + 0.05),
    showFrom({ kind: 'emoji', text: '✅', x: 430, y: 120, size: 30 }, T1 + 0.05),
  ],
};
export default scene;
