// How a base and a suffix join (LANENG4-OI3-GQ1-LO1, K2.1, S2.2; LANENG4-OI9-GQ1-LO1, K5.1, S5.2).
// The finished word is given, and this works out which letters of the base stayed, which were dropped
// and which were added, so the picture can show the spelling change.

export interface Join {
  /** Letters of the base that stay. */
  kept: string;
  /** Letters at the end of the base that were dropped or changed. */
  dropped: string;
  /** Letters added between the base and the suffix, such as a doubled consonant or y changed to i. */
  added: string;
  suffix: string;
}

export function splitJoin(base: string, suffix: string, word: string): Join {
  if (!word.endsWith(suffix)) throw new Error(`"${word}" does not end in -${suffix}`);
  const stem = word.slice(0, word.length - suffix.length);
  let k = 0;
  while (k < base.length && k < stem.length && base[k] === stem[k]) k++;
  if (k === 0) throw new Error(`"${word}" does not start with its base "${base}"`);
  return { kept: base.slice(0, k), dropped: base.slice(k), added: stem.slice(k), suffix };
}

/** A short note about the spelling change, or an empty string when the parts just join. */
export function joinNote(j: Join): string {
  if (!j.dropped && !j.added) return '';
  if (j.dropped === 'e' && !j.added) return 'The silent e drops.';
  if (j.dropped === 'y' && j.added === 'i') return 'The y changes to i.';
  if (!j.dropped && j.added.length === 1 && j.kept.endsWith(j.added)) return 'The last letter doubles.';
  return `${j.dropped ? `“${j.dropped}” drops` : ''}${j.dropped && j.added ? ' and ' : ''}${j.added ? `“${j.added}” is added` : ''}.`;
}
