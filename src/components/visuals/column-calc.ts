// Step-by-step standard algorithms: addition and subtraction (with decimals), multiplication
// (up to 3-digit × 2-digit) and long division (3-digit ÷ 1-digit). Each algorithm becomes a
// list of frames; a frame is a grid of cells plus a one-line caption. Pure functions, so
// the steps are unit tested and the same code renders at build time and in the browser.

export type CellKind = 'digit' | 'pad' | 'carry' | 'op' | 'point' | 'hl' | 'new' | 'cross' | 'dim' | 'blank';
export interface Cell {
  ch: string;
  kind: CellKind;
  /** Small text written above the digit (a borrowed value). */
  above?: string;
  /** Draw a rule line above just this cell (long division subtractions). */
  ruleTop?: boolean;
}
export interface Frame {
  rows: Cell[][];
  /** Row indexes that get a rule line above them. */
  rules: number[];
  caption: string;
  /** Column index of the division bracket, if any. */
  bracketAt?: number;
}

const blank = (): Cell => ({ ch: '', kind: 'blank' });
const clone = (rows: Cell[][]) => rows.map((r) => r.map((c) => ({ ...c })));
const PLACE = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions'];
const DEC = ['tenths', 'hundredths', 'thousandths'];
/** Name of a place: k = 0 ones, 1 tens…; negative k = tenths, hundredths… */
export const placeName = (k: number) => (k >= 0 ? PLACE[k] : DEC[-k - 1]);

function parse(s: string) {
  const t = s.replace(/[\s  ,]/g, '');
  const [int, dec = ''] = t.split('.');
  return { int, dec };
}

export function formatNumber(int: string, dec: string): string {
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return dec ? `${grouped}.${dec}` : grouped;
}

// ---------------------------------------------------------------- addition / subtraction

