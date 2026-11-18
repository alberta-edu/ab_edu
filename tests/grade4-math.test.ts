import { describe, expect, it } from 'vitest';
import { parsePlace, formatPlace, shift, digitText, digitAt } from '../src/components/visuals/tenths-shift.ts';
import { hundredthsText } from '../src/components/visuals/hundredths.ts';
import { factors, factorPairs, kindOf, commonFactors, gcf, multiples } from '../src/components/visuals/factors.ts';

describe('tenths shift', () => {
  it('reads and formats numbers to hundredths', () => {
    expect(parsePlace('3 052.7')).toEqual({ h: 305270, decimals: 1 });
    expect(formatPlace(parsePlace('3052.7')!)).toBe('3 052.7');
    expect(formatPlace(parsePlace('3,75')!, ',')).toBe('3,75');
    expect(parsePlace('12 345')).toBeNull();
    expect(parsePlace('1.234')).toBeNull();
  });
  it('moves every digit one place for × 10 and ÷ 10', () => {
    const n = parsePlace('4.7')!;
    expect(formatPlace(shift(n, 'times')!)).toBe('47');
    expect(formatPlace(shift(shift(n, 'times')!, 'times')!)).toBe('470');
    expect(formatPlace(shift(n, 'divide')!)).toBe('0.47');
    expect(formatPlace(shift(parsePlace('4.70')!, 'times')!)).toBe('47.0');
    expect(shift(parsePlace('0.47')!, 'divide')).toBeNull();
    expect(shift(parsePlace('1 000')!, 'times')).toBeNull();
  });
  it('says what a digit is worth', () => {
    const n = parsePlace('352.74')!;
    expect(digitAt(n.h, -1)).toBe(7);
    expect(digitText(n, -1)).toBe('The 7 is in the tenths place, so it is worth 7 tenths, or 0.7.');
    expect(digitText(n, 2)).toBe('The 3 is in the hundreds place, so it is worth 3 × 100 = 300.');
  });
});

describe('hundredths grid', () => {
  it('names tenths and hundredths', () => {
    expect(hundredthsText(35)).toEqual({ decimal: '0.35', say: '35 hundredths = 3 tenths and 5 hundredths.' });
    expect(hundredthsText(40).say).toBe('40 hundredths = 4 tenths, so 40/100 = 4/10.');
    expect(hundredthsText(7).decimal).toBe('0.07');
    expect(hundredthsText(100).decimal).toBe('1.00');
  });
});

describe('factors', () => {
  it('finds factors, pairs and multiples', () => {
    expect(factors(30)).toEqual([1, 2, 3, 5, 6, 10, 15, 30]);
    expect(factorPairs(36)).toEqual([[1, 36], [2, 18], [3, 12], [4, 9], [6, 6]]);
    expect(multiples(6)).toEqual([6, 12, 18, 24, 30]);
  });
  it('sorts numbers as prime, composite or neither', () => {
    expect([0, 1, 2, 9, 13, 51, 97].map(kindOf)).toEqual(['neither', 'neither', 'prime', 'composite', 'prime', 'composite', 'prime']);
  });
  it('finds the greatest common factor', () => {
    expect(commonFactors(12, 18)).toEqual([1, 2, 3, 6]);
    expect(gcf(30, 42)).toBe(6);
    expect(gcf(24, 36)).toBe(12);
  });
});

import { canSplit, canJoin, splitText, joinText, simplestText } from '../src/components/visuals/fraction-split.ts';

describe('fraction split', () => {
  it('splits and joins equal parts', () => {
    expect(splitText(2, 3, 4)).toBe('Split every part into 4: 2/3 = (2 × 4)/(3 × 4) = 8/12.');
    expect(joinText(6, 8, 2)).toBe('Join every 2 parts into one: 6/8 = (6 ÷ 2)/(8 ÷ 2) = 3/4.');
    expect(canSplit(12, 2)).toBe(true);
    expect(canSplit(12, 3)).toBe(false);
    expect(canJoin(6, 8, 2)).toBe(true);
    expect(canJoin(6, 8, 3)).toBe(false);
  });
  it('knows simplest form', () => {
    expect(simplestText(5, 8)).toMatch(/is in simplest form/);
    expect(simplestText(12, 18)).toMatch(/greatest common factor 6, so it simplifies to 2\/3/);
  });
});

import { solveFrames, applyMove, moveEquation, tilt } from '../src/components/visuals/equal-balance.ts';

