// Evaporation (SCI3-OI1-GQ1-LO1 K2.5, U2.1, S2.1): a puddle on a sunny sidewalk shrinks through the
// day as its water changes into water vapour, a gas.
import { showFrom, ticker, type RunScene, type Sprite } from '../../visuals/g3-sprites.ts';

const WAVE = 'M0,0 q8,-10 0,-20 q-8,-10 0,-20';
const vapour: Sprite[] = [];
for (let i = 0; i < 9; i++) {
  const x = 170 + (i % 5) * 35;
  const t0 = 0.08 + i * 0.08;
  vapour.push({ kind: 'path', d: WAVE, x, y: 196, cls: 'g3s-vapour', o: 0, keys: [{ t: t0, o: 0, y: 196 }, { t: t0 + 0.04, o: 1 }, { t: t0 + 0.2, y: 110, o: 0 }] });
}

const scene: RunScene = {
  w: 480,
  h: 280,
  ms: 6000,
  live: 'Through the day, the puddle got smaller and smaller until it was gone. Its water went into the air as a gas.',
  bg: '<rect class="g3s-sky" width="480" height="280"/><rect class="g3s-pave" y="190" width="480" height="90"/>',
  sprites: [
    { kind: 'emoji', text: '☀️', x: 70, y: 60, size: 64, keys: [{ t: 0.5, x: 240, y: 46 }, { t: 1, x: 410, y: 60 }] },
    { kind: 'ellipse', x: 240, y: 222, w: 240, h: 44, cls: 'g3s-water', keys: [{ t: 0.05, w: 240, h: 44 }, { t: 0.9, w: 0, h: 0 }] },
    ...vapour,
    ticker(240, 262, [[0, '9:00 in the morning'], [0.45, '12:00 noon'], [0.85, '3:00 in the afternoon']], 22, 'middle'),
    showFrom({ kind: 'text', text: 'Gone!', x: 240, y: 222, size: 28, cls: 'g3s-label' }, 0.92),
  ],
};
export default scene;