export function addSubFrames(op: '+' | '-', aStr: string, bStr: string): Frame[] {
  const a = parse(aStr);
  const b = parse(bStr);
  const decs = Math.max(a.dec.length, b.dec.length);
  const ints = Math.max(a.int.length, b.int.length) + (op === '+' ? 1 : 0);
  // place index per column: [ints-1 … 0, (point), -1 … -decs]
  const places: (number | 'point')[] = [];
  for (let k = ints - 1; k >= 0; k--) places.push(k);
  if (decs) {
    places.push('point');
    for (let k = -1; k >= -decs; k--) places.push(k);
  }
  const W = places.length + 1; // +1 for the operator column
  const digitAt = (n: { int: string; dec: string }, k: number): string | null => {
    if (k >= 0) return k < n.int.length ? n.int[n.int.length - 1 - k] : null;
    return -k <= n.dec.length ? n.dec[-k - 1] : null;
  };
  const col = (p: number | 'point') => places.indexOf(p) + 1;

  // rows: 0 = carries/borrows, 1 = a, 2 = b, 3 = answer
  const rows: Cell[][] = Array.from({ length: 4 }, () => Array.from({ length: W }, blank));
  rows[2][0] = { ch: op === '+' ? '+' : '−', kind: 'op' };
  for (const r of [1, 2]) {
    const n = r === 1 ? a : b;
    for (const p of places) {
      if (p === 'point') {
        rows[r][col(p)] = { ch: '.', kind: 'point' };
        continue;
      }
      const d = digitAt(n, p);
      if (d !== null) rows[r][col(p)] = { ch: d, kind: 'digit' };
      else if (p < 0) rows[r][col(p)] = { ch: '0', kind: 'pad' };
    }
  }
  const frames: Frame[] = [];
  const push = (caption: string) => frames.push({ rows: clone(rows), rules: [3], caption });
  push(
    decs && (a.dec.length !== b.dec.length)
      ? 'Line up the decimal points. Fill empty decimal places with 0: it doesn’t change the value.'
      : decs
        ? 'Line up the decimal points, so each digit sits under a digit of the same place value.'
        : 'Line up the digits by place value: ones under ones, tens under tens.',
  );

  // working values (top number may change when borrowing)
  const top: number[] = [];
  const bot: number[] = [];
  const ks = places.filter((p): p is number => p !== 'point');
  for (const k of ks) {
    top[k + decs] = Number(digitAt(a, k) ?? 0);
    bot[k + decs] = Number(digitAt(b, k) ?? 0);
  }
  const lowest = -decs;
  let carry = 0;
  const lastAnswerCol = (() => {
    // most significant non-zero place of the answer, to avoid writing leading zeros
    const value = (n: { int: string; dec: string }) => Number(`${n.int || '0'}.${n.dec || '0'}`);
    const res = op === '+' ? value(a) + value(b) : value(a) - value(b);
    return Math.max(0, Math.floor(Math.log10(Math.max(Math.abs(res), 1))));
  })();

  for (let k = lowest; k < ints; k++) {
    const i = k + decs;
    const c = col(k);
    const hl = () => {
      for (const r of [1, 2]) if (rows[r][c].kind !== 'blank') rows[r][c] = { ...rows[r][c], kind: rows[r][c].kind === 'cross' ? 'cross' : 'hl' };
    };
    const unhl = () => {
      for (const r of [1, 2]) if (rows[r][c].kind === 'hl') rows[r][c] = { ...rows[r][c], kind: 'digit' };
    };
    if (op === '+') {
      const s = top[i] + bot[i] + carry;
      if (k > lastAnswerCol && s === 0) break;
      hl();
      rows[3][c] = { ch: String(s % 10), kind: 'new' };
      const parts = [top[i], bot[i]].concat(carry ? [carry] : []);
      let caption = `${cap(placeName(k))}: ${parts.join(' + ')} = ${s}.`;
      if (s >= 10) {
        caption += ` Write ${s % 10} and carry 1 to the ${placeName(k + 1)}.`;
        rows[0][col(k + 1)] = { ch: '1', kind: 'carry' };
      }
      carry = s >= 10 ? 1 : 0;
      push(caption);
      unhl();
      rows[3][c] = { ch: rows[3][c].ch, kind: 'digit' };
    } else {
      if (k > lastAnswerCol && top.slice(i).every((v, j) => v === 0 && bot[i + j] === 0)) break;
      hl();
      let caption = '';
      if (top[i] < bot[i]) {
        // borrow: find the nearest place to the left with a non-zero digit
        let j = i + 1;
        while (top[j] === 0) j++;
        const chain: string[] = [];
        top[j] -= 1;
        markBorrow(rows, col(j - decs), String(top[j]));
        chain.push(`Regroup 1 ${singular(placeName(j - decs))} as 10 ${placeName(j - 1 - decs)}`);
        for (let m = j - 1; m > i; m--) {
          top[m] = 9;
          markBorrow(rows, col(m - decs), '9');
          chain.push(`then 1 ${singular(placeName(m - decs))} as 10 ${placeName(m - 1 - decs)}`);
        }
        top[i] += 10;
        markBorrow(rows, c, String(top[i]));
        caption = `${cap(placeName(k))}: ${top[i] - 10} is less than ${bot[i]}. ${chain.join(', ')}. `;
      }
      const d = top[i] - bot[i];
      rows[3][c] = { ch: String(d), kind: 'new' };
      caption += `${cap(placeName(k))}: ${top[i]} − ${bot[i]} = ${d}.`;
      push(caption);
      unhl();
      rows[3][c] = { ch: rows[3][c].ch, kind: 'digit' };
    }
    if (k === 0 && decs) rows[3][col('point')] = { ch: '.', kind: 'point' };
  }
  if (decs) rows[3][col('point')] = { ch: '.', kind: 'point' };
  const ans = answerFrom(rows[3]);
  push(decs ? `Bring the decimal point straight down. The answer is ${ans}.` : `The answer is ${ans}.`);
  return frames;
}

function markBorrow(rows: Cell[][], c: number, now: string) {
  const cell = rows[1][c];
  rows[1][c] = { ch: cell.ch, kind: 'cross', above: now };
}

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const singular = (s: string) => s.replace(/s$/, '');
const answerFrom = (row: Cell[]) =>
  row
    .map((c) => c.ch)
    .join('')
    .replace(/^0+(?=\d)/, '');

// ---------------------------------------------------------------- multiplication

