# CLAUDE.md

Rules for this repo. See [README.md](README.md) for commands and layout, and
[docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md) before writing content.

## Git

- **Never commit to `main`.** Every push to `main` deploys to GitHub Pages.
- Branch per topic: `feature/<topic>`, `fix/<topic>` or `chore/<topic>`. If work depends on an
  unmerged branch, stack on it and say so.
- Commit often, in small commits, as the repo-local identity `alberta-edu`. Don't change git config.
- **The owner reviews every branch.** Don't merge, push or open a PR without their go-ahead.

## Before handing off a branch

1. `npm run check` passes.
2. If content changed, re-run `npm run audit` (or `npm run audit -- grade-N/<subject>`).
3. Update **Where we are now** and the phase **Status** in [docs/PLAN.md](docs/PLAN.md).
4. Look at new or changed pages in `npm run preview`, at phone and desktop widths.
5. Tell the owner the branch, what changed and what to check.

## Content

- **Curriculum only.** Teach only what Alberta's program of studies lists for the grade and outcome.
  - Grades 1 to 6. Kindergarten is not supported.
  - Every block, problem and key term has `covers:` references, enforced by `npm run verify`.
  - A sentence that doesn't trace to a statement doesn't belong.
  - Where the curriculum lists examples, use them.
- **Quality over quantity.** Fewer, excellent problems. No padding.
- **Visual first.** Lessons open with something to look at or play with. Experiments are on-screen
  animations (predict → Run → watch → why), not things to do at home.
- **Best representation.** A 3D globe over a flat map, an animation over a static diagram. Use steps,
  tabs and formatted blocks, never walls of text.
- **Short and scannable everywhere**, in lessons, notes and site pages.
  - Steps are numbered lists, several ideas are bullets. A Big idea is 3–4 bullets.
  - `npm run verify` fails on a 3+ sentence paragraph of 25+ words, or any paragraph or list item
    over 40 words (`src/lib/readability.ts`). Passages and `>` quotes are exempt.
- **Keep it simple.** No tab, label or panel that repeats the page. Use words a child in that grade uses.
- **Grades 1–2 read little.** Less text, more animation, 6 problems a topic. Limits are in
  `gradeProfile` (`src/site.ts`) and the [content guide](docs/CONTENT-GUIDE.md#rule-0-write-for-the-grade).

## Code

- Astro static output with vanilla TypeScript custom elements. No backend, accounts or tracking.
  Progress stays in the browser.
- Keep visuals light and client-side. Lazy-load anything heavy.
- Use Lexend (plain 0) for anything a student reads, never a monospace font. Typeset aligned sums with
  KaTeX `\begin{array}{rr}`, not code blocks.
- Practice: Next stays disabled until the problem is solved. On a level's last problem, it leads to
  the next level once unlocked.
- Don't link to the source code or GitHub issues from the site.
- Match the surrounding style. Add tests in `tests/` for new logic.
- Curriculum text is © Government of Alberta. Quote it only for alignment, with attribution. Don't
  hand-edit `curriculum/`.
