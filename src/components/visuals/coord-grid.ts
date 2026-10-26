// First-quadrant coordinate grid drawing, shared by the interactive grid and problem figures
// (MAT5-OI4-GQ1-LO1).

export interface GridPoint {
  x: number;
  y: number;
  label?: string;
}

export const CELL = 34;
export const PAD = 36;

/** Screen position of a grid point. */
export const at = (x: number, y: number, size: number): [number, number] => [PAD + x * CELL, PAD + (size - y) * CELL];

export function gridSvg(size: number, points: GridPoint[] = [], polygon: [number, number][] = [], opts: { interactive?: boolean } = {}): string {
  const W = PAD * 2 + size * CELL;
  let s = '';
  for (let i = 0; i <= size; i++) {
    const [x] = at(i, 0, size);
    const [, y] = at(0, i, size);
    s += `<line class="cg-line" x1="${x}" y1="${PAD}" x2="${x}" y2="${PAD + size * CELL}"/>`;
    s += `<line class="cg-line" x1="${PAD}" y1="${y}" x2="${PAD + size * CELL}" y2="${y}"/>`;
    s += `<text class="cg-num" x="${x}" y="${PAD + size * CELL + 20}" text-anchor="middle">${i}</text>`;
    if (i > 0) s += `<text class="cg-num" x="${PAD - 12}" y="${y + 5}" text-anchor="end">${i}</text>`;
  }
  const [ox, oy] = at(0, 0, size);
  s += `<line class="cg-axis" x1="${ox}" y1="${oy}" x2="${ox + size * CELL + 14}" y2="${oy}"/><line class="cg-axis" x1="${ox}" y1="${oy}" x2="${ox}" y2="${PAD - 14}"/>`;
  s += `<text class="cg-axis-label" x="${ox + size * CELL + 16}" y="${oy + 5}">x</text><text class="cg-axis-label" x="${ox - 5}" y="${PAD - 18}" text-anchor="middle">y</text>`;
  if (polygon.length) {
    s += `<polygon class="cg-poly" points="${polygon.map(([x, y]) => at(x, y, size).join(',')).join(' ')}"/>`;
  }
  for (const p of points) {
    const [x, y] = at(p.x, p.y, size);
    s += `<circle class="cg-pt" cx="${x}" cy="${y}" r="6"/>`;
    if (p.label) s += `<text class="cg-pt-label" x="${x + 9}" y="${y - 9}">${p.label}</text>`;
  }
  if (opts.interactive) s += `<g data-cg="layer"></g><rect class="cg-hit" x="${PAD - CELL / 2}" y="${PAD - CELL / 2}" width="${(size + 1) * CELL}" height="${(size + 1) * CELL}"/>`;
  return `<svg viewBox="0 0 ${W + 20} ${W + 10}" class="cg-svg" role="img" aria-label="Coordinate grid from 0 to ${size}${points.length ? ` with points ${points.map((p) => `${p.label ?? ''}(${p.x}, ${p.y})`).join(', ')}` : ''}.">${s}</svg>`;
}

/** Positional directions from one point to another: "3 right and 2 up". */
export function directions(from: GridPoint, to: GridPoint): string {
  const parts: string[] = [];
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (dx) parts.push(`${Math.abs(dx)} ${dx > 0 ? 'right' : 'left'}`);
  if (dy) parts.push(`${Math.abs(dy)} ${dy > 0 ? 'up' : 'down'}`);
  return parts.join(' and ') || 'no move';
}
