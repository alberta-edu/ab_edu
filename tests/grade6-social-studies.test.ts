import { describe, expect, it } from 'vitest';
import { BENCHES, councilSteps, totalChiefs } from '../src/components/visuals/grand-council.ts';
import { STAGES as ENGLAND_STAGES } from '../src/components/visuals/england-rights.ts';
import { GOV_SETS } from '../src/components/visuals/gov-branches.ts';
import { BODIES, castVotes, drawLots, tally, assemblySeats, ASSEMBLY_ROWS, TRIBES, PER_TRIBE, TRIBE_POOL, JURORS } from '../src/components/visuals/athens-assembly.ts';
import { STOPS } from '../src/components/visuals/democracy-stops.ts';
import { ATTICA, ATTICA_KM2, CALGARY_KM2, CITY_STATES, GREECE_FRAME, MED_FRAME, MOUNTAINS, REPUBLIC_44BCE, ROME, kmPerDegLon } from '../src/components/visuals/democracy-map.ts';
import { toMap, type LonLat, type MapFrame } from '../src/components/visuals/ancient-map.ts';

const onMap = (f: MapFrame, p: LonLat) => {
  const [x, y] = toMap(f, p);
  return x >= 0 && x <= f.width && y >= 0 && y <= f.height;
};

describe('Athens assembly', () => {
  it('decides by majority, and a tie fails', () => {
    expect(tally([true, true, false])).toEqual({ yes: 2, no: 1, passes: true });
    expect(tally([true, false])).toMatchObject({ passes: false });
  });

  it('casts the same votes for the same seed', () => {
    expect(castVotes(20, 0.5, 7)).toEqual(castVotes(20, 0.5, 7));
    expect(castVotes(200, 1, 3).every(Boolean)).toBe(true);
    expect(castVotes(200, 0, 3).some(Boolean)).toBe(false);
  });

  it('draws 5 different dots from each of 10 tribes: 50 of every 100, or 500 citizens', () => {
    const lots = drawLots(TRIBES, TRIBE_POOL, PER_TRIBE, 42);
    expect(lots).toHaveLength(10);
    for (const t of lots) {
      expect(new Set(t).size).toBe(PER_TRIBE);
      expect(t.every((i) => i >= 0 && i < TRIBE_POOL)).toBe(true);
    }
    expect(TRIBES * PER_TRIBE * 10).toBe(500);
  });

  it('seats every citizen on the hillside, and keeps juries odd', () => {
    const seats = assemblySeats(ASSEMBLY_ROWS, 220, 212, 62, 27);
    expect(seats).toHaveLength(ASSEMBLY_ROWS.reduce((a, b) => a + b, 0));
    expect(seats.every(([x, y]) => x > 0 && x < 440 && y > 0 && y < 212)).toBe(true);
    expect(ASSEMBLY_ROWS.reduce((a, b) => a + b, 0) % 2).toBe(1);
    expect(JURORS % 2).toBe(1);
    expect(BODIES.map((b) => b.id)).toEqual(['ecclesia', 'boule', 'dikasteria']);
  });
});

describe('democracy globe', () => {
  it('has unique stops at real coordinates, with Alberta marked as home', () => {
    expect(new Set(STOPS.map((s) => s.id)).size).toBe(STOPS.length);
    for (const s of STOPS) {
      expect(Math.abs(s.lat)).toBeLessThanOrEqual(90);
      expect(Math.abs(s.lon)).toBeLessThanOrEqual(180);
    }
    expect(STOPS.filter((s) => s.home).map((s) => s.id)).toEqual(['edmonton']);
    expect(STOPS[0].id).toBe('athens');
  });
});

describe('democracy map', () => {
  it('puts every place inside its frame', () => {
    for (const p of [...ATTICA, ...MOUNTAINS.map((m) => m.at), ...CITY_STATES.map((c) => c.at)]) expect(onMap(GREECE_FRAME, p)).toBe(true);
    expect(onMap(MED_FRAME, ROME)).toBe(true);
    expect(ATTICA.every((p) => onMap(MED_FRAME, p))).toBe(true);
    expect(REPUBLIC_44BCE.length).toBeGreaterThan(10);
  });

  it('says Attica is about three times the City of Calgary', () => {
    expect(Math.round(ATTICA_KM2 / CALGARY_KM2)).toBe(3);
    expect(kmPerDegLon(0)).toBeCloseTo(111.32);
    expect(kmPerDegLon(60)).toBeCloseTo(55.66);
  });
});

describe('branches of government', () => {
  it('gives Rome and Canada the same three branches, in order', () => {
    for (const set of Object.values(GOV_SETS)) {
      expect(set.branches.map((b) => b.id)).toEqual(['executive', 'legislative', 'judicial']);
      for (const b of set.branches) expect(b.items.length).toBeGreaterThan(0);
    }
  });

  it('names all four Roman assemblies, as the curriculum lists them', () => {
    const text = GOV_SETS.rome.branches[1].items.join(' ');
    for (const a of ['Senate', 'Comitia centuriata', 'Comitia tributa', 'Comitia curiata', 'Concilium plebis']) expect(text).toContain(a);
  });
});

describe('English rights balance', () => {
  it('tips steadily from the monarch toward Parliament, in date order', () => {
    const tilts = ENGLAND_STAGES.map((s) => s.tilt);
    for (let i = 1; i < tilts.length; i++) expect(tilts[i]).toBeGreaterThan(tilts[i - 1]);
    expect(tilts[0]).toBeLessThan(0);
    expect(tilts.at(-1)).toBeGreaterThan(0);
    expect(ENGLAND_STAGES.map((s) => s.year)).toEqual(['Before 1215', '1215', '1679', '1689']);
    for (const s of ENGLAND_STAGES.slice(1)) expect(s.principles.length).toBeGreaterThan(0);
  });
});

describe('Haudenosaunee Grand Council', () => {
  it('seats 50 Chiefs from the five founding Nations, as the Onondaga Nation lists them', () => {
    expect(totalChiefs()).toBe(50);
    expect(BENCHES.flatMap((b) => b.nations.map((n) => n.name)).sort()).toEqual(['Cayuga', 'Mohawk', 'Oneida', 'Onondaga', 'Seneca']);
  });

  it('starts and ends a matter with the Firekeepers, and goes back when the Younger Brothers disagree', () => {
    for (const disagree of [false, true]) {
      const steps = councilSteps(disagree);
      expect(steps[0].at).toBe('fire');
      expect(steps.at(-1)!.at).toBe('fire');
      expect(steps[1].at).toBe('elder');
    }
    expect(councilSteps(true).length).toBeGreaterThan(councilSteps(false).length);
  });
});
