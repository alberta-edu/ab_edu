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
