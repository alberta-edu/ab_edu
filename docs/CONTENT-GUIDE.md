# Writing a concept

One concept is one YAML file: `content/grade-5/<subject>/<id>.yaml`. The file name must
match `id`, and the concept must already be listed in `content/grade-5/roadmap.yaml`.
Schema: [`src/lib/schema.ts`](../src/lib/schema.ts). The four finished concepts are the
reference examples:

- `math/improper-fractions.yaml`
- `science/particle-model.yaml`
- `social-studies/latitude-longitude.yaml`
- `english-language-arts/inference-evidence.yaml`

Run `npm run verify` after every change.

## Standards

1. **Stay inside the outcome.** Teach what the outcome's knowledge, understanding and
   skills statements in `curriculum/grade-5/<subject>.json` say, and nothing beyond Grade
   5. If something is only a connection to another topic, put it in a `connection`
   callout.
2. **Visual first.** Open the lesson with something the student can see or play with: an
   interactive `visual` or an animated `experiment`. Text explains what they are seeing,
   in short sections and bullets, never long blocks.
3. **Experiments are virtual and animated.** The student predicts with one tap, presses
   Run, watches it happen on screen, then reads "what happened / why". The text must
   match what the animation shows; tune the animation if it doesn't.
4. **Quality over quantity.** About 4 Warm-up, 4–5 Build and 3–4 Deep Think problems per
   concept.
   - **Warm-up**: recall and direct one-step use of the idea.
   - **Build**: a new representation (figure, number line, map, excerpt), a word problem,
     or two steps.
   - **Deep Think**: find the error, reverse the question, find the greatest or least,
     explain, apply to an unfamiliar case. Tricky, never unfair.
5. **Every wrong choice teaches.** Every wrong choice in an `mc` question needs `feedback`
   that explains the misconception behind it. `verify` enforces this.
6. **Machine-check the math.** Every `number` and `fraction` problem with a computed
   answer gets a `verify:` expression, which the verifier evaluates with exact fractions.
7. **Original text only.** Reading passages, poems and examples are written for the site.
   Facts, dates and coordinates must come from reliable sources.
8. **Kid-friendly language.** Grade 5 reading level, short sentences, Canadian spelling
   (colour, centre, metres).

## Writing math

Use `\( … \)` for inline math and `\[ … \]` for display math. Dollar signs stay free for
money. Fractions are always shown full-size. Inside YAML, put math strings in single
quotes (`'\(\frac{7}{4}\)'`) or block scalars (`|-`). Any string containing `: ` must be
quoted.

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

Figures: `figure: { kind: fraction-bars, n, d, wholes }`,
`{ kind: number-line, n, d, wholes, label }` or
`{ kind: particle-boxes, boxes: [gas, solid, liquid] }`.
