# Alberta Edu

A free, static learning site that follows Alberta's K–6 curriculum. Grade 5 comes first, with the
four Provincial Achievement Test subjects: ELAL, Math, Science and Social Studies.

- A lesson for every learning outcome, each opening with an interactive visual or virtual experiment.
- Practice in three levels (★ Warm-up, ★★ Build, ★★★ Deep Think), with hints, worked solutions and
  feedback on every wrong answer.
- Notes for teachers and parents at `/educators/`.
- Spaced review, with progress saved in the browser. No backend, accounts or tracking.

## Run it

Needs Node 22 or newer.

```sh
npm install
npm run dev        # http://localhost:4321/ab_edu/
npm run check      # verify content, run tests, build
npm run preview    # serve the build
```

| Command | What it does |
|---|---|
| `npm run verify` | Checks every content file: schema, answers, math, LaTeX, curriculum references, readability |
| `npm run statements -- <subject> <outcome>` | Lists an outcome's statements and their `covers:` codes |
| `npm run coverage` | Lists each Grade 5 outcome and whether it has content |
| `npm run audit` | Writes `docs/curriculum-audit.md` |
| `npm test` | Unit tests |
| `npm run build` | Runs `verify`, then builds into `dist/` |

## Layout

```
curriculum/grade-*/   Official K–6 outcomes, extracted from New LearnAlberta
content/grade-5/      One YAML file per concept, plus roadmap.yaml
content/educators/    Notes for teachers and parents
src/lib/              Build-time logic: schema, rendering, checks, review schedule
src/client/           Browser code: problems, practice, progress, review
src/components/       Lesson blocks, visuals and experiments
src/pages/            Routes
docs/                 Plan, content guide, question standard, audits
```

## Deploying

Every push to `main` builds and publishes to GitHub Pages (`.github/workflows/deploy.yml`). The
site URL and base path are in `src/site.ts`.

One-time setup, or the deploy fails with `404 Not Found`:

1. Keep the repo public. On GitHub's free plan, Pages doesn't serve private repos.
2. Set **Settings → Pages → Source** to **GitHub Actions**.
3. Re-run the latest deploy, or push to `main`.

The site is then at https://alberta-edu.github.io/ab_edu/.

Work happens on feature branches, reviewed by the owner before merging. See [CLAUDE.md](CLAUDE.md).

## Licence notes

Curriculum text is © Government of Alberta, quoted with attribution for alignment only. This project
is independent and not affiliated with Alberta Education.
