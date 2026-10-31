import { describe, expect, it } from 'vitest';
import { AFFIXES, SPELL_PATTERNS, addSuffix, joinParts, sameBase } from '../src/components/visuals/word-builder.ts';
import { NEW_WORDS, ORIGINS, SHIFTS } from '../src/components/visuals/word-journey.ts';
import { ADVERB_SETS, JOIN_SETS, ROLE_SENTENCES, TENSE_SETS, TENSES, adverbSentence } from '../src/components/visuals/sentence-lab.ts';
import { contour, pitchAt, voiceReach } from '../src/components/visuals/voice.ts';
import { isHidden, rhythmOf, sentenceLengths } from '../src/components/visuals/writing-tools.ts';
import { loadConcepts, outcomeStatements } from '../src/lib/content.ts';

const ELAL = 'english-language-arts' as const;
const statement = (outcome: string, ref: string) => outcomeStatements(5, ELAL, outcome).find((s) => s.ref === ref)!;

describe('word builder', () => {
  it('teaches exactly the affixes the curriculum lists', () => {
    const listed = [...statement('LANENG5-OI3-GQ1-LO1', 'K1.3').text.matchAll(/<(\w+)>/g)].map((m) => m[1]);
    expect(AFFIXES.map((a) => a.affix).sort()).toEqual(listed.sort());
  });

  it('builds every word from its parts', () => {
    for (const a of AFFIXES) {
      expect(a.words.length, a.affix).toBeGreaterThan(0);
      for (const w of a.words) expect(joinParts(w.parts), w.word).toBe(w.word);
    }
  });

  it('puts each affix on the correct side of the base', () => {
    for (const a of AFFIXES) {
      for (const w of a.words) {
        const kinds = w.parts.map((p) => p.kind);
        expect(kinds, w.word).toEqual(a.kind === 'prefix' ? ['prefix', 'base'] : ['base', 'suffix']);
      }
    }
  });

  it('links words that share a base', () => {
    const transport = AFFIXES.find((a) => a.affix === 'trans')!.words.find((w) => w.word === 'transport')!;
    expect(sameBase(transport)).toEqual(['export']);
  });
});

describe('spelling patterns', () => {
  it('drops a silent e only before a vowel', () => {
    expect(addSuffix('fame', 'ous')).toBe('famous');
    expect(addSuffix('move', 'ment')).toBe('movement');
  });

  it('changes y after a consonant, but not after a vowel', () => {
    expect(addSuffix('mystery', 'ous')).toBe('mysterious');
    expect(addSuffix('history', 'ian')).toBe('historian');
    expect(addSuffix('enjoy', 'ment')).toBe('enjoyment');
  });

  it('follows the rule in every example shown to students', () => {
    for (const p of SPELL_PATTERNS) for (const e of p.examples) expect(addSuffix(e.base, e.add), e.result).toBe(e.result);
  });
});

describe('word journey', () => {
  it('has a source language and meaning for every word', () => {
    for (const o of ORIGINS) {
      expect(o.language, o.word).not.toBe('');
      expect(o.sourceMeaning, o.word).not.toBe('');
    }
    expect(new Set(ORIGINS.map((o) => o.word)).size).toBe(ORIGINS.length);
  });

  it('ends every change of meaning today', () => {
    for (const s of SHIFTS) expect(s.stops.at(-1)!.when, s.word).toBe('Today');
  });

  it('only calls recent words new', () => {
    for (const w of NEW_WORDS) expect(Number(w.year), w.word).toBeGreaterThan(1990);
  });
});

describe('sentence lab', () => {
  it('gives every noun with a role a pronoun to swap in', () => {
    for (const tokens of ROLE_SENTENCES) for (const t of tokens) if (t.role) expect(t.pronoun, t.text).toBeTruthy();
  });

  it('shows subject, object and possessive pronouns', () => {
    const roles = new Set(ROLE_SENTENCES.flat().map((t) => t.role).filter(Boolean));
    expect(roles).toEqual(new Set(['subject', 'object', 'possessive']));
  });

  it('teaches the three tenses the curriculum lists', () => {
    expect(statement('LANENG5-OI9-GQ1-LO1', 'K2.1').items).toEqual(TENSES.map((t) => `${t} tense`).sort((a, b) => ['present tense', 'past tense', 'future tense'].indexOf(a) - ['present tense', 'past tense', 'future tense'].indexOf(b)));
    for (const set of TENSE_SETS) {
      expect(set.future).toMatch(/\bwill\b/);
      expect(new Set(TENSES.map((t) => set[t])).size).toBe(3);
    }
  });

  it('moves an adverb without breaking the sentence', () => {
    const [fox] = ADVERB_SETS;
    expect(adverbSentence(fox, 'start')).toBe('Quietly, the fox crept past the tent.');
    expect(adverbSentence(fox, 'before')).toBe('The fox quietly crept past the tent.');
    expect(adverbSentence(fox, 'after')).toBe('The fox crept quietly past the tent.');
  });

  it('keeps a person’s name capitalized when the adverb goes first', () => {
    const nadia = ADVERB_SETS.find((s) => s.subject === 'Nadia')!;
    expect(adverbSentence(nadia, 'start')).toBe('Carefully, Nadia stepped onto the icy bridge.');
  });

  it('never puts the adverb between a verb and its object', () => {
    for (const s of ADVERB_SETS) expect(s.rest, s.verb).toMatch(/^(past|to|onto|across|into|over) /);
    expect(adverbSentence(ADVERB_SETS[1], 'after')).toBe('The wind shifted suddenly to the west.');
  });

  it('has exactly one conjunction that fits each pair of ideas', () => {
    for (const j of JOIN_SETS) expect(j.options.filter((o) => o.fits), j.first).toHaveLength(1);
  });
});

