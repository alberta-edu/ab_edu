// The Cartesian plane for Grade 6 (MAT6-OI4-GQ1-LO1): four quadrants, points, polygons, and their
// images after a translation, a reflection over an axis, or a rotation about a vertex. Pure
// functions for the cartesian-plane and transform-lab visuals, the `plane` figure and the tests.

export type P = [number, number];

export const CELL = 26;

/** "(−3, 2)" with real minus signs. */
export const coord = ([x, y]: P) => `(${x < 0 ? `−${-x}` : x}, ${y < 0 ? `−${-y}` : y})`;

export interface PlanePoly {
  pts: P[];
  /** 'a' the original, 'b' the image. */
  tone?: 'a' | 'b';
  /** Vertex labels, like ['A', 'B', 'C'] or ["A'", "B'", "C'"]. */
  labels?: string[];
}

export interface PlaneOptions {
  /** The axes run from −r to r. */
  r: number;
  points?: { x: number; y: number; label?: string }[];
  polys?: PlanePoly[];
  /** A rotation centre to mark. */
  centre?: P;
  interactive?: boolean;
}

/** Screen position of a point. */
export const PAD = 32;
export const at = (r: number, [x, y]: P): P => [PAD + (x + r) * CELL, PAD + (r - y) * CELL];

export function planeSvg(o: PlaneOptions): string {
  const r = o.r;
  const W = 2 * PAD + 2 * r * CELL;
  let s = '';
  for (let i = -r; i <= r; i++) {
    const [x] = at(r, [i, 0]);
    const [, y] = at(r, [0, i]);
    if (i) s += `<line class="g6m-pl-line" x1="${x}" y1="${PAD}" x2="${x}" y2="${W - PAD}"/><line class="g6m-pl-line" x1="${PAD}" y1="${y}" x2="${W - PAD}" y2="${y}"/>`;
  }
  const [ox, oy] = at(r, [0, 0]);
  s += `<line class="g6m-axis" x1="8" y1="${oy}" x2="${W - 8}" y2="${oy}"/><line class="g6m-axis" x1="${ox}" y1="8" x2="${ox}" y2="${W - 8}"/>`;
  s += `<path class="g6m-head" d="M${W - 18} ${oy - 7} L${W - 8} ${oy} L${W - 18} ${oy + 7} M18 ${oy - 7} L8 ${oy} L18 ${oy + 7} M${ox - 7} 18 L${ox} 8 L${ox + 7} 18 M${ox - 7} ${W - 18} L${ox} ${W - 8} L${ox + 7} ${W - 18}"/>`;
  for (let i = -r; i <= r; i++) {
    if (!i || (r > 6 && i % 2)) continue;
    const [x] = at(r, [i, 0]);
    const [, y] = at(r, [0, i]);
    const t = i < 0 ? `−${-i}` : String(i);
    s += `<text class="g6m-pl-num" x="${x}" y="${oy + 18}" text-anchor="middle">${t}</text><text class="g6m-pl-num" x="${ox - 6}" y="${y + 5}" text-anchor="end">${t}</text>`;
  }
  s += `<text class="g6m-pl-num" x="${ox - 6}" y="${oy + 18}" text-anchor="end">0</text>`;
  s += `<text class="g6m-pl-axis" x="${W - 10}" y="${oy - 10}" text-anchor="end">x</text><text class="g6m-pl-axis" x="${ox + 10}" y="18">y</text>`;
  for (const poly of o.polys ?? []) {
    const pts = poly.pts.map((p) => at(r, p).join(',')).join(' ');
    s += `<polygon class="g6m-pl-poly g6m-pl-poly--${poly.tone ?? 'a'}" points="${pts}"/>`;
    poly.labels?.forEach((l, i) => {
      const [x, y] = at(r, poly.pts[i]);
      s += `<circle class="g6m-pl-pt g6m-pl-pt--${poly.tone ?? 'a'}" cx="${x}" cy="${y}" r="5"/><text class="g6m-pl-label g6m-pl-label--${poly.tone ?? 'a'}" x="${x + 7}" y="${y - 7}">${l}</text>`;
    });
  }
  if (o.centre) {
    const [x, y] = at(r, o.centre);
    s += `<circle class="g6m-pl-centre" cx="${x}" cy="${y}" r="9"/>`;
  }
  for (const p of o.points ?? []) {
    const [x, y] = at(r, [p.x, p.y]);
    s += `<circle class="g6m-pl-pt" cx="${x}" cy="${y}" r="6"/>`;
    if (p.label) s += `<text class="g6m-pl-label" x="${x + 8}" y="${y - 8}">${p.label}</text>`;
  }
  if (o.interactive) s += `<g data-pl="layer"></g><rect x="0" y="0" width="${W}" height="${W}" fill="transparent" style="cursor:crosshair"/>`;
  const desc = (o.points ?? []).map((p) => `${p.label ?? ''} ${coord([p.x, p.y])}`).join(', ');
  return `<svg viewBox="0 0 ${W + 40} ${W}" class="g6m-plane" role="img" aria-label="Cartesian plane from −${r} to ${r} on both axes${desc ? `, with points ${desc}` : ''}${(o.polys ?? []).map((q) => `, a polygon with vertices ${q.pts.map(coord).join(', ')}`).join('')}.">${s}</svg>`;
}

/** "the origin", "the x-axis" or "the y-axis" for a point on an axis, else "". */
export function where([x, y]: P): string {
  if (!x && !y) return 'the origin';
  if (!y) return 'the x-axis';
  if (!x) return 'the y-axis';
  return '';
}

// ---------------------------------------------------------------- transformations

export const translateP = (pts: P[], dx: number, dy: number): P[] => pts.map(([x, y]) => [x + dx, y + dy]);
/** Reflect over the x-axis (y changes sign) or the y-axis (x changes sign). */
export const reflectP = (pts: P[], axis: 'x' | 'y'): P[] => pts.map(([x, y]) => (axis === 'x' ? [x, -y] : [-x, y]));
/** Rotate by 90, 180 or 270 degrees about a centre, clockwise (cw) or counter-clockwise (ccw). */
export function rotateP(pts: P[], deg: 90 | 180 | 270, dir: 'cw' | 'ccw', [cx, cy]: P): P[] {
  const quarter = ((dir === 'cw' ? deg : 360 - deg) / 90) % 4;
  return pts.map(([x, y]) => {
    let dx = x - cx;
    let dy = y - cy;
    for (let i = 0; i < quarter; i++) [dx, dy] = [dy, -dx];
    return [cx + dx + 0, cy + dy + 0] as P;
  });
}
