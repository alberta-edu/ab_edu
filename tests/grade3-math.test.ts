import { describe, expect, it } from 'vitest';
import { parseSide, sideValue, solveBox, tilt, balanceSay, pieces } from '../src/components/visuals/g3-equation.ts';
import { shapeById, rightAngles, equalSides, parallelPairs, isRegular, angles, propertySay, follows, SORTS, RULES, moveAt, sideLengths, distances, shapeSvg } from '../src/components/visuals/g3-shapes.ts';
import { readSay, thingById, wrongRead, wormPoints, pathLength, PER_METRE, MATCHES, FIGS, perimeter, walkSay, missingSide, unrollSide, estById, estimateSay } from '../src/components/visuals/g3-length.ts';
import { at, wedge, vsRight, turnSay, compareSay, PAIRS, SPOTS, angleSvg } from '../src/components/visuals/g3-angle.ts';
import { hands, digital, clock12, clock24, french24, since12, since24, pastUntil, pastSay, gone, tickSay, minuteAt, dragTo, parse as parseTime, daylight } from '../src/components/visuals/g3-clock.ts';
import { most, fewest, total, voteOrder, storySay, graphSvg, top as graphTop, spiral } from '../src/components/visuals/g3-graph.ts';
import { ordinal, term as seqTerm, lastPos, ruleSay, findSay, isSkip } from '../src/components/visuals/g3-sequence.ts';
import { fractionName, unitSum, compare, compareWhy, benchmark } from '../src/components/visuals/g3-fraction.ts';
import { family, rowSeq } from '../src/components/visuals/g3-table.ts';
import { repeatedAdd, skipCount, groupsSay, share, shareSay, groupSay, takeAwaySay, splitSay } from '../src/components/visuals/g3-groups.ts';
import { addFrames, subtractFrames, value, matSvg } from '../src/components/visuals/g3-blocks.ts';
import { compareSign, compareSteps, digitsOf, expanded, fmt, roundTo, roundSay, step, words } from '../src/components/visuals/g3-place.ts';

describe('Grade 3 place value', () => {
  it('splits a number into its six places', () => {
    expect(digitsOf(45306)).toEqual([0, 4, 5, 3, 0, 6]);
    expect(digitsOf(100000)).toEqual([1, 0, 0, 0, 0, 0]);
    expect(fmt(45306)).toBe('45 306');
    expect(fmt(100000)).toBe('100 000');
    expect(expanded(45306)).toBe('40 000 + 5 000 + 300 + 6');
    expect(words(70019)).toBe('seventy thousand nineteen');
  });

  it('regroups when a digit passes 9 or 0', () => {
    expect(step(45309, 5, 1)).toEqual({ n: 45310, note: '10 ones make 1 ten. The ones go back to 0.' });
    expect(step(45306, 4, -1)!.note).toContain('Trade 1 hundred for 10 tens');
    expect(step(45306, 4, -1)!.n).toBe(45296);
    expect(step(99999, 5, 1)!.n).toBe(100000);
    expect(step(100000, 5, 1)).toBeNull();
    expect(step(5, 4, -1)).toBeNull();
  });

  it('rounds halfway up and says why', () => {
    expect(roundTo(4368, 100)).toMatchObject({ low: 4300, high: 4400, result: 4400 });
    expect(roundTo(4349, 100).result).toBe(4300);
    expect(roundTo(1500, 1000).result).toBe(2000);
    expect(roundTo(2499, 1000).result).toBe(2000);
    expect(roundSay(4368, 100)).toBe('4 368 is between 4 300 and 4 400. It is past the halfway mark, 4 350, so it rounds up to 4 400.');
    expect(roundSay(4300, 100)).toContain('stays 4 300');
  });
});