describe('voice', () => {
  it('slides up for a rising voice and down for a falling one', () => {
    const rising = contour(4, 'rising', -1);
    const falling = contour(4, 'falling', -1);
    expect(rising.at(-1)!).toBeGreaterThan(rising[0]);
    expect(falling.at(-1)!).toBeLessThan(falling[0]);
  });

  it('lifts the stressed word and stays in range', () => {
    for (const shape of ['rising', 'falling', 'flat'] as const) {
      for (let stress = 0; stress < 4; stress++) {
        const line = contour(4, shape, stress);
        expect(line[stress]).toBeGreaterThan(contour(4, shape, -1)[stress]);
        for (const y of line) expect(y).toBeLessThanOrEqual(1);
      }
    }
  });

  it('speaks a stressed word higher, within the range speech allows', () => {
    const line = contour(4, 'flat', 2);
    expect(pitchAt(line[2])).toBeGreaterThan(pitchAt(line[1]));
    for (const y of [0, 0.5, 1]) {
      expect(pitchAt(y)).toBeGreaterThan(0);
      expect(pitchAt(y)).toBeLessThanOrEqual(2);
    }
  });

  it('reaches one row further for each of breath, body and energy', () => {
    expect(voiceReach(false, false, false)).toBe(0);
    expect(voiceReach(true, false, false)).toBe(1);
    expect(voiceReach(false, true, true)).toBe(2);
    expect(voiceReach(true, true, true)).toBe(3);
  });
});

describe('writing tools', () => {
  it('counts the words in each sentence', () => {
    expect(sentenceLengths('The wind rose. It was cold!')).toEqual([3, 3]);
    expect(sentenceLengths('“Stop,” she said. “Now.” Then we ran.')).toEqual([3, 1, 3]);
    expect(sentenceLengths('   ')).toEqual([]);
  });

  it('tells choppy writing from flowing writing', () => {
    expect(rhythmOf([])).toBe('empty');
    expect(rhythmOf([4, 5])).toBe('few');
    expect(rhythmOf([4, 5, 4, 5])).toBe('choppy');
    expect(rhythmOf([18, 20, 17])).toBe('long');
    expect(rhythmOf([3, 14, 6])).toBe('varied');
  });

  it('does not call long-winded writing flowing', () => {
    expect(rhythmOf([20, 25, 30])).toBe('long');
  });

  it('does not end a sentence at an abbreviation', () => {
    expect(sentenceLengths('Dr. Ortiz called. We ran.')).toEqual([3, 2]);
  });

  it('reads both examples in the writing lesson as they are labelled', () => {
    const writing = loadConcepts(5).find((c) => c.id === 'writing-process')!;
    const block = writing.lesson.flatMap((s) => s.blocks).find((b) => b.type === 'visual' && b.component === 'sentence-rhythm');
    const { examples } = (block as { props: { examples: { label: string; text: string }[] } }).props;
    expect(rhythmOf(sentenceLengths(examples.find((e) => e.label === 'Choppy')!.text))).toBe('choppy');
    expect(rhythmOf(sentenceLengths(examples.find((e) => e.label === 'Flowing')!.text))).toBe('varied');
  });

  it('fades a poem out steadily, keeping hidden words hidden', () => {
    for (let level = 0; level < 4; level++) {
      for (let i = 0; i < 40; i++) if (isHidden(i, level)) expect(isHidden(i, level + 1), `word ${i} at level ${level}`).toBe(true);
    }
    expect(isHidden(3, 0)).toBe(false);
    expect(isHidden(0, 3)).toBe(false);
    expect(isHidden(0, 4)).toBe(true);
  });
});

describe('ELAL lessons', () => {
  const concepts = loadConcepts(5).filter((c) => c.subject === ELAL);

  it('builds all twelve concepts', () => {
    expect(concepts).toHaveLength(12);
  });

  it('uses the same poem wherever “Coulee Morning” appears', () => {
    const poetry = concepts.find((c) => c.id === 'poetry-drama')!;
    const poems = poetry.lesson.flatMap((s) => s.blocks).filter((b) => b.type === 'visual' && b.component === 'poem-reader');
    expect(poems).toHaveLength(2);
    const [a, b] = poems.map((p) => (p as { props: { stanzas: string[][] } }).props.stanzas);
    expect(a).toEqual(b);
    expect(a).toHaveLength(3);
  });

  it('gives every open response a rubric, and every other problem a solution', () => {
    for (const c of concepts) {
      for (const p of c.problems) {
        if (p.type === 'open') expect(p.rubric.length, `${c.id}/${p.id}`).toBeGreaterThan(1);
        else expect(p.solution.length, `${c.id}/${p.id}`).toBeGreaterThan(0);
      }
    }
  });
});
