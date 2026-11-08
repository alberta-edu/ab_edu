// Multiplying natural numbers and fractions, Grade 6 (sAJrul14WkyWyL8gNRW3rw): n groups of a/b as
// jumps on a number line, and a/b of n as equal parts of a bar. Pure functions for the
// fraction-times visual and the tests.

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/** "8/3 = 2 2/3", "6/3 = 2", "3/4". */
export function fracText(n: number, d: number): string {
  if (n % d === 0) return `${n}/${d} = ${n / d}`;
  if (n < d) return `${n}/${d}`;
  return `${n}/${d} = ${Math.floor(n / d)} ${n % d}/${d}`;
}

/** Lowest terms, for a note like "= 2/3". */
export function simplest(n: number, d: number): [number, number] {
  const g = gcd(n, d) || 1;
  return [n / g, d / g];
}

/** n groups of a/b, as jumps on a number line measured in b-ths. */
export function groupJumps(n: number, a: number, b: number): { from: number; to: number }[] {
  return Array.from({ length: n }, (_, i) => ({ from: i * a, to: (i + 1) * a }));
}

export const groupsSum = (n: number, a: number, b: number) => `${Array(n).fill(`${a}/${b}`).join(' + ')} = ${n * a}/${b}`;

/** a/b of c: c split into b equal parts, a of them taken. */
export function partOf(a: number, b: number, c: number) {
  return { part: [c, b] as [number, number], total: [a * c, b] as [number, number] };
}

/** Number line from 0 to `wholes`, ticks every 1/b, with arcs for jumps of a/b. */
export function jumpsSvg(n: number, a: number, b: number, shown = n): string {
  const total = n * a;
  const wholes = Math.max(1, Math.ceil(total / b));
  const W = 480;
  const x0 = 24;
  const len = W - 2 * x0;
  const X = (t: number) => x0 + (t / (wholes * b)) * len;
  const Y = 120;
  let s = `<line class="g6m-axis" x1="${x0}" y1="${Y}" x2="${x0 + len}" y2="${Y}"/>`;
  for (let t = 0; t <= wholes * b; t++) {
    const whole = t % b === 0;
    s += `<line class="${whole ? 'g6m-zero' : 'g6m-tick'}" x1="${X(t)}" y1="${Y - (whole ? 12 : 7)}" x2="${X(t)}" y2="${Y + (whole ? 12 : 7)}"/>`;
    if (whole) s += `<text class="g6m-num" font-size="20" x="${X(t)}" y="${Y + 36}" text-anchor="middle">${t / b}</text>`;
  }
  groupJumps(n, a, b)
    .slice(0, shown)
    .forEach((j, i) => {
      const x1 = X(j.from);
      const x2 = X(j.to);
      const h = Math.min(70, 26 + (x2 - x1) * 0.4);
      s += `<path class="g6m-ft-arc" d="M${x1} ${Y} C ${x1} ${Y - h}, ${x2} ${Y - h}, ${x2} ${Y}"/><text class="g6m-ft-arc-label" x="${(x1 + x2) / 2}" y="${Y - h * 0.75 - 4}" text-anchor="middle">${i + 1}</text>`;
    });
  if (shown === n) s += `<circle class="g6m-pt" cx="${X(total)}" cy="${Y}" r="8"/>`;
  return `<svg viewBox="0 0 ${W} 170" role="img" aria-label="Number line from 0 to ${wholes} in ${b}ths, with ${shown} jumps of ${a}/${b}.">${s}</svg>`;
}

/** A bar for c wholes, split into b equal parts, with a of them shaded. */
export function partSvg(a: number, b: number, c: number): string {
  const W = 480;
  const x0 = 10;
  const len = W - 2 * x0;
  let s = '';
  // Unit ticks for the wholes inside the bar.
  for (let i = 0; i < b; i++) {
    const x = x0 + (i * len) / b;
    s += `<rect x="${x}" y="30" width="${len / b}" height="60" class="g6m-fx-part${i < a ? ' g6m-fx-part--on' : ''}"/>`;
  }
  for (let u = 1; u < c; u++) s += `<line class="g6m-fx-unit" x1="${x0 + (u * len) / c}" y1="30" x2="${x0 + (u * len) / c}" y2="90"/>`;
  for (let i = 0; i <= b; i++) s += `<line class="g6m-fx-cut" x1="${x0 + (i * len) / b}" y1="22" x2="${x0 + (i * len) / b}" y2="98"/>`;
  s += `<rect x="${x0}" y="30" width="${len}" height="60" class="g6m-fx-frame"/>`;
  s += `<text class="g6m-num" font-size="20" x="${x0 + len / 2}" y="18" text-anchor="middle">${c} in all</text>`;
  const [pn, pd] = [c, b];
  const each = pn % pd === 0 ? String(pn / pd) : `${pn}/${pd}`;
  for (let i = 0; i < b; i++) s += `<text class="g6m-fx-each" x="${x0 + ((i + 0.5) * len) / b}" y="66" text-anchor="middle">${each}</text>`;
  return `<svg viewBox="0 0 ${W} 110" role="img" aria-label="A bar for ${c}, split into ${b} equal parts of ${each}, with ${a} parts shaded.">${s}</svg>`;
}
