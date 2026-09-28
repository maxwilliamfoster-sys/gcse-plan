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

/* ---------- fixed calendar (Chesterton term dates 2026-27 + JCQ 2027) ---------- */
const EXAM_START = '2027-05-10', EXAM_END = '2027-06-18';
const RESULTS_DAY = '2027-08-19', CONTINGENCY = '2027-06-23';
const HOLIDAYS = [
  ['2026-10-22', '2026-10-30', 'October half term'],
  ['2026-12-12', '2027-01-03', 'Christmas holidays'],
  ['2027-02-15', '2027-02-19', 'February half term'],
  ['2027-03-26', '2027-04-11', 'Easter holidays'],
  ['2027-05-03', '2027-05-03', 'Bank holiday'],
  ['2027-05-31', '2027-06-04', 'May half term'],
];
const REST_DAYS = { '2026-12-25': 'Christmas Day', '2026-12-26': 'Boxing Day', '2027-01-01': 'New Year\'s Day', '2027-03-28': 'Easter Sunday' };
const ORDER = ['maths', 'science', 'englang', 'englit', 'geog', 'hist', 'german'];
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
    v: 1, at: 0,
    settings: {
      tiers: { maths: 'H', science: 'H', german: 'H' },
      mocks: [
        { name: 'Mock exams 1', start: '2026-11-23', end: '2026-12-04' },
        { name: 'Mock exams 2', start: '2027-02-01', end: '2027-02-12' },
      ],
      intensity: 1, restDay: 5, speakingDate: '2027-04-26',
    },
    topics: {}, cards: {}, unlocked: {}, plans: {}, days: {}, papersDone: {}, newCards: {},
  };
}
function migrate(s) {
  const d = defaultState();
  s = s && typeof s === 'object' ? s : d;
  s.settings = Object.assign(d.settings, s.settings || {});
  s.settings.tiers = Object.assign({ maths: 'H', science: 'H', german: 'H' }, s.settings.tiers || {});
  if (typeof s.at !== 'number') s.at = 0;
  if (!Array.isArray(s.settings.mocks) || s.settings.mocks.length < 2) s.settings.mocks = d.settings.mocks;
  for (const k of ['topics', 'cards', 'unlocked', 'plans', 'days', 'papersDone', 'newCards']) if (!s[k] || typeof s[k] !== 'object') s[k] = {};
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
function holidayOf(d) { for (const h of HOLIDAYS) if (d >= h[0] && d <= h[1]) return h[2]; return null; }
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
      how: ['One full paper on each weekend day', 'Log scores and mark weak topics from each paper', 'Geography pre-release booklet arrives'],
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
function taught(t, d) { return !t.from || t.from <= d || !!state.unlocked[t.id]; }
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
function pickPaper(d, sim, info) {
  const ph = info.phase.id;
  if (!['papers', 'easter', 'final', 'exams'].includes(ph)) return null;
  if (!(info.type === 'weekend' || info.type === 'holiday' || info.type === 'study')) return null;
  let cands = PAPERS.filter((p) => !p.approx && p.date > d && tierOk({ subj: p.subj }));
  if (ph === 'exams') {
    const nx = cands.filter((p) => D.diff(d, p.date) >= 2 && D.diff(d, p.date) <= 5);
    cands = nx.slice(0, 2);
  }
  if (!cands.length) return null;
  cands.sort((a, b) => (sim.pc[a.id] || 0) - (sim.pc[b.id] || 0) || a.date.localeCompare(b.date));
  return cands[0];
}
function buildDay(d, sim) {
  const info = dayInfo(d);
  const blocks = [];
  if (info.mins <= 0) return { info, blocks };
  const pool = activeTopics(d);
  const pmToday = info.exams.filter((p) => p.time === 'pm');
  if (!pool.length && !pmToday.length) return { info, blocks };
  blocks.push({ k: 'cards', m: Math.min(15, info.mins) });
  let rem = info.mins - 15;
  // afternoon exam today: one final-review block for it in the morning
  const morning = [];
  for (const p of pmToday) {
    const ts = TOPICS.filter((t) => tierOk(t) && t.paperIds.includes(p.id)).sort((x, y) => (st(x.id, sim.topics).c || 0) - (st(y.id, sim.topics).c || 0));
    if (ts.length && rem >= 25) { blocks.push({ k: 'final', t: ts[0].id, m: 25, why: [p.subj.name + ' exam this afternoon'] }); morning.push(ts[0].id); rem -= 30; }
  }
  const paper = pickPaper(d, sim, info);
  if (paper && rem >= paper.dur + 15 + 30) {
    blocks.push({ k: 'paper', pid: paper.id, m: paper.dur + 15, why: ['least-practised paper'] });
    rem -= paper.dur + 15;
    sim.pc[paper.id] = (sim.pc[paper.id] || 0) + 1;
    sim.tally[paper.subj.id] += paper.dur + 15;
  }
  const n = Math.max(0, Math.floor((rem + 5) / 30));
  if (!n || !pool.length) return { info, blocks };
  const active = [...new Set(pool.map((t) => t.subj.id))];
  const scored = pool.filter((t) => !morning.includes(t.id)).map((t) => Object.assign({ t }, scoreTopic(t, d, sim, active))).sort((a, b) => b.score - a.score);
  const soonSubj = new Set(scored.filter((x) => x.dx <= 2).map((x) => x.t.subj.id));
  const perSubj = {}, maxPer = Math.max(2, Math.ceil(n * 0.4));
  const chosen = [];
  let last = null;
  for (let i = 0; i < n; i++) {
    let pick = null;
    for (const x of scored) {
      if (chosen.includes(x)) continue;
      const sid = x.t.subj.id;
      const limit = soonSubj.has(sid) ? n : maxPer;
      if ((perSubj[sid] || 0) >= limit) continue;
      if (sid === last && !soonSubj.has(sid)) continue;
      pick = x; break;
    }
    if (!pick) pick = scored.find((x) => !chosen.includes(x));
    if (!pick) break;
    chosen.push(pick); last = pick.t.subj.id; perSubj[last] = (perSubj[last] || 0) + 1;
  }
  for (const x of chosen) {
    const c = st(x.t.id, sim.topics).c || 0;
    blocks.push({ k: kindFor(c, info.phase.id, x.dx), t: x.t.id, m: 25, why: x.why.slice(0, 2) });
  }
  return { info, blocks };
}
function simApply(sim, b, d) {
  if (b.t) {
    const t = TOPIC[b.t], old = st(b.t, sim.topics), r = Math.min(5, (old.c || 2) + 1), n = (old.n || 0) + 1;
    const np = nextPaper(t, d), dx = np ? D.diff(d, np.date) : null;
    sim.topics[b.t] = { c: r, n, last: d, due: D.add(d, intervalFor(r, n, dx)) };
    sim.tally[t.subj.id] += b.m;
  }
}
function simDecay(sim) { for (const k in sim.tally) sim.tally[k] *= 0.93; }
function ensurePlan(d) {
  if (!state.plans[d]) {
    const { blocks } = buildDay(d, makeSim(d));
    state.plans[d] = { blocks, done: {} };
    saveQuiet();
  }
  return state.plans[d];
}
function rebuildPlan(d) {
  const old = state.plans[d];
  const kept = old ? old.blocks.filter((b, i) => old.done[i] != null) : [];
  const keptDone = {};
  if (old) { let j = 0; old.blocks.forEach((b, i) => { if (old.done[i] != null) keptDone[j++] = old.done[i]; }); }
  const sim = makeSim(d);
  for (const b of kept) simApply(sim, b, d);
  const fresh = buildDay(d, sim).blocks.filter((b) => !(b.k === 'cards' && kept.some((k) => k.k === 'cards')));
  const takenT = new Set(kept.map((b) => b.t).filter(Boolean));
  const add = fresh.filter((b) => !b.t || !takenT.has(b.t));
  // keep today's total similar: drop fresh blocks beyond the day's budget
  const budget = dayInfo(d).mins; let used = kept.reduce((a, b) => a + b.m, 0);
  const blocks = kept.slice();
  for (const b of add) { if (used + b.m <= budget + 5) { blocks.push(b); used += b.m; } }
  state.plans[d] = { blocks, done: keptDone };
  save();
}
function forecast(days) {
  const t = D.today(), sim = makeSim(t), out = [];
  const plan = ensurePlan(t);
  plan.blocks.forEach((b) => simApply(sim, b, t));
  for (let k = 1; k <= days; k++) {
    const d = D.add(t, k);
    simDecay(sim);
    const res = buildDay(d, sim);
    res.blocks.forEach((b) => simApply(sim, b, d));
    out.push({ d, info: res.info, blocks: res.blocks });
  }
  return out;
}
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

/* ---------- rendering helpers ---------- */
const ICON = {
  today: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="16" rx="2.5"/><path d="M3.5 9.5h17M8 2.8v3.4M16 2.8v3.4"/><path d="M8.5 14.5l2.2 2.2 4.8-4.8"/></svg>',
  plan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h10M4 12h16M4 18h7"/><circle cx="18" cy="6" r="2"/><circle cx="15" cy="18" r="2"/></svg>',
  subjects: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/></svg>',
  cards: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 6V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"/></svg>',
  more: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
};
const scol = (sid) => 'var(--' + sid + ')';
const ccol = (c) => 'var(--c' + (c || 0) + ')';
const CONF_WORD = ['Not rated', 'Don\'t know it', 'Shaky', 'Okay, some gaps', 'Good', 'Exam-ready'];
function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }
function minsTxt(m) { if (m < 60) return m + ' min'; const h = Math.floor(m / 60), r = m % 60; return h + 'h' + (r ? ' ' + r + 'm' : ''); }
function toast(msg) {
  const el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); el.textContent = msg;
  document.body.appendChild(el); setTimeout(() => el.remove(), 2200);
}
function nextExam(d) { return PAPERS.find((p) => p.date >= d && !p.approx) || null; }
function confStrip(s) {
  const ts = visibleTopics(s), n = ts.length, cnt = [0, 0, 0, 0, 0, 0];
  for (const t of ts) cnt[st(t.id).c || 0]++;
  return '<div class="conf-strip" aria-hidden="true">' + [5, 4, 3, 2, 1, 0].map((c) => cnt[c] ? `<i style="width:${cnt[c] / n * 100}%;background:${ccol(c)}"></i>` : '').join('') + '</div>';
}
function rate5(id, cur) {
  return '<div class="rate5" role="group" aria-label="Confidence">' + [1, 2, 3, 4, 5].map((r) =>
    `<button type="button" data-rate="${esc(id)}" data-r="${r}" aria-pressed="${cur === r}" title="${CONF_WORD[r]}">${r}</button>`).join('') + '</div>';
}

