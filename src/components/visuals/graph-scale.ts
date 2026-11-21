// Scale in graphs (MAT4-OI8-GQ1-LO1): the same data as a pictograph, a bar graph or a dot plot,
// where one symbol, dot or grid step stands for several things (many-to-one correspondence).

export type View = 'picto' | 'bar' | 'dot';

export interface GraphData {
  question: string;
  labels: string[];
  values: number[];
  /** What is counted, such as "votes". */
  unit: string;
}

/** Symbols needed for a value: whole symbols and the part of one more. 13 with a scale of 5 → 2 whole and 3/5. */
export function symbols(value: number, scale: number): { whole: number; part: number } {
  return { whole: Math.floor(value / scale), part: (value % scale) / scale };
}

/** A sentence about how well a scale fits the data. */
export function scaleAdvice(values: number[], scale: number, unit: string): string {
  const most = Math.max(...values.map((v) => Math.ceil(v / scale)));
  const parts = values.filter((v) => v % scale !== 0);
  const tricky = parts.filter((v) => (2 * v) % scale !== 0).length;
  const key = `Each symbol stands for ${scale} ${unit}.`;
  if (most > 15) return `${key} The longest row needs ${most} symbols, which is a lot to draw and count.`;
  if (most <= 3) return `${key} Every row is short, so the differences are hard to see.`;
  if (tricky) return `${key} ${tricky} row${tricky > 1 ? 's need' : ' needs'} part of a symbol that isn’t a half, which is hard to read.`;
  if (parts.length) return `${key} Some rows end in a half symbol. That still reads well.`;
  return `${key} Every row is a whole number of symbols, so this scale fits the data well.`;
}

/** Top of the bar graph axis: the first multiple of the scale at or above the largest value. */
export const axisTop = (values: number[], scale: number) => Math.max(scale, Math.ceil(Math.max(...values) / scale) * scale);

