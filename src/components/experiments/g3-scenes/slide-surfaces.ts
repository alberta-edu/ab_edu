// Friction (SCI3-OI2-GQ1-LO1 K1.4, S1.5): the same push slides a block across ice, wood and carpet.
// The rougher the surface, the more friction, and the sooner the block stops.
import { type RunScene, type Sprite } from '../../visuals/g3-sprites.ts';

const PUSH = 0.15;
const lanes = [
  { y: 40, cls: 'g3s-ice', name: 'Ice', to: 380, end: 0.85 },
  { y: 130, cls: 'g3s-wood', name: 'Wood', to: 270, end: 0.7 },
  { y: 220, cls: 'g3s-carpet', name: 'Carpet', to: 150, end: 0.5 },
];
const sprites: Sprite[] = [];
for (const l of lanes) {
  sprites.push(
    { kind: 'rect', x: 0, y: l.y + 44, w: 480, h: 20, cls: l.cls },
    { kind: 'text', text: l.name, x: 470, y: l.y + 18, size: 22, anchor: 'end', cls: 'g3s-label' },
    { kind: 'arrow', x: 10, y: l.y + 24, w: 0, h: 10, r: 0, cls: 'g3s-push', keys: [{ t: PUSH - 0.05, w: 0, o: 1 }, { t: PUSH, w: 40 }, { t: PUSH + 0.1, w: 40, o: 1 }, { t: PUSH + 0.14, o: 0 }] },
    { kind: 'rect', x: 56, y: l.y + 6, w: 44, h: 38, rx: 4, cls: 'g3s-rock', keys: [{ t: PUSH, x: 56 }, { t: l.end, x: l.to }] },
  );
}

const scene: RunScene = {
  w: 480,
  h: 310,
  ms: 5500,
  live: 'With the same push, the block slid farthest on ice, less far on wood and only a short way on carpet.',
  bg: '<rect class="g3s-sky" width="480" height="310"/>',
  sprites,
};
export default scene;
