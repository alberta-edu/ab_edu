// Small text tools for the writing and poetry visuals.

/** Number of words in each sentence of a text. */
export function sentenceLengths(text: string): number[] {
  return text
    .split(/(?<=[.!?])["”’)]*\s+/)
    .map((s) => s.trim())
    .filter((s) => /[A-Za-z0-9]/.test(s))
    .map((s) => s.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length);
}

export type Rhythm = 'empty' | 'few' | 'choppy' | 'long' | 'varied';

/** Reads the rhythm of a text from its sentence lengths. */
export function rhythmOf(lengths: number[]): Rhythm {
  if (!lengths.length) return 'empty';
  if (lengths.length < 3) return 'few';
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const spread = Math.max(...lengths) - Math.min(...lengths);
  if (spread >= 5) return 'varied';
  return avg >= 16 ? 'long' : 'choppy';
}

/**
 * Memorizing a poem: which words are hidden at each level. Level 0 hides nothing and level 4 hides
 * every word. Each level hides everything the level before it hid, so the poem fades out steadily.
 */
export function isHidden(wordIndex: number, level: number): boolean {
  if (level <= 0) return false;
  if (level >= 4) return true;
  if (level === 1) return wordIndex % 4 === 3;
  if (level === 2) return wordIndex % 2 === 1;
  return wordIndex % 4 !== 0;
}
