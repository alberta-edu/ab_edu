// Exact fraction arithmetic. Shared by the content verifier (build time) and the
// answer checker (browser), so it must stay dependency-free.

export interface Rational {
  n: number; // numerator, carries the sign
  d: number; // denominator, always > 0
}

const gcd = (a: number, b: number): number => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
};

export function rat(n: number, d = 1): Rational {
  if (d === 0) throw new Error('Division by zero');
  if (!Number.isInteger(n) || !Number.isInteger(d)) throw new Error(`Not an integer ratio: ${n}/${d}`);
  const s = d < 0 ? -1 : 1;
  const g = gcd(n, d);
  return { n: (s * n) / g, d: (s * d) / g };
}

export const add = (a: Rational, b: Rational) => rat(a.n * b.d + b.n * a.d, a.d * b.d);
export const sub = (a: Rational, b: Rational) => rat(a.n * b.d - b.n * a.d, a.d * b.d);
export const mul = (a: Rational, b: Rational) => rat(a.n * b.n, a.d * b.d);
export const div = (a: Rational, b: Rational) => rat(a.n * b.d, a.d * b.n);
export const eq = (a: Rational, b: Rational) => a.n === b.n && a.d === b.d;
/** Remainder after dividing a by b: a - b × floor(a / b). "x % 3 == 0" reads "x is divisible by 3". */
export const mod = (a: Rational, b: Rational) => {
  const q = div(a, b);
  return sub(a, mul(b, rat(Math.floor(q.n / q.d))));
};
export const toNumber = (r: Rational) => r.n / r.d;

/** Parses "12", "2.375" or "-0.5" exactly. */
export function parseDecimal(s: string): Rational | null {
  const m = /^(-?)(\d*)(?:\.(\d+))?$/.exec(s);
  if (!m || (m[2] === '' && m[3] === undefined)) return null;
  const frac = m[3] ?? '';
  const n = Number((m[2] || '0') + frac);
  return rat(m[1] ? -n : n, 10 ** frac.length);
}

/**
 * Evaluates + - * / % and parentheses with exact fractions. Accepts × and ÷.
 * Used by `verify:` fields in content, e.g. "(3 * 4 + 3) / 4". Names like `w` are read from `vars`.
 */
export function evaluate(expr: string, vars: Record<string, Rational> = {}): Rational {
  const tokens = expr.replace(/×/g, '*').replace(/÷/g, '/').match(/\d+(?:\.\d+)?|\.\d+|[a-zA-Z]\w*|[-+*/%()]/g);
  if (!tokens || tokens.join('') !== expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/\s+/g, '')) {
    throw new Error(`Cannot parse expression: ${expr}`);
  }
  let i = 0;
  const peek = () => tokens[i];
  const next = () => tokens[i++];

  function primary(): Rational {
    const t = next();
    if (t === '(') {
      const v = sum();
      if (next() !== ')') throw new Error(`Missing ) in: ${expr}`);
      return v;
    }
    if (t === '-') return mul(rat(-1), primary());
    if (t !== undefined && /^[a-zA-Z]/.test(t)) {
      if (!(t in vars)) throw new Error(`Unknown name "${t}" in: ${expr}`);
      return vars[t];
    }
    const v = t === undefined ? null : parseDecimal(t);
    if (!v) throw new Error(`Unexpected "${t}" in: ${expr}`);
    return v;
  }
  function product(): Rational {
    let v = primary();
    while (peek() === '*' || peek() === '/' || peek() === '%') {
      const op = next();
      const right = primary();
      v = op === '*' ? mul(v, right) : op === '/' ? div(v, right) : mod(v, right);
    }
    return v;
  }
  function sum(): Rational {
    let v = product();
    while (peek() === '+' || peek() === '-') v = next() === '+' ? add(v, product()) : sub(v, product());
    return v;
  }

  const v = sum();
  if (i !== tokens.length) throw new Error(`Unexpected "${peek()}" in: ${expr}`);
  return v;
}

/**
 * Checks a rule such as "2 * (w + h) == 24 && w != h" with exact arithmetic.
 * Clauses are joined with && and each one compares two expressions.
 */
export function holds(rule: string, vars: Record<string, Rational>): boolean {
  return rule.split('&&').every((clause) => {
    const m = /^(.+?)(==|!=|<=|>=|<|>)(.+)$/.exec(clause.trim());
    if (!m) throw new Error(`A rule needs a comparison: ${clause}`);
    const diff = sub(evaluate(m[1], vars), evaluate(m[3], vars)).n;
    switch (m[2]) {
      case '==':
        return diff === 0;
      case '!=':
        return diff !== 0;
      case '<':
        return diff < 0;
      case '>':
        return diff > 0;
      case '<=':
        return diff <= 0;
      default:
        return diff >= 0;
    }
  });
}

export type FractionForm = 'whole' | 'proper' | 'improper' | 'mixed' | 'decimal';

/**
 * Reads what a student typed as a fraction answer: "11/4", "2 3/4", "3" or "2.75".
 * Returns the value and the form it was written in.
 */
export function parseFractionInput(raw: string): { value: Rational; form: FractionForm } | null {
  const s = raw.trim().replace(/\s+/g, ' ').replace(/[⁄∕]/g, '/');
  let m: RegExpExecArray | null;
  if ((m = /^(\d+) (\d+) ?\/ ?(\d+)$/.exec(s))) {
    const [w, n, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
    if (d === 0 || n >= d) return null; // "1 7/4" is not a mixed number
    return { value: rat(w * d + n, d), form: 'mixed' };
  }
  if ((m = /^(\d+) ?\/ ?(\d+)$/.exec(s))) {
    const [n, d] = [Number(m[1]), Number(m[2])];
    if (d === 0) return null;
    return { value: rat(n, d), form: n >= d ? 'improper' : 'proper' };
  }
  if (/^\d+$/.test(s)) return { value: rat(Number(s)), form: 'whole' };
  const dec = parseDecimal(s);
  return dec ? { value: dec, form: 'decimal' } : null;
}

/** Parses the `answer` field of a fraction problem ("11/4", "2 3/4", "3"). */
export function parseFractionAnswer(s: string): Rational {
  const parsed = parseFractionInput(s);
  if (!parsed) throw new Error(`Bad fraction answer: ${s}`);
  return parsed.value;
}
