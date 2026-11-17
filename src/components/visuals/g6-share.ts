// Fractions as quotients for Grade 6 (MAT6-OI1-GQ5-LO1): n things shared equally among k people.
// Pure functions for the fair-share visual and the tests.

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

export interface Share {
  n: number;
  k: number;
  /** Whole things each person gets, and the leftover pieces (each 1/k). */
  whole: number;
  rest: number;
  /** n/k in lowest terms, or null if it is already in lowest terms. */
  simplest: [number, number] | null;
  /** The decimal from n ÷ k, and whether it ends within `places` decimal places. */
  decimal: string;
  exact: boolean;
}

/** Long division of n by k to at most `places` decimal places: "0.75", or "0.666" with exact false. */
export function divideToDecimal(n: number, k: number, places = 3): { text: string; exact: boolean } {
  const whole = Math.floor(n / k);
  let rem = n % k;
  let digits = '';
  while (rem && digits.length < places) {
    rem *= 10;
    digits += String(Math.floor(rem / k));
    rem %= k;
  }
  return { text: digits ? `${whole}.${digits}` : String(whole), exact: rem === 0 };
}

export function share(n: number, k: number): Share {
  const g = gcd(n, k);
  const { text, exact } = divideToDecimal(n, k);
  return { n, k, whole: Math.floor(n / k), rest: n % k, simplest: g > 1 ? [n / g, k / g] : null, decimal: text, exact };
}

/** SVG path for a slice of a circle, from turn t0 to t1 (0 = top, clockwise, 1 = all the way round). */
export function sector(cx: number, cy: number, r: number, t0: number, t1: number): string {
  if (t1 - t0 >= 0.9999) return `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
  const pt = (t: number) => [cx + r * Math.sin(2 * Math.PI * t), cy - r * Math.cos(2 * Math.PI * t)].map((v) => (Math.abs(v) < 0.005 ? 0 : v).toFixed(2)).join(' ');
  const large = t1 - t0 > 0.5 ? 1 : 0;
  return `M${cx} ${cy} L${pt(t0)} A${r} ${r} 0 ${large} 1 ${pt(t1)} Z`;
}
