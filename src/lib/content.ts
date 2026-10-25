// Loads and validates content/ and curriculum/ at build time.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { z } from 'zod';
import { conceptSchema, type Concept } from './schema.ts';
import { SUBJECTS, type SubjectSlug } from '../site.ts';

const ROOT = process.cwd();

// ---------------------------------------------------------------- curriculum

interface CurriculumLine {
  text: string;
  items?: string[];
}
interface CurriculumFile {
  subject: string;
  slug: SubjectSlug;
  grade: string;
  course: string;
  source: string;
  attribution: string;
  implemented: string | null;
  organizingIdeas: {
    code: string;
    title: string;
    statement: string;
    guidingQuestions: {
      code: string;
      question: string;
      outcomes: {
        code: string;
        outcome: string;
        kusps: { knowledge: CurriculumLine[]; understanding: CurriculumLine[]; skillsAndProcedures: CurriculumLine[] }[];
      }[];
    }[];
  }[];
}

export interface OutcomeRef {
  code: string;
  outcome: string;
  guidingQuestion: string;
  organizingIdea: { code: string; title: string; statement: string };
}

const curriculumCache = new Map<string, CurriculumFile>();

export function curriculum(grade: number, subject: SubjectSlug): CurriculumFile {
  const key = `${grade}/${subject}`;
  if (!curriculumCache.has(key)) {
    const file = join(ROOT, 'curriculum', `grade-${grade}`, `${subject}.json`);
    curriculumCache.set(key, JSON.parse(readFileSync(file, 'utf8')));
  }
  return curriculumCache.get(key)!;
}

export function allOutcomes(grade: number, subject: SubjectSlug): OutcomeRef[] {
  return curriculum(grade, subject).organizingIdeas.flatMap((oi) =>
    oi.guidingQuestions.flatMap((gq) =>
      gq.outcomes.map((lo) => ({
        code: lo.code,
        outcome: lo.outcome,
        guidingQuestion: gq.question,
        organizingIdea: { code: oi.code, title: oi.title, statement: oi.statement },
      })),
    ),
  );
}

export function findOutcome(grade: number, subject: SubjectSlug, code: string): OutcomeRef {
  const found = allOutcomes(grade, subject).find((o) => o.code === code);
  if (!found) throw new Error(`Unknown outcome ${code} in grade ${grade} ${subject}`);
  return found;
}

// ---------------------------------------------------------------- roadmap

const roadmapSchema = z.record(
  z.string(),
  z.array(
    z.strictObject({
      id: z.string(),
      title: z.string(),
      organizingIdea: z.string(),
      outcomes: z.array(z.string()).min(1),
    }),
  ),
);
export type RoadmapItem = z.infer<typeof roadmapSchema>[string][number];

/** Every planned concept per subject, in teaching order. Built concepts must appear here too. */
export function roadmap(grade: number): Record<SubjectSlug, RoadmapItem[]> {
  const raw = parse(readFileSync(join(ROOT, 'content', `grade-${grade}`, 'roadmap.yaml'), 'utf8'));
  return roadmapSchema.parse(raw) as Record<SubjectSlug, RoadmapItem[]>;
}

// ---------------------------------------------------------------- concepts

let conceptCache: Concept[] | null = null;

export function loadConcepts(grade = 5): Concept[] {
  if (conceptCache) return conceptCache;
  const concepts: Concept[] = [];
  for (const { slug } of SUBJECTS) {
    const dir = join(ROOT, 'content', `grade-${grade}`, slug);
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.yaml')).sort()) {
      const path = join(dir, file);
      const result = conceptSchema.safeParse(parse(readFileSync(path, 'utf8')));
      if (!result.success) {
        throw new Error(`${path}\n${z.prettifyError(result.error)}`);
      }
      const c = result.data;
      if (`${c.id}.yaml` !== file) throw new Error(`${path}: id "${c.id}" must match the file name`);
      if (c.subject !== slug) throw new Error(`${path}: subject "${c.subject}" must match its folder`);
      for (const code of c.outcomes) findOutcome(grade, slug, code);
      concepts.push(c);
    }
  }
  conceptCache = concepts;
  return concepts;
}

export const conceptsFor = (subject: SubjectSlug, grade = 5) =>
  loadConcepts(grade)
    .filter((c) => c.subject === subject)
    .sort((a, b) => a.order - b.order);

export const conceptPath = (c: { subject: string; id: string }, grade = 5) => `grade-${grade}/${c.subject}/${c.id}/`;
