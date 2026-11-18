import { describe, expect, it } from 'vitest';
import { digitsOf, expanded, fmt, roundTo, roundSay, step, words } from '../src/components/visuals/g3-place.ts';

describe('Grade 3 place value', () => {
  it('splits a number into its six places', () => {
    expect(digitsOf(45306)).toEqual([0, 4, 5, 3, 0, 6]);
    expect(digitsOf(100000)).toEqual([1, 0, 0, 0, 0, 0]);
    expect(fmt(45306)).toBe('45 306');
    expect(fmt(100000)).toBe('100 000');
    expect(expanded(45306)).toBe('40 000 + 5 000 + 300 + 6');
    expect(words(70019)).toBe('seventy thousand nineteen');
  });

  it('regroups when a digit passes 9 or 0', () => {
    expect(step(45309, 5, 1)).toEqual({ n: 45310, note: '10 ones make 1 ten. The ones go back to 0.' });
    expect(step(45306, 4, -1)!.note).toContain('Trade 1 hundred for 10 tens');
    expect(step(45306, 4, -1)!.n).toBe(45296);
    expect(step(99999, 5, 1)!.n).toBe(100000);
    expect(step(100000, 5, 1)).toBeNull();
    expect(step(5, 4, -1)).toBeNull();
  });

  it('rounds halfway up and says why', () => {
    expect(roundTo(4368, 100)).toMatchObject({ low: 4300, high: 4400, result: 4400 });
    expect(roundTo(4349, 100).result).toBe(4300);
    expect(roundTo(1500, 1000).result).toBe(2000);
    expect(roundTo(2499, 1000).result).toBe(2000);
    expect(roundSay(4368, 100)).toBe('4 368 is between 4 300 and 4 400. It is past the halfway mark, 4 350, so it rounds up to 4 400.');
    expect(roundSay(4300, 100)).toContain('stays 4 300');
  });
});
