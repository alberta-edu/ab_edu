import { describe, expect, it } from 'vitest';
import { hpFacts, hpSpeed, hpState } from '../src/components/visuals/heat-particles.ts';
import { BODIES, PLANET_ORDER, gravityText, scaleModel, timesEarth } from '../src/components/visuals/solar-data.ts';

describe('Grade 6 heating and cooling', () => {
  it('uses the Celsius scale points for water', () => {
    expect(hpState(-1)).toBe('solid');
    expect(hpState(0)).toBe('solid');
    expect(hpState(1)).toBe('liquid');
    expect(hpState(99)).toBe('liquid');
    expect(hpState(100)).toBe('gas');
  });

  it('makes particles faster at every higher temperature', () => {
    for (let t = -30; t < 130; t += 5) expect(hpSpeed(t + 5)).toBeGreaterThan(hpSpeed(t));
  });

  it('weakens attractive forces from solid to gas', () => {
    expect(hpFacts(-10).forces).toBe('Strongest');
    expect(hpFacts(50).forces).toBe('Weaker');
    expect(hpFacts(120).forces).toBe('Weakest');
  });
});

describe('Grade 6 solar system', () => {
  it('orders the eight planets from the Sun', () => {
    expect(PLANET_ORDER).toEqual(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']);
  });

  it('has only the Sun emitting light', () => {
    expect(BODIES.filter((b) => b.emits).map((b) => b.id)).toEqual(['sun']);
  });

  it('matches the lesson’s scale model numbers', () => {
    const at = (id: string) => scaleModel(BODIES.find((b) => b.id === id)!, 1);
    expect(Math.round(at('earth').distance)).toBe(107);
    expect(Math.round(at('earth').size * 1000)).toBe(9);
    expect(Math.round(at('jupiter').distance)).toBe(559);
    expect(Math.round(at('neptune').distance / 100) / 10).toBe(3.2);
  });

  it('describes size and gravity as a child would', () => {
    const b = (id: string) => BODIES.find((x) => x.id === id)!;
    expect(timesEarth(b('jupiter'))).toBe('About 11 times as wide as Earth');
    expect(gravityText(b('moon'))).toBe('About one-sixth of Earth’s');
    expect(gravityText(b('earth'))).toBe('About the same as Earth');
  });
});

import { IF_ROBOT_POTS, runIfRobot } from '../src/components/visuals/if-robot.ts';

describe('Grade 6 conditionals', () => {
  it('waters only the dry pots, as the lesson says: 3 of 5', () => {
    const steps = runIfRobot(IF_ROBOT_POTS);
    expect(steps).toHaveLength(5);
    expect(steps.filter((s) => s.water).map((s) => s.pot)).toEqual([0, 2, 3]);
  });
});
