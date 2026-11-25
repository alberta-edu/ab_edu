// Logic for the Grade 3 ELAL visuals (g3e-*). Pure functions, so they can be tested in tests/grade3-ela.test.ts.

/** Where stop i of n sits on a circle, starting at the top and going clockwise. */
export function circlePoint(i: number, n: number, cx: number, cy: number, r: number): [number, number] {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
  return [Math.round(cx + r * Math.cos(a)), Math.round(cy + r * Math.sin(a))];
}

/**
 * Syllables to clap, from text with · between the syllables of a word: "but·ter·fly", or a line such as
 * "Snow·flakes on my nose". Returns each word with its syllables, and the total number of beats.
 */
export function syllables(text: string): { words: string[][]; beats: number } {
  const words = text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.split('·').filter(Boolean));
  return { words, beats: words.reduce((n, w) => n + w.length, 0) };
}

export type TeamKind = 'plain' | 'blend' | 'digraph' | 'silent';
const TEAM_MARKS: Record<string, { close: string; kind: TeamKind }> = {
  '{': { close: '}', kind: 'blend' },
  '[': { close: ']', kind: 'digraph' },
  '(': { close: ')', kind: 'silent' },
};

/**
 * A word marked with its letter teams: {bl} a blend (consonant cluster), [sh] a digraph and (k) a silent
 * letter. "(k)nee" or "{fl}a[sh]". Returns the pieces in order. Plain letters come one per piece.
 */
export function letterTeams(marked: string): { text: string; kind: TeamKind }[] {
  const out: { text: string; kind: TeamKind }[] = [];
  let i = 0;
  while (i < marked.length) {
    const mark = TEAM_MARKS[marked[i]];
    if (mark) {
      const end = marked.indexOf(mark.close, i + 1);
      if (end < 0) throw new Error(`letter-teams: "${marked}" has an unclosed ${marked[i]}`);
      const text = marked.slice(i + 1, end);
      if (!text) throw new Error(`letter-teams: "${marked}" has an empty team`);
      out.push({ text, kind: mark.kind });
      i = end + 1;
    } else {
      if ('}])'.includes(marked[i])) throw new Error(`letter-teams: "${marked}" has a stray ${marked[i]}`);
      out.push({ text: marked[i], kind: 'plain' });
      i++;
    }
  }
  return out;
}

/** The plain word, without its team marks. */
export const plainWord = (marked: string) => letterTeams(marked).map((p) => p.text).join('');

/**
 * A sentence with | between the subject and the predicate: "My big brother | ate the grapes."
 * Returns the words, and the gap (after word i) where the subject ends.
 */
export function subjectSplit(marked: string): { words: string[]; split: number } {
  const halves = marked.split('|');
  if (halves.length !== 2) throw new Error(`sentence-split: "${marked}" needs exactly one |`);
  const subject = halves[0].trim().split(/\s+/).filter(Boolean);
  const predicate = halves[1].trim().split(/\s+/).filter(Boolean);
  if (!subject.length || !predicate.length) throw new Error(`sentence-split: "${marked}" needs words on both sides of |`);
  return { words: [...subject, ...predicate], split: subject.length - 1 };
}

/** Marks that a contraction or an abbreviation adds: an apostrophe or a period. */
const ADDED = new Set(['’', "'", '.']);

/** One letter: `ch` in the long form, `short` if the short form writes it differently (Alberta → AB). */
export type SqueezeTile = { ch: string; short?: string; drop?: boolean; add?: boolean };

/**
 * How a long form squeezes into a short one: "do not" to "don’t", "Street" to "St.". Letters of the short
 * form are matched in order (ignoring case) against the long form. Unmatched letters drop out, and an
 * apostrophe or period in the short form is added. Throws if the short form can't be made that way.
 */
export function squeeze(from: string, to: string): SqueezeTile[] {
  const tiles: SqueezeTile[] = [];
  let j = 0;
  for (const ch of to) {
    if (ADDED.has(ch) && !from.slice(j).includes(ch)) {
      tiles.push({ ch, add: true });
      continue;
    }
    const k = from.slice(j).toLowerCase().indexOf(ch.toLowerCase());
    if (k < 0) throw new Error(`squeeze: "${to}" can't be made from "${from}"`);
    for (const d of from.slice(j, j + k)) tiles.push({ ch: d, drop: true });
    const long = from[j + k];
    tiles.push(long === ch ? { ch } : { ch: long, short: ch });
    j += k + 1;
  }
  for (const d of from.slice(j)) tiles.push({ ch: d, drop: true });
  return tiles;
}

/** The short form the tiles make: kept and added tiles, in order. */
export const squeezed = (tiles: SqueezeTile[]) => tiles.filter((t) => !t.drop).map((t) => t.short ?? t.ch).join('');

/** The long form the tiles start as: kept and dropped tiles, in order. */
export const unsqueezed = (tiles: SqueezeTile[]) => tiles.filter((t) => !t.add).map((t) => t.ch).join('');

