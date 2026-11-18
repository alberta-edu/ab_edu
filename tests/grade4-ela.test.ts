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