/* ---------- views ---------- */
let route = 'today', sub = null, planTab = 'days', cardsSubj = null;
function render() {
  const v = $('#view');
  if (authPending()) { v.innerHTML = '<div class="empty" style="padding-top:80px">Loading your plan…</div>'; $('#nav').hidden = true; return; }
  if (needsLogin()) { v.innerHTML = viewLogin(); $('#nav').hidden = true; $('#count').textContent = ''; return; }
  $('#nav').hidden = false;
  const map = { today: viewToday, plan: viewPlan, subjects: viewSubjects, cards: viewCards, more: viewMore, rate: viewRate };
  const fn = map[route] || viewToday;
  v.innerHTML = fn();
  $$('.nav a').forEach((a) => a.setAttribute('aria-current', a.dataset.r === (route === 'rate' ? 'subjects' : route) ? 'page' : 'false'));
  const nx = nextExam(D.today());
  $('#count').textContent = nx ? (D.diff(D.today(), nx.date) === 0 ? 'Exam today' : plural(D.diff(D.today(), nx.date), 'day') + ' to go') : 'All done';
  updateSync();
}
function go(r, s) { route = r; sub = s || null; const h = s ? r + '-' + s : r; if (location.hash.slice(1) !== h) history.replaceState(null, '', '#' + h); render(); window.scrollTo(0, 0); }

const SPEC_PDF = {
  maths: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/mathematics/2015/specification-and-sample-assesment/gcse-maths-2015-specification.pdf',
  science: 'https://filestore.aqa.org.uk/resources/science/specifications/AQA-8464-SP-2016.PDF',
  englang: 'https://filestore.aqa.org.uk/resources/english/specifications/AQA-8700-SP-2015.PDF',
  englit: 'https://www.ocr.org.uk/Images/168995-specification-accredited-gcse-english-literature-j352.pdf',
  geog: 'https://filestore.aqa.org.uk/resources/geography/specifications/AQA-8035-SP-2016.PDF',
  hist: 'https://www.ocr.org.uk/Images/207163-specification-accredited-gcse-history-a-first-teaching-2019-with-first-assessment-2021-j410.pdf',
  german: 'https://filestore.aqa.org.uk/resources/german/specifications/AQA-8662-SP-2024.PDF',
};
function specLine(t) {
  const ref = (RG.spec || {})[t.id];
  return ref ? `<div class="spec-ref"><span class="eyebrow">Official spec</span> <a href="${esc(SPEC_PDF[t.subj.id])}" target="_blank" rel="noopener">${esc(ref)}</a></div>` : '';
}
function viewLogin() {
  const standalone = window.navigator.standalone === true;
  return `<div class="login"><div class="hero"><div class="date">Max's GCSE Plan · Summer 2027</div><h1>Sign in to your plan</h1>
    <p class="muted">Your ratings, flashcards and daily plan save to your account, so they follow you between your phone and your computer.</p></div>
    <form class="card stack" id="login-form" autocomplete="on" novalidate>
      <label class="stack" style="gap:6px"><span class="l">Email</span><input id="login-email" name="email" type="email" autocomplete="username" inputmode="email" required></label>
      <label class="stack" style="gap:6px"><span class="l">Password</span><input id="login-pass" name="password" type="password" autocomplete="current-password" minlength="6" required></label>
      ${auth.error ? `<p class="small" role="alert" style="color:var(--c1)">${esc(auth.error)}</p>` : ''}
      <div class="row" style="flex-wrap:wrap"><button class="btn primary" type="submit" ${auth.busy ? 'disabled' : ''}>Sign in</button><button class="btn" type="button" data-act="login-signup" ${auth.busy ? 'disabled' : ''}>Create account</button><button class="linkbtn" type="button" data-act="login-reset">Forgot password?</button></div>
      <div class="or small muted">or</div><button class="btn" type="button" data-act="login-google" ${auth.busy ? 'disabled' : ''}>Continue with Google</button>
      <p class="small muted">${standalone
        ? 'If Google sign-in doesn\'t open here: sign in with Google on your computer, go to <b>Settings → Set a password</b>, then use your email and that password on this phone.'
        : 'Made your account with Google? You can also set a password in Settings, so you can sign in with email and password on any device.'}</p>
    </form>
    <div class="sect"><button class="linkbtn" data-act="login-skip">Use without an account (saves on this device only)</button></div></div>`;
}
function viewToday() {
  const d = D.today(), info = dayInfo(d), plan = ensurePlan(d);
  const ph = info.phase, nx = nextExam(d);
  const doneMins = plan.blocks.reduce((a, b, i) => a + (plan.done[i] != null ? b.m : 0), 0);
  const totMins = plan.blocks.reduce((a, b) => a + b.m, 0);
  const pct = totMins ? Math.round(doneMins / totMins * 100) : 0;
  const allT = TOPICS.filter(tierOk), rated = allT.filter((t) => st(t.id).c).length;
  let h = '<div class="hero">';
  h += `<div class="date">${esc(D.long(d))}</div>`;
  h += `<h1>${info.mins ? (pct >= 100 ? 'Today\'s plan is done.' : 'Today: ' + minsTxt(totMins) + ' of revision') : esc(info.label)}</h1>`;
  h += `<div class="phase"><span class="chip ink">${esc(ph.name)}</span><span>${esc(info.label)}${ph.end && ph.id !== 'after' ? ' · this phase runs until ' + esc(D.short(ph.end)) : ''}</span></div>`;
  if (info.mins) h += `<div class="meter" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Today's progress"><i style="width:${pct}%"></i></div><div class="small muted mono">${minsTxt(doneMins)} done of ${minsTxt(totMins)}</div>`;
  h += '</div>';

  // alerts
  const alerts = [];
  if (info.exams.length) alerts.push(`<b>Exam today:</b> ${info.exams.map((p) => esc(p.subj.name + ' — ' + p.name + ' (' + p.time + ')')).join('; ')}. Light flashcards only beforehand, eat breakfast, and arrive early. Good luck!`);
  const tmr = examsOn(D.add(d, 1));
  if (tmr.length) alerts.push(`<b>Tomorrow:</b> ${tmr.map((p) => esc(p.subj.name + ' — ' + p.name)).join('; ')}. Tonight's plan focuses on it. Stop by 9:30pm and sleep.`);
  const m = state.settings.mocks.find((x) => x.start > d && D.diff(d, x.start) <= 21);
  if (m) alerts.push(`<b>${esc(m.name)}</b> start ${esc(D.short(m.start))} (${plural(D.diff(d, m.start), 'day')}). Dates are estimates — check them in <a href="#more">Settings</a>.`);
  if (ph.id === 'gaps' && D.diff(state.settings.mocks[0].end, d) <= 21) alerts.push('<b>Mock results back?</b> Re-rate your topics using your marks so the plan targets the right gaps. <a href="#rate">Rate topics</a>');
  if (rated < allT.length * 0.6) alerts.unshift(`<b>Step 1: rate your topics</b> (${rated}/${allT.length} done). Five minutes of honest ratings makes this plan target exactly what you need. <a href="#rate">Rate topics →</a>`);
  if (alerts.length) h += '<div class="sect">' + alerts.map((a) => `<div class="alert"><div>${a}</div></div>`).join('') + '</div>';

  // blocks
  h += '<div class="sect"><div class="sect-h"><h2>Your sessions</h2>' + (info.mins ? '<button class="linkbtn" data-act="rebuild">Rebuild plan</button>' : '') + '</div>';
  if (!plan.blocks.length) {
    h += `<div class="card empty">${info.type === 'rest' ? 'Day off — rest is part of the plan. See you tomorrow.' : 'Nothing scheduled today.'}</div>`;
  } else {
    h += '<div class="blocks">';
    plan.blocks.forEach((b, i) => { h += blockRow(b, i, plan, d); });
    h += '</div>';
    h += `<details class="why"><summary>How today was chosen</summary><ul>
      <li><b>Weakest first:</b> topics you rated 1–2 (or haven't rated) score highest.</li>
      <li><b>Spaced repetition:</b> after each session your rating sets the next review — 1 day for "don't know it", up to several weeks for "exam-ready".</li>
      <li><b>Exam dates:</b> topics for the papers coming soonest get a boost, and the day before an exam goes to that paper.</li>
      <li><b>Interleaving:</b> subjects rotate so no subject is left for weeks, and two blocks of one subject aren't placed back to back.</li>
      <li><b>Timing:</b> 25-minute blocks with a 5-minute break between them. Daily time grows as the exams get closer.</li></ul></details>`;
  }
  h += '</div>';

  // next exam
  if (nx) {
    const dx = D.diff(d, nx.date);
    h += `<div class="sect"><h2>Next exam</h2><div class="card nextx"><div class="big-n">${dx}<small>${dx === 1 ? 'day' : 'days'}</small></div><div>
      <div class="eyebrow" style="color:${scol(nx.subj.id)}">${esc(nx.subj.name)} · ${esc(nx.subj.board)} ${esc(nx.code)}</div>
      <h3 style="margin-top:4px">${esc(nx.name)}</h3><div class="small muted mono" style="margin-top:4px">${esc(D.full(nx.date))} · ${esc(nx.time)}${nx.approx ? ' · date set by school' : ''}</div></div></div></div>`;
  }
  // streak & week
  h += '<div class="sect"><h2>This week</h2>' + weekStrip(d) + '</div>';
  return h;
}
function blockRow(b, i, plan, d) {
  const done = plan.done[i];
  let title, meta = [], col = 'var(--ink-3)';
  if (b.k === 'cards') {
    const due = dueCards(d).length, nw = Math.min(newAllowance(d), newCardPool().length);
    title = 'Daily flashcards'; meta.push(`${due} due · ${nw} new`); col = 'var(--ink)';
  } else if (b.k === 'paper') {
    const p = PAPER[b.pid]; title = 'Timed past paper: ' + p.subj.name; col = scol(p.subj.id);
    meta.push(p.name); meta.push(p.subj.board + ' ' + p.code);
  } else {
    const t = TOPIC[b.t]; if (!t) return '';
    title = t.n; col = scol(t.subj.id);
    meta.push(`<span style="color:${col};font-weight:700">${esc(t.subj.name)}</span>`);
    meta.push(KIND[b.k].label);
  }
  const right = done != null
    ? `<span class="done-badge" style="background:${b.t ? ccol(done) : 'var(--c5)'}">${b.t ? done + '/5' : 'Done'}</span>`
    : `<button class="go" data-act="start" data-i="${i}">Start</button>`;
  const why = b.why && b.why.length && done == null ? `<div class="why">Why: ${esc(b.why.join(', '))}</div>` : '';
  return `<div class="block${done != null ? ' done' : ''}"><div class="bar" style="background:${col}"></div><div><div class="t">${esc(title)}</div><div class="m"><span class="mono">${b.m} min</span>${meta.map((x) => '<span>' + (x.startsWith('<span') ? x : esc(x)) + '</span>').join('')}</div>${why}</div><div>${right}</div></div>`;
}
function weekStrip(d) {
  const dow = (D.dow(d) + 6) % 7; const mon = D.add(d, -dow);
  let total = 0, h = '<div class="card"><div class="row" style="justify-content:space-between;gap:6px">';
  for (let k = 0; k < 7; k++) {
    const day = D.add(mon, k), m = (state.days[day] && state.days[day].m) || 0; total += m;
    const plan = state.plans[day]; const target = plan ? plan.blocks.reduce((a, b) => a + b.m, 0) : dayInfo(day).mins;
    const f = target ? Math.min(1, m / target) : 0;
    h += `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px">
      <div style="width:100%;max-width:34px;height:56px;border-radius:8px;background:var(--line-2);display:flex;align-items:flex-end;overflow:hidden;${day === d ? 'outline:2px solid var(--ink);outline-offset:1px' : ''}"><i style="display:block;width:100%;height:${Math.round(f * 100)}%;background:${f >= 1 ? 'var(--c5)' : 'var(--ink-3)'}"></i></div>
      <span class="mono small ${day === d ? '' : 'muted'}">${'MTWTFSS'[k]}</span></div>`;
  }
  h += `</div><div class="small muted" style="margin-top:10px">${minsTxt(total)} revised this week. A green bar means that day's plan was completed.</div></div>`;
  return h;
}

