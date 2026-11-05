import { describe, expect, it } from 'vitest';
import { FLUIDS, THINGS, restingPlace } from '../src/components/visuals/float-shapes.ts';
import { forceDiagram } from '../src/components/visuals/force-arrows.ts';
import { balanceSvg, cylinderSvg } from '../src/components/visuals/measure-svg.ts';
import { harvestYears, SUSTAINABLE_MAX } from '../src/components/visuals/harvest.ts';
import { dateText, dayLength, hoursText, northernSeason, sunAltitude } from '../src/components/visuals/seasons.ts';
import { MONTH, litFraction, moonFace, phaseName } from '../src/components/visuals/moon.ts';
import { PUZZLES, codeSvg, countBlocks, describe as describeCode, runProgram, type Block } from '../src/components/visuals/block-code.ts';
import { analyse, distance, type Setup } from '../src/components/visuals/fair-test.ts';
import { CHANGES, START, score } from '../src/components/visuals/design-lab.ts';
import { PLACES, total } from '../src/components/visuals/climate-data.ts';
import { REGIONS } from '../src/components/visuals/energy-data.ts';
import { TOWNS, countCorrect, project } from '../src/components/visuals/weather-map.ts';
import { SYSTEMS, PART_JOBS, PART_CLASS, ORGANS, armPose, ARM_REST_LENGTH } from '../src/components/visuals/body-svg.ts';

describe('float or sink', () => {
  it('floats things less dense than the fluid, and sinks the rest', () => {
    expect(restingPlace(THINGS.cork, FLUIDS.fresh, 100, 250).floats).toBe(true);
    expect(restingPlace(THINGS.bolt, FLUIDS.fresh, 100, 250).floats).toBe(false);
  });

  it('matches the lesson: an egg sinks in tap water and floats in salt water', () => {
    expect(restingPlace(THINGS.egg, FLUIDS.fresh, 100, 250).floats).toBe(false);
    expect(restingPlace(THINGS.egg, FLUIDS.salt, 100, 250).floats).toBe(true);
  });

  it('matches the lesson: the same clay sinks as a ball and floats as a boat', () => {
    expect(restingPlace(THINGS['clay-ball'], FLUIDS.fresh, 100, 250).floats).toBe(false);
    expect(restingPlace(THINGS['clay-boat'], FLUIDS.fresh, 100, 250).floats).toBe(true);
  });

  it('gives a floating object a buoyant force equal to its weight, and a sinking one less', () => {
    expect(restingPlace(THINGS.wood, FLUIDS.fresh, 100, 250).buoyant).toBe(1);
    expect(restingPlace(THINGS.bolt, FLUIDS.fresh, 100, 250).buoyant).toBeLessThan(1);
  });
});

