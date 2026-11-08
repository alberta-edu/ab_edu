import { describe, expect, it } from 'vitest';
import { zeroPairSteps, lineSvg, meaning, compareSymbol, signed, term } from '../src/components/visuals/g6-integers.ts';

describe('Grade 6 integers', () => {
  it('writes signs with a real minus', () => {
    expect(signed(-4)).toBe('−4');
    expect(signed(4)).toBe('+4');
    expect(signed(4, false)).toBe('4');
    expect(signed(0)).toBe('0');
    expect(term(-3)).toBe('(−3)');
  });

  it('describes a number in context', () => {
    expect(meaning(-5, 'thermometer')).toBe('5 °C below zero');
    expect(meaning(8, 'elevation')).toBe('8 m above sea level');
    expect(meaning(-4, 'money')).toContain('owes $4');
    expect(meaning(0, 'line')).toContain('neither');
  });

  it('compares from positions on the line', () => {
    expect(compareSymbol(-7, -2)).toBe('<');
    expect(compareSymbol(3, -9)).toBe('>');
    expect(compareSymbol(0, 0)).toBe('=');
  });

  const cases: [number, '+' | '−', number, number][] = [
    [5, '+', -3, 2],
    [-4, '+', -2, -6],
    [3, '+', 4, 7],
    [-6, '+', 6, 0],
    [2, '−', 5, -3],
    [-3, '−', -5, 2],
    [0, '+', -4, -4],
    [4, '−', 0, 4],
  ];
  for (const [a, op, b, want] of cases) {
    it(`zero pairs: ${a} ${op} ${b} = ${want}`, () => {
      const steps = zeroPairSteps(a, op, b);
      const last = steps.at(-1)!;
      expect(last.phase).toBe('result');
      expect(last.top.reduce((s, x) => s + x, 0)).toBe(want);
      expect(last.top.length).toBe(Math.abs(want));
      if (op === '−') expect(steps.some((s) => s.phase === 'flip')).toBe(true);
      // Every step's counters add to the same value as the sum written so far.
      const pair = steps.find((s) => s.phase === 'pair');
      if (pair) expect(pair.top.length + pair.bottom.length - 2 * pair.pairs).toBe(Math.abs(want));
    });
  }

  it('explains subtraction as adding the opposite', () => {
    const flip = zeroPairSteps(2, '−', 5).find((s) => s.phase === 'flip')!;
    expect(flip.caption).toContain('2 + (−5)');
    expect(flip.bottom).toEqual([-1, -1, -1, -1, -1]);
  });

  it('draws a line with every tick and the chosen points', () => {
    const svg = lineSvg({ min: -5, max: 5, points: [{ v: -3, label: 'A' }] });
    expect(svg.match(/g6m-tick/g)?.length).toBe(11);
    expect(svg).toContain('aria-label="Sideways number line from −5 to 5, with points at A −3."');
    expect(lineSvg({ min: -10, max: 10, view: 'thermometer', points: [{ v: -6 }] })).toContain('g6m-mercury');
  });
});

import { primeFactors, powerHtml, factorPairs, factorTree, leaves, layout, divisibleBy, commonFactors, isPrime, prune, depthOf } from '../src/components/visuals/g6-factors.ts';

