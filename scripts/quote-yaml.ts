// Quotes plain YAML values that contain ": " (YAML would read them as a nested mapping).
// Only touches unquoted values and list items whose text is clearly prose, never keys.
// Usage: node scripts/quote-yaml.ts content/grade-5/math/*.yaml
import { readFileSync, writeFileSync } from 'node:fs';

const STARTS_SPECIAL = /^['"|>\[{&*!%@`#]/;
const quote = (v: string) => `'${v.replace(/'/g, "''")}'`;

for (const file of process.argv.slice(2)) {
  const lines = readFileSync(file, 'utf8').split('\n');
  let changed = 0;
  let inBlock = -1; // indentation of an active block scalar (| or >)
  const out = lines.map((line) => {
    const indent = line.length - line.trimStart().length;
    if (inBlock >= 0) {
      if (line.trim() === '' || indent > inBlock) return line;
      inBlock = -1;
    }
    let m = /^(\s*(?:- )?)([A-Za-z0-9_-]+|'[^']*'): (.*)$/.exec(line);
    if (m) {
      const value = m[3].trimEnd();
      if (/^[|>][-+]?$/.test(value)) {
        inBlock = indent;
        return line;
      }
      if (value && !STARTS_SPECIAL.test(value) && value.includes(': ')) {
        changed++;
        return `${m[1]}${m[2]}: ${quote(value)}`;
      }
      return line;
    }
    m = /^(\s*- )(.*)$/.exec(line);
    if (m) {
      const value = m[2].trimEnd();
      if (value && !STARTS_SPECIAL.test(value) && value.includes(': ')) {
        changed++;
        return `${m[1]}${quote(value)}`;
      }
    }
    return line;
  });
  if (changed) writeFileSync(file, out.join('\n'));
  console.log(`${file}: ${changed} quoted`);
}
