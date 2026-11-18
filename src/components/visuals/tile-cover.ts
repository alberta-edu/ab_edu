// Tiling a region with different units (MAT4-OI5-GQ1-LO1: K1.1-K1.3, U1.4, S1.3-S1.5), and a star
// blanket design whose diamond pieces can be rearranged without changing the area (U1.3, S1.2).

export const REGION = { x: 20, y: 20, w: 240, h: 160 };
/** Side of one small square unit, in drawing units. */
export const U = 40;

export type UnitKind = 'square' | 'big' | 'triangle' | 'rect' | 'circle';

export const UNITS: Record<UnitKind, { label: string; tiles: boolean }> = {
  square: { label: 'Small squares', tiles: true },
  big: { label: 'Big squares', tiles: true },
  triangle: { label: 'Triangles', tiles: true },
  rect: { label: 'Rectangles', tiles: true },
  circle: { label: 'Circles', tiles: false },
};

/** SVG shapes that cover the region with one kind of unit. */
export function tiles(kind: UnitKind): string[] {
  const { x, y, w, h } = REGION;
  const out: string[] = [];
  const cols = w / U;
  const rows = h / U;
  if (kind === 'square') for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) out.push(`<rect x="${x + c * U}" y="${y + r * U}" width="${U}" height="${U}"/>`);
  if (kind === 'big') for (let r = 0; r < rows / 2; r++) for (let c = 0; c < cols / 2; c++) out.push(`<rect x="${x + c * 2 * U}" y="${y + r * 2 * U}" width="${2 * U}" height="${2 * U}"/>`);
  if (kind === 'rect') for (let r = 0; r < rows; r++) for (let c = 0; c < cols / 2; c++) out.push(`<rect x="${x + c * 2 * U}" y="${y + r * U}" width="${2 * U}" height="${U}"/>`);
  if (kind === 'triangle')
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const [a, b] = [x + c * U, y + r * U];
        out.push(`<path d="M${a} ${b} L${a + U} ${b} L${a} ${b + U} Z"/>`, `<path d="M${a + U} ${b} L${a + U} ${b + U} L${a} ${b + U} Z"/>`);
      }
  if (kind === 'circle') for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) out.push(`<circle cx="${x + c * U + U / 2}" cy="${y + r * U + U / 2}" r="${U / 2}"/>`);
  return out;
}

export function tileText(kind: UnitKind): string {
  const n = tiles(kind).length;
  const name = UNITS[kind].label.toLowerCase();
  if (kind === 'circle') return `${n} circles fit, but they leave gaps. The gaps are part of the area too, so circles can’t measure it.`;
  return `${n} ${name} cover the rectangle with no gaps and no overlaps. Its area is ${n} ${name}.`;
}

// ---------------------------------------------------------------- star blanket

/** Side of one diamond. */
const D = 30;
const C = Math.SQRT1_2;
/** The diamond shape, with a 45° corner at (0, 0). */
export const DIAMOND = `M0 0 L${D} 0 L${(D + D * C).toFixed(2)} ${(-D * C).toFixed(2)} L${(D * C).toFixed(2)} ${(-D * C).toFixed(2)} Z`;

export interface Piece {
  star: string;
  row: string;
  ring: number;
}

/** 32 diamonds: 8 points of 4 diamonds each. Each has a place in the star and a place in a strip. */
export function starPieces(cx = 200, cy = 200, ox = 20, oy = 380): Piece[] {
  const out: Piece[] = [];
  for (let k = 0; k < 8; k++)
    for (let i = 0; i < 2; i++)
      for (let j = 0; j < 2; j++) {
        // Position inside the point, along the two edge directions of the diamond.
        const px = i * D + j * D * C;
        const py = -j * D * C;
        const n = k * 4 + i * 2 + j;
        const col = n % 8;
        const row = Math.floor(n / 8);
        const rx = col * D + row * D * C;
        const ry = -row * D * C;
        out.push({
          star: `translate(${cx}px, ${cy}px) rotate(${-45 * k}deg) translate(${px.toFixed(2)}px, ${py.toFixed(2)}px)`,
          row: `translate(${ox}px, ${oy}px) rotate(0deg) translate(${rx.toFixed(2)}px, ${ry.toFixed(2)}px)`,
          ring: i + j,
        });
      }
  return out;
}
