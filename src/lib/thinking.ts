// Thinking moves: the kind of thinking a problem trains. Every problem names one. After solving,
// the student sees it as "Thinking skill: Work backwards" (except recall and apply, which are the
// baseline), and educators see it on the notes page.

export const THINKING_MOVES = {
  recall: { icon: '💭', name: 'Remember it', blurb: 'You pulled an idea from memory.' },
  apply: { icon: '🔧', name: 'Use the idea', blurb: 'You used an idea exactly the way you learned it.' },
  notice: { icon: '🔍', name: 'Look closely', blurb: 'You found the detail that matters.' },
  model: { icon: '🗺️', name: 'Turn a story into a plan', blurb: 'You found the real question.' },
  estimate: { icon: '🎯', name: 'Check it makes sense', blurb: 'You checked with a quick estimate.' },
  backwards: { icon: '⏪', name: 'Work backwards', blurb: 'You undid each step from the end.' },
  pattern: { icon: '🧩', name: 'Hunt for a pattern', blurb: 'You found a rule and used it.' },
  flaw: { icon: '🐞', name: 'Find the flaw', blurb: 'You found the step that went wrong.' },
  why: { icon: '💬', name: 'Explain why', blurb: 'You gave a reason, not just an answer.' },
  ways: { icon: '🔀', name: 'Find another way', blurb: 'You found more than one way.' },
  design: { icon: '📐', name: 'Design it yourself', blurb: 'You built something to fit the rules.' },
  whatif: { icon: '🤔', name: 'Ask “what if?”', blurb: 'You tested what one change would do.' },
  evidence: { icon: '📎', name: 'Back it up', blurb: 'You backed an idea with evidence.' },
  perspective: { icon: '👀', name: 'See another side', blurb: 'You took someone else’s view.' },
  decide: { icon: '⚖️', name: 'Weigh it up', blurb: 'You weighed the options and chose.' },
  connect: { icon: '🔗', name: 'Connect ideas', blurb: 'You used an idea somewhere new.' },
  breakdown: { icon: '🧱', name: 'Break it into parts', blurb: 'You split a big problem into parts.' },
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
