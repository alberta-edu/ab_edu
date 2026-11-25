// Investigations support or contradict what we think we know, and spark new questions
// (SCI3-OI7-GQ1-LO1 U1.1, K1.7, S1.1, S1.5): Mira thinks bean seeds need light to sprout. She plants
// one in a sunny window and one in a dark cupboard. Both sprout (bean seeds sprout in the dark, using
// food stored in the seed), but the dark sprout is tall and pale. That sparks a new question.
import { showFrom, ticker, type RunScene, type Sprite } from '../../visuals/g3-sprites.ts';

const D1 = 0.08;
const D3 = 0.35;
const D5 = 0.6;
const stem = (x: number, top3: number, top5: number, stroke: string, sw: number): Sprite => ({
  kind: 'line', x, y: 222, x2: x, y2: 222, stroke, sw, keys: [{ t: D1, y2: 222 }, { t: D3, y2: top3 }, { t: D5, y2: top5 }],
});
const pot = (x: number) => `<path class="g3s-clay" d="M${x - 40},222 L${x + 40},222 L${x + 32},262 L${x - 32},262 Z"/><rect class="g3s-dark" x="${x - 40}" y="216" width="80" height="8" rx="3"/>`;

const scene: RunScene = {
  w: 480,
  h: 290,
  ms: 8000,
  live: 'Mira thought seeds need light to sprout. She planted one bean in a sunny window and one in a dark cupboard. Both sprouted! The one in the dark was tall and pale. That gave her a new question.',
  bg:
    '<rect class="g3s-sky" width="480" height="290"/><rect class="g3s-wood" y="262" width="480" height="28"/>' +
    '<rect class="g3s-chip" x="20" y="66" width="200" height="150" rx="6"/><rect class="g3s-beam" x="28" y="74" width="184" height="134"/>' +
    '<rect class="g3s-night" x="250" y="66" width="220" height="196" rx="6"/>' +
    '<text x="360" y="88" font-size="15" font-weight="700" text-anchor="middle" fill="#fff">Dark cupboard</text>' +
    pot(130) + pot(360),
  sprites: [
    { kind: 'emoji', text: '☀️', x: 60, y: 104, size: 40 },
    { kind: 'emoji', text: '🫘', x: 130, y: 240, size: 20 },
    { kind: 'emoji', text: '🫘', x: 360, y: 240, size: 20 },
    stem(130, 196, 150, '#3f9a40', 7),
    stem(360, 180, 112, '#e2cf6b', 5),
    showFrom({ kind: 'emoji', text: '🌿', x: 130, y: 196, size: 30, keys: [{ t: D3, y: 196 }, { t: D5, y: 150, size: 42 }] }, D3),
    ...[-12, 12].map((dx): Sprite => showFrom({ kind: 'ellipse', x: 360 + dx, y: 180, w: 18, h: 9, fill: '#e2cf6b', keys: [{ t: D3, y: 180 }, { t: D5, y: 112 }] }, D3)),
    ticker(240, 22, [[0, 'Mira’s idea: seeds need light to sprout'], [D1, 'Day 1'], [D3, 'Day 3'], [D5, 'Day 5'], [0.74, 'Both sprouted!']], 19, 'middle'),
    showFrom({ kind: 'text', text: '❓ New question: why is the dark one pale?', x: 240, y: 48, size: 17, cls: 'g3s-label' }, 0.84),
  ],
};
export default scene;
