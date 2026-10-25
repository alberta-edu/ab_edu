// Review data: every Grade 5 problem, pre-rendered to HTML (math included), plus key
// terms for flashcards. Fetched only by the Review page.
import type { APIRoute } from 'astro';
import { loadConcepts, conceptPath } from '../../../lib/content.ts';
import { renderProblem, conceptKey, problemKey } from '../../../lib/problem-html.ts';
import { md } from '../../../lib/render.ts';
import { SUBJECTS } from '../../../site.ts';
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

export const GET: APIRoute = () => {
  const data: ReviewData = { concepts: {} };
  for (const c of loadConcepts(5)) {
    data.concepts[conceptKey(c)] = {
      title: c.shortTitle,
      subject: SUBJECTS.find((s) => s.slug === c.subject)!.name,
      url: href(conceptPath(c)),
      problems: c.problems.map((p, i) => ({ key: problemKey(c, p), level: p.level, html: renderProblem(c, p, i + 1) })),
      terms: c.keyTerms.map((t) => ({ term: t.term, html: md(t.definition) })),
    };
  }
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
};
