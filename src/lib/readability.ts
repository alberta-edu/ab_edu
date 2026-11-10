// Readability gate: long paragraphs of prose are hard for children (and busy adults) to read.
// A paragraph that explains a process or lists several ideas belongs in a numbered or bulleted
// list. npm run verify uses this on lesson text and educator notes.
// The limits depend on the grade (gradeProfile in src/site.ts): Grades 1 and 2 read much less.
import type { Concept, LessonBlock } from './schema.ts';
import { gradeProfile } from '../site.ts';

/** Grades 3–6. A paragraph with more sentences than this is a blob once it reaches MIN_BLOB_WORDS. */
export const MAX_SENTENCES = 2;
/** Three short sentences ("Who wrote it? Why? Is it up to date?") still read easily. */
export const MIN_BLOB_WORDS = 25;
/** No prose paragraph may be longer than this, however many sentences it has. */
export const MAX_WORDS = 40;

export interface ProseLimits {
  maxWords: number;
  maxSentences: number;
  minBlobWords: number;
}
const DEFAULT_LIMITS: ProseLimits = { maxWords: MAX_WORDS, maxSentences: MAX_SENTENCES, minBlobWords: MIN_BLOB_WORDS };
/** The prose limits for a grade. */
export const limitsFor = (grade: number): ProseLimits => {
  const p = gradeProfile(grade);
  return { maxWords: p.maxWords, maxSentences: p.maxSentences, minBlobWords: p.minBlobWords };
};

const MATH = /\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)/g;
const LIST_LINE = /^\s*(?:[-*+]|\d+[.)])\s/;

/** Words in a paragraph, with math counted as one word. */
export function wordCount(paragraph: string): number {
  return paragraph.replace(MATH, 'x').split(/\s+/).filter(Boolean).length;
}

/** Sentences in a paragraph. Decimals, "e.g." and "Mr." don't end a sentence. */
export function sentenceCount(paragraph: string): number {
  const t = paragraph.replace(MATH, 'x').replace(/\b(?:e\.g|i\.e|Mr|Mrs|Ms|Dr|St|vs|etc)\./g, (m) => m.slice(0, -1));
  return t.split(/(?<=[.!?]["”’)*_]*)\s+(?=["“‘(*_]*[A-Z0-9])/).filter((s) => s.trim()).length;
}

/**
 * Prose paragraphs in a Markdown string: blank-line blocks that aren't lists, tables, display math
 * or quotes. A quote is text to read aloud as written, like a passage.
 */
export function proseParagraphs(src: string): string[] {
  return src
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(
      (p) =>
        p &&
        !p.split('\n').some((l) => LIST_LINE.test(l) || l.trim().startsWith('|')) &&
        !p.split('\n').every((l) => l.trim().startsWith('>')) &&
        !/^\\\[[\s\S]*\\\]$/.test(p),
    );
}

/** List items in a Markdown string, without their markers. */
export function listItems(src: string): string[] {
  return src
    .split('\n')
    .filter((l) => LIST_LINE.test(l))
    .map((l) => l.replace(LIST_LINE, '').trim());
}

/** Why a piece of prose is too long to read comfortably, or null if it is fine. */
export function blobIssue(src: string, limits: ProseLimits = DEFAULT_LIMITS): string | null {
  const { maxWords, maxSentences, minBlobWords } = limits;
  for (const item of listItems(src)) {
    const w = wordCount(item);
    if (w > maxWords) return `a list item of ${w} words ("${item.slice(0, 60)}…"). Split it, or cut it`;
  }
  for (const p of proseParagraphs(src)) {
    const s = sentenceCount(p);
    const w = wordCount(p);
    if ((s > maxSentences && w >= minBlobWords) || w > maxWords) {
      const start = p.replace(/\s+/g, ' ').slice(0, 60);
      return `${s} sentences, ${w} words in one paragraph ("${start}…"). Make it a list, or cut it`;
    }
  }
  return null;
}

/** The prose a student reads in one lesson block. Passages and problems are stories, so they're not included. */
export function blockProse(b: LessonBlock): string[] {
  switch (b.type) {
    case 'text':
    case 'callout':
      return [b.body];
    case 'compare':
      return b.columns.map((c) => c.body);
    case 'figure':
      return [b.caption];
    case 'visual':
      return b.caption ? [b.caption] : [];
    case 'example':
      return [b.problem, ...b.steps, ...(b.answer ? [b.answer] : [])];
    case 'experiment':
      return [b.question, b.observe, b.explain];
    default:
      return [];
  }
}

/** Blocks that give a young child something to watch or play with. */
const LOOK_AT = new Set(['visual', 'experiment', 'figure']);

/** Every too-long paragraph in a concept's lesson, labelled by step, plus the grade's lesson-shape rules. */
export function lessonBlobs(c: Concept): string[] {
  const out: string[] = [];
  const profile = gradeProfile(c.grade);
  const limits = limitsFor(c.grade);
  // The Big idea is the first thing a student reads, so it is a list: at most a one-sentence lead-in.
  const big = blobIssue(c.bigIdea, limits) ?? (proseParagraphs(c.bigIdea).some((p) => sentenceCount(p) > 1) ? 'more than one sentence of prose. Make it 3–4 bullets' : null);
  if (big) out.push(`big idea: ${big}`);
  const bullets = listItems(c.bigIdea).length;
  if (profile.maxBigIdeaBullets && bullets > profile.maxBigIdeaBullets) out.push(`big idea: ${bullets} bullets is too many for Grade ${c.grade}: keep ${profile.maxBigIdeaBullets}`);
  if (c.lesson.length > profile.maxSteps) out.push(`${c.lesson.length} lesson steps is too many for Grade ${c.grade}: keep ${profile.maxSteps} or fewer`);
  c.lesson.forEach((s, i) => {
    if (profile.visualEveryStep && !s.blocks.some((b) => LOOK_AT.has(b.type)))
      out.push(`step ${i + 1} "${s.title}": Grade ${c.grade} needs a visual, experiment or figure in every step`);
    s.blocks.forEach((b, j) => {
      for (const t of blockProse(b)) {
        const issue = blobIssue(t, limits);
        if (issue) out.push(`step ${i + 1} "${s.title}", block ${j + 1} (${b.type}): ${issue}`);
      }
    });
  });
  return out;
}
