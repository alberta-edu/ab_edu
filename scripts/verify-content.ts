// Content quality gate, run before every build (npm run verify).
// Fails on anything that would show a student a wrong answer or a broken page.
import { loadConcepts, roadmap, resolveRef, gradeRank } from '../src/lib/content.ts';
import { renderProblem, passageSentences } from '../src/lib/problem-html.ts';
import { md } from '../src/lib/render.ts';
import { evaluate, eq, parseFractionAnswer, parseDecimal } from '../src/lib/rational.ts';
import { UNLOCK_AFTER } from '../src/site.ts';
import type { Concept, Passage } from '../src/lib/schema.ts';

const errors: string[] = [];
const warnings: string[] = [];

/** Props that pick a mode. A typo here would draw the wrong picture without any error. */
const PROP_CHOICES: Record<string, Record<string, string[]>> = {
  'rise-fall-city': { mode: ['rise', 'fall'] },
  'then-now': { set: ['innovations', 'issues'] },
  'trade-map': { show: ['goods', 'ideas'] },
  'empire-map': { set: ['conquest', 'africa'] },
  'page-explorer': { set: ['forms', 'features'] },
  'sentence-lab': { mode: ['roles', 'tense', 'adverb', 'join'] },
  'punct-lab': { mode: ['capitals', 'effect'] },
};

