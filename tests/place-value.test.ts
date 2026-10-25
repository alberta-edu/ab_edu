import { describe, expect, it } from 'vitest';
import { numberWords } from '../src/components/visuals/number-words.ts';
import { fmt, roundingText } from '../src/components/visuals/decimal-zoom.ts';

describe('number words', () => {
  it.each([
    ['0', 'zero'],
    ['14', 'fourteen'],
    ['56', 'fifty-six'],
    ['3 456 078.125', 'three million four hundred fifty-six thousand seventy-eight and one hundred twenty-five thousandths'],
    ['10 000 000', 'ten million'],
    ['0.07', 'seven hundredths'],
    ['2.1', 'two and one tenth'],
    ['900 009.009', 'nine hundred thousand nine and nine thousandths'],
    ['1 000.5', 'one thousand and five tenths'],
  ])('%s', (n, words) => expect(numberWords(n)).toBe(words));
});

describe('decimal zoom', () => {
  it('formats exact decimals', () => {
    expect(fmt(23, -1)).toBe('2.3');
    expect(fmt(236, -2)).toBe('2.36');
    expect(fmt(5, -3)).toBe('0.005');
    expect(fmt(4, 0)).toBe('4');
  });
  it('rounds at each level', () => {
    expect(roundingText({ exp: 0, start: 0 }, '2.367')).toMatch(/nearest one it is 2\./);
    expect(roundingText({ exp: -1, start: 20 }, '2.367')).toMatch(/nearest tenth it is 2\.4\./);
    expect(roundingText({ exp: -2, start: 230 }, '2.367')).toMatch(/nearest hundredth it is 2\.37\./);
    expect(roundingText({ exp: -1, start: 0 }, '0.25')).toMatch(/halfway, so it rounds up/);
    expect(roundingText({ exp: -1, start: 0 }, '0.3')).toMatch(/exactly on 0\.3/);
  });
});
