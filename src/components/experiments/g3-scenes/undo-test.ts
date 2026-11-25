// Reversible and permanent changes (SCI3-OI1-GQ1-LO1 K6.1, K6.2, S6.2): heat chocolate and an egg,
// then cool them both. The chocolate goes solid again. The egg stays cooked.
import { showFrom, ticker, type RunScene } from '../../visuals/g3-sprites.ts';

const HEAT = [0.08, 0.45] as const;
const COOL = [0.55, 0.85] as const;
const scene: RunScene = {
  w: 480,
  h: 300,
  ms: 7000,
  live: 'Both were heated. The chocolate melted and the egg cooked. Then both were cooled. The chocolate turned solid again, but the egg stayed cooked.',
  bg: '<rect class="g3s-sky" width="480" height="300"/><rect class="g3s-pan" x="30" y="196" width="180" height="16" rx="6"/><rect class="g3s-pan" x="270" y="196" width="180" height="16" rx="6"/>',
  sprites: [
    // chocolate: a bar melts into a puddle, then sets into a flat solid
    { kind: 'rect', x: 80, y: 150, w: 80, h: 46, rx: 3, cls: 'g3s-choc', keys: [{ t: HEAT[0] + 0.1, x: 80, y: 150, w: 80, h: 46 }, { t: HEAT[1], x: 120, y: 194, w: 0, h: 0 }] },
    { kind: 'ellipse', x: 120, y: 192, w: 0, h: 0, cls: 'g3s-choc', keys: [{ t: HEAT[0] + 0.1, w: 0, h: 0 }, { t: HEAT[1], w: 150, h: 14 }, { t: COOL[0] + 0.1, o: 1 }, { t: COOL[0] + 0.2, o: 0 }] },
    { kind: 'rect', x: 48, y: 182, w: 144, h: 14, rx: 2, cls: 'g3s-choc', o: 0, keys: [{ t: COOL[0] + 0.1, o: 0 }, { t: COOL[0] + 0.2, o: 1 }] },
    // egg: clear raw white turns solid white
    { kind: 'ellipse', x: 360, y: 186, w: 140, h: 26, cls: 'g3s-rawegg', keys: [{ t: HEAT[0] + 0.1, o: 1 }, { t: HEAT[1], o: 0 }] },
    { kind: 'ellipse', x: 360, y: 186, w: 140, h: 26, cls: 'g3s-eggwhite', o: 0, keys: [{ t: HEAT[0] + 0.1, o: 0 }, { t: HEAT[1], o: 1 }] },
    { kind: 'ellipse', x: 360, y: 180, w: 40, h: 22, cls: 'g3s-yolk' },
    // heat, then cold
    { kind: 'emoji', text: '🔥', x: 120, y: 236, size: 40, o: 0, keys: [{ t: HEAT[0], o: 0 }, { t: HEAT[0] + 0.04, o: 1 }, { t: HEAT[1], o: 1 }, { t: HEAT[1] + 0.04, o: 0 }] },
    { kind: 'emoji', text: '🔥', x: 360, y: 236, size: 40, o: 0, keys: [{ t: HEAT[0], o: 0 }, { t: HEAT[0] + 0.04, o: 1 }, { t: HEAT[1], o: 1 }, { t: HEAT[1] + 0.04, o: 0 }] },
    { kind: 'emoji', text: '❄️', x: 240, y: 110, size: 54, o: 0, keys: [{ t: COOL[0] - 0.04, o: 0 }, { t: COOL[0], o: 1 }] },
    { kind: 'text', text: 'Chocolate', x: 120, y: 120, size: 24, cls: 'g3s-label' },
    { kind: 'text', text: 'Raw egg', x: 360, y: 120, size: 24, cls: 'g3s-label', keys: [{ t: HEAT[1], text: 'Cooked egg' }] },
    ticker(240, 40, [[0, 'Start'], [HEAT[0], 'Heat it 🔥'], [COOL[0], 'Cool it ❄️']], 26, 'middle'),
    showFrom({ kind: 'text', text: 'Solid again!', x: 120, y: 272, size: 22, cls: 'g3s-label' }, COOL[1]),
    showFrom({ kind: 'text', text: 'Still cooked!', x: 360, y: 272, size: 22, cls: 'g3s-label' }, COOL[1] + 0.03),
  ],
};
export default scene;
