// Grade 3 place value to 100 000 (MAT3-OI1-GQ1-LO1): digits, place values, expanded form, words,
// regrouping when a digit passes 9 or 0, and rounding on a number line.
import { wholeWords } from './number-words.ts';

export const MAX = 100_000;

/** Places from hundred thousands down to ones, as the chart shows them, left to right. */
export const PLACES = [
  { name: 'hundred thousands', value: 100_000 },
  { name: 'ten thousands', value: 10_000 },
  { name: 'thousands', value: 1_000 },
  { name: 'hundreds', value: 100 },
  { name: 'tens', value: 10 },
  { name: 'ones', value: 1 },
] as const;

/** Write a natural number with a thin space between groups of three digits: 45 060. */
export const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/** The six digits of n, hundred thousands first. */
export const digitsOf = (n: number) => PLACES.map((p) => Math.floor(n / p.value) % 10);

/** "4 × 1 000 = 4 000" for each place that isn't zero. */
export function expanded(n: number): string {
  const parts = PLACES.map((p, i) => [digitsOf(n)[i], p.value] as const).filter(([d]) => d > 0);
  if (!parts.length) return '0';
  return parts.map(([d, v]) => fmt(d * v)).join(' + ');
}

export const words = (n: number) => wholeWords(n);

/**
 * Step one place's digit up or down by one. Going past 9 or below 0 regroups with the next place,
 * the way 10 ones make 1 ten. Returns the new number and what happened, or null if it would
 * leave 0 to 100 000.
 */
export function step(n: number, place: number, dir: 1 | -1): { n: number; note: string } | null {
  const p = PLACES[place];
  const next = n + dir * p.value;
  if (next < 0 || next > MAX) return null;
  const d = digitsOf(n)[place];
  const left = PLACES[place - 1];
  let note = '';
  if (left && dir === 1 && d === 9) note = `10 ${p.name} make 1 ${left.name.replace(/s$/, '')}. The ${p.name} go back to 0.`;
  else if (left && dir === -1 && d === 0) note = `Trade 1 ${left.name.replace(/s$/, '')} for 10 ${p.name}, then take one away.`;
  return { n: next, note };
}

/** Round n to the nearest multiple of `to` (10, 100, 1 000 or 10 000). Halfway rounds up. */
export function roundTo(n: number, to: number) {
  const low = Math.floor(n / to) * to;
  const high = low + to;
  const half = low + to / 2;
  const up = n >= half;
  return { low, high, half, result: n === low ? low : up ? high : low, up: n !== low && up };
}

export const PLACE_NAME: Record<number, string> = { 10: 'ten', 100: 'hundred', 1000: 'thousand', 10000: 'ten thousand' };

/** A sentence that says why n rounds the way it does. */
export function roundSay(n: number, to: number): string {
  const r = roundTo(n, to);
  if (n === r.low) return `${fmt(n)} is already a whole number of ${PLACE_NAME[to]}s, so it stays ${fmt(n)}.`;
  const where = n === r.half ? 'exactly halfway, so it rounds up' : r.up ? `past the halfway mark, ${fmt(r.half)}, so it rounds up` : `before the halfway mark, ${fmt(r.half)}, so it rounds down`;
  return `${fmt(n)} is between ${fmt(r.low)} and ${fmt(r.high)}. It is ${where} to ${fmt(r.result)}.`;
}

/** Number line from low to high with ten small steps, a halfway mark and a dot at n. */
export function roundSvg(n: number, to: number): string {
  const r = roundTo(n, to);
  const W = 400;
  const x0 = 30;
  const x1 = W - 30;
  const x = (v: number) => x0 + ((v - r.low) / to) * (x1 - x0);
  let s = `<line class="g3m-rl-axis" x1="${x0}" y1="60" x2="${x1}" y2="60"/>`;
  for (let i = 0; i <= 10; i++) {
    const big = i === 0 || i === 10;
    const mid = i === 5;
    const tx = x0 + (i / 10) * (x1 - x0);
    s += `<line class="${mid ? 'g3m-rl-half' : 'g3m-rl-tick'}" x1="${tx}" y1="${big ? 46 : mid ? 42 : 53}" x2="${tx}" y2="${big ? 74 : mid ? 78 : 67}"/>`;
  }
  s += `<text class="g3m-rl-num" x="${x0}" y="96" text-anchor="middle">${fmt(r.low)}</text>`;
  s += `<text class="g3m-rl-num" x="${x1}" y="96" text-anchor="middle">${fmt(r.high)}</text>`;
  s += `<text class="g3m-rl-small" x="${x(r.half)}" y="96" text-anchor="middle">${fmt(r.half)}</text>`;
  const target = r.result === r.high ? x1 : x0;
  if (n !== r.result) s += `<path class="g3m-rl-hop" d="M${x(n)} 50 Q ${(x(n) + target) / 2} 12 ${target} 48" marker-end="url(#g3m-rl-arrow)"/>`;
  s += `<circle class="g3m-rl-dot" cx="${x(n)}" cy="60" r="8"/>`;
  s += `<text class="g3m-rl-val" x="${x(n)}" y="30" text-anchor="middle">${n === r.result ? '' : fmt(n)}</text>`;
  const defs = `<defs><marker id="g3m-rl-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="g3m-rl-head"/></marker></defs>`;
  return `<svg viewBox="0 0 ${W} 108" role="img" aria-label="Number line from ${fmt(r.low)} to ${fmt(r.high)} with a dot at ${fmt(n)}.">${defs}${s}</svg>`;
}
