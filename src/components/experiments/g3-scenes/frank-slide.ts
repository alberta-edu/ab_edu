// A fast change in Alberta (SCI3-OI3-GQ1-LO1 K1.2, S1.1, S1.3): the Frank Slide. On April 29,
// 1903, a huge mass of rock broke off Turtle Mountain, in the Crowsnest Pass, and slid into the
// valley in under two minutes. Sources: The Canadian Encyclopedia, "Frank Slide"; Alberta Geological
// Survey, "Frank Slide".
import { showFrom, ticker, type RunScene } from '../../visuals/g3-sprites.ts';

const GO = 0.3;
const DOWN = 0.55;
const scene: RunScene = {
  w: 480,
  h: 290,
  ms: 6000,
  live: 'A huge piece of Turtle Mountain broke off and slid into the valley. In less than two minutes, the valley was covered with broken rock.',
  bg: '<rect class="g3s-sky" width="480" height="290"/><rect class="g3s-grass" y="240" width="480" height="50"/><path class="g3s-rock" d="M200,240 L330,60 L480,140 L480,240 Z"/>',
  sprites: [
    showFrom({ kind: 'path', d: 'M300,100 L330,60 L380,90 L360,160 L290,160 Z', cls: 'g3s-sand' }, GO),
    { kind: 'path', d: 'M-30,-10 L0,-50 L50,-20 L30,50 L-40,50 Z', x: 330, y: 110, cls: 'g3s-l5', keys: [{ t: GO, x: 330, y: 110, r: 0 }, { t: DOWN, x: 190, y: 200, r: -20, o: 1 }, { t: DOWN + 0.06, o: 0 }] },
    showFrom({ kind: 'path', d: 'M20,242 Q90,190 170,200 Q240,205 290,242 Z', cls: 'g3s-l5' }, DOWN),
    showFrom({ kind: 'emoji', text: '🪨', x: 90, y: 222, size: 30 }, DOWN + 0.02),
    showFrom({ kind: 'emoji', text: '🪨', x: 160, y: 210, size: 36 }, DOWN + 0.02),
    showFrom({ kind: 'emoji', text: '🪨', x: 230, y: 224, size: 28 }, DOWN + 0.02),
    showFrom({ kind: 'emoji', text: '☁️', x: 140, y: 170, size: 70 }, DOWN - 0.05, 0.85),
    showFrom({ kind: 'emoji', text: '☁️', x: 230, y: 150, size: 60 }, DOWN - 0.03, 0.85),
    { kind: 'text', text: 'Turtle Mountain', x: 380, y: 200, size: 18, cls: 'g3s-label' },
    ticker(20, 30, [[0, 'Frank, Alberta, 1903'], [GO, 'Rumble…'], [DOWN + 0.08, 'Less than 2 minutes!']], 22),
  ],
};
export default scene;
