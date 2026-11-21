// Grade 4 sequences (MAT4-OI6-GQ1-LO1): square, triangular and Fibonacci numbers, and arithmetic
// and geometric sequences given a first term and a constant change.

export type SeqKind = 'square' | 'triangle' | 'fibonacci' | 'add' | 'times';

export function terms(kind: SeqKind, start = 1, change = 1, n = 5): number[] {
  const out: number[] = [];
  for (let i = 1; i <= n; i++) {
    if (kind === 'square') out.push(i * i);
    else if (kind === 'triangle') out.push((i * (i + 1)) / 2);
    else if (kind === 'fibonacci') out.push(i <= 2 ? 1 : out[i - 2] + out[i - 3]);
    else if (kind === 'add') out.push(start + (i - 1) * change);
    else out.push(start * change ** (i - 1));
  }
  return out;
}

/** The change between neighbouring terms, as labels like "+3" or "× 2". */
export function changes(kind: SeqKind, t: number[], change = 1): string[] {
  return t.slice(1).map((v, i) => {
    if (kind === 'times') return `× ${change}`;
    if (kind === 'fibonacci') return i === 0 ? '' : `${t[i - 1]} + ${t[i]}`;
    const d = v - t[i];
    return d >= 0 ? `+ ${d}` : `− ${-d}`;
  });
}

export function seqText(kind: SeqKind, start: number, change: number): string {
  const t = terms(kind, start, change);
  const list = t.join(', ');
  switch (kind) {
    case 'square':
      return `Square numbers: ${list}. Each one is a square of dots. The change grows: +3, +5, +7, +9.`;
    case 'triangle':
      return `Triangular numbers: ${list}. Each one is a triangle of dots. The change grows: +2, +3, +4, +5.`;
    case 'fibonacci':
      return `Fibonacci: ${terms('fibonacci', 1, 1, 8).join(', ')}. Each term is the sum of the two before it.`;
    case 'add':
      return change >= 0
        ? `Start at ${start} and add ${change} each time: ${list}. This arithmetic sequence increases.`
        : `Start at ${start} and subtract ${-change} each time: ${list}. This arithmetic sequence decreases.`;
    default:
      return `Start at ${start} and multiply by ${change} each time: ${list}. This geometric sequence grows faster and faster.`;
  }
}

/** Keep the picture within 10 000 and above 0: returns a start that works with the change. */
export function fitStart(kind: 'add' | 'times', start: number, change: number): number {
  if (kind === 'add') return Math.max(start, -4 * change, 0);
  while (start > 1 && start * change ** 4 > 10_000) start--;
  return start;
}

/** Fibonacci squares as [x, y, side] in units, laid out so each new square fits beside the others. */
export const FIB_SQUARES: [number, number, number][] = [
  [0, 0, 1],
  [1, 0, 1],
  [0, 1, 2],
  [2, 0, 3],
  [0, -5, 5],
  [-8, -5, 8],
];
