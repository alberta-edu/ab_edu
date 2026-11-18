// Equivalent ratios, rates and percent for Grade 6 (a0drDciYDkWmZ8qt5-1K0A), on a double number
// line: two quantities that grow together, with the matching amounts lined up. Pure functions for
// the double-line visual and the tests.

/** Up to 2 decimal places, no float noise: 1.5, 0.75, 75. */
export const num = (x: number) => String(Number(x.toFixed(2)));

/** Equivalent ratio: multiply (or divide) both terms by the same number (K1.2). */
export const scale = (a: number, b: number, k: number): [number, number] => [a * k, b * k];

/** Do a : b and c : d express the same relationship? Cross products are equal exactly when they do. */
export const equivalent = (a: number, b: number, c: number, d: number) => a * d === b * c;

/** Second quantity per 1 of the first (K1.5). */
export const unitRate = (a: number, b: number) => b / a;

/** p% of n = n × p ÷ 100 (K1.7). */
export const percentOf = (p: number, n: number) => (n * p) / 100;

export interface Pair {
  top: number;
  bottom: number;
  /** Highlight this pair. */
  hi?: boolean;
  /** Text shown instead of the number. */
  topText?: string;
  bottomText?: string;
  /** Tick marks only, no numbers. */
  quiet?: boolean;
}

/**
 * Two number lines, one above the other, with matching amounts joined. Positions follow the top
 * values, so equal steps on top are equal steps below: that is what makes the relationship proportional.
 */
export function doubleLineSvg(pairs: Pair[], topLabel: string, bottomLabel: string, max = Math.max(...pairs.map((p) => p.top))): string {
  const W = 440;
  const x0 = 24;
  const len = W - 2 * x0 - 10;
  const X = (t: number) => x0 + (t / max) * len;
  const yT = 56;
  const yB = 140;
  let s = `<text class="g6m-dl-name" x="${x0 + len + 10}" y="20" text-anchor="end">${topLabel}</text><text class="g6m-dl-name" x="${x0 + len + 10}" y="${yB + 58}" text-anchor="end">${bottomLabel}</text>`;
  s += `<line class="g6m-axis" x1="${x0}" y1="${yT}" x2="${x0 + len + 10}" y2="${yT}"/><line class="g6m-axis" x1="${x0}" y1="${yB}" x2="${x0 + len + 10}" y2="${yB}"/>`;
  for (const p of pairs) {
    const x = X(p.top);
    s += `<line class="${p.hi ? 'g6m-dl-join g6m-dl-join--hi' : 'g6m-dl-join'}" x1="${x}" y1="${yT}" x2="${x}" y2="${yB}"/>`;
    s += `<line class="g6m-tick" x1="${x}" y1="${yT - 8}" x2="${x}" y2="${yT + 8}"/><line class="g6m-tick" x1="${x}" y1="${yB - 8}" x2="${x}" y2="${yB + 8}"/>`;
    // Skip a label that would crowd the highlighted one.
    const crowded = !p.hi && pairs.some((q) => q.hi && Math.abs(X(q.top) - x) < 40);
    if (p.quiet || crowded) continue;
    s += `<text class="g6m-dl-num${p.hi ? ' g6m-dl-num--hi' : ''}" x="${x}" y="${yT - 14}" text-anchor="middle">${p.topText ?? num(p.top)}</text>`;
    s += `<text class="g6m-dl-num${p.hi ? ' g6m-dl-num--hi' : ''}" x="${x}" y="${yB + 32}" text-anchor="middle">${p.bottomText ?? num(p.bottom)}</text>`;
  }
  return `<svg viewBox="0 0 ${W} ${yB + 68}" role="img" data-h="1" aria-label="Double number line. ${topLabel} on top, ${bottomLabel} below: ${pairs.map((p) => `${p.topText ?? num(p.top)} to ${p.bottomText ?? num(p.bottom)}`).join(', ')}.">${s}</svg>`;
}

/** Pairs for a ratio a : b, from 0 up to `count` copies, highlighting k copies (k can be 1/a for the unit rate). */
export function ratioPairs(a: number, b: number, count: number, k: number): Pair[] {
  const pairs: Pair[] = Array.from({ length: count + 1 }, (_, i) => ({ top: a * i, bottom: b * i, hi: i === k }));
  if (!Number.isInteger(k)) pairs.push({ top: a * k, bottom: b * k, hi: true });
  return pairs.sort((p, q) => p.top - q.top);
}

/** Pairs for percent of n: 0% to 100% in steps of 10, with p highlighted. */
export function percentPairs(p: number, n: number): Pair[] {
  const pairs: Pair[] = Array.from({ length: 11 }, (_, i) => ({ top: i * 10, bottom: (n * i) / 10, topText: `${i * 10}%`, hi: i * 10 === p, quiet: i % 5 !== 0 && i * 10 !== p }));
  if (p % 10) pairs.push({ top: p, bottom: percentOf(p, n), topText: `${p}%`, hi: true });
  return pairs.sort((x, y) => x.top - y.top);
}
