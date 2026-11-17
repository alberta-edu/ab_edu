// Grade 6 standard algorithms with decimals (MAT6-OI1-GQ4-LO1): a decimal times a 2-digit natural
// number, and long division by a 2-digit natural number that keeps going past the decimal point
// so a remainder becomes decimal places. Builds the same frames as column-calc.ts, so the
// column-calc visual shows them.
import { multiplyFrames, type Cell, type CellKind, type Frame } from './column-calc.ts';

const blank = (): Cell => ({ ch: '', kind: 'blank' });
const clone = (rows: Cell[][]) => rows.map((r) => r.map((c) => ({ ...c })));
const clean = (s: string) => s.replace(/[\s  ,]/g, '');
const decimals = (s: string) => (clean(s).split('.')[1] ?? '').length;

/** Rounds to a friendly estimate: one significant digit, or the nearest whole for small numbers. */
export function roughly(x: number): number {
  if (x < 10) return Math.round(x) || 1;
  const p = 10 ** Math.floor(Math.log10(x));
  return Math.round(x / p) * p;
}

/** Writes a number with a decimal point but no float noise: 57, 7.1, 31.25. */
export const fmt = (x: number, places = 3) => String(Number(x.toFixed(places)));

function row(s: string, W: number, kind: CellKind = 'digit', op = ''): Cell[] {
  const r = Array.from({ length: W }, blank);
  for (let i = 0; i < s.length; i++) r[W - s.length + i] = { ch: s[i], kind: s[i] === '.' ? 'point' : kind };
  if (op) r[W - s.length - 1] = { ch: op, kind: 'op' };
  return r;
}

/** A decimal (up to 3 digits) times a 2-digit natural number: multiply without the point, then place it. */
export function decimalMultiplyFrames(aStr: string, bStr: string): Frame[] {
  const a = clean(aStr);
  const b = clean(bStr);
  const places = decimals(a);
  const whole = a.replace('.', '').replace(/^0+(?=\d)/, '');
  const exact = (Number(whole) * Number(b)) / 10 ** places;
  const est = roughly(Number(a)) * Number(b);
  const W0 = Math.max(a.length, b.length + 1) + 1;
  const first: Frame = { rows: [row('', W0), row(a, W0), row(b, W0, 'digit', '×')], rules: [3], caption: `Estimate first: ${a} is about ${roughly(Number(a))}, and ${roughly(Number(a))} × ${b} = ${est}. The answer should be close to ${est}.` };
  if (!places) return [first, ...multiplyFrames(a, b)];
  const inner = multiplyFrames(whole, b);
  inner[0] = { ...inner[0], caption: `Multiply as if there were no decimal point: ${whole} × ${b}. ${a} is ${whole} ${places === 1 ? 'tenths' : places === 2 ? 'hundredths' : 'thousandths'}.` };
  const productDigits = String(Number(whole) * Number(b)).padStart(places + 1, '0');
  const withPoint = `${productDigits.slice(0, -places)}.${productDigits.slice(-places)}`;
  const W = Math.max(withPoint.length, a.length, b.length + 1) + 1;
  const last: Frame = {
    rows: [row('', W), row(a, W), row(b, W, 'digit', '×'), row(withPoint, W, 'new')],
    rules: [3],
    caption: `${whole} ${places === 1 ? 'tenths' : places === 2 ? 'hundredths' : 'thousandths'} × ${b} = ${productDigits.replace(/^0+(?=\d)/, '')} ${places === 1 ? 'tenths' : places === 2 ? 'hundredths' : 'thousandths'}, so put ${places} decimal place${places === 1 ? '' : 's'} back: ${withPoint}. That is ${fmt(exact)}, close to the estimate of ${est}.`,
  };
  return [first, ...inner, last];
}

/**
 * Long division of a whole or decimal number by a natural number (2 digits at most here). When
 * the digits run out and something is left, write a 0 after the decimal point and keep going,
 * up to `maxPlaces` decimal places.
 */