function viewPlan() {
  let h = '<div class="hero"><div class="date">Your plan to June 2027</div><h1>What to revise, and when</h1></div>';
  h += `<div class="sect"><div class="seg" role="group" aria-label="Plan view">
    <button data-tab="days" aria-pressed="${planTab === 'days'}">Next 14 days</button>
    <button data-tab="road" aria-pressed="${planTab === 'road'}">Roadmap</button>
    <button data-tab="exams" aria-pressed="${planTab === 'exams'}">Exam timetable</button></div></div>`;
  if (planTab === 'days') h += planDays();
  else if (planTab === 'road') h += planRoad();
  else h += planExams();
  return h;
}
function planDays() {
  const f = forecast(14);
  let h = '<div class="sect"><p class="small muted">A forecast: each day is rebuilt from your ratings when it arrives, so doing today\'s sessions honestly keeps this accurate.</p><div class="card" style="padding-block:4px">';
  for (const day of f) {
    const tMins = day.blocks.reduce((a, b) => a + b.m, 0);
    h += `<div class="day"><div class="day-h"><b>${esc(D.short(day.d))}</b><span class="chip">${esc(day.info.label)}</span><span class="small muted mono">${tMins ? minsTxt(tMins) : 'rest'}</span></div>`;
    if (day.info.exams.length) h += `<div class="fl"><span class="k">EXAM</span><b>${day.info.exams.map((p) => esc(p.subj.name + ': ' + p.name + ' (' + p.time + ')')).join('<br>')}</b></div>`;
    for (const b of day.blocks) {
      if (b.k === 'cards') continue;
      if (b.k === 'paper') { const p = PAPER[b.pid]; h += `<div class="fl"><span class="k">PAPER</span><span class="dot" style="background:${scol(p.subj.id)}"></span><span>${esc(p.subj.name)} — ${esc(p.name)}</span></div>`; continue; }
      const t = TOPIC[b.t];
      h += `<div class="fl"><span class="k">${esc(KIND[b.k].label.split(' ')[0].toUpperCase())}</span><span class="dot" style="background:${scol(t.subj.id)}"></span><span>${esc(t.subj.name)} · ${esc(t.n)}</span></div>`;
    }
    h += '</div>';
  }
  h += '</div></div>';
  return h;
}
function planRoad() {
  const d = D.today(), P = phases();
  let h = '<div class="sect"><div class="road">';
  for (const p of P) {
    const cls = d > p.end ? 'past' : (d >= p.start ? 'now' : '');
    const m = p.mins, parts = [];
    if (m.school) parts.push('school days ' + minsTxt(Math.round(m.school * state.settings.intensity / 5) * 5));
    if (m.weekend) parts.push('weekends ' + minsTxt(Math.round(m.weekend * state.settings.intensity / 5) * 5));
    if (m.holiday) parts.push('holidays ' + minsTxt(Math.round(m.holiday * state.settings.intensity / 5) * 5));
    if (m.study) parts.push('study days ' + minsTxt(Math.round(m.study * state.settings.intensity / 5) * 5));
    h += `<div class="stage ${cls}"><div class="pin"></div><div><div class="when">${esc(D.short(p.start))} – ${esc(D.short(p.end))}${cls === 'now' ? ' · YOU ARE HERE' : ''}</div>
      <h3 style="margin-top:3px">${esc(p.name)}</h3><p class="small" style="margin-top:4px">${esc(p.goal)}</p>
      <ul>${p.how.map((x) => '<li>' + esc(x) + '</li>').join('')}<li>Daily time: ${esc(parts.join(', '))}</li></ul></div></div>`;
  }
  h += `<div class="stage"><div class="pin"></div><div><div class="when">${esc(D.short(RESULTS_DAY))}</div><h3 style="margin-top:3px">Results day</h3></div></div>`;
  h += '</div></div>';
  h += '<div class="sect"><h2>Key dates</h2><div class="card small"><ul class="pts">';
  for (const m of state.settings.mocks) h += `<li><b>${esc(m.name)}:</b> ${esc(D.short(m.start))} – ${esc(D.short(m.end))} <span class="muted">(estimate — edit in Settings)</span></li>`;
  for (const x of HOLIDAYS) h += `<li><b>${esc(x[2])}:</b> ${esc(D.short(x[0]))}${x[0] !== x[1] ? ' – ' + esc(D.short(x[1])) : ''}</li>`;
  h += `<li><b>Exam period:</b> ${esc(D.short(EXAM_START))} – ${esc(D.short(EXAM_END))}. Contingency day ${esc(D.short(CONTINGENCY))} — stay available.</li>`;
  h += `<li><b>Results day:</b> ${esc(D.full(RESULTS_DAY))}</li></ul></div></div>`;
  return h;
}
function planExams() {
  const d = D.today(); const nx = nextExam(d);
  let h = '<div class="sect"><p class="small muted">From the AQA and OCR 2027 timetables, and published Pearson Edexcel dates for Maths. Your school will give you a personal timetable with rooms — check it against this.</p><div class="tbl"><table class="xt"><tbody>';
  for (const p of PAPERS) {
    const dx = D.diff(d, p.date);
    const cls = p.date < d ? 'gone' : (nx && p === nx ? 'next' : '');
    h += `<tr class="${cls}"><td class="d">${esc(D.fmt(p.date, { weekday: 'short', day: 'numeric', month: 'short' }))}<br><span class="muted">${esc(p.time)}</span></td>
      <td><span class="dot" style="display:inline-block;background:${scol(p.subj.id)};margin-right:6px"></span><b>${esc(p.subj.name)}</b><br><span class="muted">${esc(p.name)}</span><br><span class="tag">${esc(p.subj.board + ' ' + p.code)}</span> <span class="small muted">${p.approx ? 'set by school' : minsTxt(p.dur)}</span></td>
      <td class="n">${dx >= 0 ? plural(dx, 'day') : 'done'}</td></tr>`;
  }
  h += '</tbody></table></div></div>';
  return h;
}

