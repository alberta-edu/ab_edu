import { describe, expect, it } from 'vitest';
import { resolveRef, gradeRank, loadAllConcepts, outcomeStatements } from '../src/lib/content.ts';

const particle = { subject: 'science' as const, outcomes: ['SCI5-OI1-GQ1-LO1'] };

describe('curriculum references', () => {
  it('resolves a statement of the concept outcome', () => {
    const st = resolveRef(particle, 'K1.5');
    expect(st.grade).toBe('5');
    expect(st.text).toMatch(/strongest in solids and weakest in gases/);
  });
  it('resolves earlier and later grades so the verifier can tell them apart', () => {
    expect(gradeRank(resolveRef(particle, 'SCI3-OI1-GQ1-LO1#K3.3').grade)).toBe(3);
    // Heating makes particles move faster: Grade 6 content, not allowed in Grade 5.
    const later = resolveRef(particle, 'SCI6-OI1-GQ1-LO1#K1.1');
    expect(later.text).toMatch(/heating matter causes particles to move faster/);
    expect(gradeRank(later.grade)).toBeGreaterThan(gradeRank('5'));
  });
  it('rejects references to statements that do not exist', () => {
    expect(() => resolveRef(particle, 'K9.1')).toThrow();
    expect(() => resolveRef(particle, 'NOPE#K1.1')).toThrow();
    expect(() => resolveRef(particle, 'X1.1')).toThrow();
  });
  it('lists every statement of an outcome with its reference', () => {
    const refs = outcomeStatements(5, 'math', 'MAT5-OI1-GQ5-LO1').map((s) => s.ref);
    expect(refs).toEqual(['K1.1', 'K1.2', 'K1.3', 'K1.4', 'U1.1', 'U1.2', 'S1.1', 'S1.2', 'S1.3', 'S1.4', 'S1.5', 'S1.6']);
  });
  it('every block and problem references only its own grade or earlier', () => {
    for (const c of loadAllConcepts()) {
      const refs = [
        ...c.lesson.flatMap((s) => s.blocks.flatMap((b) => ('covers' in b ? b.covers : []))),
        ...c.problems.flatMap((p) => p.covers),
      ];
      for (const r of refs) expect(gradeRank(resolveRef(c, r).grade), `${c.id}: ${r}`).toBeLessThanOrEqual(c.grade);
    }
  });
});
