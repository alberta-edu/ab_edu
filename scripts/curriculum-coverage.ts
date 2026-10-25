// Prints which Grade 5 learning outcomes have content (npm run coverage).
import { allOutcomes, loadConcepts, roadmap } from '../src/lib/content.ts';
import { SUBJECTS } from '../src/site.ts';

const concepts = loadConcepts(5);
const plan = roadmap(5);
let covered = 0;
let total = 0;

for (const s of SUBJECTS) {
  console.log(`\n${s.name}`);
  for (const o of allOutcomes(5, s.slug)) {
    total++;
    const built = concepts.filter((c) => c.subject === s.slug && c.outcomes.includes(o.code));
    const planned = plan[s.slug].filter((p) => p.outcomes.includes(o.code));
    if (built.length) covered++;
    const mark = built.length ? '✓' : planned.length ? '·' : '✗';
    console.log(`  ${mark} ${o.organizingIdea.title}: ${o.outcome}`);
    for (const p of planned) {
      console.log(`      ${built.some((b) => b.id === p.id) ? '[built]' : '[ ... ]'} ${p.title}`);
    }
    if (!planned.length) console.log('      (no concept planned!)');
  }
}
const builtCount = concepts.length;
const plannedCount = Object.values(plan).flat().length;
console.log(`\nOutcomes with content: ${covered}/${total}. Concepts built: ${builtCount}/${plannedCount}.`);
