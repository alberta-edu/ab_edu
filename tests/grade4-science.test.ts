import { describe, expect, it } from 'vitest';
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
