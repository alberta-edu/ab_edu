// Answer checking. Runs in the browser; also unit tested in Node.
import { eq, parseDecimal, parseFractionAnswer, parseFractionInput, toNumber, type FractionForm } from './rational.ts';

/** What the browser needs to grade a problem. Choice indexes refer to the order shown on the page. */
export type CheckSpec =
  | { type: 'mc'; answer: number }
  | { type: 'multi'; answer: number[] }
  | { type: 'number'; answer: number; tolerance: number; unit?: string }
  | { type: 'fraction'; answer: string; form: 'any' | 'mixed' | 'improper' }
  | { type: 'text'; accept: string[]; caseSensitive: boolean }
  | { type: 'order'; count: number }
  | { type: 'evidence'; answer: string[] }
  | { type: 'open'; rubricCount: number };

export type Response =
  | { kind: 'choice'; value: number }
  | { kind: 'choices'; value: number[] }
  | { kind: 'text'; value: string }
  /** For order problems: the original (correct) index of each item, in the order the student arranged them. */
  | { kind: 'order'; value: number[] }
  | { kind: 'sentences'; value: string[] }
  | { kind: 'rubric'; checked: number };

export type Verdict =
  | { status: 'correct' }
  | { status: 'wrong'; message?: string }
  /** Right idea but not finished, e.g. the right value in the wrong form. Not counted as an attempt. */
  | { status: 'almost'; message: string }
  /** Input could not be read. Not counted as an attempt. */
  | { status: 'invalid'; message: string };

/** "1 000", "1,000", "$4.50", "12 cm" → number. */
export function parseNumberInput(raw: string, unit?: string): number | null {
  let s = raw.trim().replace(/−/g, '-');
  if (unit && s.toLowerCase().endsWith(unit.toLowerCase())) s = s.slice(0, -unit.length);
  s = s.replace(/^\$/, '').replace(/[\s  ,]/g, '');
  const r = parseDecimal(s);
  return r ? toNumber(r) : null;
}

export function normalizeText(s: string, caseSensitive = false): string {
  const t = s
    .trim()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .replace(/[.!]$/, '');
  return caseSensitive ? t : t.toLowerCase();
}

const formName: Record<FractionForm, string> = {
  whole: 'a whole number',
  proper: 'a proper fraction',
  improper: 'an improper fraction',
  mixed: 'a mixed number',
  decimal: 'a decimal',
};

export function check(spec: CheckSpec, res: Response): Verdict {
  switch (spec.type) {
    case 'mc':
      if (res.kind !== 'choice') return { status: 'invalid', message: 'Choose an answer first.' };
      return res.value === spec.answer ? { status: 'correct' } : { status: 'wrong' };

    case 'multi': {
      if (res.kind !== 'choices' || res.value.length === 0)
        return { status: 'invalid', message: 'Select at least one answer.' };
      const want = [...spec.answer].sort().join();
      const got = [...res.value].sort().join();
      if (want === got) return { status: 'correct' };
      const missing = spec.answer.filter((a) => !res.value.includes(a)).length;
      const extra = res.value.filter((v) => !spec.answer.includes(v)).length;
      const parts = [];
      if (extra) parts.push(`${extra} of your choices ${extra === 1 ? 'is' : 'are'} not correct`);
      if (missing) parts.push(`${missing} correct ${missing === 1 ? 'answer is' : 'answers are'} missing`);
      return { status: 'wrong', message: `Not quite: ${parts.join(' and ')}.` };
    }

    case 'number': {
      if (res.kind !== 'text') return { status: 'invalid', message: 'Type a number.' };
      const n = parseNumberInput(res.value, spec.unit);
      if (n === null) return { status: 'invalid', message: 'Type your answer as a number, like 1 250 or 3.75.' };
      return Math.abs(n - spec.answer) <= spec.tolerance + 1e-9 ? { status: 'correct' } : { status: 'wrong' };
    }

    case 'fraction': {
      if (res.kind !== 'text') return { status: 'invalid', message: 'Type a fraction.' };
      const got = parseFractionInput(res.value);
      if (!got)
        return {
          status: 'invalid',
          message: 'Write a fraction like 11/4, or a mixed number like 2 3/4 (whole number, space, fraction).',
        };
      if (!eq(got.value, parseFractionAnswer(spec.answer))) return { status: 'wrong' };
      if (spec.form === 'mixed' && got.form !== 'mixed')
        return { status: 'almost', message: `That's the right amount, written as ${formName[got.form]}. Now write it as a mixed number.` };
      if (spec.form === 'improper' && got.form !== 'improper')
        return { status: 'almost', message: `That's the right amount, written as ${formName[got.form]}. Now write it as an improper fraction.` };
      return { status: 'correct' };
    }

    case 'text': {
      if (res.kind !== 'text' || !res.value.trim()) return { status: 'invalid', message: 'Type your answer first.' };
      const got = normalizeText(res.value, spec.caseSensitive);
      return spec.accept.some((a) => normalizeText(a, spec.caseSensitive) === got)
        ? { status: 'correct' }
        : { status: 'wrong' };
    }

    case 'order': {
      if (res.kind !== 'order') return { status: 'invalid', message: 'Arrange the items first.' };
      const correct = res.value.filter((v, i) => v === i).length;
      return correct === spec.count
        ? { status: 'correct' }
        : { status: 'wrong', message: `${correct} of ${spec.count} are in the right place.` };
    }

    case 'evidence': {
      if (res.kind !== 'sentences' || res.value.length === 0)
        return { status: 'invalid', message: 'Tap a sentence in the excerpt first.' };
      return res.value.every((s) => spec.answer.includes(s)) ? { status: 'correct' } : { status: 'wrong' };
    }

    case 'open': {
      if (res.kind !== 'rubric') return { status: 'invalid', message: 'Check your answer against the list first.' };
      return res.checked >= Math.ceil(spec.rubricCount * 0.66) ? { status: 'correct' } : { status: 'wrong' };
    }
  }
}
