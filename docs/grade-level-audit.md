# Grade 5 grade-level audit

Does any problem need knowledge from above Grade 5? A problem can carry the right `covers:` tag and
still need Grade 6 math, so `npm run verify` isn't enough on its own.

This audit ran on the Phase 7 set of 553 problems. `fix/lighter-practice` later cut each topic to 9,
so some problems named below are gone.

## How it was checked

1. **Authors:** Claude Opus 5.5 wrote each set with the Grade 4, 5 and 6 curriculum side by side, and
   solved it as a Grade 5 child would.
2. **Automatic:** `npm run verify` fails on math above the grade that it can detect
   (`src/lib/quality.ts`):
   - multiplying or dividing decimals;
   - products beyond 3-digit × 2-digit, division beyond 3-digit ÷ 1-digit;
   - negative answers, powers, percent of a number, unlike denominators.
3. **Blind solve:** Claude Sonnet 5.5 read only the lesson, solved each problem without the key, and
   checked what a child would need to know against the Grade 6 statements. Changed problems were
   checked again.

## Result

**567 checks within grade, 11 near misses, 0 above grade, 0 wrong answer keys.** Each investigation
part counted as its own check. Every near miss was fixed:

| Near miss | Fix |
|---|---|
| `authors-craft` d2: reading sarcasm is a Grade 6 tone skill | A sigh in the story gives the clue |
| `evidence-bias-ethics` d3: needs germs to be too small to see | The problem says so |
| `forces-of-flight` d3: string and balloon examples are tension and action-reaction | Now a rubber-band glider and a propeller |
| `moon-eclipses-auroras` d4: needs the midnight sun, taught elsewhere | The problem states it |
| `place-value-decimals` d2: asked for "ten-thousandths" | Removed; only reasoning between 0.999 and 1 stays |
| `spelling-punctuation` b4: needs "Saint" and "Drive" | The problem gives the meanings |
| `government-social-systems` b2, b4, d3, d4: needed a Learn-tab visual | The facts are in the problem |
| `multiply-divide-algorithms` b2: solution used 2 412 ÷ 2 | Removed |

Judgement calls that stay:

| Problem | Why it stays |
|---|---|
| `algebraic-expressions` b4, \(2L + 6\) | Comes from repeated addition, not combining like terms |
| `algebraic-expressions` d2, \(3n + 2\) from a table | Two-term expressions are Grade 5 |
| `ratios-percentages` d1, 14 of 28 | Reasoned as half, not calculated as a percent |
| `rise-fall-civilizations` b4, `trade-economy` b1 | Solved by grouping and skip counting, not rates |
| `particle-model` d1 | Make-believe rays change attraction only; heat never comes up |

## What this can't promise

Two AI models did these readings. No child or teacher has tried the problems yet.
