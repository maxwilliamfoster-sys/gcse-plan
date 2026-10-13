'use strict';
/* ============================================================
   GCSE Plan — planner engine + UI
   Dates are 'YYYY-MM-DD' strings handled as UTC day numbers.
   ============================================================ */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- dates ---------- */
const D = {
  n(s) { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d) / 864e5; },
  s(n) { return new Date(n * 864e5).toISOString().slice(0, 10); },
  today() { if (window.__TODAY) return window.__TODAY; const t = new Date(); return D.s(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()) / 864e5); },
  add(s, k) { return D.s(D.n(s) + k); },
  diff(a, b) { return D.n(b) - D.n(a); },
  dow(s) { return new Date(D.n(s) * 864e5).getUTCDay(); },
  fmt(s, o) { return new Date(D.n(s) * 864e5).toLocaleDateString('en-GB', Object.assign({ timeZone: 'UTC' }, o)); },
  short(s) { return D.fmt(s, { weekday: 'short', day: 'numeric', month: 'short' }); },
  long(s) { return D.fmt(s, { weekday: 'long', day: 'numeric', month: 'long' }); },
  full(s) { return D.fmt(s, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }); },
};

/* ---------- fixed calendar (holidays are estimates — editable in Settings; exam dates JCQ 2027) ---------- */
const EXAM_START = '2027-05-10', EXAM_END = '2027-06-18';
const RESULTS_DAY = '2027-08-19', CONTINGENCY = '2027-06-23';
const HOLIDAYS = [
  ['2026-10-22', '2026-10-30', 'October half term'],
  ['2026-12-19', '2027-01-03', 'Christmas holidays'],
  ['2027-02-15', '2027-02-19', 'February half term'],
  ['2027-03-26', '2027-04-11', 'Easter holidays'],
  ['2027-05-03', '2027-05-03', 'Bank holiday'],
  ['2027-05-31', '2027-06-04', 'May half term'],
];
const REST_DAYS = { '2026-12-25': 'Christmas Day', '2026-12-26': 'Boxing Day', '2027-01-01': 'New Year\'s Day', '2027-03-28': 'Easter Sunday' };
const ORDER = ['maths', 'science', 'englang', 'englit', 'hist', 'german'];
const KEY = 'gcse27.state.v1';

/* ---------- data index ---------- */
RG.subjects.sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
const SUBJ = {}, TOPIC = {}, PAPER = {}, TOPICS = [], PAPERS = [];
for (const s of RG.subjects) {
  SUBJ[s.id] = s;
  for (const p of s.papers) { p.subj = s; PAPER[p.id] = p; PAPERS.push(p); }
  for (const t of s.topics) {
    t.subj = s;
    t.paperIds = t.p || s.papers.map((p) => p.id);
    t.cardIds = (t.cards || []).map((_, i) => t.id + '#' + i);
    TOPIC[t.id] = t; TOPICS.push(t);
  }
}
const sortPapers = () => PAPERS.sort((a, b) => a.date.localeCompare(b.date) || (a.time === 'am' ? -1 : 1));
const CARD = {};
for (const t of TOPICS) t.cards && t.cards.forEach((c, i) => { CARD[t.id + '#' + i] = { id: t.id + '#' + i, q: c[0], a: c[1], t }; });

