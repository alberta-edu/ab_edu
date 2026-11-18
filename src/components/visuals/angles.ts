// Angles in degrees for Grade 4 (MAT4-OI5-GQ2-LO1 and MAT4-OI3-GQ1-LO1): names by size, fractions of
// a full turn, angle pairs, and the SVG for the angle turner.

export function angleType(a: number): string {
  if (a <= 0) return 'no turn yet';
  if (a < 90) return 'acute';
  if (a === 90) return 'right';
  if (a < 180) return 'obtuse';
  if (a === 180) return 'straight';
  if (a < 360) return 'more than a straight angle';
  return 'a full turn';
}

/** 90 → "1/4 of a full turn". Only for the benchmarks the curriculum names. */
export function turnText(a: number): string {
  const f: Record<number, string> = { 90: '1/4 of a full turn', 180: '1/2 of a full turn', 270: '3/4 of a full turn', 360: 'a full turn' };
  return f[a] ?? '';
}

/** The benchmark closest to an angle. */
export const BENCHMARKS = [45, 90, 180, 270, 360];
export const nearestBenchmark = (a: number) => BENCHMARKS.reduce((b, x) => (Math.abs(x - a) < Math.abs(b - a) ? x : b));

/** "30° + 60° = 90°. They are complementary angles." */
export function pairText(a: number, total: 90 | 180): string {
  const name = total === 90 ? 'complementary' : 'supplementary';
  return `${a}° + ${total - a}° = ${total}°. They are ${name} angles.`;
}

const CX = 200;
const CY = 160;
const pt = (deg: number, r: number) => {
  const t = (deg * Math.PI) / 180;
  return [CX + r * Math.cos(t), CY - r * Math.sin(t)].map((v) => v.toFixed(1)).join(' ');
};

function sector(from: number, to: number, r: number, cls: string): string {
  if (to - from >= 360) return `<circle class="${cls}" cx="${CX}" cy="${CY}" r="${r}"/>`;
  if (to <= from) return '';
  const large = to - from > 180 ? 1 : 0;
  return `<path class="${cls}" d="M${CX} ${CY} L${pt(from, r)} A${r} ${r} 0 ${large} 0 ${pt(to, r)} Z"/>`;
}

const arm = (deg: number, cls = 'g4m-at-arm') => `<line class="${cls}" x1="${CX}" y1="${CY}" x2="${pt(deg, 140).split(' ')[0]}" y2="${pt(deg, 140).split(' ')[1]}"/>`;

function protractor(): string {
  let s = `<path class="g4m-at-pro" d="M${CX - 130} ${CY} A130 130 0 0 1 ${CX + 130} ${CY} Z"/>`;
  for (let d = 0; d <= 180; d += 5) {
    const long = d % 10 === 0;
    s += `<line class="g4m-at-tick" x1="${pt(d, 130).split(' ')[0]}" y1="${pt(d, 130).split(' ')[1]}" x2="${pt(d, long ? 116 : 122).split(' ')[0]}" y2="${pt(d, long ? 116 : 122).split(' ')[1]}"/>`;
    if (d % 30 === 0) {
      const [x, y] = pt(d, 102).split(' ');
      s += `<text class="g4m-at-deg" x="${x}" y="${Number(y) + 4}" text-anchor="middle">${d}</text>`;
    }
  }
  return s;
}

/** One angle from 0° (pointing right) turning counterclockwise. */
export function angleSvg(a: number, opts: { protractor?: boolean } = {}): string {
  let s = '';
  for (let d = 0; d < 360; d += 10) s += `<circle class="g4m-at-dot" cx="${pt(d, 146).split(' ')[0]}" cy="${pt(d, 146).split(' ')[1]}" r="1.6"/>`;
  if (opts.protractor !== false) s += protractor();
  s += sector(0, a, 46, 'g4m-at-fill');
  if (a === 90) s += `<path class="g4m-at-square" d="M${CX + 18} ${CY} L${CX + 18} ${CY - 18} L${CX} ${CY - 18}"/>`;
  s += arm(0, 'g4m-at-arm g4m-at-base') + arm(a) + `<circle class="g4m-at-handle" cx="${pt(a, 140).split(' ')[0]}" cy="${pt(a, 140).split(' ')[1]}" r="11"/>`;
  return s + `<circle class="g4m-at-vertex" cx="${CX}" cy="${CY}" r="5"/>`;
}

/** Two angles side by side that share an arm, making 90° or 180° together. */
export function pairSvg(a: number, total: 90 | 180): string {
  let s = protractor();
  s += sector(0, a, 52, 'g4m-at-fill') + sector(a, total, 40, 'g4m-at-fill2');
  if (total === 90) s += `<path class="g4m-at-square" d="M${CX + 70} ${CY} L${CX + 70} ${CY - 70} L${CX} ${CY - 70}" style="opacity:.35"/>`;
  s += arm(0, 'g4m-at-arm g4m-at-base') + arm(total, 'g4m-at-arm g4m-at-base') + arm(a) + `<circle class="g4m-at-handle" cx="${pt(a, 140).split(' ')[0]}" cy="${pt(a, 140).split(' ')[1]}" r="11"/>`;
  const [lx, ly] = pt(a / 2, 70).split(' ');
  const [rx, ry] = pt((a + total) / 2, 70).split(' ');
  s += `<text class="g4m-at-lab" x="${lx}" y="${ly}" text-anchor="middle">${a}°</text><text class="g4m-at-lab g4m-at-lab2" x="${rx}" y="${ry}" text-anchor="middle">${total - a}°</text>`;
  return s + `<circle class="g4m-at-vertex" cx="${CX}" cy="${CY}" r="5"/>`;
}

/** Angle from the vertex to a point in SVG units, 0 to 360. */
export function angleAt(x: number, y: number): number {
  const d = (Math.atan2(CY - y, x - CX) * 180) / Math.PI;
  return Math.round(d < 0 ? d + 360 : d);
}
