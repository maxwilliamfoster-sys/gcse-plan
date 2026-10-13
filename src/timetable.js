/* ============================================================
   Bell-time timetable (merged in from the GCSE Study Plan, Oct 2026)
   The timetable fixes WHEN and WHICH SUBJECT (08:00–16:20 on the online
   school's bells, live lessons fixed). For each self-study period the
   planner picks the topic: this week's focus first, then weak / overdue.
   ============================================================ */
const TT = RG.tt;
const TT_ORDER = ['maths', 'science', 'hist', 'german', 'englit', 'englang'];
const TT_PHASES = [
  { p: 1, name: 'Phase 1 · Learn everything once', start: '2026-10-12', end: '2026-12-18', weeks: 10,
    goal: 'Cover every topic once: learn it, blurt it from memory, turn it into flashcards.' },
  { p: 'x', name: 'Christmas', start: '2026-12-19', end: '2027-01-03', weeks: 0,
    goal: 'A proper rest week (21–27 Dec), then a catch-up week of mornings on your weakest topics.' },
  { p: 2, name: 'Phase 2 · Exam technique on every topic', start: '2027-01-04', end: '2027-03-26', weeks: 12,
    goal: 'Timed exam questions on every topic, marked with the official mark schemes.' },
  { p: 3, name: 'Phase 3 · Past papers + German speaking', start: '2027-03-29', end: '2027-05-09', weeks: 6,
    goal: 'Full past papers, the German speaking exam (AQA window 12 Apr – 21 May) and fixing weak spots.' },
  { p: 4, name: 'Exam season', start: '2027-05-10', end: '2027-06-18', weeks: 0,
    goal: 'Revise the next paper. The day before each exam belongs to that exam.' },
];
const TT_PH = {}; for (const x of TT_PHASES) TT_PH[x.p] = x;

function ttPhase(d) {
  const wk = (from) => Math.floor(D.diff(from, d) / 7);
  const mk = (p, w, extra) => Object.assign({}, TT_PH[p], { wk: w }, extra || {});
  if (d < '2026-12-21') return mk(1, Math.max(0, Math.min(9, wk('2026-10-12'))));
  if (d < '2027-01-04') { const rest = d < '2026-12-28'; return mk('x', 0, { rest, name: rest ? 'Christmas · Rest week' : 'Christmas · Catch-up week' }); }
  if (d < '2027-03-29') return mk(2, Math.min(11, wk('2027-01-04')));
  if (d < '2027-05-10') return mk(3, Math.min(5, wk('2027-03-29')));
  if (d <= EXAM_END) return mk(4, 0);
  return { p: 5, wk: 0, name: 'Exams finished', goal: 'Results day is Thursday 19 August 2027.' };
}
const hasWeeks = (ph) => ph.p === 1 || ph.p === 2 || ph.p === 3;
function weekStartOf(p, wk) { return D.add(TT_PH[p].start, wk * 7); }
function focusFor(sid, ph) { const arr = TT.PLAN[ph.p] && TT.PLAN[ph.p][sid]; return arr ? arr[Math.min(ph.wk, arr.length - 1)] : ''; }
function recipeFor(sid, ph) { const H = TT.HOW[ph.p] || TT.HOW[ph.p === 4 || ph.p === 5 ? 3 : 1]; return H[sid] || { how: [], ln: [] }; }
function videosFor(sid, ph) { return hasWeeks(ph) ? (RG.videos || {})[ph.p + '-' + (ph.wk + 1) + '-' + sid] || [] : []; }
function focusTopicIds(sid, ph) {
  const F = RG.focus[ph.p] && RG.focus[ph.p][sid]; if (!F) return [];
  const ids = F[Math.min(ph.wk, F.length - 1)] || [];
  return ids.flatMap((id) => id[0] === '@' ? TOPICS.filter((t) => t.subj.id === sid && t.paperIds.includes(id.slice(1))).map((t) => t.id) : [id]).filter((id) => TOPIC[id] && tierOk(TOPIC[id]));
}
// first day each topic is a weekly focus → it counts as taught from then on (used by taught() in app.js)
const COVERED = {};
for (const p of [1, 2]) for (const sid of TT_ORDER) (RG.focus[p][sid] || []).forEach((ids, wk) => {
  const from = weekStartOf(p, wk);
  for (const id of ids) if (id[0] !== '@' && (!COVERED[id] || from < COVERED[id])) COVERED[id] = from;
});
const toMin = (hm) => { const [h, m] = hm.split(':').map(Number); return h * 60 + m; };
const itemMins = (it) => (it.start && it.end && /:/.test(it.end) ? toMin(it.end) - toMin(it.start) : 15);

