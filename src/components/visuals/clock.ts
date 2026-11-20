// Time and duration on an analog clock (MAT4-OI7-GQ1-LO1). Times are minutes after midnight, on a
// 12-hour clock face. The minute hand's sweep shows a duration as part of a full turn.

const pad = (n: number) => String(n).padStart(2, '0');

/** 545 → "9:05" (12-hour, no a.m. or p.m.). */
export function clockText(t: number): string {
  const m = ((t % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60) % 12 || 12;
  return `${h}:${pad(m % 60)}`;
}

/** "quarter past 3", "half past 3", "quarter to 4", "3 o’clock", or "" for other times. */
export function timeName(t: number): string {
  const m = ((t % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60) % 12 || 12;
  const next = (h % 12) + 1;
  switch (m % 60) {
    case 0:
      return `${h} o’clock`;
    case 15:
      return `quarter past ${h}`;
    case 30:
      return `half past ${h}`;
    case 45:
      return `quarter to ${next}`;
    default:
      return '';
  }
}

/** The fraction of a full turn of the minute hand, for the curriculum's benchmarks. */
export function turnFraction(minutes: number): string {
  const f: Record<number, string> = { 15: '1/4', 20: '1/3', 30: '1/2', 40: '2/3', 45: '3/4', 60: '1' };
  return f[minutes] ?? '';
}

/** 95 → "1 h 35 min". */
export function hoursMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export function durationText(start: number, end: number): string {
  const d = end - start;
  if (d <= 0) return 'The end time must come after the start time.';
  const frac = turnFraction(d);
  const turn = frac === '1' ? ', one full turn of the minute hand' : frac ? `, ${frac} of a full turn of the minute hand` : '';
  return `From ${clockText(start)} to ${clockText(end)} is ${d} minutes${d >= 60 ? ` (${hoursMinutes(d)})` : ''}${turn}.`;
}

const CX = 120;
const CY = 120;
const pt = (deg: number, r: number) => [CX + r * Math.sin((deg * Math.PI) / 180), CY - r * Math.cos((deg * Math.PI) / 180)].map((v) => v.toFixed(1));

/** Clock face showing `end`, with the minute hand's sweep from `start` shaded. */
export function clockSvg(start: number, end: number): string {
  let s = `<circle class="g4m-cd-face" cx="${CX}" cy="${CY}" r="108"/>`;
  const d = Math.max(0, end - start);
  const full = Math.floor(d / 60);
  if (full) s += `<circle class="g4m-cd-full" cx="${CX}" cy="${CY}" r="96"/>`;
  const rest = d % 60;
  if (rest) {
    const a0 = (start % 60) * 6;
    const a1 = a0 + rest * 6;
    const [x0, y0] = pt(a0, 96);
    const [x1, y1] = pt(a1, 96);
    s += `<path class="g4m-cd-sweep" d="M${CX} ${CY} L${x0} ${y0} A96 96 0 ${rest > 30 ? 1 : 0} 1 ${x1} ${y1} Z"/>`;
  }
  for (let i = 0; i < 60; i++) {
    const big = i % 5 === 0;
    const [a, b] = pt(i * 6, 104);
    const [c, e] = pt(i * 6, big ? 94 : 99);
    s += `<line class="g4m-cd-tick${big ? ' is-big' : ''}" x1="${a}" y1="${b}" x2="${c}" y2="${e}"/>`;
  }
  for (let h = 1; h <= 12; h++) {
    const [x, y] = pt(h * 30, 80);
    s += `<text class="g4m-cd-num" x="${x}" y="${Number(y) + 6}" text-anchor="middle">${h}</text>`;
  }
  const m = ((end % 1440) + 1440) % 1440;
  const [hx, hy] = pt(((Math.floor(m / 60) % 12) + (m % 60) / 60) * 30, 52);
  const [mx, my] = pt((m % 60) * 6, 84);
  s += `<line class="g4m-cd-hour" x1="${CX}" y1="${CY}" x2="${hx}" y2="${hy}"/><line class="g4m-cd-min" x1="${CX}" y1="${CY}" x2="${mx}" y2="${my}"/><circle class="g4m-cd-pin" cx="${CX}" cy="${CY}" r="5"/>`;
  return s;
}
