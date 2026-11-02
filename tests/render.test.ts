import { describe, expect, it } from 'vitest';
import { md, mdInline, splitSentences, plain } from '../src/lib/render.ts';

describe('render', () => {
  it('renders math without letting Markdown touch the TeX', () => {
    const html = md('Half of *8* is \\(\\frac{8}{2}\\) and $4.50 stays money.');
    expect(html).toContain('<em>8</em>');
    expect(html).toContain('katex');
    expect(html).toContain('$4.50');
  });
  it('fails loudly on bad TeX', () => {
    expect(() => mdInline('\\(\\frac{1}{\\)')).toThrow(/KaTeX/);
  });
  it('splits sentences but keeps dialogue tags together', () => {
    expect(splitSentences('“Look at that arch,” Grandpa said. He smiled. “Leave your mitts.”')).toEqual([
      '“Look at that arch,” Grandpa said.',
      'He smiled.',
      '“Leave your mitts.”',
    ]);
    expect(splitSentences('“Mitts?” Grandpa called after her.')).toEqual(['“Mitts?” Grandpa called after her.']);
    expect(splitSentences('Mrs. Novak waved. Dr. Lee smiled.')).toEqual(['Mrs. Novak waved.', 'Dr. Lee smiled.']);
  });
  it('makes plain text for meta tags', () => {
    expect(plain('**Write** \\(\\frac{7}{4}\\) as a [mixed](x) number')).toBe('Write \\frac{7}{4} as a mixed number');
  });
});
