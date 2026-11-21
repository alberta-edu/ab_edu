// Number sequences (MAT3-OI6-GQ1-LO1): terms in order with ordinal positions, finite and infinite
// sequences, even and odd numbers, skip counting, and missing terms found with multiplication.

export interface Seq {
  label: string;
  /** First term. */
  start: number;
  /** Change from one term to the next: +3, −5 and so on. */
  step: number;
  /** Terms shown at first. */
  n: number;
  /** Finite sequences stop (a countdown); infinite ones can keep going. */
  finite?: boolean;
  /** Position (1st = 1) to hide, for a missing-term puzzle. */
  hide?: number;
}

/** 1st, 2nd, 3rd, 4th … 11th, 12th, 13th … 21st, 22nd. */
export function ordinal(n: number): string {
  const teen = n % 100 >= 11 && n % 100 <= 13;
  const end = teen ? 'th' : n % 10 === 1 ? 'st' : n % 10 === 2 ? 'nd' : n % 10 === 3 ? 'rd' : 'th';
  return `${n}${end}`;
}

/** The term at a position (1st = 1). */
export const term = (s: Seq, pos: number) => s.start + (pos - 1) * s.step;

/** How many terms a finite sequence has before it would go below 0. */
export const lastPos = (s: Seq) => (s.finite && s.step < 0 ? Math.floor(s.start / -s.step) + 1 : Infinity);

export const ruleSay = (step: number) => (step >= 0 ? `Add ${step} each time.` : `Subtract ${-step} each time.`);

/** A skip-counting sequence: it starts at its step and adds it, like a row of the times table. */
export const isSkip = (s: Seq) => s.step > 0 && s.start === s.step;

export function findSay(s: Seq, pos: number): string {
  const v = term(s, pos);
  if (isSkip(s)) return `The ${ordinal(pos)} term of counting by ${s.step} is ${pos} × ${s.step} = ${v}.`;
  const prev = term(s, pos - 1);
  return `${ruleSay(s.step)} ${prev} ${s.step >= 0 ? '+' : '−'} ${Math.abs(s.step)} = ${v}. The ${ordinal(pos)} term is ${v}.`;
}

export const tapSay = (s: Seq, pos: number) => `The ${ordinal(pos)} term is ${term(s, pos)}.`;
