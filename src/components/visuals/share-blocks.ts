// Why the division algorithm works (MAT5 S1.1, S1.3): share base-ten blocks among equal groups,
// one place at a time, starting with the hundreds. Leftovers are traded for ten of the next
// place down, just as the algorithm "brings down" the next digit.

export type Places = { h: number; t: number; o: number };
export type ShareState = {
  /** Blocks not shared yet. */
  pile: Places;
  /** What each group has so far. */
  each: Places;
  /** The place this step works on, highlighted in the picture. */
  focus: keyof Places | null;
  say: string;
};

const NAME: Record<keyof Places, [string, string]> = { h: ['hundred', 'hundreds'], t: ['ten', 'tens'], o: ['one', 'ones'] };
const word = (n: number, p: keyof Places) => `${n} ${NAME[p][n === 1 ? 0 : 1]}`;

/** Every state of sharing `n` (3 digits) among `d` groups, from the start to the answer. */
export function shareSteps(n: number, d: number): ShareState[] {
  if (!Number.isInteger(n) || n < 100 || n > 999 || !Number.isInteger(d) || d < 2 || d > 9) throw new Error('3-digit by 1-digit only');
  const pile: Places = { h: Math.floor(n / 100), t: Math.floor(n / 10) % 10, o: n % 10 };
  const each: Places = { h: 0, t: 0, o: 0 };
  const states: ShareState[] = [];
  const snap = (focus: keyof Places | null, say: string) => states.push({ pile: { ...pile }, each: { ...each }, focus, say });

  snap(null, `${n} is ${word(pile.h, 'h')}, ${word(pile.t, 't')} and ${word(pile.o, 'o')}. Share them among ${d} equal groups.`);
  const order: (keyof Places)[] = ['h', 't', 'o'];
  order.forEach((p, i) => {
    const have = pile[p];
    const q = Math.floor(have / d);
    each[p] = q;
    pile[p] = have - q * d;
    snap(
      p,
      q === 0
        ? `Only ${word(have, p)}: not enough for ${d} groups. Each group gets 0 ${NAME[p][1]}.`
        : `Share ${word(have, p)}: each group gets ${q}. That uses ${q * d}, so ${pile[p] === 0 ? 'nothing is' : pile[p] === 1 ? '1 is' : `${pile[p]} are`} left.`,
    );
    const next = order[i + 1];
    if (next && pile[p] > 0) {
      const r = pile[p];
      pile[p] = 0;
      pile[next] += r * 10;
      snap(next, `Trade the ${word(r, p)} left for ${r * 10} ${NAME[next][1]}. Now there are ${word(pile[next], next)}.`);
    }
  });
  const q = each.h * 100 + each.t * 10 + each.o;
  snap(null, `Each group gets ${q}${pile.o ? `, and ${pile.o} ${pile.o === 1 ? 'is' : 'are'} left over` : ''}. So ${n} ÷ ${d} = ${q}${pile.o ? ` R ${pile.o}` : ''}.`);
  return states;
}
