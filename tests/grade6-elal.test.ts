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

import { join, sentenceText } from '../src/components/visuals/clause.ts';

describe('clause builder', () => {
  const a = { s: 'the bell', v: 'rang' };
  const b = { s: 'we', v: 'ran', rest: 'outside' };

  it('keeps two independent clauses as two simple sentences', () => {
    const r = join(a, b, '.');
    expect(r.type).toBe('simple');
    expect(r.sentences.map(sentenceText)).toEqual(['The bell rang.', 'We ran outside.']);
  });

  it('joins with a comma and a conjunction to make a compound sentence', () => {
    const r = join(a, b, 'so');
    expect(r.type).toBe('compound');
    expect(sentenceText(r.sentences[0])).toBe('The bell rang, so we ran outside.');
    expect(r.sentences[0].filter((p) => p.role === 'independent')).toHaveLength(2);
  });

  it('turns the second clause into a dependent clause for a complex sentence', () => {
    const r = join(b, a, 'when');
    expect(r.type).toBe('complex');
    expect(sentenceText(r.sentences[0])).toBe('We ran outside when the bell rang.');
    expect(r.sentences[0].map((p) => p.role)).toEqual(['independent', 'dependent']);
  });
});
