// Code a word's spelling pattern (LANENG4-OI9-GQ1-LO1, K3.1, S3.1). The letters before the first vowel
// are the start of the word. From the first vowel on, each letter is a vowel (V), a consonant (C) or a
// silent e at the end (e), so "weave" is w + VVCe and "trench" is tr + VCCC.

export const PATTERNS = ['VVCC', 'VVCe', 'VCCe', 'VCCC', 'VVCCe', 'VVCCC'] as const;

export type Code = 'V' | 'C' | 'e';

export interface Coded {
  /** Letters before the first vowel, which the pattern doesn't count. */
  start: string;
  letters: { ch: string; code: Code }[];
  /** The whole pattern, such as "VVCe". */
  pattern: string;
}

const isVowel = (ch: string) => 'aeiou'.includes(ch);

export function codeWord(word: string): Coded {
  const w = word.toLowerCase();
  const first = [...w].findIndex(isVowel);
  if (first < 0) throw new Error(`"${word}" has no vowel`);
  const rest = [...w.slice(first)];
  const letters = rest.map((ch, i): { ch: string; code: Code } => {
    const silentE = ch === 'e' && i === rest.length - 1 && i > 0 && !isVowel(rest[i - 1]);
    return { ch, code: silentE ? 'e' : isVowel(ch) ? 'V' : 'C' };
  });
  return { start: w.slice(0, first), letters, pattern: letters.map((l) => l.code).join('') };
}
