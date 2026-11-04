// <problem-card>: makes a server-rendered problem interactive.
// Markup comes from src/lib/problem-html.ts.
import { check, type CheckSpec, type Response, type Verdict } from '../lib/check.ts';
import { problem as problemRecord, recordAttempt, recordHelp } from './progress.ts';

export interface GradedDetail {
  key: string;
  level: number;
  correct: boolean;
  /** True on the first graded attempt at this problem on this page. */
  first: boolean;
  firstTry: boolean;
}

const PRAISE = ['Correct!', 'Yes, that’s it!', 'Nailed it!', 'Exactly right!', 'Well reasoned!', 'You got it!'];
const NUDGE = [
  'Not yet. Look again, or open a hint.',
  'Not quite. A hint might help.',
  'Close attempt, but not correct. Try another way.',
];
const pick = (list: string[]) => list[Math.floor(Math.random() * list.length)];

class ProblemCard extends HTMLElement {
  private spec!: CheckSpec;
  private key = '';
  private attempts = 0;
  private solved = false;
  private usedHelp = false;

  connectedCallback() {
    if (this.spec) return;
    this.spec = JSON.parse(this.dataset.spec!);
    this.key = this.dataset.key ?? '';
    if (this.spec.type === 'investigation') {
      this.setupInvestigation();
      return;
    }
    const form = this.q<HTMLFormElement>('.problem__form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submit();
    });
    form.addEventListener('input', () => this.clearFeedback());
    this.q('[data-action="hint"]').addEventListener('click', () => this.hint());
    this.q('[data-action="solution"]').addEventListener('click', () => this.toggleSolution());
    this.q('[data-action="retry"]').addEventListener('click', () => this.retry());
    this.setupOrder();
    this.setupEvidence();
    if (problemRecord(this.key)?.s) {
      this.setStatus('solved', '✓ Solved before');
      this.showMove();
    }
  }

  /** A part reports to its investigation. Only the whole investigation counts in the student's progress. */
  protected get isPart() {
    return false;
  }

  private showMove() {
    this.querySelector<HTMLElement>('[data-move]')?.removeAttribute('hidden');
  }

  // ------------------------------------------------------------ investigations

  private setupInvestigation() {
    const parts = [...this.querySelectorAll<HTMLElement>('problem-part')];
    const wrapUp = this.q('[data-wrap-up]');
    // Without JavaScript all parts show in order. A student who solved it before can read them all too.
    if (problemRecord(this.key)?.s) {
      this.setStatus('solved', '✓ Solved before');
      this.showMove();
    } else {
      parts.slice(1).forEach((x) => (x.hidden = true));
      wrapUp.hidden = true;
    }
    this.addEventListener('part-graded', (e) => {
      e.stopPropagation();
      const { correct } = (e as CustomEvent<{ correct: boolean }>).detail;
      const part = (e.target as HTMLElement).closest<HTMLElement>('problem-part')!;
      const next = parts[parts.indexOf(part) + 1];
      if (correct && next) {
        next.hidden = false;
        next.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
        return;
      }
      // Report the first wrong answer and the finish: the two moments the pages care about.
      if (correct || this.attempts === 0) {
        const first = this.attempts === 0;
        const firstTry = correct && first && !this.usedHelp && !problemRecord(this.key)?.a;
        this.attempts++;
        recordAttempt(this.key, correct);
        this.dispatchEvent(
          new CustomEvent<GradedDetail>('problem-graded', {
            bubbles: true,
            detail: { key: this.key, level: Number(this.dataset.level), correct, first, firstTry },
          }),
        );
      }
      if (correct) {
        this.solved = true;
        this.classList.add('problem--solved');
        this.setStatus('solved', '✓ Solved');
        wrapUp.hidden = false;
        this.showMove();
      }
    });
    this.addEventListener('part-help', (e) => {
      e.stopPropagation();
      this.usedHelp = true;
      recordHelp(this.key, (e as CustomEvent<'hint' | 'solution'>).detail);
    });
  }

  private get reviewMode() {
    return this.dataset.mode === 'review';
  }

  private q<T extends HTMLElement = HTMLElement>(sel: string): T {
    return this.querySelector(sel) as T;
  }

  // ------------------------------------------------------------ input types

  private setupOrder() {
    const list = this.querySelector<HTMLOListElement>('.order-list');
    if (!list) return;
    list.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-move]');
      if (!btn || this.solved) return;
      const li = btn.closest('li')!;
      const dir = Number(btn.dataset.move);
      const sibling = dir < 0 ? li.previousElementSibling : li.nextElementSibling;
      if (!sibling) return;
      if (dir < 0) list.insertBefore(li, sibling);
      else list.insertBefore(sibling, li);
      btn.focus();
      li.classList.remove('order-item--moved');
      void li.offsetWidth;
      li.classList.add('order-item--moved');
      this.clearFeedback();
    });
  }

  private setupEvidence() {
    const box = this.querySelector('.excerpt');
    if (!box) return;
    box.addEventListener('click', (e) => {
      const s = (e.target as HTMLElement).closest<HTMLButtonElement>('.sentence');
      if (!s || this.solved) return;
      const on = s.getAttribute('aria-pressed') !== 'true';
      box.querySelectorAll('.sentence').forEach((x) => x.setAttribute('aria-pressed', 'false'));
      s.setAttribute('aria-pressed', String(on));
      this.clearFeedback();
    });
  }

  private response(): Response | null {
    switch (this.spec.type) {
      case 'mc': {
        const el = this.querySelector<HTMLInputElement>('input[type=radio]:checked');
        return el ? { kind: 'choice', value: Number(el.value) } : null;
      }
      case 'multi':
        return {
          kind: 'choices',
          value: [...this.querySelectorAll<HTMLInputElement>('input[type=checkbox]:checked')].map((x) => Number(x.value)),
        };
      case 'number':
      case 'fraction':
      case 'text':
        return { kind: 'text', value: this.q<HTMLInputElement>('.answer-row__input').value };
      case 'order':
        return {
          kind: 'order',
          value: [...this.querySelectorAll<HTMLElement>('.order-item')].map((li) => Number(li.dataset.orig)),
        };
      case 'evidence':
        return {
          kind: 'sentences',
          value: [...this.querySelectorAll<HTMLElement>('.sentence[aria-pressed="true"]')].map((s) => s.dataset.sid!),
        };
      case 'open':
        return { kind: 'rubric', checked: this.querySelectorAll('.rubric input:checked').length };
      case 'build':
        return {
          kind: 'fields',
          value: Object.fromEntries([...this.querySelectorAll<HTMLInputElement>('[data-field]')].map((x) => [x.dataset.field!, x.value])),
        };
      case 'investigation':
        return null;
    }
  }

  // ------------------------------------------------------------ grading

  private submit() {
    if (this.solved) return;
    if (this.spec.type === 'open') {
      const review = this.q('.open-review');
      if (review.hidden) {
        const text = this.q<HTMLTextAreaElement>('.open-answer').value.trim();
        if (text.split(/\s+/).length < 5) {
          this.showFeedback('info', 'Write your answer first: at least one full sentence.');
          return;
        }
        review.hidden = false;
        this.q('[data-action="check"]').textContent = 'Done checking';
        this.showFeedback('info', 'Compare your answer with the strong answer, then tick what yours did.');
        return;
      }
    }
    const res = this.response();
    const verdict: Verdict = res ? check(this.spec, res) : { status: 'invalid', message: 'Choose an answer first.' };
    if (verdict.status === 'invalid' || verdict.status === 'almost') {
      this.showFeedback(verdict.status === 'almost' ? 'almost' : 'info', verdict.message);
      return;
    }
    const correct = verdict.status === 'correct';
    const first = this.attempts === 0;
    const firstTry = correct && first && !this.usedHelp && !problemRecord(this.key)?.a;
    this.attempts++;
    if (this.isPart) {
      this.dispatchEvent(new CustomEvent('part-graded', { bubbles: true, detail: { correct } }));
    } else {
      recordAttempt(this.key, correct);
      this.dispatchEvent(
        new CustomEvent<GradedDetail>('problem-graded', {
          bubbles: true,
          detail: { key: this.key, level: Number(this.dataset.level), correct, first, firstTry },
        }),
      );
    }

    if (correct) {
      this.solved = true;
      this.classList.add('problem--solved');
      this.markChoices(true);
      this.lock();
      this.setStatus('solved', firstTry ? '★ First try!' : '✓ Solved');
      this.showMove();
      const extra = this.spec.type === 'open' ? ' Your answer covers the key ideas.' : '';
      this.showFeedback('correct', `${pick(PRAISE)}${extra}`);
      this.q('[data-action="solution"]').textContent = 'Compare with the worked solution';
      return;
    }

    // Read the explanation for the chosen answer before markChoices() clears the selection.
    const specific = this.specificFeedback();
    this.markChoices(false);
    this.classList.remove('shake');
    void this.offsetWidth;
    this.classList.add('shake');
    if (this.spec.type === 'open') {
      this.showFeedback('wrong', 'Your answer is missing some key ideas. Read the strong answer, then improve yours.');
      this.q('[data-action="retry"]').hidden = false;
      return;
    }
    if (this.reviewMode) {
      this.lock();
      this.showFeedback('wrong', 'Not this time. Look at the worked solution, and this concept will come back sooner.');
      this.q('[data-action="solution"]').click();
      return;
    }
    this.showFeedback('wrong', specific ?? verdict.message ?? pick(NUDGE));
  }

  /** Per-choice or per-sentence feedback written for the selected wrong answer. */
  private specificFeedback(): string | null {
    let el: HTMLElement | null = null;
    if (this.spec.type === 'mc') {
      const v = this.querySelector<HTMLInputElement>('input[type=radio]:checked')?.value;
      el = this.querySelector(`.choice-fb[data-choice="${v}"]`);
    } else if (this.spec.type === 'evidence') {
      const sid = this.querySelector<HTMLElement>('.sentence[aria-pressed="true"]')?.dataset.sid;
      el = this.querySelector(`.choice-fb[data-sentence="${sid}"]`);
    }
    return el ? el.innerHTML : null;
  }

  private markChoices(correct: boolean) {
    if (this.spec.type === 'mc') {
      const input = this.querySelector<HTMLInputElement>('input[type=radio]:checked');
      const label = input?.closest('.choice');
      if (!label || !input) return;
      label.classList.add(correct ? 'choice--correct' : 'choice--wrong');
      if (!correct) {
        input.checked = false;
        input.disabled = true;
      }
    }
    if (this.spec.type === 'evidence') {
      const s = this.querySelector<HTMLElement>('.sentence[aria-pressed="true"]');
      if (!s) return;
      s.classList.add(correct ? 'sentence--correct' : 'sentence--wrong');
      if (!correct) s.setAttribute('aria-pressed', 'false');
    }
    if (this.spec.type === 'order' && !correct) {
      this.querySelectorAll<HTMLElement>('.order-item').forEach((li, i) => {
        li.classList.toggle('order-item--placed', Number(li.dataset.orig) === i);
      });
    }
  }

  private lock() {
    this.querySelectorAll<HTMLInputElement | HTMLButtonElement | HTMLTextAreaElement>(
      '.problem__form input, .problem__form textarea, .order-list button, .sentence, [data-action="check"], [data-action="hint"]',
    ).forEach((el) => (el.disabled = true));
  }

  private retry() {
    this.q('[data-action="retry"]').hidden = true;
    this.q('.open-review').hidden = true;
    this.querySelectorAll<HTMLInputElement>('.rubric input').forEach((x) => (x.checked = false));
    this.q('[data-action="check"]').textContent = 'Compare with a strong answer';
    this.clearFeedback();
    this.q<HTMLTextAreaElement>('.open-answer').focus();
  }

  // ------------------------------------------------------------ help

  private hint() {
    const hidden = this.querySelector<HTMLLIElement>('.problem__hints li[hidden]');
    if (!hidden) return;
    this.q('.problem__hints').hidden = false;
    hidden.hidden = false;
    this.usedHelp = true;
    this.noteHelp('hint');
    const left = this.querySelectorAll('.problem__hints li[hidden]').length;
    const btn = this.q<HTMLButtonElement>('[data-action="hint"]');
    btn.querySelector('.hint-count')!.textContent = `(${left})`;
    if (!left) btn.disabled = true;
  }

  private noteHelp(kind: 'hint' | 'solution') {
    if (this.isPart) this.dispatchEvent(new CustomEvent('part-help', { bubbles: true, detail: kind }));
    else recordHelp(this.key, kind);
  }

  private toggleSolution() {
    const sol = this.q('.problem__solution');
    sol.hidden = !sol.hidden;
    const btn = this.q('[data-action="solution"]');
    if (!sol.hidden) {
      if (!this.solved) {
        this.usedHelp = true;
        this.noteHelp('solution');
      }
      btn.textContent = 'Hide solution';
      sol.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
    } else {
      btn.textContent = this.solved ? 'Compare with the worked solution' : 'Show solution';
    }
  }

  // ------------------------------------------------------------ feedback UI

  private showFeedback(kind: 'correct' | 'wrong' | 'almost' | 'info', html: string) {
    const fb = this.q('.problem__feedback');
    fb.className = `problem__feedback problem__feedback--${kind}`;
    fb.innerHTML = html;
  }

  private clearFeedback() {
    if (this.solved) return;
    const fb = this.q('.problem__feedback');
    fb.className = 'problem__feedback';
    fb.textContent = '';
  }

  private setStatus(kind: string, text: string) {
    const s = this.q('[data-status]');
    s.className = `problem__status problem__status--${kind}`;
    s.textContent = text;
  }
}

/** One part of an investigation: grades itself and reports to the card around it. */
class ProblemPart extends ProblemCard {
  protected override get isPart() {
    return true;
  }
}

if (!customElements.get('problem-card')) customElements.define('problem-card', ProblemCard);
if (!customElements.get('problem-part')) customElements.define('problem-part', ProblemPart);
