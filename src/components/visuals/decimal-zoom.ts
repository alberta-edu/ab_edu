// Zooming number line: a window of 10 equal steps (ones, tenths, hundredths or
// thousandths). Zooming in splits one step into 10 smaller ones, showing that there is
// always another decimal between two decimals. A target number is rounded at each level.

export interface ZoomView {
  /** Exponent of the step size: 0 → steps of 1, -1 → 0.1, -2 → 0.01, -3 → 0.001. */
  exp: number;
  /** Left end of the window, as an integer number of steps (left = start × 10^exp). */
  start: number;
}

const PLACE = { 0: 'one', [-1]: 'tenth', [-2]: 'hundredth', [-3]: 'thousandth' } as Record<number, string>;

/** Exact decimal text for n × 10^exp (no floating-point noise). */
export function fmt(n: number, exp: number): string {
  if (exp >= 0) return String(n * 10 ** exp);
  const neg = n < 0;
  const s = String(Math.abs(n)).padStart(-exp + 1, '0');
  const out = `${s.slice(0, exp)}.${s.slice(exp)}`;
  return neg ? `-${out}` : out;
}

/** Target as an integer count of thousandths, so all comparisons are exact. */
export const toMilli = (t: string) => Math.round(Number(t) * 1000);

export function zoomSvg(view: ZoomView, target: string | null): string {
  const W = 700;
  const x0 = 30;
  const x1 = W - 30;
  const y = 70;
  const step = (x1 - x0) / 10;
  let out = `<line class="dz-axis" x1="${x0 - 14}" y1="${y}" x2="${x1 + 14}" y2="${y}"/>`;
  for (let i = 0; i <= 10; i++) {
    const x = x0 + i * step;
    const major = i === 0 || i === 10 || i === 5;
    out += `<line class="dz-tick${major ? ' dz-tick--major' : ''}" x1="${x}" y1="${y - (major ? 14 : 9)}" x2="${x}" y2="${y + (major ? 14 : 9)}"/>`;
    out += `<text class="dz-num${major ? ' dz-num--major' : ''}" x="${x}" y="${y + 38}" text-anchor="middle">${fmt(view.start + i, view.exp)}</text>`;
    if (i < 10) out += `<rect class="dz-hit" data-seg="${i}" x="${x}" y="${y - 26}" width="${step}" height="52"><title>Zoom in between ${fmt(view.start + i, view.exp)} and ${fmt(view.start + i + 1, view.exp)}</title></rect>`;
  }
  if (target !== null) {
    const t = toMilli(target);
    const unit = 10 ** (view.exp + 3); // thousandths per step
    const left = view.start * unit;
    const pos = (t - left) / unit;
    if (pos >= 0 && pos <= 10) {
      const x = x0 + pos * step;
      out += `<line class="dz-target-line" x1="${x}" y1="${y - 30}" x2="${x}" y2="${y}"/>`;
      out += `<circle class="dz-target" cx="${x}" cy="${y}" r="9"/>`;
      out += `<text class="dz-target-label" x="${x}" y="${y - 38}" text-anchor="middle">${target}</text>`;
    }
  }
  return `<svg viewBox="0 0 ${W} 130" class="dz-svg" role="img" aria-label="Number line from ${fmt(view.start, view.exp)} to ${fmt(view.start + 10, view.exp)} in steps of ${fmt(1, view.exp)}.">${out}</svg>`;
}

/** Sentence describing where the target sits in the window and how it rounds at this level. */
export function roundingText(view: ZoomView, target: string): string {
  const t = toMilli(target);
  const unit = 10 ** (view.exp + 3);
  const lowSteps = Math.floor(t / unit);
  const lo = fmt(lowSteps, view.exp);
  const hi = fmt(lowSteps + 1, view.exp);
  const rem = t - lowSteps * unit;
  if (rem === 0) return `${target} sits exactly on ${lo}.`;
  const nearest = rem * 2 >= unit ? hi : lo;
  const tie = rem * 2 === unit ? ` It is exactly halfway, so it rounds up.` : '';
  return `${target} is between ${lo} and ${hi}. It is closer to ${nearest}, so rounded to the nearest ${PLACE[view.exp]} it is ${nearest}.${tie}`;
}
