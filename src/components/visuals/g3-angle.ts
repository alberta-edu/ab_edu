// Angles (outcome Fw_y7H1B706duQqzDkWglA): two arms meeting at a vertex, an angle as a turn,
// comparing angles by laying one on another, and checking against a paper corner (90°).

export type P = [number, number];

/** A point `r` from `c` at `deg` degrees, measured anticlockwise from pointing right (y down). */
export const at = (c: P, r: number, deg: number): P => [c[0] + r * Math.cos((deg * Math.PI) / 180), c[1] - r * Math.sin((deg * Math.PI) / 180)];

const f = (n: number) => n.toFixed(1);

/** A filled wedge from the first arm (pointing at `from` degrees) turning anticlockwise by `deg`. */
export function wedge(c: P, r: number, from: number, deg: number): string {
  if (deg <= 0) return '';
  const a = at(c, r, from);
  const b = at(c, r, from + deg);
  return `M${f(c[0])},${f(c[1])} L${f(a[0])},${f(a[1])} A${r},${r} 0 ${deg > 180 ? 1 : 0} 0 ${f(b[0])},${f(b[1])} Z`;
}

/** The little square that marks a right angle. */
export function rightMark(c: P, from: number, s = 14): string {
  const a = at(c, s, from);
  const b = at(c, s * Math.SQRT2, from + 45);
  const d = at(c, s, from + 90);
  return `M${f(a[0])},${f(a[1])} L${f(b[0])},${f(b[1])} L${f(d[0])},${f(d[1])}`;
}

/** An angle as SVG: two arms, a vertex dot and a shaded opening. `mark90: false` hides the right-angle square. */
export function angleSvg(c: P, from: number, deg: number, len: [number, number], cls = 'a', mark90 = true): string {
  const a = at(c, len[0], from);
  const b = at(c, len[1], from + deg);
  const r = Math.min(28, len[0] * 0.4, len[1] * 0.4);
  const mark = mark90 && Math.abs(deg - 90) < 0.5 ? `<path class="g3m-an-rt" d="${rightMark(c, from)}"/>` : `<path class="g3m-an-wedge is-${cls}" d="${wedge(c, r, from, deg)}"/>`;
  return `${mark}<line class="g3m-an-arm is-${cls}" x1="${f(c[0])}" y1="${f(c[1])}" x2="${f(a[0])}" y2="${f(a[1])}"/><line class="g3m-an-arm is-${cls}" x1="${f(c[0])}" y1="${f(c[1])}" x2="${f(b[0])}" y2="${f(b[1])}"/><circle class="g3m-an-vx" cx="${f(c[0])}" cy="${f(c[1])}" r="5"/>`;
}

/** Compared with a right angle. */
export function vsRight(deg: number): 'smaller' | 'right' | 'bigger' {
  if (Math.abs(deg - 90) <= 3) return 'right';
  return deg < 90 ? 'smaller' : 'bigger';
}

export const RIGHT_SAY = {
  smaller: 'The paper corner sticks out past the arm. This angle is smaller than a right angle.',
  right: 'The paper corner fits exactly. It is a right angle!',
  bigger: 'The arm opens past the paper corner. This angle is bigger than a right angle.',
};

/** What the turning arm shows. */
export function turnSay(deg: number, scene: 'plain' | 'door' | 'clock'): string {
  const thing = scene === 'door' ? 'The door' : scene === 'clock' ? 'The hand' : 'The arm';
  if (deg < 3) return `${thing} hasn’t turned yet. No opening, no angle.`;
  if (vsRight(deg) === 'right') return `${thing} made a quarter turn. That is a right angle!`;
  return deg < 90 ? `${thing} turned a little. A small turn makes a small angle.` : `${thing} turned a lot. A big turn makes a big angle.`;
}

/** Angle pairs to compare by laying one on the other. Longer arms don't make a bigger angle. */
export const PAIRS: { a: number; b: number; la: number; lb: number }[] = [
  { a: 50, b: 65, la: 150, lb: 80 },
  { a: 100, b: 80, la: 80, lb: 150 },
  { a: 70, b: 70, la: 140, lb: 90 },
];

export function compareSay(a: number, b: number): string {
  if (a === b) return 'The arms line up exactly. The angles are the same size, even though the arms are different lengths.';
  return a > b ? 'A opens wider than B. Angle A is bigger. Arm length doesn’t matter.' : 'B’s arm sticks out past A’s. Angle B is bigger. Arm length doesn’t matter.';
}

/** Things to check with a paper corner. */
export const SPOTS: { id: string; name: string; icon: string; deg: number }[] = [
  { id: 'book', name: 'Corner of a book', icon: '📖', deg: 90 },
  { id: 'pizza', name: 'Tip of a pizza slice', icon: '🍕', deg: 45 },
  { id: 'clock', name: 'Clock hands at 3:00', icon: '🕒', deg: 90 },
  { id: 'laptop', name: 'An open laptop', icon: '💻', deg: 115 },
  { id: 'scissors', name: 'Open scissors', icon: '✂️', deg: 35 },
  { id: 'window', name: 'Corner of a window', icon: '🪟', deg: 90 },
];
