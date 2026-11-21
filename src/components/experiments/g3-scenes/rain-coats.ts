// Natural and processed materials (SCI3-OI1-GQ1-LO1 K1.2): rain falls on a wool sweater and a
// plastic raincoat. The wool soaks up water and drips. The plastic was made to keep water out.
import { falling, showFrom, type RunScene, type Sprite } from '../../visuals/g3-sprites.ts';

const COAT = 'M-34,-58 L-12,-64 L12,-64 L34,-58 L62,-16 L44,-4 L34,-22 L34,62 L-34,62 L-34,-22 L-44,-4 L-62,-16 Z';
const L = 140;
const R = 340;

// Drops that land on the raincoat, roll down it and fall off the hem.
const beads: Sprite[] = [0, 1, 2, 3].map((i) => {
  const x = R - 24 + i * 16;
  const t0 = 0.2 + i * 0.12;
  return { kind: 'emoji', text: '💧', size: 16, x, y: 40, o: 0, keys: [{ t: t0, o: 0, y: 40 }, { t: t0 + 0.02, o: 1 }, { t: t0 + 0.08, y: 96 }, { t: t0 + 0.22, y: 168 }, { t: t0 + 0.28, y: 250, o: 1 }, { t: t0 + 0.3, o: 0 }] };
});

const scene: RunScene = {
  w: 480,
  h: 300,
  ms: 6000,
  live: 'The wool sweater soaked up the rain and dripped. The plastic raincoat stayed dry inside: the drops rolled off.',
  bg: '<rect class="g3s-sky" width="480" height="300"/><rect class="g3s-grass" y="266" width="480" height="34"/><line class="g3s-line" x1="20" y1="62" x2="460" y2="62"/>',
  sprites: [
    { kind: 'emoji', text: '☁️', size: 54, x: 120, y: 26, o: 0, keys: [{ t: 0.05, o: 1 }] },
    { kind: 'emoji', text: '☁️', size: 54, x: 360, y: 26, o: 0, keys: [{ t: 0.05, o: 1 }] },
    ...falling('💧', 18, 40, 440, 40, 262, 0.1, 0.85, 14),
    { kind: 'path', d: COAT, x: L, y: 130, cls: 'g3s-wool' },
    { kind: 'path', d: COAT, x: L, y: 130, cls: 'g3s-wet', o: 0, keys: [{ t: 0.15, o: 0 }, { t: 0.7, o: 0.85 }] },
    { kind: 'path', d: COAT, x: R, y: 130, cls: 'g3s-coat' },
    { kind: 'rect', x: L - 6, y: 56, w: 12, h: 18, rx: 3, cls: 'g3s-wood' },
    { kind: 'rect', x: R - 6, y: 56, w: 12, h: 18, rx: 3, cls: 'g3s-wood' },
    ...beads,
    ...falling('💧', 8, L - 30, L + 30, 196, 262, 0.45, 1, 14),
    { kind: 'text', text: 'Wool sweater', x: L, y: 220, size: 24, cls: 'g3s-label' },
    { kind: 'text', text: 'Plastic raincoat', x: R, y: 220, size: 24, cls: 'g3s-label' },
    showFrom({ kind: 'text', text: 'Soaked! 😟', x: L, y: 248, size: 26, cls: 'g3s-label' }, 0.8),
    showFrom({ kind: 'text', text: 'Dry inside! 😀', x: R, y: 248, size: 26, cls: 'g3s-label' }, 0.85),
  ],
};
export default scene;
