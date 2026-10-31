import { describe, expect, it } from 'vitest';
import { CIVS, CITY_PIECES, FALL_FACTORS, RISE_FACTORS, aliveText, civsAlive, yearText } from '../src/components/visuals/civ-data.ts';
import { levelY, reading } from '../src/components/visuals/nilometer.ts';
import { AFRICAN_CHAINS, AFRICA_FRAME, EMPIRES, EMPIRE_FRAME, TRADE_FRAME, TRADE_ROUTES, toMap, type LonLat, type MapFrame } from '../src/components/visuals/ancient-map.ts';
import { PEOPLE, farmersNeeded, villageState } from '../src/components/visuals/village-city.ts';
import { PYRAMIDS } from '../src/components/visuals/pyramid-data.ts';
import { TRAILS } from '../src/components/visuals/then-now-data.ts';
import { outcomeStatements } from '../src/lib/content.ts';

const onMap = (f: MapFrame, p: LonLat) => {
  const [x, y] = toMap(f, p);
  return x >= 0 && x <= f.width && y >= 0 && y <= f.height;
};

describe('civilization timeline', () => {
  it('writes BCE and CE years', () => {
    expect(yearText(-500)).toBe('500 BCE');
    expect(yearText(476)).toBe('476 CE');
  });

  it('lists the curriculum’s six example civilizations', () => {
    expect(CIVS.map((c) => c.id)).toEqual(['egypt', 'india', 'china', 'greece', 'rome', 'arab']);
  });

  it('knows who was alive at the same time', () => {
    const alive = (y: number) => civsAlive(y).map((c) => c.id);
    expect(alive(-3200)).toEqual([]);
    expect(alive(-2000)).toEqual(['egypt', 'india']);
    expect(alive(-100)).toEqual(['egypt', 'china', 'rome', 'arab']);
    expect(alive(450)).toEqual(['rome']);
  });

  it('says the right thing at both ends of the slider', () => {
    expect(aliveText(-3200)).toMatch(/had begun yet/);
    expect(aliveText(500)).toMatch(/had already ended/);
    expect(aliveText(-2000)).toBe('In 2000 BCE: Egypt, India (Indus Valley).');
  });
});

describe('nilometer', () => {
  it('follows the flood scale that Pliny recorded', () => {
    expect([12, 13, 14, 15, 16].map((c) => reading(c).word)).toEqual(['Hunger', 'Still hunger', 'Joy', 'Security', 'Delight']);
    expect(reading(10).word).toBe('Hunger');
    expect(reading(18).word).toBe('Too much');
  });

  it('expects the biggest harvest and tax at 16 cubits, which problem d1 relies on', () => {
    expect(reading(16).tax).toBeGreaterThan(reading(12).tax);
    expect(reading(16).harvest).toBeGreaterThan(reading(18).harvest);
  });

  it('draws a higher flood higher up', () => {
    expect(levelY(18)).toBeLessThan(levelY(10));
  });
});

describe('rise-and-fall city', () => {
  it('teaches exactly the factors the curriculum lists', () => {
    const [rise, fall] = outcomeStatements(5, 'social-studies', 'Fy8zbilfU0yzOlpS8c5Cdg');
    expect(RISE_FACTORS.map((f) => f.label.toLowerCase())).toEqual(rise.items);
    expect(FALL_FACTORS.map((f) => f.label.toLowerCase())).toEqual(fall.items);
  });

  it('gives each factor its own building, so every tap changes the picture', () => {
    for (const factors of [RISE_FACTORS, FALL_FACTORS]) expect(factors.map((f) => f.piece).sort()).toEqual([...CITY_PIECES].sort());
  });
});

describe('then-and-now trails', () => {
  it('follows all nine innovations and all three issues the curriculum lists', () => {
    expect(TRAILS.innovations).toHaveLength(9);
    expect(TRAILS.issues).toHaveLength(3);
  });

  it('ends every trail today', () => {
    for (const set of Object.values(TRAILS)) for (const t of set) expect(t.stops.at(-1)!.when).toBe('Today');
  });
});

describe('village to city', () => {
  it('needs fewer farmers with better tools', () => {
    const none = farmersNeeded(false, false);
    const one = farmersNeeded(true, false);
    const both = farmersNeeded(true, true);
    expect(farmersNeeded(false, true)).toBe(one);
    expect(one).toBeLessThan(none);
    expect(both).toBeLessThan(one);
  });

  it('feeds everyone with exactly the farmers needed, and not with one fewer', () => {
    for (const [i, o] of [[false, false], [true, false], [true, true]] as const) {
      const need = farmersNeeded(i, o);
      expect(villageState(need, i, o).hungry).toBe(false);
      expect(villageState(need - 1, i, o).hungry).toBe(true);
    }
  });

  it('opens new jobs and practices only when no one goes hungry', () => {
    const hungry = villageState(30, false, false);
    expect(hungry.jobs).toEqual([]);
    expect(hungry.practices).toEqual([]);
    expect(hungry.stage).toBe('Hungry village');
    const city = villageState(farmersNeeded(true, true), true, true);
    expect(city.stage).toBe('City');
    expect(city.practices).toEqual(['market', 'currency', 'bank', 'taxation']);
  });

  it('counts surplus as food beyond what the people eat', () => {
    expect(villageState(100, true, true).surplus).toBe(Math.round(100 * 2.475) - PEOPLE);
  });
});

describe('maps', () => {
  it('names the three routes the curriculum lists, on land and on water', () => {
    const names = TRADE_ROUTES.map((r) => r.name).join();
    for (const n of ['Silk Road', 'Royal Road', 'trans-Saharan']) expect(names).toContain(n);
    expect(new Set(TRADE_ROUTES.map((r) => r.kind))).toEqual(new Set(['land', 'water']));
  });

  it('keeps every route and stop on the map', () => {
    for (const r of TRADE_ROUTES) {
      for (const p of r.points) expect(onMap(TRADE_FRAME, p), `${r.id} ${p}`).toBe(true);
      for (const s of r.stops) expect(onMap(TRADE_FRAME, s.at), `${r.id} ${s.name}`).toBe(true);
    }
  });

  it('shows the empires and the African groups the curriculum lists', () => {
    expect(EMPIRES.map((e) => e.name)).toEqual(['Persia', 'Greece', 'Rome', 'Arab']);
    expect(AFRICAN_CHAINS.map((c) => c.places.map((p) => p.name).join())).toEqual(['Kush,Axum', 'Ghana,Mali,Songhai', 'Ife,Benin']);
    for (const e of EMPIRES) expect(onMap(EMPIRE_FRAME, e.home.at), e.id).toBe(true);
    for (const c of AFRICAN_CHAINS) for (const p of c.places) expect(onMap(AFRICA_FRAME, p.at), p.name).toBe(true);
  });

  it('puts each African group in time order', () => {
    for (const c of AFRICAN_CHAINS) {
      c.places.forEach((p, i) => {
        expect(p.from).toBeLessThan(p.to);
        if (i) expect(p.from).toBeGreaterThan(c.places[i - 1].from);
      });
    }
  });
});

describe('social pyramids', () => {
  it('has few people and the most power at the top, as the curriculum says', () => {
    for (const p of PYRAMIDS) {
      const top = p.classes[0];
      const bottom = p.classes.at(-1)!;
      expect(top.people).toBe(1);
      expect(top.power).toBe(5);
      expect(bottom.people).toBe(5);
      expect(bottom.power).toBe(1);
      expect(bottom.name).toMatch(/enslaved/i);
    }
  });
});
