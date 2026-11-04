// Thinking moves: the kind of thinking a problem trains. Every problem names one. After solving,
// the student sees it as "Thinking skill: Work backwards" (except recall and apply, which are the
// baseline), and educators see it on the notes page.

export const THINKING_MOVES = {
  recall: { name: 'Remember it', blurb: 'You pulled an idea from memory.' },
  apply: { name: 'Use the idea', blurb: 'You used an idea exactly the way you learned it.' },
  notice: { name: 'Look closely', blurb: 'You spotted the detail that matters and ignored the rest.' },
  model: { name: 'Turn a story into a plan', blurb: 'You worked out what the story was really asking, then chose how to solve it.' },
  estimate: { name: 'Check it makes sense', blurb: 'You used a quick estimate to judge an answer.' },
  backwards: { name: 'Work backwards', blurb: 'You started from the end and undid each step.' },
  pattern: { name: 'Hunt for a pattern', blurb: 'You found a rule that keeps working, then used it.' },
  flaw: { name: 'Find the flaw', blurb: 'You found exactly where someone’s thinking went wrong.' },
  why: { name: 'Explain why', blurb: 'You gave a reason, not just an answer.' },
  ways: { name: 'Find another way', blurb: 'You saw there is more than one path to an answer.' },
  design: { name: 'Design it yourself', blurb: 'You built something that meets all the rules.' },
  whatif: { name: 'Ask “what if?”', blurb: 'You changed one thing and worked out what else would change.' },
  evidence: { name: 'Back it up', blurb: 'You used evidence to support an idea.' },
  perspective: { name: 'See another side', blurb: 'You looked at something the way someone else would.' },
  decide: { name: 'Weigh it up', blurb: 'You compared the options and made a choice you can defend.' },
  connect: { name: 'Connect ideas', blurb: 'You used what you know in a brand-new situation.' },
  breakdown: { name: 'Break it into parts', blurb: 'You split a big problem into smaller ones you could solve.' },
} as const;

export type ThinkingMove = keyof typeof THINKING_MOVES;
/** Moves named to the student after solving. Remembering and using an idea are the baseline. */
export const SHOWN_MOVES: ReadonlySet<ThinkingMove> = new Set(
  (Object.keys(THINKING_MOVES) as ThinkingMove[]).filter((m) => m !== 'recall' && m !== 'apply'),
);
export const THINKING_MOVE_IDS = Object.keys(THINKING_MOVES) as [ThinkingMove, ...ThinkingMove[]];
