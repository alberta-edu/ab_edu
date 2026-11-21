// Logic for the Grade 3 quality-of-life meters (g3ss-life-meter). Quality of life is a sense of
// safety, comfort, health and happiness (Alberta Social Studies, Grade 3). Each action a child taps
// fills the meters it helps.

export const METERS = [
  { id: 'safety', name: 'Safety', icon: '🛡️' },
  { id: 'comfort', name: 'Comfort', icon: '🛋️' },
  { id: 'health', name: 'Health', icon: '💪' },
  { id: 'happiness', name: 'Happiness', icon: '😊' },
] as const;

export type MeterId = (typeof METERS)[number]['id'];

export interface LifeAction {
  adds: string[];
}

/** Throws on an unknown meter id, so a typo fails the build. */
export function checkActions(actions: LifeAction[]): void {
  const ids = new Set<string>(METERS.map((m) => m.id));
  for (const a of actions) for (const id of a.adds) if (!ids.has(id)) throw new Error(`g3ss-life-meter: no meter "${id}"`);
}

/** How full each meter is, from 0 to 1, once the actions at `done` have been tapped. */
export function levels(actions: LifeAction[], done: Set<number>): Record<MeterId, number> {
  const out = {} as Record<MeterId, number>;
  for (const m of METERS) {
    const helping = actions.map((a, i) => ({ a, i })).filter(({ a }) => a.adds.includes(m.id));
    const got = helping.filter(({ i }) => done.has(i)).length;
    out[m.id] = helping.length ? got / helping.length : 0;
  }
  return out;
}
