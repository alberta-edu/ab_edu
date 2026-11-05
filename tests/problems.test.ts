import { describe, expect, it } from 'vitest';
import { check, parseFieldInput } from '../src/lib/check.ts';
import { evaluate, holds, rat, mod, eq } from '../src/lib/rational.ts';
import { isBareCalculation, mathCeilingIssues, nearDuplicates, qualityIssues } from '../src/lib/quality.ts';
import { renderProblem } from '../src/lib/problem-html.ts';
import { loadConcept } from '../src/lib/content.ts';
import { THINKING_MOVES, THINKING_MOVE_IDS, SHOWN_MOVES, MOVE_GROUPS } from '../src/lib/thinking.ts';
import { problemSchema, type Concept, type Problem } from '../src/lib/schema.ts';

const vars = { w: rat(9), h: rat(4) };

describe('rules for build problems', () => {
  it('evaluates names and remainders with exact arithmetic', () => {
    expect(evaluate('w * h', vars)).toEqual(rat(36));
    expect(eq(mod(rat(14), rat(3)), rat(2))).toBe(true);
    expect(eq(mod(rat(7, 2), rat(1)), rat(1, 2))).toBe(true);
  });
  it('checks comparisons joined with &&', () => {
    expect(holds('w * h == 36', vars)).toBe(true);
    expect(holds('w * h == 36 && w != h', vars)).toBe(true);
    expect(holds('w <= h', vars)).toBe(false);
    expect(holds('w % 3 == 0 && h >= 4', vars)).toBe(true);
  });
  it('fails loudly on a rule it cannot read', () => {
    expect(() => holds('w * h', vars)).toThrow(/comparison/);
    expect(() => holds('q == 1', vars)).toThrow(/Unknown name/);
  });
  it('reads whole numbers, decimals, fractions, money and units', () => {
    expect(parseFieldInput('1 000')).toEqual(rat(1000));
    expect(parseFieldInput('2.5')).toEqual(rat(5, 2));
    expect(parseFieldInput('2 3/4')).toEqual(rat(11, 4));
    expect(parseFieldInput('$4.50')).toEqual(rat(9, 2));
    expect(parseFieldInput('12 m', 'm')).toEqual(rat(12));
    expect(parseFieldInput('lots')).toBeNull();
  });
  it('grades against the first rule that fails', () => {
    const spec = {
      type: 'build' as const,
      fields: [{ name: 'w' }, { name: 'h' }],
      rules: [
        { test: 'w * h == 36', fail: 'Not 36' },
        { test: 'w != h', fail: 'Must differ' },
      ],
    };
    expect(check(spec, { kind: 'fields', value: { w: '9', h: '4' } }).status).toBe('correct');
    expect(check(spec, { kind: 'fields', value: { w: '6', h: '6' } })).toEqual({ status: 'wrong', message: 'Must differ' });
    expect(check(spec, { kind: 'fields', value: { w: '2', h: '2' } })).toEqual({ status: 'wrong', message: 'Not 36' });
    expect(check(spec, { kind: 'fields', value: { w: '', h: '4' } }).status).toBe('invalid');
  });
});

