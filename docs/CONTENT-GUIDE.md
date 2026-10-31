# Writing a concept

One concept is one YAML file: `content/grade-5/<subject>/<id>.yaml`. The file name must
match `id`, and the concept must already be listed in `content/grade-5/roadmap.yaml`.
Schema: [`src/lib/schema.ts`](../src/lib/schema.ts). The four finished concepts are the
reference examples.

Commands:
- `npm run statements -- <subject> <outcome-code>` lists the outcome's statements with
  reference codes.
- `npm run verify` checks your file.
- `npm run audit` regenerates [curriculum-audit.md](curriculum-audit.md).

## Rule 1: only what the curriculum lists

Every lesson block, problem and key term has a `covers:` list. Each entry is a reference to
the curriculum statement it teaches:

| Reference | Meaning |
|---|---|
| `K1.2` | Knowledge statement 2 in KUSP group 1 of the concept's outcome |
| `U1.1` | Understanding statement |
| `S1.3` | Skills and procedures statement |
| `SCI3-OI1-GQ1-LO1#K3.3` | A statement from another outcome, such as an earlier grade |

`npm run verify` fails the build when:
- a reference doesn't exist;
- a reference points to a **later grade** (e.g. Grade 6 ideas in a Grade 5 page);
- a block or problem doesn't teach at least one statement from this grade and outcome;
- a `remember` callout references anything other than an earlier grade.

**Before writing a sentence, find the statement it traces to.** If none exists, the
sentence doesn't belong on the page. Where a statement lists examples, use those examples:
the Grade 5 civilizations are Egypt, Greece, Rome, China, India and Arab civilizations, so
Mesopotamia is out. Earlier-grade knowledge may only appear as a short, labelled
`remember` recall that the new idea builds on.

## Rule 2: visual first, never a wall of text

A lesson is 4–6 **steps**. Each step has a title and 1–5 blocks, and is shown on its own
in the Learn tab. Lead each step with something to look at or play with, and keep text to
a sentence or two.

| Block | Use it for |
|---|---|
| `visual` | Interactive visuals. Math: `place-value`, `decimal-zoom`, `column-calc` (step-by-step algorithms), `divisibility`, `fraction-explorer`, `fraction-regroup`, `fraction-add`, `ratio-explorer`, `expression-steps`, `mystery-bags`, `balance-scale`, `symmetry-explorer`, `coordinate-grid`, `rectangle-builder`, `sequence-builder`, `data-sorter`. Science: `particle-model`, `measure-tools`, `density-balance`, `flight-forces`, `float-lab`, `energy-map`, `weather-station`, `climate-graph`, `weather-map`, `harvest-sim`, `body-systems`, `plant-transport`, `seasons-orbit`, `moon-phases`, `aurora`, `block-code`, `design-lab`, `fair-test`, `data-views`. Social Studies: `globe`, `latlong-map`, `civ-timeline`, `rise-fall-city`, `then-now`, `social-scientists`, `village-city`, `nilometer`, `trade-map`, `social-pyramid`, `empire-map`, `issue-investigator`. Any subject: `card-sort` (`props: { bins: [{ id, label, icon }], cards: [{ text, bin, why }] }`). ELAL: `inference-equation` |
| `experiment` | An animated virtual experiment: predict → Run → watch → why. The text must match what the animation shows. Animations: `container-swap`, `liquid-layers`, `syringe-squeeze`, `arrow-flight`, `egg-float`, `energy-run`, `soil-storm`, `body-trip`, `celery-dye`, `sun-path`, `eclipses`, `scroll-scan` |
| `compare` | 2–4 side-by-side cards (optionally with a `figure`) for contrasting ideas |
| `figure` | A generated picture with a caption |
| `table` | Facts that line up in rows and columns |
| `example` | A worked example as numbered step cards |
| `callout` | `tip`, `mistake` (a misconception) or `remember` (earlier-grade recall) |
| `text` | A short explanation. Use sparingly |
| `passage` | A reading passage (original writing only) |

The best representation wins. If a concept would be clearer as an animation, a 3D view
or a manipulative, build that visual (in `src/components/visuals/`, lazy-loaded if it is
heavy) rather than describing the idea in words.

## Rule 3: quality over quantity

About 4 Warm-up, 4–5 Build and 3–4 Deep Think problems per concept.

- **Warm-up**: recall and direct one-step use of the idea.
- **Build**: a new representation (figure, number line, map, excerpt), a word problem,
  or two steps.
- **Deep Think**: find the error, reverse the question, find the greatest or least,
  explain, or apply to an unfamiliar case. Tricky, never unfair.

Every wrong `mc` choice needs `feedback` that explains the misconception behind it.
Every computed answer needs a `verify:` expression, which is checked with exact
fractions.

Use kid-friendly language at a Grade 5 reading level, with Canadian spelling (colour,
centre, metres).

## Writing math

Use `\( … \)` for inline math and `\[ … \]` for display math. Dollar signs stay free for
money. Fractions always render full-size. In YAML, put math in single quotes
(`'\(\frac{7}{4}\)'`) or block scalars (`|-`). Any string containing `: ` must be quoted.

## Problem types

| type | needs |
|---|---|
| `mc` | `choices`, `answer` (index), `feedback` for every wrong index; `fixedOrder: true` keeps the authored order |
| `multi` | `choices`, `answer` (list of indexes) |
| `number` | `answer`; optional `unit`, `tolerance` and `verify` |
| `fraction` | `answer` such as `11/4` or `2 3/4`; `form`: `any`, `mixed` or `improper`; `verify` |
| `text` | `accept` (list of accepted answers) |
| `order` | `items`, written in the correct order (they are shuffled at build time) |
| `evidence` | `passage` (id), `paragraphs` (excerpt), `answer` (sentence ids `p9s1`…), `feedback` per sentence id |
| `open` | `modelAnswer`, `rubric` (2–5 self-check items); hints and solution are optional |

Figures (in problems, `figure` blocks and `compare` columns):
- `{ kind: fraction-bars, n, d, wholes }`
- `{ kind: number-line, n, d, wholes, label }`
- `{ kind: area-model, a, b }` (multiplication split by place value)
- `{ kind: coord-grid, size, points: [{ x, y, label }], polygon: [[x, y], …] }`
- `{ kind: rect, w, h, unit }`
- `{ kind: shape, shape, lines }` (shapes from the symmetry explorer)
- `{ kind: square-metre }`
- `{ kind: particle-boxes, boxes: [gas, solid, liquid] }`
- `{ kind: forces, object: plane, forces: [{ kind: thrust, size: 1.5 }, { kind: drag }], water: true }` (force diagram; a longer arrow is a bigger force)
- `{ kind: balance, left: [A], right: [100 g, 50 g], down: left }` (`down`: `left`, `right` or `none`; items like `100 g` are drawn as standard masses)
- `{ kind: cylinder, max: 100, minor: 2, major: 10, level: 64 }` (graduated cylinder)
- `{ kind: moons, ages: [3.7, 7.4], labels: [A, B] }` (Moon faces; `ages` are days into the cycle)
- `{ kind: code, blocks: [move, { repeat: 4, body: [move, right] }] }` (block code)
- Raw inline SVG, for a one-off diagram. Use the site's CSS classes so it works in dark mode.

If YAML complains about `: ` inside text, run `node scripts/quote-yaml.ts <file>`.

A comma inside an unquoted `[a, b, c]` list starts a new item, and nothing warns you unless the
answer indexes stop matching. Quote that item, or write the list one item per line.

Each visual uses its own CSS class prefix. Before picking a new one, search `src/` for it: a
class defined twice (even in different components) restyles both, because component styles
are global.
