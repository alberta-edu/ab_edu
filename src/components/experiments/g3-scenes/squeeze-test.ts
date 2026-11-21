// Forces change shape (SCI3-OI2-GQ1-LO1 S1.6, K1.4, U1.1): squeeze a sponge and a ball of play dough,
// then let go. The sponge springs back. The play dough stays squashed.
import { showFrom, ticker, type RunScene } from '../../visuals/g3-sprites.ts';

const DOWN = [0.15, 0.4] as const;
const UP = [0.55, 0.75] as const;
const press = (x: number) => [
  { kind: 'arrow' as const, x, y: 20, w: 0, h: 12, r: 90, cls: 'g3s-push', keys: [{ t: DOWN[0] - 0.05, w: 0, o: 1 }, { t: DOWN[0], w: 50 }, { t: DOWN[1], w: 50, y: 70 }, { t: UP[0], w: 50, y: 70, o: 1 }, { t: UP[0] + 0.05, o: 0 }] },
];

const scene: RunScene = {
  w: 480,
  h: 290,
  ms: 6000,
  live: 'Both got squashed while they were squeezed. When the hand let go, the sponge sprang back to its shape. The play dough stayed flat.',
  bg: '<rect class="g3s-sky" width="480" height="290"/><rect class="g3s-wood" y="220" width="480" height="20"/>',
  sprites: [
    { kind: 'rect', x: 70, y: 120, w: 120, h: 100, rx: 10, cls: 'g3s-sponge', keys: [{ t: DOWN[0], y: 120, h: 100 }, { t: DOWN[1], y: 180, h: 40 }, { t: UP[0], y: 180, h: 40 }, { t: UP[1], y: 120, h: 100 }] },
    { kind: 'ellipse', x: 350, y: 170, w: 100, h: 100, cls: 'g3s-clay', keys: [{ t: DOWN[0], y: 170, w: 100, h: 100 }, { t: DOWN[1], y: 200, w: 170, h: 40 }] },
    ...press(130),
    ...press(350),
    { kind: 'text', text: 'Sponge', x: 130, y: 262, size: 24, cls: 'g3s-label' },
    { kind: 'text', text: 'Play dough', x: 350, y: 262, size: 24, cls: 'g3s-label' },
    ticker(240, 28, [[0, ''], [DOWN[0], 'Squeeze!'], [UP[0], 'Let go…']], 26, 'middle'),
    showFrom({ kind: 'text', text: 'Springs back!', x: 130, y: 100, size: 22, cls: 'g3s-label' }, UP[1]),
    showFrom({ kind: 'text', text: 'Stays flat', x: 350, y: 150, size: 22, cls: 'g3s-label' }, UP[1]),
  ],
};
export default scene;
