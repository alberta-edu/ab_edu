// Review page: runs a spaced-review session over the concepts that are due today.
import { load, recordReview, problem } from './progress.ts';
import { isDue, pickRound, INTERVALS, ROUND_SIZE, PASS_MARK, DAY } from '../lib/srs.ts';
import type { GradedDetail } from './problem-card.ts';
import type { ReviewData } from '../pages/data/grade-5/review.json.ts';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const boxes = (box: number) =>
  `<span class="boxes" aria-label="Box ${box + 1} of ${INTERVALS.length}">${INTERVALS.map((_, i) => `<i class="${i <= box ? 'on' : ''}"></i>`).join('')}</span>`;
const when = (ts: number) => {
  const days = Math.ceil((ts - Date.now()) / DAY);
  return days <= 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`;
};

export async function initReview() {
  const root = document.querySelector<HTMLElement>('[data-review-root]')!;
  let data: ReviewData;
  try {
    data = await (await fetch(root.dataset.src!)).json();
  } catch {
    root.innerHTML = '<p class="notice">Could not load the review questions. Check your connection and reload the page.</p>';
    return;
  }

  const overview = () => {
    const p = load();
    const entries = Object.entries(p.review).filter(([k]) => data.concepts[k]);
    const due = entries.filter(([, r]) => isDue(r, Date.now())).sort((a, b) => a[1].due - b[1].due);
    if (!entries.length) {
      root.innerHTML = `
        <div class="card rv-result">
          <h3>Nothing to review yet</h3>
          <p>Solve a few practice problems in any topic and it will show up here tomorrow.</p>
          <a class="btn btn--primary" href="${document.querySelector<HTMLAnchorElement>('.site-nav a')!.href}">Pick a topic</a>
        </div>`;
      return;
    }
    const upcoming = entries
      .filter(([, r]) => !isDue(r, Date.now()))
      .sort((a, b) => a[1].due - b[1].due)
      .map(
        ([k, r]) => `<li class="card"><span><a href="${data.concepts[k].url}">${esc(data.concepts[k].title)}</a>${boxes(r.box)}</span>
          <span class="muted">Next review ${when(r.due)} <button type="button" class="btn btn--ghost btn--small" data-early="${k}">Review now</button></span></li>`,
      )
      .join('');
    root.innerHTML = `
      <div class="rv-summary">
        <div class="card rv-stat"><strong>${due.length}</strong><span>topics due today</span></div>
        <div class="card rv-stat"><strong>${entries.length}</strong><span>topics in review</span></div>
      </div>
      ${
        due.length
          ? `<button type="button" class="btn btn--primary" data-start>Start review (${due.length} topic${due.length === 1 ? '' : 's'}, about ${due.length * 2} min)</button>`
          : `<div class="card rv-result"><h3>🎉 All caught up!</h3><p>Nothing is due today. Come back ${when(Math.min(...entries.map(([, r]) => r.due)))}.</p></div>`
      }
      ${upcoming ? `<h2 style="margin-top:2rem;font-size:var(--step-1)">Coming up</h2><ul class="rv-list">${upcoming}</ul>` : ''}`;
    root.querySelector('[data-start]')?.addEventListener('click', () => session(due.map(([k]) => k)));
    root.querySelectorAll<HTMLButtonElement>('[data-early]').forEach((b) => b.addEventListener('click', () => session([b.dataset.early!])));
  };

  const session = (queue: string[]) => {
    let i = 0;
    const nextTopic = () => {
      if (i >= queue.length) {
        root.innerHTML = `<div class="card rv-result"><h3>🌟 Review done!</h3><p>Great work. Every review makes these ideas stick a little longer.</p>
          <button type="button" class="btn btn--primary" data-overview>See what's next</button></div>`;
        root.querySelector('[data-overview]')!.addEventListener('click', overview);
        root.scrollIntoView({ block: 'start' });
        return;
      }
      runTopic(queue[i], i + 1, queue.length, () => {
        i++;
        nextTopic();
      });
    };
    nextTopic();
  };

  const runTopic = (key: string, n: number, of: number, done: () => void) => {
    const c = data.concepts[key];
    const state = load().review[key];
    const picks = pickRound(
      c.problems.map((p) => ({ key: p.key, level: p.level, last: problem(p.key)?.t ?? 0 })),
      state?.box ?? 0,
    );
    root.innerHTML = `
      <div class="rv-topic-head">
        <span class="chip">Topic ${n} of ${of}</span>
        <h2>${esc(c.title)}</h2>
        <span class="muted">${esc(c.subject)}${state ? boxes(state.box) : ''}</span>
      </div>
      <p class="muted">Warm up: tap each card to check you remember the key terms.</p>
      <div class="rv-cards">${c.terms
        .map(
          (t) => `<button type="button" class="card flash" aria-pressed="false"><span class="flash__term">${esc(t.term)}</span><span class="flash__def">${t.html}</span></button>`,
        )
        .join('')}</div>
      <div class="level-problems" data-problems></div>
      <div data-result></div>`;
    root.querySelectorAll<HTMLButtonElement>('.flash').forEach((b) =>
      b.addEventListener('click', () => b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'))),
    );
    const box = root.querySelector<HTMLElement>('[data-problems]')!;
    picks.forEach((k, idx) => {
      const tpl = document.createElement('template');
      tpl.innerHTML = c.problems.find((p) => p.key === k)!.html.trim();
      const card = tpl.content.firstElementChild as HTMLElement;
      card.dataset.mode = 'review';
      card.querySelector('.problem__num')!.textContent = `Question ${idx + 1} of ${picks.length}`;
      box.appendChild(card);
    });
    root.scrollIntoView({ block: 'start' });

    let graded = 0;
    let correct = 0;
    const onGraded = (e: Event) => {
      const d = (e as CustomEvent<GradedDetail>).detail;
      if (!d.first || !picks.includes(d.key)) return;
      graded++;
      if (d.correct) correct++;
      if (graded < picks.length) return;
      box.removeEventListener('problem-graded', onGraded);
      const next = recordReview(key, picks.length < ROUND_SIZE ? Math.round((correct / picks.length) * ROUND_SIZE) : correct);
      const passed = correct >= Math.min(PASS_MARK, picks.length);
      const result = root.querySelector<HTMLElement>('[data-result]')!;
      result.innerHTML = `
        <div class="card rv-result" role="status">
          <h3>${passed ? `✓ ${correct} of ${picks.length}: moving up!` : `${correct} of ${picks.length}: let's see this again soon`}</h3>
          <p>${passed ? `Now in box ${next.box + 1}${boxes(next.box)}. Next review ${when(next.due)}.` : `Back to box 1. It will come back ${when(next.due)}, and practising it on its <a href="${c.url}">topic page</a> helps too.`}</p>
          <button type="button" class="btn btn--primary" data-next>${n < of ? 'Next topic' : 'Finish'}</button>
        </div>`;
      result.querySelector('[data-next]')!.addEventListener('click', done);
      result.scrollIntoView({ block: 'nearest' });
    };
    box.addEventListener('problem-graded', onGraded);
  };

  overview();
}
