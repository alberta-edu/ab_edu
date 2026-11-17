// Functions for Grade 6 (MAT6-OI6-GQ1-LO1): a rule y = a·x + b shown as a machine, a table of values
// and points in the Cartesian plane. Pure functions for the function-machine visual and the tests.

export interface Rule {
  /** y = a·x + b */
  a: number;
  b: number;
  /** Letters and names for the independent (x) and dependent (y) variables. */
  x: string;
  y: string;
  xName: string;
  yName: string;
}

export const value = (r: Rule, x: number) => r.a * x + r.b;

/** "h = 2t + 3", "d = 5t". */
export const equation = (r: Rule) => `${r.y} = ${r.a === 1 ? '' : r.a}${r.x}${r.b ? ` + ${r.b}` : ''}`;

/** In words: "multiply by 2, then add 3". */
export const ruleWords = (r: Rule) => `multiply by ${r.a}${r.b ? `, then add ${r.b}` : ''}`;

/** Working backwards from y to x: undo + b, then undo × a. Null when there is no whole-number x. */
export function inputFor(r: Rule, y: number): number | null {
  const x = (y - r.b) / r.a;
  return Number.isInteger(x) && x >= 0 ? x : null;
}

/** Points (x, y) for x = 0 … n, plotted on a first-quadrant grid scaled to fit. */
export function graphSvg(r: Rule, n: number, hi?: number): string {
  const ys = Array.from({ length: n + 1 }, (_, x) => value(r, x));
  const maxY = Math.max(...ys);
  const stepY = maxY <= 12 ? 1 : maxY <= 30 ? 5 : 10;
  const topY = Math.ceil(maxY / stepY) * stepY;
  const W = 300;
  const H = 220;
  const X = (x: number) => 46 + (x / n) * (W - 66);
  const Y = (y: number) => H - 36 - (y / topY) * (H - 60);
  let s = '';
  for (let y = 0; y <= topY; y += stepY) s += `<line class="g6m-pl-line" x1="${X(0)}" y1="${Y(y)}" x2="${X(n)}" y2="${Y(y)}"/><text class="g6m-pl-num" x="${X(0) - 6}" y="${Y(y) + 4}" text-anchor="end">${y}</text>`;
  for (let x = 0; x <= n; x++) s += `<line class="g6m-pl-line" x1="${X(x)}" y1="${Y(0)}" x2="${X(x)}" y2="${Y(topY)}"/><text class="g6m-pl-num" x="${X(x)}" y="${Y(0) + 16}" text-anchor="middle">${x}</text>`;
  s += `<line class="g6m-axis" x1="${X(0)}" y1="${Y(0)}" x2="${X(n) + 10}" y2="${Y(0)}"/><line class="g6m-axis" x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(topY) - 10}"/>`;
  s += `<text class="g6m-pl-axis" x="${X(n) + 12}" y="${Y(0) + 4}">${r.x}</text><text class="g6m-pl-axis" x="${X(0) - 4}" y="${Y(topY) - 14}" text-anchor="middle">${r.y}</text>`;
  ys.forEach((y, x) => (s += `<circle class="g6m-pl-pt${x === hi ? ' g6m-fm-hi' : ''}" cx="${X(x)}" cy="${Y(y)}" r="${x === hi ? 8 : 6}"/>`));
  return `<svg viewBox="0 0 ${W + 20} ${H}" class="g6m-plane" role="img" aria-label="Points for ${equation(r)}, from ${r.x} = 0 to ${n}: ${ys.map((y, x) => `(${x}, ${y})`).join(', ')}.">${s}</svg>`;
}
