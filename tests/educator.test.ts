import { describe, expect, it } from 'vitest';
import { answerHtml, notesFor, notesSchema, notesText, orphanNotes, subjectGuide } from '../src/lib/educator.ts';
import { loadConcepts } from '../src/lib/content.ts';
import { SUBJECTS } from '../src/site.ts';
import type { Concept, Problem } from '../src/lib/schema.ts';

const base = { id: 'x', level: 1, covers: ['K1.1'], thinking: 'recall' };
const concept = (problems: unknown[] = [], lesson: unknown[] = []) => ({ id: 'c', problems, lesson }) as unknown as Concept;
const answer = (p: object, c = concept()) => answerHtml(c, { ...base, ...p } as unknown as Problem);

const notes = {
  id: 'area-perimeter',
  subject: 'math',
  why: 'Why it matters.',
  hook: { title: 'Fence', time: '5 minutes', body: 'Ask.', covers: ['K1.1'] },
  activities: [
    { title: 'A', time: '10 minutes', materials: 'Paper', steps: ['One', 'Two'], covers: ['K1.1'] },
    { title: 'B', time: '10 minutes', materials: 'Paper', steps: ['One', 'Two'], covers: ['K1.1'] },
  ],
  questions: ['One?', 'Two?', 'Three?'],
  misconceptions: [
    { thought: 'T', why: 'W', tryThis: 'Try' },
    { thought: 'T', why: 'W', tryThis: 'Try' },
  ],
  lookFor: ['One', 'Two'],
  adapt: {
    support: ['One', 'Two'],
    access: [
      { need: 'reading', tip: 'One' },
      { need: 'worry', tip: 'Two' },
      { need: 'hands', tip: 'Three' },
    ],
    stretch: ['One'],
  },
  together: [
    { problem: 'b1', how: 'One' },
    { problem: 'd1', how: 'Two' },
  ],
};

describe('educator notes schema', () => {
  it('accepts complete notes', () => {
    expect(notesSchema.safeParse(notes).success).toBe(true);
  });
  it('rejects unknown fields, unknown needs and thin sections', () => {
    expect(notesSchema.safeParse({ ...notes, extra: 'x' }).success).toBe(false);
    expect(notesSchema.safeParse({ ...notes, questions: ['Only one?'] }).success).toBe(false);
    const access = [{ need: 'unknown', tip: 'x' }, ...notes.adapt.access];
    expect(notesSchema.safeParse({ ...notes, adapt: { ...notes.adapt, access } }).success).toBe(false);
  });
  it('makes every activity and hook name what it teaches', () => {
    expect(notesSchema.safeParse({ ...notes, hook: { ...notes.hook, covers: [] } }).success).toBe(false);
  });
  it('collects the Markdown from every section', () => {
    const all = notesText(notesSchema.parse({ ...notes, why: 'WHY', adapt: { ...notes.adapt, stretch: ['STRETCH'] } }));
    expect(all).toContain('WHY');
    expect(all).toContain('STRETCH');
  });
});

describe('orphan notes', () => {
  it('reports notes that no concept owns', () => {
    const kept = orphanNotes(loadConcepts(5).filter((c) => c.id !== 'area-perimeter'), 5);
    expect(kept).toContain('grade-5/math/area-perimeter.yaml');
  });
  it('finds none in the real content', () => {
    expect(orphanNotes(loadConcepts(5), 5)).toEqual([]);
  });
});

describe('answer key', () => {
  it('shows the answer of each simple type', () => {
    expect(answer({ type: 'mc', choices: ['No', 'Yes'], answer: 1 })).toContain('Yes');
    const multi = answer({ type: 'multi', choices: ['A', 'B', 'C'], answer: [0, 2] });
    expect(multi).toContain('A');
    expect(multi).toContain('C');
    expect(multi).not.toContain('B');
    expect(answer({ type: 'number', answer: '12', unit: 'cm' })).toBe('12 cm');
    expect(answer({ type: 'fraction', answer: '3/4' })).toBe('3/4');
    expect(answer({ type: 'text', accept: ['noun', 'nouns'] })).toBe('noun');
    expect(answer({ type: 'order', items: ['First', 'Second'] })).toContain('→');
    expect(answer({ type: 'open', modelAnswer: 'Because.' })).toContain('Because.');
  });
  it('quotes the sentence an evidence problem points to', () => {
    const lesson = [{ blocks: [{ type: 'passage', id: 'p', paragraphs: ['First one. Second one.'] }] }];
    expect(answer({ type: 'evidence', passage: 'p', answer: ['p1s2'] }, concept([], lesson))).toContain('Second one.');
  });
  it('shows worked examples for a problem with many right answers', () => {
    const html = answer({ type: 'build', fields: [{ name: 'w', label: 'Width', unit: 'm' }], examples: [{ w: '4' }] });
    expect(html).toContain('Many answers work');
    expect(html).toContain('Width 4 m');
  });
  it('lists every part of an investigation', () => {
    const parts = [
      { type: 'mc', choices: ['No', 'Yes'], answer: 0 },
      { type: 'number', answer: '7' },
    ];
    const html = answer({ type: 'investigation', parts });
    expect(html.match(/<li>/g)).toHaveLength(2);
    expect(html).toContain('No');
    expect(html).toContain('7');
  });
  it('can answer every real problem', () => {
    for (const c of loadConcepts(5)) for (const p of c.problems) expect(answerHtml(c, p), `${c.id} ${p.id}`).not.toBe('');
  });
});

describe('the notes that ship', () => {
  it('every topic has notes, and they point to problems that exist', () => {
    for (const c of loadConcepts(5)) {
      const n = notesFor(c);
      expect(n, `${c.id} has no notes`).not.toBeNull();
      for (const t of n!.together) expect(c.problems.map((p) => p.id), `${c.id} together`).toContain(t.problem);
    }
  });
  it('every subject has a guide', () => {
    for (const { slug } of SUBJECTS) expect(subjectGuide(slug, 5), slug).not.toBeNull();
  });
});
