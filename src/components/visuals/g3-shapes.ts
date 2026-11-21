// Polygons and their properties (MAT3-OI3-GQ1-LO1): sides, equal sides, right angles, parallel
// sides, regular or irregular, and slides, turns and flips that keep every length the same.

export type Pt = [number, number];
export interface Shape {
  id: string;
  name: string;
  /** Vertices in grid units, y down, going around the shape. */
  pts: Pt[];
}

const regular = (n: number, r: number, cx: number, cy: number): Pt[] =>
  Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n + (n % 2 === 0 ? Math.PI / n : 0);
    return [+(cx + r * Math.cos(a)).toFixed(3), +(cy + r * Math.sin(a)).toFixed(3)];
  });

export const SHAPES: Shape[] = [
  // Each shape fits in a 6 by 6 box of grid units.
  { id: 'tri-reg', name: 'Triangle', pts: regular(3, 2.6, 3, 3.3) },
  { id: 'tri-right', name: 'Triangle', pts: [[1, 1], [1, 5], [4, 5]] },
  { id: 'square', name: 'Square', pts: [[1, 1], [5, 1], [5, 5], [1, 5]] },
  { id: 'rectangle', name: 'Rectangle', pts: [[0, 1.5], [6, 1.5], [6, 4.5], [0, 4.5]] },
  { id: 'diamond', name: 'Quadrilateral', pts: [[0, 3], [3, 1], [6, 3], [3, 5]] },
  { id: 'trapezoid', name: 'Quadrilateral', pts: [[1.5, 1.5], [4.5, 1.5], [6, 4.5], [0, 4.5]] },
  { id: 'pent-reg', name: 'Pentagon', pts: regular(5, 2.5, 3, 3.1) },
  { id: 'house', name: 'Pentagon', pts: [[3, 0.5], [6, 2.5], [6, 5.5], [0, 5.5], [0, 2.5]] },
  { id: 'hex-reg', name: 'Hexagon', pts: regular(6, 2.6, 3, 3) },
  { id: 'hex-l', name: 'Hexagon', pts: [[0.5, 0.5], [2.5, 0.5], [2.5, 3.5], [5.5, 3.5], [5.5, 5.5], [0.5, 5.5]] },
  { id: 'oct-reg', name: 'Octagon', pts: regular(8, 2.7, 3, 3) },
];

