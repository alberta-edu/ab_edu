// Prints an outcome's curriculum statements with the reference codes used in `covers:`.
// Usage: npm run statements -- <subject> <outcome-code> [grade]
//   npm run statements -- math MAT5-OI1-GQ5-LO1
import { outcomeStatements } from '../src/lib/content.ts';
import type { SubjectSlug } from '../src/site.ts';

const [subject, code, grade = '5'] = process.argv.slice(2);
if (!subject || !code) {
  console.error('usage: npm run statements -- <subject> <outcome-code> [grade]');
  process.exit(1);
}
const list = outcomeStatements(grade, subject as SubjectSlug, code);
console.log(`${code}: ${list[0]?.outcome}\n`);
for (const s of list) {
  console.log(`${s.ref.padEnd(6)} ${s.text}`);
  for (const item of s.items ?? []) console.log(`         - ${item}`);
}