export function graphSvg(d: GraphData, view: View, scale: number, uid = 'g4m'): string {
  const n = d.labels.length;
  const W = 400;
  if (view === 'picto') {
    const row = 44;
    const x0 = 96;
    const size = 18;
    const gap = 3;
    let s = '';
    d.values.forEach((v, i) => {
      const y = 16 + i * row;
      s += `<text class="g4m-gs-lab" x="${x0 - 10}" y="${y + 18}" text-anchor="end">${d.labels[i]}</text>`;
      const { whole, part } = symbols(v, scale);
      const step = Math.min(size + gap, (W - x0 - 10) / Math.max(1, whole + 1));
      for (let k = 0; k < whole; k++) s += `<circle class="g4m-gs-sym" cx="${(x0 + k * step + size / 2).toFixed(1)}" cy="${y + 12}" r="${(Math.min(size, step - 1) / 2).toFixed(1)}"/>`;
      if (part) {
        const cx = x0 + whole * step + size / 2;
        const r = Math.min(size, step - 1) / 2;
        s += `<clipPath id="${uid}-c${i}"><rect x="${(cx - r).toFixed(1)}" y="${y}" width="${(2 * r * part).toFixed(1)}" height="${size + 6}"/></clipPath><circle class="g4m-gs-sym" clip-path="url(#${uid}-c${i})" cx="${cx.toFixed(1)}" cy="${y + 12}" r="${r.toFixed(1)}"/><circle class="g4m-gs-ghost" cx="${cx.toFixed(1)}" cy="${y + 12}" r="${r.toFixed(1)}"/>`;
      }
    });
    const ky = 16 + n * row + 12;
    s += `<circle class="g4m-gs-sym" cx="${x0 + 9}" cy="${ky}" r="9"/><text class="g4m-gs-key" x="${x0 + 26}" y="${ky + 5}">= ${scale} ${d.unit}</text>`;
    return `<svg viewBox="0 0 ${W} ${ky + 20}" class="g4m-gs-svg" role="img" aria-label="Pictograph: ${d.labels.map((l, i) => `${l} ${d.values[i]}`).join(', ')}. Each symbol stands for ${scale} ${d.unit}.">${s}</svg>`;
  }
  if (view === 'bar') {
    const top = axisTop(d.values, scale);
    const H = 200;
    const x0 = 44;
    const y0 = 220;
    const steps = top / scale;
    const every = steps > 12 ? 5 : 1;
    let s = '';
    for (let k = 0; k <= steps; k++) {
      const y = y0 - (k / steps) * H;
      s += `<line class="g4m-gs-grid" x1="${x0}" y1="${y.toFixed(1)}" x2="${W - 10}" y2="${y.toFixed(1)}"/>`;
      if (k % every === 0) s += `<text class="g4m-gs-tick" x="${x0 - 6}" y="${(y + 4).toFixed(1)}" text-anchor="end">${k * scale}</text>`;
    }
    const bw = (W - x0 - 20) / n;
    d.values.forEach((v, i) => {
      const h = (v / top) * H;
      const x = x0 + 10 + i * bw;
      s += `<rect class="g4m-gs-bar" x="${(x + bw * 0.15).toFixed(1)}" y="${(y0 - h).toFixed(1)}" width="${(bw * 0.7).toFixed(1)}" height="${h.toFixed(1)}"/><text class="g4m-gs-lab" x="${(x + bw / 2).toFixed(1)}" y="${y0 + 20}" text-anchor="middle">${d.labels[i]}</text>`;
    });
    s += `<line class="g4m-gs-axis" x1="${x0}" y1="${y0}" x2="${W - 10}" y2="${y0}"/><line class="g4m-gs-axis" x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 - H}"/>`;
    return `<svg viewBox="0 0 ${W} 250" class="g4m-gs-svg" role="img" aria-label="Bar graph: ${d.labels.map((l, i) => `${l} ${d.values[i]}`).join(', ')}. The scale goes up by ${scale}.">${s}</svg>`;
  }
  // Dot plot: a column of dots above each category, each dot standing for `scale` things.
  const x0 = 20;
  const y0 = 210;
  const cw = (W - 2 * x0) / n;
  const most = Math.max(...d.values.map((v) => Math.ceil(v / scale)));
  const r = Math.max(2.5, Math.min(9, 170 / most / 2 - 1));
  const step = 2 * r + 2;
  let s = `<line class="g4m-gs-axis" x1="${x0}" y1="${y0}" x2="${W - x0}" y2="${y0}"/>`;
  d.values.forEach((v, i) => {
    const cx = x0 + cw * (i + 0.5);
    const { whole, part } = symbols(v, scale);
    for (let k = 0; k < whole; k++) s += `<circle class="g4m-gs-sym" cx="${cx.toFixed(1)}" cy="${(y0 - r - 3 - k * step).toFixed(1)}" r="${r.toFixed(1)}"/>`;
    if (part) {
      const cy = y0 - r - 3 - whole * step;
      s += `<clipPath id="${uid}-d${i}"><rect x="${(cx - r).toFixed(1)}" y="${(cy - r).toFixed(1)}" width="${(2 * r * part).toFixed(1)}" height="${(2 * r).toFixed(1)}"/></clipPath><circle class="g4m-gs-sym" clip-path="url(#${uid}-d${i})" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}"/><circle class="g4m-gs-ghost" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}"/>`;
    }
    s += `<text class="g4m-gs-lab" x="${cx.toFixed(1)}" y="${y0 + 20}" text-anchor="middle">${d.labels[i]}</text>`;
  });
  s += `<circle class="g4m-gs-sym" cx="${x0 + 8}" cy="20" r="7"/><text class="g4m-gs-key" x="${x0 + 22}" y="25">= ${scale} ${d.unit}</text>`;
  return `<svg viewBox="0 0 ${W} 240" class="g4m-gs-svg" role="img" aria-label="Dot plot: ${d.labels.map((l, i) => `${l} ${d.values[i]}`).join(', ')}. Each dot stands for ${scale} ${d.unit}.">${s}</svg>`;
}
