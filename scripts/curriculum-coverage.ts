// Prints which learning outcomes have content (npm run coverage). With no argument, every grade
// with a roadmap; `npm run coverage -- grade-6` or `-- grade-6/math` narrows it.
import { allOutcomes, loadConcepts, roadmap } from '../src/lib/content.ts';
import { GRADES, SUBJECTS } from '../src/site.ts';

const arg = /^grade-(\d)(?:\/([a-z-]+))?$/.exec(process.argv[2] ?? '');
const grades = arg ? [Number(arg[1])] : GRADES.filter((g) => Object.values(roadmap(g)).some((list) => list.length));
let covered = 0;
let total = 0;
let builtCount = 0;
let plannedCount = 0;

for (const grade of grades) {
  const concepts = loadConcepts(grade);
  const plan = roadmap(grade);
  for (const s of SUBJECTS.filter((x) => !arg?.[2] || x.slug === arg[2])) {
    console.log(`\nGrade ${grade} ${s.name}`);
    for (const o of allOutcomes(grade, s.slug)) {
      total++;
      const built = concepts.filter((c) => c.subject === s.slug && c.outcomes.includes(o.code));
      const planned = plan[s.slug].filter((p) => p.outcomes.includes(o.code));
      if (built.length) covered++;
      const mark = built.length ? '✓' : planned.length ? '·' : '✗';
      console.log(`  ${mark} ${o.organizingIdea.title}: ${o.outcome}`);
      for (const p of planned) console.log(`      ${built.some((b) => b.id === p.id) ? '[built]' : '[ ... ]'} ${p.title}`);
      if (!planned.length) console.log('      (no concept planned!)');
    }
    builtCount += concepts.filter((c) => c.subject === s.slug).length;
    plannedCount += plan[s.slug].length;
  }
}
console.log(`\nOutcomes with content: ${covered}/${total}. Concepts built: ${builtCount}/${plannedCount}.`);
