// Grade 3 fractions of one whole (outcome CLrkTvQMl0Oj1FGsDZHeJQ), denominators 2 to 12: name a
// fraction, build it from unit fractions, place it on a number line and compare two fractions.

const UNIT = ['', 'whole', 'half', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth'];
const NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

/** "three eighths", "one half", "two halves". */
export function fractionName(n: number, d: number): string {
  const unit = d === 2 && n !== 1 ? 'halves' : UNIT[d] + (n === 1 ? '' : 's');
  return `${NUM[n]} ${unit}`;
}

/** "1/8 + 1/8 + 1/8 = 3/8". */
export function unitSum(n: number, d: number): string {
  if (n === 0) return `0/${d}`;
  return `${Array(n).fill(`1/${d}`).join(' + ')} = ${n}/${d}`;
}

export function compare(a: [number, number], b: [number, number]): '<' | '>' | '=' {
  const x = a[0] * b[1];
  const y = b[0] * a[1];
  return x < y ? '<' : x > y ? '>' : '=';
}

/** Why one fraction is bigger, in the two ways Grade 3 compares: same denominator or same numerator. */
export function compareWhy(a: [number, number], b: [number, number]): string {
  const s = compare(a, b);
  const fa = `${a[0]}/${a[1]}`;
  const fb = `${b[0]}/${b[1]}`;
  if (s === '=') return `${fa} = ${fb}. They cover the same amount.`;
  const [big, small] = s === '>' ? [fa, fb] : [fb, fa];
  if (a[1] === b[1]) return `Same size parts. ${big} has more of them, so ${fa} ${s} ${fb}.`;
  if (a[0] === b[0]) {
    const [few] = s === '>' ? [a[1]] : [b[1]];
    return `Same number of parts. Fewer parts in the whole make bigger parts: ${big} uses ${UNIT[few]}s. So ${fa} ${s} ${fb}.`;
  }
  return `${big} covers more of the whole than ${small}. So ${fa} ${s} ${fb}.`;
}

/** Where a fraction sits next to the benchmarks 0, 1/2 and 1. */
export function benchmark(n: number, d: number): string {
  if (n === 0) return 'It is 0.';
  if (n === d) return 'It is 1 whole.';
  if (2 * n === d) return 'It is exactly one half.';
  return 2 * n < d ? 'It is between 0 and 1/2.' : 'It is between 1/2 and 1.';
}

/** A bar of d equal parts, the first n shaded, `scale` times as long as a full bar. */
export function barSvg(n: number, d: number, scale = 1, label = ''): string {
  const W = 340 * scale;
  const pw = W / d;
  let s = '';
  for (let i = 0; i < d; i++) s += `<rect class="g3m-fr-part${i < n ? ' is-on' : ''}" data-part="${i}" x="${10 + i * pw}" y="10" width="${pw}" height="56"/>`;
  s += `<rect class="g3m-fr-edge" x="10" y="10" width="${W}" height="56"/>`;
  if (label) s += `<text class="g3m-fr-lab" x="${10 + W + 8}" y="45">${label}</text>`;
  return `<svg viewBox="0 0 ${label ? 420 : 360} 76" role="img" aria-label="A bar cut into ${d} equal parts with ${n} shaded.">${s}</svg>`;
}

/** A circle cut into d equal slices, the first n shaded. */
export function circleSvg(n: number, d: number): string {
  const R = 70;
  const c = 80;
  let s = '';
  for (let i = 0; i < d; i++) {
    const a0 = (i / d) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((i + 1) / d) * 2 * Math.PI - Math.PI / 2;
    const p = (a: number) => `${(c + R * Math.cos(a)).toFixed(2)} ${(c + R * Math.sin(a)).toFixed(2)}`;
    s += `<path class="g3m-fr-part${i < n ? ' is-on' : ''}" data-part="${i}" d="M${c} ${c} L${p(a0)} A${R} ${R} 0 ${d === 1 ? 1 : 0} 1 ${p(a1)} Z"/>`;
  }
  return `<svg viewBox="0 0 160 160" role="img" aria-label="A circle cut into ${d} equal slices with ${n} shaded.">${s}</svg>`;
}

/** A set of d equal groups of k counters; the first n groups shaded. */
export function setSvg(n: number, d: number, k: number): string {
  const gw = 64;
  const perRow = 6;
  const W = Math.max(Math.min(d, perRow), 4) * gw + 10;
  const off = (W - Math.min(d, perRow) * gw - 10) / 2;
  let s = '';
  for (let g = 0; g < d; g++) {
    const x = off + 8 + (g % perRow) * gw;
    const y = 8 + Math.floor(g / perRow) * 64;
    s += `<rect class="g3m-fr-group${g < n ? ' is-on' : ''}" data-part="${g}" x="${x}" y="${y}" width="${gw - 8}" height="56" rx="10"/>`;
    // Counters in rows of 3, centred in their group.
    const x0 = x + 28 - ((Math.min(k, 3) - 1) * 14) / 2;
    const y0 = y + 28 - ((Math.ceil(k / 3) - 1) * 14) / 2;
    for (let j = 0; j < k; j++) s += `<circle class="g3m-fr-counter" cx="${x0 + (j % 3) * 14}" cy="${y0 + Math.floor(j / 3) * 14}" r="5.5"/>`;
  }
  const H = Math.ceil(d / perRow) * 64 + 10;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${d * k} counters in ${d} equal groups, ${n} groups shaded.">${s}</svg>`;
}

/** Number line from 0 to 1 in d steps, with a dot at n/d and the 1/2 mark. */
export function lineSvg(n: number, d: number): string {
  const x = (v: number) => 20 + v * 320;
  let s = `<line class="g3m-fr-axis" x1="${x(0)}" y1="50" x2="${x(1)}" y2="50"/>`;
  s += `<line class="g3m-fr-half" x1="${x(0.5)}" y1="30" x2="${x(0.5)}" y2="70"/><text class="g3m-fr-small" x="${x(0.5)}" y="24" text-anchor="middle">1/2</text>`;
  for (let i = 0; i <= d; i++) s += `<line class="g3m-fr-tick" x1="${x(i / d)}" y1="${i % d === 0 ? 38 : 43}" x2="${x(i / d)}" y2="${i % d === 0 ? 62 : 57}"/>`;
  s += `<text class="g3m-fr-num" x="${x(0)}" y="86" text-anchor="middle">0</text><text class="g3m-fr-num" x="${x(1)}" y="86" text-anchor="middle">1</text>`;
  if (n > 0 && n < d) s += `<text class="g3m-fr-pt" x="${x(n / d)}" y="86" text-anchor="middle">${n}/${d}</text>`;
  s += `<circle class="g3m-fr-dot" cx="${x(n / d)}" cy="50" r="8"/>`;
  return `<svg viewBox="0 0 360 96" role="img" aria-label="Number line from 0 to 1 in ${d} equal steps, with a dot at ${n}/${d}.">${s}</svg>`;
}
