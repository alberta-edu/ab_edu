# CLAUDE.md

Rules for working in this repo. AB Edu is a free, static learning site that follows
Alberta's K–6 curriculum (Grade 5 first). See [README.md](README.md) for the layout and
commands, and [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md) before writing any content.

## Git workflow

- **Never commit directly to `main`.** Every push to `main` deploys to GitHub Pages
  (`.github/workflows/deploy.yml`), so `main` must only ever hold reviewed work.
- Do all work on a feature branch: `feature/<topic>` for content and features,
  `fix/<topic>` for bug fixes, `chore/<topic>` for tooling and docs.
- Keep one topic per branch. When work depends on an unmerged branch, branch from it
  (stack) and say so.
- Commit freely on the feature branch, in small commits with clear messages.
- **The owner reviews and verifies each branch before it is merged into `main`.** Don't
  merge, push or open a PR without the owner's explicit go-ahead.
- Commit as the repo-local identity `alberta-edu`. Don't change git config.

## Before handing off a branch

1. `npm run check` passes (content verification, unit tests and production build).
2. `npm run audit` is re-run if content changed, so `docs/curriculum-audit.md` is current.
3. New or changed pages have been looked at in `npm run preview`, on both phone and
   desktop widths.
4. Tell the owner the branch name, what changed and what to check.

## Content rules

- **Curriculum only.** Teach only what the Alberta program of studies lists for that grade
  and outcome. Every lesson block, problem and key term has `covers:` references to the
  exact statements in `curriculum/grade-*/`, and `npm run verify` enforces them. If a
  sentence doesn't trace to a statement, it doesn't belong. Where the curriculum lists
  examples, use those examples.
- **Quality over quantity.** Fewer, excellent problems beat many average ones. No padding.
- **Visual first.** Lessons open with something to look at or play with. Science
  experiments are on-screen animations (predict → Run → watch → why), not instructions to
  do at home. Text stays short and matches what the visual shows.
- **UX matters.** Pick the best representation (a 3D globe over a flat map, an animation
  over a static diagram). Break long content into steps and tabs. Use formatted blocks, not
  walls of text.

## Code

- Astro static output with vanilla TypeScript custom elements. No backend, accounts or
  tracking. Progress is stored in the browser only.
- Keep visuals lightweight and client-side. Lazy-load anything heavy.
- Match the style of the surrounding code. Add tests in `tests/` for new logic.
- Curriculum text is © Government of Alberta. Quote it only for alignment, with
  attribution, and don't edit the extracted files in `curriculum/` by hand.
