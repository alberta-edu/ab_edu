// Sun and seasons arithmetic for the seasons visual and the midnight-sun experiment
// (SCI5-OI5-GQ1-LO1, K1.4, K1.5, S1.1). Simple standard formulas, accurate to a few minutes.

const RAD = Math.PI / 180;
export const TILT = 23.44;

/** Day of the year (0 = January 1) of the June solstice, used to place Earth on its orbit. */
export const JUNE_SOLSTICE = 171;

/** The Sun's declination in degrees: how far north (+) or south (−) of the equator it is overhead. */
export function declination(day: number): number {
  return -TILT * Math.cos((2 * Math.PI * (day + 10)) / 365);
}

/** Hours of daylight at a latitude (degrees, south negative), including the usual sunrise allowance. */
export function dayLength(lat: number, day: number): number {
  const d = declination(day) * RAD;
  const p = lat * RAD;
  const c = (Math.sin(-0.833 * RAD) - Math.sin(p) * Math.sin(d)) / (Math.cos(p) * Math.cos(d));
  if (c <= -1) return 24; // the Sun never sets
  if (c >= 1) return 0; // the Sun never rises
  return (2 * Math.acos(c)) / RAD / 15;
}

/** The Sun's height above the horizon in degrees, at a solar hour (12 = noon). */
export function sunAltitude(lat: number, day: number, hour: number): number {
  const d = declination(day) * RAD;
  const p = lat * RAD;
  const h = (hour - 12) * 15 * RAD;
  return Math.asin(Math.sin(p) * Math.sin(d) + Math.cos(p) * Math.cos(d) * Math.cos(h)) / RAD;
}

/** "17 h 4 min" */
export function hoursText(h: number): string {
  const total = Math.round(h * 60);
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return mm ? `${hh} h ${mm} min` : `${hh} h`;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS_IN = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** "June 21" for day-of-year 171 (a year that isn't a leap year). */
export function dateText(day: number): string {
  let d = Math.round(day);
  for (let m = 0; m < 12; m++) {
    if (d < DAYS_IN[m]) return `${MONTHS[m]} ${d + 1}`;
    d -= DAYS_IN[m];
  }
  return 'December 31';
}

export type Season = 'spring' | 'summer' | 'fall' | 'winter';

/** The northern hemisphere's season on a day. Solstices and equinoxes start each season. */
export function northernSeason(day: number): Season {
  if (day >= 79 && day < 171) return 'spring';
  if (day >= 171 && day < 265) return 'summer';
  if (day >= 265 && day < 354) return 'fall';
  return 'winter';
}

export const OPPOSITE: Record<Season, Season> = { spring: 'fall', summer: 'winter', fall: 'spring', winter: 'summer' };
