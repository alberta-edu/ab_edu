// Changes depend on the material (SCI3-OI1-GQ1-LO1 U6.1, S6.1, S6.2): heat four materials the same
// way. Some changes can be undone by cooling. Others can't.
import { only, type PlayScene, type Sprite } from '../g3-sprites.ts';

const tests: { button: string; before: Sprite; after: Sprite; undo: boolean; say: string }[] = [
  { button: '🧊 Ice', before: { kind: 'rect', x: 70, y: 110, w: 70, h: 70, rx: 6, cls: 'g3s-ice' }, after: { kind: 'ellipse', x: 340, y: 172, w: 130, h: 18, cls: 'g3s-water' }, undo: true, say: 'Ice melts into water. Freeze it, and it is ice again. Reversible.' },
  { button: '🕯️ Wax', before: { kind: 'rect', x: 80, y: 90, w: 50, h: 90, rx: 4, cls: 'g3s-wax' }, after: { kind: 'ellipse', x: 340, y: 172, w: 130, h: 18, cls: 'g3s-wax' }, undo: true, say: 'Wax melts into a puddle. Cool it, and it is solid wax again. Reversible.' },
  { button: '🍞 Bread', before: { kind: 'rect', x: 66, y: 100, w: 80, h: 80, rx: 14, cls: 'g3s-bread' }, after: { kind: 'rect', x: 300, y: 100, w: 80, h: 80, rx: 14, cls: 'g3s-toast' }, undo: false, say: 'Bread turns into toast. Cool it, and it is still toast. Permanent.' },
  { button: '🥚 Egg', before: { kind: 'ellipse', x: 105, y: 150, w: 110, h: 36, cls: 'g3s-rawegg' }, after: { kind: 'ellipse', x: 340, y: 150, w: 110, h: 36, cls: 'g3s-eggwhite' }, undo: false, say: 'A raw egg cooks. Cool it, and it stays cooked. Permanent.' },
];
const n = tests.length;
const sprites: Sprite[] = [];
tests.forEach((s, i) => {
  sprites.push(only(s.before, i, n), only(s.after, i, n));
  if (i === 3) sprites.push(only({ kind: 'ellipse', x: 105, y: 145, w: 30, h: 18, cls: 'g3s-yolk' }, i, n), only({ kind: 'ellipse', x: 340, y: 145, w: 30, h: 18, cls: 'g3s-yolk' }, i, n));
  sprites.push(only({ kind: 'text', text: s.undo ? '↩️ Can be undone' : '🚫 Can’t be undone', x: 240, y: 226, size: 26, cls: 'g3s-label' }, i, n));
});

const scene: PlayScene = {
  w: 480,
  h: 250,
  mode: 'jump',
  states: tests.map((s) => ({ label: s.button, say: s.say })),
  bg: '<rect class="g3s-sky" width="480" height="250"/><text class="g3s-soft" x="105" y="40" font-size="20" font-weight="700" text-anchor="middle">BEFORE</text><text class="g3s-soft" x="340" y="40" font-size="20" font-weight="700" text-anchor="middle">AFTER HEATING</text>',
  sprites: [{ kind: 'arrow', x: 180, y: 140, w: 80, h: 10, r: 0, cls: 'g3s-push' }, { kind: 'emoji', text: '🔥', x: 220, y: 106, size: 30 }, ...sprites],
};
export default scene;
