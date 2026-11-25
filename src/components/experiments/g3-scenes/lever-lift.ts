// Levers change direction (SCI3-OI2-GQ1-LO1 K2.1, U2.1, S2.1): a hand pushes down on the long end
// of a board over a log, and the heavy rock on the short end goes up.
import { showFrom, ticker, type RunScene } from '../../visuals/g3-sprites.ts';

const T0 = 0.2;
const T1 = 0.65;
// The board turns around the top of the log at (150, 212), from -20 to 8 degrees.
const scene: RunScene = {
  w: 480,
  h: 290,
  ms: 5500,
  live: 'The hand pushed the long end of the board down. The heavy rock on the short end went up.',
  bg: '<rect class="g3s-sky" width="480" height="290"/><rect class="g3s-grass" y="248" width="480" height="42"/><circle class="g3s-wood" cx="150" cy="230" r="18"/>',
  sprites: [
    { kind: 'path', d: 'M-100,-12 H260 V0 H-100 Z', x: 150, y: 212, r: -20, cls: 'g3s-wood', keys: [{ t: T0, r: -20 }, { t: T1, r: 8 }] },
    { kind: 'emoji', text: '🪨', x: 67, y: 204, size: 46, keys: [{ t: T0, x: 67, y: 204 }, { t: T1, x: 81, y: 166 }] },
    { kind: 'emoji', text: '🫳', x: 365, y: 102, size: 44, keys: [{ t: T0, x: 365, y: 102 }, { t: T1, x: 392, y: 216 }] },
    { kind: 'arrow', x: 365, y: 28, w: 0, h: 12, r: 90, cls: 'g3s-push', keys: [{ t: T0 - 0.08, w: 0 }, { t: T0, w: 44, x: 365, y: 28 }, { t: T1, w: 44, x: 392, y: 142, o: 1 }, { t: T1 + 0.05, o: 0 }] },
    showFrom({ kind: 'arrow', x: 81, y: 138, w: 44, h: 12, r: -90, cls: 'g3s-pull' }, T1 + 0.04),
    ticker(250, 40, [[0, ''], [T0, 'Push down…'], [T1 + 0.04, '']], 24, 'middle'),
    showFrom({ kind: 'text', text: 'The rock goes up!', x: 130, y: 60, size: 24, anchor: 'start', cls: 'g3s-label' }, T1 + 0.04),
    { kind: 'text', text: 'Log', x: 150, y: 270, size: 20, cls: 'g3s-label' },
  ],
};
export default scene;