describe('quality rules', () => {
  const mc = (id: string, level: 1 | 2 | 3, prompt: string, thinking: Problem['thinking'] = 'why'): Problem =>
    problemSchema.parse({
      id,
      level,
      thinking,
      covers: ['K1.1'],
      type: 'mc',
      prompt,
      choices: ['a', 'b'],
      answer: 0,
      feedback: { 1: 'no' },
      hints: ['hint'],
      solution: ['because'],
    });
  const concept = (problems: Problem[]) => ({ id: 'x', subject: 'science', problems }) as unknown as Concept;

  it('knows a bare calculation from a story', () => {
    expect(isBareCalculation('\\(245\\,806 + 398\\,579\\) = ?')).toBe(true);
    expect(isBareCalculation('Evaluate \\(2k + 9\\) when \\(k = 7\\).')).toBe(true);
    expect(isBareCalculation('Mia packs 84 cookies into bags with the same number in each bag. How many bag sizes work?')).toBe(false);
  });
  it('finds near-duplicates even when the numbers change', () => {
    const a = mc('a', 2, 'A rope is 12 m long. Sam cuts off 3 m. How long is the rope now?');
    const b = mc('b', 2, 'A rope is 40 m long. Sam cuts off 9 m. How long is the rope now?');
    const c = mc('c', 2, 'Which unit is best for measuring the area of Alberta on a map?');
    expect(nearDuplicates(concept([a, b, c]))).toEqual([['a', 'b']]);
  });
  it('rejects a Deep Think level made only of multiple choice or a single move', () => {
    const issues = qualityIssues(concept([mc('d1', 3, 'Why does the ship float even though steel sinks in water today?'), mc('d2', 3, 'What would change on the Moon if a heavy stone were dropped by an astronaut?')]));
    expect(issues).toContain('Deep Think needs at least 2 different thinking moves');
    expect(issues).toContain('Deep Think needs a problem that is not multiple choice');
  });
  it('keeps each level short', () => {
    const warmUps = ['a', 'b', 'c', 'd'].map((id, i) => mc(id, 1, `Warm-up question number ${i} about something different from the others here?`, 'notice'));
    expect(qualityIssues(concept(warmUps))).toContain('4 Warm-up problems is too many: keep the best 3');
    expect(qualityIssues(concept(warmUps.slice(0, 3))).some((i) => i.includes('too many'))).toBe(false);
  });
  it('limits investigation parts and Deep Think steps', () => {
    const part = (prompt: string) => ({ type: 'mc', prompt, choices: ['a', 'b'], answer: 0, feedback: { 1: 'no' }, hints: ['hint'], solution: ['because'] });
    const inv = (id: string, parts: number) =>
      problemSchema.parse({
        id, level: 3, thinking: 'breakdown', covers: ['K1.1'], type: 'investigation', prompt: 'A long story about a garden and its fence.',
        parts: Array.from({ length: parts }, (_, i) => part(`Part ${i}?`)), wrapUp: 'Done.', hints: [], solution: [],
      });
    const issues = qualityIssues(concept([inv('d1', 4), inv('d2', 3)]));
    expect(issues).toContain('d1: 4 parts is too many: keep 3 or fewer');
    expect(issues).toContain('Deep Think has 7 steps, counting each investigation part: keep 5 or fewer');
    expect(qualityIssues(concept([inv('d1', 3), inv('d2', 2)])).some((i) => i.includes('steps'))).toBe(false);
  });
  it('allows written answers only in ELAL, and only one', () => {
    const open = (id: string) =>
      problemSchema.parse({ id, level: 3, thinking: 'design', covers: ['K1.1'], type: 'open', prompt: 'Write a short poem about your favourite place in town.', modelAnswer: 'A poem.', rubric: ['one', 'two'], hints: ['hint'], solution: ['because'] });
    const science = concept([open('d1')]);
    expect(qualityIssues(science).some((i) => i.includes('outside ELAL'))).toBe(true);
    const elal = (problems: Problem[]) => ({ ...concept(problems), subject: 'english-language-arts' }) as Concept;
    expect(qualityIssues(elal([open('d1')])).some((i) => i.includes('written'))).toBe(false);
    expect(qualityIssues(elal([open('d1'), open('d2')])).some((i) => i.includes('keep at most 1'))).toBe(true);
  });
  it('rejects bare calculations and plain recall at Deep Think', () => {
    const issues = qualityIssues(concept([mc('d1', 3, '\\(3 + 4\\) = ?', 'recall')]));
    expect(issues.some((i) => i.includes('bare calculation'))).toBe(true);
    expect(issues.some((i) => i.includes('real thinking move'))).toBe(true);
  });
});

