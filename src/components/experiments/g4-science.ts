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
