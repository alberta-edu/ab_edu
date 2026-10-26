// Layout for the "group into wholes" animation. Every unit-fraction piece has two
// positions: loose (scattered in a tray) and grouped (snapped into whole bars). CSS
// transitions move pieces between them; this builds the markup for both build time
// and the browser.

const ROW_H = 54; // px per row

export function regroupHtml(n: number, d: number): string {
  const pieceW = 72 / Math.max(d, 4); // % of the stage width; leaves room for the "1 whole" labels
  const gap = 2.2;
  // As many loose pieces per row as fit (rows are staggered by a third of a piece).
  const looseCols = Math.max(2, Math.floor((100 - pieceW / 3) / (pieceW + gap)));
  const looseRows = Math.ceil(n / looseCols);
  const wholes = Math.floor(n / d);
  const rest = n % d;
  const groupedRows = wholes + (rest ? 1 : 0);
  const height = Math.max(looseRows, groupedRows) * ROW_H + 8;

  let pieces = '';
  for (let i = 0; i < n; i++) {
    const lx = (i % looseCols) * (pieceW + gap) + (Math.floor(i / looseCols) % 2 ? pieceW / 3 : 0);
    const ly = Math.floor(i / looseCols) * ROW_H;
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
