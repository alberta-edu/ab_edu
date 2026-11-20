// Grade 3 multiplication and division within 100 (MAT3-OI1-GQ3-LO1): equal groups, arrays and
// areas; sharing, grouping and repeated subtraction, with what is left over; and splitting an
// array in two to multiply in parts. Pure functions, so the sentences can be tested.

/** "4 + 4 + 4 = 12", or "0" when there are no groups. */
export function repeatedAdd(groups: number, size: number): string {
  if (groups === 0) return '0';
  if (groups === 1) return `${size} = ${size}`;
  return `${Array(groups).fill(size).join(' + ')} = ${groups * size}`;
}

/** Skip counting: "4, 8, 12". */
export const skipCount = (groups: number, size: number) =>
  Array.from({ length: groups }, (_, i) => (i + 1) * size).join(', ');

/** What a groups picture says, with the special cases of 0 and 1. */
export function groupsSay(groups: number, size: number): string {
  const p = groups * size;
  if (size === 0) return `${groups} group${groups === 1 ? '' : 's'} of 0 is still 0. ${groups} × 0 = 0`;
  if (size === 1) return `${groups} group${groups === 1 ? '' : 's'} of 1 is just ${groups}. ${groups} × 1 = ${groups}`;
  if (groups === 1) return `1 group of ${size} is just ${size}. 1 × ${size} = ${size}`;
  return `${groups} groups of ${size}: ${skipCount(groups, size)}. ${groups} × ${size} = ${p}`;
}

/** Deal `total` things one at a time into `groups` groups. Returns each group's count after each round. */
export function share(total: number, groups: number) {
  const each = Math.floor(total / groups);
  const left = total % groups;
  return { each, left, rounds: each };
}

export function shareSay(total: number, groups: number): string {
  const { each, left } = share(total, groups);
  if (groups === 1) return `Shared by 1, one group gets all ${total}. ${total} ÷ 1 = ${total}`;
  if (left === 0) return `Each of the ${groups} groups gets ${each}. ${total} ÷ ${groups} = ${each}`;
  return `Each of the ${groups} groups gets ${each}, and ${left} ${left === 1 ? 'is' : 'are'} left over. ${left} is not enough for another round.`;
}

export function groupSay(total: number, size: number): string {
  const n = Math.floor(total / size);
  const left = total % size;
  if (left === 0) return `${total} makes ${n} group${n === 1 ? '' : 's'} of ${size}. ${total} ÷ ${size} = ${n}`;
  return `${total} makes ${n} group${n === 1 ? '' : 's'} of ${size}, and ${left} ${left === 1 ? 'is' : 'are'} left over. ${left} is not enough for another group.`;
}

/** Repeated subtraction: "12 − 4 − 4 − 4 = 0". */
export function takeAwaySay(total: number, size: number): string {
  const n = Math.floor(total / size);
  const left = total % size;
  const chain = `${total}` + ` − ${size}`.repeat(n);
  const end = `${chain} = ${left}`;
  return left === 0
    ? `${end}. That is ${n} jumps, so ${total} ÷ ${size} = ${n}`
    : `${end}. That is ${n} jumps, with ${left} left over.`;
}

/** Multiplying in parts: "7 × 8 = 7 × 5 + 7 × 3 = 35 + 21 = 56". */
export function splitSay(rows: number, cols: number, k: number): string {
  return `${rows} × ${cols} = ${rows} × ${k} + ${rows} × ${cols - k} = ${rows * k} + ${rows * (cols - k)} = ${rows * cols}`;
}

const dot = (x: number, y: number, cls: string, r = 7) => `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}"/>`;

