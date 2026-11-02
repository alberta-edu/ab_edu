# Grade 5 grade-level audit

Does any practice problem need knowledge from above Grade 5? This records how that was checked and what
was found. A problem can be tagged with the right curriculum statement and still secretly need Grade 6
math, so `npm run verify` isn't enough on its own.

## How it was checked

1. **Authors.** Each set was written by Claude Opus 5.5 with Grades 4, 5 and 6 of the curriculum side by
   side, and solved as a Grade 5 child would solve it.
2. **Automatic.** `npm run verify` fails on math above the grade that it can detect: multiplying or
   dividing decimals, products beyond 3-digit by 2-digit, division beyond 3-digit by 1-digit, negative
   answers, powers, a percent of a number, and unlike denominators. See `src/lib/quality.ts`.
3. **Independent solve.** A different model, Claude Sonnet 5.5, read only the lesson, solved each problem
   without the answer key, and then compared. For each problem it asked what a child would have to already
   know, and checked that against the Grade 6 statements. Problems changed afterwards were checked again.

## Result

No problem was found to be above the grade, and no answer key was found to be wrong, in the final set of
553 problems. Reviewers counted each part of an investigation separately, which is why the counts below add
up to more than 553.

**567 checks within grade, 11 near misses, 0 above grade.** Every near miss below was then dealt with.

| Near miss | Resolution |
|---|---|
| `authors-craft` d2: reading a sarcastic "Perfect" is a Grade 6 tone skill | A sigh in the story now gives the clue |
| `evidence-bias-ethics` d3: needs to know germs are too small to see | The problem now says so |
| `forces-of-flight` d3: the model answer used a string and a released balloon, which are tension and action-reaction | Replaced with a rubber-band glider and a propeller |
| `moon-eclipses-auroras` d4: needs the midnight sun, taught in another topic | The problem now states it |
| `place-value-decimals` d2: asked for the name "ten-thousandths" | Removed. Going past thousandths stays only as reasoning about a number between 0.999 and 1, which Grade 5 asks for |
| `spelling-punctuation` b4: needs "Saint" and "Drive" | The problem now states the meanings |
| `government-social-systems` b2, b4, d3, d4: needed a visual from the Learn tab | The facts are now in the problem |
| `multiply-divide-algorithms` b2: a solution mentioned 2 412 ÷ 2 | Removed from the solution |

Authors also raised these as judgement calls. They stay, for the reason given:

| Problem | Why it stays |
|---|---|
| `algebraic-expressions` b4, \(2L + 6\) | Comes from repeated addition, Grade 5, not from combining like terms |
| `algebraic-expressions` d2, \(3n + 2\) from a table | Two-term expressions are Grade 5. The one-operation limit belongs to the sequences outcome |
| `ratios-percentages` d1, 14 of 28 | Reasoned as half, without calculating a percent |
| `rise-fall-civilizations` b4 and `trade-economy` b1 | Solved by grouping and skip counting, not as a rate or by long division |
| `particle-model` d1 | Make-believe rays change attractive forces only. Heat is never mentioned |

## What this can't promise

These were careful readings by two AI models. No child or teacher has tried the problems yet, so the
owner's review and real classroom use may still find problems that are harder than they look.

## By topic

### Mathematics

| Topic | Within grade | Near miss | Above grade |
|---|---|---|---|
| add-subtract-algorithms | 11 | 0 | 0 |
| add-subtract-fractions | 12 | 0 | 0 |
| algebraic-expressions | 14 | 0 | 0 |
| area-perimeter | 13 | 0 | 0 |
| arithmetic-sequences | 12 | 0 | 0 |
| coordinate-grids | 12 | 0 | 0 |
| divisibility-factors | 13 | 0 | 0 |
| frequency-mode | 11 | 0 | 0 |
| improper-fractions | 14 | 0 | 0 |
| multiply-divide-algorithms | 14 | 0 | 0 |
| order-of-operations | 11 | 0 | 0 |
| place-value-decimals | 10 | 1 | 0 |
| ratios-percentages | 11 | 0 | 0 |
| solving-equations | 14 | 0 | 0 |
| symmetry | 12 | 0 | 0 |

### Science

| Topic | Within grade | Near miss | Above grade |
|---|---|---|---|
| algorithms-loops | 12 | 0 | 0 |
| body-systems | 11 | 0 | 0 |
| buoyancy | 10 | 2 | 0 |
| climate-agriculture | 11 | 0 | 0 |
| controlled-experiments | 12 | 0 | 0 |
| design-process | 12 | 0 | 0 |
| energy-resources | 12 | 0 | 0 |
| evidence-bias-ethics | 11 | 1 | 0 |
| forces-of-flight | 10 | 1 | 0 |
| mass-volume-density | 10 | 0 | 0 |
| moon-eclipses-auroras | 10 | 1 | 0 |
| particle-model | 10 | 0 | 0 |
| plant-transport | 11 | 0 | 0 |
| seasons-day-length | 11 | 0 | 0 |
| weather-climate | 11 | 0 | 0 |

### Social Studies

| Topic | Within grade | Near miss | Above grade |
|---|---|---|---|
| government-social-systems | 17 | 0 | 0 |
| historians-sources | 11 | 0 | 0 |
| informed-citizenship | 12 | 0 | 0 |
| latitude-longitude | 14 | 1 | 0 |
| rise-fall-civilizations | 11 | 0 | 0 |
| trade-economy | 19 | 0 | 0 |

### English Language Arts and Literature

| Topic | Within grade | Near miss | Above grade |
|---|---|---|---|
| authors-craft | 11 | 1 | 0 |
| figurative-language | 11 | 0 | 0 |
| grammar | 11 | 0 | 0 |
| inference-evidence | 13 | 0 | 0 |
| oral-communication | 12 | 0 | 0 |
| perspective-context | 11 | 0 | 0 |
| poetry-drama | 11 | 0 | 0 |
| research-skills | 12 | 0 | 0 |
| spelling-punctuation | 10 | 1 | 0 |
| text-forms-genres | 10 | 2 | 0 |
| word-origins-affixes | 12 | 0 | 0 |
| writing-process | 11 | 0 | 0 |
