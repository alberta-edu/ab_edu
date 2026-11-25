// Water's melting and boiling points (SCI3-OI1-GQ1-LO1 K4.5-K4.7): heat a pot from icy water at
// 0 °C to warm water, then to boiling at 100 °C.
import { type PlayScene, type Sprite } from '../g3-sprites.ts';

const TOP = (c: number) => 220 - c * 1.5;
const bubbles: Sprite[] = [];
for (let i = 0; i < 7; i++) bubbles.push({ kind: 'ellipse', x: 150 + i * 26, y: 150 + (i % 3) * 22, w: 14, h: 14, cls: 'g3s-plate', o: 0, keys: [{ t: 1, o: 0 }, { t: 2, o: 1 }] });
const WAVE = 'M0,0 q8,-10 0,-20 q-8,-10 0,-20';
const vapour: Sprite[] = [0, 1, 2].map((i) => ({ kind: 'path', d: WAVE, x: 180 + i * 40, y: 104, cls: 'g3s-vapour', o: 0, keys: [{ t: 1, o: 0 }, { t: 2, o: 1 }] }));

const scene: PlayScene = {
  w: 480,
  h: 260,
  mode: 'steps',
  next: 'Heat ▶',
  back: '◀ Back',
  states: [
    { label: '0 °C', say: 'Ice in water at 0 °C. Water’s melting point is 0 °C.' },
    { label: '50 °C', say: 'All the ice has melted. The water is warm, but not boiling.' },
    { label: '100 °C', say: 'At 100 °C the water boils and turns into a gas. Water’s boiling point is 100 °C.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="260"/><rect class="g3s-road" x="110" y="232" width="250" height="14" rx="4"/>',
  sprites: [
    { kind: 'emoji', text: '🔥', x: 235, y: 248, size: 30, o: 0, keys: [{ t: 0, o: 0 }, { t: 1, o: 1 }] },
    { kind: 'rect', x: 132, y: 130, w: 206, h: 98, cls: 'g3s-water' },
    { kind: 'rect', x: 160, y: 132, w: 34, h: 30, rx: 5, cls: 'g3s-ice', keys: [{ t: 0, w: 34, h: 30 }, { t: 1, w: 0, h: 0 }] },
    { kind: 'rect', x: 250, y: 136, w: 30, h: 28, rx: 5, cls: 'g3s-ice', keys: [{ t: 0, w: 30, h: 28 }, { t: 1, w: 0, h: 0 }] },
    ...bubbles,
    ...vapour,
    { kind: 'rect', x: 128, y: 110, w: 214, h: 122, rx: 8, cls: 'g3s-box' },
    { kind: 'rect', x: 404, y: 50, w: 26, h: 184, rx: 13, cls: 'g3s-tube' },
    { kind: 'ellipse', x: 417, y: 236, w: 40, h: 40, cls: 'g3s-merc' },
    { kind: 'rect', x: 410, y: TOP(0), w: 14, h: 18, cls: 'g3s-merc', keys: [{ t: 0, y: TOP(0), h: 18 }, { t: 1, y: TOP(50), h: 18 + 75 }, { t: 2, y: TOP(100), h: 18 + 150 }] },
    { kind: 'text', text: '0 °C', x: 400, y: 30, size: 26, anchor: 'end', cls: 'g3s-label', keys: [{ t: 0.5, text: '50 °C' }, { t: 1.5, text: '100 °C' }] },
  ],
};
export default scene;
