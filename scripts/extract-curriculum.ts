// Extracts one grade from LearnAlberta's published curriculum JSON into a
// compact, reviewable file under curriculum/grade-N/<subject>.json.
//
// Source files: https://curriculum.learnalberta.ca/cdn/curriculum/gfc-<code>.json
// Usage: node scripts/extract-curriculum.ts <dir-with-gfc-files> <grade>
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SUBJECTS = [
  { file: 'gfc-mat.json', slug: 'math', name: 'Mathematics' },
  { file: 'gfc-sci.json', slug: 'science', name: 'Science' },
  { file: 'gfc-sss.json', slug: 'social-studies', name: 'Social Studies' },
  { file: 'gfc-laneng.json', slug: 'english-language-arts', name: 'English Language Arts and Literature' },
];

type Line = { text: string; items?: string[] };
type Node = { code: string; typeCode: string; contents?: Record<string, string>; curriculums?: Node[] };

const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, '’')
    .replace(/[\u200b\ufeff]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** Turns the curriculum's HTML fragments into lines, attaching bullet lists to the line before them. */
function toLines(html = ''): Line[] {
  const lines: Line[] = [];
  const re = /<(p|div|ul|ol)[^>]*>([\s\S]*?)<\/\1>/g;
  let m: RegExpExecArray | null;
  let found = false;
  while ((m = re.exec(html))) {
    found = true;
    if (m[1] === 'p' || m[1] === 'div') {
      const text = decode(m[2].replace(/<[^>]+>/g, ''));
      if (text) lines.push({ text });
    } else {
      const items = [...m[2].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)]
        .map((li) => decode(li[1].replace(/<[^>]+>/g, '')))
        .filter(Boolean);
      const prev = lines.at(-1);
      if (prev) prev.items = [...(prev.items ?? []), ...items];
      else lines.push({ text: '', items });
    }
  }
  if (!found) {
    const text = decode(html.replace(/<[^>]+>/g, ''));
    if (text) lines.push({ text });
  }
  return lines;
}

const en = (n: Node) => n.contents?.['en-ca'] ?? '';
const text = (n: Node) => toLines(en(n)).map((l) => l.text).join(' ');

const [dir, grade] = process.argv.slice(2);
if (!dir || !grade) throw new Error('usage: extract-curriculum.ts <dir> <grade>');
const outDir = join('curriculum', `grade-${grade.toLowerCase()}`);
mkdirSync(outDir, { recursive: true });

for (const s of SUBJECTS) {
  const data = JSON.parse(readFileSync(join(dir, s.file), 'utf8'));
  const course = data.courses.find((c: { intendedGradeLevel: string }) => c.intendedGradeLevel === grade);
  const organizingIdeas = (course.curriculums as Node[]).map((oi) => {
    const full = text(oi);
    const [title, ...rest] = full.split(':');
    return {
      code: oi.code,
      title: title.trim(),
      statement: rest.join(':').trim(),
      guidingQuestions: (oi.curriculums ?? []).map((gq) => ({
        code: gq.code,
        question: text(gq),
        outcomes: (gq.curriculums ?? []).map((lo) => ({
          code: lo.code,
          outcome: text(lo),
          kusps: (lo.curriculums ?? []).map((kusp) => {
            const part = (t: string) => toLines(en((kusp.curriculums ?? []).find((c) => c.typeCode === t) ?? ({} as Node)));
            return { knowledge: part('K'), understanding: part('U'), skillsAndProcedures: part('SP') };
          }),
        })),
      })),
    };
  });
  const out = {
    subject: s.name,
    slug: s.slug,
    grade,
    course: course.code,
    source: `https://curriculum.learnalberta.ca/cdn/curriculum/${s.file}`,
    attribution: '© Government of Alberta, Alberta Education. Extracted from New LearnAlberta for alignment reference.',
    implemented: data.frontMatter?.printFooterText?.['en-ca'] ?? null,
    lastModified: course.lastModifiedDate,
    organizingIdeas,
  };
  writeFileSync(join(outDir, `${s.slug}.json`), JSON.stringify(out, null, 2) + '\n');
  const los = organizingIdeas.flatMap((o) => o.guidingQuestions.flatMap((g) => g.outcomes));
  console.log(`${s.slug}: ${organizingIdeas.length} organizing ideas, ${los.length} learning outcomes`);
}