function viewSubjects() {
  if (sub && SUBJ[sub]) return viewSubject(SUBJ[sub]);
  if (sub && TOPIC[sub]) return viewTopic(TOPIC[sub]);
  let h = '<div class="hero"><div class="date">Chesterton Community College · exam boards</div><h1>Your subjects</h1><p class="muted">Eight GCSEs from seven courses (Combined Science counts as two). Tap a subject for its papers, exam technique and every topic.</p></div>';
  h += '<div class="sect"><div class="sgrid">';
  for (const s of RG.subjects) {
    const a = subjectAvg(s), np = PAPERS.find((p) => p.subj === s && p.date >= D.today());
    h += `<a class="scard" href="#subjects-${s.id}" style="--sc:${scol(s.id)}"><div><div class="eyebrow">${esc(s.board)} · ${esc(s.spec)}${s.tierable ? ' · ' + (state.settings.tiers[s.id] === 'F' ? 'Foundation' : 'Higher') : ''}</div><h3 style="margin-top:4px">${esc(s.name)}</h3></div>
      ${confStrip(s)}<div class="small muted">${a.rated}/${a.total} topics rated${a.avg ? ' · average ' + a.avg.toFixed(1) + '/5' : ''}</div>
      <div class="small mono">${np ? 'Next: ' + esc(D.short(np.date)) : 'All papers sat'}</div></a>`;
  }
  h += '</div><div class="legend">' + [5, 4, 3, 2, 1, 0].map((c) => `<span><i class="dot" style="background:${ccol(c)}"></i>${c ? c + ' ' : ''}${CONF_WORD[c]}</span>`).join('') + '</div></div>';
  h += '<div class="sect"><a class="btn primary" href="#rate">Rate all topics quickly</a></div>';
  return h;
}
function viewSubject(s) {
  const d = D.today();
  let h = `<a class="back" href="#subjects">← Subjects</a><div class="hero" style="padding-top:8px"><div class="eyebrow" style="color:${scol(s.id)}">${esc(s.board)} · ${esc(s.spec)}</div><h1>${esc(s.name)}</h1>${confStrip(s)}</div>`;
  h += '<div class="sect"><h2>Papers</h2><div class="tbl"><table class="xt"><tbody>';
  for (const p of s.papers) h += `<tr class="${p.date < d ? 'gone' : ''}"><td class="d">${esc(D.fmt(p.date, { day: 'numeric', month: 'short' }))}<br><span class="muted">${esc(p.time)}</span></td><td><b>${esc(p.name)}</b><br><span class="tag">${esc(p.code)}</span> <span class="small muted">${p.approx ? 'date set by school' : minsTxt(p.dur)}</span></td><td class="n">${p.date >= d ? plural(D.diff(d, p.date), 'day') : 'done'}</td></tr>`;
  h += '</tbody></table></div></div>';
  h += `<div class="sect"><h2>How it's assessed</h2><div class="card"><ul class="pts">${s.structure.map((x) => '<li>' + esc(x) + '</li>').join('')}</ul></div></div>`;
  h += `<div class="sect"><h2>Exam technique</h2><div class="card"><ul class="pts">${s.technique.map((x) => '<li>' + esc(x) + '</li>').join('')}</ul></div></div>`;
  // topics grouped by paper
  h += '<div class="sect"><div class="sect-h"><h2>Topics</h2><span class="small muted">Tap 1–5 to rate</span></div>';
  const groups = [];
  for (const p of s.papers) {
    const ts = visibleTopics(s).filter((t) => t.paperIds.length < s.papers.length ? t.paperIds[0] === p.id : false);
    if (ts.length) groups.push([p.name, ts]);
  }
  const all = visibleTopics(s).filter((t) => t.paperIds.length === s.papers.length || !groups.some((g) => g[1].includes(t)));
  if (all.length) groups.push([groups.length ? 'Across all papers' : 'All papers', all]);
  for (const [name, ts] of groups) {
    h += `<div class="card" style="padding-block:6px"><div class="eyebrow" style="padding-top:10px">${esc(name)}</div>`;
    for (const t of ts) {
      const c = st(t.id).c || 0, tt = taught(t, d);
      h += `<div class="trow"><div><button class="tn" data-topic="${t.id}">${esc(t.n)}</button>
        <div class="small muted">${t.h ? '<span class="tag">H</span> ' : ''}${!tt ? 'Taught later this year · <button class="linkbtn" data-unlock="' + t.id + '">I\'ve covered it</button>' : (st(t.id).due ? 'Next review ' + esc(D.short(st(t.id).due)) : 'Not reviewed yet')}</div></div>${rate5(t.id, c)}</div>`;
    }
    h += '</div>';
  }
  h += '</div>';
  h += `<div class="sect"><h2>Where to practise</h2><div class="card"><ul class="pts"><li><a href="${esc(SPEC_PDF[s.id])}" target="_blank" rel="noopener">Official ${esc(s.board + ' ' + s.spec)} specification (PDF)</a> — the exact list of what can be examined</li>${s.resources.map((r) => `<li><a href="${esc(r[1])}" target="_blank" rel="noopener">${esc(r[0])}</a></li>`).join('')}</ul></div></div>`;
  return h;
}
function viewTopic(t) {
  const s = t.subj, x = st(t.id), d = D.today(), np = nextPaper(t, d);
  let h = `<a class="back" href="#subjects-${s.id}">← ${esc(s.name)}</a><div class="hero" style="padding-top:8px"><div class="eyebrow" style="color:${scol(s.id)}">${esc(s.name)} · ${esc(t.paperIds.map((id) => PAPER[id].code).join(', '))}</div><h1>${esc(t.n)}</h1>
    <div class="wrap-row">${t.h ? '<span class="chip">Higher tier only</span>' : ''}<span class="chip"><i class="dot" style="background:${ccol(x.c)}"></i>${esc(CONF_WORD[x.c || 0])}</span>${x.due ? '<span class="chip">Next review ' + esc(D.short(x.due)) + '</span>' : ''}${np ? '<span class="chip">Exam ' + esc(D.short(np.date)) + '</span>' : ''}</div></div>`;
  h += specLine(t);
  h += `<div class="sect"><div class="row" style="flex-wrap:wrap"><button class="btn primary" data-act="revise" data-t="${t.id}">Revise this now (25 min)</button>${rate5(t.id, x.c || 0)}</div></div>`;
  h += `<div class="sect"><h2>Key knowledge</h2><div class="card"><ul class="pts">${t.pts.map((p) => '<li>' + esc(p) + '</li>').join('')}</ul></div></div>`;
  if (t.cards && t.cards.length) h += `<div class="sect"><h2>Flashcards (${t.cards.length})</h2><div class="card"><ul class="pts">${t.cards.map((c) => '<li><b>' + esc(c[0]) + '</b><br><span class="muted">' + esc(c[1]) + '</span></li>').join('')}</ul></div></div>`;
  h += `<div class="sect"><h2>Exam practice task</h2><div class="card"><p>${esc(t.ex)}</p><div class="wrap-row" style="margin-top:12px">${s.resources.map((r) => `<a class="btn small" href="${esc(r[1])}" target="_blank" rel="noopener">${esc(r[0])} ↗</a>`).join('')}</div></div></div>`;
  return h;
}
function viewRate() {
  let h = '<a class="back" href="#subjects">← Subjects</a><div class="hero" style="padding-top:8px"><h1>Rate every topic</h1><p class="muted">Be honest — this is only for you. The planner uses these ratings to decide what comes first. <b>1</b> = don\'t know it, <b>3</b> = okay with gaps, <b>5</b> = exam-ready.</p></div>';
  for (const s of RG.subjects) {
    h += `<div class="sect"><h2 style="color:${scol(s.id)}">${esc(s.name)}</h2><div class="card" style="padding-block:4px">`;
    for (const t of visibleTopics(s)) h += `<div class="trow"><div><button class="tn" data-topic="${t.id}">${esc(t.n)}</button>${!taught(t, D.today()) ? '<div class="small muted">Taught later — rate it once covered</div>' : ''}</div>${rate5(t.id, st(t.id).c || 0)}</div>`;
    h += '</div></div>';
  }
  h += '<div class="sect"><a class="btn primary" href="#today">Done — show my plan</a></div>';
  return h;
}

