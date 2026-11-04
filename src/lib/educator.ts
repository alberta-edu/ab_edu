// Notes for teachers and parents. They live in their own files, content/educators/grade-5/<subject>/,
// so a topic's notes can change without touching the lesson students see.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { z } from 'zod';
import { REF_PATTERN, type Concept, type Passage, type Problem } from './schema.ts';
import { md, mdInline, splitSentences } from './render.ts';
import { SUBJECTS, type SubjectSlug } from '../site.ts';

const text = z.string().min(1);
const covers = z.array(z.string().regex(REF_PATTERN)).min(1);

/** What makes a child's day harder. The labels are what educators see. */
export const NEEDS = {
  reading: 'When reading is hard',
  writing: 'When writing is hard',
  attention: 'When attention comes and goes',
  worry: 'When getting it wrong feels scary',
  language: 'When English is still new',
  hands: 'When using a screen or pencil is hard',
} as const;

const needIds = Object.keys(NEEDS) as [keyof typeof NEEDS, ...(keyof typeof NEEDS)[]];

export const notesSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+$/),
  subject: z.enum(['math', 'science', 'social-studies', 'english-language-arts']),
  /** What this topic really builds in a child, beyond the test. One or two sentences. */
  why: text,
  /** The first five minutes: spark curiosity without explaining anything yet. */
  hook: z.strictObject({ title: text, time: text, body: text, covers }),
  /** Playful things to do away from the screen. Optional for an educator, never required for the site. */
  activities: z
    .array(z.strictObject({ title: text, time: text, materials: text, steps: z.array(text).min(2).max(5), covers }))
    .min(2)
    .max(3),
  /** Questions that make children think, in place of explaining. */
  questions: z.array(text).min(3).max(6),
  /** What children really think, why it makes sense to them, and what helps. */
  misconceptions: z.array(z.strictObject({ thought: text, why: text, tryThis: text })).min(2).max(4),
  /** Signs of understanding an adult can see or hear, without a test. */
  lookFor: z.array(text).min(2).max(4),
  adapt: z.strictObject({
    /** Ways in for a child who needs a lower first step. */
    support: z.array(text).min(2).max(4),
    /** Specific to this topic, for children with different needs. */
    access: z.array(z.strictObject({ need: z.enum(needIds), tip: text })).min(3).max(6),
    /** Where to go next, staying inside the grade. */
    stretch: z.array(text).min(1).max(3),
  }),
  /** Problems on the practice page worth doing together, and how. */
  together: z.array(z.strictObject({ problem: text, how: text })).min(2).max(3),
});

export const subjectGuideSchema = z.strictObject({
  subject: z.enum(['math', 'science', 'social-studies', 'english-language-arts']),
  /** What we hope children can do because of this subject. */
  promise: text,
  /** Small changes in how an adult teaches: instead of this, try that. */
  shifts: z.array(z.strictObject({ instead: text, tryThis: text })).min(3).max(6),
  /** Short routines that work with any topic in the subject. */
  routines: z.array(z.strictObject({ name: text, time: text, how: text })).min(3).max(6),
  /** Seeing what a child understands without a test. */
  assess: z.array(text).min(2).max(5),
  sources: z.array(z.strictObject({ label: text, url: z.url() })).min(1),
});

export type EducatorNotes = z.infer<typeof notesSchema>;
export type SubjectGuide = z.infer<typeof subjectGuideSchema>;

const dir = (subject: SubjectSlug, grade: number) => join(process.cwd(), 'content', 'educators', `grade-${grade}`, subject);

function parseFile<T>(schema: z.ZodType<T>, path: string): T {
  const result = schema.safeParse(parse(readFileSync(path, 'utf8')));
  if (!result.success) throw new Error(`${path}\n${z.prettifyError(result.error)}`);
  return result.data;
}

const notesCache = new Map<string, EducatorNotes | null>();

