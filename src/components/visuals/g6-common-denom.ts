// Adding and subtracting fractions with different denominators, Grade 6 (eVwjDHYcXUuWmBMwi-XVjg):
// split the pieces until both fractions use the same unit, then add or take away. Pure functions
// for the common-denominators visual and the tests.

export interface Frac {
  n: number;
  d: number;
}

export const parse = (s: string): Frac => {
  const m = /^(\d+)\/(\d+)$/.exec(s.trim());
  if (!m) throw new Error(`Bad fraction ${s}`);
  return { n: Number(m[1]), d: Number(m[2]) };
};

export interface Plan {
  /** One denominator is a multiple of the other. */
  related: boolean;
  /** What each fraction is multiplied by (top and bottom). */
  fa: number;
  fb: number;
  /** The common denominator. */
  D: number;
}

/** Related denominators use the bigger one; otherwise their product (K1.2-K1.4). */
export function plan(a: Frac, b: Frac): Plan {
  if (a.d === b.d) return { related: true, fa: 1, fb: 1, D: a.d };
  if (b.d % a.d === 0) return { related: true, fa: b.d / a.d, fb: 1, D: b.d };
  if (a.d % b.d === 0) return { related: true, fa: 1, fb: a.d / b.d, D: a.d };
  return { related: false, fa: b.d, fb: a.d, D: a.d * b.d };
}

export interface BarRow {
  n: number;
  d: number;
  label: string;
  /** 'a', 'b' or 'sum': picks the colour. */
  tone: 'a' | 'b' | 'sum';
}

export interface Step {
  rows: BarRow[];
  caption: string;
}

const f = (x: Frac) => `${x.n}/${x.d}`;

const UNITS: Record<number, string> = { 2: 'halves', 3: 'thirds', 4: 'fourths', 5: 'fifths', 6: 'sixths', 7: 'sevenths', 8: 'eighths', 9: 'ninths', 10: 'tenths', 12: 'twelfths', 15: 'fifteenths', 16: 'sixteenths', 18: 'eighteenths', 20: 'twentieths', 24: 'twenty-fourths', 30: 'thirtieths', 100: 'hundredths' };
/** "sixths", or "pieces of 1/14" for a denominator without a common name. */
export const units = (d: number) => UNITS[d] ?? `pieces of 1/${d}`;

export function steps(aStr: string, op: '+' | '−', bStr: string): Step[] {
  const a = parse(aStr);
  const b = parse(bStr);
  const p = plan(a, b);
  const A = { n: a.n * p.fa, d: p.D };
  const B = { n: b.n * p.fb, d: p.D };
  const R = { n: op === '+' ? A.n + B.n : A.n - B.n, d: p.D };
  if (R.n < 0) throw new Error('Result below zero');
  const out: Step[] = [];
  out.push({
    rows: [{ ...a, label: f(a), tone: 'a' }, { ...b, label: f(b), tone: 'b' }],
    caption: a.d === b.d ? `Both fractions already count the same unit: ${units(p.D)}.` : `${f(a)} ${op} ${f(b)}: the pieces are different sizes, so you can’t just count them. Make the units the same first.`,
  });
  if (a.d !== b.d) {
    const how = p.related
      ? `${Math.max(a.d, b.d)} is a multiple of ${Math.min(a.d, b.d)}, so the denominators are related. ${Math.min(a.d, b.d)} × ${Math.max(p.fa, p.fb)} = ${p.D}.`
      : `${a.d} and ${b.d} are not related, so multiply them: ${a.d} × ${b.d} = ${p.D}.`;
    const changes = [p.fa > 1 ? `${f(a)} = ${A.n}/${A.d}` : '', p.fb > 1 ? `${f(b)} = ${B.n}/${B.d}` : ''].filter(Boolean).join(' and ');
    out.push({
      rows: [{ ...A, label: `${f(a)} = ${f(A)}`, tone: 'a' }, { ...B, label: p.fb > 1 ? `${f(b)} = ${f(B)}` : f(b), tone: 'b' }],
      caption: `${how} Split the pieces: ${changes}. The amounts haven’t changed, only the size of the pieces.`,
    });
  }
  out.push({
    rows: [{ ...A, label: f(A), tone: 'a' }, { ...B, label: f(B), tone: 'b' }, { ...R, label: f(R), tone: 'sum' }],
    caption: `Now both count ${units(p.D)}, so ${op === '+' ? 'add' : 'subtract'} the numerators: ${A.n} ${op} ${B.n} = ${R.n}. So ${f(a)} ${op} ${f(b)} = ${f(R)}.`,
  });
  return out;
}

const TONE = { a: 'var(--accent)', b: 'var(--sun)', sum: 'var(--ok)' };

/** Bars of one whole each (two bars for an amount over 1), split into d pieces with n shaded. */
export function barsSvg(rows: BarRow[]): string {
  const W = 360;
  const H = 50;
  const x0 = 130;
  let y = 8;
  let s = '';
  for (const r of rows) {
    const wholes = Math.max(1, Math.ceil(r.n / r.d));
    s += `<text class="g6m-cd-label" x="${x0 - 12}" y="${y + 33}" text-anchor="end">${r.label}</text>`;
    for (let w = 0; w < wholes; w++) {
      const cell = W / r.d;
      for (let i = 0; i < r.d; i++) {
        const on = w * r.d + i < r.n;
        s += `<rect x="${(x0 + i * cell).toFixed(2)}" y="${y}" width="${cell.toFixed(2)}" height="${H}" class="g6m-cd-cell" style="${on ? `fill:${TONE[r.tone]}` : ''}"/>`;
      }
      s += `<rect x="${x0}" y="${y}" width="${W}" height="${H}" class="g6m-cd-bar"/>`;
      y += H + 6;
    }
    y += 12;
  }
  return `<svg viewBox="0 0 ${x0 + W + 6} ${y}" role="img" aria-label="Fraction bars: ${rows.map((r) => r.label).join(', ')}.">${s}</svg>`;
}
