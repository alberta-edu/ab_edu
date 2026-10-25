// Loads and validates content/ and curriculum/ at build time.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { z } from 'zod';
import { conceptSchema, REF_PATTERN, type Concept } from './schema.ts';
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

export function curriculum(grade: number | string, subject: SubjectSlug): CurriculumFile {
  const key = `${grade}/${subject}`;
  if (!curriculumCache.has(key)) {
    const file = join(ROOT, 'curriculum', `grade-${String(grade).toLowerCase()}`, `${subject}.json`);
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

// ---------------------------------------------------------------- statement references
//
// Every lesson block and problem says which curriculum statements it teaches, so nothing
// gets in that the program of studies doesn't list. A reference looks like:
//   K1.2                          the concept's first outcome, KUSP group 1, knowledge line 2
//   S2.4 / U1.1                   skills-and-procedures / understanding lines the same way
//   SCI3-OI1-GQ1-LO1#K3.2         a line from a named outcome (e.g. an earlier grade)

/** Grades in teaching order; the index is the grade's rank (K = 0). */
export const GRADE_ORDER = ['k', '1', '2', '3', '4', '5', '6'] as const;
export const gradeRank = (g: string | number) => GRADE_ORDER.indexOf(String(g).toLowerCase() as (typeof GRADE_ORDER)[number]);

export interface Statement {
  ref: string;
  grade: string;
  outcome: string;
  outcomeCode: string;
  kind: 'K' | 'U' | 'S';
  text: string;
  items?: string[];
}

const KIND_FIELD = { K: 'knowledge', U: 'understanding', S: 'skillsAndProcedures' } as const;

/** Finds an outcome by code in any grade of a subject. */
function locateOutcome(subject: SubjectSlug, code: string) {
  for (const g of GRADE_ORDER) {
    if (!existsSync(join(ROOT, 'curriculum', `grade-${g}`, `${subject}.json`))) continue;
    for (const oi of curriculum(g, subject).organizingIdeas)
      for (const gq of oi.guidingQuestions)
        for (const lo of gq.outcomes) if (lo.code === code) return { grade: g, lo };
  }
  return null;
}

export function resolveRef(concept: Pick<Concept, 'subject' | 'outcomes'>, ref: string): Statement {
  const m = REF_PATTERN.exec(ref);
  if (!m) throw new Error(`Bad curriculum reference "${ref}"`);
  const [, code = concept.outcomes[0], kind, kusp, line] = m as unknown as [string, string | undefined, 'K' | 'U' | 'S', string, string];
  const found = locateOutcome(concept.subject, code);
  if (!found) throw new Error(`Reference "${ref}": outcome ${code} not found in ${concept.subject}`);
  const group = found.lo.kusps[Number(kusp) - 1];
  const entry = group?.[KIND_FIELD[kind]][Number(line) - 1];
  if (!entry) throw new Error(`Reference "${ref}": no ${KIND_FIELD[kind]} line ${line} in group ${kusp} of ${code}`);
  const canonical = code === concept.outcomes[0] ? `${kind}${kusp}.${line}` : `${code}#${kind}${kusp}.${line}`;
  return { ref: canonical, grade: found.grade, outcome: found.lo.outcome, outcomeCode: code, kind, text: entry.text, items: entry.items };
}

/** Every statement line of an outcome, with its reference. */
export function outcomeStatements(grade: number | string, subject: SubjectSlug, code: string): Statement[] {
  const found = locateOutcome(subject, code);
  if (!found) throw new Error(`Unknown outcome ${code}`);
  return found.lo.kusps.flatMap((group, gi) =>
    (['K', 'U', 'S'] as const).flatMap((kind) =>
      group[KIND_FIELD[kind]].map((entry, li) => ({
        ref: `${kind}${gi + 1}.${li + 1}`,
        grade: String(grade),
        outcome: found.lo.outcome,
        outcomeCode: code,
        kind,
        text: entry.text,
        items: entry.items,
      })),
    ),
  );
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
