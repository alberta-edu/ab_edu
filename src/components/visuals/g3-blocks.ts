// Base-ten blocks for adding and subtracting within 1000 (MAT3-OI1-GQ2-LO1: K1.2, S1.2, S1.3).
// Each frame is one small move: count a place, trade 10 for 1, or break 1 into 10.

/** a: first number, b: second number, n: made by a trade, x: about to go (traded or taken away). */
export type Tone = 'a' | 'b' | 'n' | 'x';
export interface Frame {
  cols: [Tone[], Tone[], Tone[]]; // hundreds, tens, ones
  focus: 0 | 1 | 2 | -1;
  say: string;
}

const PL = ['hundreds', 'tens', 'ones'];
const ONE = ['hundred', 'ten', 'one'];
const digits = (n: number) => [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10];
const fill = (k: number, t: Tone) => Array<Tone>(k).fill(t);
const clone = (c: Frame['cols']): Frame['cols'] => [[...c[0]], [...c[1]], [...c[2]]];
const live = (col: Tone[]) => col.filter((t) => t !== 'x');

export function addFrames(a: number, b: number): Frame[] {
  const da = digits(a);
  const db = digits(b);
  let cols: Frame['cols'] = [0, 1, 2].map((i) => [...fill(da[i], 'a'), ...fill(db[i], 'b')]) as Frame['cols'];
  const out: Frame[] = [{ cols: clone(cols), focus: -1, say: `${a} + ${b}. Start with the ones.` }];
  for (let i = 2; i >= 0; i--) {
    const k = cols[i].length;
    out.push({ cols: clone(cols), focus: i as 0 | 1 | 2, say: `${cap(PL[i])}: ${k} ${k === 1 ? ONE[i] : PL[i]}.${k > 9 && i > 0 ? ' That is more than 9!' : ''}` });
    if (k > 9 && i > 0) {
      const traded = clone(cols);
      traded[i] = [...cols[i].slice(0, k - 10), ...fill(10, 'x')];
      traded[i - 1] = [...cols[i - 1], 'n'];
      out.push({ cols: traded, focus: i as 0 | 1 | 2, say: `Trade 10 ${PL[i]} for 1 ${ONE[i - 1]}. ${k - 10} ${k - 10 === 1 ? ONE[i] : PL[i]} stay.` });
      cols = clone(traded);
      cols[i] = live(cols[i]);
    }
  }
  out.push({ cols: clone(cols), focus: -1, say: `${a} + ${b} = ${a + b}` });
  return out;
}

export function subtractFrames(a: number, b: number): Frame[] {
  const db = digits(b);
  let cols: Frame['cols'] = digits(a).map((d) => fill(d, 'a')) as Frame['cols'];
  const out: Frame[] = [{ cols: clone(cols), focus: -1, say: `${a} − ${b}. Start with the ones.` }];
  for (let i = 2; i >= 0; i--) {
    if (db[i] > cols[i].length) {
      // Not enough: break one from the next place. If that place is empty, break from further left first.
      let j = i - 1;
      while (j > 0 && cols[j].length === 0) j--;
      for (let p = j; p < i; p++) {
        const broke = clone(cols);
        broke[p] = broke[p].slice(0, -1);
        broke[p + 1] = [...broke[p + 1], ...fill(10, 'n')];
        out.push({ cols: broke, focus: (p + 1) as 0 | 1 | 2, say: `Not enough ${PL[i]}. Break 1 ${ONE[p]} into 10 ${PL[p + 1]}.` });
        cols = broke;
      }
    }
    const k = cols[i].length;
    const gone = clone(cols);
    gone[i] = [...cols[i].slice(0, k - db[i]), ...fill(db[i], 'x')];
    out.push({ cols: gone, focus: i as 0 | 1 | 2, say: `${cap(PL[i])}: ${k} take away ${db[i]} leaves ${k - db[i]}.` });
    cols = clone(gone);
    cols[i] = live(cols[i]);
  }
  out.push({ cols: clone(cols), focus: -1, say: `${a} − ${b} = ${a - b}` });
  return out;
}

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/** The number the blocks show, not counting blocks that are leaving. */
export const value = (f: Frame) => live(f.cols[0]).length * 100 + live(f.cols[1]).length * 10 + live(f.cols[2]).length;

/** Draw the place mat: flats, rods and cubes in three columns. */
export function matSvg(f: Frame): string {
  const W = 360;
  const colW = 120;
  let s = '';
  for (let i = 0; i < 3; i++) {
    const x0 = i * colW;
    s += `<rect class="g3m-bk-col${f.focus === i ? ' is-focus' : ''}" x="${x0 + 3}" y="3" width="${colW - 6}" height="234" rx="10"/>`;
    s += `<text class="g3m-bk-name" x="${x0 + colW / 2}" y="24" text-anchor="middle">${PL[i]}</text>`;
    f.cols[i].forEach((t, k) => {
      if (i === 0) {
        const x = x0 + 8 + (k % 3) * 36;
        const y = 34 + Math.floor(k / 3) * 36;
        s += `<g class="g3m-bk-blk g3m-bk-${t}"><rect x="${x}" y="${y}" width="32" height="32" rx="2"/><path d="${grid(x, y, 32)}"/></g>`;
      } else if (i === 1) {
        const x = x0 + 7 + (k % 11) * 10;
        const y = 34 + Math.floor(k / 11) * 70;
        s += `<g class="g3m-bk-blk g3m-bk-${t}"><rect x="${x}" y="${y}" width="8" height="64" rx="1.5"/><path d="${rungs(x, y)}"/></g>`;
      } else {
        const x = x0 + 9 + (k % 5) * 21;
        const y = 34 + Math.floor(k / 5) * 21;
        s += `<g class="g3m-bk-blk g3m-bk-${t}"><rect x="${x}" y="${y}" width="17" height="17" rx="2.5"/></g>`;
      }
    });
    s += `<text class="g3m-bk-count" x="${x0 + colW / 2}" y="230" text-anchor="middle">${live(f.cols[i]).length}</text>`;
  }
  return `<svg viewBox="0 0 ${W} 240" role="img" aria-label="${f.say}">${s}</svg>`;
}

function grid(x: number, y: number, size: number) {
  let d = '';
  for (let k = 1; k < 10; k++) {
    const p = (k * size) / 10;
    d += `M${x + p} ${y}v${size}M${x} ${y + p}h${size}`;
  }
  return d;
}

function rungs(x: number, y: number) {
  let d = '';
  for (let k = 1; k < 10; k++) d += `M${x} ${y + k * 6.4}h8`;
  return d;
}
