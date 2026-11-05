# The question standard

How every practice problem is written. The file format is in [CONTENT-GUIDE.md](CONTENT-GUIDE.md).

## Why

- A calculator, or an AI, computes faster than any child. The thinking around it is what lasts.
- So problems build that thinking: what is really being asked, breaking it down, spotting flaws,
  weighing evidence, inventing.
- Curriculum facts are what we think *with*, not the goal.

**A problem earns its place by making a child think something new.** If two make the same thought,
keep the better one.

## Hard limit 1: nothing above the grade

A Grade 5 child must be able to solve it with only what Alberta teaches up to Grade 5. Check the
knowledge needed to solve it, not only the `covers:` tag.

Off limits in Math, even in Deep Think:

| Off limits (Grade 6+) | Grade 5 instead |
|---|---|
| A percent of a number ("25% of 80") | One part-whole as ratio, fraction, decimal and percent, with a friendly whole (15 of 25 → 60%) |
| Equivalent ratios, proportions, unit rates, speed | Part-part and part-whole ratios of one situation |
| Fractions with **different** denominators | Common denominators, including improper fractions and mixed numbers |
| Multiplying or dividing fractions; a fraction of a number | Adding and subtracting fractions |
| Multiplying or dividing **decimals** | Adding and subtracting decimals to thousandths |
| Beyond 3-digit × 2-digit or 3-digit ÷ 1-digit | Those exact sizes |
| Negative numbers, integers | Natural numbers and decimals |
| Powers, exponents, prime factorization | Divisibility tests (2, 3, 5), factors |
| Combining like terms; 3+ operation equations | One- or two-term expressions; one- or two-operation equations |
| Powers or nested brackets in order of operations | Parentheses holding addition or subtraction |
| Triangle, composite or circle area; volume | Perimeter and area of rectangles (two side by side is fine) |
| Translations; four quadrants | First-quadrant grid, vertices, positional language |
| Mean, median, range, probability | Frequency, mode, categorical data |

Other subjects:
- Every fact a problem needs traces to a Grade 5-or-below statement. Read the outcome with
  `npm run statements -- <subject> <outcome-code>`, and `curriculum/grade-6/` for what is off limits.
- Example: "heating makes particles move faster" is Grade 6, so not even as a hint.
- Explain or avoid any word a child doesn't know.

Rules for every subject:
- **The math limits apply everywhere.** A trade problem needing a rate is above the grade. Grouping
  and repeated addition are fine.
- **Reasoning beyond the lesson is fine; needing an untaught fact is not.** If a fact is needed and
  wasn't taught, the problem states it.
- **Math truths need their conditions.** If the answer assumes whole-number sides, the problem says so.
- **Write the Grade 5 solution.** `npm run verify` catches only some math above the grade. If you
  can't solve it as a Grade 5 child would, the problem goes.

## Hard limit 2: everything is checked

- Every computed answer has a `verify:` expression.
- Every `build` problem has passing `examples` and failing `counterexamples`.
- Real-world facts are true and checked against a primary source. Invented numbers need a clearly
  invented setting.
- Everything is original. Never copy from a contest, textbook or website.
- A problem never contradicts the lesson. If wording needs a closer look, the solution resolves it.

## The ladder

At most **9 problems per concept**: 3 Warm-up, 4 Build, 2 Deep Think. `npm run verify` checks:
- each level's maximum;
- at most 3 parts in an investigation;
- at most 5 Deep Think steps, counting each investigation part. Usually one investigation plus one problem;
- Deep Think with only multiple choice, one move or bare calculations;
- near-duplicates.

### ★ Warm-up: "I know what this is"

- One idea, one step, a quick win. Plain calculations and recall belong here.
- Each problem checks a *different* thing. Never the same exercise with new numbers.
- Usual moves: `recall`, `apply`, `notice`.

### ★★ Build: "I can use this somewhere real"

- The child reads a story, table, figure, map or excerpt, then decides what to do. Two steps are fine.
- Usual moves: `model`, `notice`, `estimate`, `connect`, `evidence`.

### ★★★ Deep Think: "I have to really think about this"

**Harder means deeper thinking, not bigger numbers, more steps or longer wording.** Use friendly
numbers. Aim for "how would I even start?", then a click.

Each concept's Deep Think needs:
- at least 2 thinking moves;
- at least one problem that isn't multiple choice;
- in Math, an `investigation` or `build` (elsewhere, where they fit);
- a real tie to the topic. *Take the topic away: is the problem unchanged?* Then it goes.

## Patterns that make a problem deep

Use the one that fits. Don't force them all.

