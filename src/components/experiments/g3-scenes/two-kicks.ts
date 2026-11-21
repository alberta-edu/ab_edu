// Strong and weak forces (SCI3-OI2-GQ1-LO1 K1.6, S1.3, S1.4): a weak kick and a strong kick on the
// same kind of ball. The stronger push sends the ball farther.
import { showFrom, type RunScene } from '../../visuals/g3-sprites.ts';

const KICK = 0.2;
const scene: RunScene = {
  w: 480,
  h: 300,
  ms: 5000,
  live: 'The weak kick moved the ball a short way. The strong kick sent the ball much farther.',
  bg: '<rect class="g3s-grass" width="480" height="300"/><line class="g3s-thin" x1="0" y1="150" x2="480" y2="150"/>',
  sprites: [
    { kind: 'text', text: 'Weak kick', x: 16, y: 30, size: 22, anchor: 'start', cls: 'g3s-label' },
    { kind: 'text', text: 'Strong kick', x: 16, y: 180, size: 22, anchor: 'start', cls: 'g3s-label' },
    // arrows show the push: small and large
    { kind: 'arrow', x: 30, y: 90, w: 0, h: 8, r: 0, cls: 'g3s-push', keys: [{ t: KICK - 0.06, w: 0 }, { t: KICK, w: 32 }, { t: KICK + 0.12, w: 32, o: 1 }, { t: KICK + 0.16, o: 0 }] },
    { kind: 'arrow', x: 10, y: 240, w: 0, h: 16, r: 0, cls: 'g3s-push', keys: [{ t: KICK - 0.06, w: 0 }, { t: KICK, w: 64 }, { t: KICK + 0.12, w: 64, o: 1 }, { t: KICK + 0.16, o: 0 }] },
    { kind: 'emoji', text: '⚽', x: 90, y: 90, size: 44, keys: [{ t: KICK, x: 90, r: 0 }, { t: KICK + 0.35, x: 190, r: 360 }] },
    { kind: 'emoji', text: '⚽', x: 90, y: 240, size: 44, keys: [{ t: KICK, x: 90, r: 0 }, { t: KICK + 0.6, x: 420, r: 1080 }] },
    showFrom({ kind: 'text', text: 'A short way', x: 190, y: 132, size: 20, cls: 'g3s-label' }, 0.85),
    showFrom({ kind: 'text', text: 'Far!', x: 420, y: 282, size: 22, cls: 'g3s-label' }, 0.85),
  ],
};
export default scene;
