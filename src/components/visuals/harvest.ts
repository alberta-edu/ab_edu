// A simple population model for the sustainable-harvesting visual (SCI5-OI3-GQ1-LO1, K4.6):
// each year the fish in a lake have young (fewer when the lake is crowded), then some are caught.

export const CAPACITY = 1000;
export const GROWTH = 0.6;

/** Fish in the lake at the start of each year, for `years` years. Never below zero. */
export function harvestYears(start: number, catchPerYear: number, years: number): number[] {
  const out = [start];
  let p = start;
  for (let y = 1; y <= years; y++) {
    p = Math.max(0, p + GROWTH * p * (1 - p / CAPACITY) - catchPerYear);
    out.push(Math.round(p));
  }
  return out;
}

/** The largest catch the lake can keep up with: new fish each year at half capacity. */
export const SUSTAINABLE_MAX = (GROWTH * CAPACITY) / 4;
