// Equivalent fractions by splitting or joining equal parts (MAT4-OI1-GQ5-LO1, K1.1-K1.6).
// Splitting every part into k multiplies the numerator and denominator by k; joining groups of k
// parts divides both by a common factor k.

export const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/** Most equal parts the bar may show. */
export const MAX_PARTS = 24;

export const canSplit = (d: number, k: number) => d * k <= MAX_PARTS;
export const canJoin = (n: number, d: number, k: number) => k > 1 && n % k === 0 && d % k === 0;

export function splitText(n: number, d: number, k: number): string {
  return `Split every part into ${k}: ${n}/${d} = (${n} × ${k})/(${d} × ${k}) = ${n * k}/${d * k}.`;
}

export function joinText(n: number, d: number, k: number): string {
  return `Join every ${k} parts into one: ${n}/${d} = (${n} ÷ ${k})/(${d} ÷ ${k}) = ${n / k}/${d / k}.`;
}

/** "6/8 is not in simplest form: 6 and 8 share the factor 2." */
export function simplestText(n: number, d: number): string {
  const g = gcd(n, d);
  if (n === 0) return '0 parts are shaded.';
  if (g === 1) return `${n}/${d} is in simplest form. ${n} and ${d} have no common factor except 1.`;
  return `${n}/${d} is not in simplest form. ${n} and ${d} have the greatest common factor ${g}, so it simplifies to ${n / g}/${d / g}.`;
}

/** Bar and number line for a fraction n/d of one whole, as SVG markup. `ghost` draws the original bar above it. */
export function splitSvg(n: number, d: number, ghost?: [number, number]): string {
  const x0 = 20;
  const W = 600;
  const bar = (y: number, a: number, b: number, cls: string) => {
    let s = '';
    for (let i = 0; i < b; i++) s += `<rect class="${cls}${i < a ? ' is-on' : ''}" x="${(x0 + (i * W) / b).toFixed(2)}" y="${y}" width="${(W / b).toFixed(2)}" height="44"/>`;
    return s + `<rect class="g4m-fs-frame" x="${x0}" y="${y}" width="${W}" height="44"/>`;
  };
  let out = '';
  let y = 10;
  if (ghost) {
    out += bar(y, ghost[0], ghost[1], 'g4m-fs-cell g4m-fs-ghost');
    out += `<text class="g4m-fs-lab" x="${x0 + W + 10}" y="${y + 29}">${ghost[0]}/${ghost[1]}</text>`;
    y += 60;
  }
  out += bar(y, n, d, 'g4m-fs-cell');
  out += `<text class="g4m-fs-lab" x="${x0 + W + 10}" y="${y + 29}">${n}/${d}</text>`;
  const ly = y + 90;
  out += `<line class="g4m-fs-axis" x1="${x0}" y1="${ly}" x2="${x0 + W}" y2="${ly}"/>`;
  for (let i = 0; i <= d; i++) {
    const x = x0 + (i * W) / d;
    const end = i === 0 || i === d;
    out += `<line class="g4m-fs-tick" x1="${x.toFixed(2)}" y1="${ly - (end ? 12 : 8)}" x2="${x.toFixed(2)}" y2="${ly + (end ? 12 : 8)}"/>`;
  }
  out += `<text class="g4m-fs-num" x="${x0}" y="${ly + 34}" text-anchor="middle">0</text><text class="g4m-fs-num" x="${x0 + W}" y="${ly + 34}" text-anchor="middle">1</text>`;
  const px = x0 + (n / d) * W;
  out += `<line class="g4m-fs-drop" x1="${px.toFixed(2)}" y1="${y + 44}" x2="${px.toFixed(2)}" y2="${ly}"/><circle class="g4m-fs-dot" cx="${px.toFixed(2)}" cy="${ly}" r="8"/>`;
  return out;
}

/** Height of the drawing from splitSvg. */
export const splitHeight = (ghost: boolean) => (ghost ? 60 : 0) + 146;
