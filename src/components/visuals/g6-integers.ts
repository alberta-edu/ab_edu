// Positive and negative numbers for Grade 6 (MAT6-OI1-GQ1-LO1): a number line that can stand
// sideways or upright (a thermometer, sea level), and zero pairs for adding and subtracting.
// Pure functions, shared by the visuals, the problem figures and the tests.

/** "−4", "+4" or "0". The proper minus sign, never a hyphen. */
export const signed = (n: number, plus = true) => (n < 0 ? `−${Math.abs(n)}` : n > 0 && plus ? `+${n}` : String(n));
/** Plain form for sums: negatives in brackets after an operator, like 5 + (−3). */
export const term = (n: number) => (n < 0 ? `(−${Math.abs(n)})` : String(n));

export type LineView = 'line' | 'thermometer' | 'elevation' | 'money';

export interface LinePoint {
  v: number;
  label?: string;
  /** A faint marker, such as the opposite of a chosen number. */
  ghost?: boolean;
}

export interface LineOptions {
  min: number;
  max: number;
  points?: LinePoint[];
  /** Upright line (thermometer, sea level) instead of sideways. */
  vertical?: boolean;
  /** Bracket from zero to this number, labelled with its magnitude. */
  magnitude?: number;
  /** Arrows for a sum: from 0 to a, then on by b. */
  jumps?: { from: number; to: number }[];
  view?: LineView;
  /** Label every tick, or every second one. */
  every?: number;
}

const UNIT: Record<LineView, string> = { line: '', thermometer: ' °C', elevation: ' m', money: '' };

/** A tick label: "−4", "4" or, for money, "−$4". */
export function tickLabel(v: number, view: LineView = 'line'): string {
  if (view === 'money') return v < 0 ? `−$${-v}` : `$${v}`;
  return v < 0 ? `−${-v}` : String(v);
}

/** What a number means in a context: "4 °C below zero", "owes $4". */
export function meaning(v: number, view: LineView): string {
  const m = Math.abs(v);
  if (view === 'thermometer') return v === 0 ? '0 °C, the freezing point of water' : `${m} °C ${v < 0 ? 'below' : 'above'} zero`;
  if (view === 'elevation') return v === 0 ? 'at sea level' : `${m} m ${v < 0 ? 'below' : 'above'} sea level`;
  if (view === 'money') return v === 0 ? 'owes nothing and has nothing' : v < 0 ? `owes $${m} (a debt)` : `has $${m}`;
  return v === 0 ? 'zero: neither positive nor negative' : `${m} unit${m === 1 ? '' : 's'} ${v < 0 ? 'left of' : 'right of'} zero`;
}

/** "−4 < 2", from the positions on the line. */
export const compareSymbol = (a: number, b: number) => (a < b ? '<' : a > b ? '>' : '=');

