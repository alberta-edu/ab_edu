# The question standard

How every practice problem on AB Edu is written. Read this together with
[CONTENT-GUIDE.md](CONTENT-GUIDE.md), which covers the file format.

## Why this exists

A calculator, and now an AI model, can do the calculation faster than any child. What stays
valuable is the thinking around it: working out what a story is really asking, breaking a
hard problem into pieces, spotting a flaw, weighing evidence, and inventing something new.
So our problems exist to build that thinking. Curriculum facts and procedures are the
material we think *with*, not the goal.

**A problem earns its place by making a child think something they wouldn't have thought
without it.** If two problems make a child think the same thought, keep the better one.

## The two hard limits

### 1. Nothing above the grade

A Grade 5 child must be able to solve every problem using only what Alberta teaches up to
the end of Grade 5. Check the *knowledge needed to solve it*, not just the `covers:` tag: a
problem can be tagged correctly and still secretly require Grade 6 math.

Grade 5 Math stops here. All of these are later-grade and may not be needed, even in a Deep
Think:

| Off limits (Grade 6 or later) | What Grade 5 does instead |
|---|---|
| Finding a percent of a number ("25% of 80") | Expressing the same part-whole as ratio, fraction, decimal and percentage (where the whole is out of a friendly number, as in 15 of 25 → 60%) |
| Equivalent ratios and proportions, unit rates, speed | Part-part and part-whole ratios of one situation |
| Adding or subtracting fractions with **different** denominators | Common denominators only, including improper fractions and mixed numbers |
| Multiplying or dividing fractions, or a fraction of a number | Adding and subtracting fractions |
| Multiplying or dividing **decimals** | Adding and subtracting decimals to thousandths |
| Multiplying beyond 3-digit × 2-digit; dividing beyond 3-digit ÷ 1-digit | Those exact sizes |
| Negative numbers, integers | Natural numbers and decimals |
| Powers, exponents, prime factorization | Divisibility tests (2, 3, 5), factors |
| Combining like terms; equations of 3+ operations | Expressions with one or two terms; equations with one or two operations |
| Order of operations with powers or nested brackets | Parentheses holding addition or subtraction |
| Area of triangles or composite shapes by formula; circles; volume | Perimeter and area of rectangles (a story can use two rectangles side by side) |
| Translating shapes; four-quadrant plane | First-quadrant coordinate grid, vertices, positional language |
| Mean, median, range, probability calculations | Frequency, mode, categorical data |

In Science, Social Studies and ELAL there is no such table. Instead, every fact a problem
relies on must trace to a statement at Grade 5 or below. Before writing, read the outcome's
statements with `npm run statements -- <subject> <outcome-code>`. To see what is off limits,
read the Grade 6 outcomes for the same subject in `curriculum/grade-6/`. For example,
"heating makes particles move faster" is Grade 6 science, so it may not be used even as a
hint. A word a child doesn't know must be explained in the problem or avoided.

`npm run verify` catches some math above the grade automatically. It can't catch all of it,
so read each problem and ask: *how would a child who has only done Grade 5 solve this?* Write
that solution. If you can't, the problem goes.

**The math limits apply in every subject.** A trade problem that really needs equivalent ratios
or a rate is above the grade, even in Social Studies. Grouping or repeated addition is fine.

**Reasoning beyond the lesson is allowed; needing an untaught fact is not.** A child may reason
from what the lesson taught, from everyday experience, or from facts the problem states. If a
fact is needed and the lesson didn't teach it, the problem must supply it. Ask: *what would a
child have to already know?*

**Math truths need their conditions.** "The square has the least perimeter" only gives a square
if the side can be any length. If a problem expects whole-number sides, it must say so, and its
answer must hold for what it says.

### 2. Everything is checked

- Every computed answer has a `verify:` expression.
- Every `build` problem has `examples` that pass and `counterexamples` that fail.
- Real-world facts (places, dates, data, science) are true and checked against a primary
  source. If a number isn't real, the setting must clearly be invented, like a made-up bakery.
- Never copy a problem from a contest, textbook or website. Inspiration is fine; every
  problem here is original. Passages are original too.
- A problem may not contradict the lesson. If the lesson's wording needs a closer look, as with
  "salt water pushes up harder" when anything floating has a push equal to its weight, the
  solution must resolve the tension explicitly.

## The ladder

At most **9 problems per concept**: 3 Warm-up, 4 Build and 2 Deep Think. Too many questions
wear a child out, so fewer excellent problems beat more average ones. `npm run verify` checks:

- each level's maximum;
- at most 3 parts in an investigation;
- at most 5 steps in Deep Think, counting each investigation part as a step. One investigation
  and one single problem is the usual shape.

### ★ Warm-up: "I know what this is"

One idea, one step, quick success. It builds confidence and checks that the lesson landed.
This is where plain calculations and direct recall belong, but each one still checks a
*different* thing. Never three of the same exercise with new numbers. Thinking moves here
are usually `recall`, `apply` or `notice`.

### ★★ Build: "I can use this somewhere real"

The child must *read and decide*. Short stories, tables, figures, maps and excerpts, with
the choice of what to do left to the child. Two steps are fine. Mostly `model`, `notice`,
`estimate`, `connect`, `evidence`.

