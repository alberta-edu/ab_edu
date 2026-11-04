# AB Edu: Plan

A free, static learning site that follows Alberta's K–6 curriculum. Grade 5 is the first
edition. It covers the four subjects tested on the Provincial Achievement Tests: English
Language Arts and Literature, Mathematics, Science and Social Studies.

Nothing ships until the owner has reviewed and tested everything locally. All work happens
on feature branches. The owner verifies each one before it is merged into `main`, which is
the branch that deploys.

## Where we are now

*Last updated: November 4, 2026. Update this section whenever a phase or batch finishes.*

**Current phase: 7 (Polish, with the question rewrite and educator notes) is finished and merged into
`main`. Fixes from the owner's local review (`fix/readability-and-practice-flow`) are merged and
pushed. The owner reviews them on `main`.**

| Subject | Concepts built | Grade 5 curriculum statements taught |
|---|---|---|
| Math | **15 of 15** ✅ | **165 of 165** ✅ |
| Science | **15 of 15** ✅ | **204 of 204** ✅ |
| Social Studies | **6 of 6** ✅ | **62 of 62** ✅ |
| ELAL | **12 of 12** ✅ | **243 of 243** ✅ |
| **Total** | **48 of 48** ✅ | **674 of 674** ✅ (see [curriculum-audit.md](curriculum-audit.md)) |

**Branches:**

| Branch | What it contains | Status |
|---|---|---|
| `feature/grade5-foundation` | Phases 0–2: the site, the 4 sample lessons, tabs and steps, 3D globe, curriculum checks | ✅ Merged into `main` |
| `chore/claude-md` | CLAUDE.md with the repo rules | ✅ Merged into `main` |
| `chore/plan-status` | This progress tracking | ✅ Merged into `main` |
| `feature/grade5-math` | Phase 3: all 15 Math lessons (233 problems) | ✅ Merged into `main` |
| `feature/grade5-science` | Phase 4: the other 14 Science lessons (195 problems across all 15), 11 virtual experiments | ✅ Merged into `main` |
| `feature/grade5-social-studies` | Phase 5: the other 5 Social Studies lessons, 11 new visuals and 1 virtual experiment | ✅ Merged into `main` |
| `feature/grade5-elal` | Phase 6: the other 11 ELAL lessons (157 problems across all 12), 18 new visuals and 1 virtual experiment | ✅ Merged into `main` |

| `feature/thinking-problems` | Phase 7: all 48 problem sets rewritten to [QUESTION-STANDARD.md](QUESTION-STANDARD.md) (553 problems, was 623), `build` and `investigation` types, a thinking move on every problem, [grade-level audit](grade-level-audit.md) | ✅ Merged into `main` |
| `feature/educator-notes` | Phase 7: educators hub, 4 subject guides, notes for all 48 topics. Stacked on `feature/thinking-problems` | ✅ Merged into `main` |
| `chore/phase-7-polish` | Phase 7: accessibility, keyboard, phone layout and review fixes, audits, these docs. Stacked on `feature/educator-notes` | ✅ Merged into `main` |
| `fix/readability-and-practice-flow` | Owner review fixes: Lexend font (plain 0), About page (no repo links, Claude credit), practice Next waits for a correct answer and leads to the next level, clearer Thinking skill box, Key terms tab removed, educators page as short lists, every long paragraph in lessons and notes turned into lists, and a readability check in `npm run verify` | ✅ Merged into `main` and pushed. The owner reviews it after merge |
| `fix/about-page` | About page: shorter bullets, Credits as a list, no internal testing notes, no repeat of the footer's not-affiliated line | ✅ Merged into `main` and pushed |

Nothing is waiting for review as a branch. The owner will do the final manual review at the very end, after all phases.

**Phase 7 results, on `chore/phase-7-polish`:**

- 553 problems: 169 Warm-up, 218 Build, 166 Deep Think. The rewrite cut plain multiple choice from 417 to 246 and added 88 investigations and 14 build problems.
- A second model solved every problem without the answer key: no wrong answers and nothing above Grade 5. Every near miss is listed in the [grade-level audit](grade-level-audit.md).
- A browser script solved all 553 problems at phone width and saved progress for each.
- axe finds nothing on all 108 pages in light and dark. Lighthouse was run on 8 sample pages: performance 94–100, accessibility 100, best practices 100, SEO 100 except Review, which is `noindex` on purpose.
- No page scrolls sideways at 320, 390, 768 or 1024 px. All 9 single-answer types were solved with the keyboard alone. Investigations use the same controls.

