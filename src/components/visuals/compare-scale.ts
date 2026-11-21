// Comparative and superlative adjectives (LANENG4-OI9-GQ1-LO1, K2.9, K2.10, S2.6).

export interface CompareSet {
  adjective: string;
  /** -er form, or omit for a long adjective that uses "more". */
  er?: string;
  /** -est form, or omit for a long adjective that uses "most". */
  est?: string;
  /** Three things, smallest to biggest on this quality. */
  items: { name: string; icon: string; size: number }[];
  /** A long adjective: "more" and "most" instead of -er and -est. */
  long?: boolean;
}

const mark = (s: string) => `<mark>${s}</mark>`;

/** The comparing words for two things or for three or more. */
export function compareWords(s: CompareSet, n: 2 | 3): string {
  if (s.long) return `${n === 2 ? 'more' : 'most'} ${s.adjective}`;
  const w = n === 2 ? s.er : s.est;
  if (!w) throw new Error(`compare-scale: "${s.adjective}" needs ${n === 2 ? 'er' : 'est'}`);
  return w;
}

/** A sentence comparing the things: the biggest against the one before it, or against all of them. */
export function compareSentence(s: CompareSet, n: 2 | 3): string {
  if (s.items.length !== 3) throw new Error('compare-scale: give exactly three things');
  const [a, b, c] = s.items;
  const inside = (name: string) => name.replace(/^(The|A|An) /, (m) => m.toLowerCase());
  return n === 2 ? `${b.name} is ${mark(compareWords(s, 2))} than ${inside(a.name)}.` : `${c.name} is the ${mark(compareWords(s, 3))} of all.`;
}
