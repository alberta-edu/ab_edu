import { describe, expect, it } from 'vitest';
import { addSubFrames, multiplyFrames, divideFrames, type Frame } from '../src/components/visuals/column-calc.ts';

/** Reads a frame row as text (blank cells become nothing). */
const row = (f: Frame, r: number) => f.rows[r].map((c) => c.ch).join('');
const last = (fs: Frame[]) => fs.at(-1)!;

describe('addition and subtraction frames', () => {
  const cases: [('+' | '-'), string, string, string][] = [
    ['+', '4562.35', '1287.8', '5850.15'],
    ['+', '999', '1', '1000'],
    ['+', '0.457', '0.6', '1.057'],
    ['+', '345 678', '254 322', '600000'],
    ['-', '5002.4', '1876.25', '3126.15'],
    ['-', '1000', '1', '999'],
    ['-', '7.3', '2.856', '4.444'],
    ['-', '804 503', '199 999', '604504'],
    ['-', '5.6', '5.6', '0.0'],
  ];
  for (const [op, a, b, want] of cases) {
    it(`${a} ${op} ${b} = ${want}`, () => {
      const fs = addSubFrames(op, a, b);
      expect(row(last(fs), 3).replace(/^0+(?=\d)/, '')).toBe(want);
      expect(fs.length).toBeGreaterThan(2);
      for (const f of fs) expect(f.caption.length).toBeGreaterThan(5);
    });
  }
  it('explains padding zeros and carrying', () => {
    const fs = addSubFrames('+', '4562.35', '1287.8');
    expect(fs[0].caption).toMatch(/Fill empty decimal places with 0/);
    expect(fs.some((f) => /carry 1 to the ones/.test(f.caption))).toBe(true);
  });
  it('regroups across zeros', () => {
    const fs = addSubFrames('-', '5002.4', '1876.25');
    expect(fs.some((f) => /Regroup 1 thousand as 10 hundreds, then 1 hundred as 10 tens, then 1 ten as 10 ones/.test(f.caption))).toBe(true);
  });
});

describe('multiplication frames', () => {
  for (const [a, b] of [
    ['347', '26'],
    ['999', '99'],
    ['105', '40'],
    ['76', '8'],
    ['250', '12'],
  ]) {
    it(`${a} × ${b}`, () => {
      const fs = multiplyFrames(a, b);
      const want = String(Number(a) * Number(b));
      expect(last(fs).caption).toContain(want);
      const f = last(fs);
      expect(row(f, f.rows.length - 1)).toBe(want);
    });
  }
  it('names the place value of the second digit', () => {
    expect(multiplyFrames('347', '26').some((f) => /tens digit, 2, which is worth 20/.test(f.caption))).toBe(true);
  });
});

describe('long division frames', () => {
  for (const [n, d] of [
    ['745', '6'],
    ['245', '6'],
    ['612', '6'],
    ['900', '4'],
    ['108', '9'],
    ['7', '8'],
  ]) {
    it(`${n} ÷ ${d}`, () => {
      const fs = divideFrames(n, d);
      const q = Math.floor(Number(n) / Number(d));
      const r = Number(n) % Number(d);
      expect(last(fs).caption).toContain(r ? `${q} R ${r}` : `= ${q}.`);
      const quotientRow = row(last(fs), 0).replace(/R\d+$/, '');
      expect(Number(quotientRow)).toBe(q);
    });
  }
  it('refuses division by zero', () => {
    expect(() => divideFrames('120', '0')).toThrow(/not possible/);
  });
});
