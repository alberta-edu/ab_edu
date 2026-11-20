import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { conceptPath, gradeRank, gradesWithContent, loadConcept, loadConcepts, resolveRef, roadmap, subjectBlurb } from '../src/lib/content.ts';
import { conceptKey } from '../src/lib/problem-html.ts';
import { qualityIssues } from '../src/lib/quality.ts';
import { blobIssue, lessonBlobs, limitsFor } from '../src/lib/readability.ts';
import { GRADES, SUBJECTS, gradeProfile, problemsPerTopic } from '../src/site.ts';
import { problemSchema, type Concept, type Problem } from '../src/lib/schema.ts';

describe('grades', () => {
  it('supports Grades 1 to 6 and not Kindergarten', () => {
    expect([...GRADES]).toEqual([1, 2, 3, 4, 5, 6]);
    expect(gradeRank('k')).toBe(0);
    expect(gradeRank('1')).toBe(1);
    expect(gradeRank(6)).toBe(6);
    expect(existsSync('curriculum/grade-k')).toBe(false);
  });
  it('rejects a reference to a Kindergarten outcome', () => {
    expect(() => resolveRef({ subject: 'math', outcomes: ['MAT1-OI1-GQ1-LO1'] }, 'MATK-OI1-GQ1-LO1#K1.1')).toThrow();
  });
  it('lists only grades with content, and every one has a roadmap', () => {
    const ready = gradesWithContent();
    expect(ready).toContain(5);
    for (const g of ready) expect(Object.values(roadmap(g)).flat().length, `grade ${g}`).toBeGreaterThan(0);
  });
  it('keeps one roadmap per subject, with its own blurb', () => {
    expect(roadmap(5).math.map((r) => r.id)).toContain('place-value-decimals');
    expect(subjectBlurb(5, 'social-studies')).toMatch(/Ancient civilizations/);
    // A grade without a plan falls back to the general blurb.
    expect(subjectBlurb(9, 'math')).toBe(SUBJECTS.find((s) => s.slug === 'math')!.blurb);
  });
  it('puts the grade in every concept path and progress key', () => {
    const c = loadConcepts(5)[0];
    expect(c.grade).toBe(5);
    expect(conceptPath(c)).toBe(`grade-5/${c.subject}/${c.id}/`);
    expect(conceptKey(c)).toBe(`g5/${c.id}`);
  });
  it('loads a concept by grade-qualified id', () => {
    expect(loadConcept('grade-5/symmetry').id).toBe('symmetry');
    expect(loadConcept('symmetry', 5).grade).toBe(5);
    expect(() => loadConcept('grade-6/symmetry')).toThrow(/No concept file/);
  });
});

