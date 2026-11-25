// Plants sense and respond (SCI3-OI4-GQ1-LO1 K3.1, U3.1, S3.1): young sunflowers turn to face the
// Sun (light), roots grow toward wet soil (water), and seeds start to grow when spring soil warms
// (temperature).
import { only, type PlayScene } from '../g3-sprites.ts';

const n = 3;
const scene: PlayScene = {
  w: 480,
  h: 250,
  mode: 'jump',
  states: [
    { label: '☀️ Light', say: 'Young sunflowers turn to face the Sun as it moves across the sky. They get more light.' },
    { label: '💧 Water', say: 'Roots grow toward wet soil, where they can get the water the plant needs.' },
    { label: '🌡️ Warmth', say: 'In spring, the soil warms up. Seeds sense the warmth and start to grow.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="250"/><rect class="g3s-ground" y="150" width="480" height="100"/>',
  sprites: [
    // light
    only({ kind: 'emoji', text: '☀️', x: 410, y: 50, size: 56 }, 0, n),
    ...[100, 200, 300].map((x) => only({ kind: 'emoji', text: '🌻', x, y: 100, size: 64, r: 25 }, 0, n)),
    ...[100, 200, 300].map((x) => only({ kind: 'path', d: 'M0,0 V-30', x, y: 160, cls: 'g3s-line' }, 0, n)),
    // water
    only({ kind: 'emoji', text: '🌱', x: 140, y: 130, size: 48 }, 1, n),
    only({ kind: 'path', d: 'M140,152 Q160,180 220,195 Q280,205 320,220 M140,152 Q130,180 150,210', cls: 'g3s-line' }, 1, n),
    only({ kind: 'ellipse', x: 360, y: 215, w: 120, h: 50, cls: 'g3s-wet' }, 1, n),
    only({ kind: 'emoji', text: '💧', x: 360, y: 212, size: 30 }, 1, n),
    only({ kind: 'text', text: 'Wet soil', x: 360, y: 175, size: 18, cls: 'g3s-paint' }, 1, n),
    // warmth
    only({ kind: 'emoji', text: '🌤️', x: 400, y: 50, size: 56 }, 2, n),
    only({ kind: 'emoji', text: '🌡️', x: 60, y: 80, size: 50 }, 2, n),
    ...[150, 240, 330].map((x) => only({ kind: 'emoji', text: '🌱', x, y: 136, size: 40 }, 2, n)),
    ...[150, 240, 330].map((x) => only({ kind: 'ellipse', x, y: 175, w: 22, h: 14, cls: 'g3s-wood' }, 2, n)),
  ],
};
export default scene;
