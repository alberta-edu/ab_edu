// Problem figures, drawn as SVG at build time from a short description in the content file.
import { fractionSvg } from '../components/visuals/fraction-svg.ts';

export type Figure =
  | string
  | { kind: 'fraction-bars'; n: number; d: number; wholes: number }
  | { kind: 'number-line'; n: number; d: number; wholes: number; label: string }
  | { kind: 'particle-boxes'; boxes: ('solid' | 'liquid' | 'gas')[]; labels?: string[] }
  | { kind: 'area-model'; a: number; b: number };

/** Small deterministic random generator so figures are identical on every build. */
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

function particleBox(state: 'solid' | 'liquid' | 'gas', x0: number, label: string, seed: number): string {
  const size = 150;
  const r = 7;
  const rand = rng(seed);
  const pts: [number, number][] = [];
  if (state === 'solid') {
    for (let row = 0; row < 5; row++) for (let col = 0; col < 6; col++) pts.push([30 + col * 18 + (row % 2) * 9, size - 14 - row * 16]);
  } else if (state === 'liquid') {
    // Close together but jumbled, filling the bottom of the box.
    let tries = 0;
    while (pts.length < 26 && tries++ < 4000) {
      const p: [number, number] = [14 + rand() * (size - 28), size - 14 - rand() * 62];
      if (pts.every(([a, b]) => Math.hypot(a - p[0], b - p[1]) > 2 * r + 1)) pts.push(p);
    }
  } else {
    let tries = 0;
    while (pts.length < 9 && tries++ < 4000) {
      const p: [number, number] = [16 + rand() * (size - 32), 16 + rand() * (size - 32)];
      if (pts.every(([a, b]) => Math.hypot(a - p[0], b - p[1]) > 34)) pts.push(p);
    }
  }
  const dots = pts.map(([x, y]) => `<circle cx="${(x0 + x).toFixed(1)}" cy="${(y + 10).toFixed(1)}" r="${r}" class="pb-dot"/>`).join('');
  return `<rect x="${x0}" y="10" width="${size}" height="${size}" rx="8" class="pb-box"/>${dots}<text x="${x0 + size / 2}" y="${size + 36}" text-anchor="middle" class="pb-label">${label}</text>`;
}

/** Splits a number into place-value parts: 347 → [300, 40, 7]. Zero parts are dropped. */
const placeParts = (n: number) =>
  [...String(n)].map((d, i, all) => Number(d) * 10 ** (all.length - 1 - i)).filter((v) => v > 0);

/** Area model for a × b: a rectangle split by place value, each piece labelled with its partial product. */
function areaModel(a: number, b: number): string {
  const cols = placeParts(a);
  const rows = placeParts(b);
  const W = 560;
  const H = 70 + rows.length * 64;
  const x0 = 70;
  const y0 = 46;
  // widths roughly proportional to the parts, but never too thin to label
  const weight = (v: number) => Math.max(Math.sqrt(v), 4);
  const totalW = cols.reduce((t, v) => t + weight(v), 0);
  let x = x0;
  let out = '';
  cols.forEach((cv) => {
    const w = ((W - x0 - 10) * weight(cv)) / totalW;
    out += `<text class="am-edge" x="${x + w / 2}" y="${y0 - 14}" text-anchor="middle">${cv}</text>`;
    let y = y0;
    rows.forEach((rv, ri) => {
      const h = 64;
      out += `<rect class="am-cell am-cell--${ri}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
      out += `<text class="am-prod" x="${x + w / 2}" y="${y + h / 2 + 6}" text-anchor="middle">${(cv * rv).toLocaleString('en-CA').replace(/,/g, ' ')}</text>`;
      if (cv === cols[0]) out += `<text class="am-edge" x="${x0 - 12}" y="${y + h / 2 + 6}" text-anchor="end">${rv}</text>`;
      y += h;
    });
    x += w;
  });
  return `<svg viewBox="0 0 ${W} ${H}" class="am-svg" role="img" aria-label="Area model for ${a} times ${b}: ${cols.join(' + ')} across and ${rows.join(' + ')} down.">${out}</svg>`;
}

export function renderFigure(f: Figure): string {
  if (typeof f === 'string') return f;
  switch (f.kind) {
    case 'fraction-bars':
      return fractionSvg(f.n, f.d, f.wholes, { line: false, barLabels: false });
    case 'number-line':
      return fractionSvg(f.n, f.d, f.wholes, { bars: false, marker: { label: f.label } });
    case 'area-model':
      return areaModel(f.a, f.b);
    case 'particle-boxes': {
      const gap = 30;
      const w = f.boxes.length * 150 + (f.boxes.length - 1) * gap;
      // Several boxes are lettered A, B, C… for questions; a single box needs no label.
      const label = (i: number) => f.labels?.[i] ?? (f.boxes.length > 1 ? String.fromCharCode(65 + i) : '');
      const body = f.boxes.map((s, i) => particleBox(s, i * (150 + gap), label(i), i * 97 + 13)).join('');
      const h = f.boxes.some((_, i) => label(i)) ? 196 : 168;
      const desc = f.boxes.length > 1 ? `boxes labelled ${f.boxes.map((_, i) => label(i)).join(', ')}` : `a box showing a ${f.boxes[0]}`;
      return `<svg viewBox="-4 0 ${w + 8} ${h}" class="pb-svg" role="img" aria-label="Particle diagram: ${desc}.">${body}</svg>`;
    }
  }
}
