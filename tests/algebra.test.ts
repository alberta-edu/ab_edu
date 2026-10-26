import { describe, expect, it } from 'vitest';
import { evaluateSteps } from '../src/components/visuals/expression-steps.ts';
import { solveFrames, wrongMove } from '../src/components/visuals/balance.ts';

const value = (src: string) => {
  const steps = evaluateSteps(src);
  const last = steps.at(-1)!.tokens;
  expect(last).toHaveLength(1);
  return (last[0] as { v: number }).v;
};

describe('order of operations steps', () => {
  it.each([
    ['4 × (3 + 2)', 20],
    ['4 × 3 + 2', 14],
    ['20 − (8 − 3)', 15],
    ['20 − 8 − 3', 9],
    ['6 + 4 × 5', 26],
    ['(6 + 4) × 5', 50],
    ['18 ÷ (7 − 4) + 2', 8],
    ['30 − 12 ÷ 3 × 2', 22],
    ['(15 − (2 + 3)) × 2', 20],
    ['100 ÷ (2 + 3) − 4', 16],
  ])('%s = %d', (src, want) => expect(value(src)).toBe(want));

  it('does parentheses first and explains why', () => {
    const steps = evaluateSteps('4 × (3 + 2)');
    expect(steps[0].caption).toMatch(/^Parentheses first\. Add: 3 \+ 2 = 5/);
    expect(steps[1].caption).toMatch(/remove them/);
  });

  it('multiplies before adding outside parentheses', () => {
    expect(evaluateSteps('6 + 4 × 5')[0].caption).toMatch(/Multiply: 4 × 5 = 20/);
  });

  it('works left to right for subtraction chains', () => {
    expect(evaluateSteps('20 − 8 − 3')[0].caption).toMatch(/20 − 8 = 12/);
  });
});


describe('balance scale frames', () => {
  it.each([
    [2, 3, 11, 4],
    [3, 0, 12, 4],
    [1, 5, 9, 4],
    [4, 2, 30, 7],
  ])('%dx + %d = %d → x = %d', (a, b, c, x) => {
    const fs = solveFrames(a, b, c);
    expect(fs.some((f) => f.equation === `x = ${x}`)).toBe(true);
    expect(fs.at(-1)!.equation).toContain('✓');
    expect(fs.at(-1)!.caption).toContain(`Both sides are ${c}`);
  });
  it('removes the constant from both sides before dividing', () => {
    const caps = solveFrames(2, 3, 11).map((f) => f.caption);
    const take = caps.findIndex((c) => /take 3 cubes off BOTH sides/.test(c));
    const share = caps.findIndex((c) => /share both sides into 2 equal groups/.test(c));
    expect(take).toBeGreaterThan(-1);
    expect(share).toBeGreaterThan(take);
  });
  it('rejects equations without a whole-number solution', () => {
    expect(() => solveFrames(2, 3, 10)).toThrow();
  });
  it('a one-sided change tips the scale', () => {
    expect(wrongMove(2, 3, 11).scene.tilt).toBeGreaterThan(0);
  });
});
