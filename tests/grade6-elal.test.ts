import { describe, expect, it } from 'vitest';
import { isPalindrome, letters } from '../src/components/visuals/palindrome.ts';
import { centreOn } from '../src/components/visuals/land-globe.ts';

describe('palindromes', () => {
  it('reads letters only, ignoring case, spaces and punctuation', () => {
    expect(letters('Never odd, or even!')).toEqual([...'neveroddoreven']);
  });

  it('finds the curriculum example and phrases', () => {
    expect(isPalindrome('radar')).toBe(true);
    expect(isPalindrome('Never odd or even')).toBe(true);
    expect(isPalindrome('Was it a cat I saw?')).toBe(true);
  });

  it('rejects words that change when flipped, and single letters', () => {
    expect(isPalindrome('rader')).toBe(false);
    expect(isPalindrome('stop')).toBe(false);
    expect(isPalindrome('a')).toBe(false);
    expect(isPalindrome('')).toBe(false);
  });
});

describe('land globe', () => {
  it('turns a place to the centre, tilting no further than 60 degrees', () => {
    expect(centreOn(-111.6, 49.1)).toEqual([111.6, -49.1]);
    expect(centreOn(-68.5, 75)).toEqual([68.5, -60]);
  });
});
