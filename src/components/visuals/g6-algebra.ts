// Like terms with algebra tiles, Grade 6 (MAT6-OI2-GQ1-LO1, K2.1-K2.5, S2.1-S2.3): sort the terms
// by kind (commutative property), combine like terms, and expand a(b + c) (distributive property).
// Pure functions for the algebra-tiles visual and the tests.

export interface Term {
  /** Signed coefficient: −2 means "− 2x" was written. */
  c: number;
  /** '' for a constant term. */
  v: string;
}

/** "2x + 3 − x + 1" or "3(x + 2)". */
export interface Parsed {
  terms: Term[];
  /** For a(b + c): the multiplier and the bracket's terms. */
  times?: number;
}

export function parseTerms(src: string): Term[] {
  const s = src.replace(/\s+/g, '').replace(/−/g, '-');
  const out: Term[] = [];
  for (const m of s.matchAll(/([+-]?)(\d*)([a-z]?)/g)) {
    if (!m[0]) continue;
    const sign = m[1] === '-' ? -1 : 1;
    if (!m[2] && !m[3]) throw new Error(`Bad term in ${src}`);
    out.push({ c: sign * (m[2] ? Number(m[2]) : 1), v: m[3] });
  }
  return out;
}

export function parse(src: string): Parsed {
  const m = /^\s*(\d+)\s*\((.+)\)\s*$/.exec(src);
  if (m) return { times: Number(m[1]), terms: parseTerms(m[2]) };
  return { terms: parseTerms(src) };
}

/** "2x + 3 − x", with a real minus sign and no "1x". */
export function text(terms: Term[]): string {
  if (!terms.length) return '0';
  return terms
    .map((t, i) => {
      const mag = Math.abs(t.c);
      const body = t.v ? `${mag === 1 ? '' : mag}${t.v}` : String(mag);
      if (i === 0) return t.c < 0 ? `−${body}` : body;
      return `${t.c < 0 ? '−' : '+'} ${body}`;
    })
    .join(' ');
}

const kindOrder = (v: string) => (v ? v.charCodeAt(0) : 1000);

/** Like terms side by side, variables in alphabetical order, constants last. Order within a kind is kept. */
export const sortTerms = (terms: Term[]) => [...terms].sort((a, b) => kindOrder(a.v) - kindOrder(b.v));

/** Combine like terms: one term per variable, then the constant. Zero terms vanish. */
export function combine(terms: Term[]): Term[] {
  const sums = new Map<string, number>();
  for (const t of sortTerms(terms)) sums.set(t.v, (sums.get(t.v) ?? 0) + t.c);
  return [...sums].filter(([, c]) => c !== 0).map(([v, c]) => ({ v, c }));
}

export interface TileStep {
  /** Groups of tiles; a plain expression is one group, a(b + c) starts as `times` groups. */
  groups: Term[][];
  expr: string;
  caption: string;
}

export function tileSteps(src: string): TileStep[] {
  const p = parse(src);
  const steps: TileStep[] = [];
  if (p.times) {
    const inner = p.terms;
    steps.push({ groups: Array.from({ length: p.times }, () => inner), expr: `${p.times}(${text(inner)})`, caption: `${p.times}(${text(inner)}) means ${p.times} groups of ${text(inner)}.` });
    const expanded = inner.map((t) => ({ ...t, c: t.c * p.times! }));
    steps.push({
      groups: [sortTerms(Array.from({ length: p.times }, () => inner).flat())],
      expr: text(expanded),
      caption: `Gather the like tiles from every group. Each term inside is multiplied by ${p.times}: ${inner.map((t) => `${p.times} × ${text([{ ...t, c: Math.abs(t.c) }])}`).join(' and ')}. This is the distributive property.`,
    });
    steps.push({ groups: [combine(expanded)], expr: text(combine(expanded)), caption: `${p.times}(${text(inner)}) = ${text(combine(expanded))}.` });
    return steps;
  }
  const terms = p.terms;
  steps.push({ groups: [terms], expr: text(terms), caption: `${text(terms)} has ${terms.length} terms. Which ones are alike?` });
  const sorted = sortTerms(terms);
  if (text(sorted) !== text(terms)) steps.push({ groups: [sorted], expr: text(sorted), caption: `Move like terms next to each other. Changing the order of terms you add doesn’t change the value: ${text(sorted)}.` });
  const done = combine(terms);
  const kinds = [...new Set(terms.map((t) => t.v))].map((v) => (v ? `the ${v} terms` : 'the constants'));
  steps.push({ groups: [done], expr: text(done), caption: `Combine like terms: ${kinds.join(', ')}. Terms with different variables, or a variable and a constant, can’t be combined. So ${text(terms)} = ${text(done)}.` });
  return steps;
}
