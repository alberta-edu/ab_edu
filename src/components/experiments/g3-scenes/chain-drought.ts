// A food chain shows who depends on whom (SCI3-OI4-GQ1-LO1 K1.1, U1.1): on the Alberta prairie, grass
// feeds ground squirrels and ground squirrels feed hawks. A dry summer browns the grass. With less
// food, there are fewer ground squirrels, and the hawk has less to eat.
import { showFrom, ticker, type RunScene, type Sprite } from '../../visuals/g3-sprites.ts';

const DRY = 0.25;
const FEW = 0.55;
const grass: Sprite[] = [30, 90, 150, 210, 270, 330, 390, 450].map((x, i) => ({
  kind: 'emoji', text: '🌿', x, y: 230, size: 38, keys: [{ t: DRY + i * 0.02, s: 1, text: '🌿' }, { t: DRY + 0.1 + i * 0.02, s: 0.7, text: '🍂' }],
}));
const squirrels: Sprite[] = [80, 200, 300, 420].map((x, i) => ({
  kind: 'emoji', text: '🐿️', x, y: 200, size: 40, keys: i === 1 ? [] : [{ t: FEW + i * 0.03, o: 1, y: 200 }, { t: FEW + 0.1 + i * 0.03, o: 0, y: 220 }],
}));

const scene: RunScene = {
  w: 480,
  h: 270,
  ms: 7000,
  live: 'The dry summer turned the grass brown. With little grass to eat, there were fewer ground squirrels. The hawk circled and circled, but found little to eat.',
  bg: '<rect class="g3s-sky" width="480" height="270"/>',
  sprites: [
    { kind: 'rect', x: 0, y: 230, w: 480, h: 40, cls: 'g3s-grass', keys: [{ t: DRY, o: 1 }, { t: DRY + 0.2, o: 0 }] },
    { kind: 'rect', x: 0, y: 230, w: 480, h: 40, cls: 'g3s-field', o: 0, keys: [{ t: DRY, o: 0 }, { t: DRY + 0.2, o: 1 }] },
    ...grass,
    ...squirrels,
    { kind: 'emoji', text: '☀️', x: 60, y: 50, size: 44, keys: [{ t: DRY, s: 1 }, { t: DRY + 0.15, s: 1.5 }] },
    { kind: 'emoji', text: '🦅', x: 380, y: 70, size: 50, keys: [{ t: FEW, x: 380, y: 70 }, { t: 0.7, x: 260, y: 100 }, { t: 0.85, x: 120, y: 70 }, { t: 1, x: 400, y: 60 }] },
    showFrom({ kind: 'text', text: 'Not much to eat…', x: 300, y: 130, size: 20, cls: 'g3s-label' }, 0.85),
    ticker(240, 24, [[0, 'A prairie in spring'], [DRY, 'A dry, hot summer…'], [FEW, 'Weeks later']], 20, 'middle'),
  ],
};
export default scene;
