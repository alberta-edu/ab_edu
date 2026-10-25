// Spaced review on the Leitner system. A concept moves up one box after a passed review
// and back to box 1 after a failed one. Each box waits longer before the next review,
// so well-known concepts come back less often (an expanding forgetting-curve schedule).

export const DAY = 86_400_000;
/** Days to wait after a review in each box (box 1 is index 0). */
export const INTERVALS = [1, 3, 7, 14, 30, 60] as const;
/** A concept enters review once this many of its problems are solved. */
export const ENTER_AFTER_SOLVED = 3;
/** Problems per concept in one review round, and how many must be right to pass. */
export const ROUND_SIZE = 3;
export const PASS_MARK = 2;

export interface ReviewState {
  box: number; // 0-based
  due: number; // epoch ms
  last: number; // epoch ms of last review (or of entering review)
  reviews: number;
  lapses: number;
}

export function enterReview(now: number): ReviewState {
  return { box: 0, due: now + INTERVALS[0] * DAY, last: now, reviews: 0, lapses: 0 };
}

export function afterReview(s: ReviewState, correct: number, now: number): ReviewState {
  const passed = correct >= PASS_MARK;
  const box = passed ? Math.min(s.box + 1, INTERVALS.length - 1) : 0;
  return {
    box,
    due: now + INTERVALS[box] * DAY,
    last: now,
    reviews: s.reviews + 1,
    lapses: s.lapses + (passed ? 0 : 1),
  };
}

/** Anything due before the end of today counts as due today. */
export function isDue(s: ReviewState, now: number): boolean {
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return s.due <= end.getTime();
}

/** Which levels to draw a review round from. Higher boxes get harder problems. */
export function levelsForBox(box: number): (1 | 2 | 3)[] {
  if (box <= 1) return [1, 2, 2];
  if (box <= 3) return [2, 2, 3];
  return [2, 3, 3];
}

export interface Candidate {
  key: string;
  level: 1 | 2 | 3;
  /** When the student last worked on it (0 if never). */
  last: number;
}

/**
 * Picks a review round: follows levelsForBox where possible, prefers problems not seen
 * for the longest time, never repeats a problem, and falls back to any level.
 */
export function pickRound(candidates: Candidate[], box: number, size = ROUND_SIZE): string[] {
  const pool = [...candidates].sort((a, b) => a.last - b.last);
  const picked: string[] = [];
  for (const level of levelsForBox(box).slice(0, size)) {
    const c = pool.find((p) => p.level === level && !picked.includes(p.key)) ?? pool.find((p) => !picked.includes(p.key));
    if (c) picked.push(c.key);
  }
  return picked;
}
