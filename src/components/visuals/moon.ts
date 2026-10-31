// Moon phase drawing and names, shared by the Moon phases visual and problem figures
// (SCI5-OI5-GQ1-LO1, K1.2, K1.3, S1.2).

export const MONTH = 29.53; // days from one new Moon to the next

export const PHASES = [
  'New Moon',
  'Waxing crescent',
  'First quarter',
  'Waxing gibbous',
  'Full Moon',
  'Waning gibbous',
  'Third quarter',
  'Waning crescent',
] as const;

/** Name of the phase on a day of the Moon's cycle (0 = new Moon). */
export function phaseName(age: number): (typeof PHASES)[number] {
  const a = ((age % MONTH) + MONTH) % MONTH;
  return PHASES[Math.round((a / MONTH) * 8) % 8];
}

/** Fraction of the Moon's face that is lit, 0 to 1. */
export const litFraction = (age: number) => (1 - Math.cos((2 * Math.PI * age) / MONTH)) / 2;

/**
 * The Moon as seen from the northern hemisphere, centred on (cx, cy): a dark disc with the
 * lit part on top. Waxing Moons are lit on the right, waning Moons on the left.
 */
export function moonFace(age: number, cx: number, cy: number, r: number): string {
  const theta = ((((age % MONTH) + MONTH) % MONTH) / MONTH) * 2 * Math.PI;
  const waxing = theta <= Math.PI;
  const rx = Math.abs(Math.cos(theta)) * r;
  // Lit outline: the lit half's edge, then back along the terminator (an ellipse).
  const crescent = waxing ? theta < Math.PI / 2 : theta > (3 * Math.PI) / 2;
  const outer = `A${r},${r} 0 0 1 0,${r}`;
  const inner = `A${rx.toFixed(2)},${r} 0 0 ${crescent ? 0 : 1} 0,${-r}`;
  const lit = litFraction(age) < 0.003 ? '' : `<path class="mn-lit" transform="translate(${cx} ${cy}) scale(${waxing ? 1 : -1} 1)" d="M0,${-r} ${outer} ${inner} Z"/>`;
  return `<circle class="mn-dark" cx="${cx}" cy="${cy}" r="${r}"/>${lit}`;
}
