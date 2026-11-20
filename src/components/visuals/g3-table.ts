// The times table to 10 × 10 (MAT3-OI1-GQ3-LO1: K3.1, K3.2, U3.1, S3.1-S3.3; MAT3-OI6-GQ1-LO1: S2.1).

/** The fact family for a × b: two multiplications and two divisions, or one of each for a square. */
export function family(a: number, b: number): string[] {
  const p = a * b;
  if (a === b) return [`${a} × ${a} = ${p}`, `${p} ÷ ${a} = ${a}`];
  return [`${a} × ${b} = ${p}`, `${b} × ${a} = ${p}`, `${p} ÷ ${a} = ${b}`, `${p} ÷ ${b} = ${a}`];
}

/** A row of the table read as a skip-counting sequence. */
export const rowSeq = (r: number, n = 10) => Array.from({ length: n }, (_, i) => r * (i + 1));

/** A fact-family triangle: the product on top, the two factors below. */
export function triangleSvg(a: number, b: number): string {
  const p = a * b;
  return `<svg viewBox="0 0 160 120" role="img" aria-label="Fact family triangle: ${p} on top, ${a} and ${b} below."><path class="g3m-tt-tri" d="M80 10 L150 110 L10 110 Z"/><text class="g3m-tt-top" x="80" y="56" text-anchor="middle">${p}</text><text class="g3m-tt-low" x="45" y="100" text-anchor="middle">${a}</text><text class="g3m-tt-low" x="115" y="100" text-anchor="middle">${b}</text><text class="g3m-tt-op" x="80" y="100" text-anchor="middle">× ÷</text></svg>`;
}
