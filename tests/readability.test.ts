import { describe, expect, it } from 'vitest';
import { blobIssue, lessonBlobs, proseParagraphs, sentenceCount, wordCount } from '../src/lib/readability.ts';
import { loadConcepts } from '../src/lib/content.ts';
import { guideText, notesFor, notesText, subjectGuide } from '../src/lib/educator.ts';
import { SUBJECTS } from '../src/site.ts';
import type { Concept } from '../src/lib/schema.ts';

describe('readability', () => {
  it('counts sentences without splitting decimals, math or abbreviations', () => {
    expect(sentenceCount('Round 4.07 to 4.1. Then stop.')).toBe(2);
    expect(sentenceCount('Ms. Lee buys 5 packs. Mr. Ng buys 2.')).toBe(2);
    expect(sentenceCount('Solve \\(3 \\times b = 12\\). It is 4.')).toBe(2);
    expect(sentenceCount('Who wrote it? Why? Is it up to date?')).toBe(3);
  });
  it('counts math as one word', () => {
    expect(wordCount('So \\(\\frac{7}{4} = 1\\frac{3}{4}\\) here')).toBe(3);
  });
  it('skips lists, tables and display math', () => {
    expect(proseParagraphs('Intro.\n\n- one\n- two\n\n| a | b |\n|---|---|\n\n\\[1 + 1\\]')).toEqual(['Intro.']);
  });
  it('lets a few short sentences through', () => {
    expect(blobIssue('Who wrote it? Why? Is it up to date? Do other sources agree?')).toBeNull();
    expect(blobIssue('Look closely. Then decide.')).toBeNull();
  });
  it('flags a paragraph that explains a process in many sentences', () => {
    const blob = "Look at the digit **just to the right** of the place you're rounding to. If it is **5 or more**, round up. If it is **4 or less**, keep the digit.";
    expect(blobIssue(blob)).toMatch(/3 sentences/);
    expect(blobIssue('1. Find the place.\n2. Look one digit to the right.\n3. 5 or more: round up. 4 or less: keep it.')).toBeNull();
  });
  it('flags any very long paragraph or list item', () => {
    expect(blobIssue(Array(45).fill('word').join(' '))).toMatch(/45 words/);
    expect(blobIssue(`- ${Array(45).fill('word').join(' ')}`)).toMatch(/list item of 45 words/);
  });
  it('leaves quotes to be read aloud as written', () => {
    expect(blobIssue('Read this:\n\n> One. Two three four five six seven. Eight nine ten eleven twelve. Thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty.')).toBeNull();
  });
  it('finds a blob in a lesson block and names its step', () => {
    const c = {
      bigIdea: 'Short.',
      lesson: [{ title: 'Rounding', blocks: [{ type: 'callout', variant: 'tip', title: 'How', covers: ['S1.7'], body: "Look at the digit **just to the right** of the place you're rounding to. If it is **5 or more**, round up. If it is **4 or less**, keep the digit." }] }],
    } as unknown as Concept;
    expect(lessonBlobs(c)).toEqual([expect.stringMatching(/^step 1 "Rounding", block 1 \(callout\)/)]);
  });
  it('passes every lesson, note and subject guide on the site', () => {
    const concepts = loadConcepts(5);
    for (const c of concepts) {
      expect(lessonBlobs(c), c.id).toEqual([]);
      const n = notesFor(c);
      if (n) expect(notesText(n).filter((t) => blobIssue(t)), `${c.id} notes`).toEqual([]);
    }
    for (const s of SUBJECTS) {
      const g = subjectGuide(s.slug);
      if (g) expect(guideText(g).filter((t) => blobIssue(t)), `${s.slug} guide`).toEqual([]);
    }
  });
});
