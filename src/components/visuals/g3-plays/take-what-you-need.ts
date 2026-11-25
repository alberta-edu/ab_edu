// Living in balance with the land (SCI3-OI1-GQ1-LO1 U1.2, S1.2): pick only some sweetgrass and the
// patch grows back; pick it all and nothing is left for next year.
import { type PlayScene, type Sprite } from '../g3-sprites.ts';

// States: 0 a full patch, 1 take only what is needed, 2 next summer after that, 3 take it all.
const plants: Sprite[] = [];
for (let i = 0; i < 8; i++) {
  const x = 60 + i * 46;
  const picked = i % 3 === 0; // 3 of 8 picked when taking only what is needed
  plants.push({
    kind: 'emoji', text: '🌾', x, y: 190, size: 44,
    keys: [{ t: 0, o: 1, s: 1 }, { t: 1, o: picked ? 0 : 1 }, { t: 2, o: 1 }, { t: 3, o: 0 }],
  });
}
const scene: PlayScene = {
  w: 480,
  h: 260,
  mode: 'jump',
  states: [
    { label: '🌾 The patch', say: 'A patch of sweetgrass grows by the creek.' },
    { label: '✋ Take some', say: 'Take only what you need. Most of the patch is left to keep growing.' },
    { label: '☀️ Next summer', say: 'Next summer the patch has grown back. There is sweetgrass for everyone again.' },
    { label: '🧺 Take it all', say: 'Take it all, and nothing is left to grow back. The land is out of balance.' },
  ],
  bg: '<rect class="g3s-sky" width="480" height="260"/><rect class="g3s-grass" y="214" width="480" height="46"/><path class="g3s-water" d="M0,240 Q120,228 240,240 T480,236 L480,260 L0,260 Z"/>',
  sprites: [
    ...plants,
    { kind: 'emoji', text: '🧺', x: 410, y: 80, size: 56, o: 0, keys: [{ t: 1, o: 1 }, { t: 2, o: 0 }, { t: 3, o: 1 }] },
    { kind: 'text', text: '3 picked', x: 410, y: 128, size: 22, cls: 'g3s-label', o: 0, keys: [{ t: 0, o: 0 }, { t: 1, o: 1 }, { t: 2, o: 0 }] },
    { kind: 'text', text: 'All 8 picked', x: 410, y: 128, size: 22, cls: 'g3s-label', o: 0, keys: [{ t: 2, o: 0 }, { t: 3, o: 1 }] },
    { kind: 'emoji', text: '☀️', x: 60, y: 50, size: 48, o: 0, keys: [{ t: 1, o: 0 }, { t: 2, o: 1 }, { t: 3, o: 0 }] },
    { kind: 'text', text: 'Nothing left to grow 😟', x: 240, y: 170, size: 20, cls: 'g3s-label', o: 0, keys: [{ t: 2, o: 0 }, { t: 3, o: 1 }] },
  ],
};
export default scene;
