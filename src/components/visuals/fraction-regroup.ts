// Layout for the "group into wholes" animation. Every unit-fraction piece has two
// positions: loose (scattered in a tray) and grouped (snapped into whole bars). CSS
// transitions move pieces between them; this builds the markup for both build time
// and the browser.

const ROW_H = 54; // px per row
const LOOSE_COLS = 6;

export function regroupHtml(n: number, d: number): string {
  const pieceW = 84 / Math.max(d, 4); // % of the stage width, so wide pieces don't overflow
  const gap = 2.2;
  const looseRows = Math.ceil(n / LOOSE_COLS);
  const wholes = Math.floor(n / d);
  const rest = n % d;
  const groupedRows = wholes + (rest ? 1 : 0);
  const height = Math.max(looseRows, groupedRows) * ROW_H + 8;

  let pieces = '';
  for (let i = 0; i < n; i++) {
    const lx = (i % LOOSE_COLS) * (pieceW + gap) + (Math.floor(i / LOOSE_COLS) % 2 ? pieceW / 3 : 0);
    const ly = Math.floor(i / LOOSE_COLS) * ROW_H;
    const gx = (i % d) * pieceW;
    const gy = Math.floor(i / d) * ROW_H;
    pieces += `<span class="rg-piece" style="--lx:${lx.toFixed(2)}%;--ly:${ly}px;--gx:${gx.toFixed(2)}%;--gy:${gy}px;--w:${pieceW.toFixed(2)}%;--i:${i}"><span class="rg-frac"><span>1</span><span>${d}</span></span></span>`;
  }
  let outlines = '';
  for (let r = 0; r < groupedRows; r++) {
    const full = r < wholes;
    outlines += `<span class="rg-outline" style="--gy:${r * ROW_H}px;--w:${(pieceW * d).toFixed(2)}%"></span>`;
    outlines += `<span class="rg-label${full ? '' : ' rg-label--rest'}" style="--gy:${r * ROW_H}px;--x:${(pieceW * d + 1.5).toFixed(2)}%">${full ? '1 whole' : `${rest}/${d}`}</span>`;
  }
  return `<div class="rg-stage" style="height:${height}px">${outlines}${pieces}</div>`;
}

export function equationHtml(n: number, d: number): string {
  const wholes = Math.floor(n / d);
  const rest = n % d;
  const mixed =
    (wholes ? `<span class="rg-whole">${wholes}</span>` : '') + (rest ? `<span class="frac"><span>${rest}</span><span>${d}</span></span>` : '');
  return `<span class="frac"><span>${n}</span><span>${d}</span></span><span class="rg-eq">=</span>${mixed || '<span class="rg-whole">0</span>'}`;
}
