// The design lab's water bottle: six design factors and the changes that affect them
// (SCI5-OI6-GQ1-LO1, K2.1-K2.4, S2.2, S2.5).

export const FACTORS = ['safety', 'functionality', 'usability', 'reliability', 'efficiency', 'aesthetics'] as const;
export type Factor = (typeof FACTORS)[number];

export const FACTOR_QUESTION: Record<Factor, string> = {
  safety: 'Could anyone get hurt?',
  functionality: 'Does it do its job, holding water without leaking?',
  usability: 'Is it easy to use?',
  reliability: 'Does it keep working, again and again?',
  efficiency: 'Does it avoid wasting material, time or effort?',
  aesthetics: 'Does it look good?',
};

export interface Change {
  id: string;
  label: string;
  kind: 'enhancement' | 'refinement';
  effect: Partial<Record<Factor, number>>;
}

export const START: Record<Factor, number> = { safety: 3, functionality: 2, usability: 2, reliability: 2, efficiency: 3, aesthetics: 2 };

export const CHANGES: Change[] = [
  { id: 'seal', label: 'Make the lid seal tighter', kind: 'refinement', effect: { functionality: 2, reliability: 1 } },
  { id: 'handle', label: 'Add a carrying handle', kind: 'enhancement', effect: { usability: 2 } },
  { id: 'bumper', label: 'Add a rubber bumper on the bottom', kind: 'enhancement', effect: { reliability: 2, safety: 1 } },
  { id: 'edges', label: 'Smooth the sharp edge on the lid', kind: 'refinement', effect: { safety: 2 } },
  { id: 'colour', label: 'Choose a bright colour', kind: 'refinement', effect: { aesthetics: 2 } },
  { id: 'thin', label: 'Make the walls thinner to use less plastic', kind: 'refinement', effect: { efficiency: 2, reliability: -2 } },
];

/** Factor scores (0 to 5) after the changes made so far. */
export function score(applied: string[]): Record<Factor, number> {
  const s = { ...START };
  for (const id of applied) {
    const c = CHANGES.find((x) => x.id === id);
    if (!c) continue;
    for (const [f, v] of Object.entries(c.effect) as [Factor, number][]) s[f] = Math.max(0, Math.min(5, s[f] + v));
  }
  return s;
}
