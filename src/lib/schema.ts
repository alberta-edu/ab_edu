import { z } from 'zod';

/**
 * Markdown string. Math uses \( inline \) and \[ display \] delimiters so that
 * dollar signs stay free for money ("$4.50").
 */
const md = z.string().min(1);

const level = z.union([z.literal(1), z.literal(2), z.literal(3)]);

/**
 * Curriculum statements a block or problem teaches (see resolveRef in content.ts):
 * "K1.2" = the concept's outcome, KUSP group 1, knowledge line 2; "S1.3" skills; "U1.1"
 * understanding; "SCI3-OI1-GQ1-LO1#K3.2" = a line from another (earlier-grade) outcome.
 */
export const REF_PATTERN = /^(?:([A-Za-z0-9_-]+)#)?([KUS])(\d+)\.(\d+)$/;
const covers = z.array(z.string().regex(REF_PATTERN, 'curriculum reference like K1.2, S1.3 or CODE#K1.2')).min(1);

export const figureSchema = z.union([
  z.string(),
  z.strictObject({ kind: z.literal('fraction-bars'), n: z.number().int(), d: z.number().int(), wholes: z.number().int() }),
  z.strictObject({ kind: z.literal('number-line'), n: z.number().int(), d: z.number().int(), wholes: z.number().int(), label: z.string() }),
  z.strictObject({ kind: z.literal('particle-boxes'), boxes: z.array(z.enum(['solid', 'liquid', 'gas'])).min(1).max(4), labels: z.array(z.string()).optional() }),
]);

const problemBase = {
  covers,
  /** Unique within the concept, e.g. "w1". The global id is `<concept id>/<id>`. */
  id: z.string().regex(/^[a-z0-9-]+$/),
  level,
  prompt: md,
  hints: z.array(md).min(1).max(3),
  /** Worked solution, one step per entry. */
  solution: z.array(md).min(1),
  /** Optional figure above the prompt: a generated figure, or raw inline SVG. */
  figure: figureSchema.optional(),
};

const mc = z.strictObject({
  ...problemBase,
  type: z.literal('mc'),
  choices: z.array(md).min(2).max(6),
  answer: z.number().int().min(0),
  /** Why a wrong choice is wrong, keyed by choice index. Every wrong choice should have one. */
  feedback: z.record(z.string(), md).default({}),
  /** Keep authored order (e.g. "A, B, both, neither"). Otherwise choices are shuffled at build time. */
  fixedOrder: z.boolean().default(false),
});

const multi = z.strictObject({
  ...problemBase,
  type: z.literal('multi'),
  choices: z.array(md).min(3).max(8),
  answer: z.array(z.number().int().min(0)).min(1),
  feedback: z.record(z.string(), md).default({}),
  fixedOrder: z.boolean().default(false),
});

const number = z.strictObject({
  ...problemBase,
  type: z.literal('number'),
  answer: z.number(),
  tolerance: z.number().min(0).default(0),
  unit: z.string().optional(),
  /** Exact-arithmetic expression that must equal `answer`. Checked by `npm run verify`. */
  verify: z.string().optional(),
});

const fraction = z.strictObject({
  ...problemBase,
  type: z.literal('fraction'),
  /** "11/4", "2 3/4" or "3". */
  answer: z.string().regex(/^\d+( \d+\/\d+|\/\d+)?$/),
  /** Required written form. "any" accepts every equivalent value. */
  form: z.enum(['any', 'mixed', 'improper']).default('any'),
  verify: z.string().optional(),
});

const text = z.strictObject({
  ...problemBase,
  type: z.literal('text'),
  accept: z.array(z.string().min(1)).min(1),
  caseSensitive: z.boolean().default(false),
});

const order = z.strictObject({
  ...problemBase,
  type: z.literal('order'),
  /** Items in the correct order. Shown shuffled. */
  items: z.array(md).min(3).max(7),
});

const evidence = z.strictObject({
  ...problemBase,
  type: z.literal('evidence'),
  /** Passage id from a `passage` lesson block on the same page. */
  passage: z.string(),
  /** 1-based paragraph numbers to show as the excerpt. */
  paragraphs: z.array(z.number().int().min(1)).min(1),
  /** Sentence ids like "p3s2" (paragraph 3, sentence 2). Any one of them is correct. */
  answer: z.array(z.string().regex(/^p\d+s\d+$/)).min(1),
  /** Feedback for specific wrong sentences. */
  feedback: z.record(z.string(), md).default({}),
});

const open = z.strictObject({
  ...problemBase,
  type: z.literal('open'),
  // The model answer does the job of a worked solution, so hints and steps are optional here.
  hints: z.array(md).max(3).default([]),
  solution: z.array(md).default([]),
  modelAnswer: md,
  /** Self-check list. The student ticks what their answer did. */
  rubric: z.array(md).min(2).max(5),
});

export const problemSchema = z.discriminatedUnion('type', [mc, multi, number, fraction, text, order, evidence, open]);

const block = z.discriminatedUnion('type', [
  /** Short explanation. Keep it brief: visuals and formatted blocks carry the lesson. */
  z.strictObject({ type: z.literal('text'), covers, heading: z.string().optional(), body: md }),
  z.strictObject({
    type: z.literal('visual'),
    covers,
    component: z.enum(['fraction-explorer', 'fraction-regroup', 'particle-model', 'globe', 'latlong-map', 'inference-equation']),
    props: z.record(z.string(), z.unknown()).default({}),
    caption: md.optional(),
  }),
  /** A static picture (generated figure) with a caption. */
  z.strictObject({ type: z.literal('figure'), covers, figure: figureSchema, caption: md }),
  /** Side-by-side cards for contrasting ideas. */
  z.strictObject({
    type: z.literal('compare'),
    covers,
    columns: z
      .array(z.strictObject({ title: z.string(), body: md, figure: figureSchema.optional() }))
      .min(2)
      .max(4),
  }),
  z.strictObject({
    type: z.literal('example'),
    covers,
    title: z.string(),
    problem: md,
    steps: z.array(md).min(1),
    answer: md.optional(),
  }),
  z.strictObject({
    type: z.literal('callout'),
    covers,
    /** "remember" recalls an earlier grade and may reference only earlier-grade statements. */
    variant: z.enum(['tip', 'mistake', 'remember']),
    title: z.string(),
    body: md,
  }),
  z.strictObject({
    type: z.literal('table'),
    covers,
    caption: z.string().optional(),
    headers: z.array(z.string()).min(2),
    rows: z.array(z.array(md)).min(1),
  }),
  z.strictObject({
    type: z.literal('passage'),
    id: z.string(),
    title: z.string(),
    /** Genre / form label shown above the title, e.g. "Realistic fiction". */
    form: z.string(),
    /** One string per paragraph. Sentences are split automatically. */
    paragraphs: z.array(z.string().min(1)).min(1),
    note: md.optional(),
  }),
  /**
   * Virtual experiment: the student predicts with one tap, presses Run, and watches an
   * animation of what happens. Then a short explanation appears.
   */
  z.strictObject({
    type: z.literal('experiment'),
    covers,
    title: z.string(),
    question: md,
    animation: z.enum(['container-swap']),
    props: z.record(z.string(), z.unknown()).default({}),
    predict: z.strictObject({
      choices: z.array(md).min(2).max(4),
      answer: z.number().int().min(0),
    }),
    /** What to notice. Shown after the animation finishes. */
    observe: md,
    explain: md,
  }),
]);

/** One step of the lesson: a titled chunk shown on its own in the Learn tab. */
const step = z.strictObject({
  title: z.string().min(3),
  blocks: z.array(block).min(1).max(5),
});

export const conceptSchema = z.strictObject({
  /** URL slug. */
  id: z.string().regex(/^[a-z0-9-]+$/),
  grade: z.literal(5),
  subject: z.enum(['math', 'science', 'social-studies', 'english-language-arts']),
  /** Organizing idea code from curriculum/grade-N/<subject>.json, e.g. "MAT-OI1". */
  organizingIdea: z.string(),
  /** Learning outcome codes this concept teaches. */
  outcomes: z.array(z.string()).min(1),
  /** Order within the subject page. */
  order: z.number(),
  title: z.string().min(3),
  shortTitle: z.string().min(3),
  /** Meta description: what a student will learn, 110-160 characters. */
  summary: z.string().min(80).max(170),
  bigIdea: md,
  lesson: z.array(step).min(2).max(8),
  keyTerms: z.array(z.strictObject({ term: z.string(), definition: md, covers })).min(1),
  problems: z.array(problemSchema).min(3),
});

export type Concept = z.infer<typeof conceptSchema>;
export type Problem = z.infer<typeof problemSchema>;
export type LessonStep = Concept['lesson'][number];
export type LessonBlock = LessonStep['blocks'][number];
export type Passage = Extract<LessonBlock, { type: 'passage' }>;
