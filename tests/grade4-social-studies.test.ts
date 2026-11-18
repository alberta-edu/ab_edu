import { describe, expect, it } from 'vitest';
import { COLONIES, DOT_SETS, ERAS, EXPLORERS, FRAMES, OWNER_LABEL, type LonLat } from '../src/components/visuals/canada-map-data.ts';
import { project, thin } from '../src/components/visuals/canada-geo.ts';
import { POST_GOODS, START_PELTS, FORT_PARTS } from '../src/components/visuals/fur-trade-data.ts';
import { ASPECTS, GROUPS, LAWS, LENS } from '../src/components/visuals/law-lens-data.ts';

const finite = (pts: LonLat[]) => pts.every(([lon, lat]) => Number.isFinite(lon) && Number.isFinite(lat) && lon >= -180 && lon <= 0 && lat >= 0 && lat <= 90);
const inside = (frame: string, p: LonLat) => {
  const g = project(frame);
  const [x, y] = g.xy(p);
  return x >= 0 && x <= g.width && y >= 0 && y <= g.height;
};

describe('Grade 4 map data', () => {
  it('builds every area from real points', () => {
    for (const e of ERAS) for (const r of e.regions) expect(finite(r.area) && r.area.length >= 3, `${e.id} ${r.name}`).toBe(true);
    for (const c of COLONIES) expect(finite(c.area), c.name).toBe(true);
  });

  it('lists the eras in time order, ending at Confederation', () => {
    const years = ERAS.map((e) => Number(e.year));
    expect([...years].sort((a, b) => a - b)).toEqual(years);
    expect(years.at(-1)).toBe(1867);
    for (const e of ERAS) expect(e.regions.every((r) => r.owner in OWNER_LABEL)).toBe(true);
  });

  it('joins four provinces into Canada in 1867', () => {
    const canada = ERAS.find((e) => e.id === '1867')!.regions.filter((r) => r.owner === 'ca').map((r) => r.name);
    expect(canada.sort()).toEqual(['New Brunswick', 'Nova Scotia', 'Ontario', 'Quebec']);
  });

  it('puts every stop, label and dot inside its map', () => {
    for (const e of EXPLORERS) for (const s of e.stops) expect(inside('sea', s.at), `${e.id} ${s.name}`).toBe(true);
    for (const e of ERAS) for (const r of e.regions) if (r.label) expect(inside('east', r.label), `${e.id} ${r.name}`).toBe(true);
    for (const c of COLONIES) expect(inside('colonies', c.label), c.name).toBe(true);
    for (const [id, set] of Object.entries(DOT_SETS)) {
      expect(FRAMES[set.frame], id).toBeDefined();
      for (const d of set.dots) {
        expect(inside(set.frame, d.at), `${id} ${d.name}`).toBe(true);
        expect(d.year >= set.from && d.year <= set.to, `${id} ${d.name} year`).toBe(true);
        expect(set.groups.some((g) => g.id === d.group)).toBe(true);
      }
    }
  });

  it('uses the curriculum’s four explorers and four settlements', () => {
    expect(EXPLORERS.map((e) => e.name)).toEqual(['Giovanni Caboto', 'Jacques Cartier', 'Pierre Du Gua de Monts', 'Samuel de Champlain']);
    expect(DOT_SETS.settlements.dots.map((d) => `${d.name} ${d.year}`)).toEqual(['Port-Royal 1605', 'Quebec 1608', 'Trois-Rivières 1634', 'Montreal 1642']);
  });
});

describe('thinning a coastline', () => {
  it('drops points closer than the tolerance but keeps the ring closed', () => {
    expect(thin('M0,0L0.5,0L10,0L10,10L0,10Z', 1)).toBe('M0,0L10,0L10,10L0,10Z');
  });

  it('drops rings that become too small to see', () => {
    expect(thin('M0,0L0.2,0L0.2,0.2Z', 1)).toBe('');
  });

  it('keeps every projected map light enough for a phone', () => {
    for (const id of Object.keys(FRAMES)) expect(project(id).land.length, id).toBeLessThan(40000);
  });
});

describe('fur trade model', () => {
  it('never makes a rival post dearer, and lets a trapper afford every good', () => {
    for (const g of POST_GOODS) {
      expect(g.rival).toBeLessThanOrEqual(g.price);
      expect(g.price).toBeLessThanOrEqual(START_PELTS);
    }
    expect(POST_GOODS.some((g) => g.rival < g.price)).toBe(true);
  });

  it('shows the three jobs of a trading post', () => {
    const text = FORT_PARTS.map((p) => p.about).join(' ');
    for (const word of ['barter', 'stored', 'slept']) expect(text).toContain(word);
  });
});

describe('law lens', () => {
  it('says something about every group under every law', () => {
    for (const l of LAWS) for (const g of GROUPS) expect(Object.keys(LENS[l.id][g.id]).length, `${l.id} ${g.id}`).toBeGreaterThan(0);
  });

  it('covers all four ways of living from the curriculum', () => {
    const used = new Set(LAWS.flatMap((l) => GROUPS.flatMap((g) => Object.keys(LENS[l.id][g.id]))));
    expect([...used].sort()).toEqual(ASPECTS.map((a) => a.id).sort());
  });
});