**What this can't promise:** all checks were done by AI models and scripts. No child, teacher or screen reader
user has tried the problems or the notes yet. Only Claude models were available, so Opus 5.5 wrote everything
and Sonnet 5.5 solved the problems blind.

**Not published yet:** the repo stays private and the site is not published on GitHub Pages
until all tasks are finished and people have reviewed it. Until then, the deploy job fails on
each push to `main` because Pages is off. That is expected: the build still runs, and nothing
goes public.

**Next up:** fixes from the owner's local review, each on its own branch. Then Phase 8, Release, once the owner signs off.

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
- **Only listed knowledge.** Every lesson block, problem and key term references the exact
  curriculum statement it teaches (`covers: [K1.2, S1.3]`). The verifier rejects:
  - missing or invalid references;
  - references to later grades;
  - blocks that teach nothing from the grade's outcome.

  Earlier-grade ideas appear only as short, labelled "Remember from Grade N" recalls.
  Grades K–6 are all extracted, so these rules can be checked automatically.
- Each concept page has a box that lists exactly which statements it teaches.
  `npm run audit` writes [curriculum-audit.md](curriculum-audit.md), which maps all 674
  Grade 5 statements to the steps and problems that teach them.

## 2. Content model: how a concept is taught

Each **concept** is one page, and each page maps to one learning outcome (or to one
knowledge/understanding/skills group when an outcome is large). Every page follows the same
order:

1. **Big idea**: the key knowledge in one or two kid-friendly sentences.
2. **Lesson: visual first, in steps.** A lesson is 4–6 titled steps, shown one at a time.
   A student should *see* the idea before reading about it. Interactive visuals,
   animations and virtual experiments carry the explanation. Text is short and labels
   what the student sees. Formatted blocks replace paragraphs:
   - side-by-side `compare` cards
   - tables
   - figures
   - worked-example step cards
   - tip, mistake and remember callouts

   A virtual experiment works like this: predict with one tap → Run → watch the animation
   → read what happened and why.
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
| `build` | many right answers: the child designs something and rules check it with exact arithmetic |
| `investigation` | a story with 2–4 linked parts, shown one at a time, ending in a wrap-up. Left out of review rounds |

