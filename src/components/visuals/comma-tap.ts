// Commas to tap in (LANENG4-OI9-GQ1-LO1, K1.4, S1.3). A sentence is shown without its commas. Each gap
// between words can hold a comma, and the student's commas are checked against the sentence.

/** The words of a sentence, and the gaps (after word i) that need a comma. */
export function commaGaps(sentence: string): { words: string[]; commas: number[] } {
  const words: string[] = [];
  const commas: number[] = [];
  sentence
    .trim()
    .split(/\s+/)
    .forEach((w, i) => {
      if (w.endsWith(',')) commas.push(i);
      words.push(w.replace(/,$/, ''));
    });
  return { words, commas };
}

/** Which gaps are missing a comma, and which have one that doesn't belong. */
export function checkCommas(answer: number[], chosen: number[]): { missing: number[]; extra: number[] } {
  return { missing: answer.filter((g) => !chosen.includes(g)), extra: chosen.filter((g) => !answer.includes(g)) };
}
