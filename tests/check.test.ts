import { describe, expect, it } from 'vitest';
import { check, parseNumberInput, normalizeText } from '../src/lib/check.ts';
import { evaluate, parseFractionInput, rat, eq } from '../src/lib/rational.ts';

describe('rational', () => {
  it('evaluates expressions exactly', () => {
    expect(eq(evaluate('4 * 6 + 5'), rat(29))).toBe(true);
    expect(eq(evaluate('2 + 1/3'), rat(7, 3))).toBe(true);
    expect(eq(evaluate('(3 × 4 + 3) ÷ 4'), rat(15, 4))).toBe(true);
    expect(eq(evaluate('0.1 + 0.2'), rat(3, 10))).toBe(true);
    expect(eq(evaluate('-2 + 5'), rat(3))).toBe(true);
  });
  it('rejects malformed expressions', () => {
    expect(() => evaluate('2 +')).toThrow();
    expect(() => evaluate('2 $ 3')).toThrow();
    expect(() => evaluate('1/0')).toThrow();
  });
  it('reads fraction answers and their written form', () => {
    expect(parseFractionInput('11/4')).toMatchObject({ form: 'improper', value: rat(11, 4) });
    expect(parseFractionInput('2 3/4')).toMatchObject({ form: 'mixed', value: rat(11, 4) });
    expect(parseFractionInput(' 2   3 / 4 ')).toMatchObject({ form: 'mixed' });
    expect(parseFractionInput('3/4')).toMatchObject({ form: 'proper' });
    expect(parseFractionInput('3')).toMatchObject({ form: 'whole' });
    expect(parseFractionInput('2.75')).toMatchObject({ form: 'decimal', value: rat(11, 4) });
    expect(parseFractionInput('1 7/4')).toBeNull(); // not a valid mixed number
    expect(parseFractionInput('5/0')).toBeNull();
    expect(parseFractionInput('abc')).toBeNull();
  });
});

describe('check', () => {
  it('grades fractions by value and form', () => {
    const spec = { type: 'fraction', answer: '2 3/4', form: 'mixed' } as const;
    expect(check(spec, { kind: 'text', value: '2 3/4' }).status).toBe('correct');
    expect(check(spec, { kind: 'text', value: '2 6/8' }).status).toBe('correct');
    expect(check(spec, { kind: 'text', value: '11/4' }).status).toBe('almost');
    expect(check(spec, { kind: 'text', value: '2 1/4' }).status).toBe('wrong');
    expect(check(spec, { kind: 'text', value: '2-3/4' }).status).toBe('invalid');
    const improper = { type: 'fraction', answer: '10/4', form: 'improper' } as const;
    expect(check(improper, { kind: 'text', value: '5/2' }).status).toBe('correct');
    expect(check(improper, { kind: 'text', value: '2 1/2' }).status).toBe('almost');
  });
  it('reads numbers written the Canadian way', () => {
    expect(parseNumberInput('1 000')).toBe(1000);
    expect(parseNumberInput('1,000')).toBe(1000);
    expect(parseNumberInput('$4.50')).toBe(4.5);
    expect(parseNumberInput('12 cm', 'cm')).toBe(12);
    expect(parseNumberInput('twelve')).toBeNull();
    expect(check({ type: 'number', answer: 29, tolerance: 0 }, { kind: 'text', value: '29' }).status).toBe('correct');
    expect(check({ type: 'number', answer: 3.14, tolerance: 0.01 }, { kind: 'text', value: '3.15' }).status).toBe('correct');
  });
  it('grades choices, order, evidence and rubrics', () => {
    expect(check({ type: 'mc', answer: 2 }, { kind: 'choice', value: 2 }).status).toBe('correct');
    expect(check({ type: 'multi', answer: [0, 3] }, { kind: 'choices', value: [3, 0] }).status).toBe('correct');
    expect(check({ type: 'multi', answer: [0, 3] }, { kind: 'choices', value: [0] })).toMatchObject({ status: 'wrong' });
    expect(check({ type: 'order', count: 3 }, { kind: 'order', value: [0, 1, 2] }).status).toBe('correct');
    expect(check({ type: 'order', count: 3 }, { kind: 'order', value: [1, 0, 2] })).toMatchObject({
      status: 'wrong',
      message: '1 of 3 are in the right place.',
    });
    expect(check({ type: 'evidence', answer: ['p9s1', 'p9s2'] }, { kind: 'sentences', value: ['p9s2'] }).status).toBe('correct');
    expect(check({ type: 'evidence', answer: ['p9s1'] }, { kind: 'sentences', value: ['p9s3'] }).status).toBe('wrong');
    expect(check({ type: 'open', rubricCount: 4 }, { kind: 'rubric', checked: 3 }).status).toBe('correct');
    expect(check({ type: 'open', rubricCount: 4 }, { kind: 'rubric', checked: 2 }).status).toBe('wrong');
  });
  it('normalizes typed text', () => {
    expect(normalizeText('  Metaphor. ')).toBe('metaphor');
    expect(normalizeText('it’s')).toBe("it's");
  });
});
