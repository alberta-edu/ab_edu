// From a glacier to an ocean (SCI3-OI3-GQ1-LO1 S2.2, K2.3, S2.3): summer sun melts ice on the
// Columbia Icefield. The meltwater runs into the Athabasca River, which carries it north to the
// Arctic Ocean. Source: Parks Canada, Jasper National Park, "Glaciers and icefields".
import { showFrom, ticker, type RunScene, type Sprite } from '../../visuals/g3-sprites.ts';

const route: [number, number][] = [[96, 214], [150, 196], [196, 158], [262, 150], [306, 108], [364, 88], [402, 46]];
const drops: Sprite[] = [];
for (let d = 0; d < 4; d++) {
  const t0 = 0.22 + d * 0.08;
  const step = 0.07;
  const keys = route.map(([x, y], i) => ({ t: Math.min(1, t0 + i * step), x, y }));
  drops.push({ kind: 'emoji', text: '💧', size: 24, x: route[0][0], y: route[0][1], o: 0, keys: [{ t: t0 - 0.01, o: 0 }, { t: t0, o: 1 }, ...keys] });
}

const scene: RunScene = {
  w: 480,
  h: 280,
  ms: 7500,
  live: 'The sun melted ice on the Columbia Icefield. The meltwater ran into the Athabasca River, and the river carried it all the way to the Arctic Ocean.',
  bg:
    '<rect class="g3s-grass" width="480" height="280"/><rect class="g3s-water" x="200" width="280" height="44"/>' +
    '<path class="g3s-river" d="M96,214 C130,206 170,190 196,158 S240,150 262,150 S290,120 306,108 S350,92 364,88 S396,60 402,40"/>',
  sprites: [
    { kind: 'emoji', text: '☀️', x: 40, y: 40, size: 50 },
    { kind: 'ellipse', x: 70, y: 232, w: 120, h: 60, cls: 'g3s-snow', keys: [{ t: 0.1, w: 120, h: 60 }, { t: 0.6, w: 100, h: 50 }] },
    { kind: 'text', text: 'Columbia Icefield', x: 70, y: 186, size: 17, cls: 'g3s-label' },
    { kind: 'text', text: 'Arctic Ocean', x: 340, y: 22, size: 18, cls: 'g3s-label' },
    { kind: 'text', text: 'N ⬆', x: 30, y: 100, size: 18, cls: 'g3s-label' },
    showFrom({ kind: 'text', text: 'Athabasca River', x: 300, y: 170, size: 17, cls: 'g3s-label' }, 0.3),
    ...drops,
    ticker(240, 266, [[0, ''], [0.12, 'Summer sun melts the ice…'], [0.45, 'The river carries it north…'], [0.86, 'To the ocean!']], 18, 'middle'),
  ],
};
export default scene;
