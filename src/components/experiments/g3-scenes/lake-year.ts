// Alberta lakes through the year (SCI3-OI1-GQ1-LO1 K5.5, K5.3, S5.3): the surface freezes in winter
// while water stays liquid underneath, then melts again in spring.
import { ticker, type RunScene } from '../../visuals/g3-sprites.ts';

const scene: RunScene = {
  w: 480,
  h: 300,
  ms: 7500,
  live: 'In fall the top of the lake froze. All winter there was ice on top and liquid water underneath, with the fish swimming in it. In spring the ice melted.',
  bg: '<rect class="g3s-sky" width="480" height="300"/><path class="g3s-ground" d="M0,90 L60,90 Q80,250 240,262 Q400,250 420,90 L480,90 L480,300 L0,300 Z"/>',
  sprites: [
    { kind: 'rect', x: 0, y: 70, w: 480, h: 22, cls: 'g3s-grass', keys: [{ t: 0.25, cls: 'g3s-grass' }, { t: 0.3, cls: 'g3s-snow' }, { t: 0.78, cls: 'g3s-snow' }, { t: 0.8, cls: 'g3s-grass' }] },
    { kind: 'path', d: 'M-180,0 L180,0 Q170,150 0,160 Q-170,150 -180,0 Z', x: 240, y: 92, cls: 'g3s-water' },
    // the ice on top grows in winter, then melts
    { kind: 'rect', x: 62, y: 92, w: 356, h: 0, cls: 'g3s-ice', keys: [{ t: 0.28, h: 0 }, { t: 0.45, h: 18 }, { t: 0.62, h: 30 }, { t: 0.72, h: 30 }, { t: 0.86, h: 0 }] },
    { kind: 'emoji', text: '🐟', x: 140, y: 190, size: 40, keys: [{ t: 0.5, x: 330 }, { t: 1, x: 150 }] },
    { kind: 'emoji', text: '☀️', x: 60, y: 36, size: 48, keys: [{ t: 0.2, o: 1 }, { t: 0.3, o: 0 }, { t: 0.78, o: 0 }, { t: 0.86, o: 1 }] },
    { kind: 'emoji', text: '❄️', x: 60, y: 36, size: 44, o: 0, keys: [{ t: 0.28, o: 0 }, { t: 0.34, o: 1 }, { t: 0.74, o: 1 }, { t: 0.8, o: 0 }] },
    ticker(420, 36, [[0, 'July'], [0.2, 'October'], [0.35, 'December'], [0.55, 'February'], [0.78, 'April'], [0.92, 'July']], 26, 'end'),
    { kind: 'text', text: 'Ice on top', x: 240, y: 128, size: 22, cls: 'g3s-label', o: 0, keys: [{ t: 0.42, o: 0 }, { t: 0.46, o: 1 }, { t: 0.72, o: 1 }, { t: 0.76, o: 0 }] },
    { kind: 'text', text: 'Liquid water below', x: 240, y: 230, size: 20, cls: 'g3s-label', o: 0, keys: [{ t: 0.42, o: 0 }, { t: 0.46, o: 1 }, { t: 0.72, o: 1 }, { t: 0.76, o: 0 }] },
  ],
};
export default scene;