/** Draws the number line as SVG. Class names start with g6m-, colours come from the site's variables. */
export function lineSvg(o: LineOptions): string {
  const view = o.view ?? (o.vertical ? 'thermometer' : 'line');
  const vertical = o.vertical ?? (view === 'thermometer' || view === 'elevation');
  const span = o.max - o.min;
  const every = o.every ?? (span > 12 ? 2 : 1);
  const len = vertical ? 340 : Math.min(340, Math.max(200, span * 28));
  const step = len / span;
  const L = 40; // room for the arrowheads
  // Position along the line, in px from the start.
  const at = (v: number) => L + (v - o.min) * step;
  // Map along-the-line position to x, y.
  const CX = 150; // the upright line's x
  const Y = 96; // the sideways line's y
  const xy = (v: number, off = 0): [number, number] => (vertical ? [CX + off, L + len - (v - o.min) * step] : [at(v), Y - off]);
  let s = '';
  const W = vertical ? 330 : len + 2 * L;
  const H = vertical ? len + 2 * L : 150;
  const fs = vertical ? 15 : 19;

  if (vertical && view === 'elevation' && o.min < 0) {
    // Water below sea level, sky above.
    const [, y0] = xy(0);
    s += `<rect x="0" y="${y0}" width="${W}" height="${H - y0}" style="fill:color-mix(in srgb, var(--math) 22%, transparent)"/>`;
    s += `<text class="g6m-ctx" x="${W - 10}" y="${y0 - 8}" text-anchor="end">sea level</text>`;
  }
  if (vertical && view === 'thermometer') {
    const [x, top] = xy(o.max);
    const [, bottom] = xy(o.min);
    s += `<rect x="${x - 34}" y="${top - 14}" width="24" height="${bottom - top + 28}" rx="12" class="g6m-tube"/>`;
    // A thermometer shows one temperature: draw the red line only when there is one point.
    const solid = (o.points ?? []).filter((q) => !q.ghost);
    const p = solid.length === 1 ? solid[0] : undefined;
    if (p) {
      const [, y] = xy(p.v);
      s += `<rect x="${x - 28}" y="${y}" width="12" height="${bottom + 10 - y}" rx="6" class="g6m-mercury"/>`;
    }
  }

  // The line itself, with arrowheads: it keeps going both ways.
  const [ax, ay] = vertical ? [CX, L - 26] : [L - 26, Y];
  const [bx, by] = vertical ? [CX, L + len + 26] : [L + len + 26, Y];
  s += `<line class="g6m-axis" x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}"/>`;
  const head = (x: number, y: number, dir: 'l' | 'r' | 'u' | 'd') => {
    const d = { l: `M${x + 12} ${y - 8} L${x} ${y} L${x + 12} ${y + 8}`, r: `M${x - 12} ${y - 8} L${x} ${y} L${x - 12} ${y + 8}`, u: `M${x - 8} ${y + 12} L${x} ${y} L${x + 8} ${y + 12}`, d: `M${x - 8} ${y - 12} L${x} ${y} L${x + 8} ${y - 12}` }[dir];
    return `<path class="g6m-head" d="${d}"/>`;
  };
  s += vertical ? head(ax, ay, 'u') + head(bx, by, 'd') : head(ax, ay, 'l') + head(bx, by, 'r');

  for (let v = o.min; v <= o.max; v++) {
    const [x, y] = xy(v);
    const major = v === 0;
    const t = major ? 11 : 7;
    s += vertical ? `<line class="g6m-tick${major ? ' g6m-zero' : ''}" x1="${x - t}" y1="${y}" x2="${x + t}" y2="${y}"/>` : `<line class="g6m-tick${major ? ' g6m-zero' : ''}" x1="${x}" y1="${y - t}" x2="${x}" y2="${y + t}"/>`;
    if (v % every === 0) {
      const text = tickLabel(v, view);
      s += vertical
        ? `<text class="g6m-num${v < 0 ? ' g6m-neg' : ''}" x="${x + 18}" y="${y + 5}" font-size="${fs}">${text}${UNIT[view]}</text>`
        : `<text class="g6m-num${v < 0 ? ' g6m-neg' : ''}" x="${x}" y="${y + 34}" text-anchor="middle" font-size="${fs}">${text}</text>`;
    }
  }

  if (o.magnitude !== undefined && o.magnitude !== 0) {
    const [x0, y0] = xy(0, vertical ? 82 : 56);
    const [x1, y1] = xy(o.magnitude, vertical ? 82 : 56);
    s += vertical
      ? `<path class="g6m-mag" d="M${x0 - 8} ${y0} H${x0} V${y1} H${x0 - 8}"/><text class="g6m-mag-label" x="${x0 + 8}" y="${(y0 + y1) / 2 + 5}">${Math.abs(o.magnitude)}</text>`
      : `<path class="g6m-mag" d="M${x0} ${y0 + 8} V${y0} H${x1} V${y0 + 8}"/><text class="g6m-mag-label" x="${(x0 + x1) / 2}" y="${y0 - 8}" text-anchor="middle">${Math.abs(o.magnitude)} from 0</text>`;
  }

  (o.jumps ?? []).forEach((j, i) => {
    if (j.from === j.to) return;
    const off = (vertical ? -1 : 1) * (30 + i * 16);
    const [x0, y0] = xy(j.from, off);
    const [x1, y1] = xy(j.to, off);
    const cls = j.to > j.from ? 'g6m-jump g6m-jump--up' : 'g6m-jump g6m-jump--down';
    // Arrowheads are drawn as paths: a marker inside a hidden lesson step would not show.
    const dir = Math.sign(j.to - j.from);
    if (vertical) s += `<path class="${cls}" d="M${x0} ${y0} V${y1} M${x1 - 7} ${y1 + dir * 9} L${x1} ${y1} L${x1 + 7} ${y1 + dir * 9}"/>`;
    else s += `<path class="${cls}" d="M${x0} ${y0} H${x1} M${x1 - dir * 9} ${y1 - 7} L${x1} ${y1} L${x1 - dir * 9} ${y1 + 7}"/>`;
  });

  for (const p of o.points ?? []) {
    const [x, y] = xy(p.v);
    s += `<circle class="${p.ghost ? 'g6m-pt g6m-pt--ghost' : 'g6m-pt'}" cx="${x}" cy="${y}" r="8"/>`;
    if (p.label) {
      s += vertical
        ? `<text class="g6m-pt-label" x="${x - 46}" y="${y + 5}" text-anchor="end">${p.label}</text>`
        : `<text class="g6m-pt-label" x="${x}" y="${y - 16}" text-anchor="middle">${p.label}</text>`;
    }
  }
  const desc = `${vertical ? 'Upright' : 'Sideways'} number line from ${tickLabel(o.min, view)} to ${tickLabel(o.max, view)}${(o.points ?? []).length ? `, with points at ${(o.points ?? []).map((p) => `${p.label ? `${p.label} ` : ''}${signed(p.v, false)}`).join(', ')}` : ''}.`;
  return `<svg viewBox="0 0 ${W} ${H}" class="g6m-line${vertical ? ' g6m-line--v' : ''}" role="img" aria-label="${desc}">${s}</svg>`;
}

