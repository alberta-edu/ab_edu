// Grade 3 money (MAT3-OI1-GQ1-LO1: K1.8, K1.9, S1.9-S1.11). Coins are counted in cents, and
// loonies, toonies and bills in dollars. Mixing the two needs decimals, which is Grade 4.

export interface Money {
  id: string;
  name: string;
  value: number;
  kind: 'coin' | 'bill';
}

/** Canadian coins and bills in use. Colours and shapes are simple drawings, not pictures of real money. */
export const CENTS: Money[] = [
  { id: 'quarter', name: 'quarter', value: 25, kind: 'coin' },
  { id: 'dime', name: 'dime', value: 10, kind: 'coin' },
  { id: 'nickel', name: 'nickel', value: 5, kind: 'coin' },
];

export const DOLLARS: Money[] = [
  { id: 'b100', name: '$100 bill', value: 100, kind: 'bill' },
  { id: 'b50', name: '$50 bill', value: 50, kind: 'bill' },
  { id: 'b20', name: '$20 bill', value: 20, kind: 'bill' },
  { id: 'b10', name: '$10 bill', value: 10, kind: 'bill' },
  { id: 'b5', name: '$5 bill', value: 5, kind: 'bill' },
  { id: 'toonie', name: 'toonie', value: 2, kind: 'coin' },
  { id: 'loonie', name: 'loonie', value: 1, kind: 'coin' },
];

export const ALL = [...CENTS, ...DOLLARS];
export const byId = (id: string) => ALL.find((m) => m.id === id)!;

/** English puts $ before the number, French after it. Both put ¢ after. */
export function written(n: number, unit: 'cents' | 'dollars', lang: 'en' | 'fr'): string {
  if (unit === 'cents') return lang === 'en' ? `${n}¢` : `${n} ¢`;
  return lang === 'en' ? `$${n}` : `${n} $`;
}

/** The running totals when you count the biggest first: 25, 50, 60, 65. */
export function countUp(ids: string[]): number[] {
  const sorted = [...ids].sort((a, b) => byId(b).value - byId(a).value);
  let t = 0;
  return sorted.map((id) => (t += byId(id).value));
}

export const total = (ids: string[]) => ids.reduce((s, id) => s + byId(id).value, 0);

/** A simple drawing of one coin or bill, centred on (x, y). */
export function moneySvg(id: string, x: number, y: number): string {
  const m = byId(id);
  if (m.kind === 'bill') {
    return `<g class="g3m-mc-bill g3m-mc-${id}"><rect x="${x - 34}" y="${y - 17}" width="68" height="34" rx="4"/><circle cx="${x - 18}" cy="${y}" r="9" class="g3m-mc-bill-mark"/><text x="${x + 10}" y="${y + 6}" text-anchor="middle">$${m.value}</text></g>`;
  }
  const r = { quarter: 21, dime: 15, nickel: 18, loonie: 22, toonie: 23 }[id] ?? 18;
  const label = m.value >= 25 || id === 'dime' || id === 'nickel' ? `${m.value}¢` : `$${m.value}`;
  if (id === 'loonie') {
    // The loonie has 11 sides.
    const pts = Array.from({ length: 11 }, (_, i) => {
      const a = (i / 11) * Math.PI * 2 - Math.PI / 2;
      return `${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`;
    }).join(' ');
    return `<g class="g3m-mc-coin g3m-mc-loonie"><polygon points="${pts}"/><text x="${x}" y="${y + 5}" text-anchor="middle">$1</text></g>`;
  }
  if (id === 'toonie') {
    return `<g class="g3m-mc-coin g3m-mc-toonie"><circle cx="${x}" cy="${y}" r="${r}"/><circle cx="${x}" cy="${y}" r="${r - 7}" class="g3m-mc-core"/><text x="${x}" y="${y + 5}" text-anchor="middle">$2</text></g>`;
  }
  return `<g class="g3m-mc-coin g3m-mc-${id}"><circle cx="${x}" cy="${y}" r="${r}"/><text x="${x}" y="${y + 5}" text-anchor="middle">${label}</text></g>`;
}
