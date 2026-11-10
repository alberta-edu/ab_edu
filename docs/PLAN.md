# Alberta Edu: Plan

A free, static learning site that follows Alberta's Grade 1–6 curriculum in ELAL, Math, Science and
Social Studies. Grade 5 came first; Grades 6, 4, 3, 2 and 1 follow. Kindergarten is not supported.

## Where we are now

*Last updated: November 7, 2026. Update this section whenever a phase or batch finishes.*

**Grade 5 is live at https://alberta-edu.github.io/ab_edu/. Now adding Grades 6 to 1 (Phases 9–14).**

**Waiting for review:** `feature/multi-grade` (Phase 9). Every page, check and script works for any
grade from 1 to 6, and Kindergarten is removed. No Grade 5 content changed; the site still builds the
same 112 pages.

| Grade | Outcomes | Statements | Status |
|---|---|---|---|
| 5 | 32 | 674 | ✅ Live |
| 6 | 33 | 763 | Next (Phase 10) |
| 4 | 32 | 651 | Phase 11 |
| 3 | 30 | 749 | Phase 12 |
| 2 | 28 | 596 | Phase 13 |
| 1 | 28 | 565 | Phase 14 |

Grade 5 detail:

| Subject | Concepts | Grade 5 statements taught |
|---|---|---|
| Math | 15 of 15 ✅ | 165 of 165 ✅ |
| Science | 15 of 15 ✅ | 204 of 204 ✅ |
| Social Studies | 6 of 6 ✅ | 62 of 62 ✅ |
| ELAL | 12 of 12 ✅ | 243 of 243 ✅ |
| **Total** | **48 of 48** ✅ | **674 of 674** ✅ ([curriculum-audit/](curriculum-audit/)) |

**Latest merges** (November 4, 2026):

| Branch | What changed |
|---|---|
| `fix/pages-deploy` | Deploy workflow on current action versions (Node 24); Pages setup steps in the README |
| `fix/lighter-practice` | 9 problems per topic (3, 4, 2), investigations at most 3 parts, Deep Think at most 5 steps, written answers only in 4 ELAL writing topics, limits checked by `npm run verify` |
| `feature/body-systems-depth` | Tap a body part to see its job; animations of the heart pumping and a muscle bending the arm. No new parts or problems |
| `chore/trim-docs` | All docs trimmed to short lists; stale facts fixed |
| `feature/lesson-depth` | Depth audit of all 48 lessons. Plant transport: tap the roots, stem, leaves and leaf veins, and look inside the stem. Multiply and divide: shared base-ten blocks show why the division algorithm works. No new problems |

Nothing is waiting for review. Older merges are in the git history.

**Checks so far:**

- 431 problems, 9 per topic.
- The blind solve, browser and keyboard checks below ran on the earlier 553-problem set. The cut to
  9 kept a subset of them and rewrote 2 written answers as multiple choice.
  - A second model solved every problem without the answer key: no wrong keys, nothing above the
    grade ([grade-level audit](grade-level-audit.md)).
  - A browser script solved every problem at phone width. All answer types work by keyboard.
- axe finds nothing on all 108 pages, light and dark. Lighthouse on 8 pages: performance 94–100,
  accessibility, best practices and SEO 100 (Review is `noindex` on purpose).
- No page scrolls sideways at 320, 390, 768 or 1024 px.

**What this can't promise:** AI models and scripts did every check. No child, teacher or screen reader
user has tried the site yet.

**Publishing:** the repo is public and Pages builds from GitHub Actions. Merge only reviewed work,
because every push to `main` goes live.

## 1. The curriculum

- **Source:** New LearnAlberta's published data, extracted by `scripts/extract-curriculum.ts` into
  [`curriculum/`](../curriculum/) for Grades 1–6. Kindergarten was removed on November 7, 2026.
- **In force for Grade 5 in 2026–27:**
  - Math and ELAL (Sept 2023), Science (Sept 2024).
  - Social Studies (Sept 2026): Grade 5 is now *ancient civilizations*.
- **Only listed knowledge.** Every block, problem and key term has `covers:` references. `npm run
  verify` rejects:
  - missing or invalid references;
  - later-grade references;
  - blocks that teach nothing from their outcome.
- **Earlier grades** appear only as short "Remember from Grade N" recalls.
- **Traceable.** Each page lists the statements it teaches. `npm run audit` maps all 674 statements
  to the steps and problems that teach them.

## 2. How a concept is taught

One page per learning outcome (or per statement group, for large outcomes):

1. **Big idea:** 3–4 short bullets.
2. **Lesson:** 4–6 steps, one at a time, each led by a visual, animation or virtual experiment
   (predict → Run → watch → why). Text only labels what the child sees.
3. **Practice:** ★ Warm-up, ★★ Build, ★★★ Deep Think.
   - Solving 2 problems unlocks the next level. "Peek ahead" is always there.
   - Every problem has hints, a worked solution and feedback on wrong answers.
   - Every problem names a thinking move, shown once it is solved.