// ---------------------------------------------------------------- zero pairs

export interface PairStep {
  /** What happens at this step. */
  phase: 'first' | 'flip' | 'second' | 'pair' | 'result';
  /** Counters in the top row (the first number) and bottom row (what is added): +1 or −1 each. */
  top: number[];
  bottom: number[];
  /** How many opposite pairs are matched (shown at "pair", gone at "result"). */
  pairs: number;
  caption: string;
}

const counters = (n: number) => Array.from({ length: Math.abs(n) }, () => Math.sign(n));

/**
 * Steps for a + b or a − b with counters. Subtraction is first rewritten as adding the
 * opposite (K3.1), then every sum is "zero plus what is left" (K2.5).
 */
export function zeroPairSteps(a: number, op: '+' | '−', b: number): PairStep[] {
  const add = op === '+' ? b : -b;
  const result = a + add;
  const pairs = Math.sign(a) === -Math.sign(add) ? Math.min(Math.abs(a), Math.abs(add)) : 0;
  const steps: PairStep[] = [];
  const kind = (n: number) => (n > 0 ? 'positive' : 'negative');
  steps.push({
    phase: 'first',
    top: counters(a),
    bottom: [],
    pairs: 0,
    caption: a === 0 ? 'Start with nothing: zero.' : `Start with ${signed(a, false)}: ${Math.abs(a)} ${kind(a)} counter${Math.abs(a) === 1 ? '' : 's'}.`,
  });
  if (op === '−') {
    steps.push({
      phase: 'flip',
      top: counters(a),
      bottom: counters(add),
      pairs: 0,
      caption: `Subtracting ${signed(b, false)} is the same as adding its opposite, ${signed(-b, false)}. So ${term(a)} − ${term(b)} = ${term(a)} + ${term(add)}.`,
    });
  } else {
    steps.push({
      phase: 'second',
      top: counters(a),
      bottom: counters(add),
      pairs: 0,
      caption: add === 0 ? 'Add zero: nothing changes.' : `Add ${signed(add, false)}: ${Math.abs(add)} ${kind(add)} counter${Math.abs(add) === 1 ? '' : 's'}.`,
    });
  }
  if (pairs) {
    steps.push({
      phase: 'pair',
      top: counters(a),
      bottom: counters(add),
      pairs,
      caption: `Match each positive with a negative. +1 and −1 make 0, so ${pairs} pair${pairs === 1 ? ' is' : 's are'} worth zero.`,
    });
  } else if (a !== 0 && add !== 0) {
    steps.push({
      phase: 'pair',
      top: counters(a),
      bottom: counters(add),
      pairs: 0,
      caption: `All the counters are ${kind(a)}, so there are no zero pairs. They just join up.`,
    });
  }
  const zeroPart = pairs ? `0 + ${term(result)}` : '';
  steps.push({
    phase: 'result',
    top: counters(result),
    bottom: [],
    pairs: 0,
    caption:
      result === 0
        ? `Every counter was in a zero pair. ${term(a)} + ${term(add)} = 0: a number plus its opposite is zero.`
        : `${term(a)} + ${term(add)} = ${zeroPart ? `${zeroPart} = ` : ''}${signed(result, false)}.`,
  });
  return steps;
}

/** Ways to write zero as a sum of a number and its opposite, or of more integers (S2.2). */
export const zeroSums = (n: number) => [`${n} + ${term(-n)}`, `${term(-n)} + ${n}`];
