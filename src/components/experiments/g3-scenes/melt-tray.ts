// Melting points (SCI3-OI1-GQ1-LO1 K4.2, U4.1, S4.1): a tray warms from 0 °C to 100 °C. Ice melts at
// 0 °C, gallium at about 30 °C (29.8 °C), and salt stays solid (it melts at 801 °C).
// Sources: CRC Handbook of Chemistry and Physics, via PubChem.
import { showFrom, ticker, type RunScene, type Sprite } from '../../visuals/g3-sprites.ts';

// The thermometer: 0 °C at y = 230, 100 °C at y = 70. It warms from t = 0.1 to t = 0.9.
const temp = (c: number) => 0.1 + (0.8 * c) / 100;
const TOP = (c: number) => 230 - c * 1.6;
const ticks: [number, string][] = [];
for (let c = 0; c <= 100; c += 10) ticks.push([temp(c), `${c} °C`]);

const salt: Sprite[] = [];
for (let i = 0; i < 9; i++) salt.push({ kind: 'rect', x: 268 + (i % 3) * 14 + (i > 5 ? 7 : 0), y: 194 - Math.floor(i / 3) * 12, w: 11, h: 11, cls: 'g3s-salt', r: (i * 23) % 40 });

const scene: RunScene = {
  w: 480,
  h: 300,
  ms: 7000,
  live: 'The ice melted at 0 °C. The gallium melted at about 30 °C. The salt was still solid at 100 °C.',
  bg: '<rect class="g3s-sky" width="480" height="300"/><rect class="g3s-metal" x="20" y="206" width="330" height="14" rx="5"/>',
  sprites: [
    // ice: a cube that melts into a puddle at 0 °C
    { kind: 'ellipse', x: 75, y: 204, w: 0, h: 0, cls: 'g3s-water', keys: [{ t: temp(0), w: 0, h: 0 }, { t: temp(0) + 0.12, w: 84, h: 10 }] },
    { kind: 'rect', x: 50, y: 154, w: 50, h: 50, rx: 6, cls: 'g3s-ice', keys: [{ t: temp(0), x: 50, y: 154, w: 50, h: 50 }, { t: temp(0) + 0.12, x: 75, y: 204, w: 0, h: 0 }] },
    // gallium: a shiny lump that melts at about 30 °C
    { kind: 'ellipse', x: 185, y: 204, w: 0, h: 0, cls: 'g3s-shine', keys: [{ t: temp(29), w: 0, h: 0 }, { t: temp(29) + 0.1, w: 70, h: 10 }] },
    { kind: 'rect', x: 165, y: 170, w: 40, h: 34, rx: 8, cls: 'g3s-shine', keys: [{ t: temp(29), x: 165, y: 170, w: 40, h: 34 }, { t: temp(29) + 0.1, x: 185, y: 204, w: 0, h: 0 }] },
    // salt: stays solid
    ...salt,
    { kind: 'text', text: 'Ice', x: 75, y: 246, size: 24, cls: 'g3s-label' },
    { kind: 'text', text: 'Gallium', x: 185, y: 246, size: 24, cls: 'g3s-label' },
    { kind: 'text', text: 'Salt', x: 290, y: 246, size: 24, cls: 'g3s-label' },
    showFrom({ kind: 'text', text: 'Melted', x: 75, y: 276, size: 19, cls: 'g3s-soft' }, temp(0) + 0.12),
    showFrom({ kind: 'text', text: 'Melted', x: 185, y: 276, size: 19, cls: 'g3s-soft' }, temp(29) + 0.1),
    showFrom({ kind: 'text', text: 'Still solid!', x: 290, y: 276, size: 19, cls: 'g3s-soft' }, 0.92),
    // thermometer
    { kind: 'rect', x: 392, y: 60, w: 26, h: 184, rx: 13, cls: 'g3s-tube' },
    { kind: 'ellipse', x: 405, y: 250, w: 40, h: 40, cls: 'g3s-merc' },
    { kind: 'rect', x: 398, y: TOP(0), w: 14, h: 18, cls: 'g3s-merc', keys: [{ t: temp(0), y: TOP(0), h: 18 }, { t: temp(100), y: TOP(100), h: 18 + 160 }] },
    ticker(405, 32, ticks, 24, 'middle'),
  ],
};
export default scene;