| Pattern | What it looks like | Move |
|---|---|---|
| **The hidden question** | The situation, not the numbers, says what to do | `model` |
| **Many right answers** | "Design a pen with 36 m² of grass." Use `build` | `design` |
| **Break it down** | Linked parts, each opening the next. Use `investigation` | `breakdown` |
| **Work backwards** | The ending is given. What was the start? | `backwards` |
| **Spot the flaw** | A believable mistake. Where did it go wrong, and why did it seem right? | `flaw` |
| **Always, sometimes, never** | "Two odd numbers always add to an even number. True?" | `why` |
| **What if?** | Change one thing. What else changes? | `whatif` |
| **Not enough information** | "Can you tell? What else would you need?" | `notice` |
| **Decide and defend** | Pick a side and defend it with evidence | `decide` |
| **Is it fair? Is it true?** | Weigh a claim, source, test or graph | `evidence` |
| **A new setting** | The same idea in clothes the child hasn't seen | `connect` |
| **Make your own** | Write a problem, test or sentence that does a job | `design` |

### Depth by subject

**Math: sense-making over calculating.** Low threshold, high ceiling.
- Weak: "\(12.07 - 9.638\) = ?" as Deep Think. Strong: a fundraiser story with four clues, one useless.
- Also: find every rectangle that fits; a divisibility digit puzzle; a mistake that shows *how*
  someone thought; a pattern that keeps working, and why.

**Science: reason from the model to something new.** Predict, then explain. Concept-cartoon
disagreements, where each wrong view is one real children hold.
- Weak: "Which system is the heart part of?" above Warm-up. Strong: "Two friends argue about why a
  steel ship floats. Who is right, and what evidence would settle it?"
- Also: a small invented data table; the flaw in an experiment; change one variable and predict.

**Social Studies: think like a historian or citizen.** Significance, evidence, continuity and change,
cause and consequence, perspectives, ethics.
- Weak: "Which river did Egypt grow along?" above Warm-up. Strong: "Two sources disagree about a trade
  deal. One was written by the merchant. What can each be trusted for?"
- Also: another person's place in society; what changed and what stayed; which cause mattered most.

**ELAL: read closely, then think about language.** A child who hasn't read the text can't answer.
- Weak: "What is a metaphor?" above Warm-up. Strong: "The author wrote *crept*. If she had written
  *walked*, what would we lose?"
- Also: a draft to improve; two readings to weigh; a moment from another character's view.

## Craft rules

**Stories**
- At most about 60 words (120 for an investigation). Grade 5 reading level. Works on a phone.
- Every detail earns its place, unless it's extra information to ignore on purpose.
- Real to a child: school, games, pets, a Chinook, a rink, a road trip. Mix names and families.
- First Nations, Métis and Inuit content only with care and named, sourced facts. No stereotypes.
- No fear, shame, adult themes or brand names. No unneeded pronouns.
- Keep it fresh: don't reuse settings, story shapes or names, including from the topic's passage.

**Fair to a real ten-year-old**
- Picture a 10-year-old on a phone. Would they get it, and retell it?
- Funny and concrete beats sharp and dry. Tables are at most 5 columns.
- `build` rules exclude silly answers: a garden 0 m wide is not a garden.
- Avoid written answers (`open`). ELAL may keep 1 per set, only where writing is the skill. The site
  never counts words.
- Rubric lines match what the prompt asked and judge the answer, not an action.
- Cut questions that split hairs between two near-equal wordings.

**Multiple choice**
- Only when the wrong answers teach something. Each is a real misconception, with feedback that
  explains it without giving the answer.
- No giveaways: choices alike in length and tone. No joke options, no "all of the above".
- Prefer another type when the answer can be typed or built.

**Hints coach the thinking**
1. Ask a question or point where to look. Never the answer.
2. Suggest a strategy.
3. Get close. The child does the last step.

**Solutions show how to think**
- Start from the approach. Short steps, one idea each.
- Where it helps, end with another way or what we learned.
- `build` solutions show two or more answers and why they all work.

**Tone:** warm and direct, "you", Canadian spelling. Tricky, never unfair: a child who got it wrong
should think "oh, of course."

## `build`: many right answers

```yaml
- id: d2
  level: 3
  thinking: design
  covers: [S1.9]
  type: build
  prompt: |-
    Noor has **20 m** of fence for a rabbit run shaped like a rectangle. The rabbits need
    at least **21 m²**. Design a run that works.
  fields:
    - { name: w, label: 'Length', unit: m }
    - { name: h, label: 'Width', unit: m }
  rules:
    - { test: '2 * (w + h) == 20', fail: 'Check the fence: going all the way around should use exactly 20 m.' }
    - { test: 'w * h >= 21', fail: 'The fence works, but the rabbits have less than 21 m² of grass.' }
  examples:
    - { w: 7, h: 3 }
    - { w: 5, h: 5 }
  counterexamples:
    - { w: 8, h: 2 }
  hints: [What do the length and the width have to add up to?]
  solution:
    - 'Going around uses 2 lengths and 2 widths, so length + width must be 10.'
    - '7 × 3 = 21 m² works. So does 6 × 4 = 24 m² and 5 × 5 = 25 m².'
    - '8 × 2 = 16 m² uses the same fence but is too small: the closer to a square, the more grass.'
```