const LIVE_HOW = ['Camera on. Take Cornell notes: questions in the left column, notes on the right.', 'Straight after: 2 minutes writing a 3-line summary of what you learned.'];
const LIVE_DESC = {
  M: 'Your next Maths self-study period practises whatever this lesson covered. Swap it in for the plan topic if they differ.',
  S: 'If the lesson covered a different topic from the plan, use your next Science period for that lesson\'s topic.',
};
const SAT_PAPER = { maths: 'a Maths past paper (Paper 1, 2 or 3)', science: 'a Science paper (alternate Biology, Chemistry, Physics)', hist: 'an OCR J410 paper section',
  german: 'a German Listening + Reading sample paper', englit: 'a Literature section (one essay per 45 min)', englang: 'a Language Section A or Q5' };

/* One day of the timetable: { d, ph, hol, noLive, half, items:[…] }.
   Item kinds: anki, self, live, quiz, break, blurt, eve, paper, mark, cards, exam, prep, rest.
   'pickable' items get a topic (or paper) chosen by the planner. */
function ttDay(d) {
  const ph = ttPhase(d), dow = D.dow(d), hol = holidayOf(d);
  const day = { d, ph, hol, items: [] };
  const add = (o) => { day.items.push(o); return o; };
  if (ph.p === 5) return day;
  if (REST_DAYS[d]) { add({ id: 'rest', kind: 'rest', title: REST_DAYS[d], desc: 'Day off. Rest is part of the plan.' }); return day; }
  if (ph.p === 4) return examSeasonDay(d, day, dow);
  if (ph.p === 'x' && ph.rest) { add({ id: 'rest', kind: 'rest', title: 'Rest week', desc: 'Have a proper break. Optional: 10 minutes of German flashcards a day so the streak survives.' }); return day; }
  if (dow === 0) { add({ id: 'rest', kind: 'rest', title: 'Sunday: day off', desc: 'Your brain consolidates memory when you sleep and switch off. Optional: 10 minutes of German vocab.' }); return day; }
  if (dow === 6) return saturday(d, day, ph);

  day.noLive = !!(hol || ph.p === 'x' || state.noLive[d]);
  day.half = !!((hol || ph.p === 'x') && ph.p !== 3); // half terms + Christmas catch-up: mornings only
  add({ id: 'anki', kind: 'anki', start: '08:00', end: '08:15', title: 'Anki warm-up', sid: null,
    how: ['Open Anki and do each subject deck in turn: German, History, Science, Maths, English Literature, English Language. Click the subject itself, not a sub-deck, so new cards follow the plan week by week.', 'About 39 new cards a day in total, plus reviews. Say each answer out loud before you flip.'], links: ['anki'] });
  TT.WEEK[dow].forEach((code, i) => {
    const [start, end] = TT.TIMES[i];
    if (i === 3) add({ id: 'br1', kind: 'break', start: '10:30', end: '11:00', title: 'Break', desc: 'Move, water, snack. Phone scrolling doesn\'t count as a break.' });
    if (i === 5) {
      if (day.half) { add({ id: 'pm-off', kind: 'rest', start: '12:30', end: '', title: 'Afternoon off', desc: 'Holiday: mornings only. Do something away from a screen.' }); return; }
      add({ id: 'lunch', kind: 'break', start: '12:30', end: '13:30', title: 'Lunch', desc: 'Get outside or train. Exercise helps memory and focus.' });
    }
    if (day.half && i >= 5) return;
    if (i === 7) add({ id: 'br2', kind: 'break', start: '15:00', end: '15:15', title: 'Break' });
    const skipped = TT.SKIPPED[dow] && TT.SKIPPED[dow][i];
    if (code.startsWith('L:')) {
      const k = code.slice(2);
      if (day.noLive) { const rep = typeof TT.HOLI[k] === 'object' ? TT.HOLI[k][dow] : TT.HOLI[k]; add(selfItem('p' + i, rep, ph, start, end, { replaces: TT.LIVE[k].name })); return; }
      const lv = TT.LIVE[k];
      add({ id: 'p' + i, kind: 'live', sid: lv.s, start, end, title: lv.name, how: LIVE_HOW,
        desc: LIVE_DESC[k] || 'English lessons cover Language and Literature. Note which text or question type they used.' });
      return;
    }
    if (code === 'QUIZ') {
      add({ id: 'p' + i, kind: 'quiz', start, end, title: 'Weekly mixed quiz', focus: 'Every subject, no notes',
        how: ['15 min: your due flashcards across all six subjects (the Review button below).', '15 min: questions on topics from 2–3 weeks ago. Spacing is what makes them stick.', '15 min: write everything you got wrong onto your weak list. Those topics go first next week.'], links: ['sen'] });
      return;
    }
    add(selfItem('p' + i, code, ph, start, end, { skipped }));
  });
  if (!day.half) {
    add({ id: 'blurt', kind: 'blurt', start: '16:00', end: '16:20', title: 'End-of-day blurt and plan',
      how: ['8 min: blank page. Write everything you remember from today.', '7 min: check against your notes and fill the gaps in another colour.', '5 min: write tomorrow\'s 3 weak spots. Hit them first.'] });
    if (dow >= 1 && dow <= 4) add({ id: 'eve', kind: 'eve', start: 'Evening', end: '', title: 'Anki, 15 min (optional)', desc: 'Finish any cards still due (sync AnkiWeb to use your phone). Sleep locks it in.' });
  }
  return day;
}
function selfItem(id, sid, ph, start, end, extra) {
  const r = recipeFor(sid, ph);
  return Object.assign({ id, kind: 'self', sid, start, end, title: SUBJ[sid].name, focus: focusFor(sid, ph), how: r.how, links: r.ln, videos: videosFor(sid, ph), pickable: true }, extra || {});
}
function saturday(d, day, ph) {
  const sid = TT_ORDER[Math.max(0, Math.floor(D.diff('2026-10-12', d) / 7)) % 6];
  const early = ph.p === 1 || ph.p === 'x', r = recipeFor(sid, early ? { p: 1 } : ph);
  day.items.push(
    { id: 'sat1', kind: 'paper', sid, start: '09:00', end: '10:30', title: 'Timed practice: ' + SUBJ[sid].name, pickable: true,
      focus: early ? 'Exam questions on this week\'s topics (you haven\'t covered everything yet)' : 'Timed: ' + SAT_PAPER[sid],
      how: ['Exam conditions: phone in another room, timer on, no notes.', 'Stop when the time runs out, even if you haven\'t finished. That is what the exam does.'], links: r.ln, videos: videosFor(sid, ph) },
    { id: 'sbr', kind: 'break', start: '10:30', end: '10:45', title: 'Break' },
    { id: 'sat2', kind: 'mark', sid, start: '10:45', end: '11:30', title: 'Mark it and do corrections',
      how: ['Mark it with the official mark scheme, not your own judgement.', 'Write the correct answer for each lost mark in a different colour.', 'Add each mistake to your weak list and your flashcards.'] },
    { id: 'sat3', kind: 'cards', start: '11:30', end: '11:45', title: 'Flashcards', how: ['Anki: clear whatever is still due in your six subject decks, or review your due cards here.'], links: ['anki'] },
    { id: 'satpm', kind: 'rest', start: '11:45', end: '', title: 'The rest of Saturday is yours' });
  return day;
}
function examSeasonDay(d, day, dow) {
  const todays = PAPERS.filter((p) => p.date === d && !p.approx);
  for (const p of todays) day.items.push({ id: 'ex-' + p.id, kind: 'exam', sid: p.subj.id, start: p.time === 'am' ? '09:00' : '13:30', end: 'exam', title: 'EXAM: ' + p.subj.name + ' · ' + p.name, paper: p.id,
    how: p.time === 'am' ? ['Breakfast, water and a light 20-minute flashcard warm-up. No new learning.', 'Black pens, calculator, ruler, clear pencil case. Arrive 30 minutes early.'] : ['Morning: a light 45 minutes of flashcards on this paper, then a walk.', 'Eat lunch before you go. Arrive 30 minutes early.'] });
  const nexts = PAPERS.filter((p) => p.date > d && !p.approx).slice(0, 2);
  if (dow === 0) { day.items.push({ id: 'rest', kind: 'rest', title: 'Light day', desc: 'An hour of flashcards for tomorrow\'s exam at most. Rest is part of the plan.' }); return day; }
  const [a, b] = nexts;
  if (a) day.items.push({ id: 'x1', kind: 'prep', sid: a.subj.id, paper: a.id, start: '09:00', end: '11:15', title: 'Next up: ' + a.subj.name + ' · ' + a.name, badge: D.short(a.date), pickable: true,
    how: ['45 min: retrieval. Flashcards and a blurt of the whole paper\'s content.', '45 min: timed section of a past paper for this exact paper.', '45 min: mark it and fix the gaps.'], links: (TT.HOW[3][a.subj.id] || { ln: [] }).ln });
  if (b) day.items.push({ id: 'x2', kind: 'prep', sid: b.subj.id, paper: b.id, start: '11:30', end: '13:00', title: 'Then: ' + b.subj.name + ' · ' + b.name, badge: D.short(b.date), pickable: true,
    how: ['45 min: flashcards and a blurt.', '45 min: the questions you got wrong last time.'], links: (TT.HOW[3][b.subj.id] || { ln: [] }).ln });
  if (a) day.items.push({ id: 'x3', kind: 'blurt', start: '16:00', end: '16:20', title: 'Pack your bag for the next exam + early night' });
  return day;
}