/* ---------- state ---------- */
function defaultState() {
  return {
    v: 2, at: 0,
    settings: {
      tiers: { maths: 'H', science: 'H', german: 'H' },
      mocks: [
        { name: 'Mock exams 1', start: '2026-11-23', end: '2026-12-04' },
        { name: 'Mock exams 2', start: '2027-02-01', end: '2027-02-12' },
      ],
      intensity: 1, restDay: -1, speakingDate: '2027-04-26', theme: 'system', holidays: null,
    },
    topics: {}, cards: {}, unlocked: {}, plans: {}, days: {}, papersDone: {}, newCards: {}, noLive: {}, ticks: {},
  };
}
function migrate(s) {
  const d = defaultState();
  s = s && typeof s === 'object' ? s : d;
  s.settings = Object.assign(d.settings, s.settings || {});
  s.settings.tiers = Object.assign({ maths: 'H', science: 'H', german: 'H' }, s.settings.tiers || {});
  if (typeof s.at !== 'number') s.at = 0;
  if (!Array.isArray(s.settings.mocks) || s.settings.mocks.length < 2) s.settings.mocks = d.settings.mocks;
  // The bell-time timetable has its own day off (Sunday), so the old "light day" no longer applies.
  if (s.v < 2) { s.settings.restDay = -1; s.v = 2; }
  for (const k of ['topics', 'cards', 'unlocked', 'plans', 'days', 'papersDone', 'newCards', 'noLive', 'ticks']) if (!s[k] || typeof s[k] !== 'object') s[k] = {};
  // Drop progress for topics/papers that no longer exist (Geography and the old OCR Literature topics were removed in Oct 2026).
  for (const id of Object.keys(s.topics)) if (!TOPIC[id]) delete s.topics[id];
  for (const id of Object.keys(s.unlocked)) if (!TOPIC[id]) delete s.unlocked[id];
  for (const id of Object.keys(s.cards)) if (!CARD[id]) delete s.cards[id];
  for (const id of Object.keys(s.papersDone)) if (!PAPER[id]) delete s.papersDone[id];
  // Day plans are v2 (timetable periods → picked topics). Older 25-min "path" plans are dropped and rebuilt.
  for (const k of Object.keys(s.plans)) {
    const p = s.plans[k];
    if (!p || p.v !== 2 || Object.values(p.picks || {}).some((x) => x && ((x.t && !TOPIC[x.t]) || (x.pid && !PAPER[x.pid])))) delete s.plans[k];
  }
  return s;
}
function readLocal() { try { const r = localStorage.getItem(KEY); if (r) return migrate(JSON.parse(r)); } catch (e) { /* storage unavailable */ } return defaultState(); }
function writeLocal() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ } }
let hadLocal = false;
try { hadLocal = !!localStorage.getItem(KEY); } catch (e) { /* storage unavailable */ }
let state = readLocal();
function applySettings() { PAPER['de-s'].date = state.settings.speakingDate || '2027-04-26'; sortPapers(); }
applySettings();

