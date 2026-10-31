// The affixes the Grade 5 curriculum lists (LANENG5-OI3-GQ1-LO1, K1.3), each with real words split
// into their parts. Used by the word builder and the spelling builder.

export interface WordPart {
  text: string;
  kind: 'prefix' | 'base' | 'suffix';
  meaning: string;
}
export interface BuiltWord {
  word: string;
  meaning: string;
  parts: WordPart[];
}
export interface Affix {
  affix: string;
  kind: 'prefix' | 'suffix';
  meaning: string;
  words: BuiltWord[];
}

/**
 * Joins a base and a suffix with the spelling patterns this lesson teaches: a silent e drops before
 * a vowel, and a consonant + y changes to i (or drops, when the suffix already starts with i).
 * Only for the suffixes listed here. It is not a general English speller.
 */
export function addSuffix(base: string, suffix: string): string {
  const startsVowel = /^[aeiou]/.test(suffix);
  if (base.endsWith('e') && startsVowel) return base.slice(0, -1) + suffix;
  if (/[^aeiou]y$/.test(base)) return base.slice(0, -1) + (suffix.startsWith('i') ? '' : 'i') + suffix;
  return base + suffix;
}

/** Builds a word from its parts, applying the spelling patterns where a suffix joins on. */
export function joinParts(parts: WordPart[]): string {
  return parts.reduce((word, p) => (p.kind === 'suffix' ? addSuffix(word, p.text) : word + p.text), '');
}

const part = (text: string, kind: WordPart['kind'], meaning: string): WordPart => ({ text, kind, meaning });
const pre = (text: string, meaning: string) => part(text, 'prefix', meaning);
const base = (text: string, meaning: string) => part(text, 'base', meaning);
const suf = (text: string, meaning: string) => part(text, 'suffix', meaning);

const suffix = (affix: string, meaning: string, words: [string, string, string][]): Affix => ({
  affix,
  kind: 'suffix',
  meaning,
  words: words.map(([word, b, m]) => ({ word, meaning: m, parts: [base(b, b), suf(affix, meaning)] })),
});

const prefix = (affix: string, meaning: string, words: [string, string, string, string][]): Affix => ({
  affix,
  kind: 'prefix',
  meaning,
  words: words.map(([word, b, bMeaning, m]) => ({ word, meaning: m, parts: [pre(affix, meaning), base(b, bMeaning)] })),
});

export const AFFIXES: Affix[] = [
  prefix('circum', 'around', [
    ['circumnavigate', 'navigate', 'steer', 'to sail or travel all the way around'],
    ['circumstance', 'stance', 'standing', 'a condition that “stands around” an event'],
  ]),
  prefix('per', 'through, thoroughly', [
    ['perfect', 'fect', 'made', 'made thoroughly, with nothing missing'],
    ['permit', 'mit', 'send', 'to let something go through; to allow it'],
  ]),
  prefix('trans', 'across', [
    ['transport', 'port', 'carry', 'to carry across from one place to another'],
    ['transmit', 'mit', 'send', 'to send across, such as a radio signal'],
  ]),
  prefix('ad', 'to, toward', [
    ['adjoin', 'join', 'connect', 'to be joined to something, side by side'],
    ['admit', 'mit', 'send', 'to let someone in; “send to”'],
  ]),
  prefix('sub', 'under, below', [
    ['submarine', 'marine', 'of the sea', 'a ship that travels under the sea'],
    ['subway', 'way', 'road or path', 'a train line that runs under the ground'],
  ]),
  prefix('ob', 'against, in the way', [
    ['object', 'ject', 'throw', 'to argue against something'],
    ['obstruct', 'struct', 'build', 'to block the way, as if building against it'],
  ]),
  prefix('com', 'together, with', [
    ['compose', 'pose', 'put', 'to put parts together, such as a song or a story'],
    ['commit', 'mit', 'send', 'to give yourself fully to something'],
  ]),
  prefix('ex', 'out', [
    ['export', 'port', 'carry', 'to send goods out of a country'],
    ['exhale', 'hale', 'breathe', 'to breathe out'],
  ]),
  suffix('ous', 'full of', [
    ['dangerous', 'danger', 'full of danger'],
    ['joyous', 'joy', 'full of joy'],
  ]),
  suffix('ious', 'full of, having', [
    ['spacious', 'space', 'having plenty of space'],
    ['gracious', 'grace', 'full of grace; kind and polite'],
  ]),
  suffix('al', 'relating to', [
    ['coastal', 'coast', 'relating to the coast'],
    ['national', 'nation', 'relating to a whole nation'],
  ]),
  suffix('ial', 'relating to', [
    ['facial', 'face', 'relating to the face'],
    ['editorial', 'editor', 'relating to an editor; an opinion piece in a newspaper'],
  ]),
  suffix('ian', 'a person who does or knows', [
    ['musician', 'music', 'a person who makes music'],
    ['historian', 'history', 'a person who studies history'],
  ]),
  suffix('ic', 'like, relating to', [
    ['heroic', 'hero', 'like a hero'],
    ['poetic', 'poet', 'like a poet; relating to poetry'],
  ]),
  suffix('ical', 'relating to', [
    ['historical', 'history', 'relating to history'],
    ['geographical', 'geography', 'relating to geography'],
  ]),
  suffix('ment', 'the act or result of', [
    ['enjoyment', 'enjoy', 'the act of enjoying something'],
    ['movement', 'move', 'the act of moving'],
  ]),
  suffix('ity', 'the state of being', [
    ['equality', 'equal', 'the state of being equal'],
    ['reality', 'real', 'the state of being real'],
  ]),
  suffix('ant', 'a person who; being', [
    ['assistant', 'assist', 'a person who assists'],
    ['contestant', 'contest', 'a person who is in a contest'],
  ]),
  suffix('ent', 'a person who; being', [
    ['resident', 'reside', 'a person who lives (resides) in a place'],
    ['president', 'preside', 'a person who presides, or leads'],
  ]),
  suffix('ance', 'the act or state of', [
    ['appearance', 'appear', 'the act of appearing; how something looks'],
    ['performance', 'perform', 'the act of performing'],
  ]),
  suffix('ence', 'the act or state of', [
    ['difference', 'differ', 'the state of being different'],
    ['preference', 'prefer', 'the thing you prefer'],
  ]),
];

