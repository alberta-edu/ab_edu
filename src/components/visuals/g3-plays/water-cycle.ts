// The water cycle (SCI3-OI1-GQ1-LO1 K5.1, K5.2, U5.1, S5.1): step around evaporation, condensation,
// precipitation and the water flowing back downhill.
import { from, only, type PlayScene, type Sprite } from '../g3-sprites.ts';

const n = 5;
const WAVE = 'M0,0 q7,-9 0,-18 q-7,-9 0,-18';
const vapour: Sprite[] = [0, 1, 2, 3].map((i) => only({ kind: 'path', d: WAVE, x: 70 + i * 34, y: 186, cls: 'g3s-vapour' }, 1, n));
const rain: Sprite[] = [];
for (let i = 0; i < 8; i++) rain.push(only({ kind: 'emoji', text: i % 3 ? '💧' : '❄️', x: 296 + (i % 4) * 30, y: 104 + Math.floor(i / 4) * 34 + (i % 2) * 8, size: 20 }, 3, n));

const scene: PlayScene = {
  w: 480,
  h: 270,
  mode: 'steps',
  next: 'Next ▶',
  back: '◀ Back',
  states: [
    { label: 'Start', say: 'Water is in the lake. The sun is shining.' },
    { label: 'Evaporation', say: 'Evaporation: the sun heats the water. It rises into the air as water vapour, a gas.' },
    { label: 'Condensation', say: 'Condensation: high up, the vapour cools into tiny drops. The drops make a cloud.' },
    { label: 'Precipitation', say: 'Precipitation: the drops fall back to Earth as rain, a liquid, or as snow, a solid.' },
    { label: 'Back again', say: 'The water flows downhill back to the lake. Then it starts all over again.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="270"/><path class="g3s-rock" d="M250,230 L340,90 L390,150 L420,110 L480,190 L480,230 Z"/><path class="g3s-snow" d="M322,118 L340,90 L356,114 L346,110 L338,120 L330,112 Z"/><rect class="g3s-grass" y="226" width="480" height="44"/><ellipse class="g3s-water" cx="110" cy="232" rx="100" ry="20"/>',
  sprites: [
    { kind: 'emoji', text: '☀️', x: 50, y: 46, size: 52 },
    ...vapour,
    from({ kind: 'emoji', text: '☁️', x: 350, y: 60, size: 84 }, 2, n),
    ...rain,
    only({ kind: 'path', d: 'M330,200 Q260,226 200,228', cls: 'g3s-river' }, 4, n),
    from({ kind: 'arrow', x: 120, y: 140, w: 150, h: 6, r: -28, cls: 'g3s-soft' }, 2, n),
    { kind: 'text', text: 'The lake', x: 110, y: 262, size: 20, cls: 'g3s-label' },
  ],
};
export default scene;