// cloud.backend: { uid?, load() → {s, at} | null, save({s, at}), watch(cb) → unsubscribe }
// Two backends: the Claude artifact's per-user db, or Firebase (GitHub Pages build, after sign-in).
const cloud = { backend: null, unsub: null, status: 'local', writing: false, pending: false };
let saveTimer = null;
function prune() {
  const cut = D.add(D.today(), -28);
  for (const k of Object.keys(state.plans)) if (k < cut) delete state.plans[k];
  const cut2 = D.add(D.today(), -3);
  for (const k of Object.keys(state.newCards)) if (k < cut2) delete state.newCards[k];
}
// save(): a user edit — stamps the edit time and syncs. saveQuiet(): local only (e.g. generating today's plan).
function save() {
  state.at = Date.now(); prune(); writeLocal();
  clearTimeout(saveTimer); saveTimer = setTimeout(pushCloud, 1200);
}
function saveQuiet() { prune(); writeLocal(); }
async function pushCloud() {
  if (!cloud.backend) return;
  if (cloud.writing) { cloud.pending = true; return; }
  cloud.writing = true;
  const be = cloud.backend;
  try { await be.save({ s: JSON.stringify(state), at: state.at }); if (cloud.backend === be) cloud.status = 'synced'; }
  catch (e) { cloud.status = e && (e.code === 'invalid_argument' || e.code === 'permission-denied') ? 'readonly' : 'error'; }
  cloud.writing = false; updateSync();
  if (cloud.pending) { cloud.pending = false; pushCloud(); }
}
function adoptRemote(d) {
  try { state = migrate(JSON.parse(d.s)); applySettings(); writeLocal(); if (!sess) render(); } catch (e) { /* bad remote body */ }
}
async function connectBackend(be) {
  disconnectBackend();
  cloud.backend = be; cloud.status = 'connecting'; updateSync();
  try {
    const d = await be.load();
    if (cloud.backend !== be) return;
    const otherOwner = be.uid && state.owner && state.owner !== be.uid;
    if (d && (otherOwner || (!hadLocal && !state.at) || d.at > (state.at || 0))) adoptRemote(d);
    else if (otherOwner) { state = defaultState(); applySettings(); render(); }
    if (be.uid && state.owner !== be.uid) { state.owner = be.uid; writeLocal(); }
    if (!d || d.at < state.at) { if (state.at) pushCloud(); }
    cloud.status = 'synced'; updateSync();
    cloud.unsub = be.watch((r) => { if (r && r.at > (state.at || 0)) adoptRemote(r); }, () => { cloud.status = 'error'; updateSync(); });
  } catch (e) { if (cloud.backend === be) { cloud.status = 'error'; updateSync(); } }
}
function disconnectBackend() {
  if (cloud.unsub) { try { cloud.unsub(); } catch (e) { /* already closed */ } }
  cloud.backend = null; cloud.unsub = null; cloud.status = 'local';
}
// Claude artifact: progress lives in this viewer's private db subtree.
async function initClaudeCloud(tries) {
  if (window.RGAuth) return; // Firebase build handles sync itself
  const c = window.claude;
  if (!c || typeof c.use !== 'function') { if ((tries || 0) < 10) setTimeout(() => initClaudeCloud((tries || 0) + 1), 400); return; }
  try {
    const [db, user] = await Promise.all([c.use('db'), c.use('user')]);
    if (!db || !user) { updateSync(); return; }
    const uid = await user.id();
    if (!uid) { updateSync(); return; }
    const ref = db.doc('data/users/' + uid + '/progress');
    connectBackend({
      load: async () => { const s = await ref.get(); return s.exists ? s.data() : null; },
      save: (d) => ref.set(d),
      watch: (cb, err) => ref.onSnapshot((s) => { if (s.exists && !s.metadata.hasPendingWrites) cb(s.data()); }, err),
    });
  } catch (e) { cloud.status = 'local'; updateSync(); }
}
// Firebase (GitHub Pages build): accounts via email/password or Google.
const auth = { available: false, checked: false, user: null, error: '', busy: false };
const SKIP_KEY = 'gcse27.skipLogin';
let skipMem = false;
function skipLogin() { if (skipMem) return true; try { return localStorage.getItem(SKIP_KEY) === '1'; } catch (e) { return false; } }
function setSkipLogin(v) { skipMem = !!v; try { if (v) localStorage.setItem(SKIP_KEY, '1'); else localStorage.removeItem(SKIP_KEY); } catch (e) { /* storage unavailable */ } }
function initFirebaseAuth() {
  const A = window.RGAuth;
  if (!A || auth.available) return;
  auth.available = true;
  A.onChange((user) => {
    auth.checked = true; auth.user = user || null;
    if (user) { setSkipLogin(false); connectBackend(A.backend(user.uid)); }
    else disconnectBackend();
    if (!sess) render();
  });
}
function needsLogin() { return auth.available && auth.checked && !auth.user && !skipLogin(); }
// Pages build with a Firebase config: hold a loading screen until we know whether you're signed in (max 5s).
let authGaveUp = false;
function authPending() { const c = window.FIREBASE_CONFIG; return !!(c && c.apiKey) && !auth.checked && !authGaveUp; }
setTimeout(() => { if (!auth.checked) { authGaveUp = true; if (!sess) render(); } }, 5000);
const AUTH_ERR = {
  'auth/invalid-credential': 'Email or password is wrong.', 'auth/wrong-password': 'Email or password is wrong.', 'auth/user-not-found': 'No account with that email — tap "Create account".',
  'auth/email-already-in-use': 'There\'s already an account with that email — sign in instead.', 'auth/weak-password': 'Use a password of at least 6 characters.',
  'auth/invalid-email': 'That email address doesn\'t look right.', 'auth/missing-password': 'Type your password.', 'auth/network-request-failed': 'No internet connection — try again.',
  'auth/popup-closed-by-user': 'The Google window was closed before signing in.', 'auth/popup-blocked': 'Google sign-in could not open here. Sign in with Google on your computer, go to Settings → Set a password, then use your email and that password here.',
  'auth/operation-not-allowed': 'This sign-in method isn\'t switched on in Firebase yet.', 'auth/too-many-requests': 'Too many attempts — wait a minute and try again.',
  'auth/provider-already-linked': 'This account already has a password — sign in with your email and that password.',
  'auth/credential-already-in-use': 'That email already has a separate password account.', 'auth/requires-recent-login': 'Please sign in again, then set the password.',
  'auth/unauthorized-domain': 'This web address isn\'t authorised in Firebase yet (add it under Authentication → Settings → Authorised domains).',
};
async function authDo(kind) {
  const A = window.RGAuth; if (!A) return;
  const email = ($('#login-email') || {}).value || '', pass = ($('#login-pass') || {}).value || '';
  auth.error = ''; auth.busy = true; render();
  try {
    if (kind === 'signin') await A.signIn(email.trim(), pass);
    else if (kind === 'signup') await A.signUp(email.trim(), pass);
    else if (kind === 'google') await A.google();
    else if (kind === 'reset') { if (!email.trim()) throw { code: 'auth/invalid-email' }; await A.reset(email.trim()); auth.error = 'Password reset email sent to ' + email.trim() + '.'; }
  } catch (e) { auth.error = AUTH_ERR[e && e.code] || ((e && e.message) || 'Something went wrong — try again.'); }
  auth.busy = false;
  if (!sess) { render(); const f = $('#login-email'); if (f && !f.value) f.value = email; }
}
async function authSignOut() {
  const A = window.RGAuth; if (!A) return;
  disconnectBackend();
  try { await A.signOut(); } catch (e) { /* ignore */ }
  // your progress is safe in your account; clear this device's copy
  state = defaultState(); applySettings(); hadLocal = false;
  try { localStorage.removeItem(KEY); } catch (e) { /* storage unavailable */ }
  go('today'); toast('Signed out');
}

