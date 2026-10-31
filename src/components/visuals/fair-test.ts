// The fair-test ramp lab (SCI5-OI7-GQ1-LO1, K3.1-K3.5, S3.1-S3.5): two toy-car tests, each
// set up with three variables. The responding variable is how far the car rolls.

export const VARIABLES = {
  height: { label: 'Ramp height', options: ['low', 'medium', 'high'] },
  surface: { label: 'Floor surface', options: ['wood', 'carpet'] },
  load: { label: 'Car load', options: ['empty', 'carrying clay'] },
} as const;

export type VarId = keyof typeof VARIABLES;
export type Setup = { height: 'low' | 'medium' | 'high'; surface: 'wood' | 'carpet'; load: 'empty' | 'carrying clay' };

/** Distance rolled in centimetres. Height matters a lot, surface a lot, the load very little. */
export function distance(s: Setup): number {
  const h = { low: 100, medium: 160, high: 220 }[s.height];
  const f = s.surface === 'wood' ? 1 : 0.45;
  const m = s.load === 'empty' ? 1 : 1.03;
  return Math.round(h * f * m);
}

export interface Analysis {
  changed: VarId[];
  fair: boolean;
  message: string;
}

export function analyse(a: Setup, b: Setup): Analysis {
  const ids = Object.keys(VARIABLES) as VarId[];
  const changed = ids.filter((id) => a[id] !== b[id]);
  const name = (id: VarId) => VARIABLES[id].label.toLowerCase();
  if (changed.length === 0)
    return { changed, fair: false, message: 'Both tests are set up the same way, so nothing is being tested. Change one variable in Test B.' };
  if (changed.length > 1)
    return {
      changed,
      fair: false,
      message: `Not a fair test: you changed ${changed.length} variables (${changed.map(name).join(' and ')}). If the distances are different, you can't tell which change caused it.`,
    };
  const m = changed[0];
  const kept = ids.filter((id) => id !== m).map(name);
  const da = distance(a);
  const db = distance(b);
  const diff = Math.abs(da - db);
  const effect = diff <= 6 ? `The distances were almost the same, so the ${name(m)} had very little effect.` : `The distance changed by ${diff} cm, so the ${name(m)} affects how far the car rolls.`;
  return {
    changed,
    fair: true,
    message: `Fair test! Manipulated variable: ${name(m)}. Responding variable: distance rolled. Controlled variables: ${kept.join(' and ')}. ${effect}`,
  };
}
