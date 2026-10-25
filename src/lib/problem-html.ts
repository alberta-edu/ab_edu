// Renders a problem to static HTML. Concept pages and the review data feed share it, so a
// problem looks and behaves the same everywhere. The <problem-card> element
// (src/client/problem-card.ts) adds the interactivity.
import type { CheckSpec } from './check.ts';
import type { Concept, Passage, Problem } from './schema.ts';
import { md, mdInline, splitSentences } from './render.ts';
import { LEVELS } from '../site.ts';
import { renderFigure } from './figures.ts';

export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Deterministic shuffle so the page is the same on every build and with JavaScript off. */
export function seededOrder(n: number, seed: string): number[] {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const rand = () => {
    h = Math.imul(h ^ (h >>> 15), h | 1);
    h ^= h + Math.imul(h ^ (h >>> 7), h | 61);
    return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
  };
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

export const conceptKey = (c: Pick<Concept, 'grade' | 'id'>) => `g${c.grade}/${c.id}`;
export const problemKey = (c: Pick<Concept, 'grade' | 'id'>, p: Pick<Problem, 'id'>) => `${conceptKey(c)}/${p.id}`;

const LETTERS = 'ABCDEFGH';

export function levelBadge(level: 1 | 2 | 3): string {
  const l = LEVELS[level];
  const stars = [1, 2, 3].map((i) => `<span class="star${i > l.stars ? ' star--off' : ''}">★</span>`).join('');
  return `<span class="level-badge level-badge--${level}"><span class="level-badge__stars" aria-hidden="true">${stars}</span> ${l.name}<span class="sr-only"> (${l.difficulty})</span></span>`;
}

export function passageSentences(p: Passage) {
  return p.paragraphs.map((para, i) => splitSentences(para).map((text, j) => ({ id: `p${i + 1}s${j + 1}`, text })));
}

function choicesHtml(
  key: string,
  type: 'radio' | 'checkbox',
  choices: string[],
  order: number[],
  feedback: Record<string, string>,
): string {
  const items = order
    .map(
      (orig, shown) => `
      <label class="choice">
        <input type="${type}" name="${esc(key)}" value="${shown}">
        <span class="choice__mark" aria-hidden="true">${LETTERS[shown]}</span>
        <span class="choice__text">${mdInline(choices[orig])}</span>
      </label>`,
    )
    .join('');
  const fb = order
    .map((orig, shown) => (feedback[String(orig)] ? `<div class="choice-fb" data-choice="${shown}" hidden>${md(feedback[String(orig)])}</div>` : ''))
    .join('');
  return `<fieldset class="choices"><legend class="sr-only">Choices</legend>${items}</fieldset><div class="choice-fbs">${fb}</div>`;
}

function inputHtml(key: string, mode: 'decimal' | 'text', unit?: string, help?: string): string {
  const id = `in-${key.replace(/[^a-z0-9]/gi, '-')}`;
  return `
    <div class="answer-row">
      <label class="answer-row__label" for="${id}">Your answer</label>
      <input class="answer-row__input" id="${id}" type="text" inputmode="${mode}" autocomplete="off" autocapitalize="off" spellcheck="false">
      ${unit ? `<span class="answer-row__unit">${esc(unit)}</span>` : ''}
    </div>
    ${help ? `<p class="answer-help">${help}</p>` : ''}`;
}

export function renderProblem(concept: Concept, p: Problem, number: number): string {
  const key = problemKey(concept, p);
  const domId = `q-${key.replace(/\//g, '-')}`;
  let body = '';
  let spec: CheckSpec;

  switch (p.type) {
    case 'mc':
    case 'multi': {
      const order = p.fixedOrder ? p.choices.map((_, i) => i) : seededOrder(p.choices.length, key);
      const shownIndex = (orig: number) => order.indexOf(orig);
      body = choicesHtml(key, p.type === 'mc' ? 'radio' : 'checkbox', p.choices, order, p.feedback);
      spec =
        p.type === 'mc'
          ? { type: 'mc', answer: shownIndex(p.answer) }
          : { type: 'multi', answer: p.answer.map(shownIndex) };
      if (p.type === 'multi') body = `<p class="answer-help">Select all that apply.</p>` + body;
      break;
    }
    case 'number':
      body = inputHtml(key, 'decimal', p.unit);
      spec = { type: 'number', answer: p.answer, tolerance: p.tolerance, unit: p.unit };
      break;
    case 'fraction':
      body = inputHtml(
        key,
        'text',
        undefined,
        'Type a fraction like <kbd>11/4</kbd> or a mixed number like <kbd>2 3/4</kbd> (whole number, space, fraction).',
      );
      spec = { type: 'fraction', answer: p.answer, form: p.form };
      break;
    case 'text':
      body = inputHtml(key, 'text');
      spec = { type: 'text', accept: p.accept, caseSensitive: p.caseSensitive };
      break;
    case 'order': {
      let order = seededOrder(p.items.length, key);
      if (order.every((v, i) => v === i)) order = [...order.slice(1), order[0]];
      const items = order
        .map(
          (orig) => `
          <li class="order-item" data-orig="${orig}">
            <span class="order-item__text">${mdInline(p.items[orig])}</span>
            <span class="order-item__moves">
              <button type="button" class="icon-btn" data-move="-1" aria-label="Move up">▲</button>
              <button type="button" class="icon-btn" data-move="1" aria-label="Move down">▼</button>
            </span>
          </li>`,
        )
        .join('');
      body = `<p class="answer-help">Use ▲ and ▼ to put these in order, first at the top.</p><ol class="order-list">${items}</ol>`;
      spec = { type: 'order', count: p.items.length };
      break;
    }
    case 'evidence': {
      const passage = concept.lesson.flatMap((s) => s.blocks).find((b): b is Passage => b.type === 'passage' && b.id === p.passage);
      if (!passage) throw new Error(`${key}: passage "${p.passage}" not found`);
      const sentences = passageSentences(passage);
      const paras = p.paragraphs
        .map((n) => {
          const s = sentences[n - 1];
          if (!s) throw new Error(`${key}: passage has no paragraph ${n}`);
          return `<p class="excerpt__para"><span class="excerpt__num" aria-label="Paragraph ${n}">${n}</span>${s
            .map((x) => `<button type="button" class="sentence" data-sid="${x.id}" aria-pressed="false">${mdInline(x.text)}</button>`)
            .join(' ')}</p>`;
        })
        .join('');
      const fb = Object.entries(p.feedback)
        .map(([sid, text]) => `<div class="choice-fb" data-sentence="${sid}" hidden>${md(text)}</div>`)
        .join('');
      body = `<p class="answer-help">Tap the sentence that is your evidence.</p>
        <div class="excerpt" data-title="${esc(passage.title)}"><p class="excerpt__source">From “${esc(passage.title)}”</p>${paras}</div>
        <div class="choice-fbs">${fb}</div>`;
      spec = { type: 'evidence', answer: p.answer };
      break;
    }
    case 'open':
      body = `
        <label class="sr-only" for="ta-${esc(key.replace(/\//g, '-'))}">Your answer</label>
        <textarea class="open-answer" id="ta-${esc(key.replace(/\//g, '-'))}" rows="5" placeholder="Write your answer here…"></textarea>
        <div class="open-review" hidden>
          <div class="model-answer"><h4>A strong answer</h4>${md(p.modelAnswer)}</div>
          <fieldset class="rubric"><legend>Tick each thing <em>your</em> answer did:</legend>
            ${p.rubric.map((r) => `<label class="rubric__item"><input type="checkbox"> <span>${mdInline(r)}</span></label>`).join('')}
          </fieldset>
        </div>`;
      spec = { type: 'open', rubricCount: p.rubric.length };
      break;
  }

  const checkLabel = p.type === 'open' ? 'Compare with a strong answer' : 'Check';
  return `
<problem-card class="problem" data-key="${esc(key)}" data-level="${p.level}" data-spec="${esc(JSON.stringify(spec))}" id="${esc(domId)}">
  <article class="problem__inner" aria-labelledby="${esc(`${domId}-title`)}">
    <header class="problem__head">
      <h4 class="problem__title" id="${esc(`${domId}-title`)}"><span class="problem__num">Problem ${number}</span></h4>
      ${levelBadge(p.level)}
      <span class="problem__status" data-status></span>
    </header>
    ${p.figure ? `<div class="problem__figure">${renderFigure(p.figure)}</div>` : ''}
    <div class="problem__prompt prose">${md(p.prompt)}</div>
    <form class="problem__form" novalidate>
      ${body}
      <div class="problem__actions">
        <button type="submit" class="btn btn--primary" data-action="check">${checkLabel}</button>
        <button type="button" class="btn btn--ghost" data-action="hint"${p.hints.length ? '' : ' hidden'}>Hint <span class="hint-count">(${p.hints.length})</span></button>
        <button type="button" class="btn btn--ghost" data-action="solution"${p.solution.length ? '' : ' hidden'}>Show solution</button>
        <button type="button" class="btn btn--ghost" data-action="retry" hidden>Try again</button>
      </div>
    </form>
    <div class="problem__feedback" role="status" aria-live="polite"></div>
    <div class="problem__hints" hidden>
      <ol>${p.hints.map((h) => `<li hidden>${md(h)}</li>`).join('')}</ol>
    </div>
    <div class="problem__solution" hidden>
      <h5 class="problem__solution-title">Worked solution</h5>
      <ol class="steps">${p.solution.map((s) => `<li class="step">${md(s)}</li>`).join('')}</ol>
    </div>
  </article>
</problem-card>`;
}