describe('Grade 6 prime factorization', () => {
  it('finds prime factors with repeats', () => {
    expect(primeFactors(60)).toEqual([2, 2, 3, 5]);
    expect(primeFactors(72)).toEqual([2, 2, 2, 3, 3]);
    expect(primeFactors(97)).toEqual([97]);
    expect(powerHtml(72)).toBe('2<sup>3</sup> × 3<sup>2</sup>');
    expect(powerHtml(30)).toBe('2 × 3 × 5');
    expect(isPrime(1)).toBe(false);
    expect(isPrime(2)).toBe(true);
  });

  it('ends every factor tree in the same primes', () => {
    for (const n of [60, 72, 36, 90, 84, 100]) {
      for (const pair of factorPairs(n)) {
        const t = factorTree(n, pair);
        expect([...leaves(t)].sort((a, b) => a - b)).toEqual(primeFactors(n));
      }
    }
  });

  it('grows a tree level by level and lays out every node', () => {
    const t = factorTree(60, [6, 10]);
    expect(leaves(prune(t, 1))).toEqual([6, 10]);
    expect(leaves(prune(t, depthOf(t)))).toEqual([2, 3, 2, 5]);
    const nodes = layout(t);
    expect(nodes.length).toBe(7);
    expect(nodes.filter((p) => !p.parent).map((p) => p.n)).toEqual([60]);
  });

  it('reads divisibility from prime factors', () => {
    expect(divisibleBy(72, 12).yes).toBe(true);
    expect(divisibleBy(60, 9)).toMatchObject({ yes: false });
    expect(divisibleBy(60, 9).why).toContain('only 1');
    expect(divisibleBy(60, 7).why).toContain('no 7');
  });

  it('builds common factors from shared primes', () => {
    expect(commonFactors(36, 60)).toEqual([1, 2, 3, 4, 6, 12]);
    expect(commonFactors(8, 15)).toEqual([1]);
  });
});

import { decimalMultiplyFrames, decimalDivideFrames, quotientOf } from '../src/components/visuals/g6-decimal-calc.ts';
import { framesFor } from '../src/components/visuals/column-calc.ts';

describe('Grade 6 decimal algorithms', () => {
  const lastRow = (fs: ReturnType<typeof decimalMultiplyFrames>) => fs.at(-1)!.rows.at(-1)!.map((c) => c.ch).join('');
  it('multiplies a decimal by a 2-digit number and places the point', () => {
    expect(lastRow(decimalMultiplyFrames('4.75', '12'))).toBe('57.00');
    expect(lastRow(decimalMultiplyFrames('0.36', '25'))).toBe('9.00');
    expect(lastRow(decimalMultiplyFrames('2.4', '15'))).toBe('36.0');
    expect(decimalMultiplyFrames('4.75', '12')[0].caption).toContain('close to 60');
  });
  const cases: [string, string, string][] = [
    ['85.2', '12', '7.1'],
    ['245', '14', '17.5'],
    ['750', '24', '31.25'],
    ['9.6', '12', '0.8'],
    ['6.54', '3', '2.18'],
    ['100', '16', '6.25'],
    ['10', '3', '3.333'],
  ];
  for (const [a, b, want] of cases) {
    it(`${a} ÷ ${b} = ${want}`, () => {
      const fs = decimalDivideFrames(a, b);
      expect(quotientOf(fs).replace(/^0+(?=\d)/, '')).toBe(want);
      for (const f of fs) expect(f.caption.length).toBeGreaterThan(10);
    });
  }
  it('is reached through column-calc', () => {
    expect(quotientOf(framesFor({ op: '÷', a: '245', b: '14', decimal: true }))).toBe('17.5');
    expect(framesFor({ op: '÷', a: '612', b: '6' }).at(-1)!.caption).toContain('102');
  });
});

import { share, divideToDecimal, sector } from '../src/components/visuals/g6-share.ts';

describe('Grade 6 fractions as quotients', () => {
  it('shares n things among k people', () => {
    expect(share(3, 4)).toMatchObject({ whole: 0, rest: 3, decimal: '0.75', exact: true, simplest: null });
    expect(share(5, 4)).toMatchObject({ whole: 1, rest: 1, decimal: '1.25' });
    expect(share(6, 8).simplest).toEqual([3, 4]);
    expect(share(2, 3)).toMatchObject({ decimal: '0.666', exact: false });
  });
  it('divides to a decimal', () => {
    expect(divideToDecimal(3, 8).text).toBe('0.375');
    expect(divideToDecimal(8, 4).text).toBe('2');
    expect(divideToDecimal(7, 20).text).toBe('0.35');
  });
  it('draws whole circles and slices', () => {
    expect(sector(0, 0, 10, 0, 1)).toContain('a10 10');
    expect(sector(0, 0, 10, 0, 0.25)).toMatch(/^M0 0 L0.00 -10.00 A10 10 0 0 1 10.00 0.00 Z$/);
  });
});

