// Evaluates a numerical expression one operation at a time, following the conventional
// order of operations: innermost parentheses first; inside any group, × and ÷ from left to
// right, then + and − from left to right (MAT5-OI2-GQ1-LO1: K1.1, K1.2, U1.2, S1.1).

export type Token = { t: 'num'; v: number } | { t: 'op'; v: '+' | '−' | '×' | '÷' | '^' } | { t: 'paren'; v: '(' | ')' };

const SUP: Record<string, string> = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
/** Grade 6 powers: "2^3" written as 2³ for buttons and captions. */
export const pretty = (src: string) => src.replace(/\*/g, '×').replace(/\s*\^\s*(\d+)/g, (_, e: string) => [...e].map((d) => SUP[d]).join(''));

export interface Step {
  tokens: Token[];
  /** Indexes of the tokens about to be replaced (highlighted). */
  focus: number[];
  caption: string;
}

export function tokenize(src: string): Token[] {
  const out: Token[] = [];
  const s = src.replace(/\*/g, '×').replace(/\//g, '÷').replace(/-/g, '−');
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === ' ') i++;
    else if (/\d/.test(c)) {
      let j = i;
      while (j < s.length && /[\d.]/.test(s[j])) j++;
      out.push({ t: 'num', v: Number(s.slice(i, j)) });
      i = j;
    } else if ('+−×÷^'.includes(c)) {
      out.push({ t: 'op', v: c as '+' });
      i++;
    } else if ('()'.includes(c)) {
      out.push({ t: 'paren', v: c as '(' });
      i++;
    } else throw new Error(`Unexpected "${c}" in ${src}`);
  }
  return out;
}

const apply = (a: number, op: string, b: number) => {
  if (op === '+') return a + b;
  if (op === '−') return a - b;
  if (op === '×') return a * b;
  if (op === '^') return a ** b;
  if (b === 0) throw new Error('Division by zero');
  return a / b;
};
const NAME: Record<string, string> = { '+': 'Add', '−': 'Subtract', '×': 'Multiply', '÷': 'Divide', '^': 'Evaluate the power' };

export const show = (tokens: Token[]) =>
  tokens.map((k) => (k.t === 'num' ? String(k.v) : k.v)).join(' ').replace(/\( /g, '(').replace(/ \)/g, ')');

export function evaluateSteps(src: string): Step[] {
  let tokens = tokenize(src);
  const steps: Step[] = [];
  for (let guard = 0; guard < 50; guard++) {
    if (tokens.length === 1) break;
    // Innermost group: the last "(" before the first ")".
    const close = tokens.findIndex((k) => k.t === 'paren' && k.v === ')');
    let lo = 0;
    let hi = tokens.length - 1;
    if (close >= 0) {
      let open = close;
      while (!(tokens[open].t === 'paren' && tokens[open].v === '(')) open--;
      if (close - open === 2) {
        // "( n )" → n
        steps.push({ tokens, focus: [open, close], caption: 'The parentheses hold just one number now, so remove them.' });
        tokens = [...tokens.slice(0, open), tokens[open + 1], ...tokens.slice(close + 1)];
        continue;
      }
      lo = open + 1;
      hi = close - 1;
    }
    const inGroup = close >= 0;
    let k = -1;
    // Grade 6: powers come after parentheses and before × and ÷.
    for (let i = lo; i <= hi; i++) if (tokens[i].t === 'op' && tokens[i].v === '^') { k = i; break; }
    if (k < 0) for (let i = lo; i <= hi; i++) if (tokens[i].t === 'op' && (tokens[i].v === '×' || tokens[i].v === '÷')) { k = i; break; }
    if (k < 0) for (let i = lo; i <= hi; i++) if (tokens[i].t === 'op') { k = i; break; }
    if (k < 0) throw new Error(`Cannot evaluate ${src}`);
    const a = (tokens[k - 1] as { v: number }).v;
    const op = tokens[k].v as string;
    const b = (tokens[k + 1] as { v: number }).v;
    const r = apply(a, op, b);
    const why = inGroup
      ? 'Parentheses first'
      : op === '^'
        ? 'Powers next, before multiplying, dividing, adding and subtracting'
        : op === '×' || op === '÷'
        ? 'Multiply and divide before adding and subtracting, from left to right'
        : 'Add and subtract from left to right';
    const work = op === '^' ? `${pretty(`${a}^${b}`)} = ${Array(b).fill(a).join(' × ')} = ${r}` : `${a} ${op} ${b} = ${r}`;
    steps.push({ tokens, focus: [k - 1, k, k + 1], caption: `${why}. ${NAME[op]}: ${work}.` });
    tokens = [...tokens.slice(0, k - 1), { t: 'num', v: r }, ...tokens.slice(k + 2)];
  }
  steps.push({ tokens, focus: [0], caption: `The expression ${pretty(src)} has the value ${(tokens[0] as { v: number }).v}.` });
  return steps;
}

export function stepHtml(step: Step, fresh: number[] = []): string {
  return step.tokens
    .map((k, i) => {
      const cls = ['es-tok', `es-${k.t}`];
      if (step.focus.includes(i) && step.tokens.length > 1) cls.push('es-focus');
      if (fresh.includes(i)) cls.push('es-new');
      // Powers: hide the ^ and raise the exponent.
      if (k.t === 'op' && k.v === '^') return `<span class="${cls.join(' ')}" style="padding:0"></span>`;
      const prev = step.tokens[i - 1];
      if (k.t === 'num' && prev?.t === 'op' && prev.v === '^') return `<span class="${cls.join(' ')}" style="font-size:0.6em;align-self:flex-start;margin-left:-0.45em">${k.v}</span>`;
      return `<span class="${cls.join(' ')}">${k.t === 'num' ? k.v : k.v}</span>`;
    })
    .join('');
}
