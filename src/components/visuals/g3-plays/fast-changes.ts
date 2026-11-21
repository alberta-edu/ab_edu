// Fast changes to Earth's surface (SCI3-OI3-GQ1-LO1 K1.2, S1.1): volcanic eruptions, earthquakes,
// landslides, tsunamis, floods, and melting and freezing.
import { only, type PlayScene } from '../g3-sprites.ts';

const n = 6;
const scene: PlayScene = {
  w: 480,
  h: 250,
  mode: 'jump',
  states: [
    { label: 'Volcano', say: 'Volcanic eruption: hot, melted rock bursts out. It cools into new rock and changes the land in days.' },
    { label: 'Earthquake', say: 'Earthquake: the ground shakes and can crack open in just a few seconds.' },
    { label: 'Landslide', say: 'Landslide: rocks and soil suddenly slide down a hill or mountain.' },
    { label: 'Tsunami', say: 'Tsunami: a giant wave from the sea rushes onto the shore and washes away sand and soil.' },
    { label: 'Flood', say: 'Flood: a river spills over its banks. Fast water carries soil away and leaves mud behind.' },
    { label: 'Freeze and melt', say: 'Water in a rock crack freezes and pushes the crack wider. After many cold nights, a piece breaks off.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="250"/><rect class="g3s-grass" y="210" width="480" height="40"/>',
  sprites: [
    // volcano
    only({ kind: 'emoji', text: '🌋', x: 240, y: 120, size: 200 }, 0, n),
    // earthquake
    only({ kind: 'path', d: 'M120,210 l20,12 l-14,8 l22,10 l-10,10', cls: 'g3s-line' }, 1, n),
    only({ kind: 'path', d: 'M330,210 l-16,10 l18,10 l-14,10 l10,10', cls: 'g3s-line' }, 1, n),
    only({ kind: 'emoji', text: '🏠', x: 160, y: 170, size: 70, r: -10 }, 1, n),
    only({ kind: 'emoji', text: '🌲', x: 340, y: 160, size: 80, r: 12 }, 1, n),
    only({ kind: 'text', text: 'Shake!', x: 250, y: 60, size: 30, cls: 'g3s-label' }, 1, n),
    // landslide
    only({ kind: 'path', d: 'M0,210 L0,40 L60,40 L330,210 Z', cls: 'g3s-ground' }, 2, n),
    only({ kind: 'emoji', text: '🪨', x: 150, y: 110, size: 36 }, 2, n),
    only({ kind: 'emoji', text: '🪨', x: 220, y: 150, size: 30 }, 2, n),
    only({ kind: 'emoji', text: '🪨', x: 290, y: 190, size: 34 }, 2, n),
    only({ kind: 'arrow', x: 130, y: 70, w: 120, h: 12, r: 32, cls: 'g3s-push' }, 2, n),
    // tsunami
    only({ kind: 'rect', x: 0, y: 200, w: 480, h: 50, cls: 'g3s-sand' }, 3, n),
    only({ kind: 'emoji', text: '🌊', x: 140, y: 120, size: 190 }, 3, n),
    only({ kind: 'emoji', text: '🌴', x: 390, y: 160, size: 80 }, 3, n),
    only({ kind: 'arrow', x: 240, y: 90, w: 90, h: 12, r: 0, cls: 'g3s-push' }, 3, n),
    // flood
    only({ kind: 'emoji', text: '🏠', x: 300, y: 160, size: 90 }, 4, n),
    only({ kind: 'emoji', text: '🌳', x: 100, y: 150, size: 90 }, 4, n),
    only({ kind: 'rect', x: 0, y: 180, w: 480, h: 70, cls: 'g3s-water' }, 4, n),
    only({ kind: 'arrow', x: 160, y: 220, w: 120, h: 10, r: 0, cls: 'g3s-push' }, 4, n),
    // freezing and melting in a rock crack
    only({ kind: 'path', d: 'M120,210 L140,90 L250,60 L360,100 L380,210 Z', cls: 'g3s-rock' }, 5, n),
    only({ kind: 'path', d: 'M250,60 L238,110 L256,150 L244,210', cls: 'g3s-line' }, 5, n),
    only({ kind: 'emoji', text: '🧊', x: 248, y: 120, size: 30 }, 5, n),
    only({ kind: 'arrow', x: 230, y: 130, w: 50, h: 10, r: 180, cls: 'g3s-push' }, 5, n),
    only({ kind: 'arrow', x: 266, y: 130, w: 50, h: 10, r: 0, cls: 'g3s-push' }, 5, n),
    only({ kind: 'emoji', text: '🌙', x: 420, y: 40, size: 40 }, 5, n),
  ],
};
export default scene;
