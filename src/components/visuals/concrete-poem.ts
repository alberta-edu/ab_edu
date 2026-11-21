// Paths for concrete poems (LANENG4-OI1-GQ1-LO1, K5.5): the words of the poem run along a shape that
// matches its topic, such as a snail's spiral shell or the round sun.

export type PoemShape = 'spiral' | 'circle';

const f = (n: number) => Math.round(n * 10) / 10;

/** An Archimedean spiral, from the outside in, as an SVG path of short line segments. */
export function spiralPath(cx: number, cy: number, outer: number, inner: number, turns: number, steps = 240): string {
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = Math.PI + t * turns * 2 * Math.PI;
    const r = outer - (outer - inner) * t;
    pts.push(`${i ? 'L' : 'M'}${f(cx + r * Math.cos(angle))} ${f(cy + r * Math.sin(angle))}`);
  }
  return pts.join(' ');
}

/** A circle that starts on the left and runs clockwise, so text along it reads upright across the top. */
export function circlePath(cx: number, cy: number, r: number): string {
  return `M${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy}`;
}

/** Rough length of a path made by spiralPath, to check that a poem fits. */
export function spiralLength(outer: number, inner: number, turns: number): number {
  return ((outer + inner) / 2) * 2 * Math.PI * turns;
}

export function shapePath(shape: PoemShape): string {
  return shape === 'spiral' ? spiralPath(160, 160, 140, 22, 3.6) : circlePath(160, 160, 105);
}

/** How many characters fit along a shape at the poem font size (about 8 units per character). */
export function capacity(shape: PoemShape): number {
  const length = shape === 'spiral' ? spiralLength(140, 22, 3.6) : 2 * Math.PI * 105;
  return Math.floor(length / 8.2);
}
