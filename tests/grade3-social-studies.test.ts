import { describe, expect, it } from 'vitest';
import { CATALOGUE, nextTarget, pickItems } from '../src/components/visuals/g3ss-alberta-data.ts';
import { afterNature, afterUse, joinNames, message, status, USE } from '../src/components/visuals/g3ss-refill.ts';
import { countAt } from '../src/components/visuals/g3ss-boomtown.ts';
import { allFound, judge, pickSpots, SPOTS } from '../src/components/visuals/g3ss-town-data.ts';
import { PARTS, pickParts } from '../src/components/visuals/g3ss-shield.ts';
import { checkActions, levels, METERS } from '../src/components/visuals/g3ss-life.ts';
import { BIN, donate, GIVE, PACK, volunteer, type Drive } from '../src/components/visuals/g3ss-food-drive.ts';

describe('Grade 3 Alberta map data', () => {
  it('gives every item a unique id within its layer', () => {
    for (const items of Object.values(CATALOGUE)) expect(new Set(items.map((i) => i.id)).size).toBe(items.length);
  });

  it('keeps every place inside the map frame', () => {
    for (const items of Object.values(CATALOGUE))
      for (const { at } of items) {
        expect(at[0]).toBeGreaterThanOrEqual(0);
        expect(at[0]).toBeLessThanOrEqual(280);
        expect(at[1]).toBeGreaterThanOrEqual(0);
        expect(at[1]).toBeLessThanOrEqual(460);
      }
  });

  it('picks items in the lesson order and rejects a typo', () => {
    expect(pickItems('places', ['calgary', 'edmonton']).map((p) => p.name)).toEqual(['Calgary', 'Edmonton']);
    expect(() => pickItems('places', ['edmonten'])).toThrow();
  });

  it('asks for the first item not yet found', () => {
    expect(nextTarget(['a', 'b', 'c'], new Set(['a']))).toBe('b');
    expect(nextTarget(['a', 'b'], new Set(['a', 'b']))).toBeNull();
  });
});

describe('Grade 3 use-it-up tanks', () => {
  it('refills renewable resources and leaves the others down', () => {
    expect(afterNature(afterUse(100), true)).toBe(100);
    expect(afterNature(afterUse(100), false)).toBe(100 - USE);
  });

  it('runs a non-renewable tank dry in a few presses, never below zero', () => {
    let lv = 100;
    let presses = 0;
    while (lv > 0) {
      lv = afterNature(afterUse(lv), false);
      presses++;
    }
    expect(lv).toBe(0);
    expect(presses).toBe(3);
    expect(afterUse(0)).toBe(0);
  });

  it('tags each tank', () => {
    expect(status(100, true)).toBe('back');
    expect(status(60, false)).toBe('low');
    expect(status(0, false)).toBe('gone');
  });

  it('writes the message from the resource names', () => {
    expect(joinNames(['sun', 'wind', 'water'])).toBe('sun, wind and water');
    expect(joinNames(['oil'])).toBe('oil');
    expect(message(['sun', 'wind'], ['coal', 'oil'], false)).toBe('Sun and wind came back. Coal and oil did not.');
    expect(message(['sun', 'water'], ['coal', 'natural gas'], true)).toBe('Coal and natural gas are all used up. Sun and water keep coming back.');
  });
});

describe('Grade 3 growing town', () => {
  it('climbs from the first count to the last', () => {
    expect(countAt(920, 1842, 0)).toBe(920);
    expect(countAt(920, 1842, 0.5)).toBe(1381);
    expect(countAt(920, 1842, 1)).toBe(1842);
    expect(countAt(920, 1842, 2)).toBe(1842);
  });
});

describe('Grade 3 town to tap', () => {
  it('has unique places and rejects a typo', () => {
    expect(new Set(SPOTS.map((s) => s.id)).size).toBe(SPOTS.length);
    expect(pickSpots(['school', 'fire']).map((s) => s.name)).toEqual(['School', 'Fire hall']);
    expect(() => pickSpots(['firehall'])).toThrow();
  });

  it('judges taps in the find game', () => {
    const answer = ['school', 'hospital'];
    const found = new Set<string>();
    expect(judge('fire', answer, found)).toBe('wrong');
    expect(judge('school', answer, found)).toBe('right');
    found.add('school');
    expect(judge('school', answer, found)).toBe('again');
    expect(allFound(answer, found)).toBe(false);
    found.add('hospital');
    expect(allFound(answer, found)).toBe(true);
  });
});

describe('Grade 3 shield builder', () => {
  it('knows every part of the shield and rejects a typo', () => {
    expect(Object.keys(PARTS)).toEqual(['cross', 'mountains', 'hills', 'prairie', 'wheat']);
    expect(pickParts(['wheat', 'cross']).map((p) => p.id)).toEqual(['wheat', 'cross']);
    expect(() => pickParts(['beaver'])).toThrow();
  });
});

describe('Grade 3 quality-of-life meters', () => {
  const actions = [{ adds: ['safety', 'comfort'] }, { adds: ['safety'] }, { adds: ['happiness'] }];

  it('fills each meter by the share of its actions done', () => {
    expect(levels(actions, new Set())).toEqual({ safety: 0, comfort: 0, health: 0, happiness: 0 });
    expect(levels(actions, new Set([0]))).toEqual({ safety: 0.5, comfort: 1, health: 0, happiness: 0 });
    expect(levels(actions, new Set([0, 1, 2])).safety).toBe(1);
  });

  it('has the four parts of quality of life and rejects an unknown meter', () => {
    expect(METERS.map((m) => m.id)).toEqual(['safety', 'comfort', 'health', 'happiness']);
    expect(() => checkActions([{ adds: ['wealth'] }])).toThrow();
  });
});

describe('Grade 3 food bank', () => {
  const empty: Drive = { cans: 0, hampers: 0 };

  it('needs donations before volunteers can pack', () => {
    expect(volunteer(empty).result).toBe('empty');
    const given = donate(empty).drive;
    expect(given.cans).toBe(GIVE);
    const packed = volunteer(given);
    expect(packed.result).toBe('packed');
    expect(packed.drive).toEqual({ cans: GIVE - PACK, hampers: 1 });
  });

  it('fills the bin until volunteers empty it', () => {
    let d = empty;
    for (let i = 0; i < BIN / GIVE; i++) d = donate(d).drive;
    expect(d.cans).toBe(BIN);
    expect(donate(d).result).toBe('full');
  });
});
