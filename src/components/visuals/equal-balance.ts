// A pan balance for Grade 4 equations (MAT4-OI2-GQ1-LO1: K2.1, U2.1, S2.2-S2.4). Each side holds
// mystery boxes (all the same unknown) and cubes. Doing the same thing to both sides keeps the
// balance level; doing it to one side tips it.

export interface Side {
  boxes: number;
  cubes: number;
}

export interface SolveSpec {
  /** '+': □ + k = total.  '×': k × □ = total. */
  op: '+' | '×';
  k: number;
  total: number;
}

export interface Frame {
  left: Side;
  right: Side;
  equation: string;
  caption: string;
  /** Show this number on the boxes. */
  reveal?: number;
}

export function solveFrames(s: SolveSpec): Frame[] {
  if (s.op === '+') {
    const x = s.total - s.k;
    return [
      { left: { boxes: 1, cubes: s.k }, right: { boxes: 0, cubes: s.total }, equation: `□ + ${s.k} = ${s.total}`, caption: `The box and ${s.k} cubes balance ${s.total} cubes. What is in the box?` },
      { left: { boxes: 1, cubes: 0 }, right: { boxes: 0, cubes: x }, equation: `□ + ${s.k} − ${s.k} = ${s.total} − ${s.k}`, caption: `Take ${s.k} cubes off BOTH sides. The balance stays level.` },
      { left: { boxes: 1, cubes: 0 }, right: { boxes: 0, cubes: x }, equation: `□ = ${x}`, caption: `The box balances ${x} cubes, so □ = ${x}.`, reveal: x },
      { left: { boxes: 1, cubes: s.k }, right: { boxes: 0, cubes: s.total }, equation: `${x} + ${s.k} = ${s.total} ✓`, caption: `Check: put ${x} back in the box. ${x} + ${s.k} = ${s.total}, so both sides are equal.`, reveal: x },
    ];
  }
  const x = s.total / s.k;
  if (!Number.isInteger(x)) throw new Error(`equal-balance: ${s.total} ÷ ${s.k} is not a whole number`);
  return [
    { left: { boxes: s.k, cubes: 0 }, right: { boxes: 0, cubes: s.total }, equation: `${s.k} × □ = ${s.total}`, caption: `${s.k} boxes, all the same, balance ${s.total} cubes. What is in each box?` },
    { left: { boxes: 1, cubes: 0 }, right: { boxes: 0, cubes: x }, equation: `${s.k} × □ ÷ ${s.k} = ${s.total} ÷ ${s.k}`, caption: `Split BOTH sides into ${s.k} equal groups, and keep one group of each.` },
    { left: { boxes: 1, cubes: 0 }, right: { boxes: 0, cubes: x }, equation: `□ = ${x}`, caption: `One box balances ${x} cubes, so □ = ${x}.`, reveal: x },
    { left: { boxes: s.k, cubes: 0 }, right: { boxes: 0, cubes: s.total }, equation: `${s.k} × ${x} = ${s.total} ✓`, caption: `Check: ${s.k} × ${x} = ${s.total}, so both sides are equal.`, reveal: x },
  ];
}

export type Move = { op: '+' | '−' | '×' | '÷'; k: number; side: 'both' | 'left' };

/** Most cubes a pan can hold. */
export const MAX_CUBES = 60;

/** Apply a move to two side values. Null if a side would go below 0, above the limit, or not divide exactly. */
export function applyMove(l: number, r: number, m: Move): [number, number] | null {
  const f = (v: number) => (m.op === '+' ? v + m.k : m.op === '−' ? v - m.k : m.op === '×' ? v * m.k : v / m.k);
  const nl = f(l);
  const nr = m.side === 'both' ? f(r) : r;
  for (const v of [nl, nr]) if (v < 0 || v > MAX_CUBES || !Number.isInteger(v)) return null;
  return [nl, nr];
}

/** "8 + 2 = 8 + 2" and then "10 = 10". */
export function moveEquation(l: number, r: number, m: Move): string {
  const after = applyMove(l, r, m)!;
  const right = m.side === 'both' ? `${r} ${m.op} ${m.k}` : `${r}`;
  return `${l} ${m.op} ${m.k} = ${right}   →   ${after[0]} ${after[0] === after[1] ? '=' : '≠'} ${after[1]}`;
}

/** Tilt of the beam in degrees: positive means the left side is heavier and goes down. */
export const tilt = (l: number, r: number) => (l === r ? 0 : l > r ? -9 : 9);

/** The balance drawing. Weights are counts of cubes (a box weighs `boxValue` cubes for the tilt). */
export function balanceSvg(left: Side, right: Side, angle: number, reveal?: number): string {
  const px = 220;
  const py = 64;
  const arm = 146;
  const rad = (angle * Math.PI) / 180;
  const pan = (dir: -1 | 1, side: Side) => {
    const cx = px + dir * arm * Math.cos(rad);
    const cy = py + dir * arm * Math.sin(rad);
    const plateY = cy + 96;
    let items = '';
    const cell = 12;
    // Boxes first, then cubes in rows of 10, stacked up from the plate.
    const bw = 30;
    const boxRow = side.boxes ? Math.min(side.boxes, 4) : 0;
    for (let i = 0; i < side.boxes; i++) {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const bx = cx - (boxRow * (bw + 4)) / 2 + col * (bw + 4);
      const by = plateY - bw - row * (bw + 4) - 2;
      items += `<g class="g4m-eb-box"><rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${bw}" height="${bw}" rx="4"/><text x="${(bx + bw / 2).toFixed(1)}" y="${(by + 21).toFixed(1)}" text-anchor="middle">${reveal ?? '?'}</text></g>`;
    }
    const boxRows = Math.ceil(side.boxes / 4);
    const base = plateY - 2 - boxRows * (bw + 4);
    for (let i = 0; i < side.cubes; i++) {
      const col = i % 10;
      const row = Math.floor(i / 10);
      const perRow = Math.min(10, side.cubes - row * 10);
      const x = cx - (perRow * cell) / 2 + col * cell;
      const y = base - (row + 1) * cell;
      items += `<rect class="g4m-eb-cube" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${cell - 1}" height="${cell - 1}" rx="1.5"/>`;
    }
    return (
      `<line class="g4m-eb-string" x1="${cx.toFixed(1)}" y1="${cy.toFixed(1)}" x2="${(cx - 62).toFixed(1)}" y2="${plateY.toFixed(1)}"/>` +
      `<line class="g4m-eb-string" x1="${cx.toFixed(1)}" y1="${cy.toFixed(1)}" x2="${(cx + 62).toFixed(1)}" y2="${plateY.toFixed(1)}"/>` +
      items +
      `<rect class="g4m-eb-plate" x="${(cx - 68).toFixed(1)}" y="${plateY.toFixed(1)}" width="136" height="7" rx="3"/>`
    );
  };
  const x1 = px - arm * Math.cos(rad);
  const y1 = py - arm * Math.sin(rad);
  const x2 = px + arm * Math.cos(rad);
  const y2 = py + arm * Math.sin(rad);
  return (
    `<path class="g4m-eb-stand" d="M${px} ${py} L${px - 40} 236 L${px + 40} 236 Z"/>` +
    `<line class="g4m-eb-beam" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>` +
    `<circle class="g4m-eb-pivot" cx="${px}" cy="${py}" r="7"/>` +
    pan(-1, left) +
    pan(1, right)
  );
}
