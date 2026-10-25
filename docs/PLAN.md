# AB Edu: Plan

A free, static learning site that follows Alberta's K–6 curriculum. Grade 5 is the first
edition. It covers the four subjects tested on the Provincial Achievement Tests: English
Language Arts and Literature, Mathematics, Science and Social Studies.

Nothing ships until the owner has reviewed and tested everything locally.

## 1. Ground truth: the curriculum

- Source: the current program of studies, taken from New LearnAlberta's published curriculum
  data (`curriculum.learnalberta.ca/cdn/curriculum/gfc-*.json`) and extracted with
  `scripts/extract-curriculum.ts` into [`curriculum/grade-5/`](../curriculum/grade-5/).
- Status for Grade 5 in 2026–27:
  - Math (implemented Sept 2023)
  - ELAL (Sept 2023)
  - Science (Sept 2024)
  - **Social Studies (new K–6, mandatory for Grades 4–6 in Sept 2026)**. Grade 5 Social
    Studies is now *ancient civilizations*. It is no longer the old "Canada: The Land,
    Histories and Stories".
- Every concept page lists the official outcome code(s) it teaches, and the page shows the
  official outcome text read from the extract. `npm run coverage` reports which outcomes
  have content and which do not.

## 2. Content model: how a concept is taught

Each **concept** is one page, and each page maps to one learning outcome (or to one
knowledge/understanding/skills group when an outcome is large). Every page follows the same
order:

1. **Big idea**: the key knowledge in one or two kid-friendly sentences.
2. **Lesson: visual first.** A student should *see* the idea before reading about it.
   Animations and interactive visuals carry the explanation. Text is short and labels what
   the student sees; it never replaces the visual. Lessons are built from typed blocks, and
   each block type has its own layout:
   - `visual`: an interactive visualization the student can manipulate
   - `experiment`: a **virtual experiment**. The student taps a prediction, presses
     **Run**, and watches an animation of what happens (for example, dye spreading in cold
     vs. hot water). A short "what happened / why" appears, along with whether the
     prediction matched. Nothing needs to be done at home.
   - `example`: a worked example with numbered steps and math typeset with KaTeX
   - `passage`: a reading passage, with numbered paragraphs and selectable sentences
   - `section`: short explanation text
   - `callout`: a tip, a common mistake, or a connection
   - `table`
3. **Key terms**, which also become review flashcards.
4. **Practice in three clearly marked levels**:
   - ★ **Warm-up** (easy): recall and direct application.
   - ★★ **Build** (medium): multi-step work, other representations, explaining.
   - ★★★ **Deep Think** (tricky): non-routine problems, reasoning, "what if", common traps.

   Levels unlock progressively. Solving 2 problems at one level unlocks the next, and a
   "peek ahead" option is always there, so nobody gets stuck behind a lock. Every problem
   has hints (from small to big), a worked solution, and targeted feedback on wrong answers.

**Quality over quantity**: about 10–12 carefully written problems per concept. Every wrong
choice is a real misconception and comes with an explanation.

### Problem types

| Type | Used for |
|---|---|
| `mc`, `multi` | concepts, misconceptions (every wrong option has feedback) |
| `number` | computations (accepts `1 000`, `1,000` and `1000`; optional tolerance) |
| `fraction` | fractions and mixed numbers; the form can be required ("value right, now write it as a mixed number") |
| `text` | vocabulary and spelling (list of accepted answers) |
| `order` | ordering numbers, sequencing events or steps (accessible ↑/↓ buttons) |
| `evidence` | ELA: tap the sentence(s) in the passage that prove an answer |
| `open` | written responses: compare with a model answer, then self-check a rubric |

### How we make sure the content is correct

- All content is written by Claude (Opus 5.5, the strongest available model for math and
  reasoning) at **authoring time** and stored as YAML in [`content/`](../content/).
  Nothing calls an AI model at runtime. That means no API keys, no cost, no data leaving
  the student's device, and it works offline once loaded.
- Math answers are **machine-checked**. A problem can carry a `verify` expression, which
  `npm run verify` evaluates with exact fraction arithmetic and compares to the stated
  answer. The script also checks the schema, IDs, choice indexes and passage sentence
  references.
- Every formula is typeset with KaTeX at **build time** with `throwOnError`, so a LaTeX
  typo fails the build instead of reaching a student.
- Facts in science and social studies stay within the curriculum's own knowledge
  statements. Places, dates and coordinates are checked against reliable references.

## 3. Architecture

- **Astro (static output)**. Every page is plain pre-rendered HTML, which is good for SEO
  and fast on old devices. There is no client framework; interactivity is small vanilla
  TypeScript custom elements, loaded only on pages that use them.
- **Math**: KaTeX renders to HTML and MathML at build time, so no math JavaScript runs in
  the browser. Interactive visuals draw their own lightweight fraction notation.