/* ---------- calendar model ---------- */
function holidayList() { const h = state.settings.holidays; return Array.isArray(h) && h.length ? h : HOLIDAYS; }
function holidayOf(d) { for (const h of holidayList()) if (h[0] && h[1] && d >= h[0] && d <= h[1]) return h[2]; return null; }
function mockOf(d) { for (const m of state.settings.mocks) if (m.start && m.end && d >= m.start && d <= m.end) return m; return null; }
function phases() {
  const m1 = state.settings.mocks[0], m2 = state.settings.mocks[1];
  const P = [
    { id: 'found', name: 'Foundations', start: '2026-09-01', end: D.add(m1.start, -15),
      goal: 'Build a daily habit, secure Year 10 content and keep up with new Year 11 topics.',
      how: ['Short daily sessions: blurt, check, flashcards', 'Rate every topic honestly so the plan can target weak spots', 'German vocabulary every day'],
      mins: { school: 70, weekend: 130, holiday: 180, mock: 70 } },
    { id: 'sprint', name: 'Mock sprint', start: D.add(m1.start, -14), end: m1.end,
      goal: 'Two weeks of focused recall before the first mocks — treat them like the real thing.',
      how: ['Everything taught so far is in play', 'Exam-style questions after each recall', 'During mock days: revise the next day\'s paper'],
      mins: { school: 90, weekend: 160, holiday: 190, mock: 70 } },
    { id: 'gaps', name: 'Fix the gaps', start: D.add(m1.end, 1), end: '2027-01-03',
      goal: 'Use mock results to find weak topics and re-learn them properly.',
      how: ['Re-rate topics using your mock marks', 'Red and amber topics first', 'Christmas: a steady 2–3 hours a day, with proper days off'],
      mins: { school: 70, weekend: 130, holiday: 160, mock: 70 } },
    { id: 'build', name: 'Build & practise', start: '2027-01-04', end: m2.end,
      goal: 'Cover every topic at least twice, and start timed exam questions.',
      how: ['Interleave subjects — never two blocks of the same subject in a row', 'Exam questions for topics rated 4–5', 'Second mocks: full timed papers'],
      mins: { school: 90, weekend: 160, holiday: 220, mock: 70 } },
    { id: 'papers', name: 'Past-paper phase', start: D.add(m2.end, 1), end: '2027-03-25',
      goal: 'Timed past papers every weekend, marked against the official mark schemes.',
      how: ['One full paper on each weekend day', 'Log scores and mark weak topics from each paper', 'Redo every question you dropped marks on'],
      mins: { school: 100, weekend: 190, holiday: 220, mock: 100 } },
    { id: 'easter', name: 'Easter intensive', start: '2027-03-26', end: '2027-04-11',
      goal: 'The biggest revision push: a paper and several topic blocks most days.',
      how: ['About 4–5 hours a day with breaks, plus one full day off a week', 'Rotate subjects daily', 'German speaking practice'],
      mins: { school: 240, weekend: 210, holiday: 270, mock: 240 } },
    { id: 'final', name: 'Final countdown', start: '2027-04-12', end: '2027-05-09',
      goal: 'Sharpen exam technique and close the last gaps. German speaking exam happens now.',
      how: ['Weekend papers, weekday weak-topic blocks', 'First exams are German, Biology 1, Literature 1', 'Protect sleep — it consolidates memory'],
      mins: { school: 110, weekend: 250, holiday: 250, mock: 110 } },
    { id: 'exams', name: 'Exam season', start: EXAM_START, end: EXAM_END,
      goal: 'Revise the next paper. The day before each exam is devoted to it.',
      how: ['Evening before: that paper only, plus flashcards', 'After each exam: switch straight to the next paper', 'Sleep beats a late-night cram'],
      mins: { study: 240, examday: 120 } },
  ];
  return P;
}
function phaseOf(d) {
  const P = phases();
  if (d > EXAM_END) return { id: 'after', name: 'Exams finished', start: D.add(EXAM_END, 1), end: RESULTS_DAY, goal: 'Done! Results day is Thursday 19 August 2027.', how: [], mins: {} };
  for (const p of P) if (d >= p.start && d <= p.end) return p;
  return P[0];
}
function examsOn(d) { return PAPERS.filter((p) => p.date === d && !p.approx); }
function dayInfo(d) {
  const ph = phaseOf(d), hol = holidayOf(d), mock = mockOf(d), dow = D.dow(d);
  let type, label;
  if (REST_DAYS[d]) { type = 'rest'; label = REST_DAYS[d] + ' — day off'; }
  else if (d > EXAM_END) { type = 'rest'; label = 'Exams finished'; }
  else if (d >= EXAM_START) { const x = examsOn(d); type = x.length ? 'examday' : 'study'; label = x.length ? 'Exam day' : 'Study leave / revision day'; }
  else if (hol) { type = 'holiday'; label = hol; }
  else if (dow === 0 || dow === 6) { type = 'weekend'; label = 'Weekend'; }
  else if (mock) { type = 'mock'; label = mock.name; }
  else { type = 'school'; label = 'School day'; }
  if ((type === 'school' || type === 'weekend') && dow === Number(state.settings.restDay) && d < '2027-03-26') { type = 'light'; label = 'Light day — flashcards only'; }
  let mins = type === 'rest' ? 0 : type === 'light' ? 15 : (ph.mins[type] != null ? ph.mins[type] : ph.mins.school || 0);
  if (type !== 'light' && type !== 'rest') mins = Math.round(mins * Number(state.settings.intensity || 1) / 5) * 5;
  return { d, type, label, mins, phase: ph, mock, exams: examsOn(d) };
}

