import { describe, expect, it } from 'vitest';
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