describe('Grade 3 comparing', () => {
  it('stops at the first place that differs', () => {
    const s = compareSteps(45306, 45063);
    expect(s.map((x) => x.i)).toEqual([1, 2, 3]);
    expect(s.at(-1)!.say).toBe('Hundreds: 3 and 0. 3 hundreds are more, so 45 306 > 45 063.');
    expect(compareSteps(9870, 10001).at(-1)!.say).toContain('9 870 < 10 001');
    expect(compareSteps(512, 512).at(-1)!.say).toContain('512 = 512');
    expect(compareSign(3, 4)).toBe('<');
  });
});

describe('Grade 3 base-ten blocks', () => {
  it('adds with trades and ends on the sum', () => {
    const f = addFrames(258, 167);
    expect(value(f.at(-1)!)).toBe(425);
    expect(f.filter((x) => x.say.startsWith('Trade')).length).toBe(2);
    expect(addFrames(999, 1).at(-1)!.say).toBe('999 + 1 = 1000');
  });
  it('subtracts, breaking across zeros', () => {
    const f = subtractFrames(600, 274);
    expect(value(f.at(-1)!)).toBe(326);
    expect(f.filter((x) => x.say.includes('Break')).map((x) => x.say)).toEqual(['Not enough ones. Break 1 hundred into 10 tens.', 'Not enough ones. Break 1 ten into 10 ones.']);
    expect(value(subtractFrames(342, 158).at(-1)!)).toBe(184);
    expect(matSvg(f[0])).toContain('g3m-bk-a');
  });
});

describe('Grade 3 groups and arrays', () => {
  it('says multiplication as groups, adding and skip counting', () => {
    expect(repeatedAdd(3, 4)).toBe('4 + 4 + 4 = 12');
    expect(skipCount(3, 4)).toBe('4, 8, 12');
    expect(groupsSay(5, 0)).toContain('5 × 0 = 0');
    expect(groupsSay(6, 1)).toContain('6 × 1 = 6');
  });
  it('shares, groups and takes away with remainders', () => {
    expect(share(13, 4)).toEqual({ each: 3, left: 1, rounds: 3 });
    expect(shareSay(12, 4)).toContain('12 ÷ 4 = 3');
    expect(groupSay(14, 4)).toContain('2 are left over');
    expect(takeAwaySay(12, 4)).toBe('12 − 4 − 4 − 4 = 0. That is 3 jumps, so 12 ÷ 4 = 3');
    expect(splitSay(7, 8, 5)).toBe('7 × 8 = 7 × 5 + 7 × 3 = 35 + 21 = 56');
  });
});

describe('Grade 3 times table', () => {
  it('builds fact families', () => {
    expect(family(3, 4)).toEqual(['3 × 4 = 12', '4 × 3 = 12', '12 ÷ 3 = 4', '12 ÷ 4 = 3']);
    expect(family(5, 5)).toEqual(['5 × 5 = 25', '25 ÷ 5 = 5']);
    expect(rowSeq(4, 5)).toEqual([4, 8, 12, 16, 20]);
  });
});

describe('Grade 3 fractions', () => {
  it('names fractions and builds them from unit fractions', () => {
    expect(fractionName(3, 8)).toBe('three eighths');
    expect(fractionName(1, 2)).toBe('one half');
    expect(fractionName(2, 2)).toBe('two halves');
    expect(fractionName(1, 12)).toBe('one twelfth');
    expect(unitSum(3, 8)).toBe('1/8 + 1/8 + 1/8 = 3/8');
  });
  it('compares by same denominator or same numerator', () => {
    expect(compare([3, 8], [5, 8])).toBe('<');
    expect(compare([2, 3], [2, 5])).toBe('>');
    expect(compare([4, 4], [6, 6])).toBe('=');
    expect(compareWhy([5, 8], [3, 8])).toBe('Same size parts. 5/8 has more of them, so 5/8 > 3/8.');
    expect(compareWhy([2, 5], [2, 3])).toContain('thirds');
    expect(benchmark(3, 8)).toBe('It is between 0 and 1/2.');
    expect(benchmark(4, 8)).toBe('It is exactly one half.');
  });
});