export const shapeById = (id: string) => {
  const s = SHAPES.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown shape "${id}"`);
  return s;
};

const near = (a: number, b: number, tol = 0.02) => Math.abs(a - b) < tol;

export function sideLengths(pts: Pt[]): number[] {
  return pts.map((p, i) => {
    const q = pts[(i + 1) % pts.length];
    return Math.hypot(q[0] - p[0], q[1] - p[1]);
  });
}

/** Interior angles in degrees, so a dented corner reads as more than 180°. */
export function angles(pts: Pt[]): number[] {
  const n = pts.length;
  const area = pts.reduce((s, p, i) => s + p[0] * pts[(i + 1) % n][1] - pts[(i + 1) % n][0] * p[1], 0);
  const turn = Math.sign(area);
  return pts.map((p, i) => {
    const a = pts[(i - 1 + n) % n];
    const b = pts[(i + 1) % n];
    const u = [a[0] - p[0], a[1] - p[1]];
    const v = [b[0] - p[0], b[1] - p[1]];
    const inner = (Math.acos((u[0] * v[0] + u[1] * v[1]) / (Math.hypot(u[0], u[1]) * Math.hypot(v[0], v[1]))) * 180) / Math.PI;
    const cross = u[0] * v[1] - u[1] * v[0];
    return cross * turn < 0 ? inner : 360 - inner;
  });
}

/** Indexes of corners that are right angles. */
export const rightAngles = (pts: Pt[]) => angles(pts).flatMap((a, i) => (near(a, 90, 0.5) ? [i] : []));

/** Groups of sides with the same length (only groups of 2 or more). Side i joins vertex i to i + 1. */
export function equalSides(pts: Pt[]): number[][] {
  const len = sideLengths(pts);
  const groups: number[][] = [];
  len.forEach((l, i) => {
    const g = groups.find((x) => near(len[x[0]], l));
    if (g) g.push(i);
    else groups.push([i]);
  });
  return groups.filter((g) => g.length > 1);
}

/** Pairs of sides that are parallel. */
export function parallelPairs(pts: Pt[]): [number, number][] {
  const n = pts.length;
  const dir = (i: number) => {
    const p = pts[i];
    const q = pts[(i + 1) % n];
    const l = Math.hypot(q[0] - p[0], q[1] - p[1]);
    return [(q[0] - p[0]) / l, (q[1] - p[1]) / l];
  };
  const out: [number, number][] = [];
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) {
      const a = dir(i);
      const b = dir(j);
      if (near(a[0] * b[1] - a[1] * b[0], 0, 0.005)) out.push([i, j]);
    }
  return out;
}

export function isRegular(pts: Pt[]): boolean {
  const len = sideLengths(pts);
  const ang = angles(pts);
  return len.every((l) => near(l, len[0])) && ang.every((a) => near(a, ang[0], 0.5));
}

export const FAMILY: Record<number, string> = { 3: 'Triangle', 4: 'Quadrilateral', 5: 'Pentagon', 6: 'Hexagon', 8: 'Octagon' };

/** A short report for the property being looked at. */
export function propertySay(s: Shape, view: 'sides' | 'equal' | 'right' | 'parallel' | 'regular'): string {
  const n = s.pts.length;
  const name = s.name.toLowerCase();
  const a = /^[aeiou]/.test(name) ? 'an ' : 'a ';
  if (view === 'sides') return `${n} straight sides and ${n} corners. It is ${a}${name}${FAMILY[n] && FAMILY[n] !== s.name ? `, a kind of ${FAMILY[n].toLowerCase()}` : ''}.`;
  if (view === 'right') {
    const r = rightAngles(s.pts).length;
    return r === 0 ? 'The paper corner fits nowhere. No right angles.' : `The paper corner fits ${r === n ? 'every corner' : `${r} corner${r > 1 ? 's' : ''}`}: ${r} right angle${r > 1 ? 's' : ''}.`;
  }
  if (view === 'parallel') {
    const p = parallelPairs(s.pts).length;
    return p === 0 ? 'No two sides are parallel. Each pair would meet if you made them longer.' : `${p} pair${p > 1 ? 's' : ''} of parallel sides: always the same distance apart, like train tracks.`;
  }
  const g = equalSides(s.pts);
  const allSides = g.length === 1 && g[0].length === n;
  if (view === 'equal') return allSides ? 'All the sides are the same length.' : g.length === 0 ? 'No two sides are the same length.' : 'Some sides are the same length, but not all of them.';
  const ang = angles(s.pts);
  const allAngles = ang.every((x) => near(x, ang[0], 0.5));
  if (allSides && allAngles) return 'Sides all equal ✓ Angles all equal ✓ It is regular.';
  return `Sides all equal ${allSides ? '✓' : '✗'} Angles all equal ${allAngles ? '✓' : '✗'} It is irregular.`;
}

// ---------------------------------------------------------------- Slides, turns and flips

export type Move = 'slide' | 'turn' | 'flip';

export const centre = (pts: Pt[]): Pt => {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
};

const round = (p: Pt): Pt => [Math.round(p[0] * 1000) / 1000, Math.round(p[1] * 1000) / 1000];

/** Where the shape is at time t (0 to 1) of a move. Slides go right by `dx` grid units. */
export function moveAt(pts: Pt[], move: Move, t: number, dx = 5): Pt[] {
  const [cx, cy] = centre(pts);
  if (move === 'slide') return pts.map((p) => round([p[0] + dx * t, p[1]]));
  if (move === 'turn') {
    const a = (Math.PI / 2) * t;
    return pts.map(([x, y]) => round([cx + (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a), cy + (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a)]));
  }
  return pts.map(([x, y]) => round([cx + (x - cx) * (1 - 2 * t), y]));
}

/** Distances between every two vertices: a move keeps them all. */
export function distances(pts: Pt[]): number[] {
  const out: number[] = [];
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) out.push(Math.round(Math.hypot(pts[j][0] - pts[i][0], pts[j][1] - pts[i][1]) * 1000) / 1000);
  return out;
}

export const MOVE_SAY: Record<Move, string> = {
  slide: 'A slide moves every corner the same way, the same distance.',
  turn: 'A turn spins the shape around a point. Here it is a quarter turn.',
  flip: 'A flip makes a mirror image, as if you flipped a card over.',
};

// ---------------------------------------------------------------- Guess the sorting rule

export type Rule = 'right' | 'regular' | 'parallel' | 'four';
export const RULES: { id: Rule; label: string }[] = [
  { id: 'right', label: 'Has a right angle' },
  { id: 'parallel', label: 'Has parallel sides' },
  { id: 'regular', label: 'Is regular' },
  { id: 'four', label: 'Has 4 sides' },
];

export function follows(s: Shape, rule: Rule): boolean {
  if (rule === 'right') return rightAngles(s.pts).length > 0;
  if (rule === 'parallel') return parallelPairs(s.pts).length > 0;
  if (rule === 'regular') return isRegular(s.pts);
  return s.pts.length === 4;
}

/** Sorting puzzles: the shapes, split by a hidden rule. */
export const SORTS: { rule: Rule; shapes: string[] }[] = [
  { rule: 'right', shapes: ['square', 'tri-reg', 'tri-right', 'diamond', 'house', 'pent-reg'] },
  { rule: 'regular', shapes: ['pent-reg', 'rectangle', 'oct-reg', 'diamond', 'tri-reg', 'house'] },
  { rule: 'parallel', shapes: ['trapezoid', 'tri-right', 'hex-reg', 'pent-reg', 'rectangle', 'tri-reg'] },
];

// ---------------------------------------------------------------- Drawing

export type View = 'sides' | 'equal' | 'right' | 'parallel' | 'regular';
const f = (n: number) => +n.toFixed(1);

/**
 * The shape as SVG markup, with the marks for one view. `U` is pixels per grid unit. Marks carry
 * `style="--i:k"` so the page can pop them in one after another.
 */
export function shapeSvg(pts: Pt[], view: View | 'plain', U = 34, labels = false): string {
  const P = (p: Pt) => `${f(p[0] * U)},${f(p[1] * U)}`;
  const n = pts.length;
  const cx = pts.reduce((s, p) => s + p[0], 0) / n;
  const cy = pts.reduce((s, p) => s + p[1], 0) / n;
  const mid = (i: number): Pt => {
    const p = pts[i];
    const q = pts[(i + 1) % n];
    return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  };
  const unit = (a: Pt, b: Pt): Pt => {
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    return [(b[0] - a[0]) / l, (b[1] - a[1]) / l];
  };
  const outward = (i: number): Pt => {
    const d = unit(pts[i], pts[(i + 1) % n]);
    const m = mid(i);
    const nrm: Pt = [-d[1], d[0]];
    return nrm[0] * (m[0] - cx) + nrm[1] * (m[1] - cy) >= 0 ? nrm : [-nrm[0], -nrm[1]];
  };
  let sideCls: string[] = pts.map(() => 'g3m-sh-side');
  let marks = '';
  if (view === 'sides') {
    marks = pts
      .map((_, i) => {
        const m = mid(i);
        const o = outward(i);
        const c: Pt = [m[0] + o[0] * 0.45, m[1] + o[1] * 0.45];
        return `<g class="g3m-sh-pop" style="--i:${i}"><circle class="g3m-sh-badge" cx="${f(c[0] * U)}" cy="${f(c[1] * U)}" r="11"/><text class="g3m-sh-badgetext" x="${f(c[0] * U)}" y="${f(c[1] * U + 5)}" text-anchor="middle">${i + 1}</text></g>`;
      })
      .join('');
    sideCls = pts.map((_, i) => `g3m-sh-side g3m-sh-count" style="--i:${i}`);
  }
  if (view === 'equal' || view === 'regular') {
    equalSides(pts).forEach((g, k) =>
      g.forEach((i) => {
        sideCls[i] = `g3m-sh-side is-g${k % 3}`;
        const m = mid(i);
        const d = unit(pts[i], pts[(i + 1) % n]);
        const nr: Pt = [-d[1], d[0]];
        for (let t = 0; t <= k; t++) {
          const off = (t - k / 2) * 0.14;
          const c: Pt = [m[0] + d[0] * off, m[1] + d[1] * off];
          marks += `<line class="g3m-sh-tick is-g${k % 3}" x1="${f((c[0] - nr[0] * 0.2) * U)}" y1="${f((c[1] - nr[1] * 0.2) * U)}" x2="${f((c[0] + nr[0] * 0.2) * U)}" y2="${f((c[1] + nr[1] * 0.2) * U)}"/>`;
        }
      }),
    );
  }
  if (view === 'regular') {
    const ang = angles(pts);
    const kinds: number[] = [];
    ang.forEach((a) => {
      if (!kinds.some((k) => near(k, a, 0.5))) kinds.push(a);
    });
    pts.forEach((p, i) => {
      const u = unit(p, pts[(i - 1 + n) % n]);
      const v = unit(p, pts[(i + 1) % n]);
      const r = 0.5;
      const k = kinds.findIndex((x) => near(x, ang[i], 0.5));
      const large = ang[i] > 180 ? 1 : 0;
      const cross = u[0] * v[1] - u[1] * v[0];
      const sweep = (cross > 0) !== (ang[i] > 180) ? 1 : 0;
      marks += `<path class="g3m-sh-arc is-a${k % 3}" d="M${f((p[0] + u[0] * r) * U)},${f((p[1] + u[1] * r) * U)} A${f(r * U)},${f(r * U)} 0 ${large} ${sweep} ${f((p[0] + v[0] * r) * U)},${f((p[1] + v[1] * r) * U)}"/>`;
    });
  }
  if (view === 'right') {
    const right = rightAngles(pts);
    pts.forEach((p, i) => {
      const u = unit(p, pts[(i - 1 + n) % n]);
      const v = unit(p, pts[(i + 1) % n]);
      // A paper corner laid along one arm, its other edge square to it, toward the inside.
      let w: Pt = [-u[1], u[0]];
      if (w[0] * v[0] + w[1] * v[1] < 0) w = [-w[0], -w[1]];
      const s = 0.85;
      const paper = [p, [p[0] + u[0] * s, p[1] + u[1] * s], [p[0] + (u[0] + w[0]) * s, p[1] + (u[1] + w[1]) * s], [p[0] + w[0] * s, p[1] + w[1] * s]] as Pt[];
      const ok = right.includes(i);
      const m = 0.32;
      const box = [[p[0] + u[0] * m, p[1] + u[1] * m], [p[0] + (u[0] + v[0]) * m, p[1] + (u[1] + v[1]) * m], [p[0] + v[0] * m, p[1] + v[1] * m]] as Pt[];
      const inside: Pt = [p[0] + (u[0] + v[0]) * 0.42, p[1] + (u[1] + v[1]) * 0.42];
      marks += `<polygon class="g3m-sh-paper" style="--i:${i}" points="${paper.map(P).join(' ')}"/>`;
      marks += ok
        ? `<polyline class="g3m-sh-rt g3m-sh-pop" style="--i:${i + 0.6}" points="${box.map(P).join(' ')}"/>`
        : `<text class="g3m-sh-no g3m-sh-pop" style="--i:${i + 0.6}" x="${f(inside[0] * U)}" y="${f(inside[1] * U + 5)}" text-anchor="middle">✗</text>`;
    });
  }
  if (view === 'parallel') {
    parallelPairs(pts).forEach(([a, b], k) =>
      [a, b].forEach((i) => {
        sideCls[i] = `g3m-sh-side is-p${k % 4}`;
        const m = mid(i);
        let d = unit(pts[i], pts[(i + 1) % n]);
        const d0 = unit(pts[a], pts[(a + 1) % n]);
        if (d[0] * d0[0] + d[1] * d0[1] < 0) d = [-d[0], -d[1]];
        const nr: Pt = [-d[1], d[0]];
        for (let t = 0; t <= k; t++) {
          const c: Pt = [m[0] + d[0] * (t * 0.18), m[1] + d[1] * (t * 0.18)];
          const tail1: Pt = [c[0] - d[0] * 0.2 + nr[0] * 0.16, c[1] - d[1] * 0.2 + nr[1] * 0.16];
          const tail2: Pt = [c[0] - d[0] * 0.2 - nr[0] * 0.16, c[1] - d[1] * 0.2 - nr[1] * 0.16];
          marks += `<polyline class="g3m-sh-chev is-p${k % 4}" points="${P(tail1)} ${P(c)} ${P(tail2)}"/>`;
        }
      }),
    );
  }
  const fill = `<polygon class="g3m-sh-fill" points="${pts.map(P).join(' ')}"/>`;
  const sides = pts.map((p, i) => `<line class="${sideCls[i]}" x1="${f(p[0] * U)}" y1="${f(p[1] * U)}" x2="${f(pts[(i + 1) % n][0] * U)}" y2="${f(pts[(i + 1) % n][1] * U)}"/>`).join('');
  let lab = '';
  if (labels) {
    const len = sideLengths(pts);
    lab = pts
      .map((_, i) => {
        const m = mid(i);
        const o = outward(i);
        return `<text class="g3m-sh-len" x="${f((m[0] + o[0] * 0.42) * U)}" y="${f((m[1] + o[1] * 0.42) * U + 5)}" text-anchor="middle">${Math.round(len[i] * 10) / 10}</text>`;
      })
      .join('');
    lab += pts
      .map((p, i) => {
        const o: Pt = unit([cx, cy], p);
        return `<text class="g3m-sh-vx" x="${f((p[0] + o[0] * 0.4) * U)}" y="${f((p[1] + o[1] * 0.4) * U + 5)}" text-anchor="middle">${'ABCDEFGH'[i]}</text>`;
      })
      .join('');
  }
  return fill + sides + marks + lab;
}
