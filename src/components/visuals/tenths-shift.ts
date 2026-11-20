// Place value from thousands to hundredths, as Grade 4 teaches it (MAT4-OI1-GQ1-LO1). A number is
// kept as a whole count of hundredths, so ×10 and ÷10 are exact: every digit moves one place.

export const PLACES = [
  { k: 3, name: 'thousands', value: '1 000' },
  { k: 2, name: 'hundreds', value: '100' },
  { k: 1, name: 'tens', value: '10' },
  { k: 0, name: 'ones', value: '1' },
  { k: -1, name: 'tenths', value: '0.1' },
  { k: -2, name: 'hundredths', value: '0.01' },
] as const;

/** Largest number the chart holds, in hundredths: 9 999.99. */
export const MAX_HUNDREDTHS = 999_999;

export interface PlaceNumber {
  /** The number as a count of hundredths: 352.7 → 35 270. */
  h: number;
  /** Decimal places to show (0, 1 or 2). */
  decimals: number;
}

/** "3 052.7" → { h: 305 270, decimals: 1 }. Null if the chart can't show it. */
export function parsePlace(raw: string): PlaceNumber | null {
  const m = /^(\d{1,4})(?:[.,](\d{0,2}))?$/.exec(raw.replace(/[\s  ]/g, ''));
  if (!m) return null;
  const dec = m[2] ?? '';
  return { h: Number(m[1]) * 100 + Number(dec.padEnd(2, '0')), decimals: dec.length };
}

/** Digit in place k (3 = thousands … -2 = hundredths). */
export const digitAt = (h: number, k: number) => Math.floor(h / 10 ** (k + 2)) % 10;

/** Fewest decimal places that show the number exactly, but at least `min`. */
export const neededDecimals = (h: number, min = 0) => Math.max(min, h % 100 === 0 ? 0 : h % 10 === 0 ? 1 : 2);

/** "3 052.7", grouped with a space. French uses a comma for the decimal point. */
export function formatPlace(n: PlaceNumber, sep: '.' | ',' = '.'): string {
  const whole = String(Math.floor(n.h / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  if (!n.decimals) return whole;
  return `${whole}${sep}${String(n.h % 100).padStart(2, '0').slice(0, n.decimals)}`;
}

/** Multiply by 10 (every digit one place left) or divide by 10 (one place right). Null if a digit would leave the chart. */
export function shift(n: PlaceNumber, dir: 'times' | 'divide'): PlaceNumber | null {
  if (dir === 'times') {
    if (n.h * 10 > MAX_HUNDREDTHS) return null;
    const h = n.h * 10;
    return { h, decimals: neededDecimals(h, Math.max(0, n.decimals - 1)) };
  }
  if (n.h % 10 !== 0) return null;
  const h = n.h / 10;
  return { h, decimals: Math.min(2, neededDecimals(h, n.decimals ? n.decimals + 1 : 0)) };
}

/** "The 7 is in the tenths place, so it is worth 7 tenths, or 0.7." */
export function digitText(n: PlaceNumber, k: number): string {
  const place = PLACES.find((p) => p.k === k)!;
  const d = digitAt(n.h, k);
  if (k >= 0) {
    const worth = (d * 10 ** k).toLocaleString('en-CA').replace(/,/g, ' ');
    return `The ${d} is in the ${place.name} place, so it is worth ${d} × ${place.value} = ${worth}.`;
  }
  const worth = k === -1 ? `0.${d}` : `0.0${d}`;
  const unit = d === 1 ? place.name.slice(0, -1) : place.name;
  return `The ${d} is in the ${place.name} place, so it is worth ${d} ${unit}, or ${worth}.`;
}
