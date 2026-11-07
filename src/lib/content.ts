// Loads and validates content/ and curriculum/ at build time.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { z } from 'zod';
import { conceptSchema, REF_PATTERN, type Concept } from './schema.ts';
import { GRADES, SUBJECTS, type SubjectSlug } from '../site.ts';

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

/** Grades in teaching order. Kindergarten is not supported. */
export const GRADE_ORDER = ['1', '2', '3', '4', '5', '6'] as const;
/** A grade's place in teaching order: its number (Grade 1 = 1), or 0 if it isn't supported. */
export const gradeRank = (g: string | number) => GRADE_ORDER.indexOf(String(g).toLowerCase() as (typeof GRADE_ORDER)[number]) + 1;

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

/** Every statement line of an outcome, with its reference. The grade comes from where the outcome is found. */
export function outcomeStatements(_grade: number | string, subject: SubjectSlug, code: string): Statement[] {
  const found = locateOutcome(subject, code);
  if (!found) throw new Error(`Unknown outcome ${code}`);
  return found.lo.kusps.flatMap((group, gi) =>
    (['K', 'U', 'S'] as const).flatMap((kind) =>
      group[KIND_FIELD[kind]].map((entry, li) => ({
        ref: `${kind}${gi + 1}.${li + 1}`,
        grade: found.grade,
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
//
// Each subject plans its own concepts in content/grade-N/<subject>/_roadmap.yaml, so work on one
// subject never touches another subject's files.

const roadmapItem = z.strictObject({
  id: z.string(),
  title: z.string(),
  organizingIdea: z.string(),
  outcomes: z.array(z.string()).min(1),
});
const subjectRoadmapSchema = z.strictObject({
  /** Short line under the subject name on the grade page. */
  blurb: z.string().min(10).max(80),
  concepts: z.array(roadmapItem).min(1),
});
export type RoadmapItem = z.infer<typeof roadmapItem>;
type SubjectRoadmap = z.infer<typeof subjectRoadmapSchema>;

const contentDir = (grade: number, slug?: SubjectSlug) => join(ROOT, 'content', `grade-${grade}`, ...(slug ? [slug] : []));
const roadmapCache = new Map<string, SubjectRoadmap | null>();

function subjectRoadmap(grade: number, slug: SubjectSlug): SubjectRoadmap | null {
  const key = `${grade}/${slug}`;
  if (!roadmapCache.has(key)) {
    const path = join(contentDir(grade, slug), '_roadmap.yaml');
    let value: SubjectRoadmap | null = null;
    if (existsSync(path)) {
      const result = subjectRoadmapSchema.safeParse(parse(readFileSync(path, 'utf8')));
      if (!result.success) throw new Error(`${path}\n${z.prettifyError(result.error)}`);
      value = result.data;
    }
    roadmapCache.set(key, value);
  }
  return roadmapCache.get(key)!;
}

/** Every planned concept per subject, in teaching order. Built concepts must appear here too. */
export function roadmap(grade: number): Record<SubjectSlug, RoadmapItem[]> {
  return Object.fromEntries(SUBJECTS.map(({ slug }) => [slug, subjectRoadmap(grade, slug)?.concepts ?? []])) as Record<SubjectSlug, RoadmapItem[]>;
}

/** The line under a subject's name on a grade page. */
export const subjectBlurb = (grade: number, slug: SubjectSlug) => subjectRoadmap(grade, slug)?.blurb ?? SUBJECTS.find((s) => s.slug === slug)!.blurb;

// ---------------------------------------------------------------- concepts

/** Concept files in a subject folder. Files starting with "_" (the roadmap) aren't concepts. */
const conceptFiles = (grade: number, slug: SubjectSlug) => {
  const dir = contentDir(grade, slug);
  return existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.yaml') && !f.startsWith('_')).sort() : [];
};

function loadConceptFile(grade: number, slug: SubjectSlug, file: string): Concept {
  const path = join(contentDir(grade, slug), file);
  const result = conceptSchema.safeParse(parse(readFileSync(path, 'utf8')));
  if (!result.success) {
    throw new Error(`${path}\n${z.prettifyError(result.error)}`);
  }
  const c = result.data;
  if (`${c.id}.yaml` !== file) throw new Error(`${path}: id "${c.id}" must match the file name`);
  if (c.subject !== slug) throw new Error(`${path}: subject "${c.subject}" must match its folder`);
  if (c.grade !== grade) throw new Error(`${path}: grade ${c.grade} must match its folder, grade-${grade}`);
  for (const code of c.outcomes) findOutcome(grade, slug, code);
  return c;
}

/** Loads a draft from any path. It gets the same checks, apart from where the file lives. */
export function loadConceptDraft(path: string): Concept {
  const result = conceptSchema.safeParse(parse(readFileSync(path, 'utf8')));
  if (!result.success) throw new Error(`${path}\n${z.prettifyError(result.error)}`);
  return result.data;
}

/**
 * Loads one concept without reading the other files. `id` is "grade-6/ratios" or a bare id; a
 * bare id is looked up in `grade`, or in every grade when no grade is given.
 */
export function loadConcept(id: string, grade?: number): Concept {
  const m = /^grade-(\d)\/(.+)$/.exec(id);
  const [grades, bare] = m ? [[Number(m[1])], m[2]] : [grade ? [grade] : [...GRADES], id];
  const found: Concept[] = [];
  for (const g of grades)
    for (const { slug } of SUBJECTS) if (existsSync(join(contentDir(g, slug), `${bare}.yaml`))) found.push(loadConceptFile(g, slug, `${bare}.yaml`));
  if (found.length > 1) throw new Error(`"${bare}" exists in grades ${found.map((c) => c.grade).join(', ')}: write it as grade-N/${bare}`);
  if (!found.length) throw new Error(`No concept file for "${id}"`);
  return found[0];
}

const conceptCache = new Map<number, Concept[]>();

export function loadConcepts(grade: number): Concept[] {
  if (!conceptCache.has(grade)) {
    conceptCache.set(
      grade,
      SUBJECTS.flatMap(({ slug }) => conceptFiles(grade, slug).map((f) => loadConceptFile(grade, slug, f))),
    );
  }
  return conceptCache.get(grade)!;
}

/** Grades with at least one concept, in order. Only these appear on the site. */
export const gradesWithContent = (): number[] => GRADES.filter((g) => SUBJECTS.some(({ slug }) => conceptFiles(g, slug).length));

/** Every concept in every grade. */
export const loadAllConcepts = (): Concept[] => gradesWithContent().flatMap((g) => loadConcepts(g));

export const conceptsFor = (subject: SubjectSlug, grade: number) =>
  loadConcepts(grade)
    .filter((c) => c.subject === subject)
    .sort((a, b) => a.order - b.order);

/** Subjects of a grade that have at least one concept. */
export const subjectsFor = (grade: number) => SUBJECTS.filter((s) => conceptsFor(s.slug, grade).length);

export const gradePath = (grade: number) => `grade-${grade}/`;
export const subjectPath = (grade: number, subject: SubjectSlug) => `grade-${grade}/${subject}/`;
export const conceptPath = (c: { grade: number; subject: string; id: string }) => `grade-${c.grade}/${c.subject}/${c.id}/`;
