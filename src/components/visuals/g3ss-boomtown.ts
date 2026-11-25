// Logic for the Grade 3 growing town (g3ss-boomtown).

/** The population shown part-way through the growth, rounded to a whole person. `t` runs from 0 to 1. */
export function countAt(from: number, to: number, t: number): number {
  const k = Math.min(1, Math.max(0, t));
  return Math.round(from + (to - from) * k);
}
