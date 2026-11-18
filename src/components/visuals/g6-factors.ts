// Prime factorization and powers for Grade 6 (MAT6-OI1-GQ3-LO1): factor trees, powers, and
// reading divisibility from prime factors. Pure functions, shared by the visual and the tests.

export const isPrime = (n: number) => {
  if (n < 2 || !Number.isInteger(n)) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
};

/** Prime factors from smallest to largest, with repeats: 60 → [2, 2, 3, 5]. */
export function primeFactors(n: number): number[] {
  const out: number[] = [];
  let m = n;
  for (let d = 2; d * d <= m; d++) while (m % d === 0) (out.push(d), (m /= d));
  if (m > 1) out.push(m);
  return out;
}

/** Each prime with how many times it repeats: [[2, 2], [3, 1], [5, 1]]. */
export function primePowers(n: number): [number, number][] {
  const map = new Map<number, number>();
  for (const p of primeFactors(n)) map.set(p, (map.get(p) ?? 0) + 1);
  return [...map];
}

/** "2 × 2 × 3 × 5" */
export const expanded = (n: number) => primeFactors(n).join(' × ');

/** "2² × 3 × 5", with superscripts as HTML. */
export const powerHtml = (n: number) => primePowers(n).map(([p, k]) => (k > 1 ? `${p}<sup>${k}</sup>` : String(p))).join(' × ');

/** Factor pairs a × b = n with 1 < a ≤ b. */
export function factorPairs(n: number): [number, number][] {
  const out: [number, number][] = [];
  for (let a = 2; a * a <= n; a++) if (n % a === 0) out.push([a, n / a]);
  return out;
}

export interface TreeNode {
  n: number;
  kids?: [TreeNode, TreeNode];
}

/**
 * A full factor tree. The root splits into `first` (or its most balanced pair); every other
 * composite splits into its most balanced pair, so the trees look different but end in the same primes.
 */
export function factorTree(n: number, first?: [number, number]): TreeNode {
  if (isPrime(n) || n < 4) return { n };
  const pairs = factorPairs(n);
  const pair = first ?? pairs[pairs.length - 1];
  return { n, kids: [factorTree(pair[0]), factorTree(pair[1])] };
}

/** The tree cut off after `depth` levels of splitting, for showing it grow one level at a time. */
export function prune(t: TreeNode, depth: number): TreeNode {
  if (!t.kids || depth <= 0) return { n: t.n };
  return { n: t.n, kids: [prune(t.kids[0], depth - 1), prune(t.kids[1], depth - 1)] };
}

export const depthOf = (t: TreeNode): number => (t.kids ? 1 + Math.max(depthOf(t.kids[0]), depthOf(t.kids[1])) : 0);
export const leaves = (t: TreeNode): number[] => (t.kids ? [...leaves(t.kids[0]), ...leaves(t.kids[1])] : [t.n]);

export interface Placed {
  n: number;
  /** Column, in leaf widths, and row (depth). */
  x: number;
  y: number;
  leaf: boolean;
  /** The parent's position, for the branch line. */
  parent?: { x: number; y: number };
}

/** Positions for drawing: leaves are spread evenly across, parents sit above the middle of their children. */
export function layout(t: TreeNode): Placed[] {
  const out: Placed[] = [];
  let next = 0;
  const walk = (node: TreeNode, d: number): Placed => {
    if (!node.kids) {
      const leaf = { n: node.n, x: next++, y: d, leaf: true };
      out.push(leaf);
      return leaf;
    }
    const a = walk(node.kids[0], d + 1);
    const b = walk(node.kids[1], d + 1);
    const me = { n: node.n, x: (a.x + b.x) / 2, y: d, leaf: false };
    a.parent = b.parent = { x: me.x, y: d };
    out.push(me);
    return me;
  };
  walk(t, 0);
  return out;
}

/** Can n be divided by d with no remainder? Explained from prime factors (S1.4, S2.3). */
export function divisibleBy(n: number, d: number): { yes: boolean; why: string } {
  if (d === 1) return { yes: true, why: 'Every number is divisible by 1.' };
  const have = new Map(primePowers(n));
  const need = primePowers(d);
  const missing = need.find(([p, k]) => (have.get(p) ?? 0) < k);
  const dHtml = powerHtml(d);
  if (!missing) return { yes: true, why: `${d} = ${dHtml}. Every one of those prime factors is inside ${n} = ${powerHtml(n)}, so ${n} ÷ ${d} = ${n / d}.` };
  const [p, k] = missing;
  const got = have.get(p) ?? 0;
  return {
    yes: false,
    why: `${d} = ${dHtml} needs ${k === 1 ? `a ${p}` : `${k} factors of ${p}`}, but ${n} = ${powerHtml(n)} has ${got === 0 ? `no ${p}` : `only ${got}`}. So ${n} is not divisible by ${d}.`,
  };
}

/** Common factors of a and b, built from the prime factors they share (S1.3). */
export function commonFactors(a: number, b: number): number[] {
  const pa = new Map(primePowers(a));
  const shared: [number, number][] = primePowers(b)
    .filter(([p]) => pa.has(p))
    .map(([p, k]) => [p, Math.min(k, pa.get(p)!)]);
  let out = [1];
  for (const [p, k] of shared) {
    const next: number[] = [];
    for (const f of out) for (let i = 0, m = 1; i <= k; i++, m *= p) next.push(f * m);
    out = next;
  }
  return out.sort((x, y) => x - y);
}
