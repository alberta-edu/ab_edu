import { describe, expect, it } from 'vitest';
import {
  BOUNCE, BRIDGE, BUG_END, DIPPER, MOON_CYCLE, STARS, TRIALS, YEAR_DAYS,
  clipLifts, cycleEnds, patchWidth, polarisFrom, pondYears, poles, skyDarkness, twelveMoons,
} from '../src/components/experiments/g4-science.ts';
import { runRobot } from '../src/components/visuals/g4-robot.ts';
import { HAZARDS, FRAME_MEANING, hazardSvg } from '../src/components/visuals/g4-hazard.ts';

describe('Grade 4 hazard symbols', () => {
  it('has the four symbols the curriculum lists', () => {
    expect(HAZARDS.map((h) => h.id).sort()).toEqual(['corrosive', 'explosive', 'flammable', 'poison']);
  });

  it('frames the explosive symbol in a triangle and the rest in octagons, as Health Canada does', () => {
    for (const h of HAZARDS) expect(h.frame).toBe(h.id === 'explosive' ? 'triangle' : 'octagon');
    expect(FRAME_MEANING.triangle).toMatch(/container/);
  });

  it('draws each symbol with a label for screen readers', () => {
    for (const h of HAZARDS) {
      const svg = hazardSvg(h.id);
      expect(svg).toMatch(/^<svg[^>]+role="img"/);
      expect(svg).toContain(h.name);
      expect(svg.match(/<polygon/g)).toHaveLength(1);
    }
  });
});

describe('Grade 4 experiments match their lessons', () => {
  it('lifts the clip through cardboard at 2 cm but not at 8 cm', () => {
    expect(clipLifts(2)).toBe(true);
    expect(clipLifts(8)).toBe(false);
  });

  it('attracts opposite poles and repels like poles', () => {
    expect(poles('N', 'S')).toBe('attract');
    expect(poles('S', 'N')).toBe('attract');
    expect(poles('N', 'N')).toBe('repel');
    expect(poles('S', 'S')).toBe('repel');
  });

  it('spreads slanted sunlight over a bigger patch than direct sunlight', () => {
    expect(patchWidth(90, 90)).toBeCloseTo(90);
    expect(patchWidth(90, 25)).toBeGreaterThan(2 * 90);
  });

  it('keeps 25 fish when taking 5 a year, and empties the pond in year 3 when taking 15', () => {
    expect(pondYears(20, 30, 5, 5)).toEqual([25, 25, 25, 25, 25]);
    expect(pondYears(20, 30, 15, 5)).toEqual([15, 7, 0, 0, 0]);
  });

  it('puts 8 of 10 pill bugs on the damp side', () => {
    expect(BUG_END).toHaveLength(10);
    expect(BUG_END.filter((b) => b.endX < 0.5)).toHaveLength(8);
  });

  it('darkens the sky after sunset, with every star brightness in range', () => {
    expect(skyDarkness(12)).toBe(0);
    expect(skyDarkness(24)).toBe(1);
    for (const s of STARS) expect(s.bright).toBeGreaterThanOrEqual(0);
  });

  it('finds Polaris five pointer gaps past Dubhe, and puts Dubhe about 420 trillion km behind Merak', () => {
    const [dubhe, merak] = DIPPER;
    const p = polarisFrom(merak, dubhe);
    expect(p.x - dubhe.x).toBe(5 * (dubhe.x - merak.x));
    expect(dubhe.tkm - merak.tkm).toBe(420);
  });

  it('fits 12 Moon cycles into about 354 days, 11 short of the year', () => {
    expect(Math.round(twelveMoons())).toBe(354);
    expect(Math.round(YEAR_DAYS - twelveMoons())).toBe(11);
    expect(cycleEnds(YEAR_DAYS)).toHaveLength(12);
    expect(MOON_CYCLE).toBeCloseTo(29.5, 0);
  });

  it('collapses the flat bridge with the 4th coin', () => {
    expect(BRIDGE.flatHolds + 1).toBe(4);
  });

  it('records the bounce heights the lesson reports', () => {
    expect(BOUNCE).toEqual({ drop: 100, wood: 62, carpet: 24 });
    expect(BOUNCE.wood - BOUNCE.carpet).toBe(38);
  });

  it('gives five close trials, as the lesson reports', () => {
    expect(TRIALS).toEqual([182, 178, 185, 179, 181]);
    expect(Math.max(...TRIALS) - Math.min(...TRIALS)).toBeLessThan(10);
  });
});

describe('Grade 4 robot algorithm', () => {
  it('reaches the bin by either route the lesson hints at', () => {
    expect(runRobot(['forward', 'forward', 'forward', 'right', 'forward', 'forward', 'forward']).outcome).toBe('bin');
    expect(runRobot(['right', 'forward', 'forward', 'forward', 'left', 'forward', 'forward', 'forward']).outcome).toBe('bin');
  });

  it('matches practice problem b1: turning left at step 4 hits the edge', () => {
    expect(runRobot(['forward', 'forward', 'forward', 'left', 'forward', 'forward', 'forward']).outcome).toBe('wall');
  });

  it('reports puddles and short runs', () => {
    expect(runRobot(['forward', 'right', 'forward']).outcome).toBe('puddle');
    expect(runRobot(['forward']).outcome).toBe('short');
  });
});
