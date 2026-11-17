// Relative frequency and chance, Grade 6 (MAT6-OI8-GQ1-LO1): run an experiment with equally likely
// outcomes many times and watch the relative frequency of an event settle near its likelihood.
// The curriculum's examples: a head on a coin, an even number on a die, blue on a spinner.

export interface Experiment {
  id: 'coin' | 'die' | 'spinner';
  name: string;
  outcomes: string[];
  /** Which outcomes make the event happen. */
  event: string[];
  eventName: string;
}

export const EXPERIMENTS: Experiment[] = [
  { id: 'coin', name: 'Toss a coin', outcomes: ['head', 'tail'], event: ['head'], eventName: 'a head' },
  { id: 'die', name: 'Roll a die', outcomes: ['1', '2', '3', '4', '5', '6'], event: ['2', '4', '6'], eventName: 'an even number' },
  { id: 'spinner', name: 'Spin a spinner', outcomes: ['blue', 'red', 'yellow', 'green'], event: ['blue'], eventName: 'blue' },
];

/** Likelihood from equally likely outcomes, as [event outcomes, all outcomes]. */
export const likelihood = (e: Experiment): [number, number] => [e.event.length, e.outcomes.length];

/** One trial: an outcome index, from a random number in [0, 1). */
export const trial = (e: Experiment, r: number) => Math.min(e.outcomes.length - 1, Math.floor(r * e.outcomes.length));

/** Relative frequency three ways: "7/20", "0.35", "35%". */
export function relative(count: number, total: number): { fraction: string; decimal: string; percent: string } {
  if (!total) return { fraction: '0', decimal: '0', percent: '0%' };
  const d = count / total;
  return { fraction: `${count}/${total}`, decimal: String(Number(d.toFixed(3))), percent: `${Number((d * 100).toFixed(1))}%` };
}

/** Running relative frequency of the event after each trial (for the chart). */
export function running(results: number[], e: Experiment): number[] {
  let hits = 0;
  return results.map((r, i) => {
    if (e.event.includes(e.outcomes[r])) hits++;
    return hits / (i + 1);
  });
}

/** Line chart of the running relative frequency, with a dashed line at the likelihood. */
export function chartSvg(series: number[], expected: number): string {
  const W = 420;
  const H = 180;
  const n = Math.max(series.length, 10);
  const X = (i: number) => 40 + (i / n) * (W - 60);
  const Y = (v: number) => H - 28 - v * (H - 48);
  let s = '';
  for (const v of [0, 0.25, 0.5, 0.75, 1]) s += `<line class="g6m-pl-line" x1="40" y1="${Y(v)}" x2="${W - 20}" y2="${Y(v)}"/><text class="g6m-pl-num" x="34" y="${Y(v) + 4}" text-anchor="end">${v * 100}%</text>`;
  s += `<line class="g6m-ch-expect" x1="40" y1="${Y(expected)}" x2="${W - 20}" y2="${Y(expected)}"/>`;
  // Thin the points so a long run still draws quickly.
  const step = Math.max(1, Math.floor(series.length / 300));
  const pts = series.filter((_, i) => i % step === 0 || i === series.length - 1).map((v, k) => `${X(Math.min(series.length - 1, k * step) + 1).toFixed(1)},${Y(v).toFixed(1)}`);
  if (pts.length > 1) s += `<polyline class="g6m-ch-line" points="${pts.join(' ')}"/>`;
  s += `<line class="g6m-axis" x1="40" y1="${Y(0)}" x2="${W - 20}" y2="${Y(0)}"/><text class="g6m-pl-num" x="${W - 20}" y="${H - 6}" text-anchor="end">${series.length} trials</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Relative frequency after each trial, with a dashed line at the likelihood ${Math.round(expected * 100)}%.">${s}</svg>`;
}