/** Other words on the page that share a base, so students see that the base keeps its meaning. */
export function sameBase(word: BuiltWord): string[] {
  const b = word.parts.find((p) => p.kind === 'base')!.text;
  const all = AFFIXES.flatMap((a) => a.words);
  return all.filter((w) => w.word !== word.word && w.parts.some((p) => p.kind === 'base' && p.text === b)).map((w) => w.word);
}

/** Spelling patterns taught in the spelling lesson. Every example follows addSuffix. */
export interface SpellPattern {
  id: string;
  label: string;
  tip: string;
  examples: { base: string; add: string; result: string; note: string }[];
}

export const SPELL_PATTERNS: SpellPattern[] = [
  {
    id: 'drop-e',
    label: 'Drop the silent e',
    tip: 'When the suffix starts with a **vowel**, the silent e drops.',
    examples: [
      { base: 'fame', add: 'ous', result: 'famous', note: 'ous starts with a vowel, so the e drops.' },
      { base: 'space', add: 'ious', result: 'spacious', note: 'ious starts with a vowel, so the e drops.' },
      { base: 'reside', add: 'ent', result: 'resident', note: 'ent starts with a vowel, so the e drops.' },
    ],
  },
  {
    id: 'keep-e',
    label: 'Keep the e',
    tip: 'When the suffix starts with a **consonant**, the e stays.',
    examples: [
      { base: 'move', add: 'ment', result: 'movement', note: 'ment starts with a consonant, so the e stays.' },
      { base: 'place', add: 'ment', result: 'placement', note: 'ment starts with a consonant, so the e stays.' },
      { base: 'excite', add: 'ment', result: 'excitement', note: 'ment starts with a consonant, so the e stays.' },
    ],
  },
  {
    id: 'y-to-i',
    label: 'Change y to i',
    tip: 'After a consonant, y changes to i. If the suffix already starts with i, there is just one i.',
    examples: [
      { base: 'mystery', add: 'ous', result: 'mysterious', note: 'r + y: the y changes to i.' },
      { base: 'history', add: 'ian', result: 'historian', note: 'r + y, and ian already starts with i: just one i.' },
      { base: 'enjoy', add: 'ment', result: 'enjoyment', note: 'A vowel comes before this y, so it stays.' },
    ],
  },
  {
    id: 'keep-morpheme',
    label: 'Keep the base',
    tip: 'A base keeps its spelling, **even when its sound changes**. The longer word shows you the letters.',
    examples: [
      { base: 'sign', add: 'al', result: 'signal', note: 'You can hear the g in signal, so remember it in sign.' },
      { base: 'music', add: 'ian', result: 'musician', note: 'The c sounds like “sh” now, but it is still a c.' },
      { base: 'electric', add: 'ity', result: 'electricity', note: 'The c sounds like “s” now, but it is still a c.' },
    ],
  },
];