4. **Review:** key terms come back as flashcards in spaced review.

Problems follow [QUESTION-STANDARD.md](QUESTION-STANDARD.md). The file format is in
[CONTENT-GUIDE.md](CONTENT-GUIDE.md).

### How content is kept correct

- Claude (Opus 5.5) writes all content ahead of time, as YAML in [`content/`](../content/).
  Nothing calls an AI at runtime: no keys, no cost, no data leaves the device.
- `npm run verify` checks math answers with exact fractions (`verify:`), plus schema, IDs, choice
  indexes and passage references.
- KaTeX renders at build time with `throwOnError`, so a LaTeX typo fails the build.
- Science and Social Studies facts stay inside the curriculum's statements. Places, dates and data are
  checked against primary sources, and each data file names its source.

## 3. Architecture

- **Astro, static output.** Pre-rendered HTML, fast on old devices. Interactivity is small vanilla
  TypeScript custom elements, loaded only where used. Heavy visuals load when scrolled into view.
- **Math:** KaTeX renders HTML and MathML at build time. No math JavaScript in the browser.
- **Maps:** projected at build time from Natural Earth data (d3-geo) into inline SVG. The 3D globe
  uses an orthographic projection.
- **Progress:** one versioned `localStorage` key, with Export/Import as a JSON file. Clearing the
  browser erases it, and the Progress page says so.
- **Spaced review (Leitner):**
  - A topic joins review after 3 solved problems.
  - Boxes come due after 1, 3, 7, 14, 30 and 60 days.
  - A round is 3 problems, harder in higher boxes. 2 of 3 right moves up a box; otherwise back to box 1.
- **Accessibility:** semantic HTML, full keyboard support, visible focus, MathML, reduced motion,
  dark mode and the Lexend font.
- **SEO:** one URL per concept, titles and descriptions, canonical URLs, sitemap, `robots.txt`, Open
  Graph, and JSON-LD (`LearningResource` aligned to the outcome, `BreadcrumbList`).
- **Hosting:** GitHub Pages via GitHub Actions. The base path is set in `src/site.ts`.

## 4. Phases

| # | Phase | Output | Status |
|---|---|---|---|
| 0 | Research | Curriculum extract (K–6), this plan | ✅ Done |
| 1 | Foundation | Site, content schema, problem engine, progress, review, SEO, checks, tests, deploy workflow | ✅ Merged |
| 2 | Vertical slice | One concept per subject, each with a signature visual | ✅ Merged |
| 3 | Math | 15 concepts | ✅ Merged |
| 4 | Science | 15 concepts, each with a virtual experiment | ✅ Merged |
| 5 | Social Studies | 6 concepts | ✅ Merged |
| 6 | ELAL | 12 concepts, with original passages and poems | ✅ Merged |
| 7 | Polish | Question rewrite, grade-level audit, educator notes, accessibility, SEO and device testing | ✅ Merged |
| 8 | Release | Make the repo public, turn on Pages, publish | ✅ Live since November 4, 2026 |
| 9 | Multi-grade | Routes, checks, review and progress for Grades 1–6; Kindergarten removed; Grades 1–2 profile | 🔍 `feature/multi-grade`, waiting for review |
| 10 | Grade 6 | 4 subjects, one branch each, stacked on Phase 9 | Planned |
| 11 | Grade 4 | 4 subjects | Planned |
| 12 | Grade 3 | 4 subjects | Planned |
| 13 | Grade 2 | 4 subjects, Grades 1–2 profile: less text, more animation, 6 problems | Planned |
| 14 | Grade 1 | 4 subjects, Grades 1–2 profile | Planned |

### How Grades 6 to 1 are built

- One branch per grade and subject (`feature/g6-math` and so on), stacked on `feature/multi-grade`.
  Each has its own `_roadmap.yaml`, notes folder and audit file, so the branches don't conflict.
- Writing agents run about 4 at a time, then a second model blind-solves each subject for wrong keys
  and above-grade content, as in Phase 7.
- Grade 5's standards hold: `covers:` on everything, visual first, notes for educators.
- **Grades 1–2** (`gradeProfile` in `src/site.ts`): 6 problems a topic (2, 2, 2), unlock after 1,
  paragraphs up to 20 words, prompts under 30 words, a visual in every lesson step. A read-aloud button
  is not planned for now.

## 5. Decisions

- **Name:** "Alberta Edu" (`src/site.ts`). It must not look like a Government of Alberta site. Every footer
  says it is independent.
- **Curriculum text** is © Government of Alberta, quoted with attribution and a link for alignment only.
- **Git identity:** `alberta-edu <alberta-edu@users.noreply.github.com>`.
- **Hosting:** public repo on GitHub Pages, chosen by the owner on November 4, 2026.