describe('Grade 3 equations on a balance', () => {
  it('reads a side with one operation or a box', () => {
    expect(parseSide('3 + 4')).toEqual({ a: 3, op: '+', b: 4 });
    expect(parseSide('□ − 4')).toEqual({ a: 'box', op: '−', b: 4 });
    expect(parseSide('12')).toEqual({ a: 12 });
    expect(() => parseSide('3 + x')).toThrow();
    expect(sideValue(parseSide('3 × □'), 5)).toBe(15);
    expect(sideValue(parseSide('24 ÷ 2'))).toBe(12);
  });

  it('finds the box and tips toward the heavier side', () => {
    expect(solveBox(parseSide('□ + 5'), parseSide('12'))).toBe(7);
    expect(solveBox(parseSide('15'), parseSide('3 × □'))).toBe(5);
    expect(tilt(9, 8)).toBeLessThan(0);
    expect(tilt(2, 20)).toBe(14);
    expect(tilt(7, 7)).toBe(0);
  });

  it('says what the balance shows', () => {
    expect(balanceSay(parseSide('5 + 2'), parseSide('4 + 3'), null)).toBe('Balanced! Both sides are 7. So 5 + 2 = 4 + 3.');
    expect(balanceSay(parseSide('6 + 3'), parseSide('8'), null)).toContain('not equal');
    expect(balanceSay(parseSide('□ + 5'), parseSide('12'), 9)).toBe('The left side is heavier. Try a smaller number in the box.');
    expect(balanceSay(parseSide('15'), parseSide('3 × □'), 2)).toBe('The left side is heavier. Try a bigger number in the box.');
  });

  it('lays out cubes, taken-away cubes and boxes', () => {
    expect(pieces(parseSide('9 − 4')).filter((p) => p.kind === 'gone')).toHaveLength(4);
    expect(pieces(parseSide('9 − 4')).filter((p) => p.kind === 'cube')).toHaveLength(5);
    expect(pieces(parseSide('3 × □')).filter((p) => p.kind === 'box')).toHaveLength(3);
    expect(pieces(parseSide('2 × 3')).map((p) => (p.kind === 'cube' ? p.group : -1))).toEqual([0, 0, 0, 1, 1, 1]);
  });
});

describe('Grade 3 polygon properties', () => {
  it('finds right angles, equal sides and parallel sides', () => {
    expect(rightAngles(shapeById('tri-right').pts)).toEqual([1]);
    expect(rightAngles(shapeById('diamond').pts)).toEqual([]);
    expect(equalSides(shapeById('rectangle').pts)).toEqual([[0, 2], [1, 3]]);
    expect(parallelPairs(shapeById('trapezoid').pts)).toEqual([[0, 2]]);
    expect(parallelPairs(shapeById('hex-reg').pts)).toHaveLength(3);
    expect(parallelPairs(shapeById('pent-reg').pts)).toEqual([]);
  });

  it('reads a dented corner as more than 180 degrees', () => {
    const a = angles(shapeById('hex-l').pts).map(Math.round);
    expect(a.filter((x) => x === 270)).toHaveLength(1);
    expect(rightAngles(shapeById('hex-l').pts)).toHaveLength(5);
  });

  it('needs equal sides and equal angles to be regular', () => {
    expect(['tri-reg', 'square', 'pent-reg', 'hex-reg', 'oct-reg'].every((id) => isRegular(shapeById(id).pts))).toBe(true);
    expect(isRegular(shapeById('diamond').pts)).toBe(false);
    expect(isRegular(shapeById('rectangle').pts)).toBe(false);
    expect(propertySay(shapeById('diamond'), 'regular')).toBe('Sides all equal ✓ Angles all equal ✗ It is irregular.');
    expect(propertySay(shapeById('oct-reg'), 'sides')).toBe('8 straight sides and 8 corners. It is an octagon.');
    expect(propertySay(shapeById('square'), 'sides')).toBe('4 straight sides and 4 corners. It is a square, a kind of quadrilateral.');
  });

  it('has exactly one rule for each sorting puzzle', () => {
    for (const p of SORTS) {
      const fits = RULES.filter((r) => p.shapes.every((id) => follows(shapeById(id), r.id) === follows(shapeById(id), p.rule)));
      expect(fits.map((r) => r.id)).toEqual([p.rule]);
      expect(p.shapes.some((id) => follows(shapeById(id), p.rule))).toBe(true);
      expect(p.shapes.some((id) => !follows(shapeById(id), p.rule))).toBe(true);
    }
  });

  it('keeps every length through slides, turns and flips', () => {
    const pts = shapeById('hex-l').pts;
    for (const m of ['slide', 'turn', 'flip'] as const) {
      expect(distances(moveAt(pts, m, 1))).toEqual(distances(pts));
      expect(sideLengths(moveAt(pts, m, 1)).map((l) => Math.round(l * 100))).toEqual(sideLengths(pts).map((l) => Math.round(l * 100)));
    }
    expect(moveAt([[0, 0], [2, 0], [0, 1]], 'slide', 1, 5)).toEqual([[5, 0], [7, 0], [5, 1]]);
    expect(moveAt([[0, 0], [2, 0], [0, 1]], 'flip', 1)).toEqual([[2, 0], [0, 0], [2, 1]]);
  });

  it('draws marks for each view', () => {
    expect(shapeSvg(shapeById('square').pts, 'right').match(/g3m-sh-rt/g)).toHaveLength(4);
    expect(shapeSvg(shapeById('tri-reg').pts, 'right').match(/✗/g)).toHaveLength(3);
    expect(shapeSvg(shapeById('rectangle').pts, 'parallel').match(/g3m-sh-chev/g)).toHaveLength(6);
  });
});