import { plan, steps as cdSteps, barsSvg, units } from '../src/components/visuals/g6-common-denom.ts';

describe('Grade 6 common denominators', () => {
  it('uses the bigger denominator when they are related, else the product', () => {
    expect(plan({ n: 1, d: 3 }, { n: 1, d: 6 })).toEqual({ related: true, fa: 2, fb: 1, D: 6 });
    expect(plan({ n: 3, d: 8 }, { n: 1, d: 4 })).toEqual({ related: true, fa: 1, fb: 2, D: 8 });
    expect(plan({ n: 2, d: 3 }, { n: 1, d: 4 })).toEqual({ related: false, fa: 4, fb: 3, D: 12 });
  });
  it('ends each example with the right answer', () => {
    expect(cdSteps('1/3', '+', '1/6').at(-1)!.rows[2]).toMatchObject({ n: 3, d: 6 });
    expect(cdSteps('2/3', '+', '1/4').at(-1)!.rows[2]).toMatchObject({ n: 11, d: 12 });
    expect(cdSteps('3/4', '−', '1/6').at(-1)!.rows[2]).toMatchObject({ n: 14, d: 24 });
    expect(cdSteps('1/2', '+', '1/2')).toHaveLength(2);
    expect(() => cdSteps('1/4', '−', '1/2')).toThrow();
    expect(units(6)).toBe('sixths');
  });
  it('draws a second bar for an amount over one whole', () => {
    const svg = barsSvg([{ n: 7, d: 6, label: '7/6', tone: 'sum' }]);
    expect(svg.match(/g6m-cd-bar/g)?.length).toBe(2);
  });
});

import { fracText, groupJumps, groupsSum, partOf, jumpsSvg, partSvg } from '../src/components/visuals/g6-frac-times.ts';

describe('Grade 6 fractions times natural numbers', () => {
  it('writes products as fractions and mixed numbers', () => {
    expect(fracText(8, 3)).toBe('8/3 = 2 2/3');
    expect(fracText(6, 3)).toBe('6/3 = 2');
    expect(fracText(3, 4)).toBe('3/4');
  });
  it('models n × a/b as repeated jumps', () => {
    expect(groupJumps(4, 2, 3).at(-1)).toEqual({ from: 6, to: 8 });
    expect(groupsSum(3, 2, 5)).toBe('2/5 + 2/5 + 2/5 = 6/5');
    expect(jumpsSvg(4, 2, 3).match(/g6m-ft-arc"/g)?.length).toBe(4);
  });
  it('models a/b of c as equal parts', () => {
    expect(partOf(3, 4, 12)).toEqual({ part: [12, 4], total: [36, 4] });
    expect(partSvg(3, 4, 12).match(/g6m-fx-part--on/g)?.length).toBe(3);
  });
});

import { equivalent, unitRate, percentOf, ratioPairs, percentPairs, doubleLineSvg, num } from '../src/components/visuals/g6-ratio.ts';

describe('Grade 6 ratios, rates and percent', () => {
  it('checks equivalent ratios, unit rates and percents', () => {
    expect(equivalent(2, 3, 6, 9)).toBe(true);
    expect(equivalent(2, 3, 4, 5)).toBe(false);
    expect(unitRate(4, 6)).toBe(1.5);
    expect(percentOf(35, 60)).toBe(21);
    expect(num(0.1 + 0.2)).toBe('0.3');
  });
  it('lines up matching amounts', () => {
    const pairs = ratioPairs(2, 150, 4, 0.5);
    expect(pairs.find((p) => p.hi)).toMatchObject({ top: 1, bottom: 75 });
    expect(percentPairs(25, 80).find((p) => p.hi)).toMatchObject({ top: 25, bottom: 20 });
    expect(doubleLineSvg(ratioPairs(2, 3, 3, 2), 'cups', 'eggs')).toContain('g6m-dl-join--hi');
  });
});
