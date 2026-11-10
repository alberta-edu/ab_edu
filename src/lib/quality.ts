// Problem-quality rules that a program can check. The judgement calls live in
// docs/QUESTION-STANDARD.md and are reviewed by people and models; these catch the obvious misses:
// a "Deep Think" that is really a long sum, near-duplicates, and math from a later grade.
import type { Concept, Problem } from './schema.ts';
import { gradeProfile } from '../site.ts';
import { wordCount } from './readability.ts';

/** Prompt text with math, Markdown and punctuation removed. */
export function plainWords(text: string): string[] {
  return text
    .replace(/\\\(.*?\\\)|\\\[.*?\\\]/gs, ' ')
    .replace(/[*_|`#>-]+/g, ' ')
    .toLowerCase()
    .match(/[a-zà-ÿ’']+/g) ?? [];
}

/** A prompt that is only a calculation: "\(245 + 398\) = ?" or "Evaluate 2k + 9 when k = 7." */
export const isBareCalculation = (prompt: string) => plainWords(prompt).length < 8;

/** Words and numbers of a prompt, with every number treated the same so "3 + 4" matches "5 + 6". */
function shape(p: Problem): Set<string> {
  const text = p.prompt.replace(/\\\(|\\\)|\\\[|\\\]/g, ' ').replace(/\d[\d\s.,]*/g, ' # ');
  return new Set(text.toLowerCase().match(/[a-z#’']+/g) ?? []);
}

/** How alike two prompts are, from 0 to 1. */
export function similarity(a: Problem, b: Problem): number {
  const x = shape(a);
  const y = shape(b);
  const shared = [...x].filter((w) => y.has(w)).length;
  return shared / (x.size + y.size - shared || 1);
}

const DUPLICATE_AT = 0.72;

export function nearDuplicates(c: Concept): [string, string][] {
  const pairs: [string, string][] = [];
  c.problems.forEach((a, i) =>
    c.problems.slice(i + 1).forEach((b) => {
      if (similarity(a, b) >= DUPLICATE_AT) pairs.push([a.id, b.id]);
    }),
  );
  return pairs;
}

/** Columns in the widest Markdown table in a text, or 0. */
export function tableColumns(text: string): number {
  return Math.max(0, ...text.split('\n').filter((l) => /^\s*\|.*\|\s*$/.test(l)).map((l) => l.trim().split('|').length - 2));
}

/** Prompt words a young child reads: tables and display math don't count. */
const promptWords = (prompt: string) =>
  wordCount(
    prompt
      .split('\n')
      .filter((l) => !/^\s*\|/.test(l))
      .join('\n')
      .replace(/\\\[[\s\S]*?\\\]/g, ' '),
  );

/** Checks one concept's practice set against the question standard. Returns what is wrong. */
export function qualityIssues(c: Concept): string[] {
  const issues: string[] = [];
  // Limits by grade: 9 problems for Grades 3–6, 6 for Grades 1 and 2 (gradeProfile in src/site.ts).
  const { maxPerLevel: MAX_PER_LEVEL, maxParts: MAX_PARTS, maxDeepSteps: MAX_DEEP_STEPS, minMoves, maxPromptWords } = gradeProfile(c.grade);
  const young = c.grade <= 2;
  const atLevel = (l: number) => c.problems.filter((p) => p.level === l);
  const deep = atLevel(3);
  const build = atLevel(2);

  for (const p of deep) {
    if (p.type !== 'investigation' && isBareCalculation(p.prompt)) issues.push(`${p.id}: a Deep Think problem can't be a bare calculation`);
    if (p.thinking === 'recall' || p.thinking === 'apply') issues.push(`${p.id}: a Deep Think problem needs a real thinking move, not "${p.thinking}"`);
  }
  if (new Set(deep.map((p) => p.thinking)).size < 2) issues.push('Deep Think needs at least 2 different thinking moves');
  if (!deep.some((p) => p.type !== 'mc' && p.type !== 'multi')) issues.push('Deep Think needs a problem that is not multiple choice');
  if (c.subject === 'math' && !young && !deep.some((p) => p.type === 'investigation' || p.type === 'build')) issues.push('Math Deep Think needs an investigation or a build problem');
  if (build.filter((p) => p.thinking === 'recall').length > 1) issues.push('Build has more than one recall problem');
  if (build.length && build.every((p) => p.type !== 'investigation' && isBareCalculation(p.prompt))) issues.push('Build needs at least one story or context');
  if (new Set(c.problems.map((p) => p.thinking)).size < minMoves) issues.push(`the set needs at least ${minMoves} different thinking moves`);
  for (const [level, name] of [[1, 'Warm-up'], [2, 'Build'], [3, 'Deep Think']] as const) {
    const n = atLevel(level).length;
    if (n > MAX_PER_LEVEL[level]) issues.push(`${n} ${name} problems is too many: keep the best ${MAX_PER_LEVEL[level]}`);
  }
  for (const p of c.problems) {
    if (p.type === 'investigation' && p.parts.length > MAX_PARTS) issues.push(`${p.id}: ${p.parts.length} parts is too many: keep ${MAX_PARTS} or fewer`);
  }
  const deepSteps = deep.reduce((n, p) => n + (p.type === 'investigation' ? p.parts.length : 1), 0);
  if (deepSteps > MAX_DEEP_STEPS) issues.push(`Deep Think has ${deepSteps} steps, counting each investigation part: keep ${MAX_DEEP_STEPS} or fewer`);

  const pieces: { id: string; type: string; prompt: string; verify?: string }[] = c.problems.flatMap<{ id: string; type: string; prompt: string; verify?: string }>((p) => (p.type === 'investigation' ? p.parts.map((part) => ({ ...part, id: p.id })) : [p]));
  const written = pieces.filter((p) => p.type === 'open').length;
  const maxWritten = c.subject === 'english-language-arts' ? 1 : 0;
  if (written > maxWritten) {
    issues.push(
      maxWritten
        ? `${written} written answers is too many: keep at most 1, where writing is the skill being taught`
        : `${written} written answers: outside ELAL, use a choice or build problem instead`,
    );
  }
  if (maxPromptWords) {
    for (const p of c.problems) {
      const w = promptWords(p.prompt);
      if (w > maxPromptWords) issues.push(`${p.id}: a ${w}-word prompt is too long for Grade ${c.grade}: keep it under ${maxPromptWords}, and let a picture carry the rest`);
    }
  }
  for (const p of pieces) {
    if ((p.type === 'number' || p.type === 'fraction') && !p.verify) issues.push(`${p.id}: a computed answer needs verify`);
    const wide = tableColumns(p.prompt);
    if (wide > 5) issues.push(`${p.id}: a table with ${wide} columns won't fit on a phone`);
  }
  for (const [a, b] of nearDuplicates(c)) issues.push(`${a} and ${b} are near-duplicates`);
  return issues;
}

/**
 * Math that Grade 5 stops short of, read from `verify:` expressions and prompts. Grades 1–4 stop
 * lower still, so these are upper bounds for them too (their own limits are checked by the
 * grade-level audit). Grade 6 has no automatic ceiling. The Grade 5 outcomes say:
 * natural numbers multiply up to 3-digit by 2-digit and divide 3-digit by 1-digit; decimals only
 * add and subtract; fractions only with common denominators; no negative numbers or powers.
 * Each hit is either a real problem or needs a person's eye, so it is reported, not silently fixed.
 */
export function mathCeilingIssues(p: { id: string; prompt: string; verify?: string; answer?: unknown }, grade = 5): string[] {
  const issues: string[] = [];
  if (grade >= 6) return issues;
  const v = p.verify ?? '';
  // A product or quotient of two plain numbers: "1.5 * 4", "1234 / 7".
  for (const m of v.matchAll(/(\d+(?:\.\d+)?)\s*([*/×÷])\s*(\d+(?:\.\d+)?)/g)) {
    const [, a, op, b] = m;
    const times = op === '*' || op === '×';
    if (times && (a.includes('.') || b.includes('.'))) issues.push(`multiplies a decimal (${m[0]}): Grade 6`);
    if (!times && (a.includes('.') || b.includes('.'))) issues.push(`divides with a decimal (${m[0]}): Grade 6`);
    if (times && !a.includes('.') && !b.includes('.')) {
      const [small, big] = [a, b].sort((x, y) => Number(x) - Number(y));
      // Times 10, 100 or 1 000 is place value, as in 1 m² = 100 × 100 cm², not the algorithm.
      const placeValue = /^10+$/.test(a) || /^10+$/.test(b);
      if (!placeValue && (Number(small) > 99 || Number(big) > 999)) issues.push(`product beyond 3-digit by 2-digit (${m[0]})`);
    }
    if (!times && !a.includes('.') && !b.includes('.') && (Number(b) > 10 || Number(a) > 999) && Number(a) % Number(b) !== 0) {
      issues.push(`division beyond 3-digit by 1-digit (${m[0]})`);
    }
  }
  if (typeof p.answer === 'number' && p.answer < 0) issues.push('negative answer: negative numbers are Grade 6');
  if (/\^|\\sqrt|\bsquare root\b/i.test(p.prompt)) issues.push('power or root: powers are Grade 6');
  if (/\b\d+\s*(%|\\%|percent)\s+of\s+\d/i.test(p.prompt)) issues.push('finds a percent of a number: Grade 6');
  const fractions = [...p.prompt.matchAll(/\\frac\{\d+\}\{(\d+)\}\s*[-+−]\s*(?:\d*\\frac\{\d+\}\{(\d+)\})/g)];
  for (const f of fractions) if (f[1] !== f[2]) issues.push(`adds or subtracts unlike denominators (${f[1]} and ${f[2]}): Grade 6`);
  return issues;
}
