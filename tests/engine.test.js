// Engine tests: node --test tests/
// Loads the data files + app.js + timetable.js into a sandbox (no DOM), the same order build.py uses.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const j = (x) => JSON.parse(JSON.stringify(x)); // sandbox objects have another realm's prototypes

const SRC = path.join(__dirname, '..', 'src');
const DATA = ['d-maths.js', 'd-science.js', 'd-english.js', 'd-humanities.js', 'd-german.js', 'd-specref.js', 'd-given.js', 'd-vocab.js', 'd-decks.js', 'd-timetable.js', 'd-focus.js', 'd-videos.js'];

function load(today, saved) {
  const store = {};
  if (saved) store['gcse27.state.v1'] = JSON.stringify(saved);
  const ctx = {
    console, Date, Math, JSON, Object, Array, Set, Map, String, Number,
    window: { __TODAY: today }, document: { querySelector: () => null, querySelectorAll: () => [] },
    localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = v; }, removeItem: (k) => { delete store[k]; } },
    setTimeout: () => 0, clearTimeout: () => {}, setInterval: () => 0,
  };
  vm.createContext(ctx);
  const code = 'const RG = { subjects: [] };\n' + DATA.map((f) => fs.readFileSync(path.join(SRC, f), 'utf8')).join('\n') + '\n'
    + fs.readFileSync(path.join(SRC, 'app.js'), 'utf8') + '\n' + fs.readFileSync(path.join(SRC, 'timetable.js'), 'utf8')
    + '\nthis.api = { RG, D, TOPIC, PAPERS, SUBJ, ttPhase, ttDay, dayPlan, nowIn, toMin, focusTopicIds, taught, markItem, get state() { return state; }, migrate, TT_ORDER };';
  vm.runInContext(code, ctx);
  return ctx.api;
}

test('phases and weeks follow the study plan dates', () => {
  const A = load('2026-10-13');
  assert.deepEqual([A.ttPhase('2026-10-12').p, A.ttPhase('2026-10-12').wk], [1, 0]);
  assert.equal(A.ttPhase('2026-10-19').wk, 1);
  assert.equal(A.ttPhase('2026-12-18').wk, 9);
  assert.equal(A.ttPhase('2026-12-22').rest, true);
  assert.equal(A.ttPhase('2026-12-29').rest, false);
  assert.deepEqual([A.ttPhase('2027-01-04').p, A.ttPhase('2027-01-04').wk], [2, 0]);
  assert.deepEqual([A.ttPhase('2027-03-29').p, A.ttPhase('2027-03-29').wk], [3, 0]);
  assert.equal(A.ttPhase('2027-05-10').p, 4);
  assert.equal(A.ttPhase('2027-06-20').p, 5);
});

test('a Monday has the bell-time periods with live Maths, Science and English', () => {
  const A = load('2026-10-12');
  const day = A.ttDay('2026-10-12');
  const live = day.items.filter((it) => it.kind === 'live').map((it) => [it.start, it.sid]);
  assert.deepEqual(j(live), [['11:00', 'maths'], ['11:45', 'science'], ['14:15', 'englang']]);
  const self = day.items.filter((it) => it.kind === 'self').map((it) => it.sid);
  assert.deepEqual(j(self), ['hist', 'german', 'science', 'maths', 'hist']);
  assert.equal(day.items[0].id, 'anki');
  assert.ok(day.items.some((it) => it.id === 'lunch' && it.start === '12:30'));
  assert.ok(day.items.some((it) => it.kind === 'blurt'));
  // focus + recipe + videos come through for self-study
  const h = day.items.find((it) => it.kind === 'self');
  assert.match(h.focus, /Versailles/);
  assert.ok(h.how.length >= 3);
  assert.ok(h.videos.length >= 1);
});

test('Wednesday keeps the ELAC slot as self-study and flags it', () => {
  const A = load('2026-10-14');
  const p1 = A.ttDay('2026-10-14').items.find((it) => it.id === 'p1');
  assert.equal(p1.kind, 'self');
  assert.match(p1.skipped, /ELAC/);
  const live = A.ttDay('2026-10-14').items.filter((it) => it.kind === 'live').map((it) => it.title);
  assert.deepEqual(j(live), ['English Essentials (online lesson)', 'KS4 Writing (online lesson)']);
});

test('Friday has the weekly quiz; Saturday a timed paper; Sunday rest', () => {
  const A = load('2026-10-16');
  assert.ok(A.ttDay('2026-10-16').items.some((it) => it.kind === 'quiz'));
  const sat = A.ttDay('2026-10-17').items;
  assert.equal(sat[0].kind, 'paper');
  assert.equal(sat[0].sid, 'maths'); // week 1 rotation starts with Maths
  assert.equal(A.ttDay('2026-10-18').items[0].kind, 'rest');
});

test('half term: no live lessons, mornings only', () => {
  const A = load('2026-10-26');
  const day = A.ttDay('2026-10-26');
  assert.equal(day.noLive, true);
  assert.equal(day.half, true);
  assert.ok(!day.items.some((it) => it.kind === 'live'));
  assert.ok(day.items.some((it) => it.replaces === 'KS4 Maths (online lesson)' && it.sid === 'maths'));
  assert.ok(!day.items.some((it) => it.start && it.start >= '13:30'));
});