export function multiplyFrames(aStr: string, bStr: string): Frame[] {
  const a = parse(aStr).int;
  const b = parse(bStr).int;
  const product = String(Number(a) * Number(b));
  const W = Math.max(product.length, a.length, b.length + 1) + 1;
  // rows: 0 carries, 1 a, 2 b, 3.. partial products, last = sum
  const partialRows = b.length;
  const R = 3 + partialRows + (partialRows > 1 ? 1 : 0);
  const rows: Cell[][] = Array.from({ length: R }, () => Array.from({ length: W }, blank));
  const put = (r: number, s: string, kind: CellKind = 'digit') => {
    for (let i = 0; i < s.length; i++) rows[r][W - s.length + i] = { ch: s[i], kind };
  };
  put(1, a);
  put(2, b);
  rows[2][W - b.length - 1] = { ch: '×', kind: 'op' };
  const rules = [3];
  if (partialRows > 1) rules.push(R - 1);
  const frames: Frame[] = [];
  const push = (caption: string) => frames.push({ rows: clone(rows), rules: [...rules], caption });
  push(`Write ${a} above ${b}, lined up by place value.`);

  for (let j = 0; j < b.length; j++) {
    const bd = Number(b[b.length - 1 - j]);
    const r = 3 + j;
    const placeValue = bd * 10 ** j;
    for (let c = 0; c < W; c++) rows[0][c] = blank();
    if (j > 0) {
      for (let z = 0; z < j; z++) rows[r][W - 1 - z] = { ch: '0', kind: 'new' };
      push(`Now multiply by the ${placeName(j)} digit, ${bd}, which is worth ${placeValue}. Write ${j === 1 ? 'a 0' : `${j} zeros`} in the ones place first.`);
      for (let z = 0; z < j; z++) rows[r][W - 1 - z] = { ch: '0', kind: 'pad' };
    }
    let carry = 0;
    for (let i = 0; i < a.length; i++) {
      const ad = Number(a[a.length - 1 - i]);
      const p = ad * bd + carry;
      const c = W - 1 - j - i;
      const last = i === a.length - 1;
      rows[1][W - 1 - i] = { ch: String(ad), kind: 'hl' };
      rows[2][W - 1 - j] = { ch: String(bd), kind: 'hl' };
      let caption = `${bd} × ${ad}${carry ? ` + ${carry} (carried)` : ''} = ${p}.`;
      if (last) {
        const s = String(p);
        for (let q = 0; q < s.length; q++) rows[r][c - s.length + 1 + q] = { ch: s[q], kind: 'new' };
        caption += ` Write ${p}.`;
        carry = 0;
      } else {
        rows[r][c] = { ch: String(p % 10), kind: 'new' };
        carry = Math.floor(p / 10);
        if (carry) {
          rows[0][c - 1] = { ch: String(carry), kind: 'carry' };
          caption += ` Write ${p % 10} and carry ${carry}.`;
        } else caption += ` Write ${p}.`;
      }
      push(caption);
      rows[1][W - 1 - i] = { ch: String(ad), kind: 'digit' };
      rows[2][W - 1 - j] = { ch: String(bd), kind: 'digit' };
      for (let c2 = 0; c2 < W; c2++) if (rows[r][c2].kind === 'new') rows[r][c2] = { ...rows[r][c2], kind: 'digit' };
    }
    const partial = String(Number(a) * placeValue);
    if (b.length > 1) push(`${a} × ${placeValue} = ${partial}.`);
  }
  for (let c = 0; c < W; c++) rows[0][c] = blank();
  if (b.length > 1) {
    put(R - 1, product, 'new');
    const partials = [...b].reverse().map((d, j) => Number(a) * Number(d) * 10 ** j);
    push(`Add the partial products: ${partials.join(' + ')} = ${product}.`);
  } else {
    push(`${a} × ${b} = ${product}.`);
  }
  return frames;
}

// ---------------------------------------------------------------- long division