/* ---------- picking what to study in each period ---------- */
function pickTopicFor(sid, d, sim, taken, focusIds, paperId) {
  const focus = new Set(focusIds || []);
  const cands = TOPICS.filter((t) => t.subj.id === sid && tierOk(t) && nextPaper(t, d) && (taught(t, d) || focus.has(t.id)) && !taken.has(t.id) && (!paperId || t.paperIds.includes(paperId)));
  if (!cands.length) return null;
  let best = null;
  for (const t of cands) {
    const sc = scoreTopic(t, d, sim, [sid]), s = sc.score + (focus.has(t.id) ? 10 : 0);
    if (!best || s > best.s) best = { s, t, sc };
  }
  const why = (focus.has(best.t.id) ? ['this week\'s focus'] : []).concat(best.sc.why).slice(0, 2);
  return { t: best.t.id, k: kindFor(st(best.t.id, sim.topics).c || 0, dayInfo(d).phase.id, best.sc.dx), why };
}
function paperFor(sid, d) {
  const c = PAPERS.filter((p) => p.subj.id === sid && !p.approx && p.date > d);
  c.sort((a, b) => ((state.papersDone[a.id] || []).length - (state.papersDone[b.id] || []).length) || a.date.localeCompare(b.date));
  return c[0] || null;
}
function pickFor(it, d, sim, taken, ph) {
  if (it.kind === 'paper' && !(ph.p === 1 || ph.p === 'x')) { const p = paperFor(it.sid, d); if (p) return { pid: p.id, k: 'paper', why: ['least-practised ' + SUBJ[it.sid].name + ' paper'] }; }
  if (it.kind === 'prep') return pickTopicFor(it.sid, d, sim, taken, null, it.paper);
  return pickTopicFor(it.sid, d, sim, taken, focusTopicIds(it.sid, ph));
}
/* The day with each period's pick and done-state. Today's and past picks are stored (so the day stays stable);
   future days are a preview, picked fresh from your current ratings each time. */