function verifyConcept(c: Concept) {
  const where = (id?: string) => `${c.subject}/${c.id}${id ? `#${id}` : ''}`;
  const fail = (id: string | undefined, msg: string) => errors.push(`${where(id)}: ${msg}`);

  // Roadmap
  const planned = roadmap(c.grade)[c.subject].find((r) => r.id === c.id);
  if (!planned) fail(undefined, 'not listed in content/grade-5/roadmap.yaml');
  else if (planned.outcomes.join() !== c.outcomes.join()) warnings.push(`${where()}: outcomes differ from roadmap`);

  // Problems per level: enough to unlock the next level
  const perLevel = [1, 2, 3].map((l) => c.problems.filter((p) => p.level === l).length);
  if (perLevel[0] < UNLOCK_AFTER + 1) fail(undefined, `needs at least ${UNLOCK_AFTER + 1} Warm-up problems (has ${perLevel[0]})`);
  if (perLevel[1] < UNLOCK_AFTER + 1) fail(undefined, `needs at least ${UNLOCK_AFTER + 1} Build problems (has ${perLevel[1]})`);
  if (perLevel[2] < 2) fail(undefined, `needs at least 2 Deep Think problems (has ${perLevel[2]})`);
  const order = c.problems.map((p) => p.level);
  if (order.some((l, i) => i > 0 && l < order[i - 1])) fail(undefined, 'problems must be listed in level order');

  const ids = new Set<string>();
  const passages = new Map(
    c.lesson.flatMap((s) => s.blocks).filter((b): b is Passage => b.type === 'passage').map((p) => [p.id, p]),
  );

  for (const p of c.problems) {
    if (ids.has(p.id)) fail(p.id, 'duplicate problem id');
    ids.add(p.id);

    switch (p.type) {
      case 'mc':
      case 'multi': {
        const answers = p.type === 'mc' ? [p.answer] : p.answer;
        if (answers.some((a) => a >= p.choices.length)) fail(p.id, 'answer index out of range');
        if (new Set(answers).size !== answers.length) fail(p.id, 'duplicate answer index');
        if (new Set(p.choices.map((x) => x.trim())).size !== p.choices.length) fail(p.id, 'duplicate choices');
        for (const k of Object.keys(p.feedback)) {
          if (Number(k) >= p.choices.length) fail(p.id, `feedback for missing choice ${k}`);
          if (answers.includes(Number(k))) fail(p.id, `feedback given for a correct choice ${k}`);
        }
        if (p.type === 'mc') {
          const missing = p.choices.map((_, i) => i).filter((i) => i !== p.answer && !p.feedback[String(i)]);
          if (missing.length) fail(p.id, `wrong choices without feedback: ${missing.join(', ')}`);
        }
        break;
      }
      case 'number':
        if (p.verify !== undefined) {
          const v = evaluate(p.verify);
          const want = parseDecimal(String(p.answer));
          if (!want || !eq(v, want)) fail(p.id, `verify "${p.verify}" = ${v.n}/${v.d}, but answer is ${p.answer}`);
        }
        break;
      case 'fraction': {
        const value = parseFractionAnswer(p.answer);
        if (p.verify !== undefined && !eq(evaluate(p.verify), value)) fail(p.id, `verify "${p.verify}" does not equal ${p.answer}`);
        const isMixed = / /.test(p.answer);
        if (p.form === 'mixed' && !isMixed && value.d !== 1) fail(p.id, 'form is mixed but answer is not written as a mixed number');
        if (p.form === 'improper' && isMixed) fail(p.id, 'form is improper but answer is a mixed number');
        break;
      }
      case 'order':
        if (new Set(p.items).size !== p.items.length) fail(p.id, 'duplicate order items');
        break;
      case 'evidence': {
        const passage = passages.get(p.passage);
        if (!passage) {
          fail(p.id, `passage "${p.passage}" not found`);
          break;
        }
        const sentences = passageSentences(passage);
        const shown = new Set(p.paragraphs.flatMap((n) => (sentences[n - 1] ?? []).map((s) => s.id)));
        for (const n of p.paragraphs) if (!sentences[n - 1]) fail(p.id, `paragraph ${n} does not exist`);
        for (const a of p.answer) if (!shown.has(a)) fail(p.id, `answer ${a} is not in the excerpt`);
        for (const k of Object.keys(p.feedback)) if (!shown.has(k)) fail(p.id, `feedback for ${k}, which is not in the excerpt`);
        break;
      }
    }

    try {
      renderProblem(c, p, 1);
    } catch (e) {
      fail(p.id, (e as Error).message);
    }
  }

  // Lesson blocks: render all Markdown and math, check block-specific rules.
  // Curriculum references: only listed statements, never from a later grade.
  const checkCovers = (label: string, refs: string[], mode: 'current' | 'earlier' | 'any') => {
    let current = 0;
    for (const ref of refs) {
      try {
        const st = resolveRef(c, ref);
        const rank = gradeRank(st.grade);
        if (rank > gradeRank(c.grade)) fail(undefined, `${label}: ${ref} is Grade ${st.grade} content, later than this grade`);
        if (rank === gradeRank(c.grade)) {
          if (!c.outcomes.includes(st.outcomeCode)) fail(undefined, `${label}: ${ref} is from outcome ${st.outcomeCode}, which this concept doesn't list`);
          current++;
          if (mode === 'earlier') fail(undefined, `${label}: a "remember" callout may only recall earlier grades (${ref})`);
        }
      } catch (e) {
        fail(undefined, `${label}: ${(e as Error).message}`);
      }
    }
    if (mode === 'current' && current === 0) fail(undefined, `${label}: must teach at least one Grade ${c.grade} statement`);
  };
  for (const p of c.problems) checkCovers(`problem ${p.id}`, p.covers, 'current');
  for (const t of c.keyTerms) checkCovers(`key term "${t.term}"`, t.covers, 'any');

  const texts: string[] = [c.bigIdea, ...c.keyTerms.map((t) => t.definition)];
  for (const [si, step] of c.lesson.entries()) {
    for (const b of step.blocks) {
      const label = `step ${si + 1} (${step.title}) ${b.type}`;
      if ('covers' in b) checkCovers(label, b.covers, b.type === 'callout' && b.variant === 'remember' ? 'earlier' : 'current');
      if (b.type === 'text') texts.push(b.body);
      if (b.type === 'example') texts.push(b.problem, ...b.steps, ...(b.answer ? [b.answer] : []));
      if (b.type === 'callout') texts.push(b.body);
      if (b.type === 'figure') texts.push(b.caption);
      if (b.type === 'compare') texts.push(...b.columns.map((col) => col.body));
      if (b.type === 'table') {
        texts.push(...b.rows.flat());
        if (b.rows.some((r) => r.length !== b.headers.length)) fail(undefined, `${label}: table rows of the wrong length`);
      }
      if (b.type === 'visual' && b.caption) texts.push(b.caption);
      if (b.type === 'visual' && b.component === 'inference-equation') {
        const ex = b.props.examples as unknown[];
        if (!Array.isArray(ex) || !ex.length) fail(undefined, 'inference-equation needs props.examples');
      }
      if (b.type === 'visual' && b.component in PROP_CHOICES) {
        for (const [prop, allowed] of Object.entries(PROP_CHOICES[b.component])) {
          const value = b.props[prop];
          if (value !== undefined && !allowed.includes(String(value))) fail(undefined, `${label}: ${b.component} ${prop} "${value}" is not one of ${allowed.join(', ')}`);
        }
      }
      if (b.type === 'visual' && b.component === 'card-sort') {
        const { bins, cards } = b.props as { bins?: { id: string }[]; cards?: { text: string; bin: string; why: string }[] };
        if (!bins?.length || !cards?.length) fail(undefined, `${label}: card-sort needs props.bins and props.cards`);
        else {
          for (const card of cards) {
            if (!bins.some((x) => x.id === card.bin)) fail(undefined, `${label}: card "${card.text}" is in unknown bin "${card.bin}"`);
            if (!card.why) fail(undefined, `${label}: card "${card.text}" has no explanation`);
            texts.push(card.text, card.why);
          }
          for (const bin of bins) if (!cards.some((card) => card.bin === bin.id)) fail(undefined, `${label}: bin "${bin.id}" has no cards`);
        }
      }
      if (b.type === 'visual' && b.component === 'talk-it-out') {
        const turns = b.props.turns as { choices: { good: boolean; text: string; reply: string; why: string }[] }[];
        // A turn with no good reply would leave the student stuck, with no way to continue.
        for (const [i, turn] of turns.entries()) {
          if (!turn.choices.some((x) => x.good)) fail(undefined, `${label}: talk-it-out turn ${i + 1} has no good reply`);
          for (const x of turn.choices) texts.push(x.text, x.reply, x.why);
        }
      }
      if (b.type === 'visual' && b.component === 'story-path') {
        const { stages, flash } = b.props as { stages: unknown[]; flash?: { after: number } };
        if (flash && (flash.after < 0 || flash.after >= stages.length - 1)) fail(undefined, `${label}: story-path flash-forward must come before the last stage`);
      }
      if (b.type === 'visual' && b.component === 'script-stage') {
        const { lines } = b.props as { lines: { who: number; pose: string }[] };
        const poses = ['still', 'lean', 'away', 'down', 'up'];
        for (const l of lines) {
          if (l.who !== 0 && l.who !== 1) fail(undefined, `${label}: script-stage line for unknown character ${l.who}`);
          if (!poses.includes(l.pose)) fail(undefined, `${label}: script-stage pose "${l.pose}" is not one of ${poses.join(', ')}`);
        }
      }
      if (b.type === 'experiment') {
        texts.push(b.question, b.observe, b.explain, ...b.predict.choices);
        if (b.predict.answer >= b.predict.choices.length) fail(undefined, `experiment "${b.title}" answer out of range`);
      }
      if (b.type === 'passage') {
        const n = passageSentences(b).flat().length;
        if (n < 5) warnings.push(`${where()}: passage "${b.title}" has only ${n} sentences`);
      }
    }
  }
  for (const t of texts) {
    try {
      md(t);
    } catch (e) {
      fail(undefined, (e as Error).message);
    }
  }

  if (c.summary.length < 110) warnings.push(`${where()}: summary is short for a meta description (${c.summary.length} chars)`);
}

let concepts: Concept[] = [];
try {
  concepts = loadConcepts(5);
} catch (e) {
  console.error((e as Error).message);
  process.exit(1);
}
const seen = new Set<string>();
for (const c of concepts) {
  if (seen.has(c.id)) errors.push(`duplicate concept id ${c.id}`);
  seen.add(c.id);
  verifyConcept(c);
}

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`error ${e}`);
const problems = concepts.reduce((n, c) => n + c.problems.length, 0);
console.log(`\nverify: ${concepts.length} concepts, ${problems} problems, ${errors.length} errors, ${warnings.length} warnings`);
if (errors.length) process.exit(1);
