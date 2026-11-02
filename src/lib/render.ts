// Build-time Markdown + KaTeX rendering. Never shipped to the browser.
import katex from 'katex';
import { Marked } from 'marked';

const marked = new Marked({ gfm: true, breaks: false });

// Full-size fractions everywhere: an inline \frac is too small for young readers.
const MACROS = { '\\frac': '\\dfrac' };

const MATH = /\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)/g;

function renderMath(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex.trim(), { displayMode, throwOnError: true, output: 'htmlAndMathml', macros: MACROS });
  } catch (e) {
    throw new Error(`KaTeX error in "${tex}": ${(e as Error).message}`);
  }
}

/** Swaps math out for placeholders so Markdown can't mangle the TeX, then swaps the rendered math back in. */
function withMath(src: string, render: (s: string) => string): string {
  const parts: string[] = [];
  const masked = src.replace(MATH, (_, display: string | undefined, inline: string | undefined) => {
    parts.push(display !== undefined ? renderMath(display, true) : renderMath(inline!, false));
    return `KXMATH${parts.length - 1}XK`;
  });
  // Canadian style groups digits with spaces (345 678). Keep a number on one line.
  const grouped = masked.replace(/(\d) (?=\d{3}(?!\d))/g, '$1 ');
  return render(grouped).replace(/KXMATH(\d+)XK/g, (_, i) => parts[Number(i)]);
}

/** Block Markdown (paragraphs, lists, tables). */
export function md(src: string): string {
  return withMath(src, (s) => marked.parse(s, { async: false }));
}

/** Inline Markdown: no wrapping <p>. For choices, table cells, titles. */
export function mdInline(src: string): string {
  return withMath(src, (s) => marked.parseInline(s, { async: false }));
}

/** Plain text for meta tags and JSON-LD. Math is kept as its TeX source. */
export function plain(src: string): string {
  return src
    .replace(MATH, (_, a: string | undefined, b: string | undefined) => (a ?? b ?? '').trim())
    .replace(/[*_`#>]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Splits a paragraph into sentences for evidence questions. A sentence ends at . ! or ?,
 * optionally followed by a closing quote, when the next word starts with a capital or an
 * opening quote. Dialogue tags ("Wait?" she asked.) stay in one sentence.
 */
export function splitSentences(paragraph: string): string[] {
  const parts = paragraph
    .trim()
    .split(/(?<=[.!?]["”’)]?)\s+(?=["“‘(]?[A-Z0-9])/)
    .map((s) => s.trim())
    .filter(Boolean);
  // “Mitts?” Grandpa called. → one sentence: a question or exclamation in quotes followed by a speech tag.
  const out: string[] = [];
  for (const p of parts) {
    const prev = out.at(-1);
    if (prev && ((/[?!]["”]$/.test(prev) && SPEECH_TAG.test(p)) || TITLE_END.test(prev))) out[out.length - 1] = `${prev} ${p}`;
    else out.push(p);
  }
  return out;
}

/** A title at the end of a piece means the split was wrong: "Mrs." and "Novak waved" are one sentence. */
const TITLE_END = /(?:Mrs|Mr|Ms|Dr|St|Prof)\.$/;

const SPEECH_TAG = /^(?:\S+\s){1,3}?(?:said|says|asked|called|shouted|whispered|replied|yelled|cried|answered|laughed|added)\b/i;
