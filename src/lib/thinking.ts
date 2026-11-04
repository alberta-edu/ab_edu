// Thinking moves: the kind of thinking a problem trains. Every problem names one. After solving,
// the student sees it as "Thinking skill: Work backwards" (except recall and apply, which are the
// baseline), and educators see it on the notes page.

export const THINKING_MOVES = {
  recall: { icon: '💭', name: 'Remember it', blurb: 'You pulled an idea from memory.' },
  apply: { icon: '🔧', name: 'Use the idea', blurb: 'You used an idea exactly the way you learned it.' },
  notice: { icon: '🔍', name: 'Look closely', blurb: 'You spotted the detail that matters and ignored the rest.' },
  model: { icon: '🗺️', name: 'Turn a story into a plan', blurb: 'You worked out what the story was really asking, then chose how to solve it.' },
  estimate: { icon: '🎯', name: 'Check it makes sense', blurb: 'You used a quick estimate to judge an answer.' },
  backwards: { icon: '⏪', name: 'Work backwards', blurb: 'You started from the end and undid each step.' },
  pattern: { icon: '🧩', name: 'Hunt for a pattern', blurb: 'You found a rule that keeps working, then used it.' },
  flaw: { icon: '🐞', name: 'Find the flaw', blurb: 'You found exactly where someone’s thinking went wrong.' },
  why: { icon: '💬', name: 'Explain why', blurb: 'You gave a reason, not just an answer.' },
  ways: { icon: '🔀', name: 'Find another way', blurb: 'You saw there is more than one path to an answer.' },
  design: { icon: '📐', name: 'Design it yourself', blurb: 'You built something that meets all the rules.' },
  whatif: { icon: '🤔', name: 'Ask “what if?”', blurb: 'You changed one thing and worked out what else would change.' },
  evidence: { icon: '📎', name: 'Back it up', blurb: 'You used evidence to support an idea.' },
  perspective: { icon: '👀', name: 'See another side', blurb: 'You looked at something the way someone else would.' },
  decide: { icon: '⚖️', name: 'Weigh it up', blurb: 'You compared the options and made a choice you can defend.' },
  connect: { icon: '🔗', name: 'Connect ideas', blurb: 'You used what you know in a brand-new situation.' },
  breakdown: { icon: '🧱', name: 'Break it into parts', blurb: 'You split a big problem into smaller ones you could solve.' },
} as const;

export type ThinkingMove = keyof typeof THINKING_MOVES;

/** The shown moves in three families, for the educators page. */
export const MOVE_GROUPS: { title: string; moves: ThinkingMove[] }[] = [
  { title: 'Understand the problem', moves: ['notice', 'model', 'breakdown', 'connect'] },
  { title: 'Find a way', moves: ['pattern', 'backwards', 'ways', 'design', 'whatif'] },
  { title: 'Check and decide', moves: ['estimate', 'flaw', 'why', 'evidence', 'perspective', 'decide'] },
];
/** Moves named to the student after solving. Remembering and using an idea are the baseline. */
export const SHOWN_MOVES: ReadonlySet<ThinkingMove> = new Set(
  (Object.keys(THINKING_MOVES) as ThinkingMove[]).filter((m) => m !== 'recall' && m !== 'apply'),
);
export const THINKING_MOVE_IDS = Object.keys(THINKING_MOVES) as [ThinkingMove, ...ThinkingMove[]];
