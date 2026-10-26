// Layout for adding and subtracting fractions with common denominators, piece by piece.
// Every piece is a unit fraction (1/d). Pieces have a "start" and an "end" position; CSS
// transitions move them, so the change in the count of unit fractions is something you
// can watch (MAT5 h9k9LsDzCEGrqR92bPiBog: K1.1, K1.2, S1.1, S1.2).

export interface FracExample {
  op: '+' | '-';
  /** "3/8", "2 3/4" or "7/5". */
  a: string;
  b: string;
}

/** "2 3/4" → { n: 11, d: 4 } */
export function parseFrac(s: string): { n: number; d: number } {
  const m = /^(?:(\d+) )?(\d+)\/(\d+)$/.exec(s.trim());
  if (!m) throw new Error(`Bad fraction ${s}`);
  const d = Number(m[3]);
  return { n: Number(m[1] ?? 0) * d + Number(m[2]), d };
}

const ROW_H = 54;

export function fracAddHtml(ex: FracExample): string {
  const A = parseFrac(ex.a);
  const B = parseFrac(ex.b);
  if (A.d !== B.d) throw new Error('Denominators must match');
  const d = A.d;
  const pieceW = 84 / Math.max(d, 4);
  const total = ex.op === '+' ? A.n + B.n : A.n;
  const rows = Math.max(1, Math.ceil(total / d)) + (ex.op === '+' ? Math.ceil(B.n / d) : 0);
  const height = rows * ROW_H + 8;
  const barRows = Math.max(1, Math.ceil(total / d));
  let html = '';
  for (let r = 0; r < barRows; r++) {
    html += `<span class="fa-outline" style="--y:${r * ROW_H}px;--w:${(pieceW * d).toFixed(2)}%"></span>`;
  }
  const pos = (i: number) => ({ x: (i % d) * pieceW, y: Math.floor(i / d) * ROW_H });
  for (let i = 0; i < A.n; i++) {
    const p = pos(i);
    const leaving = ex.op === '-' && i >= A.n - B.n;
    // A taken-away piece lifts up and out of the bar.
    const end = leaving ? { x: p.x, y: -ROW_H * 0.9 } : p;
    html += `<span class="fa-piece fa-a${leaving ? ' fa-leave' : ''}" style="--x0:${p.x.toFixed(2)}%;--y0:${p.y}px;--x1:${end.x.toFixed(2)}%;--y1:${end.y}px;--w:${pieceW.toFixed(2)}%;--i:${leaving ? A.n - 1 - i : 0}"><span class="rg-frac"><span>1</span><span>${d}</span></span></span>`;
  }
  if (ex.op === '+') {
    // B pieces wait in a tray under the bars, then slide into the next empty places.
    for (let i = 0; i < B.n; i++) {
      const start = { x: (i % d) * pieceW, y: (barRows + Math.floor(i / d)) * ROW_H + 10 };
      const end = pos(A.n + i);
      html += `<span class="fa-piece fa-b" style="--x0:${start.x.toFixed(2)}%;--y0:${start.y}px;--x1:${end.x.toFixed(2)}%;--y1:${end.y}px;--w:${pieceW.toFixed(2)}%;--i:${i}"><span class="rg-frac"><span>1</span><span>${d}</span></span></span>`;
    }
  }
  // Before: bars plus the tray of pieces to add. After: just the bars.
  return `<div class="fa-stage" style="--h0:${height}px;--h1:${barRows * ROW_H + 8}px">${html}</div>`;
}

const unitName = (d: number) => ({ 2: 'halves', 3: 'thirds', 4: 'fourths', 5: 'fifths', 6: 'sixths', 8: 'eighths', 10: 'tenths', 12: 'twelfths' })[d] ?? `pieces of size 1/${d}`;

export function fracText(ex: FracExample, done: boolean) {
  const A = parseFrac(ex.a);
  const B = parseFrac(ex.b);
  const u = unitName(A.d);
  const r = ex.op === '+' ? A.n + B.n : A.n - B.n;
  if (!done)
    return ex.op === '+'
      ? `${A.n} ${u} and ${B.n} ${u}. Press Combine to put them together.`
      : `${A.n} ${u}. Press Take away to remove ${B.n} of them.`;
  const w = Math.floor(r / A.d);
  const rest = r % A.d;
  const mixed = w && r >= A.d ? ` That is ${w}${rest ? ` and ${rest}/${A.d}` : ''}.` : '';
  return `${A.n} ${u} ${ex.op === '+' ? '+' : '−'} ${B.n} ${u} = ${r} ${u}. The pieces are still ${u}: only the count changed.${mixed}`;
}
