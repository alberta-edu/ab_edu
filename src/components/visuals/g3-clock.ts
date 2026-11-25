// Telling time (MAT3-OI7-GQ1-LO1): seconds, minutes and hours in base 60 on an analog clock,
// minutes past and until the hour, a.m. and p.m. as two 12-hour cycles from 12:00, and the
// 24-hour clock counted from 0:00. Times are minutes after midnight (0 to 1439).

export const DAY = 24 * 60;

/** Hand angles in degrees, clockwise from 12. */
export function hands(t: number, s = 0) {
  const m = ((t % 60) + 60) % 60;
  const h = Math.floor((((t % DAY) + DAY) % DAY) / 60) % 12;
  return { hour: h * 30 + m * 0.5 + s / 120, minute: m * 6 + s * 0.1, second: s * 6 };
}

const pad = (n: number) => String(n).padStart(2, '0');
const norm = (t: number) => ((t % DAY) + DAY) % DAY;

/** The hour on a 12-hour clock: 0 and 12 both show as 12. */
export const hour12 = (t: number) => Math.floor(norm(t) / 60) % 12 || 12;

/** 4:35, as a 12-hour clock face shows it. */
export const digital = (t: number) => `${hour12(t)}:${pad(norm(t) % 60)}`;

export const ampm = (t: number) => (norm(t) < 12 * 60 ? 'a.m.' : 'p.m.');

/** 3:20 p.m. Noon and midnight get their names. */
export function clock12(t: number) {
  const n = norm(t);
  if (n === 0) return '12:00 midnight';
  if (n === 12 * 60) return '12:00 noon';
  return `${digital(n)} ${ampm(n)}`;
}

/** 15:20 on a 24-hour clock. */
export const clock24 = (t: number) => `${Math.floor(norm(t) / 60)}:${pad(norm(t) % 60)}`;

/** 15 h 20, as French writes the 24-hour clock. */
export const french24 = (t: number) => `${Math.floor(norm(t) / 60)} h ${pad(norm(t) % 60)}`;

/** "4:35" or "16:35" to minutes after midnight. */
export function parse(s: string) {
  const [h, m] = s.split(':').map(Number);
  return h * 60 + m;
}

const hm = (h: number, m: number) => {
  const hs = h === 1 ? '1 hour' : `${h} hours`;
  const ms = m === 1 ? '1 minute' : `${m} minutes`;
  if (h === 0) return ms;
  return m === 0 ? hs : `${hs} ${ms}`;
};

/** How long after the start of its 12-hour cycle: "3 hours 20 minutes after 12:00 noon". */
export function since12(t: number) {
  const n = norm(t);
  const start = n < 12 * 60 ? '12:00 midnight' : '12:00 noon';
  const d = n % (12 * 60);
  return d === 0 ? `Exactly ${start}` : `${hm(Math.floor(d / 60), d % 60)} after ${start}`;
}

/** How long after the start of the day: "15 hours 20 minutes after 0:00". */
export function since24(t: number) {
  const n = norm(t);
  return n === 0 ? 'Exactly 0:00, the start of the day' : `${hm(Math.floor(n / 60), n % 60)} after 0:00`;
}

/** Minutes past this hour and minutes until the next one. They always make 60. */
export function pastUntil(t: number) {
  const past = norm(t) % 60;
  return { past, until: 60 - past };
}

export function pastSay(t: number) {
  const { past, until } = pastUntil(t);
  const h = hour12(t);
  const next = (h % 12) + 1;
  if (past === 0) return `Exactly ${h}:00. It is 60 minutes until ${next}:00.`;
  return `${past} minutes past ${h}. ${until} minutes until ${next}. ${past} + ${until} = 60.`;
}

/** Hours, minutes and seconds gone by: 3725 seconds is 1, 2 and 5. */
export const gone = (secs: number) => ({ h: Math.floor(secs / 3600), m: Math.floor(secs / 60) % 60, s: secs % 60 });

/** What the tick clock says when the time goes from `from` to `to` seconds. */
export function tickSay(from: number, to: number) {
  if (Math.floor(to / 3600) > Math.floor(from / 3600)) return '60 minutes make 1 hour! The hour hand moved to the next number. 🎉';
  if (Math.floor(to / 60) > Math.floor(from / 60)) return '60 seconds make 1 minute! The minute hand moved 1 mark. 🎉';
  return '';
}