- **Maps**: the world map is projected at build time from Natural Earth data (d3-geo) into
  an inline SVG. The browser receives no map library.
- **Progress**: stored in `localStorage` under one versioned key, with Export/Import as a
  JSON file so students can move devices or keep a backup. Clearing the browser cache
  erases progress; the Progress page says so plainly.
- **Spaced review (Leitner system)**. When a student has solved 3 problems in a concept,
  the concept enters review box 1. Boxes are due after 1, 3, 7, 14, 30 and then 60 days, an
  expanding schedule that follows the forgetting curve. A review round draws 3 problems
  from the concept, with harder ones for higher boxes. Getting at least 2 of 3 right moves
  the concept up a box; otherwise it goes back to box 1. Key terms are reviewed as
  flashcards alongside.
- **Responsive**: a fluid type scale with readable line lengths, and different layouts for
  reading passages (wide line spacing, numbered paragraphs) and math solutions (step cards,
  equations aligned).
- **Accessibility**: semantic HTML, keyboard support everywhere, visible focus, MathML for
  screen readers, `prefers-reduced-motion` respected, dark mode, and the Atkinson
  Hyperlegible font (designed for readability).
- **SEO**: one URL per concept, e.g. `/grade-5/math/improper-fractions/`, with a
  descriptive title and meta description, canonical URLs, a sitemap, `robots.txt`, Open
  Graph tags, and JSON-LD (`LearningResource` with `educationalAlignment` to the Alberta
  outcome, plus `BreadcrumbList`). Content that has not been written yet is listed as
  "coming soon", never published as thin pages.
- **Hosting**: GitHub Pages at `https://alberta-edu.github.io/ab_edu/`, deployed by a
  GitHub Actions workflow. The base path is configured in one place.

## 4. Grade 5 concept map (about 48 concepts)

★ = built in the first vertical slice.

**Math** (13 outcomes → 15 concepts): place value & decimals · adding & subtracting
(standard algorithms) · divisibility & factors · multiplying & dividing (standard algorithms)
· ★ improper fractions & mixed numbers · adding & subtracting fractions · ratios &
percentages · order of operations · algebraic expressions · solving equations · symmetry ·
coordinate grids · area & perimeter · arithmetic sequences · frequency & mode

**Science** (8 outcomes → 15 concepts): ★ particle model & states of matter · mass,
volume, density & compressibility · forces of flight · buoyancy · energy resources ·
weather vs climate & weather tools · climate, living things & agriculture · human body
systems · plant transport · seasons & Earth's tilt · Moon phases, eclipses & auroras ·
algorithms, loops & block code · the design process · controlled experiments · evidence,
bias & ethics

**Social Studies** (5 outcomes → 6 concepts): rise & fall of civilizations · historians,
sources & evidence · ★ latitude, longitude & where civilizations grew · trade routes &
early economies · governments & social systems · informed citizenship

**ELAL** (6 outcomes → 12 concepts): text forms & genres · poetry & drama · oral
communication · word origins & affixes · figurative language · ★ inference & text evidence ·
perspective & context · the writing process · author's craft (show, don't tell) ·
research skills · grammar · spelling & punctuation

## 5. Phases

| # | Phase | Output |
|---|---|---|
| 0 | Research | Curriculum extract, this plan |
| 1 | Foundation | Astro scaffold, design system, content schema + renderer, problem engine, progress store, spaced review, SEO plumbing, verify/coverage scripts, unit tests, deploy workflow (not pushed) |
| 2 | Vertical slice | One complete concept per subject (★ above), each with a signature visualization: fraction explorer, particle simulator, latitude/longitude world map, evidence-finding reader. **→ Review checkpoint with owner** |
| 3 | Math | Remaining 14 concepts |
| 4 | Science | Remaining 14 concepts, each with an animated virtual experiment (density column, sink/float lab, air vs. water compression, forces-of-flight arrows, seasons orbit, Moon phases, controlled-variable "fair test" lab, block-code loop puzzle) |
| 5 | Social Studies | Remaining 5 concepts (trade route map, social pyramid, timeline) |
| 6 | ELAL | Remaining 11 concepts (original passages and poems) |
| 7 | Polish | Review/progress UX, Lighthouse and accessibility audit, SEO audit, testing on phone, tablet and desktop |
| 8 | Release | Only after owner sign-off: commit as `alberta-edu`, push, enable Pages |

## 6. Decisions for the owner

- Site name: currently "AB Edu" (set in `src/site.ts`). It must not look like an official
  Government of Alberta site; every page footer says it is independent.
- The curriculum text is © Government of Alberta. We quote outcome statements with
  attribution and a link, for alignment only.
- Git identity: the repo-local config commits as `alberta-edu <alberta-edu@users.noreply.github.com>`.
