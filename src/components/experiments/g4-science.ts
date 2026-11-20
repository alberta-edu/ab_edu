// Small models behind the Grade 4 science experiments. Kept here, apart from the drawing code,
// so the numbers each animation shows can be tested against what the lesson says.

/**
 * Magnet reach (SCI4-OI2-GQ1-LO1, K1.5): the school bar magnet in the experiment lifts a steel
 * paper clip from up to 3 cm away, through cardboard or not. Farther away, the pull is too weak.
 */
export const MAGNET_REACH_CM = 3;
export const clipLifts = (gapCm: number) => gapCm <= MAGNET_REACH_CM;


export type Pole = 'N' | 'S';

/** Magnet poles: opposite poles attract, like poles repel (SCI4-OI2-GQ1-LO1, K2.3). */
export const poles = (a: Pole, b: Pole): 'attract' | 'repel' => (a === b ? 'repel' : 'attract');

/**
 * A bar magnet as SVG, centred on (cx, cy): red north half and blue south half, each labelled.
 * `left` is the pole on the left end.
 */
export function barMagnet(cx: number, cy: number, left: Pole, w = 96, h = 32): string {
  const half = w / 2;
  const col = (p: Pole) => (p === 'N' ? '#d23b2e' : '#2f5fd0');
  const right: Pole = left === 'N' ? 'S' : 'N';
  const x0 = cx - half;
  const y0 = cy - h / 2;
  const t = (x: number, p: Pole) => `<text x="${x}" y="${cy + 6}" text-anchor="middle" style="fill:#fff;font-size:17px;font-weight:700">${p}</text>`;
  return (
    `<rect x="${x0}" y="${y0}" width="${half}" height="${h}" rx="3" style="fill:${col(left)}"/>` +
    `<rect x="${cx}" y="${y0}" width="${half}" height="${h}" rx="3" style="fill:${col(right)}"/>` +
    t(x0 + half / 2, left) +
    t(cx + half / 2, right)
  );
}

/**
 * Sunlight on the ground (SCI4-OI3-GQ1-LO1, K2.2): a beam `beam` wide lands on a patch
 * beam / sin(angle) wide, where angle is the Sun's height above the ground. Straight down
 * (90°) the patch is as small as it gets; the lower the Sun, the more the same light spreads out.
 */
export const patchWidth = (beam: number, angleDeg: number) => beam / Math.sin((angleDeg * Math.PI) / 180);

/**
 * Fish pond (SCI4-OI3-GQ1-LO1, U6.1, U6.2): an invented pond that holds at most `cap` fish. Each
 * spring the fish increase by half (rounded down), up to the cap; then a family takes up to `take`.
 * Returns the fish left after each year's catch.
 */
export function pondYears(start: number, cap: number, take: number, years: number): number[] {
  const out: number[] = [];
  let fish = start;
  for (let y = 0; y < years; y++) {
    fish = Math.min(cap, fish + Math.floor(fish / 2));
    fish -= Math.min(take, fish);
    out.push(fish);
  }
  return out;
}

/**
 * Pill bug choice tray (SCI4-OI4-GQ1-LO1, S2.3): where each of ten bugs ends up, as a share of
 * the tray's width from the damp end (0) to the dry end (1). Eight settle on the damp side, the
 * result the lesson reports. Pill bugs dry out easily, so they move to damp places.
 */
export const BUG_END: { lane: number; endX: number }[] = [0.08, 0.2, 0.14, 0.3, 0.06, 0.62, 0.24, 0.38, 0.85, 0.12].map((endX, lane) => ({ lane, endX }));

/**
 * Day and night sky (SCI4-OI5-GQ1-LO1, K1.3): how dark the sky is at a given hour, from 0 (full
 * daylight) to 1 (full night). The Sun sets at 9 p.m. in the animation, and twilight lasts until
 * about 10:30 p.m.
 */
export const skyDarkness = (hour: number) => Math.max(0, Math.min(1, (hour - 20.5) / 2));

/** A fixed field of stars for the night sky, each with a brightness from 0 (faint) to 1 (bright). */
export const STARS: { x: number; y: number; bright: number }[] = Array.from({ length: 46 }, (_, k) => ({
  x: (k * 137 + 31) % 640 + 10,
  y: (k * 89 + 17) % 200 + 10,
  bright: ((k * 53) % 100) / 100,
}));

/**
 * The Big Dipper (SCI4-OI5-GQ1-LO1, K2.1, K2.3, K2.5): positions on a flat sky drawing, and each
 * star's distance from Earth in trillions of kilometres, rounded to tens. Distances: Hipparcos
 * parallaxes (van Leeuwen 2007), in light-years (Dubhe 123.6, Merak 79.7, Phecda 83.2, Megrez 80.5,
 * Alioth 82.6, Mizar 82.9, Alkaid 103.9), times 9.461 trillion km per light-year.
 */
export const DIPPER: { name: string; x: number; y: number; tkm: number }[] = [
  { name: 'Dubhe', x: 190, y: 180, tkm: 1170 },
  { name: 'Merak', x: 150, y: 210, tkm: 750 },
  { name: 'Phecda', x: 110, y: 185, tkm: 790 },
  { name: 'Megrez', x: 148, y: 155, tkm: 760 },
  { name: 'Alioth', x: 110, y: 128, tkm: 780 },
  { name: 'Mizar', x: 80, y: 110, tkm: 780 },
  { name: 'Alkaid', x: 40, y: 112, tkm: 980 },
];
/** Lines joining the dipper's stars, by index. */
export const DIPPER_LINES: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]];

/** Polaris sits about five pointer-gaps beyond Dubhe, along the line from Merak through Dubhe. */
export function polarisFrom(merak: { x: number; y: number }, dubhe: { x: number; y: number }, gaps = 5) {
  return { x: dubhe.x + gaps * (dubhe.x - merak.x), y: dubhe.y + gaps * (dubhe.y - merak.y) };
}

/** Stars in the northern sky turn once around Polaris in about a day: 15° an hour, counterclockwise. */
export const turnPerHour = 15;

/**
 * Moon and calendar (SCI4-OI5-GQ1-LO1, K3.2, K3.5, S3.2): the Moon's cycle of shapes takes about
 * 29.5 days (29.53, new Moon to new Moon). Twelve cycles take about 354 days, about 11 days
 * short of the 365-day year of the international standard calendar.
 */
export const MOON_CYCLE = 29.53;
export const YEAR_DAYS = 365;
export const twelveMoons = () => 12 * MOON_CYCLE;
/** Days on which each full Moon cycle ends, within the given number of days. */
export const cycleEnds = (days: number) => Array.from({ length: Math.floor(days / MOON_CYCLE) }, (_, k) => (k + 1) * MOON_CYCLE);

/**
 * Paper bridge test (SCI4-OI6-GQ1-LO1, K1.1, S1.3): an invented class test with one sheet of paper
 * across a 15 cm gap. Flat, it holds 3 coins and falls with the 4th. Folded like an accordion,
 * the same sheet still holds all 20 coins the class has.
 */
export const BRIDGE = { flatHolds: 3, coins: 20 };