function viewCards() {
  const d = D.today();
  const due = dueCards(d, cardsSubj), nw = Math.min(newAllowance(d), newCardPool(cardsSubj).length);
  const seen = Object.keys(state.cards).filter((id) => CARD[id] && (!cardsSubj || CARD[id].t.subj.id === cardsSubj));
  const box = [0, 0, 0, 0, 0, 0]; for (const id of seen) box[state.cards[id].b]++;
  let h = `<div class="hero"><div class="date">Spaced-repetition flashcards</div><h1>${due.length ? plural(due.length, 'card') + ' due' : 'All caught up'}</h1><p class="muted">Cards you get right move up a box and come back later (1 → 3 → 7 → 14 → 30 days). Cards you miss go back to box 0 and return tomorrow.</p></div>`;
  h += `<div class="sect"><div class="seg" role="group" aria-label="Subject filter"><button data-cs="" aria-pressed="${!cardsSubj}">All</button>${RG.subjects.map((s) => `<button data-cs="${s.id}" aria-pressed="${cardsSubj === s.id}">${esc(s.name.replace('English ', 'Eng. ').replace('Combined ', ''))}</button>`).join('')}</div></div>`;
  h += `<div class="sect"><div class="card stack"><div class="row" style="flex-wrap:wrap"><button class="btn primary" data-act="review" ${due.length + nw ? '' : 'disabled'}>Review ${due.length} due + ${nw} new</button><button class="btn" data-act="cram" ${newCardPool(cardsSubj).length + seen.length ? '' : 'disabled'}>Practise 20 random</button></div>
    <div class="boxes">${box.map((n, i) => `<div><b>${n}</b><span>BOX ${i}</span></div>`).join('')}</div>
    <div class="small muted">${seen.length} cards started · ${newCardPool(cardsSubj).length} not started yet${cardsSubj === 'german' || !cardsSubj ? ' · German vocab is introduced first' : ''}</div></div></div>`;
  return h;
}

function viewMore() {
  const s = state.settings;
  let h = '<div class="hero"><div class="date">Settings</div><h1>Tune your plan</h1></div>';
  if (auth.available) {
    h += `<div class="sect"><h2>Account</h2><div class="card stack">${auth.user
      ? `<p>Signed in as <b>${esc(auth.user.email || 'your Google account')}</b>. Your progress syncs to every device you sign in on.</p>${pwSection()}<div><button class="btn small" data-act="signout">Sign out</button></div>`
      : '<p>You\'re using the app without an account, so progress is saved on this device only.</p><div><button class="btn small primary" data-act="signin-now">Sign in or create an account</button></div>'}</div></div>`;
  }
  h += '<div class="sect"><h2>Tiers</h2><div class="card" style="padding-block:4px">';
  for (const id of ['maths', 'science', 'german']) {
    h += `<div class="field"><div><div class="l">${esc(SUBJ[id].name)}</div><div class="s">Higher-only topics are hidden on Foundation</div></div>
      <select id="tier-${id}" data-tier="${id}"><option value="H" ${s.tiers[id] !== 'F' ? 'selected' : ''}>Higher</option><option value="F" ${s.tiers[id] === 'F' ? 'selected' : ''}>Foundation</option></select></div>`;
  }
  h += '</div></div>';
  h += '<div class="sect"><h2>Mock exams</h2><p class="small muted">The school hasn\'t published exact mock dates online. These are estimates from the curriculum maps (late autumn term and spring term 1) — change them when you get your mock timetable.</p><div class="card" style="padding-block:4px">';
  s.mocks.forEach((m, i) => {
    h += `<div class="field"><div class="l">${esc(m.name)}</div><div class="row" style="flex-wrap:wrap;justify-content:flex-end"><input type="date" id="mock-${i}-start" data-mock="${i}" data-f="start" value="${esc(m.start)}" aria-label="${esc(m.name)} start"><input type="date" id="mock-${i}-end" data-mock="${i}" data-f="end" value="${esc(m.end)}" aria-label="${esc(m.name)} end"></div></div>`;
  });
  h += `<div class="field"><div><div class="l">German speaking exam</div><div class="s">Set by school (April–May). Enter it when you know it.</div></div><input type="date" id="speaking" data-speaking value="${esc(s.speakingDate)}"></div>`;
  h += '</div></div>';
  h += `<div class="sect"><h2>Workload</h2><div class="card" style="padding-block:4px">
    <div class="field"><div><div class="l">Intensity</div><div class="s">Scales every day's time</div></div><select id="intensity" data-intensity><option value="0.75" ${s.intensity == 0.75 ? 'selected' : ''}>Light (−25%)</option><option value="1" ${s.intensity == 1 ? 'selected' : ''}>Standard</option><option value="1.25" ${s.intensity == 1.25 ? 'selected' : ''}>Intense (+25%)</option></select></div>
    <div class="field"><div><div class="l">Light day each week</div><div class="s">Flashcards only, until Easter</div></div><select id="restday" data-restday>${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((n, i) => `<option value="${i}" ${Number(s.restDay) === i ? 'selected' : ''}>${n}</option>`).join('')}<option value="-1" ${Number(s.restDay) === -1 ? 'selected' : ''}>None</option></select></div></div></div>`;
  h += `<div class="sect"><h2>Backup</h2><div class="card stack"><div id="sync"></div>
    <p class="small muted">Copy your progress as a backup, or paste a backup to restore it.</p>
    <div class="row" style="flex-wrap:wrap"><button class="btn small" data-act="export">Copy backup</button><button class="btn small" data-act="import">Restore from box below</button></div>
    <textarea id="backup" placeholder="Paste a backup here to restore" aria-label="Backup data"></textarea>
    <div class="row" style="flex-wrap:wrap"><button class="btn small" data-act="reset">Reset everything…</button><span id="reset-confirm"></span></div></div></div>`;
  h += `<div class="sect"><h2>Why this method works</h2><div class="card"><ul class="pts">
    <li><b>Retrieval practice</b> (blurting, flashcards, exam questions) strengthens memory far more than re-reading or highlighting.</li>
    <li><b>Spacing:</b> reviewing just as you start to forget — 1, 3, 7, 14, 30 days — makes knowledge last until June.</li>
    <li><b>Interleaving</b> subjects and topics feels harder, but it improves exam performance because you learn to choose the right method.</li>
    <li><b>Timed past papers + mark schemes</b> teach you what examiners reward. Every paper you mark shows you which topics to fix.</li>
    <li><b>Short blocks with breaks</b> (25 + 5 minutes) keep your focus high. Sleep consolidates what you revised that day.</li></ul></div></div>`;
  h += `<div class="sect"><h2>Sources</h2><div class="card small"><ul class="pts">
    <li>Exam boards: <a href="https://ccc.tela.org.uk/information/examinations/" target="_blank" rel="noopener">Chesterton Community College — Examinations</a> (Maths Edexcel 1MA1; English Language AQA 8700; English Literature OCR J352; Combined Science AQA 8464; Geography AQA 8035; German AQA 8662; History OCR J410).</li>
    <li><b>Content checked against the official specifications</b> (September 2026): every topic shows the section of the spec it comes from. <a href="${SPEC_PDF.maths}" target="_blank" rel="noopener">Edexcel 1MA1</a> · <a href="${SPEC_PDF.science}" target="_blank" rel="noopener">AQA 8464</a> · <a href="${SPEC_PDF.englang}" target="_blank" rel="noopener">AQA 8700</a> · <a href="${SPEC_PDF.englit}" target="_blank" rel="noopener">OCR J352</a> · <a href="${SPEC_PDF.geog}" target="_blank" rel="noopener">AQA 8035</a> · <a href="${SPEC_PDF.hist}" target="_blank" rel="noopener">OCR J410</a> · <a href="${SPEC_PDF.german}" target="_blank" rel="noopener">AQA 8662</a> (German flashcards use only the AQA vocabulary list).</li>
    <li>Topic options and teaching order: Chesterton KS4 curriculum documents for English, Geography, History, German and Science. Where a topic needs your own class example (e.g. a case study), the app says so.</li>
    <li>Term dates: <a href="https://ccc.tela.org.uk/about/term-dates/" target="_blank" rel="noopener">Chesterton term dates 2026–27</a>.</li>
    <li>Exam dates: AQA provisional timetable May/June 2027, OCR final timetable June 2027, Pearson Edexcel Maths dates. Always check your personal timetable from school.</li></ul></div></div>`;
  return h;
}
// Accounts made with Google can add a password, so the same account works on the iPhone home-screen app.
function pwSection() {
  const A = window.RGAuth;
  if (!A || !A.providers || !auth.user || !auth.user.email) return '';
  const prov = A.providers();
  if (prov.includes('password')) return `<p class="small muted">Sign in with ${prov.includes('google.com') ? 'Google, or ' : ''}your email and password.</p>`;
  return `<form class="flat stack" id="pw-form" novalidate><div><b>Set a password</b><p class="small muted">Then you can sign in on your phone's home-screen app (or anywhere) with <b>${esc(auth.user.email)}</b> and this password. Same account, same progress.</p></div>
    <input type="email" autocomplete="username" value="${esc(auth.user.email)}" hidden aria-hidden="true" tabindex="-1">
    <label class="stack" style="gap:6px"><span class="l">New password (at least 6 characters)</span><input id="pw-new" type="password" autocomplete="new-password" minlength="6" class="pw-input"></label>
    ${auth.pwMsg ? `<p class="small" role="alert" style="color:${auth.pwOk ? 'var(--c5)' : 'var(--c1)'}">${esc(auth.pwMsg)}</p>` : ''}
    <div><button class="btn small primary" type="submit" ${auth.busy ? 'disabled' : ''}>Set password</button></div></form>`;
}
async function addPassword() {
  const A = window.RGAuth, pw = ($('#pw-new') || {}).value || '';
  auth.pwMsg = ''; auth.pwOk = false;
  if (pw.length < 6) { auth.pwMsg = 'Use a password of at least 6 characters.'; render(); return; }
  auth.busy = true; render();
  try { await A.addPassword(pw); auth.pwOk = true; auth.pwMsg = ''; toast('Password set — use ' + auth.user.email + ' and it on your phone'); }
  catch (e) { auth.pwMsg = AUTH_ERR[e && e.code] || ((e && e.message) || 'Something went wrong — try again.'); }
  auth.busy = false; render();
}
function updateSync() {
  const el = $('#sync'); if (!el) return;
  const map = {
    synced: ['ok', auth.available ? 'Synced to your account — progress follows you to every device you sign in on.' : 'Synced to your Claude account — progress follows you between phone and computer.'],
    connecting: ['', 'Connecting…'],
    readonly: ['warn', 'Saved on this device only (you can view but not save to the shared copy).'],
    error: ['warn', 'Saved on this device. Cloud sync hit a problem — it will retry on your next change.'],
    local: ['', auth.available ? 'Saved on this device only. Sign in (above) to sync between devices.' : 'Saved on this device only.'],
  };
  const [cls, txt] = map[cloud.status] || map.local;
  el.innerHTML = `<span class="sync ${cls}"><i></i>${esc(txt)}</span>`;
}