/** One piece of a picture-words sentence: plain text, or a detail (index `detail`) with an optional icon. */
export type PicturePiece = { text: string; detail?: number; icon?: string };

/**
 * A sentence with its picture words in braces: "A {fluffy white|☁️} dog napped {under a red umbrella|☂️}."
 * The words after | are an icon that pops into the picture. Returns the pieces in order and the number of
 * details. Throws on unbalanced braces or an empty detail.
 */
export function pictureWords(marked: string): { pieces: PicturePiece[]; details: number } {
  const pieces: PicturePiece[] = [];
  let details = 0;
  let i = 0;
  while (i < marked.length) {
    const open = marked.indexOf('{', i);
    const stray = marked.indexOf('}', i);
    if (stray >= 0 && (open < 0 || stray < open)) throw new Error(`picture-words: "${marked}" has a stray }`);
    if (open < 0) {
      pieces.push({ text: marked.slice(i) });
      break;
    }
    if (open > i) pieces.push({ text: marked.slice(i, open) });
    const close = marked.indexOf('}', open + 1);
    if (close < 0) throw new Error(`picture-words: "${marked}" has an unclosed {`);
    const [text, icon] = marked.slice(open + 1, close).split('|').map((s) => s.trim());
    if (!text) throw new Error(`picture-words: "${marked}" has an empty detail`);
    pieces.push(icon ? { text, detail: details, icon } : { text, detail: details });
    details++;
    i = close + 1;
  }
  return { pieces, details };
}

/** The sentence with only the details that are switched on. Extra spaces left by hidden details are closed up. */
export function pictureSentence(pieces: PicturePiece[], on: boolean[]): string {
  return pieces
    .filter((p) => p.detail === undefined || on[p.detail])
    .map((p) => p.text)
    .join('')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,!?])/g, '$1')
    .trim();
}

/** A compound word is two words joined with nothing between them: snow + man = snowman. */
export function isCompound(a: string, b: string, word: string): boolean {
  return Boolean(a.trim()) && Boolean(b.trim()) && (a + b).toLowerCase() === word.toLowerCase();
}

/**
 * A run-on sentence with | where each sentence should stop: "we went sledding | it was so fast".
 * Returns the words as shown in the run-on (a sentence's first word in lower case, unless it is "I"), the
 * gaps (after word i) that need a stop, and each word as it is written once fixed (capital after a stop).
 * Other words keep their case, so names stay capitalized.
 */
export function runOn(marked: string): { words: string[]; fixed: string[]; stops: number[] } {
  const parts = marked.split('|').map((p) => p.trim().split(/\s+/).filter(Boolean));
  if (parts.length < 2 || parts.some((p) => !p.length)) throw new Error(`run-on: "${marked}" needs words on each side of every |`);
  const words: string[] = [];
  const fixed: string[] = [];
  const stops: number[] = [];
  parts.forEach((p, k) => {
    p.forEach((w, j) => {
      const first = j === 0;
      const isI = w === 'I' || w.startsWith('I’') || w.startsWith("I'");
      words.push(first && !isI ? w[0].toLowerCase() + w.slice(1) : w);
      fixed.push(first ? w[0].toUpperCase() + w.slice(1) : w);
    });
    if (k < parts.length - 1) stops.push(words.length - 1);
  });
  return { words, fixed, stops };
}

/**
 * A sentence with [ ] around the words that go inside quotation marks: "[Look at the moose!] shouted Ben."
 * or "Dad calls our tent a [palace]." Returns the words (brackets removed), and the first and last word
 * inside the marks. Punctuation touching the last word stays with it, so the closing mark goes after it.
 */
export function quoteSpan(marked: string): { words: string[]; from: number; to: number } {
  const open = marked.indexOf('[');
  const close = marked.indexOf(']');
  if (open < 0 || close < open || marked.includes('[', open + 1) || marked.includes(']', close + 1)) {
    throw new Error(`quote: "${marked}" needs one [ ] around the quoted words`);
  }
  const count = (s: string) => s.split(/\s+/).filter(Boolean).length;
  const inside = count(marked.slice(open + 1, close));
  if (!inside) throw new Error(`quote: "${marked}" has nothing inside [ ]`);
  const from = count(marked.slice(0, open));
  const words = marked.replace(/[[\]]/g, '').split(/\s+/).filter(Boolean);
  return { words, from, to: from + inside - 1 };
}

/** The words inside the quotation marks, as a speech bubble shows them: without a trailing comma. */
export const spokenWords = (q: { words: string[]; from: number; to: number }) =>
  q.words.slice(q.from, q.to + 1).join(' ').replace(/,$/, '');

/**
 * The possessive form of a noun: add ’s, or only ’ to a plural that already ends in s (K3.3, K3.4).
 * "dog" → "dog’s", "dogs" (plural) → "dogs’", "children" (plural) → "children’s".
 */
export function possessive(noun: string, plural: boolean): string {
  return plural && /s$/i.test(noun) ? `${noun}’` : `${noun}’s`;
}