export function divideFrames(dividendStr: string, divisorStr: string): Frame[] {
  const n = parse(dividendStr).int;
  const d = Number(parse(divisorStr).int);
  if (d === 0) throw new Error('Division by zero is not possible');
  // Layout: col 0-1 divisor and bracket, then the dividend digits.
  const W = n.length + 3;
  const off = 2; // first dividend column
  const R = 2 + n.length * 2 + 1;
  const rows: Cell[][] = Array.from({ length: R }, () => Array.from({ length: W }, blank));
  rows[1][0] = { ch: String(d), kind: 'digit' };
  for (let i = 0; i < n.length; i++) rows[1][off + i] = { ch: n[i], kind: 'digit' };
  const frames: Frame[] = [];
  const rules: number[] = [];
  const push = (caption: string) => frames.push({ rows: clone(rows), rules: [...rules], caption, bracketAt: 1 });
  push(`Divide ${Number(n)} by ${d}. Work from the greatest place value, one digit at a time.`);

  let rem = 0;
  let r = 2;
  let started = false;
  for (let i = 0; i < n.length; i++) {
    const cur = rem * 10 + Number(n[i]);
    const q = Math.floor(cur / d);
    const c = off + i;
    if (!started && q === 0 && i < n.length - 1) {
      rows[1][c] = { ...rows[1][c], kind: 'hl' };
      rem = cur;
      push(`${cur} is less than ${d}, so ${d} goes into ${cur} zero times. Use the next digit too.`);
      rows[1][c] = { ...rows[1][c], kind: 'digit' };
      continue;
    }
    started = true;
    rows[0][c] = { ch: String(q), kind: 'new' };
    const sub = q * d;
    const width = String(cur).length;
    // write the product under the current number, ending at column c
    const sw = String(sub).padStart(width, ' ');
    for (let k = 0; k < width; k++) if (sw[k] !== ' ') rows[r][c - width + 1 + k] = { ch: sw[k], kind: 'new' };
    rows[r][c - width] = { ch: '−', kind: 'op' };
    const remNow = cur - sub;
    const rs = String(remNow);
    for (let k = 0; k < rs.length; k++) rows[r + 1][c - rs.length + 1 + k] = { ch: rs[k], kind: 'new' };
    // The subtraction line sits under the product only.
    for (let k = c - width + 1; k <= c; k++) rows[r + 1][k] = { ...rows[r + 1][k], ruleTop: true };
    push(`${d} goes into ${cur} ${q} time${q === 1 ? '' : 's'}: ${q} × ${d} = ${sub}. Subtract: ${cur} − ${sub} = ${remNow}.`);
    for (const rr of [0, r, r + 1]) for (let k = 0; k < W; k++) if (rows[rr][k].kind === 'new') rows[rr][k] = { ...rows[rr][k], kind: 'digit' };
    rem = remNow;
    r += 2;
    if (i < n.length - 1) {
      // bring down the next digit
      rows[r - 1][c + 1] = { ch: n[i + 1], kind: 'new' };
      push(`Bring down the next digit, ${n[i + 1]}, to make ${rem * 10 + Number(n[i + 1])}.`);
      rows[r - 1][c + 1] = { ...rows[r - 1][c + 1], kind: 'digit' };
    }
  }
  const quotient = Math.floor(Number(n) / d);
  const remainder = Number(n) % d;
  if (remainder) {
    rows[0][W - 1] = { ch: `R${remainder}`, kind: 'new' };
    push(`Nothing left to bring down. ${Number(n)} ÷ ${d} = ${quotient} R ${remainder}.`);
  } else push(`Nothing left over. ${Number(n)} ÷ ${d} = ${quotient}.`);
  return frames.map((f) => ({ ...f, rows: f.rows.filter((row, i) => i <= 1 || row.some((c) => c.kind !== 'blank' || c.ruleTop)) }));
}

/** The final answer shown by a list of frames (for tests). */
export function finalAnswer(frames: Frame[]): string {
  const last = frames.at(-1)!;
  return last.caption;
}

// ---------------------------------------------------------------- rendering

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

/** One frame as an HTML grid. Used for the first paint at build time and for every step in the browser. */
export function frameHtml(f: Frame): string {
  const W = f.rows[0].length;
  const isDivision = f.bracketAt !== undefined;
  let html = `<div class="cc-grid${isDivision ? ' cc-grid--div' : ''}" style="--cols:${W}">`;
  f.rows.forEach((row, r) => {
    row.forEach((cell, c) => {
      const classes = [`cc-cell`, `cc-${cell.kind}`];
      if ((f.rules.includes(r) && cell.kind !== 'op') || cell.ruleTop) classes.push('cc-rule');
      if (isDivision && r === 1 && c > f.bracketAt!) classes.push('cc-roof');
      if (isDivision && r === 1 && c === f.bracketAt) classes.push('cc-bracket');
      const above = cell.above ? `<span class="cc-above">${escape(cell.above)}</span>` : '';
      html += `<span class="${classes.join(' ')}">${above}${escape(cell.ch)}</span>`;
    });
  });
  return html + '</div>';
}

export type CalcExample = { op: '+' | '-' | '×' | '÷'; a: string; b: string };

export function framesFor(e: CalcExample): Frame[] {
  if (e.op === '+' || e.op === '-') return addSubFrames(e.op, e.a, e.b);
  if (e.op === '×') return multiplyFrames(e.a, e.b);
  return divideFrames(e.a, e.b);
}

export const exampleLabel = (e: CalcExample) => `${e.a} ${e.op === '-' ? '−' : e.op} ${e.b}`;