/* ---------- session overlay ---------- */
let sess = null, timerInt = null;
function openSession(opts) {
  // opts: {i, date} from plan, or {t} ad-hoc topic
  let b;
  if (opts.i != null) b = state.plans[opts.date].blocks[opts.i];
  else b = { k: kindFor(st(opts.t).c || 0, dayInfo(D.today()).phase.id, 99), t: opts.t, m: 25 };
  if (b.k === 'cards') { startCards('review', opts); return; }
  const steps = KIND[b.k].steps;
  sess = { b, opts, steps, step: 0, left: b.m * 60, running: false, checks: {}, rating: 0, cardQ: null, score: '', max: '' };
  $('#session').hidden = false; document.body.style.overflow = 'hidden';
  renderSession();
}
function closeSession() {
  clearInterval(timerInt); timerInt = null; sess = null;
  $('#session').hidden = true; $('#session').innerHTML = ''; document.body.style.overflow = '';
  render();
}
function tick() {
  if (!sess || !sess.running) return;
  sess.left = Math.max(0, sess.left - 1);
  const c = $('#clock'); if (c) c.textContent = fmtClock(sess.left);
  if (sess.left === 0) { sess.running = false; clearInterval(timerInt); timerInt = null; const tb = $('#timer-btn'); if (tb) tb.textContent = 'Restart'; toast('Time! Finish your step, then take a 5-minute break.'); }
}
function fmtClock(s) { return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }
function renderSession() {
  const s = sess, b = s.b, step = s.steps[s.step];
  const t = b.t ? TOPIC[b.t] : null, p = b.pid ? PAPER[b.pid] : null, subj = t ? t.subj : p.subj;
  let h = `<div class="sess-in"><div class="sess-top"><button class="x" data-act="close" aria-label="Close session">×</button><div class="grow"><div class="eyebrow" style="color:${scol(subj.id)}">${esc(subj.name)} · ${esc(KIND[b.k].label)}</div><div style="font-weight:700;line-height:1.25">${esc(t ? t.n : p.name)}</div></div>
    <div class="timer"><span class="clock" id="clock">${fmtClock(s.left)}</span><button class="btn small" id="timer-btn" data-act="timer">${s.running ? 'Pause' : (s.left === b.m * 60 ? 'Start timer' : 'Resume')}</button></div></div>`;
  h += '<div class="steps">' + s.steps.map((x, i) => `<i class="${i < s.step ? 'done' : i === s.step ? 'on' : ''}"></i>`).join('') + '</div>';
  h += '<div class="step-card">' + stepBody(step, t, p) + '</div></div>';
  $('#session').innerHTML = h;
  const f = $('#session .focus-me'); if (f) f.focus();
}
function stepNav(nextLabel, disabled) {
  return `<div class="sess-foot">${sess.step > 0 ? '<button class="btn" data-act="prev">Back</button>' : '<span></span>'}<button class="btn primary" data-act="next" ${disabled ? 'disabled' : ''}>${esc(nextLabel || 'Next')}</button></div>`;
}
function stepBody(step, t, p) {
  const s = sess;
  if (step === 'read') return `<h2>1 · Learn it (about 8 min)</h2><p class="muted">Read each point, then turn it into a quick mind map or a set of 5 questions on paper — don't copy it out.</p><div class="card"><ul class="pts">${t.pts.map((x) => '<li>' + esc(x) + '</li>').join('')}</ul></div>${specLine(t)}${stepNav('I\'ve made my notes — hide them')}`;
  if (step === 'blurt') return `<h2>${s.steps[0] === 'blurt' ? '1' : '2'} · Blurt (5 min)</h2><div class="card stack"><p><b>Close everything.</b> On a blank sheet, write down everything you can remember about <b>${esc(t.n)}</b>: key words, facts, examples, diagrams, equations.</p><p class="muted small">Struggling to remember is what makes the memory stronger — don't peek.</p></div>${stepNav('Done — check my blurt')}`;
  if (step === 'check') {
    const n = t.pts.length, got = Object.values(s.checks).filter(Boolean).length;
    return `<h2>Check against the key points</h2><p class="muted">Tick each point you got (roughly) right. In a different colour, add what you missed to your sheet.</p><div class="checkl">${t.pts.map((x, i) => `<label><input type="checkbox" id="chk-${i}" data-chk="${i}" ${s.checks[i] ? 'checked' : ''}><span>${esc(x)}</span></label>`).join('')}</div><p class="small muted mono">${got}/${n} recalled</p>${stepNav('Next')}`;
  }
  if (step === 'cards') {
    if (!s.cardQ) s.cardQ = { list: t.cardIds.slice(), i: 0, flip: false, right: 0, requeued: {} };
    const q = s.cardQ;
    if (!t.cardIds.length || q.i >= q.list.length) return `<h2>Flashcards</h2><div class="card empty">${t.cardIds.length ? `Cards done — ${q.right} right first time. They're now in your spaced-repetition deck.` : 'No flashcards for this topic.'}</div>${stepNav('Next')}`;
    const c = CARD[q.list[q.i]];
    return `<h2>Flashcards <span class="muted mono small">${q.i + 1}/${q.list.length}</span></h2>${cardFace(c, q.flip)}${q.flip ? `<div class="grade"><button class="no" data-act="sc-no">Didn't know</button><button class="yes" data-act="sc-yes">Knew it</button></div>` : '<p class="small muted" style="text-align:center">Say the answer out loud, then tap the card.</p>'}${stepNav('Skip cards')}`;
  }
  if (step === 'apply') {
    return `<h2>Apply it — exam style (${s.steps[0] === 'apply' ? '15' : '8'} min)</h2><div class="card stack"><p>${esc(t.ex)}</p><p class="small muted">Use past-paper questions on this topic and mark them with the official mark scheme.</p><div class="wrap-row">${t.subj.resources.map((r) => `<a class="btn small" href="${esc(r[1])}" target="_blank" rel="noopener">${esc(r[0])} ↗</a>`).join('')}</div></div><div class="flat small"><b>Technique reminder:</b> ${esc(t.subj.technique[0])}</div>${stepNav('Done')}`;
  }
  if (step === 'rate') {
    const got = Object.values(s.checks).filter(Boolean).length, n = t.pts.length;
    const sug = s.steps.includes('check') && Object.keys(s.checks).length ? Math.max(1, Math.min(5, Math.round(got / n * 5))) : 0;
    const np = nextPaper(t, D.today()); const dx = np ? D.diff(D.today(), np.date) : null;
    const nxt = s.rating ? D.short(D.add(D.today(), intervalFor(s.rating, (st(t.id).n || 0) + 1, dx))) : '';
    return `<h2>How confident are you now?</h2>${sug ? `<p class="muted small">You recalled ${got}/${n} points — that suggests about ${sug}.</p>` : ''}<div class="rate-big">${[1, 2, 3, 4, 5].map((r) => `<button data-act="pick" data-r="${r}" aria-pressed="${s.rating === r}"><b style="background:${ccol(r)}">${r}</b><span style="font-weight:700">${esc(CONF_WORD[r])}</span></button>`).join('')}</div>${nxt ? `<p class="small muted">Next review of this topic: <b>${esc(nxt)}</b></p>` : ''}${stepNav('Save & finish', !s.rating)}`;
  }
  if (step === 'paper') {
    return `<h2>Timed past paper — ${esc(p.subj.name)}</h2><div class="card stack"><p><b>${esc(p.name)}</b> (${esc(p.subj.board)} ${esc(p.code)}) — ${minsTxt(p.dur)} under exam conditions: timer on, phone away, no notes.</p>
      <ol class="small" style="margin:0;padding-left:20px;display:flex;flex-direction:column;gap:6px"><li>Pick a paper you haven't done (download it from the board's site).</li><li>Do it in one sitting. Stop when time is up.</li><li>Mark it strictly with the mark scheme (about 15 min).</li><li>Next screen: log your score and tap the topics that lost you marks.</li></ol>
      <div class="wrap-row">${p.subj.resources.map((r) => `<a class="btn small" href="${esc(r[1])}" target="_blank" rel="noopener">${esc(r[0])} ↗</a>`).join('')}</div></div>${stepNav('I\'ve marked it')}`;
  }
  if (step === 'score') {
    const ts = visibleTopics(p.subj).filter((t) => t.paperIds.includes(p.id));
    return `<h2>Log your score</h2><div class="card stack"><div class="row" style="flex-wrap:wrap"><label class="row">Score <input type="number" id="p-score" min="0" inputmode="numeric" value="${esc(s.score)}" style="width:90px"></label><label class="row">out of <input type="number" id="p-max" min="1" inputmode="numeric" value="${esc(s.max)}" style="width:90px"></label></div></div>
      <h3>Which topics lost you marks?</h3><p class="small muted">Tapped topics are marked weak (2/5) and scheduled for tomorrow.</p><div class="checkl">${ts.map((t) => `<label><input type="checkbox" id="weak-${t.id}" data-weak="${t.id}" ${s.checks[t.id] ? 'checked' : ''}><span>${esc(t.n)}</span></label>`).join('')}</div>${stepNav('Save & finish')}`;
  }
  return '';
}
function cardFace(c, flip) {
  return `<div class="fc" role="button" tabindex="0" data-act="flip" aria-label="Flashcard — tap to ${flip ? 'hide' : 'show'} the answer"><span class="src" style="color:${scol(c.t.subj.id)}">${esc(c.t.subj.name)} · ${esc(c.t.n)}</span><div class="q">${esc(c.q)}</div>${flip ? `<div class="a">${esc(c.a)}</div>` : '<div class="hint">Tap to reveal</div>'}</div>`;
}
function finishSession() {
  const s = sess, b = s.b, d = D.today();
  if (b.t) {
    rateTopic(b.t, s.rating, d);
    logMinutes(d, TOPIC[b.t].subj.id, b.m);
  } else if (b.pid) {
    const sc = Number(s.score), mx = Number(s.max);
    (state.papersDone[b.pid] = state.papersDone[b.pid] || []).push({ d, sc: isFinite(sc) ? sc : null, mx: isFinite(mx) && mx > 0 ? mx : null });
    for (const id of Object.keys(s.checks)) if (s.checks[id] && TOPIC[id]) state.topics[id] = Object.assign({}, st(id), { c: 2, due: D.add(d, 1) });
    logMinutes(d, PAPER[b.pid].subj.id, b.m);
  }
  if (s.opts.i != null && state.plans[s.opts.date]) state.plans[s.opts.date].done[s.opts.i] = b.t ? s.rating : 1;
  save();
  toast(b.t ? 'Saved — next review ' + D.short(state.topics[b.t].due) : 'Paper logged');
  closeSession();
}