/* ---------- topic model ---------- */
function tierOk(t) { const s = t.subj; return !(t.h && s.tierable && state.settings.tiers[s.id] === 'F'); }
// taught = in class, ticked "I've covered it", or its week in the study plan has started (COVERED is built in timetable.js)
function taught(t, d) { return !t.from || t.from <= d || !!state.unlocked[t.id] || (COVERED[t.id] != null && COVERED[t.id] <= d); }
function nextPaper(t, d) {
  let best = null;
  for (const id of t.paperIds) { const p = PAPER[id]; if (p.date > d && (!best || p.date < best.date)) best = p; }
  return best;
}
function activeTopics(d) { return TOPICS.filter((t) => tierOk(t) && taught(t, d) && nextPaper(t, d)); }
function visibleTopics(s) { return s.topics.filter(tierOk); }
function st(id, src) { return (src || state.topics)[id] || {}; }
function intervalFor(r, n, dx) {
  const base = [1, 2, 4, 7, 12][r - 1] || 3;
  let iv = base * (1 + 0.35 * Math.min(Math.max(n - 1, 0), 6));
  iv = Math.min(iv, 45);
  if (dx != null && dx > 6) iv = Math.min(iv, dx - 3);
  return Math.max(1, Math.round(iv));
}
function rateTopic(id, r, d) {
  const t = TOPIC[id], old = st(id), n = (old.n || 0) + 1;
  const np = nextPaper(t, d), dx = np ? D.diff(d, np.date) : null;
  state.topics[id] = { c: r, n, last: d, due: D.add(d, intervalFor(r, n, dx)) };
}
function quickRate(id, r) {
  const old = st(id), d = D.today();
  state.topics[id] = Object.assign({}, old, { c: r, due: old.due || d });
}
function subjectAvg(s) {
  const ts = visibleTopics(s); let sum = 0, k = 0;
  for (const t of ts) { const c = st(t.id).c; if (c) { sum += c; k++; } }
  return { avg: k ? sum / k : 0, rated: k, total: ts.length };
}