describe('each younger grade reads less and practises less', () => {
  const mc = (id: string, level: 1 | 2 | 3, prompt: string, thinking: Problem['thinking']): Problem =>
    problemSchema.parse({ id, level, thinking, covers: ['K1.1'], type: 'mc', prompt, choices: ['a', 'b'], answer: 0, feedback: { 1: 'no' }, hints: ['hint'], solution: ['because'] });
  const concept = (grade: number, problems: Problem[]) => ({ id: 'x', grade, subject: 'science', problems }) as unknown as Concept;
  const nine = [
    mc('w1', 1, 'Which animal has fur and can run fast?', 'recall'),
    mc('w2', 1, 'Which picture shows a plant drinking water?', 'notice'),
    mc('w3', 1, 'Which of these things can float on a pond?', 'apply'),
    mc('b1', 2, 'Sam drops a rock and a leaf. Which lands first?', 'why'),
    mc('b2', 2, 'Mia sees frost on the window. What made it?', 'connect'),
    mc('b3', 2, 'A cat hides under a bush in the rain. Why?', 'evidence'),
    mc('b4', 2, 'Leo plants a seed in a dark box. What happens?', 'whatif'),
    mc('d1', 3, 'Why does the ship float even though steel sinks?', 'why'),
    mc('d2', 3, 'What would change if the sun set at noon today?', 'whatif'),
  ];

  it('gives 9 problems in Grades 4–6, then 6, 4 and 3 in Grades 3, 2 and 1', () => {
    expect([6, 5, 4, 3, 2, 1].map(problemsPerTopic)).toEqual([9, 9, 9, 6, 4, 3]);
    expect(gradeProfile(1).maxPerLevel).toEqual({ 1: 1, 2: 1, 3: 1 });
    expect(gradeProfile(2).maxPerLevel).toEqual({ 1: 2, 2: 1, 3: 1 });
    for (const g of [1, 2, 3]) expect(gradeProfile(g).unlockAfter, `grade ${g}`).toBe(1);
    expect(gradeProfile(4).unlockAfter).toBe(2);
  });
  it('shrinks every limit from Grade 4 down to Grade 1', () => {
    const [g1, g2, g3, g4] = [1, 2, 3, 4].map(gradeProfile);
    for (const [young, older] of [[g1, g2], [g2, g3], [g3, g4]]) {
      expect(young.maxWords).toBeLessThan(older.maxWords);
      expect(young.maxSteps).toBeLessThan(older.maxSteps);
      expect(young.maxBlocksPerStep).toBeLessThanOrEqual(older.maxBlocksPerStep);
    }
  });
  it('rejects a nine-problem set in Grades 1 to 3 but not in Grade 5', () => {
    expect(qualityIssues(concept(1, nine))).toContain('3 Warm-up problems is too many: keep the best 1');
    expect(qualityIssues(concept(3, nine))).toContain('4 Build problems is too many: keep the best 2');
    expect(qualityIssues(concept(5, nine)).some((i) => i.includes('too many'))).toBe(false);
  });
  it('accepts a one-problem Deep Think in Grades 1 and 2', () => {
    const one = [mc('d1', 3, 'Why does the ship float even though steel sinks?', 'why')];
    expect(qualityIssues(concept(1, one))).not.toContain('Deep Think needs at least 2 different thinking moves');
  });
  it('keeps investigations out of Grades 1 and 2', () => {
    const part = { type: 'mc', prompt: 'Which?', choices: ['a', 'b'], answer: 0, feedback: { 1: 'no' }, hints: ['hint'], solution: ['because'] };
    const inv = problemSchema.parse({ id: 'd1', level: 3, thinking: 'breakdown', covers: ['K1.1'], type: 'investigation', prompt: 'A garden story.', parts: [part, part], wrapUp: 'Done.', hints: [], solution: [] });
    expect(qualityIssues(concept(2, [inv]))).toContain('d1: Grade 2 has no investigations: use one short problem instead');
    expect(qualityIssues(concept(3, [inv])).some((i) => i.includes('no investigations'))).toBe(false);
  });
  it('rejects a long prompt in Grade 2', () => {
    const long = mc('w1', 1, Array(25).fill('word').join(' ') + '?', 'recall');
    expect(qualityIssues(concept(2, [long])).some((i) => i.includes('25-word prompt'))).toBe(true);
    expect(qualityIssues(concept(4, [long])).some((i) => i.includes('word prompt'))).toBe(false);
  });
  it('uses shorter paragraphs in younger grades', () => {
    const para = (n: number) => Array(n).fill('word').join(' ') + '.';
    expect(blobIssue(para(12), limitsFor(1))).toMatch(/12 words/);
    expect(blobIssue(para(12), limitsFor(2))).toBeNull();
    expect(blobIssue(para(30), limitsFor(3))).toMatch(/30 words/);
    expect(blobIssue(para(30), limitsFor(4))).toBeNull();
  });
  const lesson = (grade: number, blocks: unknown[], extra: object = {}) =>
    ({ grade, bigIdea: '- One.\n- Two.', keyTerms: [], lesson: [{ title: 'A step', blocks }], ...extra }) as unknown as Concept;
  const text = { type: 'text', covers: ['K1.1'], body: 'Plants need water.' };
  const figure = { type: 'figure', covers: ['K1.1'], caption: 'A plant.', figure: { kind: 'square-metre' } };
  it('needs something to look at in every step in Grades 1 to 3', () => {
    expect(lessonBlobs(lesson(3, [text]))).toEqual([expect.stringMatching(/needs a visual, experiment or figure in every step/)]);
    expect(lessonBlobs(lesson(5, [text]))).toEqual([]);
  });
  it('caps blocks per step, Big idea bullets and key terms', () => {
    expect(lessonBlobs(lesson(1, [figure, text, text]))).toContain('step 1 "A step": 3 blocks is too many for Grade 1: keep 2');
    expect(lessonBlobs(lesson(2, [figure], { bigIdea: '- A.\n- B.\n- C.' }))).toContain('big idea: 3 bullets is too many for Grade 2: keep 2');
    const terms = Array.from({ length: 4 }, (_, i) => ({ term: `t${i}`, definition: 'Short.', covers: ['K1.1'] }));
    expect(lessonBlobs(lesson(1, [figure], { keyTerms: terms }))).toContain('4 key terms is too many for Grade 1: keep 3');
  });
});