Every problem also names its thinking move, shown right after it is solved. See
[QUESTION-STANDARD.md](QUESTION-STANDARD.md) for what makes a problem deep and what is above the grade.

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
  statements. Places, dates, coordinates and data are checked against primary sources, and
  each data file names its source (for example, climate graphs use Environment and Climate
  Change Canada's 1991–2020 normals).

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
- **Page structure (UX)**: each concept has three tabs, each with its own link:
  - **Learn**: a stepper that shows one step at a time, with Back/Next and a resume point;
  - **Practice**: level tabs, one problem at a time, numbered progress dots, and a
    "Next problem" button that lights up after a correct answer;
  - **Key terms**: flip cards.

  This keeps a long topic from becoming one endless scroll. Without JavaScript, all the
  content is still in the HTML in reading order, so it remains crawlable.
- **Best representation**: for example a 3D globe (d3-geo orthographic projection, drag
  to spin, animated latitude and longitude lines, fly-to places) and fraction pieces that
  animate into wholes. Heavy visuals load only when scrolled into view.
- **Responsive**: a fluid type scale with readable line lengths, and different layouts for
  reading passages (wide line spacing, numbered paragraphs) and math solutions (step cards,
  equations aligned).
- **Accessibility**: semantic HTML, keyboard support everywhere, visible focus, MathML for
  screen readers, `prefers-reduced-motion` respected, dark mode, and the Lexend
  font (designed for reading fluency, with a plain, unslashed 0).
- **SEO**: one URL per concept, e.g. `/grade-5/math/improper-fractions/`, with a
  descriptive title and meta description, canonical URLs, a sitemap, `robots.txt`, Open
  Graph tags, and JSON-LD (`LearningResource` with `educationalAlignment` to the Alberta
  outcome, plus `BreadcrumbList`). Content that has not been written yet is listed as
  "coming soon", never published as thin pages.
- **Hosting** (not published until Phase 8): GitHub Pages at `https://alberta-edu.github.io/ab_edu/`, deployed by a
  GitHub Actions workflow. The base path is configured in one place.

## 4. Grade 5 concept map (about 48 concepts)

✅ = built. ★ = one of the four sample lessons from Phase 2.

**Math** (13 outcomes → 15 concepts), all built ✅: place value & decimals · adding &
subtracting (standard algorithms) · divisibility & factors · multiplying & dividing (standard
algorithms) · ★ improper fractions & mixed numbers · adding & subtracting fractions · ratios
& percentages · order of operations · algebraic expressions · solving equations · symmetry ·
coordinate grids · area & perimeter · arithmetic sequences · frequency & mode

**Science** (8 outcomes → 15 concepts), all built ✅: ★ particle model & states of matter · mass,
volume, density & compressibility · forces of flight · buoyancy · energy resources · weather vs
climate & weather tools · climate, living things & agriculture · human body systems · plant
transport · seasons & Earth's tilt · Moon phases, eclipses & auroras · algorithms, loops & block
code · the design process · controlled experiments · evidence, bias & ethics

**Social Studies** (5 outcomes → 6 concepts), all built ✅: rise & fall of civilizations ·
historians, sources & evidence · ★ latitude, longitude & where civilizations grew · trade routes &
early economies · governments & social systems · informed citizenship

**ELAL** (6 outcomes → 12 concepts), all built ✅: text forms & genres · poetry & drama · oral
communication · word origins & affixes · figurative language · ★ inference & text evidence ·
perspective & context · the writing process · author's craft (show, don't tell) ·
research skills · grammar · spelling & punctuation

## 5. Phases

| # | Phase | Output | Status |
|---|---|---|---|
| 0 | Research | Curriculum extract (K–6), this plan | ✅ Done |
| 1 | Foundation | Astro scaffold, design system, content schema + renderer, problem engine, progress store, spaced review, SEO plumbing, verify/coverage/audit scripts, unit tests, deploy workflow (not pushed) | ✅ Done, merged into `main` |
| 2 | Vertical slice | One complete concept per subject (★ above), each with a signature visualization: fraction explorer, particle simulator, 3D globe and world map, evidence-finding reader. Reworked after your feedback: curriculum-only content, tabs and steps | ✅ Done, merged into `main` |
| 3 | Math | Remaining 14 concepts | ✅ Done, merged into `main` |
| 4 | Science | Remaining 14 concepts, each with an animated virtual experiment (density column, sink/float lab, air vs. water compression, forces-of-flight arrows, seasons orbit, Moon phases, controlled-variable "fair test" lab, block-code loop puzzle) | ✅ Done, merged into `main` |
| 5 | Social Studies | Remaining 5 concepts (trade route map, social pyramid, timeline, empire maps, village-to-city, scroll-scan experiment) | ✅ Done, merged into `main` |
| 6 | ELAL | Remaining 11 concepts (original passages and poems), each with a visual you can play with (word builder, voice lab, poem reader, script stage, show-don't-tell dial, grammar lab, echo-room experiment) | ✅ Done, merged into `main` |
| 7 | Polish | Question rewrite and grade-level audit, notes for educators, review/progress UX, Lighthouse and accessibility audit, SEO audit, testing on phone, tablet and desktop | ✅ Done, merged into `main` (not pushed) |
| 8 | Release | Only after all other phases are finished and people have reviewed the whole site: enable GitHub Pages and publish | Not started, needs review and your sign-off |

## 6. Decisions for the owner

- Site name: currently "AB Edu" (set in `src/site.ts`). It must not look like an official
  Government of Alberta site; every page footer says it is independent.
- The curriculum text is © Government of Alberta. We quote outcome statements with
  attribution and a link, for alignment only.
- Git identity: the repo-local config commits as `alberta-edu <alberta-edu@users.noreply.github.com>`.