function dayPlan(d) {
  const day = ttDay(d), today = D.today();
  let pl = state.plans[d];
  const store = d <= today;
  if (!pl || pl.v !== 2) { pl = { v: 2, picks: {}, done: {} }; if (store) state.plans[d] = pl; }
  const need = day.items.filter((it) => it.pickable && !(it.id in pl.picks));
  if (need.length && d >= today) {
    const sim = makeSim(d), taken = new Set(Object.values(pl.picks).map((x) => x && x.t).filter(Boolean));
    for (const it of need) { const pk = pickFor(it, d, sim, taken, day.ph); pl.picks[it.id] = pk; if (pk && pk.t) taken.add(pk.t); }
    if (store) saveQuiet();
  }
  for (const it of day.items) { it.pick = pl.picks[it.id] || null; it.done = pl.done[it.id] != null ? pl.done[it.id] : null; }
  day.plan = pl;
  return day;
}
// re-pick periods you haven't done yet (after rating topics or changing settings)
function rebuildPlan(d) {
  const pl = state.plans[d]; if (!pl || pl.v !== 2) return;
  for (const id of Object.keys(pl.picks)) if (pl.done[id] == null) delete pl.picks[id];
  dayPlan(d);
}
function markItem(d, it, val) {
  const pl = dayPlan(d).plan;
  if (val == null) { delete pl.done[it.id]; return; }
  if (pl.done[it.id] == null) logMinutes(d, it.sid, itemMins(it));
  pl.done[it.id] = val;
}
// where you are in the day: the current item (breaks included) and the next thing to do
function nowIn(day, mins) {
  const timed = day.items.filter((it) => it.start && /:/.test(it.start));
  let cur = null, next = null;
  for (const it of timed) {
    const a = toMin(it.start), b = /:/.test(it.end || '') ? toMin(it.end) : a + 1;
    if (mins >= a && mins < b) cur = it;
    if (a > mins && !next && it.kind !== 'break' && it.kind !== 'rest') next = it;
  }
  return { cur, next };
}
