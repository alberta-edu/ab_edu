// Progress lives only in this browser (localStorage). No accounts, no server.
// Every read and write is guarded: storage can be blocked or cleared at any time,
// and the site must still work (progress just won't be remembered).
import { afterReview, enterReview, ENTER_AFTER_SOLVED, type ReviewState } from '../lib/srs.ts';

const KEY = 'abedu.progress.v1';
export const CHANGE_EVENT = 'abedu:progress';

export interface ProblemRecord {
  /** Graded attempts. */
  a: number;
  /** Solved. */
  s: boolean;
  /** Solved on the first attempt without a hint or the solution. */
  f: boolean;
  /** Used a hint before solving. */
  h: boolean;
  /** Looked at the solution before solving. */
  r: boolean;
  /** Last activity, epoch ms. */
  t: number;
}

export interface Progress {
  v: 1;
  created: number;
  problems: Record<string, ProblemRecord>;
  /** Spaced-review state per concept key ("g5/improper-fractions"). */
  review: Record<string, ReviewState>;
  /** Active days as YYYY-MM-DD, most recent last. */
  days: string[];
}

const empty = (): Progress => ({ v: 1, created: Date.now(), problems: {}, review: {}, days: [] });

let cache: Progress | null = null;

export function load(): Progress {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Progress) : null;
    cache = parsed?.v === 1 ? { ...empty(), ...parsed } : empty();
  } catch {
    cache = empty();
  }
  return cache;
}

function save(p: Progress) {
  cache = p;
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // Storage full or blocked: keep working in memory for this visit.
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function storageAvailable(): boolean {
  try {
    localStorage.setItem('abedu.test', '1');
    localStorage.removeItem('abedu.test');
    return true;
  } catch {
    return false;
  }
}

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

function markActive(p: Progress) {
  const t = today();
  if (p.days.at(-1) !== t) p.days = [...p.days, t].slice(-400);
}

const conceptOf = (problemKey: string) => problemKey.split('/').slice(0, 2).join('/');

export const problem = (key: string): ProblemRecord | undefined => load().problems[key];

/** Records the outcome of a graded attempt. */
export function recordAttempt(key: string, correct: boolean): void {
  const p = load();
  const prev = p.problems[key] ?? { a: 0, s: false, f: false, h: false, r: false, t: 0 };
  const rec: ProblemRecord = { ...prev, a: prev.a + 1, t: Date.now() };
  if (correct && !prev.s) {
    rec.s = true;
    rec.f = prev.a === 0 && !prev.h && !prev.r;
  }
  p.problems[key] = rec;
  markActive(p);

  const concept = conceptOf(key);
  if (correct && !p.review[concept] && solvedIn(concept, p) >= ENTER_AFTER_SOLVED) {
    p.review[concept] = enterReview(Date.now());
  }
  save(p);
}

/** Notes that a hint or the solution was opened before the problem was solved. */
export function recordHelp(key: string, kind: 'hint' | 'solution'): void {
  const p = load();
  const prev = p.problems[key] ?? { a: 0, s: false, f: false, h: false, r: false, t: 0 };
  if (prev.s) return;
  p.problems[key] = { ...prev, h: prev.h || kind === 'hint', r: prev.r || kind === 'solution', t: Date.now() };
  save(p);
}

export function solvedIn(concept: string, p = load()): number {
  const prefix = concept + '/';
  return Object.entries(p.problems).filter(([k, r]) => k.startsWith(prefix) && r.s).length;
}

export function recordReview(concept: string, correct: number): ReviewState {
  const p = load();
  const now = Date.now();
  const next = afterReview(p.review[concept] ?? enterReview(now), correct, now);
  p.review[concept] = next;
  markActive(p);
  save(p);
  return next;
}

/** Consecutive active days ending today or yesterday. */
export function streak(p = load()): number {
  const set = new Set(p.days);
  const d = new Date();
  if (!set.has(today())) d.setDate(d.getDate() - 1);
  let n = 0;
  for (;;) {
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!set.has(k)) return n;
    n++;
    d.setDate(d.getDate() - 1);
  }
}

export function exportJson(): string {
  return JSON.stringify({ app: 'ab-edu', exported: new Date().toISOString(), progress: load() }, null, 2);
}

/** Replaces progress with an exported file's contents. Throws on a file that isn't ours. */
export function importJson(text: string): void {
  const data = JSON.parse(text);
  const p = data?.progress;
  if (data?.app !== 'ab-edu' || p?.v !== 1 || typeof p.problems !== 'object') {
    throw new Error('This file is not an Alberta Edu progress file.');
  }
  save({ ...empty(), ...p });
}

export function reset(): void {
  save(empty());
}

/** Keeps pages in sync when progress changes in this tab or another one. */
export function onChange(fn: () => void): void {
  window.addEventListener(CHANGE_EVENT, fn);
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      cache = null;
      fn();
    }
  });
}