/** A clock face as SVG, with inline styles so it works in problem figures too. */
export function clockSvg(t: number, opts: { cls?: string; secs?: number; second?: boolean; label?: string; split?: boolean } = {}) {
  const c = 100;
  const a = hands(t, opts.secs ?? 0);
  const at = (deg: number, r: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [c + r * Math.cos(rad), c + r * Math.sin(rad)].map((v) => v.toFixed(1));
  };
  const parts: string[] = [];
  parts.push(`<circle cx="100" cy="100" r="94" style="fill:var(--surface);stroke:var(--ink);stroke-width:5"/>`);
  if (opts.split) {
    const deg = a.minute;
    const [x, y] = at(deg, 86);
    const big = deg > 180 ? 1 : 0;
    if (deg > 0) parts.push(`<path class="g3m-ck-past" d="M100,100 L100,14 A86,86 0 ${big} 1 ${x},${y} Z" style="fill:var(--accent);opacity:0.3"/>`);
    parts.push(`<path class="g3m-ck-until" d="M100,100 L${x},${y} A86,86 0 ${deg > 0 ? 1 - big : 1} 1 ${deg > 0 ? '100,14' : '99.9,14'} Z" style="fill:var(--sun);opacity:0.45"/>`);
  }
  const minor: string[] = [];
  const major: string[] = [];
  for (let i = 0; i < 60; i++) {
    const five = i % 5 === 0;
    const [x1, y1] = at(i * 6, five ? 78 : 83).map((v) => Math.round(Number(v)));
    const [x2, y2] = at(i * 6, 89).map((v) => Math.round(Number(v)));
    (five ? major : minor).push(`M${x1},${y1}L${x2},${y2}`);
  }
  parts.push(`<path d="${minor.join('')}" style="stroke:var(--ink);stroke-width:1.2"/><path d="${major.join('')}" style="stroke:var(--ink);stroke-width:3"/>`);
  for (let n = 1; n <= 12; n++) {
    const [x, y] = at(n * 30, 64).map((v) => Math.round(Number(v)));
    parts.push(`<text class="fig-label" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central">${n}</text>`);
  }
  const hand = (deg: number, len: number, w: number, colour: string, cls: string) => {
    const [x, y] = at(deg, len);
    return `<line class="${cls}" x1="100" y1="100" x2="${x}" y2="${y}" style="stroke:${colour};stroke-width:${w};stroke-linecap:round"/>`;
  };
  parts.push(hand(a.hour, 44, 8, 'var(--ink)', 'g3m-ck-hh'));
  parts.push(hand(a.minute, 74, 5, 'var(--accent)', 'g3m-ck-mh'));
  if (opts.second) parts.push(hand(a.second, 80, 2, 'var(--bad)', 'g3m-ck-sh'));
  parts.push(`<circle cx="100" cy="100" r="5" style="fill:var(--ink)"/>`);
  const label = opts.label ?? `An analog clock showing ${digital(t)}`;
  return `<svg viewBox="0 0 200 200" class="${opts.cls ?? 'fig-svg fig-svg--square'}" role="img" aria-label="${label}">${parts.join('')}</svg>`;
}

/** Nearest minute (0 to 59) for a pointer at (x, y) relative to the centre. */
export function minuteAt(dx: number, dy: number) {
  const deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
  return Math.round(((deg + 360) % 360) / 6) % 60;
}

/** Move the minute hand to a new minute, carrying the hour forward or back across 12. */
export function dragTo(t: number, minute: number) {
  const old = norm(t) % 60;
  let h = Math.floor(norm(t) / 60);
  if (old >= 45 && minute < 15) h += 1;
  else if (old < 15 && minute >= 45) h -= 1;
  return norm(h * 60 + minute);
}

export interface DayEvent {
  icon: string;
  label: string;
  t: string;
}

export const DAY_EVENTS: DayEvent[] = [
  { icon: '🌅', label: 'Wake up', t: '7:00' },
  { icon: '🍎', label: 'Lunch', t: '12:00' },
  { icon: '🏫', label: 'School ends', t: '15:20' },
  { icon: '🛏️', label: 'Bedtime', t: '20:00' },
];

/** 0 at midnight, 1 at noon: how light the sky is. */
export const daylight = (t: number) => Math.max(0, Math.min(1, 1.6 * Math.sin(((norm(t) - 6 * 60) / (12 * 60)) * Math.PI) + 0.2));
