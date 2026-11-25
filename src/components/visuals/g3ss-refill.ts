// Logic for the Grade 3 "use it up?" resource tanks (g3ss-refill). Each press uses some of every
// resource; nature then refills the renewable ones, and the non-renewable ones stay down.

/** How much of a tank one press uses, out of 100. */
export const USE = 40;

/** A tank's level after one use. */
export const afterUse = (level: number) => Math.max(0, level - USE);

/** A tank's level after nature has had time to work: renewable resources come back. */
export const afterNature = (level: number, renew: boolean) => (renew ? 100 : level);

/** What the tag under a tank says. */
export function status(level: number, renew: boolean): 'full' | 'back' | 'low' | 'gone' {
  if (renew) return level === 100 ? 'back' : 'low';
  if (level === 100) return 'full';
  return level === 0 ? 'gone' : 'low';
}

/** "sun, wind and water" */
export function joinNames(names: string[]): string {
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

/** The message after a press. */
export function message(renewNames: string[], otherNames: string[], allGone: boolean): string {
  const back = joinNames(renewNames);
  const other = joinNames(otherNames);
  const Back = back.charAt(0).toUpperCase() + back.slice(1);
  const Other = other.charAt(0).toUpperCase() + other.slice(1);
  return allGone
    ? `${Other} are all used up. ${Back} keep coming back.`
    : `${Back} came back. ${Other} did not.`;
}