describe('Grade 3 length', () => {
  it('reads lengths without decimals', () => {
    expect(readSay(thingById('pencil'), 'cm')).toBe('The pencil is 12 cm long.');
    expect(readSay(thingById('crayon'), 'cm')).toBe('The crayon is between 7 cm and 8 cm. Millimetres give a closer answer: 75 mm.');
    expect(readSay(thingById('crayon'), 'mm')).toBe('The crayon is 75 mm long.');
    expect(wrongRead(thingById('pencil'))).toBeCloseTo(14.2);
  });

  it('keeps the worm the same length as it straightens', () => {
    const L = 231;
    for (const s of [0, 0.5, 1]) expect(pathLength(wormPoints(L, s))).toBeCloseTo(L, 6);
    const straight = wormPoints(L, 1);
    expect(straight[straight.length - 1][0]).toBeCloseTo(L, 6);
    expect(wormPoints(L, 0)[40][0]).toBeLessThan(L * 0.85);
  });

  it('relates the units', () => {
    expect(PER_METRE).toEqual({ dm: 10, cm: 100, mm: 1000 });
    expect(MATCHES.every((m) => Math.abs(m.a.cm - m.b.cm) / m.b.cm < 0.1)).toBe(true);
  });
});

describe('Grade 3 perimeter and estimating', () => {
  it('draws every shape to scale with its labels', () => {
    for (const f of FIGS) {
      const n = f.pts.length;
      f.pts.forEach((p, i) => {
        const q = f.pts[(i + 1) % n];
        expect(Math.hypot(q[0] - p[0], q[1] - p[1])).toBeCloseTo(f.sides[i], 2);
      });
    }
  });

  it('adds the sides as the ladybug walks', () => {
    expect(walkSay([4, 3, 5], 2, 'cm')).toBe('4 + 3 = 7 cm so far.');
    expect(walkSay([4, 3, 5], 3, 'cm')).toBe('4 + 3 + 5 = 12 cm. The perimeter is 12 cm.');
    expect(perimeter([2, 3, 3, 2, 5, 5])).toBe(20);
    expect(missingSide(16, [3, 3, 3, 3])).toBe(4);
  });

  it('keeps each side the same length while it unrolls', () => {
    for (const t of [0, 0.3, 0.7, 1]) {
      const [a, b] = unrollSide([10, 10], [40, 50], 30, 224, 50, t);
      expect(Math.hypot(b[0] - a[0], b[1] - a[1])).toBeCloseTo(50, 6);
    }
    expect(unrollSide([10, 10], [40, 50], 30, 224, 50, 1)).toEqual([[30, 224], [80, 224]]);
  });

  it('says how close an estimate was', () => {
    expect(estimateSay(estById('canoe'), 5)).toContain('exactly');
    expect(estimateSay(estById('canoe'), 4)).toContain('close');
    expect(estimateSay(estById('marker'), 5)).toContain('Picture the fingernails');
  });
});

