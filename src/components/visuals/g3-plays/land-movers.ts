// Wind, water and ice move land (SCI3-OI3-GQ1-LO1 K2.1, K2.5, U2.1): wind piles sand into dunes,
// a river carves a canyon (the Grand Canyon), and a glacier scrapes and carries rock.
import { only, type PlayScene } from '../g3-sprites.ts';

const n = 3;
const scene: PlayScene = {
  w: 480,
  h: 250,
  mode: 'jump',
  states: [
    { label: '💨 Wind', say: 'Wind picks up sand and dust and drops them somewhere else. Over time, it piles sand into hills.' },
    { label: '💧 Water', say: 'Water carries soil and rock downstream. Over millions of years, the Colorado River carved the deep Grand Canyon.' },
    { label: '🧊 Ice', say: 'A glacier slowly slides downhill. It scrapes the land, carries rocks along and drops them far away.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="250"/>',
  sprites: [
    // wind and sand hills
    only({ kind: 'path', d: 'M0,250 L0,200 Q120,120 220,200 Q330,140 480,190 L480,250 Z', cls: 'g3s-sand' }, 0, n),
    only({ kind: 'emoji', text: '💨', x: 70, y: 80, size: 60 }, 0, n),
    only({ kind: 'arrow', x: 120, y: 80, w: 150, h: 10, r: 0, cls: 'g3s-soft' }, 0, n),
    only({ kind: 'ellipse', x: 200, y: 110, w: 8, h: 8, cls: 'g3s-l2' }, 0, n),
    only({ kind: 'ellipse', x: 240, y: 98, w: 8, h: 8, cls: 'g3s-l2' }, 0, n),
    only({ kind: 'ellipse', x: 290, y: 116, w: 8, h: 8, cls: 'g3s-l2' }, 0, n),
    // a river in a deep canyon
    only({ kind: 'path', d: 'M0,40 L150,40 L170,90 L160,140 L200,190 L210,250 L0,250 Z', cls: 'g3s-l2' }, 1, n),
    only({ kind: 'path', d: 'M480,40 L330,40 L310,90 L320,140 L280,190 L270,250 L480,250 Z', cls: 'g3s-l2' }, 1, n),
    only({ kind: 'rect', x: 205, y: 226, w: 70, h: 24, cls: 'g3s-water' }, 1, n),
    only({ kind: 'text', text: 'Grand Canyon', x: 240, y: 22, size: 20, cls: 'g3s-label' }, 1, n),
    // a glacier sliding down a valley
    only({ kind: 'path', d: 'M0,60 L120,20 L480,200 L480,250 L0,250 Z', cls: 'g3s-rock' }, 2, n),
    only({ kind: 'path', d: 'M0,60 L120,20 L400,160 L380,190 L0,110 Z', cls: 'g3s-ice' }, 2, n),
    only({ kind: 'emoji', text: '🪨', x: 220, y: 100, size: 28 }, 2, n),
    only({ kind: 'emoji', text: '🪨', x: 330, y: 150, size: 30 }, 2, n),
    only({ kind: 'emoji', text: '🪨', x: 430, y: 196, size: 30 }, 2, n),
    only({ kind: 'arrow', x: 140, y: 50, w: 140, h: 10, r: 27, cls: 'g3s-push' }, 2, n),
  ],
};
export default scene;
