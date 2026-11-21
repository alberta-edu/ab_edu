// Equations on a balance (MAT3-OI2-GQ1-LO1). Each side is a number or one operation, such as
// "3 + 4", "12 − 5", "2 × 6" or "□ + 5". The box □ is the unknown value.

export const BOX = '□';
export type Op = '+' | '−' | '×' | '÷';
export interface Side {
  a: number | 'box';
  op?: Op;
  b?: number | 'box';
}

const term = (t: string): number | 'box' => {
  const s = t.trim();
  if (s === BOX) return 'box';
  const n = Number(s);
  if (!Number.isInteger(n) || n < 0) throw new Error(`Not a whole number or ${BOX}: "${t}"`);
  return n;
};

/** Reads one side of an equation: a number, a box, or two of them joined by one operation. */
export function parseSide(src: string): Side {
  const m = src.match(/^\s*(\S+)\s*([+−×÷])\s*(\S+)\s*$/);
  if (!m) return { a: term(src) };
  return { a: term(m[1]), op: m[2] as Op, b: term(m[3]) };
}

const val = (t: number | 'box', box: number) => (t === 'box' ? box : t);

/** The number a side stands for, with the box holding `box`. */
export function sideValue(s: Side, box = 0): number {
  const a = val(s.a, box);
  if (!s.op || s.b === undefined) return a;
  const b = val(s.b, box);
  return s.op === '+' ? a + b : s.op === '−' ? a - b : s.op === '×' ? a * b : a / b;
}

export const hasBox = (s: Side) => s.a === 'box' || s.b === 'box';

export const sideText = (s: Side) => {
  const t = (x: number | 'box') => (x === 'box' ? BOX : String(x));
  return s.op && s.b !== undefined ? `${t(s.a)} ${s.op} ${t(s.b)}` : t(s.a);
};

/** The value of the box that balances the two sides, if there is a whole-number one up to 100. */
export function solveBox(l: Side, r: Side): number | null {
  for (let x = 0; x <= 100; x++) if (sideValue(l, x) === sideValue(r, x)) return x;
  return null;
}

/** Beam tilt in degrees: positive lowers the right pan. Small differences still show. */
export const tilt = (left: number, right: number) => Math.max(-14, Math.min(14, (right - left) * 3));

/** What the balance tells you, in Grade 3 words. */
export function balanceSay(l: Side, r: Side, box: number | null): string {
  const L = sideValue(l, box ?? 0);
  const R = sideValue(r, box ?? 0);
  const boxy = hasBox(l) || hasBox(r);
  if (L === R) {
    const eq = `${sideText(l)} = ${sideText(r)}`;
    return boxy ? `Balanced! The box holds ${box}. So ${BOX} = ${box} makes ${eq} true.` : `Balanced! Both sides are ${L}. So ${eq}.`;
  }
  const heavy = L > R ? 'left' : 'right';
  if (boxy) {
    const boxSide = hasBox(l) ? 'left' : 'right';
    return `The ${heavy} side is heavier. Try a ${heavy === boxSide ? 'smaller' : 'bigger'} number in the box.`;
  }
  return `Not balanced. ${sideText(l)} is ${L}, but ${sideText(r)} is ${R}. They are not equal.`;
}

/**
 * Pieces on a pan, left to right: cubes coloured by group, crossed-out cubes that were taken
 * away, and mystery boxes. Kept small so a Grade 3 child can count them.
 */
export type Piece = { kind: 'cube'; group: number } | { kind: 'gone' } | { kind: 'box' };
export function pieces(s: Side): Piece[] {
  const run = (t: number | 'box', group: number): Piece[] => (t === 'box' ? [{ kind: 'box' }] : Array.from({ length: t }, () => ({ kind: 'cube', group }) as Piece));
  if (!s.op || s.b === undefined) return run(s.a, 0);
  if (s.op === '+') return [...run(s.a, 0), ...run(s.b, 1)];
  if (s.op === '−') {
    if (s.a === 'box') return [{ kind: 'box' }, ...Array.from({ length: s.b as number }, () => ({ kind: 'gone' }) as Piece)];
    const keep = s.a - (s.b as number);
    return [...run(keep, 0), ...Array.from({ length: s.b as number }, () => ({ kind: 'gone' }) as Piece)];
  }
  if (s.op === '×') {
    const groups = s.a === 'box' ? (s.b as number) : s.a;
    const each = s.a === 'box' ? 'box' : s.b!;
    return Array.from({ length: groups as number }, (_, g) => run(each, g % 2)).flat();
  }
  // a ÷ b: one share of a split into b equal groups.
  return run(sideValue(s), 0);
}