describe('equal balance', () => {
  it('solves one-operation equations step by step', () => {
    const add = solveFrames({ op: '+', k: 5, total: 12 });
    expect(add.map((f) => f.equation)).toEqual(['□ + 5 = 12', '□ + 5 − 5 = 12 − 5', '□ = 7', '7 + 5 = 12 ✓']);
    const times = solveFrames({ op: '×', k: 3, total: 12 });
    expect(times[2].equation).toBe('□ = 4');
    expect(() => solveFrames({ op: '×', k: 5, total: 12 })).toThrow();
  });
  it('keeps both sides equal only when both change', () => {
    expect(applyMove(8, 8, { op: '+', k: 2, side: 'both' })).toEqual([10, 10]);
    expect(applyMove(8, 8, { op: '+', k: 2, side: 'left' })).toEqual([10, 8]);
    expect(applyMove(9, 9, { op: '÷', k: 2, side: 'both' })).toBeNull();
    expect(applyMove(2, 2, { op: '−', k: 3, side: 'both' })).toBeNull();
    expect(moveEquation(8, 8, { op: '×', k: 2, side: 'both' })).toBe('8 × 2 = 8 × 2   →   16 = 16');
    expect(tilt(10, 8)).toBeLessThan(0);
    expect(tilt(8, 8)).toBe(0);
  });
});

import { angleType, turnText, pairText, nearestBenchmark, angleAt } from '../src/components/visuals/angles.ts';

describe('angles', () => {
  it('names angles by size', () => {
    expect([30, 90, 135, 180, 270, 360].map(angleType)).toEqual(['acute', 'right', 'obtuse', 'straight', 'more than a straight angle', 'a full turn']);
    expect(turnText(270)).toBe('3/4 of a full turn');
    expect(nearestBenchmark(130)).toBe(90);
  });
  it('describes angle pairs', () => {
    expect(pairText(35, 90)).toBe('35° + 55° = 90°. They are complementary angles.');
    expect(pairText(120, 180)).toBe('120° + 60° = 180°. They are supplementary angles.');
  });
  it('reads the angle of a point around the vertex', () => {
    expect(angleAt(300, 160)).toBe(0);
    expect(angleAt(200, 60)).toBe(90);
    expect(angleAt(100, 160)).toBe(180);
    expect(angleAt(200, 260)).toBe(270);
  });
});

import { QUADS, TRIANGLES, quadFamilies, triangleBySides, triangleByAngles, parallelPairs } from '../src/components/visuals/shape-family.ts';

describe('shape families', () => {
  it('places each quadrilateral in its families', () => {
    expect(quadFamilies(QUADS.square.pts)).toEqual(['quadrilateral', 'parallelogram', 'rectangle', 'rhombus', 'square']);
    expect(quadFamilies(QUADS.rectangle.pts)).toEqual(['quadrilateral', 'parallelogram', 'rectangle']);
    expect(quadFamilies(QUADS.rhombus.pts)).toEqual(['quadrilateral', 'parallelogram', 'rhombus']);
    expect(quadFamilies(QUADS.parallelogram.pts)).toEqual(['quadrilateral', 'parallelogram']);
    expect(quadFamilies(QUADS.trapezoid.pts)).toEqual(['quadrilateral', 'trapezoid']);
    expect(quadFamilies(QUADS.quadrilateral.pts)).toEqual(['quadrilateral']);
    expect(parallelPairs(QUADS.trapezoid.pts)).toEqual([[0, 2]]);
  });
  it('names every triangle by side and by angle', () => {
    const names = Object.values(TRIANGLES).map((t) => `${triangleBySides(t.pts)} ${triangleByAngles(t.pts)}`);
    expect(names).toEqual(['equilateral acute', 'isosceles acute', 'isosceles right', 'isosceles obtuse', 'scalene acute', 'scalene right', 'scalene obtuse']);
  });
});

import { boxFaces, triFaces, relation, relationText } from '../src/components/visuals/prism.ts';

describe('prism faces', () => {
  it('finds parallel and perpendicular faces of a box', () => {
    const box = boxFaces();
    expect(relation(box[0], box[1])).toBe('parallel');
    expect(relation(box[0], box[2])).toBe('perpendicular');
    expect(relationText(box, 0)).toBe('The top face has 1 parallel face and 4 perpendicular faces.');
  });
  it('shows a triangular prism has only one pair of parallel faces', () => {
    const tri = triFaces();
    expect(relation(tri[0], tri[1])).toBe('parallel');
    expect(relation(tri[2], tri[3])).toBe('neither');
    expect(relationText(tri, 2)).toBe('The bottom face has 0 parallel faces, 2 perpendicular faces and 2 faces that are neither.');
  });
});