export function decimalDivideFrames(dividendStr: string, divisorStr: string, maxPlaces = 3): Frame[] {
  const dividend = clean(dividendStr);
  const d = Number(clean(divisorStr));
  if (!Number.isInteger(d) || d <= 0) throw new Error('Divide by a natural number');
  // Work out how far the division goes, so the grid is wide enough from the start.
  const chars = [...dividend];
  const hasPoint = chars.includes('.');
  {
    let rem = 0;
    for (const c of chars) if (c !== '.') rem = (rem * 10 + Number(c)) % d;
    let added = 0;
    let placesNow = hasPoint ? dividend.split('.')[1].length : 0;
    if (rem && !hasPoint) chars.push('.');
    while (rem && placesNow < maxPlaces) {
      chars.push('0');
      added++;
      placesNow++;
      rem = (rem * 10) % d;
    }
    void added;
  }
  const ds = String(d);
  const k = ds.length;
  const off = k + 1;
  const W = off + chars.length;
  const R = 2 + chars.length * 2;
  const rows: Cell[][] = Array.from({ length: R }, () => Array.from({ length: W }, blank));
  for (let i = 0; i < k; i++) rows[1][i] = { ch: ds[i], kind: 'digit' };
  const shownLen = dividend.length;
  for (let i = 0; i < shownLen; i++) rows[1][off + i] = { ch: chars[i], kind: chars[i] === '.' ? 'point' : 'digit' };
  const frames: Frame[] = [];
  const push = (caption: string) => frames.push({ rows: clone(rows), rules: [], caption, bracketAt: k });
  const value = Number(dividend);
  // Estimate with a compatible number: the nearest multiple of the divisor.
  const near = Math.max(1, Math.round(value / d)) * d;
  push(`Divide ${dividend} by ${d}. Estimate first: ${dividend} is close to ${near}, and ${near} ÷ ${d} = ${near / d}.`);

  let rem = 0;
  let r = 2;
  let started = false;
  let lastDigitCol = -1;
  for (let i = 0; i < chars.length; i++) {
    const c = off + i;
    if (chars[i] === '.') {
      if (i >= shownLen) {
        rows[1][c] = { ch: '.', kind: 'new' };
      }
      let zero = '';
      if (!started) {
        // Nothing written yet: the whole-number part of the answer is 0.
        rows[0][c - 1] = { ch: '0', kind: 'new' };
        started = true;
        zero = `${d} doesn’t go into ${rem}, so the answer has 0 ones. `;
      }
      rows[0][c] = { ch: '.', kind: 'new' };
      push(i >= shownLen ? `${rem} is left, so write a decimal point and keep going. The point goes straight up into the answer.` : `${zero}The decimal point goes straight up into the answer.`);
      rows[0][c] = { ch: '.', kind: 'point' };
      if (rows[1][c].kind === 'new') rows[1][c] = { ch: '.', kind: 'point' };
      continue;
    }
    if (i >= shownLen) {
      rows[1][c] = { ch: '0', kind: 'new' };
      if (lastDigitCol >= 0) rows[r - 1][c] = { ch: '0', kind: 'new' };
      push(`${rem} is left. Write a 0 in the next decimal place and bring it down to make ${rem * 10}.`);
      rows[1][c] = { ch: '0', kind: 'digit' };
      if (lastDigitCol >= 0) rows[r - 1][c] = { ch: '0', kind: 'digit' };
    }
    const cur = rem * 10 + Number(chars[i]);
    const q = Math.floor(cur / d);
    if (!started && q === 0) {
      rem = cur;
      continue;
    }
    started = true;
    rows[0][c] = { ch: String(q), kind: 'new' };
    const sub = q * d;
    const width = String(cur).length;
    const sw = String(sub).padStart(width, ' ');
    // Columns of the current number: skip the point column when writing under it.
    const cols: number[] = [];
    for (let x = c; cols.length < width && x >= off; x--) if (chars[x - off] !== '.') cols.unshift(x);
    for (let t = 0; t < width; t++) if (sw[t] !== ' ') rows[r][cols[t]] = { ch: sw[t], kind: 'new' };
    rows[r][cols[0] - 1] = rows[r][cols[0] - 1].ch ? rows[r][cols[0] - 1] : { ch: '−', kind: 'op' };
    const left = cur - sub;
    const ls = String(left);
    const remCols: number[] = [];
    for (let x = c; remCols.length < ls.length; x--) if (x < off || chars[x - off] !== '.') remCols.unshift(x);
    for (let t = 0; t < ls.length; t++) rows[r + 1][remCols[t]] = { ch: ls[t], kind: 'new' };
    for (let x = cols[0]; x <= cols[cols.length - 1]; x++) rows[r + 1][x] = { ...rows[r + 1][x], ruleTop: true };
    push(`${d} goes into ${cur} ${q} time${q === 1 ? '' : 's'}: ${q} × ${d} = ${sub}. Subtract: ${cur} − ${sub} = ${left}.`);
    for (const rr of [0, r, r + 1]) for (let x = 0; x < W; x++) if (rows[rr][x].kind === 'new') rows[rr][x] = { ...rows[rr][x], kind: 'digit' };
    rem = left;
    lastDigitCol = c;
    r += 2;
    // Bring down the next digit that is already in the dividend (skipping the point).
    let nx = i + 1;
    while (nx < shownLen && chars[nx] === '.') nx++;
    if (nx < shownLen) {
      rows[r - 1][off + nx] = { ch: chars[nx], kind: 'new' };
      push(`Bring down the next digit, ${chars[nx]}, to make ${rem * 10 + Number(chars[nx])}.`);
      rows[r - 1][off + nx] = { ch: chars[nx], kind: 'digit' };
    }
  }
  const quotient = rows[0].map((x) => x.ch).join('');
  if (rem) push(`Stop at ${maxPlaces} decimal places: ${dividend} ÷ ${d} is about ${quotient}.`);
  else push(`Nothing is left. ${dividend} ÷ ${d} = ${quotient}. Compare it with the estimate.`);
  return frames.map((f) => ({ ...f, rows: f.rows.filter((rw, i) => i <= 1 || rw.some((x) => x.kind !== 'blank' || x.ruleTop)) }));
}

/** The answer written in the last frame's top row, for tests. */
export const quotientOf = (fs: Frame[]) => fs.at(-1)!.rows[0].map((c) => c.ch).join('');