test('a cancelled-lessons day swaps live lessons for self-study but keeps the full day', () => {
  const A = load('2026-11-02');
  A.state.noLive['2026-11-02'] = true;
  const day = A.ttDay('2026-11-02');
  assert.ok(!day.items.some((it) => it.kind === 'live'));
  assert.equal(day.half, false);
  assert.ok(day.items.some((it) => it.kind === 'blurt'));
});

test('exam season: exam days list the exam, other days prep the next two papers', () => {
  const A = load('2027-05-11');
  const ex = A.ttDay('2027-05-11').items;
  assert.ok(ex.some((it) => it.kind === 'exam' && it.sid === 'science'));
  const prep = A.ttDay('2027-05-13').items.filter((it) => it.kind === 'prep');
  assert.equal(prep[0].paper, 'm1');
});

test('every focus week maps to real topics (except the deliberately open weeks)', () => {
  const A = load('2026-10-13');
  for (const p of [1, 2, 3]) for (const sid of A.TT_ORDER) {
    const n = A.RG.tt.PLAN[p][sid].length;
    assert.equal(A.RG.focus[p][sid].length, n, `focus weeks ${p}/${sid}`);
    for (let wk = 0; wk < n; wk++) {
      for (const id of A.RG.focus[p][sid][wk]) if (id[0] !== '@') assert.ok(A.TOPIC[id], `unknown topic ${id}`);
      const open = A.RG.focus[p][sid][wk].length === 0;
      if (!open) assert.ok(A.focusTopicIds(sid, { p, wk }).length > 0, `no topics for ${p}/${sid}/wk${wk + 1}`);
    }
  }
});

test('self-study picks: right subject, this week\'s focus, no repeats in a day', () => {
  const A = load('2026-10-12');
  const day = A.dayPlan('2026-10-12');
  const picks = day.items.filter((it) => it.kind === 'self').map((it) => [it.sid, it.pick && it.pick.t]);
  for (const [sid, t] of picks) { assert.ok(t, 'pick for ' + sid); assert.equal(A.TOPIC[t].subj.id, sid); }
  const ts = picks.map((x) => x[1]);
  assert.equal(new Set(ts).size, ts.length);
  const hist = day.items.find((it) => it.id === 'p0');
  assert.ok(['h-ir-peace', 'h-mig-med'].includes(hist.pick.t));
  assert.ok(hist.pick.why.includes('this week\'s focus'));
  // stored, so the day stays stable
  assert.deepEqual(j(A.dayPlan('2026-10-12').items.find((it) => it.id === 'p0').pick), j(hist.pick));
});

test('later-term topics count as taught once their focus week starts', () => {
  const A = load('2026-11-16');
  assert.equal(A.taught(A.TOPIC['b-nerves'], '2026-11-15'), false);
  assert.equal(A.taught(A.TOPIC['b-nerves'], '2026-11-16'), true);
});

test('nowIn finds the current period and the next one', () => {
  const A = load('2026-10-12');
  const day = A.ttDay('2026-10-12');
  let r = A.nowIn(day, A.toMin('10:59'));
  assert.equal(r.cur.kind, 'break'); assert.equal(r.next.start, '11:00');
  r = A.nowIn(day, A.toMin('11:00'));
  assert.equal(r.cur.kind, 'live'); assert.equal(r.cur.sid, 'maths');
  r = A.nowIn(day, A.toMin('16:30'));
  assert.equal(r.cur, null); assert.equal(r.next, null);
  r = A.nowIn(day, A.toMin('07:30'));
  assert.equal(r.next.id, 'anki');
});

test('migrating a v1 save keeps progress and drops the old path plans', () => {
  const old = { v: 1, at: 5, xp: 340, settings: { restDay: 5, tiers: { maths: 'H' } },
    topics: { 'm-num': { c: 3, n: 1, last: '2026-10-01', due: '2026-10-05' } }, cards: { 'm-num#0': { b: 2, d: '2026-10-20' } },
    days: { '2026-10-12': { m: 50, xp: 30, subj: {} } }, plans: { '2026-10-13': { blocks: [{ k: 'cards', m: 15 }], done: { 0: 1 } } } };
  const A = load('2026-10-13', old);
  const s = A.state;
  assert.equal(s.xp, 340);
  assert.equal(s.topics['m-num'].c, 3);
  assert.equal(s.cards['m-num#0'].b, 2);
  assert.equal(s.days['2026-10-12'].xp, 30);
  assert.equal(s.plans['2026-10-13'], undefined);
  assert.equal(s.settings.restDay, -1);
  assert.equal(s.v, 2);
  assert.deepEqual(j(s.noLive), {});
});

test('content parity: all 261 videos, every recipe and every exam date survive the merge', () => {
  const A = load('2026-10-13');
  const vids = Object.values(A.RG.videos).reduce((n, v) => n + v.length, 0);
  assert.equal(vids, 261);
  assert.equal(Object.keys(A.RG.videos).length, 168);
  for (const p of [1, 2, 3]) for (const sid of A.TT_ORDER) assert.ok(A.RG.tt.HOW[p][sid].how.length, `recipe ${p}/${sid}`);
  for (const sid of A.TT_ORDER) { const g = A.RG.tt.GUIDE[sid]; assert.ok(g.exam.length && g.aids.length && g.tips.length && g.topics.length && g.ln.length); }
  // the Study Plan listed German Listening and Reading as two rows; the app has them as one sitting (de-ls)
  assert.equal(A.PAPERS.filter((p) => !p.approx).length, 18);
});
