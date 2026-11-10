import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { conceptPath, gradeRank, gradesWithContent, loadConcept, loadConcepts, resolveRef, roadmap, subjectBlurb } from '../src/lib/content.ts';
import { conceptKey } from '../src/lib/problem-html.ts';
import { qualityIssues } from '../src/lib/quality.ts';
import { blobIssue, lessonBlobs, limitsFor } from '../src/lib/readability.ts';
import { GRADES, SUBJECTS, gradeProfile } from '../src/site.ts';
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

describe('Grades 1 and 2 read less and practise less', () => {
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

  it('gives Grades 1 and 2 six problems and an earlier unlock', () => {
    const young = gradeProfile(1);
    expect(young.maxPerLevel).toEqual({ 1: 2, 2: 2, 3: 2 });
    expect(young.unlockAfter).toBe(1);
    expect(gradeProfile(2)).toEqual(young);
    expect(gradeProfile(3).maxPerLevel).toEqual({ 1: 3, 2: 4, 3: 2 });
  });
  it('rejects a nine-problem set in Grade 1 but not in Grade 5', () => {
    expect(qualityIssues(concept(1, nine))).toContain('3 Warm-up problems is too many: keep the best 2');
    expect(qualityIssues(concept(5, nine)).some((i) => i.includes('too many'))).toBe(false);
  });
  it('rejects a long prompt in Grade 2', () => {
    const long = mc('w1', 1, Array(35).fill('word').join(' ') + '?', 'recall');
    expect(qualityIssues(concept(2, [long])).some((i) => i.includes('35-word prompt'))).toBe(true);
    expect(qualityIssues(concept(4, [long])).some((i) => i.includes('word prompt'))).toBe(false);
  });
  it('uses shorter paragraphs in Grades 1 and 2', () => {
    const para = Array(25).fill('word').join(' ') + '.';
    expect(blobIssue(para, limitsFor(1))).toMatch(/25 words/);
    expect(blobIssue(para, limitsFor(3))).toBeNull();
  });
  it('needs something to look at in every Grade 1 step', () => {
    const lesson = (grade: number) =>
      ({
        grade,
        bigIdea: '- One.\n- Two.',
        lesson: [{ title: 'Words only', blocks: [{ type: 'text', covers: ['K1.1'], body: 'Plants need water.' }] }],
      }) as unknown as Concept;
    expect(lessonBlobs(lesson(1))).toEqual([expect.stringMatching(/needs a visual, experiment or figure in every step/)]);
    expect(lessonBlobs(lesson(5))).toEqual([]);
  });
  it('caps the Big idea at 3 bullets in Grades 1 and 2', () => {
    const c = { grade: 2, bigIdea: '- A.\n- B.\n- C.\n- D.', lesson: [] } as unknown as Concept;
    expect(lessonBlobs(c)).toContain('big idea: 4 bullets is too many for Grade 2: keep 3');
  });
});
