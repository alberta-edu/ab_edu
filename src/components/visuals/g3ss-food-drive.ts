// Logic for the Grade 3 food bank simulation (g3ss-food-drive). Giving (charity) puts cans in the
// bin; volunteering packs cans into hampers for families. Neither works alone.

export interface Drive {
  cans: number;
  hampers: number;
}

/** Cans in one donation, and cans in one hamper. */
export const GIVE = 3;
export const PACK = 3;
/** The bin holds this many cans. */
export const BIN = 9;

export type Result = 'given' | 'full' | 'packed' | 'empty';

/** Someone donates food. */
export function donate(d: Drive): { drive: Drive; result: Result } {
  if (d.cans + GIVE > BIN) return { drive: d, result: 'full' };
  return { drive: { ...d, cans: d.cans + GIVE }, result: 'given' };
}

/** Someone volunteers an hour to pack a hamper. */
export function volunteer(d: Drive): { drive: Drive; result: Result } {
  if (d.cans < PACK) return { drive: d, result: 'empty' };
  return { drive: { cans: d.cans - PACK, hampers: d.hampers + 1 }, result: 'packed' };
}
