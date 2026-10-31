// Sentences for the grammar lab (LANENG5-OI9-GQ1-LO1, K2.1 to K2.5). Each mode is a small set of
// sentences the student can change, so the rule shows up in the sentence itself.

export type Role = 'subject' | 'object' | 'possessive';
export interface Token {
  text: string;
  role?: Role;
  /** The pronoun that can replace this noun. */
  pronoun?: string;
}

export const ROLE_SENTENCES: Token[][] = [
  [{ text: 'Maya', role: 'subject', pronoun: 'She' }, { text: 'thanked' }, { text: 'Leo', role: 'object', pronoun: 'him' }, { text: '.' }],
  [{ text: 'The twins', role: 'subject', pronoun: 'They' }, { text: 'helped' }, { text: 'Grandma', role: 'object', pronoun: 'her' }, { text: '.' }],
  [{ text: 'Sam and I', role: 'subject', pronoun: 'We' }, { text: 'found' }, { text: 'the puck', role: 'object', pronoun: 'it' }, { text: '.' }],
  [{ text: 'The dog', role: 'subject', pronoun: 'It' }, { text: 'followed' }, { text: 'Sam and me', role: 'object', pronoun: 'us' }, { text: '.' }],
  [{ text: 'Leo', role: 'subject', pronoun: 'He' }, { text: 'lost' }, { text: 'Leo’s', role: 'possessive', pronoun: 'his' }, { text: 'mitts' }, { text: '.' }],
  [{ text: 'The players', role: 'subject', pronoun: 'They' }, { text: 'packed' }, { text: 'the players’', role: 'possessive', pronoun: 'their' }, { text: 'bags' }, { text: '.' }],
];

export type Tense = 'past' | 'present' | 'future';
export const TENSES: Tense[] = ['past', 'present', 'future'];

export const TENSE_SETS: Record<Tense, string>[] = [
  { past: 'The chinook melted the snow.', present: 'The chinook melts the snow.', future: 'The chinook will melt the snow.' },
  { past: 'Maya skated across the lagoon.', present: 'Maya skates across the lagoon.', future: 'Maya will skate across the lagoon.' },
  { past: 'The players ate their lunch.', present: 'The players eat their lunch.', future: 'The players will eat their lunch.' },
];

export interface AdverbSet {
  adverb: string;
  subject: string;
  verb: string;
  rest: string;
}
export const ADVERB_SETS: AdverbSet[] = [
  { adverb: 'quietly', subject: 'The fox', verb: 'crept', rest: 'past the tent' },
  // These verbs take no object, so nothing separates a verb from its object when the adverb moves.
  { adverb: 'suddenly', subject: 'The wind', verb: 'shifted', rest: 'to the west' },
  { adverb: 'carefully', subject: 'Nadia', verb: 'stepped', rest: 'onto the icy bridge' },
];
export type AdverbSpot = 'start' | 'before' | 'after';
export const ADVERB_SPOTS: AdverbSpot[] = ['start', 'before', 'after'];

const lowerStart = (s: string) => (/^(The|A|An) /.test(s) ? s[0].toLowerCase() + s.slice(1) : s);
const upperStart = (s: string) => s[0].toUpperCase() + s.slice(1);

export function adverbSentence(s: AdverbSet, spot: AdverbSpot): string {
  if (spot === 'start') return `${upperStart(s.adverb)}, ${lowerStart(s.subject)} ${s.verb} ${s.rest}.`;
  if (spot === 'before') return `${s.subject} ${s.adverb} ${s.verb} ${s.rest}.`;
  return `${s.subject} ${s.verb} ${s.adverb} ${s.rest}.`;
}

export interface JoinSet {
  first: string;
  second: string;
  options: { word: string; fits: boolean; note: string }[];
}
export const JOIN_SETS: JoinSet[] = [
  {
    first: 'The trail was icy',
    second: 'we walked slowly',
    options: [
      { word: 'so', fits: true, note: '**so** shows a result: the ice is why they walked slowly.' },
      { word: 'but', fits: false, note: '**but** signals a contrast. Walking slowly on ice is no surprise.' },
      { word: 'or', fits: false, note: '**or** offers a choice. Both of these things happened.' },
    ],
  },
  {
    first: 'Leo wanted to play outside',
    second: 'the rain had not stopped',
    options: [
      { word: 'but', fits: true, note: '**but** shows a contrast: what he wanted against what happened.' },
      { word: 'so', fits: false, note: '**so** shows a result. Wanting to play did not cause the rain.' },
      { word: 'and', fits: false, note: '**and** adds an idea, but it hides the problem here.' },
    ],
  },
  {
    first: 'Priya read the map',
    second: 'Sam packed the snacks',
    options: [
      { word: 'and', fits: true, note: '**and** adds a second idea of equal weight.' },
      { word: 'because', fits: false, note: '**because** gives a reason. The map is not why Sam packed snacks.' },
      { word: 'or', fits: false, note: '**or** offers a choice. They did both.' },
    ],
  },
];