### ★★★ Deep Think: "I have to really think about this"

**Hard means deeper thinking. It does not mean bigger numbers, more steps of the same
calculation, or longer wording.** A Deep Think problem should usually use *friendly* numbers,
so that the arithmetic doesn't get in the way of the idea. A child should feel a moment of
"hmm, how would I even start?" and then a click of understanding.

Each concept's Deep Think needs:
- at least 2 different thinking moves;
- at least one problem that isn't multiple choice;
- in Math, at least one `investigation` or `build` problem. Use them in other subjects
  wherever they fit;
- nothing that is really just a harder Warm-up;
- a real tie to the topic. *Take the topic away: is the problem unchanged?* If it is, it's a logic
  puzzle wearing a costume, and it goes.

## Patterns that make a problem deep

Use the pattern that fits the idea. Don't force them all.

| Pattern | What it looks like | Move |
|---|---|---|
| **The hidden question** | A story where the child must work out what is really being asked. The numbers don't tell you what to do; the situation does. | `model` |
| **Many right answers** | "Design a pen with 36 m² of grass." The child invents; the site checks it against rules. Use `build`. | `design` |
| **Break it down** | A story with linked parts, each opening the next. The last part asks something the child couldn't have answered at the start. Use `investigation`. | `breakdown` |
| **Work backwards** | The ending is given. What must the start have been? | `backwards` |
| **Spot the flaw** | A believable child makes a believable mistake. Exactly where did it go wrong, and why did it seem right? | `flaw` |
| **Always, sometimes, never** | "Adding two odd numbers always gives an even number. True?" Prove it or find a counterexample. | `why` |
| **What if?** | Change one thing. What else changes, what stays the same? | `whatif` |
| **Not enough information** | "Can you tell from this? What else would you need?" Sometimes the honest answer is "you can't tell". | `notice` |
| **Decide and defend** | No single answer is the point. Pick a side and defend it with evidence. | `decide` |
| **Is it fair? Is it true?** | Weigh a claim, a source, a test, a graph. | `evidence` |
| **A new setting** | The same idea wearing clothes the child hasn't seen. | `connect` |
| **Make your own** | Write a problem, a test or a sentence that does a certain job. | `design` |

### What each subject's depth looks like

**Math: sense-making over calculating.** Modelled on low-threshold, high-ceiling tasks:
everyone can start, and there is real room to go further.
- Weak: "\(12.07 - 9.638\) = ?" as Deep Think. It is only a harder subtraction.
- Strong: a school fundraiser that gives four clues in a story, where the child works out
  which clue is useless and what is really being asked.
- Other strong moves: find every rectangle that fits; a digit puzzle using divisibility rules;
  a mistake that gives away *how* someone was thinking; a pattern that keeps working, and why.

**Science: reason from the model to something you haven't seen.** Predict, then explain with the
idea. Use concept-cartoon style disagreements, where each wrong view is one real children hold
and the child judges the reasoning.
- Weak: "Which system is the heart part of?" as anything above Warm-up.
- Strong: "Two friends argue about why a steel ship floats. Who is right, and what evidence
  would settle it?"
- Other strong moves: read a small invented data table and draw a conclusion; find the flaw in an
  experiment; change one variable and predict.

**Social Studies: think like a historian or a citizen.** Use the historical thinking concepts:
significance, evidence, continuity and change, cause and consequence, perspectives, and ethical
judgement. Children can reason about the past without memorising it.
- Weak: "Which river did Egypt grow along?" as anything above Warm-up.
- Strong: "Two sources disagree about a trade deal. One was written by the merchant. What can
  each source be trusted for?"
- Other strong moves: how would this look from another person's place in society; what changed
  and what stayed the same; which cause mattered most, and how would you defend that?

**ELAL: read closely, then think about how language works.** Questions must need the text: a child
who hasn't read the passage shouldn't be able to answer them. Linger over specific words
and phrases. Ask why the author made a choice, what would change if a word changed, and what the
evidence for a reading is.
- Weak: "What is a metaphor?" as anything above Warm-up.
- Strong: "The author wrote *crept*. If she had written *walked*, what would we lose?"
- Other strong moves: a writer's draft to improve; two readings to weigh with evidence; tell the
  same moment from another character's view; write a sentence that does a specific job.

## Craft rules

**Stories**
- Short: at most about 60 words for a single problem and 120 for an investigation. Grade 5
  reading level, short sentences, no decorative words. It has to work on a phone.
- Every detail earns its place, unless it's deliberately extra information the child must
  learn to ignore.
- Real to a child: their school, a game, a pet, a Chinook, a skating rink, a family road trip,
  a corner store. Alberta settings are welcome. Use a mix of names and families.
- Treat First Nations, Métis and Inuit peoples only with care and with named, sourced facts.
  Never as decoration or stereotype. No stereotypes about anyone.
- No fear, shame or adult-only themes. No brand names.
- Avoid pronouns you don't need. Names should not imply what a child can do.
- **Keep the site fresh.** A child meets many topics, so settings must not repeat. Don't reuse a
  story shape used elsewhere, and vary the names. Don't borrow names from the topic's own passage.