describe('science figures', () => {
  it('sizes a force diagram to fit its arrows', () => {
    const viewWidth = (svg: string) => Number(/viewBox="\S+ \S+ (\d+)/.exec(svg)![1]);
    expect(viewWidth(forceDiagram('stone', [{ kind: 'weight' }]))).toBeLessThan(viewWidth(forceDiagram('stone', [{ kind: 'thrust' }, { kind: 'drag' }])));
  });

  it('describes a balance for screen readers', () => {
    expect(balanceSvg(['A'], ['B'], 'left')).toContain('The left side is lower.');
    expect(balanceSvg(['Rock'], ['100 g'], 'none')).toContain('The balance is level.');
  });

  it('numbers a cylinder only at its major marks', () => {
    const svg = cylinderSvg(100, 2, 10, 64);
    expect(svg.match(/mt-num/g)).toHaveLength(10);
    expect(svg.match(/mt-tick/g)!.length).toBeGreaterThan(50);
  });
});

describe('sustainable harvesting', () => {
  it('keeps the population stable for the catch the lesson says is stable', () => {
    const p = harvestYears(800, 100, 30);
    expect(Math.abs(p[30] - p[25])).toBeLessThanOrEqual(5);
    expect(p[30]).toBeGreaterThan(500);
  });

  it('empties the lake at 200 fish a year, in about 11 years as the lesson says', () => {
    expect(harvestYears(800, 200, 30).indexOf(0)).toBe(11);
  });

  it('never goes below zero', () => {
    expect(Math.min(...harvestYears(800, 250, 30))).toBe(0);
    expect(SUSTAINABLE_MAX).toBe(150);
  });
});

describe('seasons', () => {
  const JUNE = 171;
  const DEC = 354;

  it('gives Edmonton the day lengths stated in the lesson', () => {
    expect(dayLength(53.5, JUNE)).toBeCloseTo(17, 0);
    expect(dayLength(53.5, DEC)).toBeGreaterThan(7);
    expect(dayLength(53.5, DEC)).toBeLessThan(8);
  });

  it('gives Inuvik the midnight sun and the polar night', () => {
    expect(dayLength(68.4, JUNE)).toBe(24);
    expect(dayLength(68.4, DEC)).toBe(0);
    expect(sunAltitude(68.4, JUNE, 0)).toBeGreaterThan(0);
    expect(sunAltitude(53.5, JUNE, 0)).toBeLessThan(0);
  });

  it('gives the two hemispheres opposite long and short days', () => {
    expect(dayLength(-43.5, JUNE)).toBeLessThan(12);
    expect(dayLength(-43.5, DEC)).toBeGreaterThan(12);
  });

  it('names dates and seasons', () => {
    expect(dateText(JUNE)).toBe('June 21');
    expect(dateText(0)).toBe('January 1');
    expect(northernSeason(JUNE)).toBe('summer');
    expect(northernSeason(DEC)).toBe('winter');
    expect(northernSeason(100)).toBe('spring');
    expect(northernSeason(300)).toBe('fall');
    expect(hoursText(7.5)).toBe('7 h 30 min');
    expect(hoursText(24)).toBe('24 h');
  });
});

describe('Moon phases', () => {
  it('names the main phases through the cycle', () => {
    expect(phaseName(0)).toBe('New Moon');
    expect(phaseName(MONTH / 4)).toBe('First quarter');
    expect(phaseName(MONTH / 2)).toBe('Full Moon');
    expect(phaseName((3 * MONTH) / 4)).toBe('Third quarter');
    expect(phaseName(MONTH - 0.1)).toBe('New Moon');
  });

  it('lights nothing at new Moon, half at the quarters and all at full Moon', () => {
    expect(litFraction(0)).toBeCloseTo(0);
    expect(litFraction(MONTH / 4)).toBeCloseTo(0.5);
    expect(litFraction(MONTH / 2)).toBeCloseTo(1);
  });

  it('lights a waxing Moon on the right and a waning Moon on the left', () => {
    expect(moonFace(3, 0, 0, 10)).toContain('scale(1 1)');
    expect(moonFace(20, 0, 0, 10)).toContain('scale(-1 1)');
    expect(moonFace(0, 0, 0, 10)).not.toContain('mn-lit');
  });
});

describe('block code', () => {
  const puzzle = (id: string) => PUZZLES.find((p) => p.id === id)!;

  it('counts the blocks inside a loop', () => {
    expect(countBlocks(['move', { repeat: 4, body: ['move', 'left'] }])).toBe(4);
  });

  it('turns and moves the robot', () => {
    const { steps } = runProgram(['move', 'right', 'move'], { ...puzzle('line'), start: [0, 0], dir: 0 });
    expect(steps.at(-1)).toMatchObject({ x: 1, y: 1, dir: 1 });
  });

  it('has a solution for every puzzle, within its block limit', () => {
    const solutions: Record<string, Block[]> = {
      line: [{ repeat: 5, body: ['move'] }],
      turn: ['move', 'move', 'move', 'left', 'move', 'move', 'move', 'move'],
      stairs: [{ repeat: 4, body: ['move', 'left', 'move', 'right'] }],
    };
    for (const p of PUZZLES) {
      expect(runProgram(solutions[p.id], p).result).toBe('goal');
      if (p.maxBlocks) expect(countBlocks(solutions[p.id])).toBeLessThanOrEqual(p.maxBlocks);
    }
  });

  it('stops at walls and edges, and reports a program that falls short', () => {
    expect(runProgram(['move', 'move'], puzzle('stairs')).result).toBe('wall');
    expect(runProgram([{ repeat: 6, body: ['move'] }], puzzle('line')).result).toBe('edge');
    expect(runProgram(['move'], puzzle('line')).result).toBe('short');
  });

  it('keeps every puzzle goal clear of walls', () => {
    for (const p of PUZZLES) expect((p.walls ?? []).some(([x, y]) => x === p.goal[0] && y === p.goal[1])).toBe(false);
  });

  it('draws and describes code', () => {
    const code: Block[] = [{ repeat: 3, body: ['move', 'right'] }];
    expect(codeSvg(code)).toContain('repeat 3 times');
    expect(describeCode(code)).toBe('repeat 3 times (move forward, then turn right)');
  });
});

describe('fair test', () => {
  const a: Setup = { height: 'low', surface: 'wood', load: 'empty' };

  it('calls one change a fair test and names the variables', () => {
    const r = analyse(a, { ...a, height: 'high' });
    expect(r.fair).toBe(true);
    expect(r.changed).toEqual(['height']);
    expect(r.message).toContain('Manipulated variable: ramp height');
    expect(r.message).toContain('Controlled variables: floor surface and car load');
  });

  it('rejects two changes, and rejects no change', () => {
    expect(analyse(a, { ...a, height: 'high', surface: 'carpet' }).fair).toBe(false);
    expect(analyse(a, a).fair).toBe(false);
  });

  it('gives the distances quoted in the lesson and its problems', () => {
    expect(distance({ height: 'low', surface: 'wood', load: 'empty' })).toBe(100);
    expect(distance({ height: 'medium', surface: 'wood', load: 'empty' })).toBe(160);
    expect(distance({ height: 'high', surface: 'wood', load: 'empty' })).toBe(220);
    expect(distance({ height: 'medium', surface: 'carpet', load: 'empty' })).toBe(72);
    expect(distance({ height: 'high', surface: 'wood', load: 'carrying clay' })).toBe(227);
  });

  it('finds that the load has very little effect', () => {
    expect(analyse(a, { ...a, load: 'carrying clay' }).message).toContain('very little effect');
  });
});

describe('design lab', () => {
  it('starts from the starting scores', () => {
    expect(score([])).toEqual(START);
  });

  it('applies a change, including its trade-off', () => {
    const s = score(['thin']);
    expect(s.efficiency).toBeGreaterThan(START.efficiency);
    expect(s.reliability).toBeLessThan(START.reliability);
  });

  it('keeps every score between 0 and 5 with all changes applied', () => {
    for (const v of Object.values(score(CHANGES.map((c) => c.id)))) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(5);
    }
  });
});