/** Plates in rows of 5, each with its dots in rows of 5. */
export function groupsSvg(groups: number, size: number, filled: number[] = Array(groups).fill(size), pile = 0): string {
  const perRow = 5;
  const R = 32;
  const W = 360;
  const top = pile ? 16 + Math.ceil(pile / 15) * 18 : 0;
  let s = '';
  for (let p = 0; p < pile; p++) s += dot(14 + (p % 15) * 22, 14 + Math.floor(p / 15) * 18, 'g3m-gr-dot g3m-gr-pile', 6.5);
  for (let g = 0; g < groups; g++) {
    const cx = 36 + (g % perRow) * 72;
    const cy = top + 40 + Math.floor(g / perRow) * 76;
    s += `<circle class="g3m-gr-plate" cx="${cx}" cy="${cy}" r="${R}"/>`;
    const n = filled[g] ?? 0;
    for (let d = 0; d < n; d++) {
      const col = d % 3;
      const row = Math.floor(d / 3);
      s += dot(cx - 14 + col * 14, cy - 18 + row * 12, 'g3m-gr-dot', 6);
    }
  }
  const H = top + Math.ceil(Math.max(groups, 1) / perRow) * 76 + 6;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${groups} plates.">${s}</svg>`;
}

/** Rows and columns of dots. With `split`, the first `split` columns are one colour and the rest another. */
export function arraySvg(rows: number, cols: number, split = 0, area = false): string {
  const g = 26;
  const W = Math.max(cols, 1) * g + 40;
  const H = Math.max(rows, 1) * g + 30;
  let s = '';
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const cls = split && c >= split ? 'g3m-gr-dot g3m-gr-b' : 'g3m-gr-dot';
      s += area ? `<rect class="g3m-gr-sq${split && c >= split ? ' g3m-gr-b' : ''}" x="${20 + c * g}" y="${10 + r * g}" width="${g}" height="${g}"/>` : dot(20 + c * g + g / 2, 10 + r * g + g / 2, cls, 9);
    }
  if (split) s += `<line class="g3m-gr-cut" x1="${20 + split * g}" y1="2" x2="${20 + split * g}" y2="${H - 18}"/>`;
  s += `<text class="g3m-gr-lab" x="${20 + (cols * g) / 2}" y="${H - 4}" text-anchor="middle">${cols}</text>`;
  s += `<text class="g3m-gr-lab" x="8" y="${10 + (rows * g) / 2 + 5}" text-anchor="middle">${rows}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${rows} rows of ${cols}.">${s}</svg>`;
}

/** A number line from 0 to total with jumps of `size` back from the total. */
export function jumpsSvg(total: number, size: number, jumps: number): string {
  const W = 360;
  const x = (v: number) => 20 + (v / total) * (W - 40);
  let s = `<line class="g3m-gr-axis" x1="20" y1="70" x2="${W - 20}" y2="70"/>`;
  const step = total <= 20 ? 1 : total <= 50 ? 5 : 10;
  for (let v = 0; v <= total; v += step) s += `<line class="g3m-gr-tick" x1="${x(v)}" y1="64" x2="${x(v)}" y2="76"/><text class="g3m-gr-num" x="${x(v)}" y="94" text-anchor="middle">${v % (step * (total <= 20 ? 2 : 1)) === 0 || v === total ? v : ''}</text>`;
  if (total % step) s += `<text class="g3m-gr-num" x="${x(total)}" y="94" text-anchor="middle">${total}</text>`;
  for (let j = 0; j < jumps; j++) {
    const a = total - j * size;
    const b = a - size;
    s += `<path class="g3m-gr-hop" d="M${x(a)} 66 Q ${(x(a) + x(b)) / 2} ${20} ${x(b)} 66"/><text class="g3m-gr-hopn" x="${(x(a) + x(b)) / 2}" y="34" text-anchor="middle">−${size}</text>`;
  }
  s += `<circle class="g3m-gr-dot" cx="${x(total - jumps * size)}" cy="70" r="7"/>`;
  return `<svg viewBox="0 0 ${W} 104" role="img" aria-label="Number line from 0 to ${total} with ${jumps} jumps of ${size}.">${s}</svg>`;
}
