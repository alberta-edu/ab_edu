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
