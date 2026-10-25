// Problem figures, drawn as SVG at build time from a short description in the content file.
import { fractionSvg } from '../components/visuals/fraction-svg.ts';

export type Figure =
  | string
  | { kind: 'fraction-bars'; n: number; d: number; wholes: number }
  | { kind: 'number-line'; n: number; d: number; wholes: number; label: string }
  | { kind: 'particle-boxes'; boxes: ('solid' | 'liquid' | 'gas')[] };

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

export function renderFigure(f: Figure): string {
  if (typeof f === 'string') return f;
  switch (f.kind) {
    case 'fraction-bars':
      return fractionSvg(f.n, f.d, f.wholes, { line: false, barLabels: false });
    case 'number-line':
      return fractionSvg(f.n, f.d, f.wholes, { bars: false, marker: { label: f.label } });
    case 'particle-boxes': {
      const gap = 30;
      const w = f.boxes.length * 150 + (f.boxes.length - 1) * gap;
      const body = f.boxes.map((s, i) => particleBox(s, i * (150 + gap), String.fromCharCode(65 + i), i * 97 + 13)).join('');
      return `<svg viewBox="-4 0 ${w + 8} 196" class="pb-svg" role="img" aria-label="Particle diagrams in boxes labelled ${f.boxes.map((_, i) => String.fromCharCode(65 + i)).join(', ')}.">${body}</svg>`;
    }
  }
}
