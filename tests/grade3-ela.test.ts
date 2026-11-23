import { describe, expect, it } from 'vitest';
import { circlePoint, isCompound, letterTeams, runOn, pictureSentence, pictureWords, plainWord, squeeze, squeezed, subjectSplit, syllables, unsqueezed } from '../src/components/visuals/g3e-ela.ts';

describe('story circle', () => {
  it('starts at the top and goes clockwise', () => {
    expect(circlePoint(0, 4, 100, 100, 50)).toEqual([100, 50]);
    expect(circlePoint(1, 4, 100, 100, 50)).toEqual([150, 100]);
    expect(circlePoint(2, 4, 100, 100, 50)).toEqual([100, 150]);
  });
});

describe('syllable clap', () => {
  it('counts the beats in words and lines', () => {
    expect(syllables('but·ter·fly')).toEqual({ words: [['but', 'ter', 'fly']], beats: 3 });
    expect(syllables('Snow·flakes on my nose').beats).toBe(5);
    expect(syllables('  sun  ').beats).toBe(1);
  });
});

describe('letter teams', () => {
  it('reads blends, digraphs and silent letters', () => {
    expect(letterTeams('(k)nee')).toEqual([
      { text: 'k', kind: 'silent' },
      { text: 'n', kind: 'plain' },
      { text: 'e', kind: 'plain' },
      { text: 'e', kind: 'plain' },
    ]);
    expect(letterTeams('{fl}a[sh]').map((p) => p.kind)).toEqual(['blend', 'plain', 'digraph']);
    expect(plainWord('{str}i[ng]')).toBe('string');
  });

  it('refuses broken marks', () => {
    expect(() => letterTeams('{fl')).toThrow();
    expect(() => letterTeams('a]')).toThrow();
    expect(() => letterTeams('a[]b')).toThrow();
  });
});

describe('sentence split', () => {
  it('finds where the subject ends', () => {
    expect(subjectSplit('My big brother | ate the grapes.')).toEqual({ words: ['My', 'big', 'brother', 'ate', 'the', 'grapes.'], split: 2 });
    expect(subjectSplit('Dogs | bark.').split).toBe(0);
  });

  it('needs one | with words on both sides', () => {
    expect(() => subjectSplit('Dogs bark.')).toThrow();
    expect(() => subjectSplit('| Dogs bark.')).toThrow();
    expect(() => subjectSplit('A | b | c')).toThrow();
  });
});

describe('squeeze', () => {
  it('drops letters and adds an apostrophe for a contraction', () => {
    const t = squeeze('do not', 'don’t');
    expect(squeezed(t)).toBe('don’t');
    expect(unsqueezed(t)).toBe('do not');
    expect(t.filter((x) => x.drop).map((x) => x.ch)).toEqual([' ', 'o']);
    expect(t.filter((x) => x.add).map((x) => x.ch)).toEqual(['’']);
  });

  it('works for I am and she is', () => {
    expect(squeezed(squeeze('I am', 'I’m'))).toBe('I’m');
    expect(squeezed(squeeze('she is', 'she’s'))).toBe('she’s');
  });

  it('shortens abbreviations, keeping the short form’s capitals', () => {
    expect(squeezed(squeeze('Street', 'St.'))).toBe('St.');
    expect(squeezed(squeeze('Alberta', 'AB'))).toBe('AB');
    expect(unsqueezed(squeeze('Alberta', 'AB'))).toBe('Alberta');
    expect(squeezed(squeeze('Doctor', 'Dr.'))).toBe('Dr.');
  });

  it('refuses a short form that can’t come from the long one', () => {
    expect(() => squeeze('will not', 'won’t')).toThrow();
    expect(() => squeeze('can not', 'xyz')).toThrow();
  });
});

describe('picture words', () => {
  const s = 'A {fluffy white|☁️} dog napped {under a red umbrella|☂️}.';
  it('finds the details and their icons', () => {
    const { pieces, details } = pictureWords(s);
    expect(details).toBe(2);
    expect(pieces).toEqual([
      { text: 'A ' },
      { text: 'fluffy white', detail: 0, icon: '☁️' },
      { text: ' dog napped ' },
      { text: 'under a red umbrella', detail: 1, icon: '☂️' },
      { text: '.' },
    ]);
  });
  it('closes up the gaps a hidden detail leaves', () => {
    const { pieces } = pictureWords(s);
    expect(pictureSentence(pieces, [false, false])).toBe('A dog napped.');
    expect(pictureSentence(pieces, [true, false])).toBe('A fluffy white dog napped.');
    expect(pictureSentence(pieces, [true, true])).toBe('A fluffy white dog napped under a red umbrella.');
  });
  it('rejects broken braces', () => {
    expect(() => pictureWords('A {big dog.')).toThrow();
    expect(() => pictureWords('A big} dog.')).toThrow();
    expect(() => pictureWords('A {} dog.')).toThrow();
  });
});

describe('word snap', () => {
  it('checks that two words make the compound', () => {
    expect(isCompound('snow', 'man', 'snowman')).toBe(true);
    expect(isCompound('Sun', 'flower', 'sunflower')).toBe(true);
    expect(isCompound('sun', 'flower', 'sunflowers')).toBe(false);
    expect(isCompound('', 'man', 'man')).toBe(false);
  });
});

describe('run-on fixer', () => {
  it('finds the stops and the capitals that follow them', () => {
    const r = runOn('we went sledding | it was so fast | I fell off');
    expect(r.stops).toEqual([2, 6]);
    expect(r.words.join(' ')).toBe('we went sledding it was so fast I fell off');
    expect(r.fixed.join(' ')).toBe('We went sledding It was so fast I fell off');
  });
  it('needs words on both sides of each stop', () => {
    expect(() => runOn('one sentence only')).toThrow();
    expect(() => runOn('we went | ')).toThrow();
  });
});
