// Alberta in the time of dinosaurs (SCI3-OI3-GQ1-LO1 K4.3): go back about 75 million years. Dry
// badlands turn into lush tropical forest beside a warm inland sea, where dinosaurs lived and mud
// buried their bones. Source: Royal Tyrrell Museum, "Alberta's ancient environments".
import { showFrom, ticker, type RunScene } from '../../visuals/g3-sprites.ts';

const BACK = 0.25;
const THEN = 0.5;
const scene: RunScene = {
  w: 480,
  h: 280,
  ms: 7000,
  live: 'We went back about 75 million years. The dry badlands turned into a warm, green forest beside an inland sea. Dinosaurs walked through the forest, and turtles swam in the sea.',
  bg: '<rect class="g3s-sky" width="480" height="280"/>',
  sprites: [
    // today: dry badlands
    { kind: 'rect', x: 0, y: 220, w: 480, h: 60, cls: 'g3s-l1', keys: [{ t: BACK, o: 1 }, { t: THEN, o: 0 }] },
    { kind: 'path', d: 'M20,220 L60,140 L100,140 L140,220 Z M180,220 L230,120 L270,120 L320,220 Z', cls: 'g3s-l3', keys: [{ t: BACK, o: 1 }, { t: THEN, o: 0 }] },
    { kind: 'emoji', text: '🌵', x: 380, y: 196, size: 44, keys: [{ t: BACK, o: 1 }, { t: THEN, o: 0 }] },
    // long ago: green forest and the inland sea
    showFrom({ kind: 'rect', x: 0, y: 220, w: 480, h: 60, cls: 'g3s-grass' }, THEN, undefined, 0.2),
    { kind: 'rect', x: 480, y: 210, w: 0, h: 70, cls: 'g3s-water', keys: [{ t: THEN, x: 480, w: 0 }, { t: THEN + 0.2, x: 320, w: 160 }] },
    showFrom({ kind: 'emoji', text: '🌴', x: 50, y: 160, size: 80 }, THEN + 0.05, undefined, 0.1),
    showFrom({ kind: 'emoji', text: '🌿', x: 130, y: 205, size: 40 }, THEN + 0.08, undefined, 0.1),
    showFrom({ kind: 'emoji', text: '🌴', x: 270, y: 165, size: 70 }, THEN + 0.1, undefined, 0.1),
    showFrom({ kind: 'emoji', text: '🌿', x: 300, y: 210, size: 36 }, THEN + 0.12, undefined, 0.1),
    showFrom({ kind: 'emoji', text: '🐢', x: 410, y: 245, size: 36 }, THEN + 0.25),
    { kind: 'emoji', text: '🦕', x: -60, y: 180, size: 80, keys: [{ t: THEN + 0.1, x: -60 }, { t: 0.85, x: 170 }] },
    { kind: 'emoji', text: '🦖', x: -60, y: 190, size: 60, keys: [{ t: THEN + 0.25, x: -60 }, { t: 0.95, x: 60 }] },
    { kind: 'emoji', text: '☀️', x: 430, y: 50, size: 50 },
    showFrom({ kind: 'text', text: 'Inland sea', x: 400, y: 196, size: 18, cls: 'g3s-label' }, THEN + 0.25),
    ticker(20, 30, [[0, 'Alberta today'], [BACK, 'Going back in time…'], [THEN + 0.05, '75 million years ago']], 22),
  ],
};
export default scene;
