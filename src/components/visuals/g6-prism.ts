// Volume of right rectangular prisms, Grade 6 (MAT6-OI5-GQ2-LO1): unit cubes drawn in isometric
// view, built one layer at a time. Pure functions for the prism-builder visual, the `prism` figure
// and the tests.

const C = Math.cos(Math.PI / 6);

/** Isometric position of a corner (x along the right, y along the left, z up), in cube widths. */
export const iso = (x: number, y: number, z: number, s: number): [number, number] => [(x - y) * C * s, (x + y) * 0.5 * s - z * s];

export interface Box {
  l: number;
  w: number;
  h: number;
}

/** Unit cubes in drawing order (back to front, bottom to top), for the first `layers` layers. */
export function cubes(b: Box, layers = b.h): [number, number, number][] {
  const out: [number, number, number][] = [];
  for (let z = 0; z < Math.min(layers, b.h); z++) for (let x = 0; x < b.l; x++) for (let y = 0; y < b.w; y++) out.push([x, y, z]);
  return out.sort((p, q) => p[0] + p[1] + p[2] * 0.01 - (q[0] + q[1] + q[2] * 0.01) || p[2] - q[2]);
}

export const volume = (b: Box) => b.l * b.w * b.h;

/** SVG of the prism, `layers` layers stacked, each cube with a top and two front faces. */
export function prismSvg(b: Box, opts: { layers?: number; s?: number; labels?: boolean; unit?: string; fresh?: number } = {}): string {
  const s = opts.s ?? 26;
  const layers = opts.layers ?? b.h;
  const list = cubes(b, layers).sort((p, q) => p[2] - q[2] || p[0] + p[1] - (q[0] + q[1]));
  const pts = (cs: [number, number, number][]) => cs.map(([x, y, z]) => iso(x, y, z, s).map((v) => v.toFixed(1)).join(',')).join(' ');
  const xs = [iso(b.l, 0, 0, s)[0], iso(0, b.w, 0, s)[0]];
  const minX = Math.min(...xs) - 50;
  const maxX = Math.max(...xs) + 50;
  const top = iso(0, 0, b.h, s)[1] - 20;
  const bottom = iso(b.l, b.w, 0, s)[1] + 40;
  let g = '';
  // Ghost outline of the whole prism, so empty layers still show its size.
  if (layers < b.h) g += `<polygon class="g6m-pr-ghost" points="${pts([[0, 0, b.h], [b.l, 0, b.h], [b.l, b.w, b.h], [0, b.w, b.h]])}"/><polyline class="g6m-pr-ghost" points="${pts([[b.l, 0, 0], [b.l, 0, b.h]])}"/><polyline class="g6m-pr-ghost" points="${pts([[0, b.w, 0], [0, b.w, b.h]])}"/><polyline class="g6m-pr-ghost" points="${pts([[b.l, b.w, 0], [b.l, b.w, b.h]])}"/>`;
  for (const [x, y, z] of list) {
    const cls = opts.fresh !== undefined && z === opts.fresh ? ' g6m-pr-new' : '';
    g += `<g class="g6m-pr-cube${cls}"><polygon class="g6m-pr-top" points="${pts([[x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]])}"/><polygon class="g6m-pr-right" points="${pts([[x + 1, y, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x + 1, y, z + 1]])}"/><polygon class="g6m-pr-left" points="${pts([[x, y + 1, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]])}"/></g>`;
  }
  if (opts.labels) {
    const u = opts.unit ? ` ${opts.unit}` : '';
    const [lx, ly] = iso(b.l / 2, b.w, 0, s);
    const [wx, wy] = iso(0, b.w / 2, 0, s);
    const [hx, hy] = iso(b.l, 0, b.h / 2, s);
    g += `<text class="g6m-pr-label" x="${lx + 14}" y="${ly + 26}">${b.l}${u}</text><text class="g6m-pr-label" x="${wx - 14}" y="${wy + 26}" text-anchor="end">${b.w}${u}</text><text class="g6m-pr-label" x="${hx + 10}" y="${hy}">${b.h}${u}</text>`;
  }
  return `<svg viewBox="${minX.toFixed(0)} ${top.toFixed(0)} ${(maxX - minX).toFixed(0)} ${(bottom - top).toFixed(0)}" class="g6m-prism" role="img" aria-label="A rectangular prism ${b.l} by ${b.w} by ${b.h}${layers < b.h ? `, with ${layers} of its ${b.h} layers of cubes filled` : ', made of unit cubes'}.">${g}</svg>`;
}