describe('math above Grade 5', () => {
  const issues = (p: { prompt?: string; verify?: string; answer?: unknown }) => mathCeilingIssues({ id: 'x', prompt: '', ...p });
  it('allows what the outcomes allow', () => {
    expect(issues({ verify: '40 - 12.95 - 3.49' })).toEqual([]);
    expect(issues({ verify: '348 * 27' })).toEqual([]);
    expect(issues({ verify: '744 / 6' })).toEqual([]);
    expect(issues({ prompt: '\\(\\frac{3}{8} + \\frac{4}{8}\\)' })).toEqual([]);
  });
  it('flags later-grade math', () => {
    expect(issues({ verify: '1.5 * 4' })[0]).toMatch(/Grade 6/);
    expect(issues({ verify: '7.5 / 3' })[0]).toMatch(/Grade 6/);
    expect(issues({ verify: '1234 * 56' })[0]).toMatch(/3-digit by 2-digit/);
    expect(issues({ verify: '1237 / 7' })[0]).toMatch(/3-digit by 1-digit/);
    expect(issues({ answer: -3 })[0]).toMatch(/negative/);
    expect(issues({ prompt: 'What is 25% of 80?' })[0]).toMatch(/percent/);
    expect(issues({ prompt: '\\(\\frac{1}{2} + \\frac{1}{3}\\)' })[0]).toMatch(/unlike/);
  });
});

describe('investigations', () => {
  const concept = loadConcept('area-perimeter');
  const investigation = problemSchema.parse({
    id: 'd9',
    level: 3,
    thinking: 'breakdown',
    covers: ['K1.1'],
    type: 'investigation',
    prompt: 'Mira is building a dog run.',
    wrapUp: 'Squares use the least fence.',
    parts: [
      { type: 'number', prompt: 'How long is it?', answer: 6, hints: ['Think.'] },
      {
        type: 'build',
        prompt: 'Design one.',
        fields: [{ name: 'w', label: 'Width', unit: 'm' }],
        rules: [{ test: 'w > 1', fail: 'Too small' }],
        examples: [{ w: 2 }],
      },
    ],
  });
  it('renders the story, each part and the wrap-up', () => {
    const html = renderProblem(concept, investigation, 1);
    expect(html.match(/<problem-part/g)).toHaveLength(2);
    expect(html).toContain('Part A');
    expect(html).toContain('Part B');
    expect(html).toContain('data-wrap-up');
    expect(html).toContain('Break it into parts');
    expect(html).toContain('data-field="w"');
  });
  it('needs at least two parts and a wrap-up', () => {
    const base = { id: 'd', level: 3, covers: ['K1.1'], type: 'investigation', prompt: 'A story.' };
    expect(problemSchema.safeParse({ ...base, wrapUp: 'x', parts: [{ type: 'number', prompt: 'q', answer: 1 }] }).success).toBe(false);
    expect(problemSchema.safeParse({ ...base, parts: [{ type: 'number', prompt: 'q', answer: 1 }, { type: 'number', prompt: 'r', answer: 2 }] }).success).toBe(false);
  });
});

describe('thinking moves', () => {
  it('have their own marker, which the move buttons of an order problem don\'t share', () => {
    const concept = loadConcept('body-systems');
    const order = concept.problems.find((p) => p.type === 'order' && SHOWN_MOVES.has(p.thinking))!;
    const html = renderProblem(concept, order, 1);
    expect(html.match(/data-thinking-move/g)).toHaveLength(1);
    expect(html).toMatch(/<button[^>]*data-move=/);
    expect(html).not.toMatch(/<p[^>]*data-move/);
  });
  it('each has a student-facing name and an explanation', () => {
    for (const id of THINKING_MOVE_IDS) {
      expect(THINKING_MOVES[id].name.length).toBeGreaterThan(3);
      expect(THINKING_MOVES[id].blurb).toMatch(/^You /);
    }
  });
  it('are named to the student, except plain recall and use of an idea', () => {
    const concept = loadConcept('place-value-decimals');
    for (const p of concept.problems) {
      const html = renderProblem(concept, p, 1);
      expect(html.includes('data-thinking-move')).toBe(SHOWN_MOVES.has(p.thinking));
      if (SHOWN_MOVES.has(p.thinking)) expect(html).toContain('Thinking skill');
    }
    expect(SHOWN_MOVES.has('recall') || SHOWN_MOVES.has('apply')).toBe(false);
  });
  it('are each in exactly one group on the educators page', () => {
    const grouped = MOVE_GROUPS.flatMap((g) => g.moves);
    expect(new Set(grouped).size).toBe(grouped.length);
    expect(new Set(grouped)).toEqual(new Set(SHOWN_MOVES));
  });
});