- Rules use field names with `+ - * / %`, parentheses, comparisons and `&&`.
- Rules run in order and the first failure shows its `fail` message, so make it a nudge, not the answer.

## `investigation`: a story in linked parts

```yaml
- id: d3
  level: 3
  thinking: breakdown
  covers: [S1.3, S1.1]
  type: investigation
  prompt: |-
    The Grade 5 class wants to raise **$300** for a field trip. They already have **$118.50**.
    Popcorn bags sell for **$2** and each bag costs the class **$0.75** to make.
  parts:
    - type: number
      prompt: How much more money do they need?
      answer: 181.5
      verify: 300 - 118.5
      hints: [What do they have, and what do they want?]
      solution: ['\(300 - 118.50 = 181.50\)']
    - type: number
      prompt: How much does the class actually **keep** from each bag?
      answer: 1.25
      verify: 2 - 0.75
      hints: [The class gets $2, but did it get to keep all of it?]
      solution: ['\(2.00 - 0.75 = 1.25\)']
    - type: mc
      prompt: Ben says, "We need to sell about 90 bags, because $180 ÷ $2 is 90." What is wrong?
      choices: [...]
      answer: 0
      feedback: {...}
  wrapUp: Money coming in is not the same as money you keep.
  hints: []
  solution: []
```

- Each part shows once the one before is right. The last part couldn't be answered at the start.
- `wrapUp` names the big idea.
- Review skips investigations, so every concept needs other problems too.

## `thinking`: every problem names its move

Shown after a correct answer ("Thinking skill: **Work backwards**"), so children learn the moves. It
also feeds the educator notes. `recall` and `apply` are not shown.

| Move | Child sees |
|---|---|
| `recall` | Remember it |
| `apply` | Use the idea |
| `notice` | Look closely |
| `model` | Turn a story into a plan |
| `estimate` | Check it makes sense |
| `backwards` | Work backwards |
| `pattern` | Hunt for a pattern |
| `flaw` | Find the flaw |
| `why` | Explain why |
| `ways` | Find another way |
| `design` | Design it yourself |
| `whatif` | Ask "what if?" |
| `evidence` | Back it up |
| `perspective` | See another side |
| `decide` | Weigh it up |
| `connect` | Connect ideas |
| `breakdown` | Break it into parts |

## Self-check

1. Solve every problem as a Grade 5 child. Anything above the grade?
2. Delete any problem whose thinking repeats another's.
3. Is Deep Think hard because of the *thinking*? Would it be as hard with small numbers?
4. Cover the choices. Could the answer be guessed from length or tone?
5. Run `npm run verify -- <concept-id>`, then `npm run audit`. Is everything still covered?

## Sources

- NRICH: [low-threshold, high-ceiling tasks](https://nrich.maths.org/7701).
- CEMC, University of Waterloo: [Problem of the Week](https://cemc.uwaterloo.ca/resources/potw).
- Peter Liljedahl, [*Building Thinking Classrooms*](https://www.buildingthinkingclassrooms.com/about-btc).
- Robert Kaplinsky, [Open Middle](https://www.avid.org/digital-tools/Open-Middle).
- TERC Inquiry Project, [concept cartoons](https://inquiryproject.terc.edu/assessment/concept_cartoons.cfm.html).
- Peter Seixas and Tom Morton, [*The Big Six Historical Thinking Concepts*](https://school.nelson.com/the-big-six-historical-thinking-concepts/).
- Amy von Heyking, [historical thinking in the elementary years](https://www.thenhier.ca/en/content/von-heyking-amy-%E2%80%9Chistorical-thinking-elementary-years%E2%80%9D-2008-0.html).
- Achieve the Core, [text-dependent questions](https://achievethecore.org/file/353).
- OECD Digital Education Outlook 2026 and the PISA 2029 Media and AI Literacy framework, reported by
  [Newsweek](https://www.newsweek.com/in-the-age-of-ai-questions-matter-more-than-answers-opinion-12471343)
  and [Euronews](https://www.euronews.com/my-europe/2026/09/10/youth-losing-critical-skills-and-ai-hollowing-out-capabilities-pisa-founder-says).
