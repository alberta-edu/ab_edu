import { describe, expect, it } from 'vitest';
import { braidLayout, hasFlashback, type BraidScene } from '../src/components/visuals/plot-braid.ts';

const scene = (strand: BraidScene['strand'], when: number): BraidScene => ({ strand, when, text: `${strand} ${when}` });

describe('plot braid', () => {
  const story = [scene('main', 2), scene('sub', 3), scene('flash', 1), scene('main', 4)];

  it('keeps the telling order and sorts by time', () => {
    const { tell, time } = braidLayout(story);
    expect(tell).toEqual([0, 1, 2, 3]);
    expect(time).toEqual([1, 2, 0, 3]);
  });

  it('notices a jump back in time', () => {
    expect(hasFlashback(story)).toBe(true);
    expect(hasFlashback([scene('main', 1), scene('sub', 2)])).toBe(false);
  });

  it('refuses two scenes at the same moment', () => {
    expect(() => braidLayout([scene('main', 1), scene('sub', 1)])).toThrow();
  });
});

import { capacity, circlePath, spiralPath, shapePath } from '../src/components/visuals/concrete-poem.ts';

describe('concrete poem', () => {
  it('draws a spiral that starts outside and ends near the middle', () => {
    const nums = spiralPath(100, 100, 80, 10, 3, 60).match(/-?\d+(\.\d+)?/g)!.map(Number);
    const [x0, y0] = nums.slice(0, 2);
    const [x1, y1] = nums.slice(-2);
    expect(Math.hypot(x0 - 100, y0 - 100)).toBeCloseTo(80, 0);
    expect(Math.hypot(x1 - 100, y1 - 100)).toBeCloseTo(10, 0);
  });

  it('closes the circle where it started', () => {
    expect(circlePath(50, 50, 20)).toMatch(/^M30 50 .* 30 50$/);
  });

  it('fits more words on the spiral than on the circle', () => {
    expect(capacity('spiral')).toBeGreaterThan(capacity('circle'));
    expect(shapePath('spiral').startsWith('M')).toBe(true);
  });
});

import { parsePhrases, plainLine, phraseTime } from '../src/components/visuals/phrase-reader.ts';
import { projection } from '../src/components/visuals/voice-aim.ts';

describe('phrase reader', () => {
  it('splits a marked line into phrases, pauses and stressed words', () => {
    const ph = parsePhrases(['The snow fell / all *night* // and the town slept']);
    expect(ph.map((p) => p.words.map((w) => w.text).join(' '))).toEqual(['The snow fell', 'all night', 'and the town slept']);
    expect(ph.map((p) => p.pause)).toEqual([1, 2, 2]);
    expect(ph[1].words[1].stress).toBe(true);
  });

  it('keeps punctuation next to a stressed word', () => {
    expect(parsePhrases(['I said *no!*'])[0].words[2]).toEqual({ text: 'no!', stress: true });
  });

  it('ends every line with a long pause', () => {
    const ph = parsePhrases(['one / two', 'three']);
    expect(ph.map((p) => [p.line, p.pause])).toEqual([[0, 1], [0, 2], [1, 2]]);
  });

  it('gives the plain words without marks', () => {
    expect(plainLine('all *night* // long')).toBe('all night long');
  });

  it('holds a long pause longer than a short one', () => {
    const [a, b] = parsePhrases(['go / go']);
    expect(phraseTime(b)).toBeGreaterThan(phraseTime(a));
  });
});

describe('voice aim', () => {
  it('reaches the target only with breath, clarity and intention together', () => {
    expect(projection(true, true, true).heard).toBe(true);
    for (const [b, c, i] of [[true, true, false], [true, false, true], [false, true, true]]) expect(projection(b, c, i).heard).toBe(false);
  });

  it('names what is missing', () => {
    expect(projection(true, false, false).missing).toEqual(['clarity', 'intention']);
  });

  it('carries further with breath', () => {
    expect(projection(true, false, false).reach).toBeGreaterThan(projection(false, false, false).reach);
  });
});

import { joinNote, splitJoin } from '../src/components/visuals/suffix-builder.ts';

describe('suffix builder', () => {
  it('joins parts that need no change', () => {
    expect(splitJoin('rain', 'y', 'rainy')).toEqual({ kept: 'rain', dropped: '', added: '', suffix: 'y' });
    expect(joinNote(splitJoin('wash', 'able', 'washable'))).toBe('');
  });

  it('drops a silent e', () => {
    const j = splitJoin('sense', 'ible', 'sensible');
    expect([j.kept, j.dropped, j.added]).toEqual(['sens', 'e', '']);
    expect(joinNote(j)).toBe('The silent e drops.');
  });

  it('changes y to i', () => {
    expect(joinNote(splitJoin('happy', 'ly', 'happily'))).toBe('The y changes to i.');
  });

  it('doubles a last letter', () => {
    const j = splitJoin('run', 'ing', 'running');
    expect(j.added).toBe('n');
    expect(joinNote(j)).toBe('The last letter doubles.');
  });

  it('refuses a word without its suffix', () => {
    expect(() => splitJoin('play', 'ful', 'player')).toThrow();
  });
});
