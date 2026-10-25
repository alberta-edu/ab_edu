// Draws fraction bars and a number line for n/d. Used at build time for the first
// paint and in the browser when the student changes the fraction.

export const UNIT_NAMES: Record<number, [string, string]> = {
  2: ['half', 'halves'],
  3: ['third', 'thirds'],
  4: ['fourth', 'fourths'],
  5: ['fifth', 'fifths'],
  6: ['sixth', 'sixths'],
  8: ['eighth', 'eighths'],
  10: ['tenth', 'tenths'],
};

export const unitName = (d: number, count: number) => UNIT_NAMES[d]?.[count === 1 ? 0 : 1] ?? `/${d}`;

export function mixedParts(n: number, d: number) {
  return { whole: Math.floor(n / d), rest: n % d };
}

export function describe(n: number, d: number): string {
  const { whole, rest } = mixedParts(n, d);
  const amount = `${n} ${unitName(d, n)}`;
  if (rest === 0) return `${amount} make exactly ${whole} whole${whole === 1 ? '' : 's'}.`;
  if (whole === 0) return `${amount} is less than 1 whole.`;
  return `${amount} = ${whole} whole${whole === 1 ? '' : 's'} and ${rest} ${unitName(d, rest)}.`;
}

export interface FractionSvgOptions {
  bars?: boolean;
  /** Show how much of each bar is shaded ("3/4", "1") at the end of the bar. */
  barLabels?: boolean;
  line?: boolean;
  /** 'value' labels the marker with n/d, a string labels it with that text (e.g. "P"), 'none' hides it. */
  marker?: 'value' | 'none' | { label: string };
}

export function fractionSvg(n: number, d: number, wholes: number, opts: FractionSvgOptions = {}): string {
  const { bars = true, barLabels = true, line = true, marker = 'value' } = opts;
  const W = 640;
  const x0 = 24;
  const barW = W - 2 * x0;
  const barH = 34;
  const gap = 12;
  const cellW = barW / d;
  let out = '';

  for (let b = 0; bars && b < wholes; b++) {
    const y = 8 + b * (barH + gap);
    for (let c = 0; c < d; c++) {
      const on = b * d + c < n;
      out += `<rect class="fx-cell${on ? ' fx-cell--on' : ''}" x="${(x0 + c * cellW).toFixed(1)}" y="${y}" width="${cellW.toFixed(1)}" height="${barH}" rx="3"/>`;
    }
    out += `<rect class="fx-bar" x="${x0}" y="${y}" width="${barW}" height="${barH}" rx="6"/>`;
    const full = Math.min(Math.max(n - b * d, 0), d);
    if (barLabels) out += `<text class="fx-bar-label" x="${W - x0 + 6}" y="${y + barH / 2 + 5}">${full === d ? '1' : full === 0 ? '' : `${full}/${d}`}</text>`;
  }

  const barsH = bars ? 8 + wholes * (barH + gap) : 0;
  if (!line) return `<svg viewBox="0 0 ${W + 20} ${barsH}" class="fx-svg" role="img" aria-label="${wholes} fraction bars, each cut into ${d} equal parts, with ${n} parts shaded.">${out}</svg>`;

  // Number line
  const ly = barsH + 34;
  const xAt = (v: number) => x0 + (v / wholes) * barW;
  out += `<line class="fx-axis" x1="${x0 - 8}" y1="${ly}" x2="${W - x0 + 8}" y2="${ly}"/>`;
  for (let t = 0; t <= wholes * d; t++) {
    const major = t % d === 0;
    const x = xAt(t / d).toFixed(1);
    out += `<line class="${major ? 'fx-tick-major' : 'fx-tick'}" x1="${x}" y1="${ly - (major ? 10 : 6)}" x2="${x}" y2="${ly + (major ? 10 : 6)}"/>`;
    if (major) out += `<text class="fx-num" x="${x}" y="${ly + 30}" text-anchor="middle">${t / d}</text>`;
  }
  // Marker with improper fraction above and mixed number below
  const mx = xAt(n / d);
  const { whole, rest } = mixedParts(n, d);
  if (marker === 'none') return `<svg viewBox="0 0 ${W + 20} ${ly + 40}" class="fx-svg" role="img" aria-label="A number line from 0 to ${wholes} with each whole cut into ${d} equal parts.">${out}</svg>`;
  if (bars) out += `<line class="fx-guide" x1="${mx.toFixed(1)}" y1="${8}" x2="${mx.toFixed(1)}" y2="${ly}"/>`;
  out += `<circle class="fx-marker" cx="${mx.toFixed(1)}" cy="${ly}" r="9"/>`;
  const text = typeof marker === 'object' ? marker.label : `${n}/${d}`;
  out += `<text class="fx-marker-label" x="${mx.toFixed(1)}" y="${ly - 18}" text-anchor="middle">${text}</text>`;
  if (typeof marker === 'object') {
    return `<svg viewBox="0 0 ${W + 20} ${ly + 40}" class="fx-svg" role="img" aria-label="A number line from 0 to ${wholes} with each whole cut into ${d} equal parts. Point ${text} is marked.">${out}</svg>`;
  }
  if (whole > 0 && rest > 0) {
    out += `<text class="fx-marker-sub" x="${mx.toFixed(1)}" y="${ly + 50}" text-anchor="middle">= ${whole} ${rest}/${d}</text>`;
  }
  const H = ly + 60;
  return `<svg viewBox="0 0 ${W + 20} ${H}" class="fx-svg" role="img" aria-label="${describe(n, d)} On the number line, ${n}/${d} is marked.">${out}</svg>`;
}
