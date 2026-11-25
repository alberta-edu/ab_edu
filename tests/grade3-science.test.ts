import { describe, expect, it } from 'vitest';
import { flagAt, from, numAt, only, sceneIssues, sceneSvg, spriteSvg, type PlayScene, type RunScene, type Sprite } from '../src/components/visuals/g3-sprites.ts';

const runs = import.meta.glob<{ default: RunScene }>('../src/components/experiments/g3-scenes/*.ts', { eager: true });
const plays = import.meta.glob<{ default: PlayScene }>('../src/components/visuals/g3-plays/*.ts', { eager: true });

describe('Grade 3 sprite engine', () => {
  const sp: Sprite = { kind: 'emoji', text: 'A', x: 0, keys: [{ t: 0.5, x: 100 }, { t: 1, x: 100, text: 'B' }] };

  it('eases numbers between keys and holds them outside', () => {
    expect(numAt(sp, 'x', 0)).toBe(0);
    expect(numAt(sp, 'x', 0.25)).toBeCloseTo(50);
    expect(numAt(sp, 'x', 0.75)).toBe(100);
    expect(numAt(sp, 'y', 0.5, 7)).toBe(7);
  });

  it('switches text at its key, not before', () => {
    expect(flagAt(sp, 'text', 0.99)).toBe('A');
    expect(flagAt(sp, 'text', 1)).toBe('B');
  });

  it('draws nothing for an invisible sprite', () => {
    expect(spriteSvg({ kind: 'emoji', text: 'x', o: 0 }, 0)).toBe('');
    expect(spriteSvg({ kind: 'rect', x: 0, y: 0, w: 0, h: 10 }, 0)).toBe('');
    expect(spriteSvg({ kind: 'text', text: '<b>', x: 0, y: 0 }, 0)).toContain('&lt;b&gt;');
  });

  it('shows a play sprite only at its own states', () => {
    const a = only({ kind: 'emoji', text: 'a' }, 1, 3);
    expect(numAt(a, 'o', 0)).toBe(0);
    expect(numAt(a, 'o', 1)).toBe(1);
    expect(numAt(a, 'o', 2)).toBe(0);
    const b = from({ kind: 'emoji', text: 'b' }, 1, 4, 2);
    expect([0, 1, 2, 3].map((t) => numAt(b, 'o', t))).toEqual([0, 1, 1, 0]);
  });
});

describe('Grade 3 science scenes', () => {
  it('has experiment and visual scenes', () => {
    expect(Object.keys(runs).length).toBeGreaterThan(0);
    expect(Object.keys(plays).length).toBeGreaterThan(0);
  });

  for (const [file, m] of Object.entries(runs)) {
    it(`${file.split('/').pop()} plays cleanly from start to end`, () => {
      const sc = m.default;
      expect(sceneIssues(sc, 1)).toEqual([]);
      expect(sc.ms).toBeGreaterThan(1000);
      expect(sc.live.length).toBeGreaterThan(10);
      for (const t of [0, 0.5, 1]) expect(sceneSvg(sc, t)).not.toContain('NaN');
    });
  }

  for (const [file, m] of Object.entries(plays)) {
    it(`${file.split('/').pop()} has a sentence for every state`, () => {
      const sc = m.default;
      const last = sc.states.length - 1;
      expect(sc.states.length).toBeGreaterThan(1);
      expect(sceneIssues(sc, last)).toEqual([]);
      for (const s of sc.states) expect(s.say.split(/\s+/).length).toBeLessThanOrEqual(25);
      for (let t = 0; t <= last; t += 0.5) expect(sceneSvg(sc, t)).not.toContain('NaN');
    });
  }
});
