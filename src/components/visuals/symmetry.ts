// Shapes for the symmetry explorer, with their lines of reflection symmetry and order of
// rotation symmetry (MAT5-OI3-GQ1-LO1). All shapes are centred on (0, 0), radius about 100.

export interface Shape {
  id: string;
  name: string;
  /** SVG path data, centred on 0,0. */
  d: string;
  /** Angles (degrees) of the lines of reflection symmetry. 'circle' means infinitely many. */
  lines: number[] | 'circle';
  /** Order of rotation symmetry (1 = none). Infinity for a circle. */
  order: number;
  equalSides?: string;
  note?: string;
}

const poly = (pts: [number, number][]) => `M${pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join(' L')} Z`;
const regular = (n: number, r = 100, start = -90) =>
  poly(Array.from({ length: n }, (_, i) => {
    const a = ((start + (360 / n) * i) * Math.PI) / 180;
    return [r * Math.cos(a), r * Math.sin(a)] as [number, number];
  }));
/** Mirror lines of a regular n-gon with a vertex at the top. */
const regularLines = (n: number) => Array.from({ length: n }, (_, i) => 90 + (180 / n) * i);

/** Eight-pointed star, like the morning star on Plains First Nations star quilts. */
function starQuilt() {
  const pts: [number, number][] = [];
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? 100 : 48;
    const a = ((-90 + 22.5 * i) * Math.PI) / 180;
    pts.push([r * Math.cos(a), r * Math.sin(a)]);
  }
  return poly(pts);
}

/** A simple four-petal flower, in the style of Métis floral beadwork. */
function flower() {
  let d = '';
  for (let i = 0; i < 4; i++) {
    const a = (i * 90 * Math.PI) / 180;
    const tip = [Math.cos(a) * 100, Math.sin(a) * 100];
    const l = [Math.cos(a - 0.55) * 55, Math.sin(a - 0.55) * 55];
    const r = [Math.cos(a + 0.55) * 55, Math.sin(a + 0.55) * 55];
    d += `M0 0 Q${l[0].toFixed(1)} ${l[1].toFixed(1)} ${tip[0].toFixed(1)} ${tip[1].toFixed(1)} Q${r[0].toFixed(1)} ${r[1].toFixed(1)} 0 0 Z `;
  }
  return d;
}

export const SHAPES: Shape[] = [
  { id: 'triangle', name: 'Equilateral triangle', d: regular(3), lines: regularLines(3), order: 3, equalSides: '3 equal sides, 3 equal angles' },
  { id: 'square', name: 'Square', d: regular(4, 100, -45), lines: [0, 45, 90, 135], order: 4, equalSides: '4 equal sides, 4 equal angles' },
  { id: 'pentagon', name: 'Regular pentagon', d: regular(5), lines: regularLines(5), order: 5, equalSides: '5 equal sides, 5 equal angles' },
  { id: 'hexagon', name: 'Regular hexagon', d: regular(6), lines: regularLines(6), order: 6, equalSides: '6 equal sides, 6 equal angles' },
  { id: 'rectangle', name: 'Rectangle', d: poly([[-110, -60], [110, -60], [110, 60], [-110, 60]]), lines: [0, 90], order: 2, equalSides: 'opposite sides equal, 4 equal angles' },
  { id: 'isosceles', name: 'Isosceles triangle', d: poly([[0, -100], [70, 80], [-70, 80]]), lines: [90], order: 1, equalSides: '2 equal sides' },
  { id: 'parallelogram', name: 'Parallelogram', d: poly([[-110, 55], [-40, -55], [110, -55], [40, 55]]), lines: [], order: 2, equalSides: 'opposite sides equal' },
  { id: 'circle', name: 'Circle', d: 'M-100 0 A100 100 0 1 0 100 0 A100 100 0 1 0 -100 0 Z', lines: 'circle', order: Infinity },
  { id: 'star', name: 'Star quilt design', d: starQuilt(), lines: regularLines(8), order: 8, note: 'The eight-pointed star appears on star quilts made by many Plains First Nations.' },
  { id: 'flower', name: 'Floral beadwork design', d: flower(), lines: [0, 45, 90, 135], order: 4, note: 'Flowers like this appear in Métis floral beadwork.' },
];

export function describeShape(s: Shape): string {
  if (s.lines === 'circle') return 'A circle has infinitely many lines of symmetry, and it matches itself at every angle as it turns.';
  const lines = s.lines.length;
  const rot = s.order > 1 ? `It has rotation symmetry of order ${s.order}` : 'It has no rotation symmetry (order 1)';
  const central = s.order % 2 === 0 ? ', including central symmetry: it matches itself after a half turn (180°)' : '';
  return `${lines === 0 ? 'No' : lines} line${lines === 1 ? '' : 's'} of reflection symmetry. ${rot}${central}.`;
}