/* ---------- planner ---------- */
function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967295; }
function makeSim(d) {
  const tally = {}; for (const s of RG.subjects) tally[s.id] = 0;
  for (let k = 1; k <= 14; k++) {
    const day = state.days[D.add(d, -k)];
    if (day && day.subj) for (const s in day.subj) if (s in tally) tally[s] += day.subj[s] * Math.pow(0.93, k);
  }
  const pc = {}; for (const id in state.papersDone) pc[id] = state.papersDone[id].length;
  return { topics: Object.assign({}, state.topics), tally, pc };
}
function scoreTopic(t, d, sim, active) {
  const s = st(t.id, sim.topics), c = s.c || 0;
  const why = [];
  let score = 0;
  const weak = c === 0 ? 6 : (5 - c) * 2.2;
  score += weak;
  if (c === 0) why.push('not rated yet'); else if (c <= 2) why.push('rated ' + c + '/5 — weak');
  score += t.w * 1.5;
  if (!s.due) score += 3;
  else {
    const od = D.diff(s.due, d);
    if (od >= 0) { score += Math.min(3 + od * 0.5, 8); why.push(od > 0 ? 'overdue review' : 'due for review'); }
    else score += -6 + od * 0.3;
  }
  const np = nextPaper(t, d), dx = D.diff(d, np.date);
  const urg = dx <= 1 ? 40 : dx <= 2 ? 22 : dx <= 4 ? 12 : dx <= 7 ? 7 : dx <= 14 ? 4 : dx <= 30 ? 2 : dx <= 60 ? 1 : 0;
  score += urg;
  if (dx <= 7) why.push(np.name.split(' · ')[0] + ' in ' + dx + (dx === 1 ? ' day' : ' days'));
  const m1 = state.settings.mocks.find((m) => m.start && d >= D.add(m.start, -14) && d <= m.end);
  if (m1) { score += 3; if (!why.length) why.push('mock prep'); }
  // subject balance
  let tot = 0, shareTot = 0;
  for (const sid of active) { tot += sim.tally[sid] || 0; shareTot += SUBJ[sid].share; }
  const target = t.subj.share / (shareTot || 1);
  const cur = tot ? (sim.tally[t.subj.id] || 0) / tot : 0;
  const bal = (target - cur) * 30;
  score += bal;
  if (bal > 4 && why.length < 2) why.push('keeps ' + t.subj.name + ' in rotation');
  score += hash(t.id + d) * 1.5;
  return { score, why, dx, np };
}
function kindFor(c, phaseId, dx) {
  if (dx <= 1) return 'final';
  if (!c || c <= 2) return 'learn';
  if (c === 3) return 'recall';
  return (phaseId === 'found' || phaseId === 'gaps') ? 'recall' : 'exam';
}
const KIND = {
  learn: { label: 'Learn & blurt', steps: ['read', 'blurt', 'check', 'cards', 'rate'] },
  recall: { label: 'Blurt & recall', steps: ['blurt', 'check', 'cards', 'apply', 'rate'] },
  exam: { label: 'Exam questions', steps: ['apply', 'check', 'cards', 'rate'] },
  final: { label: 'Final review', steps: ['check', 'cards', 'rate'] },
  paper: { label: 'Timed past paper', steps: ['paper', 'score'] },
  cards: { label: 'Daily flashcards', steps: [] },
};
function logMinutes(d, sid, m) {
  const day = state.days[d] || (state.days[d] = { m: 0, subj: {} });
  day.m += m; if (sid) day.subj[sid] = (day.subj[sid] || 0) + m;
}