describe('science data', () => {
  it('has 12 months of climate data for every place, within the chart scales', () => {
    for (const p of PLACES) {
      expect(p.temp).toHaveLength(12);
      expect(p.precip).toHaveLength(12);
      expect(Math.min(...p.temp)).toBeGreaterThanOrEqual(-30);
      expect(Math.max(...p.temp)).toBeLessThanOrEqual(30);
      expect(Math.max(...p.precip)).toBeLessThanOrEqual(350);
    }
  });

  it('shows what the lesson says about the climates', () => {
    const at = (id: string) => PLACES.find((p) => p.id === id)!;
    expect(total(at('cairo').precip)).toBeLessThan(50);
    expect(total(at('vancouver').precip)).toBeGreaterThan(total(at('edmonton').precip));
    expect(at('vancouver').temp[0]).toBeGreaterThan(at('edmonton').temp[0]);
    // The Iqaluit problem and the Edmonton and Vancouver model answer quote these numbers.
    expect(at('iqaluit').temp[0]).toBe(-26);
    expect(at('iqaluit').temp[6]).toBe(8);
    expect(total(at('iqaluit').precip)).toBeGreaterThan(340);
    expect(total(at('iqaluit').precip)).toBeLessThan(380);
    expect(at('edmonton').temp[0]).toBe(-10);
    expect(at('vancouver').temp[0]).toBe(4);
    for (const m of [0, 10, 11]) expect(at('vancouver').precip[m]).toBeGreaterThan(150);
  });

  it('lists all 13 provinces and territories on the energy map, without overlaps', () => {
    expect(new Set(REGIONS.map((r) => r.id)).size).toBe(13);
    for (const a of REGIONS)
      for (const b of REGIONS) {
        if (a === b) continue;
        const overlap = a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
        expect(overlap, `${a.id} overlaps ${b.id}`).toBe(false);
      }
  });

  it('scores a weather map and keeps its towns on the canvas', () => {
    const all = Object.fromEntries(TOWNS.map((t) => [t.id, t.sky]));
    expect(countCorrect(all)).toBe(TOWNS.length);
    expect(countCorrect({})).toBe(0);
    for (const t of TOWNS) {
      const [x, y] = project(t.lat, t.lon);
      expect(x).toBeGreaterThan(0);
      expect(x).toBeLessThan(300);
      expect(y).toBeGreaterThan(0);
      expect(y).toBeLessThan(450);
    }
  });
});

describe('body systems', () => {
  it('gives every major part a job and a drawing', () => {
    for (const s of SYSTEMS) {
      for (const part of s.parts) {
        expect(PART_JOBS[part], part).toBeTruthy();
        expect(ORGANS[s.id], part).toMatch(new RegExp(`class="[^"]*\\b${PART_CLASS[part]}\\b`));
      }
    }
  });
  it('shortens the muscle as the arm bends', () => {
    const lengths = [0, 0.25, 0.5, 0.75, 1].map((p) => armPose(p).length);
    expect(lengths[0]).toBeCloseTo(ARM_REST_LENGTH);
    for (let i = 1; i < lengths.length; i++) expect(lengths[i]).toBeLessThan(lengths[i - 1]);
    // The hand swings up from below the elbow to above it, and stays in the picture.
    expect(armPose(0).hand.y).toBeGreaterThan(armPose(0).elbow.y);
    expect(armPose(1).hand.y).toBeLessThan(armPose(1).elbow.y);
    for (const p of [0, 0.5, 1]) expect(armPose(p).hand.x + 18).toBeLessThan(280);
  });
});