describe('Grade 3 angles', () => {
  it('places arms and wedges by turning anticlockwise', () => {
    const p = at([0, 0], 10, 90);
    expect(p[0]).toBeCloseTo(0);
    expect(p[1]).toBeCloseTo(-10);
    expect(wedge([0, 0], 10, 0, 0)).toBe('');
    expect(wedge([0, 0], 10, 0, 90)).toContain('A10,10 0 0 0');
    expect(angleSvg([0, 0], 0, 90, [50, 50])).toContain('g3m-an-rt');
    expect(angleSvg([0, 0], 0, 60, [50, 50])).toContain('g3m-an-wedge');
    expect(angleSvg([0, 0], 0, 90, [50, 50], 'a', false)).not.toContain('g3m-an-rt');
  });

  it('checks angles against a right angle', () => {
    expect(vsRight(45)).toBe('smaller');
    expect(vsRight(92)).toBe('right');
    expect(vsRight(115)).toBe('bigger');
    expect(turnSay(90, 'door')).toBe('The door made a quarter turn. That is a right angle!');
    expect(turnSay(0, 'plain')).toContain('No opening');
  });

  it('compares by the opening, not the arms', () => {
    for (const p of PAIRS) expect(compareSay(p.a, p.b)).toContain(p.a === p.b ? 'same size' : 'Arm length doesn’t matter');
    // Every pair puts the longer arm on the smaller or equal angle, so arm length is a trap.
    expect(PAIRS.every((p) => (p.la > p.lb) === p.a <= p.b)).toBe(true);
    expect(SPOTS.filter((s) => vsRight(s.deg) === 'right').length).toBeGreaterThan(1);
  });
});

describe('Grade 3 sequences', () => {
  it('names positions with ordinals', () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 23].map(ordinal)).toEqual(['1st', '2nd', '3rd', '4th', '11th', '12th', '13th', '21st', '22nd', '23rd']);
  });

  it('finds terms and knows when a countdown ends', () => {
    const countdown = { label: '', start: 10, step: -1, n: 4, finite: true };
    expect(lastPos(countdown)).toBe(11);
    expect(seqTerm(countdown, 11)).toBe(0);
    expect(lastPos({ label: '', start: 1, step: 1, n: 5 })).toBe(Infinity);
    expect(ruleSay(-5)).toBe('Subtract 5 each time.');
  });

  it('uses multiplication for skip counting and the rule otherwise', () => {
    const by5 = { label: '', start: 5, step: 5, n: 8, hide: 7 };
    expect(isSkip(by5)).toBe(true);
    expect(findSay(by5, 7)).toBe('The 7th term of counting by 5 is 7 × 5 = 35.');
    expect(findSay({ label: '', start: 50, step: -5, n: 6, hide: 4 }, 4)).toBe('Subtract 5 each time. 40 − 5 = 35. The 4th term is 35.');
  });
});