/* ---------- flashcard review overlay ---------- */
function startCards(mode, opts) {
  const d = D.today();
  let list;
  if (mode === 'cram') {
    const pool = Object.keys(state.cards).map((id) => CARD[id]).filter((c) => c && cardAvailable(c) && (!cardsSubj || c.t.subj.id === cardsSubj));
    const fresh = newCardPool(cardsSubj);
    const all = pool.concat(fresh);
    list = all.map((c) => [hash(c.id + Date.now()), c]).sort((a, b) => a[0] - b[0]).slice(0, 20).map((x) => x[1].id);
  } else {
    const subj = opts && opts.i != null ? null : cardsSubj;
    list = dueCards(d, subj).slice(0, 60).map((c) => c.id).concat(newCardPool(subj).slice(0, newAllowance(d)).map((c) => c.id));
  }
  sess = { b: { k: 'cards', m: 15 }, opts: opts || {}, deck: { list, i: 0, flip: false, right: 0, wrong: 0, again: {} }, mode, left: 15 * 60, running: false };
  $('#session').hidden = false; document.body.style.overflow = 'hidden';
  renderDeck();
}
function renderDeck() {
  const q = sess.deck;
  let h = `<div class="sess-in"><div class="sess-top"><button class="x" data-act="close" aria-label="Close flashcards">×</button><div class="grow"><div class="eyebrow">${sess.mode === 'cram' ? 'Practice set' : 'Spaced repetition'}</div><div style="font-weight:700">Flashcards</div></div><div class="mono small muted">${Math.min(q.i + 1, q.list.length)}/${q.list.length}</div></div>`;
  h += `<div class="steps">${q.list.length ? `<i class="on" style="flex:none;width:${Math.round(q.i / q.list.length * 100)}%"></i><i style="flex:1"></i>` : '<i></i>'}</div>`;
  if (q.i >= q.list.length) {
    h += `<div class="card empty stack"><h2>${q.list.length ? 'Deck complete' : 'Nothing due'}</h2><p>${q.list.length ? `${q.right} right · ${q.wrong} to see again tomorrow` : 'No cards are due right now. Come back tomorrow, or practise a random set.'}</p></div>`;
    h += `<div class="sess-foot"><span></span><button class="btn primary focus-me" data-act="deck-done">Finish</button></div>`;
  } else {
    const c = CARD[q.list[q.i]];
    h += cardFace(c, q.flip);
    h += q.flip ? '<div class="grade"><button class="no" data-act="dk-no">Didn\'t know <span class="mono small">(1)</span></button><button class="yes" data-act="dk-yes">Knew it <span class="mono small">(2)</span></button></div>' : '<p class="small muted" style="text-align:center">Say the answer, then tap the card (or press Space).</p>';
    const cs = state.cards[c.id];
    h += `<p class="small muted" style="text-align:center">${cs ? 'Box ' + cs.b : 'New card'}</p>`;
  }
  h += '</div>';
  $('#session').innerHTML = h;
  const f = $('#session .focus-me'); if (f) f.focus();
}
function deckGrade(ok) {
  const q = sess.deck, id = q.list[q.i], d = D.today();
  if (sess.mode === 'cram') { if (ok) q.right++; else q.wrong++; if (state.cards[id] || ok) gradeCard(id, ok, d); }
  else {
    if (!q.again[id]) gradeCard(id, ok, d);
    if (ok) q.right++; else { q.wrong++; if (!q.again[id]) { q.again[id] = 1; q.list.push(id); } }
  }
  q.i++; q.flip = false;
  save(); renderDeck();
}
function deckDone() {
  const o = sess.opts;
  if (o && o.i != null && state.plans[o.date]) { state.plans[o.date].done[o.i] = 1; logMinutes(o.date, null, 15); save(); }
  closeSession();
}

