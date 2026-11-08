# Writing a concept

- One concept is one file: `content/grade-N/<subject>/<id>.yaml`. The file name matches `id`, `grade`
  matches the folder, and the concept is listed in `content/grade-N/<subject>/_roadmap.yaml` (with the
  subject's `blurb` for the grade page).
- Educator notes: `content/educators/grade-N/<subject>/<id>.yaml`, plus `_subject.yaml` for the guide.
- Schema: [`src/lib/schema.ts`](../src/lib/schema.ts). Copy the shape of an existing concept.
- Problems follow [QUESTION-STANDARD.md](QUESTION-STANDARD.md). Read it first.

Commands:
- `npm run statements -- <subject> <outcome-code>` lists the statements and their codes.
- `npm run verify` checks every grade. Narrow it with `-- grade-6`, `-- grade-6/math` or
  `-- grade-6/<concept-id>`.
- `npm run audit` (or `-- grade-6/math`) regenerates
  [`curriculum-audit/grade-N-<subject>.md`](curriculum-audit/).

## Rule 0: write for the grade

`gradeProfile` in [`src/site.ts`](../src/site.ts) sets the limits, and `npm run verify` enforces them.

| | Grades 1–2 | Grades 3–6 |
|---|---|---|
| Problems | 6: 2 Warm-up, 2 Build, 2 Deep Think | 9: 3, 4, 2 |
| Unlock the next level after | 1 solved | 2 solved |
| Investigation parts / Deep Think steps | 2 / 3 | 3 / 5 |
| Different thinking moves | 3 | 4 |
| Longest paragraph or list item | 20 words | 40 words |
| Big idea | at most 3 bullets | 3–4 bullets |
| Lesson steps | at most 5 | 4–6 |
| A visual, experiment or figure | in every step | leads each step |
| Problem prompt | under 30 words | |

- Grades 1–2: show, don't tell. Let the animation carry the idea, with a few words as labels.
- Use words a child in that grade uses, and that grade's curriculum examples.
- Math Deep Think in Grades 1–2 needs a non-choice problem (`order`, `number`, `build`), not
  necessarily an investigation.

## Rule 1: only what the curriculum lists

Every block, problem and key term has a `covers:` list of the statements it teaches:

| Reference | Meaning |
|---|---|
| `K1.2` | Knowledge statement 2 in group 1 of the concept's outcome |
| `U1.1` | Understanding statement |
| `S1.3` | Skills and procedures statement |
| `SCI3-OI1-GQ1-LO1#K3.3` | A statement from another outcome, such as an earlier grade |

`npm run verify` fails when:
- a reference doesn't exist or points to a later grade;
- a block or problem teaches nothing from this grade and outcome;
- a `remember` callout points anywhere but an earlier grade.

Find the statement before you write the sentence. Where a statement lists examples, use them: the
Grade 5 civilizations are Egypt, Greece, Rome, China, India and Arab civilizations, so Mesopotamia is out.

Earlier grades: a `remember` callout may recall Grade 1 up to the grade below. Kindergarten isn't
supported, so Grade 1 has no recalls.

## Rule 2: visual first, never a wall of text

A lesson is 4–6 **steps**, each with a title and 1–5 blocks. Lead each step with something to look
at or play with. Keep text to a sentence or two.

| Block | Use it for |
|---|---|
| `visual` | An interactive visual (list below) |
| `experiment` | An animated experiment: predict → Run → watch → why. Text must match the animation |
| `compare` | 2–4 side-by-side cards, optionally with a `figure` |
| `figure` | A generated picture with a caption |
| `table` | Facts in rows and columns |
| `example` | A worked example as numbered step cards |
| `callout` | `tip`, `mistake` (a misconception) or `remember` (earlier-grade recall) |
| `text` | A short explanation. Use sparingly |
| `passage` | An original reading passage |

Visuals:
- **Math:** `place-value`, `decimal-zoom`, `column-calc`, `divisibility`, `fraction-explorer`,
  `fraction-regroup`, `fraction-add`, `ratio-explorer`, `expression-steps`, `mystery-bags`,
  `balance-scale`, `symmetry-explorer`, `coordinate-grid`, `rectangle-builder`, `sequence-builder`,
  `data-sorter`
- **Science:** `particle-model`, `measure-tools`, `density-balance`, `flight-forces`, `float-lab`,
  `energy-map`, `weather-station`, `climate-graph`, `weather-map`, `harvest-sim`, `body-systems`,
  `plant-transport`, `seasons-orbit`, `moon-phases`, `aurora`, `block-code`, `design-lab`, `fair-test`,
  `data-views`
- **Social Studies:** `globe`, `latlong-map`, `civ-timeline`, `rise-fall-city`, `then-now`,
  `social-scientists`, `village-city`, `nilometer`, `trade-map`, `social-pyramid`, `empire-map`,
  `issue-investigator`, `democracy-globe` (`focus`: a stop id), `athens-assembly`, `democracy-map`
  (`view: greece` or `compare`), `gov-branches` (`set: rome` or `canada`),
  `crown-balance`, `grand-council`, `election-sim`, `charter-check`
- **ELAL:** `inference-equation`, `story-path`, `page-explorer` (`set: forms` or `features`),
  `poem-reader`, `script-stage`, `voice-lab`, `voice-reach`, `talk-it-out`, `word-builder`,
  `word-journey`, `figure-lens`, `perspective-lens`, `writing-path` (`~~cut~~`, `++added++`),
  `sentence-rhythm`, `show-dial`, `topic-funnel`, `sentence-lab` (`mode: roles`, `tense`, `adverb`,
  `join`), `spell-builder`, `punct-lab` (`mode: capitals` or `effect`)
- **Any subject:** `card-sort` (`props: { bins: [{ id, label, icon }], cards: [{ text, bin, why }] }`)

Experiments: `container-swap`, `liquid-layers`, `syringe-squeeze`, `arrow-flight`, `egg-float`,
`energy-run`, `soil-storm`, `body-trip`, `celery-dye`, `sun-path`, `eclipses`, `scroll-scan`, `echo-room`.

If an idea would be clearer as an animation, 3D view or manipulative, build it in
`src/components/visuals/` (lazy-loaded if heavy) instead of describing it.

### Lists, not paragraphs

- **Steps** (a method, a hook, a routine) are a numbered list.
- **Several ideas** (a Big idea, what an animation showed) are bullets. A Big idea is 3–4 bullets.
- **One idea** can stay a sentence or two.

`npm run verify` checks lessons, Big ideas, educator notes and subject guides. It fails on a 3+ sentence
paragraph of 25+ words, or any paragraph or list item over 40 words. Passages and `>` quotes are exempt.
Inline fields, such as activity steps, can't hold a list: keep them to two short sentences.

## Rule 3: quality over quantity

- At most 9 problems (6 in Grades 1–2), as in Rule 0. Levels and depth are in
  [QUESTION-STANDARD.md](QUESTION-STANDARD.md).
- Every problem names its `thinking:` move.
- Every wrong `mc` choice has `feedback` explaining the misconception.
- Every computed answer has a `verify:` expression, checked with exact fractions.
- The grade's reading level, Canadian spelling (colour, centre, metres).

## Problem types

| type | needs |
|---|---|
| `mc` | `choices`, `answer` (index), `feedback` per wrong index; `fixedOrder: true` keeps the order |
| `multi` | `choices`, `answer` (list of indexes) |
| `number` | `answer`; optional `unit`, `tolerance`, `verify` |
| `fraction` | `answer` (`11/4` or `2 3/4`), `form` (`any`, `mixed`, `improper`), `verify` |
| `text` | `accept` (accepted answers) |
| `order` | `items` in the correct order (shuffled at build time) |
| `evidence` | `passage` (id), `paragraphs`, `answer` (sentence ids like `p9s1`), `feedback` per sentence |
| `open` | `modelAnswer`, `rubric` (2–5 items). ELAL only, at most 1 per set, where writing is the skill |
| `build` | `fields`, `rules` (`test`, `fail`), `examples`, `counterexamples` |
| `investigation` | `prompt`, up to 3 `parts` (`mc`, `multi`, `number`, `fraction`, `text`, `build`, `open`), `wrapUp` |

## Figures

Used in problems, `figure` blocks and `compare` columns:

- `{ kind: fraction-bars, n, d, wholes }`
- `{ kind: number-line, n, d, wholes, label }`
- `{ kind: area-model, a, b }`: multiplication split by place value
- `{ kind: coord-grid, size, points: [{ x, y, label }], polygon: [[x, y], …] }`
- `{ kind: rect, w, h, unit }`
- `{ kind: shape, shape, lines }`: shapes from the symmetry explorer
- `{ kind: square-metre }`
- `{ kind: particle-boxes, boxes: [gas, solid, liquid] }`
- `{ kind: forces, object: plane, forces: [{ kind: thrust, size: 1.5 }, { kind: drag }], water: true }`
- `{ kind: balance, left: [A], right: [100 g, 50 g], down: left }`: `down` is `left`, `right` or `none`
- `{ kind: cylinder, max: 100, minor: 2, major: 10, level: 64 }`: graduated cylinder
- `{ kind: moons, ages: [3.7, 7.4], labels: [A, B] }`: `ages` in days into the cycle
- `{ kind: code, blocks: [move, { repeat: 4, body: [move, right] }] }`: block code
- Raw inline SVG for a one-off. Use the site's CSS classes so dark mode works.

## Math and YAML pitfalls

- Math: `\( … \)` inline, `\[ … \]` display. `$` stays free for money.
- Put math in single quotes (`'\(\frac{7}{4}\)'`) or a block scalar (`|-`).
- Quote any string containing `: `. `node scripts/quote-yaml.ts <file>` fixes a file.
- A comma in an unquoted `[a, b, c]` item silently splits it. Quote it, or use one item per line. In a
  visual's `{ text: a, b }` props, `npm run verify` catches it.
- Write apostrophes as `’`. A straight `'` ends a single-quoted string.
- Write affixes as `-ous` and `trans-`, not `<ous>`, which Markdown reads as HTML.
- Give each visual its own CSS class prefix. Search `src/` first: component styles are global, so a
  repeated class restyles both.
