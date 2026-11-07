// Review data: every problem of one grade, pre-rendered to HTML (math included), plus key
// terms for flashcards. Fetched only by the Review page, one file per grade.
import type { APIRoute } from 'astro';
import { loadConcepts, conceptPath, gradesWithContent } from '../../../lib/content.ts';
import { renderProblem, conceptKey, problemKey } from '../../../lib/problem-html.ts';
import { md } from '../../../lib/render.ts';
import { SUBJECTS, gradeSlug } from '../../../site.ts';
import { href } from '../../../lib/url.ts';

export interface ReviewData {
  concepts: Record<
    string,
    {
      title: string;
      subject: string;
      url: string;
      problems: { key: string; level: 1 | 2 | 3; html: string }[];
      terms: { term: string; html: string }[];
    }
  >;
}

export function getStaticPaths() {
  return gradesWithContent().map((grade) => ({ params: { grade: gradeSlug(grade) }, props: { grade } }));
}

export const GET: APIRoute = ({ props }) => {
  const data: ReviewData = { concepts: {} };
  for (const c of loadConcepts((props as { grade: number }).grade)) {
    data.concepts[conceptKey(c)] = {
      title: `${c.shortTitle} (Grade ${c.grade})`,
      subject: SUBJECTS.find((s) => s.slug === c.subject)!.name,
      url: href(conceptPath(c)),
      // Investigations are long and teach as you go, so they stay out of the quick review rounds.
      problems: c.problems.filter((p) => p.type !== 'investigation').map((p, i) => ({ key: problemKey(c, p), level: p.level, html: renderProblem(c, p, i + 1) })),
      terms: c.keyTerms.map((t) => ({ term: t.term, html: md(t.definition) })),
    };
  }
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
};
