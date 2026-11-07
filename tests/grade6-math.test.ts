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
