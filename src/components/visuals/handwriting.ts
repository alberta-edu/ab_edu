// Cursive letters and keyboard reaches (LANENG4-OI8-GQ1-LO1, K4.2, K4.3, S4.2, S4.3).
// Letters are drawn upright in a box where the baseline is y = 0, the midline is y = -1 and the top
// line is y = -2. Each letter starts and ends low on the joining stroke, so letters join up.

export type CursiveLetter = 'l' | 'i' | 't' | 'e';

/** Width of each letter, in x-heights. */
const WIDTH: Record<CursiveLetter, number> = { l: 0.75, i: 0.6, t: 0.65, e: 0.7 };

const p = (x: number, y: number, s: number, ox: number, oy: number) => `${(ox + x * s).toFixed(1)} ${(oy + y * s).toFixed(1)}`;

/** One letter's strokes as an SVG path, starting at (x, -0.3). Returns the path and its extra marks. */
export function letterPath(letter: CursiveLetter, x: number, s: number, ox: number, oy: number): { d: string; marks: string } {
  const P = (dx: number, y: number) => p(x + dx, y, s, ox, oy);
  switch (letter) {
    case 'l':
      return { d: `M${P(0, -0.3)} C${P(0.3, -0.6)} ${P(0.7, -1.6)} ${P(0.45, -2)} C${P(0.25, -2.25)} ${P(0.1, -1.4)} ${P(0.25, 0)} C${P(0.3, 0.1)} ${P(0.55, 0.05)} ${P(0.75, -0.3)}`, marks: '' };
    case 'i':
      return { d: `M${P(0, -0.3)} C${P(0.1, -0.5)} ${P(0.2, -0.8)} ${P(0.25, -1)} C${P(0.27, -0.6)} ${P(0.22, -0.1)} ${P(0.32, 0)} C${P(0.4, 0.05)} ${P(0.5, -0.1)} ${P(0.6, -0.3)}`, marks: `M${P(0.27, -1.45)} l0.1 0.1` };
    case 't':
      return { d: `M${P(0, -0.3)} C${P(0.15, -0.7)} ${P(0.25, -1.2)} ${P(0.3, -1.6)} C${P(0.3, -1)} ${P(0.25, -0.1)} ${P(0.38, 0)} C${P(0.45, 0.05)} ${P(0.55, -0.1)} ${P(0.65, -0.3)}`, marks: `M${P(0.05, -1.1)} L${P(0.6, -1.1)}` };
    case 'e':
      return { d: `M${P(0, -0.3)} C${P(0.3, -0.4)} ${P(0.55, -0.7)} ${P(0.45, -0.95)} C${P(0.35, -1.15)} ${P(0.05, -0.8)} ${P(0.15, -0.3)} C${P(0.2, 0)} ${P(0.5, 0.05)} ${P(0.7, -0.3)}`, marks: '' };
  }
}

/** Letters of a word, each with its own path and starting x. */
export function wordLetters(word: string, s: number, ox: number, oy: number) {
  let x = 0;
  return [...word].map((ch) => {
    const letter = ch as CursiveLetter;
    if (!(letter in WIDTH)) throw new Error(`handwriting: no cursive letter "${ch}"`);
    const out = { letter, x, ...letterPath(letter, x, s, ox, oy) };
    x += WIDTH[letter];
    return out;
  });
}

/** Total width of a word, in x-heights. */
export const wordWidth = (word: string) => [...word].reduce((w, ch) => w + WIDTH[ch as CursiveLetter], 0);

/** The finger that presses each key when touch typing, with its home key. */
export const FINGERS = [
  { finger: 'Left pinky', home: 'A', keys: 'QAZ' },
  { finger: 'Left ring finger', home: 'S', keys: 'WSX' },
  { finger: 'Left middle finger', home: 'D', keys: 'EDC' },
  { finger: 'Left pointer finger', home: 'F', keys: 'RFVTGB' },
  { finger: 'Right pointer finger', home: 'J', keys: 'YHNUJM' },
  { finger: 'Right middle finger', home: 'K', keys: 'IK' },
  { finger: 'Right ring finger', home: 'L', keys: 'OL' },
  { finger: 'Right pinky', home: ';', keys: 'P;' },
] as const;

export const KEY_ROWS = ['QWERTYUIOP', 'ASDFGHJKL;', 'ZXCVBNM'];

/** Which finger reaches a key, and from where. */
export function reachFor(key: string): { finger: string; home: string; index: number; note: string } {
  const index = FINGERS.findIndex((f) => f.keys.includes(key));
  if (index < 0) throw new Error(`no finger for key ${key}`);
  const f = FINGERS[index];
  const row = KEY_ROWS.findIndex((r) => r.includes(key));
  const dir = row === 0 ? 'up' : row === 2 ? 'down' : key === f.home ? '' : 'sideways';
  const note = dir ? `${f.finger} reaches ${dir} from ${f.home}, then comes back home.` : `${f.finger} rests here. It is a home key.`;
  return { finger: f.finger, home: f.home, index, note };
}
