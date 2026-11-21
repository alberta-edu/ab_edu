// Reading in phrases (LANENG4-OI6-GQ1-LO1, S1.1, S1.2; LANENG4-OI2-GQ1-LO1, K2.2, S2.3, S5.3).
// A line is written with marks for the reader: "/" is a short pause, "//" a long pause, and *word* is a
// stressed word. The end of a line is a long pause too.

export interface PhraseWord {
  text: string;
  stress: boolean;
}
export interface Phrase {
  words: PhraseWord[];
  /** The pause after this phrase: 1 short, 2 long. */
  pause: 1 | 2;
  line: number;
}

/** Splits marked lines into phrases. */
export function parsePhrases(lines: string[]): Phrase[] {
  const out: Phrase[] = [];
  lines.forEach((line, li) => {
    let words: PhraseWord[] = [];
    const flush = (pause: 1 | 2) => {
      if (words.length) out.push({ words, pause, line: li });
      else if (out.length && pause > out[out.length - 1].pause) out[out.length - 1].pause = pause;
      words = [];
    };
    for (const tok of line.trim().split(/\s+/)) {
      if (tok === '//') flush(2);
      else if (tok === '/') flush(1);
      else {
        const m = /^([^*]*)\*(.+)\*([^*]*)$/.exec(tok);
        words.push(m ? { text: m[1] + m[2] + m[3], stress: true } : { text: tok, stress: false });
      }
    }
    flush(2);
  });
  return out;
}

/** The plain text of a line, without any marks. */
export const plainLine = (line: string) =>
  line
    .split(/\s+/)
    .filter((t) => t !== '/' && t !== '//')
    .join(' ')
    .replace(/\*/g, '');

/** Milliseconds to hold a phrase: time for its words, then its pause. */
export function phraseTime(p: Phrase, msPerWord = 330): number {
  return p.words.length * msPerWord + (p.pause === 2 ? 700 : 300);
}
