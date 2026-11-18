// Layout for the plot braid (LANENG4-OI1-GQ1-LO1, K3.3, K3.4): where each scene sits when the story is
// read in the order it is told, and in the order the events really happened.

export interface BraidScene {
  strand: 'main' | 'sub' | 'flash';
  text: string;
  /** When the scene happens in the story's world. 1 is earliest. Each scene has its own number. */
  when: number;
}

/** Column of each scene: `tell` in telling order, `time` in time order. */
export function braidLayout(scenes: BraidScene[]): { tell: number[]; time: number[] } {
  const whens = scenes.map((s) => s.when);
  if (new Set(whens).size !== whens.length) throw new Error('plot-braid: every scene needs its own "when"');
  const sorted = [...whens].sort((a, b) => a - b);
  return { tell: scenes.map((_, i) => i), time: whens.map((w) => sorted.indexOf(w)) };
}

/** True when the telling order jumps back in time: a flashback. */
export const hasFlashback = (scenes: BraidScene[]) => scenes.some((s, i) => i > 0 && s.when < scenes[i - 1].when);
