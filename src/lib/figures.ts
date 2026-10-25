// Problem figures, drawn as SVG at build time from a short description in the content file.
import { fractionSvg } from '../components/visuals/fraction-svg.ts';
import { gridSvg } from '../components/visuals/coord-grid.ts';
import { SHAPES } from '../components/visuals/symmetry.ts';

export type Figure =
  | string
  | { kind: 'fraction-bars'; n: number; d: number; wholes: number }
  | { kind: 'number-line'; n: number; d: number; wholes: number; label: string }
  | { kind: 'particle-boxes'; boxes: ('solid' | 'liquid' | 'gas')[]; labels?: string[] }
  | { kind: 'area-model'; a: number; b: number }
  | { kind: 'coord-grid'; size: number; points?: { x: number; y: number; label?: string }[]; polygon?: [number, number][] }
  | { kind: 'rect'; w: number; h: number; unit: string }
  | { kind: 'shape'; shape: string; lines?: boolean }
  | { kind: 'square-metre' };

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

/** A rectangle with its side lengths labelled. Drawn to a comfortable size, not to scale. */
function rectFigure(w: number, h: number, unit: string): string {
  const ratio = Math.max(0.25, Math.min(1, h / w));
  const W = 300;
  const H = Math.round(W * ratio);
  return `<svg viewBox="-70 -20 ${W + 130} ${H + 70}" class="fig-svg" role="img" aria-label="A rectangle ${w} ${unit} long and ${h} ${unit} wide."><rect class="fig-rect" x="0" y="0" width="${W}" height="${H}" rx="3"/><text class="fig-label" x="${W / 2}" y="${H + 32}" text-anchor="middle">${w} ${unit}</text><text class="fig-label" x="-12" y="${H / 2 + 6}" text-anchor="end">${h} ${unit}</text></svg>`;
}

/** A shape from the symmetry explorer, optionally with its lines of symmetry. */
function shapeFigure(id: string, lines = false): string {
  const sh = SHAPES.find((x) => x.id === id);
  if (!sh) throw new Error(`Unknown shape ${id}`);
  let extra = '';
  if (lines && sh.lines !== 'circle')
    for (const deg of sh.lines) {
      const r = (deg * Math.PI) / 180;
      const x = Math.cos(r) * 125;
      const y = Math.sin(r) * 125;
      extra += `<line class="sy-line" x1="${(-x).toFixed(1)}" y1="${(-y).toFixed(1)}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`;
    }
  return `<svg viewBox="-135 -135 270 270" class="fig-svg fig-svg--square" role="img" aria-label="${sh.name}"><path class="sy-shape" d="${sh.d}"/>${extra}</svg>`;
}

/** 1 m² drawn as a 10 × 10 grid of 10 cm squares, with one 10 cm square zoomed to show 1 cm². */
function squareMetre(): string {
  let grid = '';
  for (let i = 1; i < 10; i++) grid += `<line class="fig-grid" x1="${i * 20}" y1="0" x2="${i * 20}" y2="200"/><line class="fig-grid" x1="0" y1="${i * 20}" x2="200" y2="${i * 20}"/>`;
  let zoom = '';
  for (let i = 1; i < 10; i++) zoom += `<line class="fig-grid" x1="${270 + i * 12}" y1="40" x2="${270 + i * 12}" y2="160"/><line class="fig-grid" x1="270" y1="${40 + i * 12}" x2="390" y2="${40 + i * 12}"/>`;
  return `<svg viewBox="-40 -30 460 270" class="fig-svg" role="img" aria-label="A square metre is 100 centimetres by 100 centimetres, which is 10 000 square centimetres."><rect class="fig-rect" x="0" y="0" width="200" height="200"/>${grid}<rect class="fig-hl" x="0" y="0" width="20" height="20"/><text class="fig-label" x="100" y="225" text-anchor="middle">1 m = 100 cm</text><text class="fig-label" x="-14" y="100" text-anchor="middle" transform="rotate(-90 -14 100)">1 m = 100 cm</text><path class="fig-arrow" d="M22 10 C 120 -20, 220 10, 266 40"/><rect class="fig-rect" x="270" y="40" width="120" height="120"/>${zoom}<rect class="fig-hl" x="270" y="40" width="12" height="12"/><text class="fig-label" x="330" y="185" text-anchor="middle">10 cm × 10 cm</text><text class="fig-small" x="330" y="205" text-anchor="middle">each small square is 1 cm²</text></svg>`;
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
    case 'coord-grid':
      return gridSvg(f.size, f.points ?? [], f.polygon ?? []);
    case 'rect':
      return rectFigure(f.w, f.h, f.unit);
    case 'shape':
      return shapeFigure(f.shape, f.lines);
    case 'square-metre':
      return squareMetre();
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