/* ---------- flashcards (Leitner) ---------- */
const BOX_DAYS = [0, 1, 3, 7, 14, 30];
function cardAvailable(c) { return tierOk(c.t) && taught(c.t, D.today()) && nextPaper(c.t, D.today()); }
function dueCards(d, subj) {
  return Object.keys(state.cards).map((id) => CARD[id]).filter((c) => c && cardAvailable(c) && (!subj || c.t.subj.id === subj) && state.cards[c.id].d <= d)
    .sort((a, b) => state.cards[a.id].b - state.cards[b.id].b);
}
function newCardPool(subj) {
  const pool = [];
  const ts = TOPICS.filter((t) => tierOk(t) && taught(t, D.today()) && nextPaper(t, D.today()) && (!subj || t.subj.id === subj));
  ts.sort((a, b) => {
    const pa = (a.subj.id === 'german' ? 0 : 1) - (b.subj.id === 'german' ? 0 : 1);
    if (pa) return pa;
    const sa = st(a.id), sb = st(b.id);
    return ((sb.n || 0) > 0) - ((sa.n || 0) > 0) || (sa.c || 0) - (sb.c || 0);
  });
  for (const t of ts) for (const id of t.cardIds) if (!state.cards[id]) pool.push(CARD[id]);
  return pool;
}
function newAllowance(d) { const used = state.newCards[d] || 0; return Math.max(0, 10 - used); }
function gradeCard(id, ok, d) {
  const c = state.cards[id] || { b: 0, d };
  const isNew = !state.cards[id];
  const b = ok ? Math.min(5, (isNew ? 1 : c.b + 1)) : 0;
  state.cards[id] = { b, d: D.add(d, ok ? BOX_DAYS[b] : 1) };
  if (isNew) state.newCards[d] = (state.newCards[d] || 0) + 1;
}