/** A topic's notes, or null if they haven't been written. */
export function notesFor(c: Pick<Concept, 'id' | 'subject'>, grade = 5): EducatorNotes | null {
  if (notesCache.has(c.id)) return notesCache.get(c.id)!;
  const path = join(dir(c.subject, grade), `${c.id}.yaml`);
  const notes = existsSync(path) ? parseFile(notesSchema, path) : null;
  if (notes && (notes.id !== c.id || notes.subject !== c.subject)) throw new Error(`${path}: id and subject must match the concept`);
  notesCache.set(c.id, notes);
  return notes;
}

export function subjectGuide(subject: SubjectSlug, grade = 5): SubjectGuide | null {
  const path = join(dir(subject, grade), '_subject.yaml');
  return existsSync(path) ? parseFile(subjectGuideSchema, path) : null;
}

/** Files in the notes folders that don't belong to a concept: a renamed topic or a typo. */
export function orphanNotes(concepts: Pick<Concept, 'id' | 'subject'>[], grade = 5): string[] {
  return SUBJECTS.flatMap(({ slug }) => {
    if (!existsSync(dir(slug, grade))) return [];
    return readdirSync(dir(slug, grade))
      .filter((f) => f.endsWith('.yaml') && f !== '_subject.yaml')
      .filter((f) => !concepts.some((c) => c.subject === slug && `${c.id}.yaml` === f))
      .map((f) => `${slug}/${f}`);
  });
}

/** Every piece of Markdown in a set of notes, so the verifier can render it. */
export function notesText(n: EducatorNotes): string[] {
  return [
    n.why,
    n.hook.body,
    ...n.activities.flatMap((a) => a.steps),
    ...n.questions,
    ...n.misconceptions.flatMap((m) => [m.thought, m.why, m.tryThis]),
    ...n.lookFor,
    ...n.adapt.support,
    ...n.adapt.access.map((a) => a.tip),
    ...n.adapt.stretch,
    ...n.together.map((t) => t.how),
  ];
}

/** Every piece of Markdown in a subject guide. */
export function guideText(g: SubjectGuide): string[] {
  return [g.promise, ...g.shifts.flatMap((x) => [x.instead, x.tryThis]), ...g.routines.map((r) => r.how), ...g.assess];
}

/** The answer in a sentence, for the answer key on the notes page. */
export function answerHtml(c: Concept, p: Problem): string {
  switch (p.type) {
    case 'mc':
      return mdInline(p.choices[p.answer]);
    case 'multi':
      return p.answer.map((i) => mdInline(p.choices[i])).join('; ');
    case 'number':
      return `${p.answer}${p.unit ? ` ${p.unit}` : ''}`;
    case 'fraction':
      return p.answer;
    case 'text':
      return p.accept[0];
    case 'order':
      return p.items.map((x) => mdInline(x)).join(' → ');
    case 'evidence': {
      const passage = c.lesson.flatMap((s) => s.blocks).find((b): b is Passage => b.type === 'passage' && b.id === p.passage);
      return p.answer
        .map((id) => {
          const [, para, sentence] = /^p(\d+)s(\d+)$/.exec(id)!;
          return mdInline(splitSentences(passage!.paragraphs[Number(para) - 1])[Number(sentence) - 1]);
        })
        .join(' ');
    }
    case 'open':
      return md(p.modelAnswer);
    case 'build': {
      const shown = p.examples.map((ex) => p.fields.map((f) => `${mdInline(f.label)} ${ex[f.name]}${f.unit ? ` ${f.unit}` : ''}`).join(', '));
      return `Many answers work, for example: ${shown.join('; ')}.`;
    }
    case 'investigation':
      return `<ol class="ed-parts">${p.parts.map((part) => `<li>${answerHtml(c, { ...part, id: p.id, level: p.level, covers: p.covers, thinking: p.thinking } as Problem)}</li>`).join('')}</ol>`;
  }
}
