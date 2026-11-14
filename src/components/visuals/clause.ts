// Clauses joined into sentences (LANENG6-OI9-GQ1-LO1, K2.2 to K2.6). A clause has a subject and a verb.
// Two independent clauses become two simple sentences, a compound sentence (comma + and, but, so), or a
// complex sentence, when a word like because or when turns the second clause into a dependent clause.

export interface Clause {
  /** Subject, such as "the bell". */
  s: string;
  /** Verb, such as "rang". */
  v: string;
  /** The rest of the clause, if any. */
  rest?: string;
}

export type Joiner = '.' | 'and' | 'but' | 'so' | 'because' | 'when' | 'although';
export const COORDINATING: Joiner[] = ['and', 'but', 'so'];
export const SUBORDINATING: Joiner[] = ['because', 'when', 'although'];
export const JOINERS: Joiner[] = ['.', ...COORDINATING, ...SUBORDINATING];

export type SentenceType = 'simple' | 'compound' | 'complex';
export interface Piece {
  text: string;
  role: 'independent' | 'dependent' | 'joiner';
}

export const clauseText = (c: Clause) => [c.s, c.v, c.rest].filter(Boolean).join(' ');
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** Joins two clauses. Returns one sentence per entry: "." gives two simple sentences. */
export function join(a: Clause, b: Clause, j: Joiner): { type: SentenceType; sentences: Piece[][] } {
  if (j === '.') {
    return {
      type: 'simple',
      sentences: [
        [{ text: `${cap(clauseText(a))}.`, role: 'independent' }],
        [{ text: `${cap(clauseText(b))}.`, role: 'independent' }],
      ],
    };
  }
  if (COORDINATING.includes(j)) {
    return {
      type: 'compound',
      sentences: [[
        { text: cap(clauseText(a)), role: 'independent' },
        { text: `, ${j}`, role: 'joiner' },
        { text: ` ${clauseText(b)}.`, role: 'independent' },
      ]],
    };
  }
  return {
    type: 'complex',
    sentences: [[
      { text: cap(clauseText(a)), role: 'independent' },
      { text: ` ${j} ${clauseText(b)}.`, role: 'dependent' },
    ]],
  };
}

/** The sentence as plain text. */
export const sentenceText = (pieces: Piece[]) => pieces.map((p) => p.text).join('');
