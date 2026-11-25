// People use computational thinking to tell computers what to do (SCI3-OI6-GQ1-LO1 K1.2): the
// curriculum's examples, apps, virtual reality and robotics.
import { only, type PlayScene } from '../g3-sprites.ts';

const n = 3;
const scene: PlayScene = {
  w: 480,
  h: 230,
  mode: 'jump',
  states: [
    { label: '📱 Apps', say: 'People write clear steps for an app, like a map app that shows the way to school.' },
    { label: '🥽 Virtual reality', say: 'Virtual reality makes a pretend world you can look around in. Instructions tell it what to show.' },
    { label: '🤖 Robots', say: 'A robot vacuum follows instructions to clean the floor, one step at a time.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="230"/>',
  sprites: [
    // app: a phone with a map
    only({ kind: 'rect', x: 180, y: 20, w: 120, h: 190, rx: 16, cls: 'g3s-road' }, 0, n),
    only({ kind: 'rect', x: 190, y: 36, w: 100, h: 156, rx: 6, cls: 'g3s-grass' }, 0, n),
    only({ kind: 'path', d: 'M215,175 L215,120 L265,120 L265,60', cls: 'g3s-thin' }, 0, n),
    only({ kind: 'emoji', text: '🏠', x: 215, y: 175, size: 26 }, 0, n),
    only({ kind: 'emoji', text: '🏫', x: 265, y: 58, size: 30 }, 0, n),
    // virtual reality
    only({ kind: 'emoji', text: '🥽', x: 140, y: 120, size: 90 }, 1, n),
    only({ kind: 'emoji', text: '🌋', x: 320, y: 90, size: 60 }, 1, n),
    only({ kind: 'emoji', text: '🦕', x: 390, y: 150, size: 60 }, 1, n),
    only({ kind: 'path', d: 'M200,110 Q250,80 290,95', cls: 'g3s-thin' }, 1, n),
    // robot vacuum
    only({ kind: 'rect', x: 0, y: 160, w: 480, h: 70, cls: 'g3s-wood' }, 2, n),
    only({ kind: 'ellipse', x: 150, y: 175, w: 90, h: 34, cls: 'g3s-metal' }, 2, n),
    only({ kind: 'path', d: 'M200,175 L300,175 L300,200 L420,200', cls: 'g3s-thin' }, 2, n),
    only({ kind: 'emoji', text: '🤖', x: 150, y: 120, size: 56 }, 2, n),
    only({ kind: 'emoji', text: '✨', x: 400, y: 182, size: 28 }, 2, n),
  ],
};
export default scene;
