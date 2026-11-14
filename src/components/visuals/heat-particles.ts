// Water's particles at a temperature (SCI6-OI1-GQ1-LO1, K1.1-K1.5, K2.3). Shared by the
// heating and cooling visual and its tests.

export type HpState = 'solid' | 'liquid' | 'gas';
export const HP_MIN = -30;
export const HP_MAX = 130;

/** Water's state at a temperature: ice up to its melting point, 0 °C, and gas from its boiling point, 100 °C. */
export function hpState(t: number): HpState {
  if (t <= 0) return 'solid';
  if (t < 100) return 'liquid';
  return 'gas';
}

/** How fast the particles move, from 0 (coldest on the slider) to 1 (hottest). Always rises with temperature. */
export const hpSpeed = (t: number) => 0.08 + (0.92 * (Math.max(HP_MIN, Math.min(HP_MAX, t)) - HP_MIN)) / (HP_MAX - HP_MIN);

export function hpFacts(t: number) {
  const s = hpState(t);
  const label =
    t === 0 ? 'Ice at its melting point' : t === 100 ? 'Gas at the boiling point' : s === 'solid' ? 'Solid ice' : s === 'liquid' ? 'Liquid water' : 'Gas (water vapour)';
  const forces = s === 'solid' ? 'Strongest' : s === 'liquid' ? 'Weaker' : 'Weakest';
  const space = s === 'solid' ? 'Small' : s === 'liquid' ? 'Larger' : 'Large';
  const move = s === 'solid' ? 'Vibrate in place' : s === 'liquid' ? 'Slide past each other' : 'Move in all directions';
  return { label, forces, space, move };
}
