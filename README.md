# AB Edu

Free, static learning site that follows Alberta's K–6 curriculum. The first edition is
Grade 5, covering the four subjects on the Provincial Achievement Tests: English Language
Arts and Literature, Math, Science and Social Studies.

- A lesson for every learning outcome. Each one opens with an interactive visual or an
  animated virtual experiment.
- Three levels of practice: ★ Warm-up, ★★ Build and ★★★ Deep Think. Every problem has
  hints, a worked solution, and feedback for each wrong answer.
- Problems are written to make children think: stories, designs and investigations, with friendly
  numbers. See [docs/QUESTION-STANDARD.md](docs/QUESTION-STANDARD.md).
- Notes for teachers and parents on every subject and topic, at `/educators/`.
- Spaced review on the Leitner system, with progress saved in the browser and
  export/import of a backup file.
- No backend, no accounts, no tracking. Hosted on GitHub Pages.

## Run it locally

Requires Node 22 or newer.

```sh
npm install
npm run dev        # http://localhost:4321/ab_edu/
```

Full check (content verification, unit tests, production build), then serve the built
site:

```sh
npm run check
npm run preview    # http://localhost:4321/ab_edu/
```

| Command | What it does |
|---|---|
| `npm run verify` | Validates every content file: schema, answer indexes, machine-checked math (`verify:` expressions), LaTeX, passage references |
| `npm run coverage` | Lists every Grade 5 learning outcome and whether it has content |
| `npm run audit` | Writes `docs/curriculum-audit.md`: every Grade 5 curriculum statement and where it is taught |
| `npm run statements -- <subject> <outcome>` | Lists an outcome's statements with the reference codes used in `covers:` |
| `npm test` | Unit tests (answer checking, fraction math, review schedule, rendering) |
| `npm run build` | Runs `verify`, then builds the static site into `dist/` |

## Where things live

```
curriculum/grade-*/     Official K-6 outcomes, extracted from New LearnAlberta (scripts/extract-curriculum.ts)
content/grade-5/        One YAML file per concept, plus roadmap.yaml (every planned concept)
content/educators/      Notes for teachers and parents: one file per concept, plus _subject.yaml per subject
src/lib/                Build-time logic: schema, Markdown + KaTeX rendering, problem HTML, review schedule
src/client/             Browser code: problem cards, practice levels, progress store, review session
src/components/         Lesson blocks, visuals (fraction explorer, particle model, world map) and experiments
src/pages/              Routes
docs/PLAN.md            Plan and phases
docs/CONTENT-GUIDE.md   How to write a concept
docs/QUESTION-STANDARD.md  What makes a good problem, and what is above the grade
docs/grade-level-audit.md  How problems were checked against the grade, and what was found
```

## Workflow

All work happens on feature branches, never directly on `main`. Each branch is reviewed
and verified by the owner before it is merged into `main`, which is the branch that
deploys. See [CLAUDE.md](CLAUDE.md) for the full rules.

## Deploying

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to
`main`. Before the first push, set the repo's **Settings → Pages → Source** to
**GitHub Actions**. The site URL and base path are set in `src/site.ts`.

## Curriculum and licence notes

Curriculum outcome text is © Government of Alberta. It is quoted for alignment only, with
attribution. This project is independent and not affiliated with Alberta Education.
