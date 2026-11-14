// Words for a shaded part of a hundred grid: tenths and hundredths, and the decimal.

/** 35 → { decimal: '0.35', say: '35 hundredths = 3 tenths and 5 hundredths' }. */
export function hundredthsText(n: number): { decimal: string; say: string } {
  if (n === 100) return { decimal: '1.00', say: '100 hundredths make 1 whole.' };
  const decimal = `0.${String(n).padStart(2, '0')}`;
  const t = Math.floor(n / 10);
  const h = n % 10;
  const unit = (k: number, name: string) => `${k} ${name}${k === 1 ? '' : 's'}`;
  if (n === 0) return { decimal, say: 'Nothing is shaded yet.' };
  if (h === 0) return { decimal, say: `${unit(n, 'hundredth')} = ${unit(t, 'tenth')}, so ${n}/100 = ${t}/10.` };
  if (t === 0) return { decimal, say: `${unit(n, 'hundredth')}.` };
  return { decimal, say: `${unit(n, 'hundredth')} = ${unit(t, 'tenth')} and ${unit(h, 'hundredth')}.` };
}
