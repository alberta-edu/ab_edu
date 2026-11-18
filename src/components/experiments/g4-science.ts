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
