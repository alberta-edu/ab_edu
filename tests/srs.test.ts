import { describe, expect, it } from 'vitest';
import { afterReview, enterReview, isDue, pickRound, DAY, INTERVALS } from '../src/lib/srs.ts';

const NOW = new Date(2026, 9, 1, 12).getTime();

describe('Leitner schedule', () => {
  it('starts in box 1, due tomorrow', () => {
    const s = enterReview(NOW);
    expect(s.box).toBe(0);
    expect(s.due).toBe(NOW + DAY);
    expect(isDue(s, NOW)).toBe(false);
    expect(isDue(s, NOW + DAY)).toBe(true);
  });
  it('moves up a box on a pass and waits longer each time', () => {
    let s = enterReview(NOW);
    const gaps: number[] = [];
    for (let i = 0; i < 7; i++) {
      s = afterReview(s, 3, s.due);
      gaps.push(Math.round((s.due - s.last) / DAY));
    }
    expect(gaps).toEqual([3, 7, 14, 30, 60, 60, 60]);
    expect(s.box).toBe(INTERVALS.length - 1);
  });
  it('drops back to box 1 on a fail', () => {
    let s = enterReview(NOW);
    s = afterReview(s, 3, NOW);
    s = afterReview(s, 3, NOW);
    expect(s.box).toBe(2);
    s = afterReview(s, 1, NOW);
    expect(s).toMatchObject({ box: 0, lapses: 1, reviews: 3, due: NOW + DAY });
  });
  it('counts anything due later today as due', () => {
    const s = { ...enterReview(NOW), due: new Date(2026, 9, 1, 23, 0).getTime() };
    expect(isDue(s, NOW)).toBe(true);
  });
});

describe('pickRound', () => {
  const pool = [
    { key: 'w1', level: 1 as const, last: 5 },
    { key: 'w2', level: 1 as const, last: 1 },
    { key: 'b1', level: 2 as const, last: 0 },
    { key: 'b2', level: 2 as const, last: 9 },
    { key: 'd1', level: 3 as const, last: 3 },
  ];
  it('uses easier levels for low boxes and harder for high boxes', () => {
    expect(pickRound(pool, 0)).toEqual(['w2', 'b1', 'b2']);
    expect(pickRound(pool, 5)).toEqual(['b1', 'd1', 'w2']);
  });
  it('never repeats a problem', () => {
    const picked = pickRound(pool.slice(0, 2), 4);
    expect(new Set(picked).size).toBe(picked.length);
  });
});
