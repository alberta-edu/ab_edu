// Data and graphs (MAT3-OI8-GQ1-LO1): answer a statistical question by collecting data, then show it
// in a dot plot or a bar graph with one-to-one correspondence (one dot, or one square of a bar,
// for each thing counted). The SVG uses inline styles so problem figures can use it too.

export interface Cat {
  label: string;
  icon?: string;
}

export interface GraphSpec {
  /** The graph's title, which names the question, the time and the place. */
  title: string;
  /** Label for the categories along the bottom. */
  axis: string;
  /** Label for the count up the side of a bar graph, like "Number of kids". */
  count: string;
  cats: Cat[];
  data: number[];
}

export type View = 'dots' | 'bars';

const U = 18;
const COL = 84;
const LEFT = 52;
const TOP = 44;
const BOTTOM = 62;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const name = (c: Cat) => (c.icon ? `${c.icon} ${c.label}` : c.label);

/** The top of the count scale: the biggest count, but at least 5. */
export const top = (data: number[]) => Math.max(5, ...data);

/** Index of the biggest count, or -1 if there is a tie for the biggest. */
export function most(data: number[]) {
  const m = Math.max(...data);
  return data.filter((d) => d === m).length === 1 ? data.indexOf(m) : -1;
}

/** Index of the smallest count, or -1 if there is a tie. */
export function fewest(data: number[]) {
  const m = Math.min(...data);
  return data.filter((d) => d === m).length === 1 ? data.indexOf(m) : -1;
}

export const total = (data: number[]) => data.reduce((a, b) => a + b, 0);

/** The order the votes come in: every answer once, mixed up the same way each time. */
export function voteOrder(data: number[]) {
  const out: number[] = [];
  data.forEach((n, i) => {
    for (let k = 0; k < n; k++) out.push(i);
  });
  let seed = 7;
  for (let i = out.length - 1; i > 0; i--) {
    seed = (seed * 31 + 11) % 97;
    const j = seed % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** What the graph's story is: which is most and fewest. */
export function storySay(spec: GraphSpec, shown = spec.data) {
  const m = most(shown);
  const f = fewest(shown);
  const parts: string[] = [];
  if (m >= 0) parts.push(`Most: ${name(spec.cats[m])}, ${shown[m]}.`);
  else parts.push('There is a tie for the most.');
  if (f >= 0) parts.push(`Fewest: ${name(spec.cats[f])}, ${shown[f]}.`);
  return parts.join(' ');
}

export function graphSize(spec: GraphSpec, view: View) {
  const w = (view === 'bars' ? LEFT : 16) + spec.cats.length * COL + 12;
  const h = TOP + top(spec.data) * U + BOTTOM + 8;
  return { w, h };
}

/** A dot plot or a bar graph, with a title and labels. `shown` draws only some of the data so far. */
export function graphSvg(spec: GraphSpec, view: View, shown: number[] = spec.data, hi = -1) {
  const { w, h } = graphSize(spec, view);
  const max = top(spec.data);
  const x0 = view === 'bars' ? LEFT : 16;
  const base = TOP + max * U;
  const p: string[] = [];
  const ink = 'fill:var(--ink);font-family:var(--font)';
  p.push(`<text x="${w / 2}" y="22" text-anchor="middle" style="${ink};font-size:16px;font-weight:700">${esc(spec.title)}</text>`);
  if (view === 'bars') {
    for (let v = 0; v <= max; v++) {
      const y = base - v * U;
      p.push(`<line x1="${x0}" y1="${y}" x2="${w - 8}" y2="${y}" style="stroke:var(--line-strong);stroke-width:${v === 0 ? 0 : 1}"/>`);
      if (max <= 12 || v % 2 === 0) p.push(`<text x="${x0 - 7}" y="${y}" text-anchor="end" dominant-baseline="central" style="${ink};font-size:12px">${v}</text>`);
    }
    p.push(`<line x1="${x0}" y1="${TOP - 6}" x2="${x0}" y2="${base}" style="stroke:var(--ink);stroke-width:2"/>`);
    const my = (TOP + base) / 2;
    p.push(`<text x="14" y="${my}" text-anchor="middle" transform="rotate(-90 14 ${my})" style="${ink};font-size:13px;font-weight:600">${esc(spec.count)}</text>`);
  }
  p.push(`<line x1="${x0}" y1="${base}" x2="${w - 8}" y2="${base}" style="stroke:var(--ink);stroke-width:2"/>`);
  spec.cats.forEach((c, i) => {
    const cx = x0 + COL * i + COL / 2;
    const n = shown[i] ?? 0;
    const on = i === hi;
    const fill = on ? 'var(--sun)' : 'var(--accent)';
    const g: string[] = [];
    if (view === 'dots') {
      for (let k = 0; k < n; k++) g.push(`<circle cx="${cx}" cy="${base - U / 2 - k * U}" r="7" style="fill:${fill}"/>`);
    } else if (n > 0) {
      g.push(`<rect x="${cx - 22}" y="${base - n * U}" width="44" height="${n * U}" rx="3" style="fill:${fill}"/>`);
    }
    g.push(`<rect x="${cx - COL / 2}" y="${TOP - 10}" width="${COL}" height="${base - TOP + 40}" style="fill:transparent"/>`);
    g.push(`<text x="${cx}" y="${base + 20}" text-anchor="middle" style="${ink};font-size:13px;font-weight:${on ? 700 : 600}">${esc(name(c))}</text>`);
    p.push(`<g data-cat="${i}">${g.join('')}</g>`);
  });
  p.push(`<text x="${x0 + (w - 8 - x0) / 2}" y="${base + 46}" text-anchor="middle" style="${ink};font-size:13px;font-weight:600">${esc(spec.axis)}</text>`);
  const label = `${view === 'dots' ? 'Dot plot' : 'Bar graph'}: ${spec.title}. ${spec.cats.map((c, i) => `${c.label} ${shown[i] ?? 0}`).join(', ')}.`;
  return `<svg viewBox="0 0 ${w} ${h}" class="fig-svg" role="img" aria-label="${esc(label)}">${p.join('')}</svg>`;
}

export interface Pic {
  icon: string;
  label: string;
}

/** A pretend winter count for a class, one picture for each year, spiralling out from the centre. */
export function spiral(n: number, r0 = 22, gap = 30) {
  const pts: [number, number][] = [];
  let a = 0;
  for (let i = 0; i < n; i++) {
    const r = r0 + (gap * a) / (2 * Math.PI);
    pts.push([r * Math.cos(a), r * Math.sin(a)]);
    a += (gap * 1.15) / r;
  }
  return pts;
}
