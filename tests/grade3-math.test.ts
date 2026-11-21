import { describe, expect, it } from 'vitest';
import { parseSide, sideValue, solveBox, tilt, balanceSay, pieces } from '../src/components/visuals/g3-equation.ts';
import { fractionName, unitSum, compare, compareWhy, benchmark } from '../src/components/visuals/g3-fraction.ts';
import { family, rowSeq } from '../src/components/visuals/g3-table.ts';
import { repeatedAdd, skipCount, groupsSay, share, shareSay, groupSay, takeAwaySay, splitSay } from '../src/components/visuals/g3-groups.ts';
import { addFrames, subtractFrames, value, matSvg } from '../src/components/visuals/g3-blocks.ts';
import { compareSign, compareSteps, digitsOf, expanded, fmt, roundTo, roundSay, step, words } from '../src/components/visuals/g3-place.ts';

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

describe('Grade 3 comparing', () => {
  it('stops at the first place that differs', () => {
    const s = compareSteps(45306, 45063);
    expect(s.map((x) => x.i)).toEqual([1, 2, 3]);
    expect(s.at(-1)!.say).toBe('Hundreds: 3 and 0. 3 hundreds are more, so 45 306 > 45 063.');
    expect(compareSteps(9870, 10001).at(-1)!.say).toContain('9 870 < 10 001');
    expect(compareSteps(512, 512).at(-1)!.say).toContain('512 = 512');
    expect(compareSign(3, 4)).toBe('<');
  });
});

describe('Grade 3 base-ten blocks', () => {
  it('adds with trades and ends on the sum', () => {
    const f = addFrames(258, 167);
    expect(value(f.at(-1)!)).toBe(425);
    expect(f.filter((x) => x.say.startsWith('Trade')).length).toBe(2);
    expect(addFrames(999, 1).at(-1)!.say).toBe('999 + 1 = 1000');
  });
  it('subtracts, breaking across zeros', () => {
    const f = subtractFrames(600, 274);
    expect(value(f.at(-1)!)).toBe(326);
    expect(f.filter((x) => x.say.includes('Break')).map((x) => x.say)).toEqual(['Not enough ones. Break 1 hundred into 10 tens.', 'Not enough ones. Break 1 ten into 10 ones.']);
    expect(value(subtractFrames(342, 158).at(-1)!)).toBe(184);
    expect(matSvg(f[0])).toContain('g3m-bk-a');
  });
});

describe('Grade 3 groups and arrays', () => {
  it('says multiplication as groups, adding and skip counting', () => {
    expect(repeatedAdd(3, 4)).toBe('4 + 4 + 4 = 12');
    expect(skipCount(3, 4)).toBe('4, 8, 12');
    expect(groupsSay(5, 0)).toContain('5 × 0 = 0');
    expect(groupsSay(6, 1)).toContain('6 × 1 = 6');
  });
  it('shares, groups and takes away with remainders', () => {
    expect(share(13, 4)).toEqual({ each: 3, left: 1, rounds: 3 });
    expect(shareSay(12, 4)).toContain('12 ÷ 4 = 3');
    expect(groupSay(14, 4)).toContain('2 are left over');
    expect(takeAwaySay(12, 4)).toBe('12 − 4 − 4 − 4 = 0. That is 3 jumps, so 12 ÷ 4 = 3');
    expect(splitSay(7, 8, 5)).toBe('7 × 8 = 7 × 5 + 7 × 3 = 35 + 21 = 56');
  });
});

describe('Grade 3 times table', () => {
  it('builds fact families', () => {
    expect(family(3, 4)).toEqual(['3 × 4 = 12', '4 × 3 = 12', '12 ÷ 3 = 4', '12 ÷ 4 = 3']);
    expect(family(5, 5)).toEqual(['5 × 5 = 25', '25 ÷ 5 = 5']);
    expect(rowSeq(4, 5)).toEqual([4, 8, 12, 16, 20]);
  });
});

describe('Grade 3 fractions', () => {
  it('names fractions and builds them from unit fractions', () => {
    expect(fractionName(3, 8)).toBe('three eighths');
    expect(fractionName(1, 2)).toBe('one half');
    expect(fractionName(2, 2)).toBe('two halves');
    expect(fractionName(1, 12)).toBe('one twelfth');
    expect(unitSum(3, 8)).toBe('1/8 + 1/8 + 1/8 = 3/8');
  });
  it('compares by same denominator or same numerator', () => {
    expect(compare([3, 8], [5, 8])).toBe('<');
    expect(compare([2, 3], [2, 5])).toBe('>');
    expect(compare([4, 4], [6, 6])).toBe('=');
    expect(compareWhy([5, 8], [3, 8])).toBe('Same size parts. 5/8 has more of them, so 5/8 > 3/8.');
    expect(compareWhy([2, 5], [2, 3])).toContain('thirds');
    expect(benchmark(3, 8)).toBe('It is between 0 and 1/2.');
    expect(benchmark(4, 8)).toBe('It is exactly one half.');
  });
});

describe('Grade 3 equations on a balance', () => {
  it('reads a side with one operation or a box', () => {
    expect(parseSide('3 + 4')).toEqual({ a: 3, op: '+', b: 4 });
    expect(parseSide('□ − 4')).toEqual({ a: 'box', op: '−', b: 4 });
    expect(parseSide('12')).toEqual({ a: 12 });
    expect(() => parseSide('3 + x')).toThrow();
    expect(sideValue(parseSide('3 × □'), 5)).toBe(15);
    expect(sideValue(parseSide('24 ÷ 2'))).toBe(12);
  });

  it('finds the box and tips toward the heavier side', () => {
    expect(solveBox(parseSide('□ + 5'), parseSide('12'))).toBe(7);
    expect(solveBox(parseSide('15'), parseSide('3 × □'))).toBe(5);
    expect(tilt(9, 8)).toBeLessThan(0);
    expect(tilt(2, 20)).toBe(14);
    expect(tilt(7, 7)).toBe(0);
  });

  it('says what the balance shows', () => {
    expect(balanceSay(parseSide('5 + 2'), parseSide('4 + 3'), null)).toBe('Balanced! Both sides are 7. So 5 + 2 = 4 + 3.');
    expect(balanceSay(parseSide('6 + 3'), parseSide('8'), null)).toContain('not equal');
    expect(balanceSay(parseSide('□ + 5'), parseSide('12'), 9)).toBe('The left side is heavier. Try a smaller number in the box.');
    expect(balanceSay(parseSide('15'), parseSide('3 × □'), 2)).toBe('The left side is heavier. Try a bigger number in the box.');
  });

  it('lays out cubes, taken-away cubes and boxes', () => {
    expect(pieces(parseSide('9 − 4')).filter((p) => p.kind === 'gone')).toHaveLength(4);
    expect(pieces(parseSide('9 − 4')).filter((p) => p.kind === 'cube')).toHaveLength(5);
    expect(pieces(parseSide('3 × □')).filter((p) => p.kind === 'box')).toHaveLength(3);
    expect(pieces(parseSide('2 × 3')).map((p) => (p.kind === 'cube' ? p.group : -1))).toEqual([0, 0, 0, 1, 1, 1]);
  });
});