/* ---------- events ---------- */
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act],[data-rate],[data-topic],[data-unlock],[data-tab],[data-cs],[data-chk],[data-weak]');
  if (!el) return;
  if (el.dataset.rate) {
    quickRate(el.dataset.rate, Number(el.dataset.r)); save();
    const grp = el.parentElement; $$('button', grp).forEach((b) => b.setAttribute('aria-pressed', b === el ? 'true' : 'false'));
    return;
  }
  if (el.dataset.topic) { go('subjects', el.dataset.topic); return; }
  if (el.dataset.unlock) { state.unlocked[el.dataset.unlock] = true; save(); render(); toast('Added to your plan'); return; }
  if (el.dataset.tab) { planTab = el.dataset.tab; render(); return; }
  if (el.dataset.cs != null && el.closest('.seg')) { cardsSubj = el.dataset.cs || null; render(); return; }
  if (el.dataset.chk != null) { sess.checks[el.dataset.chk] = el.checked; const m = $('#session .mono.small'); if (m) m.textContent = Object.values(sess.checks).filter(Boolean).length + '/' + TOPIC[sess.b.t].pts.length + ' recalled'; return; }
  if (el.dataset.weak) { sess.checks[el.dataset.weak] = el.checked; return; }
  const a = el.dataset.act, d = D.today();
  switch (a) {
    case 'start': openSession({ i: Number(el.dataset.i), date: d }); break;
    case 'revise': openSession({ t: el.dataset.t }); break;
    case 'rebuild': rebuildPlan(d); render(); toast('Rebuilt from your latest ratings'); break;
    case 'close': if (sess && sess.deck) deckDone(); else closeSession(); break;
    case 'timer':
      if (!sess) break;
      if (sess.left === 0) sess.left = sess.b.m * 60;
      sess.running = !sess.running;
      clearInterval(timerInt); timerInt = sess.running ? setInterval(tick, 1000) : null;
      el.textContent = sess.running ? 'Pause' : 'Resume'; break;
    case 'next': {
      const step = sess.steps[sess.step];
      if (step === 'score') { sess.score = ($('#p-score') || {}).value || ''; sess.max = ($('#p-max') || {}).value || ''; finishSession(); break; }
      if (step === 'rate') { if (sess.rating) finishSession(); break; }
      sess.step++; renderSession(); window.scrollTo(0, 0); $('#session').scrollTop = 0; break;
    }
    case 'prev': sess.step = Math.max(0, sess.step - 1); renderSession(); break;
    case 'pick': sess.rating = Number(el.dataset.r); renderSession(); break;
    case 'flip':
      if (sess.deck) { sess.deck.flip = !sess.deck.flip; renderDeck(); }
      else if (sess.cardQ) { sess.cardQ.flip = !sess.cardQ.flip; renderSession(); }
      break;
    case 'sc-yes': case 'sc-no': {
      const q = sess.cardQ, id = q.list[q.i], ok = a === 'sc-yes';
      if (!q.requeued[id]) gradeCard(id, ok, d);
      if (ok) { if (!q.requeued[id]) q.right++; } else if (!q.requeued[id]) { q.requeued[id] = 1; q.list.push(id); }
      q.i++; q.flip = false; save(); renderSession(); break;
    }
    case 'dk-yes': deckGrade(true); break;
    case 'dk-no': deckGrade(false); break;
    case 'deck-done': deckDone(); break;
    case 'review': startCards('review'); break;
    case 'cram': startCards('cram'); break;
    case 'export': {
      const txt = JSON.stringify(state); const ta = $('#backup'); ta.value = txt;
      const done = () => toast('Backup copied');
      try { navigator.clipboard.writeText(txt).then(done, () => { ta.select(); toast('Select-all and copy the box'); }); } catch (err) { ta.select(); toast('Select-all and copy the box'); }
      break;
    }
    case 'import': {
      try { const obj = JSON.parse($('#backup').value); if (!obj || !obj.settings) throw new Error('bad'); state = migrate(obj); applySettings(); save(); render(); toast('Progress restored'); }
      catch (err) { toast('That doesn\'t look like a backup — paste the whole text'); }
      break;
    }
    case 'reset': $('#reset-confirm').innerHTML = '<button class="btn small" data-act="reset-yes" style="color:var(--c1)">Yes, delete all my progress</button>'; break;
    case 'login-signup': authDo('signup'); break;
    case 'login-google': authDo('google'); break;
    case 'login-reset': authDo('reset'); break;
    case 'login-skip': setSkipLogin(true); go('today'); break;
    case 'signin-now': setSkipLogin(false); render(); window.scrollTo(0, 0); break;
    case 'signout': authSignOut(); break;
    case 'reset-yes': { const keep = state.settings; state = defaultState(); state.settings = keep; save(); render(); toast('Progress reset'); break; }
  }
});
document.addEventListener('submit', (e) => {
  if (e.target && e.target.id === 'login-form') { e.preventDefault(); authDo('signin'); }
  if (e.target && e.target.id === 'pw-form') { e.preventDefault(); addPassword(); }
});
document.addEventListener('change', (e) => {
  const el = e.target;
  if (el.dataset.chk != null || el.dataset.weak) return; // handled on click
  if (el.dataset.tier) { state.settings.tiers[el.dataset.tier] = el.value; afterSettings(); }
  else if (el.dataset.mock != null) { const m = state.settings.mocks[Number(el.dataset.mock)]; if (el.value) m[el.dataset.f] = el.value; if (m.end < m.start) m.end = m.start; afterSettings(); }
  else if (el.dataset.speaking != null) { if (el.value) state.settings.speakingDate = el.value; applySettings(); afterSettings(); }
  else if (el.dataset.intensity != null) { state.settings.intensity = Number(el.value); afterSettings(); }
  else if (el.dataset.restday != null) { state.settings.restDay = Number(el.value); afterSettings(); }
});
function afterSettings() { rebuildPlan(D.today()); save(); toast('Plan updated'); render(); }
document.addEventListener('keydown', (e) => {
  if (!sess) return;
  if (e.key === 'Escape') { if (sess.deck) deckDone(); else closeSession(); return; }
  const inField = /INPUT|TEXTAREA|SELECT/.test(document.activeElement && document.activeElement.tagName);
  if (inField) return;
  if (sess.deck && sess.deck.i < sess.deck.list.length) {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); sess.deck.flip = !sess.deck.flip; renderDeck(); }
    else if (sess.deck.flip && e.key === '1') deckGrade(false);
    else if (sess.deck.flip && e.key === '2') deckGrade(true);
  }
});
function readHash() {
  const h = location.hash.slice(1);
  const [r, ...rest] = h.split('-'); const s = rest.join('-');
  route = ['today', 'plan', 'subjects', 'cards', 'more', 'rate'].includes(r) ? r : 'today';
  sub = s || null;
}
window.addEventListener('hashchange', () => { readHash(); if (sess) closeSession(); render(); window.scrollTo(0, 0); });

/* ---------- boot ---------- */
function boot() {
  $('#nav').innerHTML = '<div class="nav-in">' + [['today', 'Today'], ['plan', 'Plan'], ['subjects', 'Subjects'], ['cards', 'Cards'], ['more', 'Settings']]
    .map(([r, l]) => `<a href="#${r}" data-r="${r}">${ICON[r]}<span>${l}</span></a>`).join('') + '</div>';
  readHash(); render();
  initClaudeCloud();
  initFirebaseAuth();
  window.addEventListener('rgauth-ready', () => { initFirebaseAuth(); render(); });
  // roll over to a new day if the app stays open past midnight
  let day = D.today();
  setInterval(() => { if (D.today() !== day) { day = D.today(); if (!sess) render(); } }, 60000);
}
boot();