**Fair to a real ten-year-old**
- A problem that impresses adults but would lose a child is a bad problem. Picture a 10-year-old
  reading it on a phone. Would they get it? Would they retell it?
- Questions that are funny, concrete and easy to picture beat ones that are sharp but dry.
- Tables are at most 5 columns wide, so that they fit on a phone.
- Rules in a `build` problem must exclude silly answers: a garden 0 m wide is not a garden.
- Avoid written answers (`open`). Turn the idea into a choice or `build` problem instead. ELAL may
  keep 1 per set, only where writing is the skill being taught, such as writing a simile or a stanza.
  The site never counts words: any answer opens the strong answer and the checklist.
- Children grade written answers themselves, so every rubric line must match something the
  prompt actually asked, and must be about the answer, not an action like "I read it to someone".
- Cut a question that splits hairs between two nearly equal wordings.

**Multiple choice**
- Use it only when the wrong answers teach something. Every wrong choice is a real
  misconception with feedback explaining the thinking behind it, without giving away the
  answer.
- No giveaways: choices should be alike in length and tone. The right answer must not be the
  longest or the only one with a reason in it. No joke options. Avoid "all of the above".
- Prefer another type when the answer can be typed or built.

**Hints: coach the thinking**
- Hint 1 asks a question or points at where to look ("What is the story really asking?").
- Hint 2 suggests a strategy.
- Hint 3 gets close, but the child still does the last step.
- Never give the answer in hint 1.

**Solutions: show how to think, not only what to compute**
- Start from how you would approach the problem. Short steps, one idea per step.
- Where it helps, end with another way or "what we learned".
- `build` solutions show two or more valid answers, and say why they all work.

**Tone**
- Warm and direct. Canadian spelling: colour, centre, metres. Use "you".
- Tricky, never unfair. A fair Deep Think leaves a child who got it wrong saying "oh, of course."

## New problem types

### `build`: many right answers

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

`rules` use the field names with `+ - * / %`, parentheses, comparisons (`== != < > <= >=`) and
`&&`. Rules run in order and the first one that fails shows its `fail` message, so make each
message a nudge rather than the answer.

### `investigation`: a story in linked parts

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

Each part is a smaller problem (`mc`, `multi`, `number`, `fraction`, `text`, `build` or `open`).
The next part appears when the one before is right. The last part should be the one that
couldn't have been answered at the start. `wrapUp` names the big idea. Investigations are skipped
in spaced review because they take a while, so every concept still needs other problems.

### `thinking`: every problem names its move

| Move | Name the child sees |
|---|---|
| `recall` | Remember it (not shown to the child) |
| `apply` | Use the idea (not shown to the child) |
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

It appears after a child solves the problem ("Thinking skill: **Work backwards**", then the one-line
reason), so children start to recognize the moves. `recall` and `apply` are the baseline, so they
are not shown. It also powers the educator notes.

## Self-check before you finish

1. Solve every problem as a Grade 5 child would. Is anything above the grade?
2. Delete any problem whose thinking repeats another's.
3. Read Deep Think: is the hard part the *thinking*? Would these be just as hard with
   small numbers? If bigger numbers are what makes it hard, rewrite it.
4. Cover the choices. Could the right one be guessed from its length or tone?
5. Does the set still cover what the old set covered? Run `npm run verify -- <concept-id>`,
   then check `npm run audit`.

## Where this comes from

- NRICH: [low-threshold, high-ceiling tasks](https://nrich.maths.org/7701), and how teachers
  use them.
- Centre for Education in Mathematics and Computing, University of Waterloo:
  [Problem of the Week](https://cemc.uwaterloo.ca/resources/potw).
- Peter Liljedahl, [*Building Thinking Classrooms*](https://www.buildingthinkingclassrooms.com/about-btc).
- Robert Kaplinsky, [Open Middle](https://www.avid.org/digital-tools/Open-Middle): many routes to a fixed end.
- TERC Inquiry Project: [concept cartoons](https://inquiryproject.terc.edu/assessment/concept_cartoons.cfm.html),
  where wrong views are real children's ideas.
- Peter Seixas and Tom Morton: [*The Big Six Historical Thinking Concepts*](https://school.nelson.com/the-big-six-historical-thinking-concepts/).
- Amy von Heyking: [historical thinking in the elementary years](https://www.thenhier.ca/en/content/von-heyking-amy-%E2%80%9Chistorical-thinking-elementary-years%E2%80%9D-2008-0.html).
- [Text-dependent questions](https://achievethecore.org/file/353) (Achieve the Core): questions
  that linger over specific phrases and need the text.
- OECD Digital Education Outlook 2026 and the PISA 2029 Media and AI Literacy framework, as
  [reported here](https://www.newsweek.com/in-the-age-of-ai-questions-matter-more-than-answers-opinion-12471343)
  and [here](https://www.euronews.com/my-europe/2026/09/10/youth-losing-critical-skills-and-ai-hollowing-out-capabilities-pisa-founder-says):
  performing a task with AI is not the same as learning, and thinking that takes effort matters.
