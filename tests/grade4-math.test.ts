import { describe, expect, it } from 'vitest';
import { parsePlace, formatPlace, shift, digitText, digitAt } from '../src/components/visuals/tenths-shift.ts';
import { hundredthsText } from '../src/components/visuals/hundredths.ts';
import { factors, factorPairs, kindOf, commonFactors, gcf, multiples } from '../src/components/visuals/factors.ts';

describe('tenths shift', () => {
  it('reads and formats numbers to hundredths', () => {
    expect(parsePlace('3 052.7')).toEqual({ h: 305270, decimals: 1 });
    expect(formatPlace(parsePlace('3052.7')!)).toBe('3 052.7');
    expect(formatPlace(parsePlace('3,75')!, ',')).toBe('3,75');
    expect(parsePlace('12 345')).toBeNull();
    expect(parsePlace('1.234')).toBeNull();
  });
  it('moves every digit one place for × 10 and ÷ 10', () => {
    const n = parsePlace('4.7')!;
    expect(formatPlace(shift(n, 'times')!)).toBe('47');
    expect(formatPlace(shift(shift(n, 'times')!, 'times')!)).toBe('470');
    expect(formatPlace(shift(n, 'divide')!)).toBe('0.47');
    expect(formatPlace(shift(parsePlace('4.70')!, 'times')!)).toBe('47.0');
    expect(shift(parsePlace('0.47')!, 'divide')).toBeNull();
    expect(shift(parsePlace('1 000')!, 'times')).toBeNull();
  });
  it('says what a digit is worth', () => {
    const n = parsePlace('352.74')!;
    expect(digitAt(n.h, -1)).toBe(7);
    expect(digitText(n, -1)).toBe('The 7 is in the tenths place, so it is worth 7 tenths, or 0.7.');
    expect(digitText(n, 2)).toBe('The 3 is in the hundreds place, so it is worth 3 × 100 = 300.');
  });
});

describe('hundredths grid', () => {
  it('names tenths and hundredths', () => {
    expect(hundredthsText(35)).toEqual({ decimal: '0.35', say: '35 hundredths = 3 tenths and 5 hundredths.' });
    expect(hundredthsText(40).say).toBe('40 hundredths = 4 tenths, so 40/100 = 4/10.');
    expect(hundredthsText(7).decimal).toBe('0.07');
    expect(hundredthsText(100).decimal).toBe('1.00');
  });
});

describe('factors', () => {
  it('finds factors, pairs and multiples', () => {
    expect(factors(30)).toEqual([1, 2, 3, 5, 6, 10, 15, 30]);
    expect(factorPairs(36)).toEqual([[1, 36], [2, 18], [3, 12], [4, 9], [6, 6]]);
    expect(multiples(6)).toEqual([6, 12, 18, 24, 30]);
  });
  it('sorts numbers as prime, composite or neither', () => {
    expect([0, 1, 2, 9, 13, 51, 97].map(kindOf)).toEqual(['neither', 'neither', 'prime', 'composite', 'prime', 'composite', 'prime']);
  });
  it('finds the greatest common factor', () => {
    expect(commonFactors(12, 18)).toEqual([1, 2, 3, 6]);
    expect(gcf(30, 42)).toBe(6);
    expect(gcf(24, 36)).toBe(12);
  });
});
