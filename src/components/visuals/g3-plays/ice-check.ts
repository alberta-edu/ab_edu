// Ice safety (SCI3-OI1-GQ1-LO1 S5.4): compare thin ice, grey ice and thick, clear ice.
// Source: Canadian Red Cross, ice safety (15 cm for one person; grey ice is unsafe).
import { only, type PlayScene, type Sprite } from '../g3-sprites.ts';

const cases = [
  { button: 'Thin ice', h: 26, cls: 'g3s-ice', cm: '5 cm', ok: false, say: 'This ice is only 5 cm thick. It can break. Stay off!' },
  { button: 'Grey ice', h: 70, cls: 'g3s-rock', cm: '18 cm', ok: false, say: 'Grey ice has water in it, so it is weak, even when it is thick. Stay off!' },
  { button: 'Checked ice', h: 70, cls: 'g3s-ice', cm: '18 cm', ok: true, say: 'Clear ice, at least 15 cm thick, checked by a grown-up. Safe for one skater.' },
];
const n = cases.length;
const sprites: Sprite[] = [];
cases.forEach((c, i) => {
  sprites.push(
    only({ kind: 'rect', x: 40, y: 130, w: 300, h: c.h, cls: c.cls }, i, n),
    only({ kind: 'text', text: c.cm, x: 410, y: 130 + c.h / 2, size: 26, cls: 'g3s-label' }, i, n),
    only({ kind: 'emoji', text: c.ok ? '✅' : '❌', x: 410, y: 64, size: 56 }, i, n),
  );
});

const scene: PlayScene = {
  w: 480,
  h: 260,
  mode: 'jump',
  states: cases.map((c) => ({ label: c.button, say: c.say })),
  bg: '<rect class="g3s-sky" width="480" height="260"/><rect class="g3s-deep" x="40" y="130" width="300" height="130"/>',
  sprites: [
    ...sprites,
    { kind: 'emoji', text: '⛸️', x: 190, y: 104, size: 52 },
    { kind: 'line', x: 360, y: 130, x2: 360, y2: 200, cls: 'g3s-line' },
  ],
};
export default scene;
