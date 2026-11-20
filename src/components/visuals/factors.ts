// Factors, factor pairs, primes and the greatest common factor of numbers within 100
// (MAT4-OI1-GQ3-LO1). Pure functions, shared by the factor lab and its tests.

export function factors(n: number): number[] {
  const out: number[] = [];
  for (let k = 1; k <= n; k++) if (n % k === 0) out.push(k);
  return out;
}

/** Factor pairs with the smaller factor first: 12 → [[1, 12], [2, 6], [3, 4]]. */
export function factorPairs(n: number): [number, number][] {
  const out: [number, number][] = [];
  for (let w = 1; w * w <= n; w++) if (n % w === 0) out.push([w, n / w]);
  return out;
}

export type NumberKind = 'prime' | 'composite' | 'neither';
export const kindOf = (n: number): NumberKind => (n < 2 ? 'neither' : factors(n).length === 2 ? 'prime' : 'composite');

export const commonFactors = (a: number, b: number) => factors(a).filter((k) => b % k === 0);
export const gcf = (a: number, b: number) => Math.max(...commonFactors(a, b));
export const multiples = (n: number, count = 5) => Array.from({ length: count }, (_, i) => n * (i + 1));

/** One sentence about a number's factors. */
export function kindText(n: number): string {
  const f = factors(n);
  const k = kindOf(n);
  if (n === 1) return '1 has only one factor, itself. It is neither prime nor composite.';
  if (k === 'prime') return `${n} has exactly two factors, 1 and ${n}. It makes only one rectangle, so it is prime.`;
  return `${n} has ${f.length} factors. It makes more than one rectangle, so it is composite.`;
}