describe('Grade 3 time', () => {
  it('turns hands in base 60', () => {
    expect(hands(parseTime('3:00'))).toEqual({ hour: 90, minute: 0, second: 0 });
    expect(hands(parseTime('4:30')).hour).toBe(135);
    expect(hands(parseTime('4:30'), 30).second).toBe(180);
    expect(gone(3725)).toEqual({ h: 1, m: 2, s: 5 });
    expect(tickSay(59, 60)).toContain('60 seconds make 1 minute');
    expect(tickSay(3599, 3636)).toContain('60 minutes make 1 hour');
    expect(tickSay(10, 11)).toBe('');
  });

  it('reads 12-hour and 24-hour times from midnight and noon', () => {
    expect(digital(parseTime('16:35'))).toBe('4:35');
    expect(digital(parseTime('0:05'))).toBe('12:05');
    expect(clock12(parseTime('15:20'))).toBe('3:20 p.m.');
    expect(clock12(parseTime('7:00'))).toBe('7:00 a.m.');
    expect(clock12(0)).toBe('12:00 midnight');
    expect(clock12(720)).toBe('12:00 noon');
    expect(clock24(parseTime('20:00'))).toBe('20:00');
    expect(french24(parseTime('15:20'))).toBe('15 h 20');
    expect(since12(parseTime('15:20'))).toBe('3 hours 20 minutes after 12:00 noon');
    expect(since12(parseTime('0:40'))).toBe('40 minutes after 12:00 midnight');
    expect(since24(parseTime('15:20'))).toBe('15 hours 20 minutes after 0:00');
    expect(daylight(0)).toBe(0);
    expect(daylight(720)).toBe(1);
  });

  it('splits an hour into minutes past and until', () => {
    expect(pastUntil(parseTime('3:40'))).toEqual({ past: 40, until: 20 });
    expect(pastSay(parseTime('3:20'))).toBe('20 minutes past 3. 40 minutes until 4. 20 + 40 = 60.');
    expect(pastSay(parseTime('12:00'))).toBe('Exactly 12:00. It is 60 minutes until 1:00.');
    expect(pastSay(parseTime('12:10'))).toContain('until 1.');
  });

  it('drags the minute hand and carries the hour across 12', () => {
    expect(minuteAt(0, -10)).toBe(0);
    expect(minuteAt(10, 0)).toBe(15);
    expect(minuteAt(0, 10)).toBe(30);
    expect(dragTo(parseTime('3:55'), 5)).toBe(parseTime('4:05'));
    expect(dragTo(parseTime('4:05'), 55)).toBe(parseTime('3:55'));
    expect(dragTo(parseTime('3:20'), 40)).toBe(parseTime('3:40'));
  });
});

describe('Grade 3 data', () => {
  const spec = { title: 'Pets', axis: 'Pet', count: 'Number of kids', cats: [{ label: 'Dog', icon: '🐶' }, { label: 'Cat' }, { label: 'Fish' }], data: [6, 4, 2] };

  it('finds the story: most, fewest and ties', () => {
    expect(most([6, 4, 2])).toBe(0);
    expect(fewest([6, 4, 2])).toBe(2);
    expect(most([5, 5, 1])).toBe(-1);
    expect(total([6, 4, 2])).toBe(12);
    expect(storySay(spec)).toBe('Most: 🐶 Dog, 6. Fewest: Fish, 2.');
    expect(graphTop([2, 3])).toBe(5);
  });

  it('asks every kid exactly once, in a mixed-up order', () => {
    const order = voteOrder([4, 2, 6, 3]);
    expect(order).toHaveLength(15);
    expect([0, 1, 2, 3].map((c) => order.filter((x) => x === c).length)).toEqual([4, 2, 6, 3]);
    expect(order).not.toEqual([...order].sort());
  });

  it('draws one dot for each one counted, and bars as tall as their count', () => {
    const dots = graphSvg(spec, 'dots');
    expect(dots.match(/<circle/g)).toHaveLength(12);
    expect(dots).toContain('Dot plot: Pets. Dog 6, Cat 4, Fish 2.');
    const bars = graphSvg(spec, 'bars', [1, 0, 0]);
    expect(bars).toContain('height="18"');
    expect(bars).toContain('Number of kids');
  });

  it('spirals the winter count outward', () => {
    const pts = spiral(8);
    expect(pts).toHaveLength(8);
    const r = pts.map(([x, y]) => Math.hypot(x, y));
    expect(r.every((v, i) => i === 0 || v > r[i - 1])).toBe(true);
  });
});
