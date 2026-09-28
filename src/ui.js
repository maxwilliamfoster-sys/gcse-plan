/* ============================================================
   GCSE Plan — UI layer (bright, chunky, playful)
   Rendering, lessons, flashcards, celebrations, events, boot.
   Engine (planner, sync, data) lives in app.js.
   ============================================================ */

/* ---------- icons ---------- */
const IC = {
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M10 20v-5h4v5"/>',
  plan: '<path d="M9 4 3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
  book: '<path d="M2.5 5.5c3-1.4 6.3-1.4 9.5.8 3.2-2.2 6.5-2.2 9.5-.8V19c-3-1.4-6.3-1.4-9.5.8C8.8 17.6 5.5 17.6 2.5 19z"/><path d="M12 6.3v13.4"/>',
  cards: '<rect x="3" y="7" width="13" height="14" rx="2.5"/><path d="M7.5 7V5.5A2.5 2.5 0 0 1 10 3h8.5A2.5 2.5 0 0 1 21 5.5v10a2.5 2.5 0 0 1-2.5 2.5H16"/>',
  sliders: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  fire: '<path fill="currentColor" stroke="none" d="M12.6 1.8c.4 3.1-1.7 4.7-1.7 7 0 1.3.9 2.3 2.1 2.3 1.5 0 2.3-1.2 2.1-2.8 2.3 1.7 3.9 4.3 3.9 7.2A7 7 0 0 1 12 22.5a7 7 0 0 1-7-7c0-4.6 4.4-7 6.1-10.2.5-1 .9-2.2 1.5-3.5z"/>',
  bolt: '<path fill="currentColor" stroke="none" d="M13.5 1.8 4 14h6.6l-1.3 8.2L19 10h-6.7z"/>',
  cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  check: '<path d="M5 12.5l4.6 4.6L19.2 7.5" stroke-width="3.2"/>',
  x: '<path d="M6 6l12 12M18 6 6 18" stroke-width="3"/>',
  star: '<path fill="currentColor" stroke="none" d="m12 2.6 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4L2.8 9.3l6.4-.8z"/>',
  bulb: '<path d="M9 18h6M10 21.5h4"/><path d="M12 2.8a6.2 6.2 0 0 0-3.6 11.3c.7.5 1.1 1.3 1.1 2.1v.8h5v-.8c0-.8.4-1.6 1.1-2.1A6.2 6.2 0 0 0 12 2.8z"/>',
  pencil: '<path d="M4 20l1.2-4.8L16 4.4a2 2 0 0 1 2.8 0l.8.8a2 2 0 0 1 0 2.8L8.8 18.8z"/><path d="M14.5 6l3.5 3.5"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
  doc: '<path d="M6 2.5h8.5l4.5 4.5v14.5H6z"/><path d="M14 2.5V7h5M9 12h7M9 16h5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  trophy: '<path d="M8 21h8M12 16.5V21M7 3.5h10V9a5 5 0 0 1-10 0z"/><path d="M17 5h3v1.5a3.5 3.5 0 0 1-3.5 3.5M7 5H4v1.5A3.5 3.5 0 0 0 7.5 10"/>',
  chevL: '<path d="M15 5l-7 7 7 7" stroke-width="3"/>',
  chevR: '<path d="M9 5l7 7-7 7" stroke-width="3"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.5v.2" stroke-width="2.8"/>',
  alert: '<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.2v.2" stroke-width="2.8"/>',
  lock: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  sound: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9a4.2 4.2 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  google: '<path d="M21 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5a4.3 4.3 0 0 1-1.9 2.8v2.3h3A9 9 0 0 0 21 12.2z" fill="#4285F4" stroke="none"/><path d="M12 21.3c2.5 0 4.6-.8 6.1-2.3l-3-2.3c-.8.6-1.9.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H3.8v2.4A9.2 9.2 0 0 0 12 21.3z" fill="#34A853" stroke="none"/><path d="M6.9 13.8a5.5 5.5 0 0 1 0-3.6V7.8H3.8a9.2 9.2 0 0 0 0 8.4z" fill="#FBBC05" stroke="none"/><path d="M12 6.5c1.3 0 2.5.5 3.5 1.4l2.6-2.6A9.2 9.2 0 0 0 3.8 7.8l3.1 2.4C7.6 8.1 9.6 6.5 12 6.5z" fill="#EA4335" stroke="none"/>',
  maths: '<path d="M6.5 3.5v6M3.5 6.5h6M14.5 6.5h6M4 14.5l5 5M9 14.5l-5 5M14.5 17h6"/><circle cx="17.5" cy="14.3" r=".9" fill="currentColor"/><circle cx="17.5" cy="19.7" r=".9" fill="currentColor"/>',
  science: '<path d="M9 2.8h6M10 2.8v6.4L4.6 18.6a1.7 1.7 0 0 0 1.5 2.6h11.8a1.7 1.7 0 0 0 1.5-2.6L14 9.2V2.8"/><path d="M7.2 14.5h9.6"/>',
  englang: '<path d="M4 4.5h16v11.5H9.5L4.5 20z"/><path d="M8.5 8.5h7M8.5 12h4.5"/>',
  englit: '<path d="M20.5 3.5C12.5 3.5 6 9.5 5 19"/><path d="M20.5 3.5c0 7.5-5.5 12-12 12.5"/><path d="M3.5 20.5 7 17"/>',
  geog: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.4 3 14.6 0 18M12 3c-3 3.4-3 14.6 0 18"/>',
  hist: '<path d="M3 21h18M12 3l9 4.5H3z"/><path d="M5.5 10v8M10 10v8M14 10v8M18.5 10v8M4 10h16M4 18h16"/>',
  german: '<path d="M3 4.5h11.5v8.5H7.5L3 16.5z"/><path d="M10.5 16v1.5h6l4.5 3.5V9.5h-3.5"/>',
};
function ic(name, cls) { return `<svg class="ico${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[name] || ''}</svg>`; }
const KIND_ICON = { learn: 'book', recall: 'bulb', exam: 'pencil', final: 'target', paper: 'doc', cards: 'cards' };
const sv = (sid) => `--c:var(--${sid});--cd:var(--${sid}-d);--t:var(--${sid}-t);--d:var(--${sid}-d)`;
const scol = (sid) => 'var(--' + sid + ')';
const ccol = (c) => 'var(--c' + (c || 0) + ')';
const CONF_WORD = ['Not rated', 'Don\'t know it', 'Shaky', 'Okay, some gaps', 'Good', 'Exam-ready'];
function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }
function minsTxt(m) { if (m < 60) return m + ' min'; const h = Math.floor(m / 60), r = m % 60; return h + 'h' + (r ? ' ' + r + 'm' : ''); }
function nextExam(d) { return PAPERS.find((p) => p.date >= d && !p.approx) || null; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function monAbbr(s) { return D.fmt(s, { month: 'short' }).toUpperCase(); }
function dayNum(s) { return D.fmt(s, { day: 'numeric' }); }

/* ---------- XP, streak, sound, confetti ---------- */
function addXP(n) {
  if (!n) return;
  state.xp = (state.xp || 0) + n;
  const d = D.today(), day = state.days[d] || (state.days[d] = { m: 0, subj: {} });
  day.xp = (day.xp || 0) + n;
  if (sess) sess.xp = (sess.xp || 0) + n;
}
function activeOn(d) { const y = state.days[d]; return !!(y && ((y.m || 0) > 0 || (y.xp || 0) > 0)); }
function streak() { let d = D.today(), n = 0; if (!activeOn(d)) d = D.add(d, -1); while (activeOn(d)) { n++; d = D.add(d, -1); } return n; }
const Sound = {
  ctx: null,
  on() { return state.settings.sound !== false; },
  c() { if (!this.ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; this.ctx = new C(); } if (this.ctx.state === 'suspended') this.ctx.resume(); return this.ctx; },
  play(notes, type, vol) {
    if (!this.on()) return; const c = this.c(); if (!c) return;
    let t = c.currentTime + 0.01;
    for (const [f, dur, gap] of notes) {
      const o = c.createOscillator(), g = c.createGain();
      o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.03); t += gap;
    }
  },
  correct() { this.play([[784, 0.14, 0.09], [1175, 0.24, 0]], 'sine', 0.2); },
  wrong() { this.play([[247, 0.16, 0.12], [196, 0.26, 0]], 'triangle', 0.16); },
  tick() { this.play([[988, 0.07, 0]], 'sine', 0.1); },
  win() { this.play([[523, 0.14, 0.11], [659, 0.14, 0.11], [784, 0.14, 0.11], [1047, 0.4, 0]], 'sine', 0.2); },
};
function buzz(ms) { try { const ua = navigator.userActivation; if (navigator.vibrate && (!ua || ua.hasBeenActive)) navigator.vibrate(ms); } catch (e) { /* not supported */ } }
const reduceMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function confetti(opts) {
  if (reduceMotion()) return;
  opts = opts || {};
  const cv = document.createElement('canvas'); cv.className = 'confetti'; document.body.appendChild(cv);
  const W = innerWidth, H = innerHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = W * dpr; cv.height = H * dpr; const x = cv.getContext('2d'); x.scale(dpr, dpr);
  const cols = ['#58CC02', '#1CB0F6', '#FFC800', '#FF4B4B', '#CE82FF', '#FF9600', '#00CD9C'];
  const n = opts.n || 90, ox = opts.x != null ? opts.x : W / 2, oy = opts.y != null ? opts.y : H * 0.4, spread = opts.spread || 15;
  const ps = Array.from({ length: n }, () => ({ x: ox, y: oy, vx: (Math.random() - 0.5) * spread, vy: -Math.random() * spread - 4, r: Math.random() * 6 + 5, c: cols[Math.random() * cols.length | 0], a: Math.random() * 6, va: (Math.random() - 0.5) * 0.35, sq: Math.random() < 0.6 }));
  let last = performance.now();
  (function frame(t) {
    const dt = Math.min(34, t - last) / 16.7; last = t;
    x.clearRect(0, 0, W, H); let alive = 0;
    for (const p of ps) {
      p.vy += 0.42 * dt; p.vx *= 0.985; p.x += p.vx * dt; p.y += p.vy * dt; p.a += p.va * dt;
      if (p.y < H + 30) { alive++; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; if (p.sq) x.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); else { x.beginPath(); x.arc(0, 0, p.r / 2.4, 0, 6.3); x.fill(); } x.restore(); }
    }
    if (alive) requestAnimationFrame(frame); else cv.remove();
  })(last);
}
function xpFloat(n, el) {
  const f = document.createElement('div'); f.className = 'xpfloat'; f.textContent = '+' + n + ' XP';
  const r = el ? el.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0 };
  f.style.left = (r.left + r.width / 2) + 'px'; f.style.top = (r.top - 10) + 'px';
  document.body.appendChild(f); setTimeout(() => f.remove(), 1050);
}
function toast(msg) {
  $$('.toast').forEach((t) => t.remove());
  const el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); el.textContent = msg;
  document.body.appendChild(el); setTimeout(() => el.remove(), 2300);
}

/* ---------- shared bits ---------- */
function mastery(s) { const a = subjectAvg(s); return Math.round((a.avg / 5) * 100); }
function rate5(id, cur) {
  return '<div class="rate5" role="group" aria-label="Confidence 1 to 5">' + [1, 2, 3, 4, 5].map((r) =>
    `<button type="button" data-rate="${esc(id)}" data-r="${r}" aria-pressed="${cur === r}" title="${CONF_WORD[r]}">${r}</button>`).join('') + '</div>';
}
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
  return ref ? `<div class="spec-ref"><span class="caps">Official spec</span> <a href="${esc(SPEC_PDF[t.subj.id])}" target="_blank" rel="noopener">${esc(ref)}</a></div>` : '';
}
function note(html, tone, icon) {
  const tones = { blue: '--t:var(--blue-t);--d:var(--blue)', yellow: '--t:var(--yellow-t);--d:var(--yellow-d)', red: '--t:var(--red-t);--d:var(--red)', green: '--t:var(--green-t);--d:var(--green-d)', purple: '--t:var(--purple-t);--d:var(--purple-d)' };
  return `<div class="note" style="${tones[tone || 'blue']}">${ic(icon || 'info')}<div>${html}</div></div>`;
}

/* ---------- router & chrome ---------- */
let route = 'today', sub = null, planTab = 'days', cardsSubj = null, openNode = null, cardsTab = 'cards';
function topBar() {
  const nx = nextExam(D.today()), dx = nx ? D.diff(D.today(), nx.date) : null, sk = streak();
  return `<div class="top-in"><a class="logo" href="#today" aria-label="GCSE Plan home"><i>27</i><span>GCSE Plan</span></a>
    <a class="stat fire${sk ? '' : ' off'}" href="#plan" title="${plural(sk, 'day')} streak" aria-label="${plural(sk, 'day')} streak">${ic('fire')}<span class="num">${sk}</span></a>
    <span class="stat xp" title="Total XP" aria-label="${state.xp || 0} XP">${ic('bolt')}<span class="num">${state.xp || 0}</span></span>
    <button class="stat days linkbtn" data-act="to-exams" title="Days to your first exam" aria-label="${dx == null ? 'No exams left' : plural(dx, 'day') + ' to your next exam'}" style="text-transform:none;letter-spacing:0;font-size:16px">${ic('cal')}<span class="num">${dx == null ? '–' : dx}</span></button></div>`;
}
function render() {
  const v = $('#view'), top = $('#top'), nav = $('#nav');
  if (authPending()) { top.hidden = true; nav.hidden = true; v.innerHTML = '<div class="login" style="padding-top:90px"><div class="appmark">27</div><p class="muted">Loading your plan…</p></div>'; return; }
  if (needsLogin()) { top.hidden = true; nav.hidden = true; v.innerHTML = viewLogin(); return; }
  top.hidden = false; nav.hidden = false;
  top.innerHTML = topBar();
  const map = { today: viewToday, plan: viewPlan, subjects: viewSubjects, cards: viewCards, more: viewMore, rate: viewRate };
  v.innerHTML = (map[route] || viewToday)();
  $$('.nav a').forEach((a) => a.setAttribute('aria-current', a.dataset.r === (route === 'rate' ? 'subjects' : route) ? 'page' : 'false'));
  updateSync();
}
function go(r, s) { route = r; sub = s || null; const h = s ? r + '-' + s : r; if (location.hash.slice(1) !== h) history.replaceState(null, '', '#' + h); render(); window.scrollTo(0, 0); }

/* ---------- login ---------- */
function viewLogin() {
  const standalone = window.navigator.standalone === true;
  return `<div class="login"><div class="appmark">27</div>
    <div><h1>Your GCSE plan</h1><p class="muted" style="margin-top:6px">Sign in so your streak, XP and progress follow you between your phone and computer.</p></div>
    <form id="login-form" autocomplete="on" novalidate>
      <input id="login-email" name="email" type="email" autocomplete="username" inputmode="email" placeholder="Email" aria-label="Email" required>
      <input id="login-pass" name="password" type="password" autocomplete="current-password" minlength="6" placeholder="Password" aria-label="Password" required>
      ${auth.error ? `<p class="small" role="alert" style="color:var(--red);font-weight:800">${esc(auth.error)}</p>` : ''}
      <button class="btn blue full" type="submit" ${auth.busy ? 'disabled' : ''}>Sign in</button>
      <button class="btn full" type="button" data-act="login-signup" ${auth.busy ? 'disabled' : ''}>Create account</button>
      <div class="or">or</div>
      <button class="btn full plain" type="button" data-act="login-google" ${auth.busy ? 'disabled' : ''}>${ic('google')} Continue with Google</button>
      <p class="tiny muted" style="text-align:center">${standalone
        ? 'Google not opening here? Sign in with Google on your computer, set a password in Settings, then use it on this phone.'
        : 'Made your account with Google? You can also set a password in Settings to sign in anywhere.'}</p>
      <div class="row" style="justify-content:center;gap:18px"><button class="linkbtn" type="button" data-act="login-reset">Forgot password?</button></div>
    </form>
    <button class="linkbtn" data-act="login-skip" style="color:var(--ink-3)">Use without an account</button></div>`;
}

/* ---------- today ---------- */
function greeting() { const h = new Date().getHours(); return h < 12 ? 'Good morning!' : h < 18 ? 'Good afternoon!' : 'Good evening!'; }
function viewToday() {
  const d = D.today(), info = dayInfo(d), plan = ensurePlan(d), ph = info.phase, nx = nextExam(d);
  const doneMins = plan.blocks.reduce((a, b, i) => a + (plan.done[i] != null ? b.m : 0), 0);
  const totMins = plan.blocks.reduce((a, b) => a + b.m, 0);
  const pct = totMins ? Math.round(doneMins / totMins * 100) : 0;
  const left = plan.blocks.filter((b, i) => plan.done[i] == null).length;
  const allT = TOPICS.filter(tierOk), rated = allT.filter((t) => st(t.id).c).length;
  let h = `<div class="hello"><div class="caps">${esc(D.long(d))}</div><h1>${pct >= 100 && totMins ? 'Daily goal smashed!' : greeting()}</h1></div>`;
  if (totMins) {
    h += `<div class="sect"><div class="card goal"><div class="ring" style="--p:${pct}"><b class="num">${pct}%</b></div><div class="stack" style="gap:8px">
      <div class="row" style="justify-content:space-between"><b>Daily goal</b><span class="small muted num">${minsTxt(doneMins)} / ${minsTxt(totMins)}</span></div>
      <div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Daily goal"><i style="width:${pct}%"></i></div>
      <span class="small muted">${left ? plural(left, 'session') + ' left today' : 'All sessions done — see you tomorrow!'}</span></div></div></div>`;
  }
  // alerts
  const notes = [];
  if (rated < allT.length * 0.6) notes.push(note(`<b>First, rate your topics</b> (${rated}/${allT.length}). It takes 5 minutes and tells the planner exactly what you need.<div style="margin-top:10px"><a class="btn blue sm" href="#rate">Rate topics</a></div>`, 'blue', 'star'));
  if (info.exams.length) notes.push(note(`<b>Exam today:</b> ${info.exams.map((p) => esc(p.subj.name + ' — ' + p.name + ' (' + p.time + ')')).join('; ')}. Light flashcards only, eat breakfast, arrive early. You've got this!`, 'yellow', 'trophy'));
  const tmr = examsOn(D.add(d, 1));
  if (tmr.length) notes.push(note(`<b>Tomorrow:</b> ${tmr.map((p) => esc(p.subj.name + ' — ' + p.name)).join('; ')}. Tonight's path focuses on it. Stop by 9:30pm and sleep.`, 'red', 'alert'));
  const m = state.settings.mocks.find((x) => x.start > d && D.diff(d, x.start) <= 21);
  if (m) notes.push(note(`<b>${esc(m.name)}</b> start ${esc(D.short(m.start))} — ${plural(D.diff(d, m.start), 'day')} away. (Estimated dates — fix them in <a href="#more">Settings</a>.)`, 'purple', 'cal'));
  if (ph.id === 'gaps' && D.diff(state.settings.mocks[0].end, d) <= 21) notes.push(note('<b>Mock results back?</b> Re-rate your topics using your marks. <a href="#rate">Rate topics</a>', 'blue', 'info'));
  if (notes.length) h += '<div class="sect">' + notes.join('') + '</div>';
  // phase banner
  if (ph.id !== 'after') {
    const P = phases(), idx = Math.max(0, P.findIndex((p) => p.id === ph.id));
    h += `<div class="sect"><div class="unit"><div class="grow"><div class="caps">Phase ${idx + 1} · until ${esc(D.short(ph.end))}</div><h2>${esc(ph.name)}</h2><p>${esc(ph.goal)}</p></div><a class="btn sm" href="#plan" data-act="to-road" aria-label="See the roadmap">${ic('plan')}</a></div></div>`;
  }
  // path
  if (!plan.blocks.length) {
    h += `<div class="sect"><div class="card empty stack" style="align-items:center"><div class="trophy won">${ic('star')}</div><h2>${info.type === 'rest' ? 'Rest day' : 'Nothing today'}</h2><p>${info.type === 'rest' ? 'Rest is part of the plan. Recharge and come back tomorrow!' : 'Nothing is scheduled today.'}</p></div></div>`;
  } else {
    const cur = plan.blocks.findIndex((b, i) => plan.done[i] == null);
    const OFF = [0, -58, -86, -58, 0, 58, 86, 58];
    h += '<div class="path">';
    plan.blocks.forEach((b, i) => { h += pathNode(b, i, plan, d, OFF[i % OFF.length], i === cur); });
    const allDone = cur === -1;
    h += `<div class="path-end"><div class="trophy${allDone ? ' won' : ''}">${ic('trophy')}</div><span>${allDone ? 'Path complete — great work!' : 'Finish the path to hit your daily goal'}</span></div></div>`;
    h += `<div class="row" style="justify-content:center;margin-top:10px"><button class="linkbtn" data-act="rebuild">Rebuild today's path</button></div>`;
  }
  // next exam + week
  if (nx) {
    const dx = D.diff(d, nx.date);
    h += `<div class="sect"><h2>Next exam</h2><div class="card exam"><div class="cal"><b>${monAbbr(nx.date)}</b><span>${dayNum(nx.date)}</span></div><div class="grow">
      <div class="caps" style="color:var(--${nx.subj.id}-d)">${esc(nx.subj.name)}</div><h3 style="margin-top:2px">${esc(nx.name)}</h3>
      <div class="small muted">${esc(D.fmt(nx.date, { weekday: 'long' }))} ${esc(nx.time)} · <b class="num" style="color:var(--ink)">${plural(dx, 'day')}</b> to go</div></div></div></div>`;
  }
  h += '<div class="sect"><h2>Your streak</h2>' + weekStreak(d) + '</div>';
  h += `<div class="sect"><details class="why card"><summary>How is today's path chosen?</summary><ul>
      <li><b>Weakest first:</b> topics you rated 1–2 (or haven't rated) come up most.</li>
      <li><b>Spaced repetition:</b> your rating sets the next review — tomorrow for "don't know it", weeks later for "exam-ready".</li>
      <li><b>Exam dates:</b> topics for the soonest papers get priority; the day before an exam goes to that paper.</li>
      <li><b>Mixing subjects:</b> no subject twice in a row, and none left out for long.</li>
      <li><b>25-minute sessions</b> with 5-minute breaks. Daily time grows as the exams get closer.</li></ul></details></div>`;
  return h;
}
function blockInfo(b, d) {
  if (b.k === 'cards') { const due = dueCards(d).length, nw = Math.min(newAllowance(d), newCardPool().length); return { title: 'Daily flashcards', sid: null, meta: `${due} due · ${nw} new`, icon: 'cards', xp: 10 }; }
  if (b.k === 'paper') { const p = PAPER[b.pid]; return { title: 'Past paper: ' + p.subj.name, sid: p.subj.id, meta: p.name, icon: 'doc', xp: 50 }; }
  const t = TOPIC[b.t]; if (!t) return null;
  return { title: t.n, sid: t.subj.id, meta: t.subj.name + ' · ' + KIND[b.k].label, icon: KIND_ICON[b.k] || 'book', xp: 20 };
}
function pathNode(b, i, plan, d, off, isCur) {
  const bi = blockInfo(b, d); if (!bi) return '';
  const done = plan.done[i] != null;
  const c = bi.sid ? `--nc:var(--${bi.sid});--nd:var(--${bi.sid}-d)` : '--nc:var(--purple);--nd:var(--purple-d)';
  const hb = isCur && openNode !== i;
  let h = `<div class="pn${hb ? ' hb' : ''}" style="--off:${off}px;${c}">`;
  if (hb) h += `<div class="bubble">Start</div>`;
  h += `<button class="node${done ? ' done' : ''}${isCur ? ' cur' : ''}" data-act="node" data-i="${i}" aria-label="${esc(bi.title)}${done ? ' (done)' : ''}" aria-expanded="${openNode === i}">${ic(done ? 'check' : bi.icon)}</button>`;
  h += `<div class="lbl">${esc(bi.title)}<small>${b.m} min${done && b.t ? ' · rated ' + plan.done[i] + '/5' : ''}</small></div></div>`;
  if (openNode === i) {
    const why = b.why && b.why.length && !done ? `<div class="meta">Why today: ${esc(b.why.join(', '))}</div>` : '';
    const dark = '';
    const pc = done ? '' : (bi.sid ? `--pc:var(--${bi.sid});--pd:var(--${bi.sid}-d)` : '--pc:var(--purple);--pd:var(--purple-d)');
    h += `<div class="pop${done ? ' gold' : dark}" style="${pc}"><h3>${esc(bi.title)}</h3><div class="meta">${esc(bi.meta)} · ${b.m} min</div>${why}`;
    if (!done) h += `<button class="btn full" data-act="start" data-i="${i}">Start +${bi.xp} XP</button>`;
    else if (b.t) h += `<button class="btn full" data-act="revise" data-t="${b.t}">Practise again</button>`;
    else if (b.k === 'cards') h += `<button class="btn full" data-act="cram">Practise more cards</button>`;
    else h += `<div class="meta">Paper logged — nice work!</div>`;
    h += '</div>';
  }
  return h;
}
function weekStreak(d) {
  const dow = (D.dow(d) + 6) % 7, mon = D.add(d, -dow), sk = streak();
  let h = `<div class="card stack"><div class="row"><div class="stat fire${sk ? '' : ' off'}" style="padding:0">${ic('fire')}</div><div><b class="num" style="font-size:20px">${plural(sk, 'day')}</b><div class="small muted">${sk ? 'Keep it going — do one session every day.' : 'Do a session today to start a streak!'}</div></div></div><div class="week">`;
  for (let k = 0; k < 7; k++) {
    const day = D.add(mon, k), hit = activeOn(day);
    h += `<div class="d${hit ? ' hit' : ''}${day === d ? ' today' : ''}"><span>${'MTWTFSS'[k]}</span><div class="f">${hit ? ic('fire') : ''}</div></div>`;
  }
  return h + '</div></div>';
}

/* ---------- plan ---------- */
function viewPlan() {
  let h = '<div class="hello"><div class="caps">Your plan to June 2027</div><h1>What to revise, and when</h1></div>';
  h += `<div class="sect"><div class="tabs" role="group" aria-label="Plan view">
    <button data-tab="days" aria-pressed="${planTab === 'days'}">Next 14 days</button>
    <button data-tab="road" aria-pressed="${planTab === 'road'}">Roadmap</button>
    <button data-tab="exams" aria-pressed="${planTab === 'exams'}">Exam timetable</button></div></div>`;
  h += planTab === 'days' ? planDays() : planTab === 'road' ? planRoad() : planExams();
  return h;
}
function flRow(icon, sid, text) {
  const bg = sid ? `var(--${sid})` : 'var(--purple)';
  return `<div class="fl"><span class="sq" style="background:${bg}">${ic(icon)}</span><span>${text}</span></div>`;
}
function planDays() {
  const f = forecast(14);
  let h = '<div class="sect"><p class="small muted">A forecast — each day is rebuilt from your ratings when it arrives.</p>';
  for (const day of f) {
    const tMins = day.blocks.reduce((a, b) => a + b.m, 0);
    h += `<div class="card day"><div class="day-h"><b>${esc(D.short(day.d))}</b><span class="chip">${esc(day.info.label)}</span><span class="small muted num" style="margin-left:auto">${tMins ? minsTxt(tMins) : 'rest'}</span></div>`;
    for (const p of day.info.exams) h += flRow('trophy', p.subj.id, `<b>EXAM:</b> ${esc(p.subj.name)} — ${esc(p.name)} (${esc(p.time)})`);
    for (const b of day.blocks) {
      if (b.k === 'cards') continue;
      if (b.k === 'paper') { const p = PAPER[b.pid]; h += flRow('doc', p.subj.id, `${esc(p.subj.name)} past paper`); continue; }
      const t = TOPIC[b.t]; h += flRow(KIND_ICON[b.k], t.subj.id, esc(t.n));
    }
    h += '</div>';
  }
  return h + '</div>';
}
function planRoad() {
  const d = D.today(), P = phases();
  let h = '<div class="sect"><div class="road">';
  P.forEach((p, i) => {
    const cls = d > p.end ? 'past' : (d >= p.start ? 'now' : '');
    const m = p.mins, parts = [];
    const sc = (x) => minsTxt(Math.round(x * state.settings.intensity / 5) * 5);
    if (m.school) parts.push('school days ' + sc(m.school));
    if (m.weekend) parts.push('weekends ' + sc(m.weekend));
    if (m.holiday) parts.push('holidays ' + sc(m.holiday));
    if (m.study) parts.push('study days ' + sc(m.study));
    h += `<div class="stage ${cls}"><div class="pin">${cls === 'past' ? ic('check') : cls === 'now' ? ic('star') : i + 1}</div><div><div class="caps">${esc(D.short(p.start))} – ${esc(D.short(p.end))}${cls === 'now' ? ' · you are here' : ''}</div>
      <h3 style="margin-top:3px">${esc(p.name)}</h3><p class="small" style="margin-top:4px">${esc(p.goal)}</p>
      <ul>${p.how.map((x) => '<li>' + esc(x) + '</li>').join('')}<li>Daily time: ${esc(parts.join(', '))}</li></ul></div></div>`;
  });
  h += `<div class="stage"><div class="pin" style="background:var(--gold);color:#fff">${ic('trophy')}</div><div><div class="caps">${esc(D.short(RESULTS_DAY))}</div><h3 style="margin-top:3px">Results day</h3></div></div>`;
  h += '</div></div><div class="sect"><h2>Key dates</h2><div class="card"><ul class="pts">';
  for (const m of state.settings.mocks) h += `<li><b>${esc(m.name)}:</b> ${esc(D.short(m.start))} – ${esc(D.short(m.end))} <span class="muted">(estimate — edit in Settings)</span></li>`;
  for (const x of HOLIDAYS) h += `<li><b>${esc(x[2])}:</b> ${esc(D.short(x[0]))}${x[0] !== x[1] ? ' – ' + esc(D.short(x[1])) : ''}</li>`;
  h += `<li><b>Exams:</b> ${esc(D.short(EXAM_START))} – ${esc(D.short(EXAM_END))}. Contingency day ${esc(D.short(CONTINGENCY))}.</li><li><b>Results day:</b> ${esc(D.full(RESULTS_DAY))}</li></ul></div></div>`;
  return h;
}
function planExams() {
  const d = D.today(), nx = nextExam(d);
  let h = '<div class="sect"><p class="small muted">From the AQA and OCR 2027 timetables and Pearson Edexcel\'s Maths dates. Check against your personal timetable from school.</p><div class="card">';
  for (const p of PAPERS) {
    const dx = D.diff(d, p.date), cls = p.date < d ? 'gone' : (nx && p === nx ? 'next' : '');
    h += `<div class="xrow ${cls}"><div class="cal"><b style="background:var(--${p.subj.id})">${monAbbr(p.date)}</b><span>${dayNum(p.date)}</span></div><div class="grow"><b>${esc(p.subj.name)}</b><div class="small muted">${esc(p.name)}</div><div class="tiny muted">${esc(p.subj.board + ' ' + p.code)} · ${esc(p.time)} · ${p.approx ? 'set by school' : minsTxt(p.dur)}</div></div><div class="left num">${dx >= 0 ? (dx === 0 ? 'Today' : dx + 'd') : 'Done'}</div></div>`;
  }
  return h + '</div></div>';
}

/* ---------- subjects ---------- */
function viewSubjects() {
  if (sub && SUBJ[sub]) return viewSubject(SUBJ[sub]);
  if (sub && TOPIC[sub]) return viewTopic(TOPIC[sub]);
  let h = '<div class="hello"><div class="caps">Chesterton · exam boards checked</div><h1>Your subjects</h1><p class="muted">The ring shows how confident you are overall. Tap a subject for its papers, exam tips and every topic.</p></div>';
  h += '<div class="sect"><div class="sgrid">';
  for (const s of RG.subjects) {
    const a = subjectAvg(s), np = PAPERS.find((p) => p.subj === s && p.date >= D.today());
    h += `<a class="scard" href="#subjects-${s.id}" style="${sv(s.id)}"><div class="mring" style="--p:${mastery(s)}"><span>${ic(s.id)}</span></div>
      <div><h3>${esc(s.name)}</h3><div class="tiny">${esc(s.board)} ${esc(s.spec)}${s.tierable ? ' · ' + (state.settings.tiers[s.id] === 'F' ? 'Foundation' : 'Higher') : ''}</div></div>
      <div class="tiny">${a.rated}/${a.total} rated · ${np ? 'exam ' + esc(D.short(np.date)) : 'done'}</div></a>`;
  }
  h += '</div></div><div class="sect"><a class="btn blue full" href="#rate">Rate all topics</a></div>';
  return h;
}
function viewSubject(s) {
  const d = D.today(), a = subjectAvg(s);
  let h = `<a class="back" href="#subjects">${ic('chevL')} Subjects</a>`;
  h += `<div class="shero" style="${sv(s.id)}"><div class="mring" style="--p:${mastery(s)}"><span>${ic(s.id)}</span></div><div class="grow"><div class="caps">${esc(s.board)} · ${esc(s.spec)}</div><h1>${esc(s.name)}</h1><p>${a.rated}/${a.total} topics rated${a.avg ? ' · average ' + a.avg.toFixed(1) + '/5' : ''}</p></div></div>`;
  h += '<div class="sect"><h2>Papers</h2><div class="card">';
  for (const p of s.papers) h += `<div class="xrow ${p.date < d ? 'gone' : ''}"><div class="cal"><b style="background:var(--${s.id})">${monAbbr(p.date)}</b><span>${dayNum(p.date)}</span></div><div class="grow"><b>${esc(p.name)}</b><div class="tiny muted">${esc(p.code)} · ${esc(p.time)} · ${p.approx ? 'date set by school' : minsTxt(p.dur)}</div></div><div class="left num">${p.date >= d ? D.diff(d, p.date) + 'd' : 'Done'}</div></div>`;
  h += '</div></div>';
  const G = (RG.given || {})[s.id];
  if (G) {
    const list = (arr) => '<ul class="pts">' + arr.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>';
    h += `<div class="sect"><h2>What the exam gives you</h2>
      <div class="card given" style="border-color:var(--green)"><div class="caps" style="color:var(--green-d)">Given in the exam</div>${list(G.given)}</div>
      <div class="card given" style="border-color:var(--orange)"><div class="caps" style="color:var(--orange-d)">Learn this yourself</div>${list(G.memorise)}</div>
      <div class="card given" style="border-color:var(--blue)"><div class="caps" style="color:var(--blue-d)">How it's marked</div>${list(G.marking)}</div></div>`;
  }
  h += `<div class="sect"><h2>Topics</h2><p class="small muted" style="margin-top:-6px">Tap 1–5 to rate how confident you are.</p>`;
  const groups = [];
  for (const p of s.papers) { const ts = visibleTopics(s).filter((t) => t.paperIds.length < s.papers.length && t.paperIds[0] === p.id); if (ts.length) groups.push([p.name, ts]); }
  const all = visibleTopics(s).filter((t) => t.paperIds.length === s.papers.length || !groups.some((g) => g[1].includes(t)));
  if (all.length) groups.push([groups.length ? 'Across all papers' : 'All papers', all]);
  for (const [name, ts] of groups) {
    h += `<div class="card"><div class="caps" style="margin-bottom:4px">${esc(name)}</div>`;
    for (const t of ts) {
      const c = st(t.id).c || 0, tt = taught(t, d);
      h += `<div class="trow"><div><button class="tn" data-topic="${t.id}">${esc(t.n)}</button>
        <div class="tiny muted">${t.h ? '<span class="tag">HIGHER</span> ' : ''}${!tt ? 'Taught later · <button class="linkbtn" style="font-size:12px" data-unlock="' + t.id + '">I\'ve covered it</button>' : (st(t.id).due ? 'Review ' + esc(D.short(st(t.id).due)) : 'Not started')}</div></div>${rate5(t.id, c)}</div>`;
    }
    h += '</div>';
  }
  h += '</div>';
  h += `<div class="sect"><h2>How it's assessed</h2><div class="card"><ul class="pts">${s.structure.map((x) => '<li>' + esc(x) + '</li>').join('')}</ul></div></div>`;
  h += `<div class="sect"><h2>Exam technique</h2><div class="card"><ul class="pts">${s.technique.map((x) => '<li>' + esc(x) + '</li>').join('')}</ul></div></div>`;
  h += `<div class="sect"><h2>Where to practise</h2><div class="stack"><a class="btn full" href="${esc(SPEC_PDF[s.id])}" target="_blank" rel="noopener">Official ${esc(s.board + ' ' + s.spec)} spec</a>${s.resources.map((r) => `<a class="btn full plain" href="${esc(r[1])}" target="_blank" rel="noopener">${esc(r[0])}</a>`).join('')}</div></div>`;
  return h;
}
function viewTopic(t) {
  const s = t.subj, x = st(t.id), d = D.today(), np = nextPaper(t, d);
  let h = `<a class="back" href="#subjects-${s.id}">${ic('chevL')} ${esc(s.name)}</a>`;
  h += `<div class="hello"><div class="kind" style="${sv(s.id)}"><i>${ic(s.id)}</i>${esc(s.name)} · ${esc(t.paperIds.map((id) => PAPER[id].code).join(', '))}</div><h1>${esc(t.n)}</h1>
    <div class="wrap-row" style="margin-top:6px">${t.h ? '<span class="chip">Higher only</span>' : ''}<span class="chip"><i class="dot" style="background:${ccol(x.c)}"></i>${esc(CONF_WORD[x.c || 0])}</span>${x.due ? '<span class="chip">Review ' + esc(D.short(x.due)) + '</span>' : ''}${np ? '<span class="chip">Exam ' + esc(D.short(np.date)) + '</span>' : ''}</div></div>`;
  h += `<div class="sect"><button class="btn green full" data-act="revise" data-t="${t.id}">Start a 25-min session</button>${t.cardIds && t.cardIds.length >= 2 ? `<button class="btn full" data-act="quiz" data-src="t-${t.id}">${ic('target')} Quiz me on this topic</button>` : ''}<div class="row" style="justify-content:space-between"><span class="small muted" style="font-weight:800">Confidence</span>${rate5(t.id, x.c || 0)}</div></div>`;
  h += `<div class="sect"><h2>Key knowledge</h2><div class="card kp">${t.pts.map((p) => '<div>' + esc(p) + '</div>').join('')}</div>${specLine(t)}</div>`;
  if (t.cards && t.cards.length) h += `<div class="sect"><h2>Flashcards (${t.cards.length})</h2><div class="card"><ul class="pts">${t.cards.map((c) => '<li><b>' + esc(c[0]) + '</b><br><span class="muted">' + esc(c[1]) + '</span></li>').join('')}</ul></div></div>`;
  h += `<div class="sect"><h2>Exam practice</h2><div class="card stack"><p>${esc(t.ex)}</p><div class="wrap-row">${s.resources.map((r) => `<a class="btn sm" href="${esc(r[1])}" target="_blank" rel="noopener">${esc(r[0])}</a>`).join('')}</div></div></div>`;
  return h;
}
function viewRate() {
  let h = `<a class="back" href="#subjects">${ic('chevL')} Subjects</a><div class="hello"><h1>Rate every topic</h1><p class="muted">Be honest — it's just for you. <b>1</b> = don't know it, <b>3</b> = okay, <b>5</b> = exam-ready.</p></div>`;
  for (const s of RG.subjects) {
    h += `<div class="sect"><div class="kind" style="${sv(s.id)}"><i>${ic(s.id)}</i>${esc(s.name)}</div><div class="card">`;
    for (const t of visibleTopics(s)) h += `<div class="trow"><div><button class="tn" data-topic="${t.id}">${esc(t.n)}</button>${!taught(t, D.today()) ? '<div class="tiny muted">Taught later — rate once covered</div>' : ''}</div>${rate5(t.id, st(t.id).c || 0)}</div>`;
    h += '</div></div>';
  }
  return h + '<div class="sect"><a class="btn green full" href="#today">Done — show my path</a></div>';
}

/* ---------- flashcards tab ---------- */
function cardsSwitch() {
  return `<div class="seg" role="group" aria-label="Cards or quizzes">${[['cards', 'Flashcards', 'cards'], ['quiz', 'Quizzes', 'target']].map(([k, l, i]) => `<button data-ctab="${k}" aria-pressed="${cardsTab === k}">${ic(i)}${l}</button>`).join('')}</div>`;
}
function subjTabs() {
  return `<div class="sect"><div class="tabs" role="group" aria-label="Subject filter"><button data-cs="" aria-pressed="${!cardsSubj}">All</button>${RG.subjects.map((s) => `<button data-cs="${s.id}" aria-pressed="${cardsSubj === s.id}">${esc(s.name.replace('English ', 'Eng. ').replace('Combined ', ''))}</button>`).join('')}</div></div>`;
}
function viewCards() {
  if (cardsTab === 'quiz') return cardsSwitch() + viewQuizzes();
  const d = D.today();
  const due = dueCards(d, cardsSubj), nw = Math.min(newAllowance(d), newCardPool(cardsSubj).length);
  const seen = Object.keys(state.cards).filter((id) => CARD[id] && (!cardsSubj || CARD[id].t.subj.id === cardsSubj));
  const box = [0, 0, 0, 0, 0, 0]; for (const id of seen) box[state.cards[id].b]++;
  const mx = Math.max(1, ...box);
  let h = cardsSwitch() + `<div class="deckhero"><div class="stackart"><i></i><i></i><i>${due.length + nw}</i></div><h1>${due.length ? plural(due.length, 'card') + ' due' : nw ? plural(nw, 'new card') + ' to learn' : 'All caught up!'}</h1>
    <p class="muted">Get a card right and it comes back later (1 → 3 → 7 → 14 → 30 days). Miss it and you'll see it tomorrow.</p></div>`;
  h += `<div class="sect"><button class="btn green full" data-act="review" ${due.length + nw ? '' : 'disabled'}>Review ${due.length} due + ${nw} new</button><button class="btn full" data-act="cram" ${newCardPool(cardsSubj).length + seen.length ? '' : 'disabled'}>Quick practice · 20 cards</button></div>`;
  h += subjTabs();
  h += viewDecks();
  const bc = ['var(--red)', 'var(--orange)', 'var(--yellow)', 'var(--c4)', 'var(--green)', 'var(--blue)'];
  h += `<div class="sect"><h2>Your memory boxes</h2><div class="card stack"><div class="boxes">${box.map((n, i) => `<div><b class="num">${n}</b><i style="height:${Math.max(6, n / mx * 80)}px;--bc:${bc[i]}"></i><span>BOX ${i}</span></div>`).join('')}</div>
    <p class="small muted">${seen.length} cards started · ${newCardPool(cardsSubj).length} still new${cardsSubj === 'german' || !cardsSubj ? ' · German vocab comes first' : ''}. Box 5 = long-term memory!</p></div></div>`;
  return h;
}

/* ---------- settings ---------- */
function viewMore() {
  const s = state.settings;
  let h = '<div class="hello"><div class="caps">Settings</div><h1>Make it yours</h1></div>';
  if (auth.available) {
    h += `<div class="sect"><h2>Account</h2><div class="card stack">${auth.user
      ? `<div class="row">${ic('user')}<div class="grow"><b>${esc(auth.user.email || 'Google account')}</b><div class="small muted">Progress syncs to every device you sign in on.</div></div></div>${pwSection()}<button class="btn full plain" data-act="signout">Sign out</button>`
      : '<p>You\'re not signed in, so progress is saved on this device only.</p><button class="btn blue full" data-act="signin-now">Sign in or create account</button>'}</div></div>`;
  }
  h += `<div class="sect"><h2>Sound & tiers</h2><div class="card">
    <div class="field"><div><div class="l">Sound effects</div><div class="s">Chimes when you get things right</div></div><input type="checkbox" class="switch" id="sound" data-sound ${s.sound !== false ? 'checked' : ''} aria-label="Sound effects"></div>`;
  for (const id of ['maths', 'science', 'german']) {
    h += `<div class="field"><div><div class="l">${esc(SUBJ[id].name)} tier</div><div class="s">Higher-only topics hide on Foundation</div></div>
      <select id="tier-${id}" data-tier="${id}" aria-label="${esc(SUBJ[id].name)} tier"><option value="H" ${s.tiers[id] !== 'F' ? 'selected' : ''}>Higher</option><option value="F" ${s.tiers[id] === 'F' ? 'selected' : ''}>Foundation</option></select></div>`;
  }
  h += '</div></div>';
  h += '<div class="sect"><h2>Mock exams</h2><p class="small muted" style="margin-top:-6px">Estimated dates — change them when you get your mock timetable.</p><div class="card">';
  s.mocks.forEach((m, i) => {
    h += `<div class="field" style="grid-template-columns:1fr"><div class="l">${esc(m.name)}</div><div class="row" style="flex-wrap:wrap"><input type="date" id="mock-${i}-start" data-mock="${i}" data-f="start" value="${esc(m.start)}" aria-label="${esc(m.name)} start"><span class="muted">to</span><input type="date" id="mock-${i}-end" data-mock="${i}" data-f="end" value="${esc(m.end)}" aria-label="${esc(m.name)} end"></div></div>`;
  });
  h += `<div class="field" style="grid-template-columns:1fr"><div><div class="l">German speaking exam</div><div class="s">Set by school (April–May)</div></div><input type="date" id="speaking" data-speaking value="${esc(s.speakingDate)}" aria-label="German speaking exam date"></div></div></div>`;
  h += `<div class="sect"><h2>Workload</h2><div class="card">
    <div class="field"><div><div class="l">Intensity</div><div class="s">Scales every day's time</div></div><select id="intensity" data-intensity aria-label="Intensity"><option value="0.75" ${s.intensity == 0.75 ? 'selected' : ''}>Light</option><option value="1" ${s.intensity == 1 ? 'selected' : ''}>Standard</option><option value="1.25" ${s.intensity == 1.25 ? 'selected' : ''}>Intense</option></select></div>
    <div class="field"><div><div class="l">Light day</div><div class="s">Flashcards only, until Easter</div></div><select id="restday" data-restday aria-label="Light day">${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((n, i) => `<option value="${i}" ${Number(s.restDay) === i ? 'selected' : ''}>${n}</option>`).join('')}<option value="-1" ${Number(s.restDay) === -1 ? 'selected' : ''}>None</option></select></div></div></div>`;
  h += `<div class="sect"><h2>Backup</h2><div class="card stack"><div id="sync"></div>
    <div class="row" style="flex-wrap:wrap"><button class="btn sm" data-act="export">Copy backup</button><button class="btn sm" data-act="import">Restore from box</button></div>
    <textarea id="backup" placeholder="Paste a backup here to restore" aria-label="Backup data"></textarea>
    <div class="row" style="flex-wrap:wrap"><button class="btn sm plain" data-act="reset">Reset everything…</button><span id="reset-confirm"></span></div></div></div>`;
  h += `<div class="sect"><h2>Why this works</h2><div class="card"><ul class="pts">
    <li><b>Retrieval practice</b> (blurting, flashcards, exam questions) beats re-reading by a mile.</li>
    <li><b>Spacing:</b> reviewing just as you start to forget makes knowledge last until June.</li>
    <li><b>Mixing subjects</b> feels harder but improves exam performance.</li>
    <li><b>Timed past papers + mark schemes</b> show what examiners reward.</li>
    <li><b>Short sessions with breaks</b> keep focus high; sleep locks it in.</li></ul></div></div>`;
  h += `<div class="sect"><h2>Sources</h2><div class="card small"><ul class="pts">
    <li>Exam boards: <a href="https://ccc.tela.org.uk/information/examinations/" target="_blank" rel="noopener">Chesterton Community College — Examinations</a>.</li>
    <li>Content checked against the official specifications: <a href="${SPEC_PDF.maths}" target="_blank" rel="noopener">Edexcel 1MA1</a> · <a href="${SPEC_PDF.science}" target="_blank" rel="noopener">AQA 8464</a> · <a href="${SPEC_PDF.englang}" target="_blank" rel="noopener">AQA 8700</a> · <a href="${SPEC_PDF.englit}" target="_blank" rel="noopener">OCR J352</a> · <a href="${SPEC_PDF.geog}" target="_blank" rel="noopener">AQA 8035</a> · <a href="${SPEC_PDF.hist}" target="_blank" rel="noopener">OCR J410</a> · <a href="${SPEC_PDF.german}" target="_blank" rel="noopener">AQA 8662</a>.</li>
    <li>Formula and equation sheets: Ofqual decision for 2025–2027; AQA June 2027 Physics Equations Sheet; Pearson 1MA1 exam aid.</li>
    <li>Term dates: <a href="https://ccc.tela.org.uk/about/term-dates/" target="_blank" rel="noopener">Chesterton 2026–27</a>. Exam dates: AQA, OCR and Pearson 2027 timetables.</li></ul></div></div>`;
  return h;
}
function pwSection() {
  const A = window.RGAuth;
  if (!A || !A.providers || !auth.user || !auth.user.email) return '';
  const prov = A.providers();
  if (prov.includes('password')) return `<p class="small muted">Sign in with ${prov.includes('google.com') ? 'Google, or ' : ''}your email and password.</p>`;
  return `<form class="soft stack" id="pw-form" novalidate><div><b>Set a password</b><p class="small muted">Then sign in on your phone's home-screen app with <b>${esc(auth.user.email)}</b> and this password. Same account, same progress.</p></div>
    <input type="email" autocomplete="username" value="${esc(auth.user.email)}" hidden aria-hidden="true" tabindex="-1">
    <input id="pw-new" type="password" autocomplete="new-password" minlength="6" placeholder="New password (6+ characters)" aria-label="New password">
    ${auth.pwMsg ? `<p class="small" role="alert" style="color:${auth.pwOk ? 'var(--green-d)' : 'var(--red)'};font-weight:800">${esc(auth.pwMsg)}</p>` : ''}
    <button class="btn blue" type="submit" ${auth.busy ? 'disabled' : ''}>Set password</button></form>`;
}
async function addPassword() {
  const A = window.RGAuth, pw = ($('#pw-new') || {}).value || '';
  auth.pwMsg = ''; auth.pwOk = false;
  if (pw.length < 6) { auth.pwMsg = 'Use a password of at least 6 characters.'; render(); return; }
  auth.busy = true; render();
  try { await A.addPassword(pw); auth.pwOk = true; auth.pwMsg = ''; toast('Password set — use it on your phone'); }
  catch (e) { auth.pwMsg = AUTH_ERR[e && e.code] || ((e && e.message) || 'Something went wrong — try again.'); }
  auth.busy = false; render();
}
function updateSync() {
  const el = $('#sync'); if (!el) return;
  const map = {
    synced: ['ok', auth.available ? 'Synced to your account.' : 'Synced to your Claude account.'],
    connecting: ['', 'Connecting…'],
    readonly: ['warn', 'Saved on this device only.'],
    error: ['warn', 'Saved on this device — sync will retry on your next change.'],
    local: ['', auth.available ? 'Saved on this device only — sign in to sync.' : 'Saved on this device only.'],
  };
  const [cls, txt] = map[cloud.status] || map.local;
  el.innerHTML = `<span class="sync ${cls}"><i></i>${esc(txt)}</span>`;
}

/* ---------- lessons ---------- */
let sess = null, timerInt = null;
const YES = ['Nice!', 'Great job!', 'You got it!', 'Brilliant!', 'Spot on!', 'Nailed it!'];
const NO = ['Not quite', 'Almost!', 'Keep going'];
function openSession(opts) {
  let b;
  if (opts.i != null) b = state.plans[opts.date].blocks[opts.i];
  else b = { k: kindFor(st(opts.t).c || 0, dayInfo(D.today()).phase.id, 99), t: opts.t, m: 25 };
  if (b.k === 'cards') { startCards('review', opts); return; }
  sess = { wasActive: activeOn(D.today()), b, opts, steps: KIND[b.k].steps, step: 0, left: b.m * 60, running: false, checks: {}, rating: 0, cardQ: null, score: '', max: '', xp: 0, fb: null, complete: null };
  showOverlay(); renderSession();
}
function showOverlay() { openNode = null; $('#session').hidden = false; document.body.style.overflow = 'hidden'; }
function closeSession() {
  clearInterval(timerInt); timerInt = null; sess = null;
  $('#session').hidden = true; $('#session').innerHTML = ''; document.body.style.overflow = '';
  render();
}
function fmtClock(s) { return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }
function tick() {
  if (!sess || !sess.running) return;
  sess.left = Math.max(0, sess.left - 1);
  const c = $('#clock'); if (c) c.textContent = fmtClock(sess.left);
  if (sess.left === 0) { sess.running = false; clearInterval(timerInt); timerInt = null; const tb = $('#timer-btn'); if (tb) tb.classList.remove('on'); Sound.win(); toast('Time! Finish up, then take a 5-minute break.'); }
}
function timerPill() { return `<button class="tpill${sess.running ? ' on' : ''}" id="timer-btn" data-act="timer" aria-label="${sess.running ? 'Pause' : 'Start'} timer">${ic('clock')}<span id="clock">${fmtClock(sess.left)}</span></button>`; }
function shell(progress, body, foot, footCls) {
  return `<div class="l-top"><button class="x" data-act="close" aria-label="Close">${ic('x')}</button><div class="pbar" role="progressbar" aria-valuenow="${Math.round(progress)}" aria-valuemin="0" aria-valuemax="100" aria-label="Progress"><i style="width:${Math.max(3, progress)}%"></i></div>${timerPill()}</div>
    <div class="l-body"><div class="l-in">${body}</div></div>
    <div class="l-foot${footCls ? ' ' + footCls : ''}" id="l-foot"><div class="l-foot-in">${foot}</div></div>`;
}
function kindTag(sid, label) { return `<div class="kind" style="${sv(sid)}"><i>${ic(sid)}</i>${esc(label)}</div>`; }
function contBtn(label, dis, cls) { return `<button class="btn ${cls || 'green'} full" data-act="next" ${dis ? 'disabled' : ''}>${esc(label || 'Continue')}</button>`; }
function progressNow() {
  const s = sess;
  if (s.complete) return 100;
  if (s.deck) return s.deck.list.length ? s.deck.i / s.deck.list.length * 100 : 100;
  let sub = 0;
  if (s.steps[s.step] === 'cards' && s.cardQ && s.cardQ.list.length) sub = s.cardQ.i / s.cardQ.list.length;
  return (s.step + sub) / s.steps.length * 100;
}
function renderSession() {
  const s = sess;
  if (s.complete) { $('#session').innerHTML = shell(100, completeBody(), contBtn('Continue')); return; }
  const b = s.b, step = s.steps[s.step], t = b.t ? TOPIC[b.t] : null, p = b.pid ? PAPER[b.pid] : null, subj = t ? t.subj : p.subj;
  const tag = kindTag(subj.id, subj.name + ' · ' + KIND[b.k].label);
  let body = '', foot = contBtn();
  if (step === 'read') {
    body = `${tag}<h1>Learn it</h1><p class="muted">Read each point, then turn it into a quick mind map or 5 questions on paper — don't just copy it out.</p><div class="card kp">${t.pts.map((x) => '<div>' + esc(x) + '</div>').join('')}</div>${specLine(t)}`;
    foot = contBtn('I\'ve made my notes');
  } else if (step === 'blurt') {
    body = `${tag}<div class="hero-ill" style="${sv(subj.id)}">${ic('pencil')}</div><h1 style="text-align:center">Blurt it!</h1><p style="text-align:center">Close your notes. On a blank page, write <b>everything</b> you remember about <b>${esc(t.n)}</b> — key words, facts, examples, diagrams.</p>${note('Struggling to remember is what makes memories stick. No peeking!', 'yellow', 'bulb')}`;
    foot = contBtn('Check my answers');
  } else if (step === 'check') {
    const n = t.pts.length, got = Object.values(s.checks).filter(Boolean).length;
    body = `${tag}<h1>What did you remember?</h1><p class="muted">Tap each point you got (roughly) right. Add the ones you missed to your page in a different colour.</p><div class="counter num" id="counter">${got} / ${n}</div>
      <div class="stack">${t.pts.map((x, i) => `<button class="choice" data-chk="${i}" aria-pressed="${!!s.checks[i]}"><span class="cb">${ic('check')}</span><span>${esc(x)}</span></button>`).join('')}</div>`;
  } else if (step === 'cards') {
    if (!s.cardQ) s.cardQ = { list: t.cardIds.slice(), i: 0, flip: false, right: 0, wrong: 0, again: {} };
    const q = s.cardQ;
    if (!t.cardIds.length || q.i >= q.list.length) {
      body = `${tag}<div class="hero-ill" style="${sv(subj.id)}">${ic('cards')}</div><h1 style="text-align:center">${t.cardIds.length ? 'Flashcards done!' : 'No flashcards here'}</h1><p class="muted" style="text-align:center">${t.cardIds.length ? `${q.right} right first time. They're now in your review deck.` : 'On to the next step.'}</p>`;
    } else {
      body = `${tag}<h1>Flashcards <span class="muted num" style="font-size:17px">${q.i + 1}/${q.list.length}</span></h1>${cardFace(cardById(q.list[q.i]), q.flip)}`;
      foot = cardFoot(q);
      $('#session').innerHTML = shell(progressNow(), body, foot, s.fb ? (s.fb.ok ? 'good' : 'bad') : '');
      return;
    }
  } else if (step === 'apply') {
    body = `${tag}<div class="hero-ill" style="${sv(subj.id)}">${ic('pencil')}</div><h1 style="text-align:center">Exam practice</h1><div class="card stack"><p>${esc(t.ex)}</p><p class="small muted">Use past-paper questions on this topic and mark them with the official mark scheme.</p><div class="wrap-row">${subj.resources.map((r) => `<a class="btn sm" href="${esc(r[1])}" target="_blank" rel="noopener">${esc(r[0])}</a>`).join('')}</div></div>${note('<b>Tip:</b> ' + esc(subj.technique[0]), 'blue', 'bulb')}`;
    foot = contBtn('Done');
  } else if (step === 'rate') {
    const got = Object.values(s.checks).filter(Boolean).length, n = t.pts.length;
    const sug = s.steps.includes('check') && Object.keys(s.checks).length ? Math.max(1, Math.min(5, Math.round(got / n * 5))) : 0;
    body = `${tag}<h1>How confident are you now?</h1>${sug ? `<p class="muted">You remembered ${got} of ${n} points — that's about a ${sug}.</p>` : ''}
      <div class="stack">${[1, 2, 3, 4, 5].map((r) => `<button class="choice rate" data-act="pick" data-r="${r}" aria-pressed="${s.rating === r}"><span class="rb" style="--rc:${ccol(r)}">${r}</span><span>${esc(CONF_WORD[r])}</span></button>`).join('')}</div><p class="small muted" id="next-review">${s.rating ? nextReviewTxt(t, s.rating) : 'Your answer decides when this topic comes back.'}</p>`;
    foot = contBtn('Save', !s.rating);
  } else if (step === 'paper') {
    body = `${tag}<div class="hero-ill" style="${sv(subj.id)}">${ic('doc')}</div><h1 style="text-align:center">Timed past paper</h1><div class="card stack"><p><b>${esc(p.name)}</b> (${esc(p.subj.board)} ${esc(p.code)}) — ${minsTxt(p.dur)} under exam conditions: timer on, phone away, no notes.</p>
      <div class="kp"><div>Pick a paper you haven't done yet (from the board's website).</div><div>Do it in one sitting and stop when time is up.</div><div>Mark it strictly with the mark scheme (about 15 min).</div><div>Next: log your score and the topics that lost you marks.</div></div>
      <div class="wrap-row">${p.subj.resources.map((r) => `<a class="btn sm" href="${esc(r[1])}" target="_blank" rel="noopener">${esc(r[0])}</a>`).join('')}</div></div>`;
    foot = contBtn('I\'ve marked it');
  } else if (step === 'score') {
    const ts = visibleTopics(p.subj).filter((x) => x.paperIds.includes(p.id));
    body = `${tag}<h1>How did it go?</h1><div class="card row" style="flex-wrap:wrap;gap:12px"><label class="row" style="font-weight:800">Score <input class="num-in" type="number" id="p-score" min="0" inputmode="numeric" value="${esc(s.score)}"></label><label class="row" style="font-weight:800">out of <input class="num-in" type="number" id="p-max" min="1" inputmode="numeric" value="${esc(s.max)}"></label></div>
      <h3>Which topics lost you marks?</h3><p class="small muted" style="margin-top:-8px">They'll be marked as weak and come back tomorrow.</p><div class="stack">${ts.map((x) => `<button class="choice" data-weak="${x.id}" aria-pressed="${!!s.checks[x.id]}"><span class="cb">${ic('check')}</span><span>${esc(x.n)}</span></button>`).join('')}</div>`;
    foot = contBtn('Save');
  }
  $('#session').innerHTML = shell(progressNow(), body, foot);
  $('#session .l-body').scrollTop = 0;
}
function nextReviewTxt(t, r) {
  const np = nextPaper(t, D.today()), dx = np ? D.diff(D.today(), np.date) : null;
  return 'Next review: <b>' + esc(D.short(D.add(D.today(), intervalFor(r, (st(t.id).n || 0) + 1, dx)))) + '</b>';
}
function cardFace(c, flip, typing) {
  const sid = c.t.subj.id;
  return `<div class="fc-wrap${typing ? ' typing' : ''}"><div class="fc${flip ? ' flip' : ''}" id="fc" ${typing ? '' : 'data-act="flip" role="button" tabindex="0"'} aria-label="Flashcard${typing ? '' : ' — tap to ' + (flip ? 'hide' : 'show') + ' the answer'}" style="${sv(sid)}">
    <div class="face"><span class="src">${esc(c.t.subj.name)} · ${esc(c.t.n)}</span><div class="q">${esc(c.q)}</div><div class="hint">${typing ? (sess.ptype === 'g' ? 'Der, die or das?' : 'Type your answer below') : 'Tap to flip'}</div></div>
    <div class="face back-f"><span class="src">Answer</span><div class="a">${esc(c.a)}</div></div></div></div>`;
}
function cardFoot(q) {
  const s = sess;
  if (s.fb) {
    const ok = s.fb.ok;
    return `<div class="fb"><div class="badge">${ic(ok ? 'check' : 'x')}</div><div><h2>${esc(s.fb.msg)}</h2><p>${esc(fbSub(ok, q))}</p></div></div><button class="btn ${ok ? 'green' : 'red'} full" data-act="cont">Continue</button>`;
  }
  if (s.typing) return s.ptype === 'g' ? `<button class="btn full" data-act="idk">I don't know</button>` : `<div class="pair"><button class="btn full" data-act="idk">Don't know</button><button class="btn blue full" data-act="check">Check</button></div>`;
  if (!q.flip) return `<button class="btn blue full" data-act="flip">Show answer</button>`;
  return `<div class="pair"><button class="btn full" data-act="grade" data-ok="0" style="--fg:var(--red)">Didn't know</button><button class="btn green full" data-act="grade" data-ok="1">Knew it!</button></div>`;
}
function fbSub(ok, q) {
  if (sess.mode !== 'practice') return ok ? '+2 XP · this card moves up a box' : 'You\'ll see this card again soon.';
  const n = pcOf(q.list[q.i]);
  if (!ok) return 'It comes back at the end of this round.';
  return n === MASTER ? '+1 XP · Mastered!' : n > MASTER ? '+1 XP · still mastered' : '+1 XP · ' + n + '/' + MASTER + ' to master';
}
function setFoot(html, cls) {
  const f = $('#l-foot'); if (!f) return;
  f.className = 'l-foot' + (cls ? ' ' + cls : ''); f.innerHTML = `<div class="l-foot-in">${html}</div>`;
}
function queue() { return sess.deck || sess.cardQ; }
function flipCard() {
  const q = queue(); if (!q || sess.fb || sess.typing) return;
  q.flip = !q.flip;
  const el = $('#fc'); if (el) el.classList.toggle('flip', q.flip);
  setFoot(cardFoot(q));
}
function gradeCurrent(ok, note) {
  const q = queue(); if (!q || sess.fb || !q.flip) return;
  const id = q.list[q.i], d = D.today(), first = !q.again[id];
  const prac = sess.mode === 'practice', gain = prac ? 1 : 2;
  if (prac) { if (!state.pc) state.pc = {}; sess.last = { id, first, prev: pcOf(id) }; if (first) state.pc[id] = ok ? pcOf(id) + 1 : 0; }
  else if (sess.mode === 'cram') { if (state.cards[id] || ok) gradeCard(id, ok, d); }
  else if (first) gradeCard(id, ok, d);
  if (ok) { if (first) q.right++; addXP(gain); }
  else { q.wrong++; if (first && sess.mode !== 'cram') { q.again[id] = 1; q.list.push(id); } }
  sess.fb = { ok, msg: ok ? pick(YES) : pick(NO), note };
  save();
  setFoot(cardFoot(q), ok ? 'good' : 'bad');
  const btn = $('#l-foot .btn');
  if (ok) { Sound.correct(); buzz(12); confetti({ n: 36, spread: 11, y: innerHeight - 140 }); xpFloat(gain, $('#fc') || btn); }
  else { Sound.wrong(); buzz([20, 40, 20]); const el = $('#session .fc-wrap'); if (el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); } }
  const pb = $('#session .pbar i'); if (pb) { q.i++; const w = progressNow(); q.i--; pb.style.width = Math.max(3, w) + '%'; }
}
function continueCard() {
  const q = queue(); if (!q) return;
  q.i++; q.flip = false; q.typed = ''; sess.fb = null;
  if (sess.deck) renderDeck(); else renderSession();
}
function finishSession() {
  const s = sess, b = s.b, d = D.today(), wasActive = s.wasActive;
  let stats;
  if (b.t) {
    rateTopic(b.t, s.rating, d); logMinutes(d, TOPIC[b.t].subj.id, b.m); addXP(20);
    const n = TOPIC[b.t].pts.length, got = Object.values(s.checks).filter(Boolean).length;
    stats = [['Recalled', s.steps.includes('check') ? Math.round(got / n * 100) + '%' : s.rating + '/5', 'var(--green)', 'check'], ['Review', D.short(state.topics[b.t].due).replace(/^\w+ /, ''), 'var(--blue)', 'cal']];
  } else {
    const sc = Number(s.score), mx = Number(s.max);
    (state.papersDone[b.pid] = state.papersDone[b.pid] || []).push({ d, sc: isFinite(sc) ? sc : null, mx: isFinite(mx) && mx > 0 ? mx : null });
    for (const id of Object.keys(s.checks)) if (s.checks[id] && TOPIC[id]) state.topics[id] = Object.assign({}, st(id), { c: 2, due: D.add(d, 1) });
    logMinutes(d, PAPER[b.pid].subj.id, b.m); addXP(50);
    stats = [['Score', isFinite(sc) && isFinite(mx) && mx > 0 ? Math.round(sc / mx * 100) + '%' : '—', 'var(--green)', 'target'], ['To fix', String(Object.values(s.checks).filter(Boolean).length), 'var(--blue)', 'pencil']];
  }
  if (s.opts.i != null && state.plans[s.opts.date]) state.plans[s.opts.date].done[s.opts.i] = b.t ? s.rating : 1;
  save();
  s.complete = { title: b.t ? 'Session complete!' : 'Paper logged!', stats, streakUp: !wasActive };
  celebrate();
}
function celebrate() { renderSession(); Sound.win(); buzz([30, 50, 30]); confetti({ n: 160, spread: 18, y: innerHeight * 0.35 }); }
function completeBody() {
  const c = sess.complete, sk = streak();
  return `<div class="stack done-scr"><div class="hero-ill" style="--c:var(--gold);--cd:var(--gold-d)">${ic('trophy')}</div><h1>${esc(c.title)}</h1>
    <div class="tiles"><div class="tile" style="--tc:var(--gold)"><b>XP</b><span>${ic('bolt')}${sess.xp || 0}</span></div>${c.stats.map((x) => `<div class="tile" style="--tc:${x[2]}"><b>${esc(x[0])}</b><span>${ic(x[3])}${esc(x[1])}</span></div>`).join('')}</div>
    ${c.streakUp && sk ? `<div class="streakmsg">${ic('fire')} ${sk === 1 ? 'Streak started!' : sk + '-day streak!'}</div>` : ''}</div>`;
}

/* ---------- flashcard decks ---------- */
function startCards(mode, opts) {
  const d = D.today();
  let list;
  if (mode === 'cram') {
    const pool = Object.keys(state.cards).map((id) => CARD[id]).filter((c) => c && cardAvailable(c) && (!cardsSubj || c.t.subj.id === cardsSubj));
    list = pool.concat(newCardPool(cardsSubj)).map((c) => [Math.random(), c]).sort((a, b) => a[0] - b[0]).slice(0, 20).map((x) => x[1].id);
  } else {
    const subj = opts && opts.i != null ? null : cardsSubj;
    list = dueCards(d, subj).slice(0, 60).map((c) => c.id).concat(newCardPool(subj).slice(0, newAllowance(d)).map((c) => c.id));
  }
  sess = { wasActive: activeOn(D.today()), b: { k: 'cards', m: 15 }, opts: opts || {}, deck: { list, i: 0, flip: false, right: 0, wrong: 0, again: {} }, mode, left: 15 * 60, running: false, xp: 0, fb: null, complete: null };
  showOverlay(); renderDeck();
}
function renderDeck() {
  const q = sess.deck;
  if (sess.complete) { $('#session').innerHTML = shell(100, completeBody(), sess.mode === 'practice' ? '<div class="pair"><button class="btn full" data-act="next">Done</button><button class="btn green full" data-act="again">Practise again</button></div>' : contBtn('Continue')); return; }
  if (!q.list.length) {
    $('#session').innerHTML = shell(100, `<div class="stack done-scr"><div class="hero-ill">${ic('check')}</div><h1 style="color:var(--green-d)">Nothing due!</h1><p class="muted">You're all caught up. Come back tomorrow, or try a quick practice set.</p></div>`, contBtn('Continue'));
    return;
  }
  if (q.i >= q.list.length) { deckComplete(); return; }
  const c = cardById(q.list[q.i]), cs = state.cards[c.id], prac = sess.mode === 'practice';
  const label = prac ? findDeck(sess.pdeck).name : sess.mode === 'cram' ? 'Quick practice' : 'Review';
  const note = prac ? (c.id in (state.pc || {}) ? (pcOf(c.id) >= MASTER ? 'Mastered' : pcOf(c.id) + '/' + MASTER + ' in a row') : 'New card') : cs ? 'Box ' + cs.b : 'New card';
  const body = `<div class="kind" style="${sv(c.t.subj.id)}"><i>${ic(c.t.subj.id)}</i>${esc(label)} · ${q.i + 1}/${q.list.length}</div>${cardFace(c, q.flip, sess.typing)}${sess.typing ? typeArea(c, q) + `<p class="tiny muted" style="text-align:center">${note}</p>` : `<p class="tiny muted" style="text-align:center">${note} · say the answer out loud before you flip</p>`}`;
  $('#session').innerHTML = shell(progressNow(), body, cardFoot(q), sess.fb ? (sess.fb.ok ? 'good' : 'bad') : '');
  if (sess.typing && !sess.fb) { const i = $('#ans'); if (i) i.focus({ preventScroll: true }); }
}
// a plan flashcard block counts as done once you've worked through it (or there was nothing due)
function markDeckDone() {
  const o = sess && sess.opts;
  if (o && o.i != null && state.plans[o.date] && state.plans[o.date].done[o.i] == null) { state.plans[o.date].done[o.i] = 1; logMinutes(o.date, null, 15); save(); }
}
function deckComplete() {
  const q = sess.deck, wasActive = sess.wasActive;
  addXP(5);
  markDeckDone(); save();
  const total = q.right + q.wrong;
  if (sess.mode === 'practice') {
    const st = deckStats(findDeck(sess.pdeck));
    sess.complete = { title: 'Round complete!', stats: [['First try', q.right + '/' + new Set(q.list).size, 'var(--green)', 'check'], ['Mastered', st.mastered + '/' + st.total, 'var(--blue)', 'star']], streakUp: !wasActive };
    renderDeck(); Sound.win(); buzz([30, 50, 30]); confetti({ n: 160, spread: 18, y: innerHeight * 0.35 }); return;
  }
  sess.complete = { title: 'Deck complete!', stats: [['Correct', String(q.right), 'var(--green)', 'check'], ['Accuracy', total ? Math.round(q.right / total * 100) + '%' : '—', 'var(--blue)', 'target']], streakUp: !wasActive };
  renderDeck(); Sound.win(); buzz([30, 50, 30]); confetti({ n: 160, spread: 18, y: innerHeight * 0.35 });
}

/* ---------- practice decks (always available, replay as often as you like) ----------
   Separate from the Leitner boxes: each card keeps a run of correct answers in state.pc[id];
   3 in a row = mastered. A round is 20 cards: ones you're still learning first, then new ones. */
const PCARD = {};
const MASTER = 3;
const DECKS = (() => {
  const L = [];
  const mk = (id, sid, name, desc, rows, opt) => {
    const t = { subj: SUBJ[sid], n: name, id: 'deck-' + id };
    const ids = rows.map((r, i) => { const c = { id: 'x:' + id + ':' + i, q: r[0], a: r[1], t, h: r[2] }; PCARD[c.id] = c; return c.id; });
    L.push(Object.assign({ id, sid, name, desc, ids }, opt || {}));
  };
  const dk = RG.decks || {}, v = RG.vocab || { F: [], H: [], genders: [] };
  if (dk.histDates) mk('hdates', 'hist', 'Key dates', 'Event → date, across all your History units', dk.histDates);
  if (dk.histPeople) mk('hpeople', 'hist', 'Key people & terms', 'Who did what, and the key words examiners reward', dk.histPeople);
  mk('gfde', 'german', 'Foundation words · German → English', 'Every word on the AQA Foundation list', v.F, { type: 'en' });
  mk('gfen', 'german', 'Foundation words · English → German', 'The same list the hard way round (for writing)', v.F.map((r) => [r[1], r[0]]), { type: 'de' });
  mk('ggen', 'german', 'Der, die or das?', 'Noun genders from the AQA list', v.genders.map((g) => ['___ ' + g[0] + '  (' + g[2] + ')', g[1] + ' ' + g[0], g[3] === 'H']), { type: 'g' });
  mk('ghde', 'german', 'Higher words · German → English', 'Extra words that are only on the Higher list', v.H, { h: true, type: 'en' });
  mk('ghen', 'german', 'Higher words · English → German', 'Higher-only words, the hard way round', v.H.map((r) => [r[1], r[0]]), { h: true, type: 'de' });
  return L;
})();
const topicDeck = (s) => ({ id: 'all-' + s.id, sid: s.id, name: 'All ' + s.name + ' cards', desc: 'Every flashcard from your ' + s.name + ' topics', topic: true });
function deckIds(dk) {
  if (dk.topic) return visibleTopics(SUBJ[dk.sid]).flatMap((t) => t.cardIds || []);
  return state.settings.tiers.german === 'F' ? dk.ids.filter((id) => !PCARD[id].h) : dk.ids;
}
function practiceDecks() {
  const order = ['hist', 'german'].concat(RG.subjects.map((s) => s.id).filter((id) => id !== 'hist' && id !== 'german'));
  const out = DECKS.filter((dk) => !(dk.h && state.settings.tiers.german === 'F'));
  for (const sid of order) { const s = SUBJ[sid]; if (s && visibleTopics(s).some((t) => t.cardIds && t.cardIds.length)) out.push(topicDeck(s)); }
  return out.map((dk, i) => [order.indexOf(dk.sid) * 100 + i, dk]).sort((a, b) => a[0] - b[0]).map((x) => x[1]).filter((dk) => !cardsSubj || dk.sid === cardsSubj);
}
function findDeck(id) { return DECKS.find((d) => d.id === id) || (id.startsWith('all-') && SUBJ[id.slice(4)] ? topicDeck(SUBJ[id.slice(4)]) : null); }
const cardById = (id) => CARD[id] || PCARD[id];
const pcOf = (id) => (state.pc && state.pc[id]) || 0;
function deckStats(dk) { const ids = deckIds(dk); return { total: ids.length, mastered: ids.filter((id) => pcOf(id) >= MASTER).length }; }
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function practiceRound(dk) {
  const ids = deckIds(dk), N = 20, pc = state.pc || {};
  const learning = shuffle(ids.filter((id) => id in pc && pc[id] < MASTER)).sort((a, b) => pc[a] - pc[b]).slice(0, 14);
  const fresh = ids.filter((id) => !(id in pc)).slice(0, N - learning.length);
  let list = learning.concat(fresh);
  if (list.length < N) list = list.concat(shuffle(ids.filter((id) => pc[id] >= MASTER)).slice(0, N - list.length));
  return shuffle(list);
}
function startPractice(deckId) {
  const dk = findDeck(deckId); if (!dk) return;
  if (!state.pc) state.pc = {};
  sess = { wasActive: activeOn(D.today()), b: { k: 'cards', m: 10 }, opts: {}, deck: { list: practiceRound(dk), i: 0, flip: false, right: 0, wrong: 0, again: {} }, mode: 'practice', pdeck: dk.id, typing: !!(dk.type && typeOn()), ptype: dk.type, left: 10 * 60, running: false, xp: 0, fb: null, complete: null };
  showOverlay(); renderDeck();
}
function viewDecks() {
  const decks = practiceDecks();
  if (!decks.length) return '';
  const tog = decks.some((dk) => dk.type) ? `<div class="card" style="padding-block:4px"><div class="field"><div><div class="l">Type German answers</div><div class="s">Type the word instead of flipping, or tap der/die/das for genders. Small typos are OK.</div></div><input type="checkbox" class="switch" data-typemode ${typeOn() ? 'checked' : ''} aria-label="Type German answers"></div></div>` : '';
  return `<div class="sect"><h2>Practice decks</h2><p class="small muted" style="margin:-4px 0 12px">Always open, so replay them as often as you like. Get a card right 3 times in a row to master it.</p>${tog}<div class="decks">${decks.map((dk) => {
    const st = deckStats(dk), pct = st.total ? Math.round(st.mastered / st.total * 100) : 0;
    return `<button class="deck" data-act="practice" data-deck="${esc(dk.id)}" style="${sv(dk.sid)}"><span class="deck-ic">${ic(dk.sid)}</span><span class="deck-tx"><b>${esc(dk.name)}</b><span class="tiny">${esc(dk.desc)}</span>
      <span class="deck-bar"><i style="width:${pct}%"></i></span><span class="tiny num">${st.mastered} / ${st.total} mastered${dk.type && typeOn() ? ' · ' + (dk.type === 'g' ? 'tap der/die/das' : 'type answers') : ''}</span></span></button>`;
  }).join('')}</div></div>`;
}

/* ---------- typing mode (German decks) ----------
   Forgiving marking: any listed meaning counts, ae/oe/ue/ss = ä/ö/ü/ß, a missing umlaut or a one-letter
   slip is accepted with a nudge. Nouns typed into German must carry the right article. */
const typeOn = () => state.settings.typeMode !== false;
const FOLD1 = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' }, FOLD2 = { 'ä': 'a', 'ö': 'o', 'ü': 'u', 'ß': 'ss' };
const fold = (x, m) => x.replace(/[äöüß]/g, (ch) => m[ch]);
function ansNorm(x, lang) {
  x = x.toLowerCase().replace(/\be\.g\..*$/, ' ').replace(/\+ ?(accusative|dative|genitive|noun)\b/g, ' ').replace(/…|\.\.\./g, ' ')
    .replace(/[’'`]/g, '').replace(/[.!?"-]/g, ' ').replace(/\s+/g, ' ').trim();
  if (lang === 'en') x = x.replace(/^to (?=\S)/, '').replace(/^(a|an|the) (?=\S)/, '');
  return x;
}
const ansAlts = (x, lang) => String(x).replace(/\([^)]*\)/g, ' ').split(/[,;/]| or /).map((y) => ansNorm(y, lang)).filter(Boolean);
function lev(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 9;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i), pp = prev;
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) cur[j] = Math.min(cur[j], pp[j - 2] + 1); // swapped letters
    }
    pp = prev; prev = cur;
  }
  return prev[b.length];
}
function matchAnswer(typed, answer, lang) {
  const T = ansAlts(typed, lang), A = ansAlts(answer, lang), pairs = [];
  for (const t of T) for (const a of A) pairs.push([t, a]);
  if (pairs.some(([t, a]) => t === a || fold(t, FOLD1) === fold(a, FOLD1))) return { ok: true, note: A.length > 1 ? 'All meanings: ' + answer : '' };
  if (pairs.some(([t, a]) => fold(t, FOLD2) === fold(a, FOLD2))) return { ok: true, note: 'Watch the umlauts: ' + answer };
  if (lang === 'de') for (const [t, a] of pairs) {
    const m = a.match(/^(der|die|das) (.+)$/); if (!m) continue;
    const tail = fold(m[2], FOLD2), tt = fold(t, FOLD2), tm = tt.match(/^(der|die|das|den|dem) (.+)$/);
    const near = (x) => x === tail || (tail.length >= 5 && lev(x, tail) <= 1);
    if (near(tt)) return { ok: false, note: 'Don\'t forget the article: ' + answer };
    if (tm && tm[1] !== m[1] && near(tm[2])) return { ok: false, note: 'Right word, wrong gender: ' + answer };
  }
  for (const [t, a] of pairs) {
    const x = fold(t, FOLD2), y = fold(a, FOLD2), d = lev(x, y);
    if ((d <= 1 && y.length >= 4) || (d <= 2 && y.length >= 9)) return { ok: true, note: 'Nearly! Check the spelling: ' + answer };
  }
  return { ok: false, note: 'Answer: ' + answer };
}
function typeArea(c, q) {
  if (sess.ptype === 'g') return `<div class="gpick" id="gpick">${gpickBtns(c, q)}</div><div class="tres" id="tres" aria-live="polite">${tresHTML(c)}</div>`;
  const de = sess.ptype === 'de';
  return `<form id="type-form" class="typeform" autocomplete="off"><input id="ans" type="text" value="${esc(q.typed || '')}" ${sess.fb ? 'readonly' : ''} placeholder="Type the ${de ? 'German' : 'English'}…" aria-label="Your answer" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="go" lang="${de ? 'de' : 'en'}"></form>
    ${de ? `<div class="uml">${['ä', 'ö', 'ü', 'ß'].map((ch) => `<button type="button" data-act="uml" data-ch="${ch}" aria-label="Insert ${ch}">${ch}</button>`).join('')}</div>` : ''}<div class="tres" id="tres" aria-live="polite">${tresHTML(c)}</div>`;
}
function gpickBtns(c, q) {
  const a = c.a.split(' ')[0];
  return ['der', 'die', 'das'].map((g, i) => {
    const cls = sess.fb ? (g === a ? ' right' : g === q.typed ? ' wrong' : '') : '';
    return `<button class="gbtn${cls}" data-act="gpick" data-g="${g}" ${sess.fb ? 'disabled' : ''}><small>${i + 1}</small>${g}</button>`;
  }).join('');
}
function tresHTML(c) {
  const f = sess.fb; if (!f) return '';
  const txt = f.ok ? (f.note || 'Correct!') : f.note;
  return `<span class="${f.ok ? 'ok' : 'no'}">${ic(f.ok ? 'check' : 'x')}${esc(txt)}</span>${f.ok || sess.ptype === 'g' ? '' : '<button type="button" class="linkbtn" data-act="override">I was right</button>'}`;
}
function checkTyped(val, idk) {
  const q = queue(); if (!q || sess.fb || !sess.typing || q.i >= q.list.length) return;
  const c = cardById(q.list[q.i]);
  if (!idk && !String(val).trim()) { const i = $('#ans'); if (i) { i.classList.remove('shake'); void i.offsetWidth; i.classList.add('shake'); i.focus(); } return; }
  const r = idk ? { ok: false, note: (sess.ptype === 'g' ? 'It\'s ' : 'Answer: ') + c.a }
    : sess.ptype === 'g' ? (val === c.a.split(' ')[0] ? { ok: true, note: '' } : { ok: false, note: 'It\'s ' + c.a }) : matchAnswer(val, c.a, sess.ptype);
  q.typed = idk ? '' : val; q.flip = true;
  const el = $('#fc'); if (el) el.classList.add('flip');
  const inp = $('#ans'); if (inp) inp.readOnly = true;
  gradeCurrent(r.ok, r.note);
  const t = $('#tres'); if (t) t.innerHTML = tresHTML(c);
  const g = $('#gpick'); if (g) g.innerHTML = gpickBtns(c, q);
}
// typed answers can be right in ways the checker doesn't know (a synonym, a different word order)
function overrideRight() {
  const q = queue(), L = sess.last; if (!q || !sess.fb || sess.fb.ok || !L) return;
  if (L.first) { state.pc[L.id] = L.prev + 1; q.right++; const k = q.list.lastIndexOf(L.id); if (k > q.i) q.list.splice(k, 1); delete q.again[L.id]; }
  q.wrong--; addXP(1);
  const c = cardById(L.id);
  sess.fb = { ok: true, msg: 'Counted as right', note: 'Answer: ' + c.a };
  save(); Sound.correct();
  setFoot(cardFoot(q), 'good');
  const t = $('#tres'); if (t) t.innerHTML = tresHTML(c);
}

/* ---------- multiple-choice quizzes ----------
   Built from the same cards as the flashcards: the wrong options are other answers of the same kind
   (a date for a date, a German noun with its article for a noun…). A missed question sends that card
   back into its practice deck (state.pc = 0). Best scores live in state.quiz[id]. */
const QUIZ_N = 10;
const HINT = { en: 'What does this mean?', de: 'Which is the German?', g: 'Der, die or das?', hdates: 'When did this happen?', hpeople: 'Who or what is this?' };
function paperGroups(s) {
  const ts = visibleTopics(s).filter((t) => t.cardIds && t.cardIds.length);
  const keys = [...new Set(ts.map((t) => t.paperIds[0]))];
  const count = (k) => ts.filter((t) => k === 'all' || t.paperIds[0] === k).reduce((n, t) => n + t.cardIds.length, 0);
  if (keys.length <= 1) return ts.length ? [{ id: 'p-' + s.id + '-all', sid: s.id, name: s.name + ' · all topics', desc: 'Questions from every ' + s.name + ' topic', n: count('all') }] : [];
  return keys.map((k) => ({ id: 'p-' + s.id + '-' + k, sid: s.id, name: s.name.replace('Combined ', '') + ' · ' + PAPER[k].name, desc: 'Questions from the topics on this paper', n: count(k) }));
}
function quizList() {
  const order = ['hist', 'german'].concat(RG.subjects.map((x) => x.id).filter((id) => id !== 'hist' && id !== 'german'));
  const out = DECKS.filter((dk) => !(dk.h && state.settings.tiers.german === 'F'))
    .map((dk) => ({ id: 'q-' + dk.id, sid: dk.sid, name: dk.name, desc: dk.type === 'g' ? 'Pick the right article' : dk.type ? 'Pick the right translation' : dk.desc, n: deckIds(dk).length }));
  for (const x of RG.subjects) out.push(...paperGroups(x));
  return out.map((q, i) => [order.indexOf(q.sid) * 100 + i, q]).sort((a, b) => a[0] - b[0]).map((x) => x[1]).filter((q) => !cardsSubj || q.sid === cardsSubj);
}
// { ids: cards to ask, pool: cards to draw wrong answers from, name, sid, kind }
function findQuiz(id) {
  if (id.startsWith('q-')) {
    const dk = findDeck(id.slice(2)); if (!dk) return null;
    const ids = deckIds(dk);
    return { id, ids, pool: ids, name: dk.name, sid: dk.sid, kind: dk.type || dk.id };
  }
  if (id.startsWith('t-')) {
    const t = TOPIC[id.slice(2)]; if (!t) return null;
    return { id, ids: t.cardIds, pool: visibleTopics(t.subj).flatMap((x) => x.cardIds || []), name: t.n, sid: t.subj.id, kind: 'topic' };
  }
  if (id.startsWith('p-')) {
    const rest = id.slice(2), sid = rest.split('-')[0], key = rest.slice(sid.length + 1), subj = SUBJ[sid]; if (!subj) return null;
    const ts = visibleTopics(subj).filter((t) => t.cardIds && t.cardIds.length);
    const g = paperGroups(subj).find((x) => x.id === id);
    return { id, ids: ts.filter((t) => key === 'all' || t.paperIds[0] === key).flatMap((t) => t.cardIds), pool: ts.flatMap((t) => t.cardIds), name: g ? g.name : subj.name, sid, kind: 'topic' };
  }
  return null;
}
const yearOf = (x) => { const m = String(x).match(/\b(1[0-9]{3}|20[0-9]{2})\b/); return m ? Number(m[1]) : null; };
function shapeOf(a) {
  if (/^(der|die|das) \S/.test(a)) return 'noun';
  if (/^to \S/.test(a)) return 'verb';
  if (yearOf(a)) return 'date';
  if (/\d/.test(a)) return 'num';
  return a.length > 45 ? 'long' : 'short';
}
function quizQuestion(c, src) {
  if (src.kind === 'g') return { id: c.id, ans: c.a.split(' ')[0], opts: ['der', 'die', 'das'], picked: null };
  const norm = (x) => String(x).trim().toLowerCase(), ans = c.a, sh = shapeOf(ans), yr = yearOf(ans);
  const vocab = src.kind === 'en' || src.kind === 'de';
  const clash = (x) => { if (!vocab) return false; const A = new Set(ansAlts(c.a, 'en')), Q = new Set(ansAlts(c.q, 'en')); return ansAlts(x.a, 'en').some((y) => A.has(y)) || ansAlts(x.q, 'en').some((y) => Q.has(y)); };
  const seen = new Set([norm(ans)]), scored = [];
  for (const id of src.pool) {
    const x = cardById(id); if (!x || x.id === c.id || seen.has(norm(x.a)) || clash(x)) continue;
    seen.add(norm(x.a));
    let sc = Math.random() * 1.5;
    if (shapeOf(x.a) === sh) sc += 2;
    if (src.kind === 'topic') { if (x.t === c.t) sc += 3; else if (x.t.paperIds && c.t.paperIds && x.t.paperIds[0] === c.t.paperIds[0]) sc += 1.5; }
    const xy = yearOf(x.a); if (yr && xy) sc += Math.max(0, 2 - Math.abs(xy - yr) / 8);
    sc += 1 - Math.min(1, Math.abs(x.a.length - ans.length) / Math.max(ans.length, 20));
    scored.push([sc, x.a]);
  }
  scored.sort((a, b) => b[0] - a[0]);
  return { id: c.id, ans, opts: shuffle([ans].concat(scored.slice(0, 3).map((x) => x[1]))), picked: null };
}
function quizRound(src) {
  const pc = state.pc || {}, missed = shuffle(src.ids.filter((id) => pc[id] === 0)).slice(0, 4), m = new Set(missed);
  return shuffle(missed.concat(shuffle(src.ids.filter((id) => !m.has(id)))).slice(0, QUIZ_N));
}
function startQuiz(id) {
  const src = findQuiz(id); if (!src || !src.ids.length) return;
  const qs = quizRound(src).map((cid) => quizQuestion(cardById(cid), src));
  sess = { wasActive: activeOn(D.today()), b: { k: 'quiz', m: 10 }, opts: {}, mode: 'quiz', quiz: { src: id, name: src.name, sid: src.sid, kind: src.kind, qs, i: 0, right: 0 }, left: 10 * 60, running: false, xp: 0, fb: null, complete: null };
  showOverlay(); renderQuiz();
}
function qoptsHTML(q) {
  return q.opts.map((o, i) => {
    const st = q.picked == null ? '' : o === q.ans ? ' right' : i === q.picked ? ' wrong' : ' dim';
    return `<button class="qopt${st}" data-act="qpick" data-i="${i}" ${q.picked != null ? 'disabled' : ''}><b>${i + 1}</b><span>${esc(o)}</span></button>`;
  }).join('');
}
function quizFoot() {
  const z = sess.quiz, q = z.qs[z.i], f = sess.fb;
  if (!f) return `<button class="btn full" disabled>Tap an answer</button>`;
  return `<div class="fb"><div class="badge">${ic(f.ok ? 'check' : 'x')}</div><div><h2>${esc(f.msg)}</h2><p>${f.ok ? '+2 XP' : 'Answer: ' + esc(q.ans) + ' · added to your practice pile'}</p></div></div><button class="btn ${f.ok ? 'green' : 'red'} full" data-act="qnext">${z.i + 1 < z.qs.length ? 'Continue' : 'See your score'}</button>`;
}
function renderQuiz() {
  const z = sess.quiz;
  if (sess.complete) { $('#session').innerHTML = shell(100, completeBody(), '<div class="pair"><button class="btn full" data-act="next">Done</button><button class="btn green full" data-act="qagain">New quiz</button></div>'); return; }
  const q = z.qs[z.i], c = cardById(q.id);
  const hint = HINT[z.kind] || c.t.n;
  const body = `<div class="kind" style="${sv(z.sid)}"><i>${ic(z.sid)}</i>${esc(z.name)} · ${z.i + 1}/${z.qs.length}</div>
    <div class="qcard" style="${sv(c.t.subj.id)}"><span class="src">${esc(hint)}</span><div class="q">${esc(c.q)}</div></div>
    <div class="qopts${z.kind === 'g' ? ' three' : ''}" id="qopts">${qoptsHTML(q)}</div>`;
  $('#session').innerHTML = shell(z.i / z.qs.length * 100, body, quizFoot(), sess.fb ? (sess.fb.ok ? 'good' : 'bad') : '');
}
function pickQuiz(i) {
  const z = sess && sess.quiz; if (!z || sess.complete || sess.fb) return;
  const q = z.qs[z.i]; if (!q || i >= q.opts.length) return;
  q.picked = i;
  const ok = q.opts[i] === q.ans;
  if (!state.pc) state.pc = {};
  if (ok) { z.right++; addXP(2); } else state.pc[q.id] = 0;
  sess.fb = { ok, msg: ok ? pick(YES) : pick(NO) };
  save();
  $('#qopts').innerHTML = qoptsHTML(q);
  setFoot(quizFoot(), ok ? 'good' : 'bad');
  const pb = $('#session .pbar i'); if (pb) pb.style.width = Math.max(3, (z.i + 1) / z.qs.length * 100) + '%';
  const el = $('#qopts .qopt.' + (ok ? 'right' : 'wrong'));
  if (ok) { Sound.correct(); buzz(12); confetti({ n: 36, spread: 11, y: innerHeight - 140 }); xpFloat(2, el); }
  else { Sound.wrong(); buzz([20, 40, 20]); if (el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); } }
}
function nextQuiz() {
  const z = sess && sess.quiz; if (!z || !sess.fb) return;
  z.i++; sess.fb = null;
  if (z.i < z.qs.length) { renderQuiz(); return; }
  if (!state.quiz) state.quiz = {};
  const prev = state.quiz[z.src] || { best: 0, n: 0 };
  state.quiz[z.src] = { best: Math.max(prev.best, z.right), n: prev.n + 1, last: z.right, of: z.qs.length };
  addXP(5); save();
  sess.complete = { title: z.right === z.qs.length ? 'Perfect score!' : z.right >= z.qs.length * 0.7 ? 'Great quiz!' : 'Quiz complete!',
    stats: [['Score', z.right + '/' + z.qs.length, 'var(--green)', 'check'], ['Best', state.quiz[z.src].best + '/' + z.qs.length, 'var(--blue)', 'star']], streakUp: !sess.wasActive };
  renderQuiz(); Sound.win(); buzz([30, 50, 30]); confetti({ n: 160, spread: 18, y: innerHeight * 0.35 });
}
function viewQuizzes() {
  const L = quizList();
  let h = `<div class="deckhero"><div class="hero-ill" style="--c:var(--purple);--cd:var(--purple-d)">${ic('target')}</div><h1>Quick-fire quizzes</h1>
    <p class="muted">10 multiple-choice questions from your revision cards. Tap the right answer — anything you miss goes back into your practice decks.</p></div>`;
  h += subjTabs();
  h += `<div class="sect"><div class="decks">${L.map((q) => {
    const r = (state.quiz || {})[q.id], of = Math.min(QUIZ_N, q.n), pct = r ? Math.round(r.best / (r.of || of) * 100) : 0;
    return `<button class="deck" data-act="quiz" data-src="${esc(q.id)}" style="${sv(q.sid)}"><span class="deck-ic">${ic(q.sid)}</span><span class="deck-tx"><b>${esc(q.name)}</b><span class="tiny">${esc(q.desc)}</span>
      <span class="deck-bar"><i style="width:${pct}%"></i></span><span class="tiny num">${r ? 'Best ' + r.best + '/' + (r.of || of) + ' · played ' + plural(r.n, 'time') : q.n + ' questions to draw from'}</span></span><span class="qgo">${r ? r.best + '/' + (r.of || of) : 'Go'}</span></button>`;
  }).join('')}</div></div>`;
  return h;
}

/* ---------- events ---------- */
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act],[data-rate],[data-topic],[data-unlock],[data-tab],[data-cs],[data-chk],[data-weak],[data-ctab]');
  if (!el) return;
  if (el.dataset.rate) {
    quickRate(el.dataset.rate, Number(el.dataset.r)); save(); Sound.tick();
    $$('button', el.parentElement).forEach((b) => b.setAttribute('aria-pressed', b === el ? 'true' : 'false'));
    return;
  }
  if (el.dataset.topic) { go('subjects', el.dataset.topic); return; }
  if (el.dataset.unlock) { state.unlocked[el.dataset.unlock] = true; save(); render(); toast('Added to your plan'); return; }
  if (el.dataset.tab) { planTab = el.dataset.tab; render(); return; }
  if (el.dataset.ctab) { cardsTab = el.dataset.ctab; Sound.tick(); render(); return; }
  if (el.dataset.cs != null && el.closest('.tabs')) { cardsSubj = el.dataset.cs || null; render(); return; }
  if (el.dataset.chk != null) {
    const on = el.getAttribute('aria-pressed') !== 'true'; sess.checks[el.dataset.chk] = on; el.setAttribute('aria-pressed', on);
    if (on) { Sound.tick(); buzz(8); }
    const cnt = $('#counter'); if (cnt) { cnt.textContent = Object.values(sess.checks).filter(Boolean).length + ' / ' + TOPIC[sess.b.t].pts.length; cnt.classList.remove('bump'); void cnt.offsetWidth; cnt.classList.add('bump'); }
    return;
  }
  if (el.dataset.weak) { const on = el.getAttribute('aria-pressed') !== 'true'; sess.checks[el.dataset.weak] = on; el.setAttribute('aria-pressed', on); if (on) Sound.tick(); return; }
  const a = el.dataset.act, d = D.today();
  switch (a) {
    case 'node': { const i = Number(el.dataset.i); openNode = openNode === i ? null : i; Sound.tick(); render(); break; }
    case 'start': openSession({ i: Number(el.dataset.i), date: d }); break;
    case 'revise': openSession({ t: el.dataset.t }); break;
    case 'rebuild': rebuildPlan(d); openNode = null; render(); toast('New path built from your latest ratings'); break;
    case 'to-exams': planTab = 'exams'; go('plan'); break;
    case 'to-road': e.preventDefault(); planTab = 'road'; go('plan'); break;
    case 'close': if (sess && sess.deck && !sess.complete && sess.deck.i > 0) markDeckDone(); closeSession(); break;
    case 'timer':
      if (!sess) break;
      if (sess.left === 0) sess.left = sess.b.m * 60;
      sess.running = !sess.running;
      clearInterval(timerInt); timerInt = sess.running ? setInterval(tick, 1000) : null;
      el.classList.toggle('on', sess.running); break;
    case 'next': {
      if (sess.complete) { closeSession(); break; }
      if (sess.deck) { markDeckDone(); closeSession(); break; }
      const step = sess.steps[sess.step];
      if (step === 'score') { sess.score = ($('#p-score') || {}).value || ''; sess.max = ($('#p-max') || {}).value || ''; finishSession(); break; }
      if (step === 'rate') { if (sess.rating) finishSession(); break; }
      sess.step++; renderSession(); break;
    }
    case 'pick': {
      sess.rating = Number(el.dataset.r); Sound.tick();
      $$('#session .choice.rate').forEach((b) => b.setAttribute('aria-pressed', b === el ? 'true' : 'false'));
      const nr = $('#next-review'); if (nr) nr.innerHTML = nextReviewTxt(TOPIC[sess.b.t], sess.rating);
      const btn = $('#l-foot .btn'); if (btn) btn.disabled = false;
      break;
    }
    case 'flip': flipCard(); break;
    case 'grade': gradeCurrent(el.dataset.ok === '1'); break;
    case 'cont': continueCard(); break;
    case 'review': startCards('review'); break;
    case 'cram': startCards('cram'); break;
    case 'practice': startPractice(el.dataset.deck); break;
    case 'quiz': startQuiz(el.dataset.src); break;
    case 'qpick': pickQuiz(Number(el.dataset.i)); break;
    case 'qnext': nextQuiz(); break;
    case 'qagain': { const id = sess && sess.quiz && sess.quiz.src; closeSession(); if (id) startQuiz(id); break; }
    case 'check': checkTyped(($('#ans') || {}).value || ''); break;
    case 'idk': checkTyped('', true); break;
    case 'gpick': checkTyped(el.dataset.g); break;
    case 'override': overrideRight(); break;
    case 'uml': {
      const i = $('#ans'); if (!i || i.readOnly) break;
      const a0 = i.selectionStart == null ? i.value.length : i.selectionStart, b0 = i.selectionEnd == null ? a0 : i.selectionEnd;
      i.value = i.value.slice(0, a0) + el.dataset.ch + i.value.slice(b0); i.focus(); i.setSelectionRange(a0 + 1, a0 + 1); break;
    }
    case 'again': { const id = sess && sess.pdeck; closeSession(); if (id) startPractice(id); break; }
    case 'export': {
      const txt = JSON.stringify(state), ta = $('#backup'); ta.value = txt;
      try { navigator.clipboard.writeText(txt).then(() => toast('Backup copied'), () => { ta.select(); toast('Select-all and copy the box'); }); } catch (err) { ta.select(); toast('Select-all and copy the box'); }
      break;
    }
    case 'import': {
      try { const obj = JSON.parse($('#backup').value); if (!obj || !obj.settings) throw new Error('bad'); state = migrate(obj); applySettings(); save(); render(); toast('Progress restored'); }
      catch (err) { toast('That doesn\'t look like a backup — paste the whole text'); }
      break;
    }
    case 'reset': $('#reset-confirm').innerHTML = '<button class="btn sm red" data-act="reset-yes">Yes, delete everything</button>'; break;
    case 'reset-yes': { const keep = state.settings; state = defaultState(); state.settings = keep; save(); render(); toast('Progress reset'); break; }
    case 'login-signup': authDo('signup'); break;
    case 'login-google': authDo('google'); break;
    case 'login-reset': authDo('reset'); break;
    case 'login-skip': setSkipLogin(true); go('today'); break;
    case 'signin-now': setSkipLogin(false); render(); window.scrollTo(0, 0); break;
    case 'signout': authSignOut(); break;
  }
});
document.addEventListener('submit', (e) => {
  if (e.target && e.target.id === 'login-form') { e.preventDefault(); authDo('signin'); }
  if (e.target && e.target.id === 'pw-form') { e.preventDefault(); addPassword(); }
  if (e.target && e.target.id === 'type-form') { e.preventDefault(); if (sess && sess.fb) continueCard(); else checkTyped(($('#ans') || {}).value || ''); }
});
// keep the keyboard up when tapping the umlaut / Check buttons
document.addEventListener('mousedown', (e) => { if (e.target.closest && e.target.closest('[data-act="uml"],[data-act="check"]')) e.preventDefault(); });
document.addEventListener('change', (e) => {
  const el = e.target;
  if (el.dataset.typemode != null) { state.settings.typeMode = el.checked; save(); render(); return; }
  if (el.dataset.sound != null) { state.settings.sound = el.checked; save(); if (el.checked) Sound.correct(); return; }
  if (el.dataset.tier) { state.settings.tiers[el.dataset.tier] = el.value; afterSettings(); }
  else if (el.dataset.mock != null) { const m = state.settings.mocks[Number(el.dataset.mock)]; if (el.value) m[el.dataset.f] = el.value; if (m.end < m.start) m.end = m.start; afterSettings(); }
  else if (el.dataset.speaking != null) { if (el.value) state.settings.speakingDate = el.value; applySettings(); afterSettings(); }
  else if (el.dataset.intensity != null) { state.settings.intensity = Number(el.value); afterSettings(); }
  else if (el.dataset.restday != null) { state.settings.restDay = Number(el.value); afterSettings(); }
});
function afterSettings() { rebuildPlan(D.today()); save(); toast('Plan updated'); render(); }
document.addEventListener('keydown', (e) => {
  if (!sess) return;
  if (e.key === 'Escape') { closeSession(); return; }
  if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement && document.activeElement.tagName)) return;
  if (sess.quiz && !sess.complete) {
    if (!sess.fb && /^[1-4]$/.test(e.key)) pickQuiz(Number(e.key) - 1);
    else if (sess.fb && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); nextQuiz(); }
    return;
  }
  const q = (sess.deck || (sess.steps && sess.steps[sess.step] === 'cards')) ? queue() : null;
  if (q && q.i < q.list.length) {
    if (sess.fb) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); continueCard(); } return; }
    if (sess.typing) { if (sess.ptype === 'g' && /^[123]$/.test(e.key)) checkTyped(['der', 'die', 'das'][e.key - 1]); return; }
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!q.flip) flipCard(); return; }
    if (q.flip && e.key === '1') gradeCurrent(false);
    if (q.flip && e.key === '2') gradeCurrent(true);
    return;
  }
  if (e.key === 'Enter') { const b = $('#l-foot .btn'); if (b && !b.disabled) b.click(); }
});
function readHash() {
  const h = location.hash.slice(1), [r, ...rest] = h.split('-'), s = rest.join('-');
  route = ['today', 'plan', 'subjects', 'cards', 'more', 'rate'].includes(r) ? r : 'today';
  sub = s || null;
}
window.addEventListener('hashchange', () => { readHash(); openNode = null; if (sess) closeSession(); render(); window.scrollTo(0, 0); });

/* ---------- boot ---------- */
function boot() {
  if (typeof state.xp !== 'number') state.xp = 0;
  $('#nav').innerHTML = '<div class="nav-in">' + [['today', 'Learn', 'home'], ['plan', 'Plan', 'plan'], ['subjects', 'Subjects', 'book'], ['cards', 'Cards', 'cards'], ['more', 'Settings', 'sliders']]
    .map(([r, l, i]) => `<a href="#${r}" data-r="${r}">${ic(i)}<span>${l}</span></a>`).join('') + '</div>';
  readHash(); render();
  initClaudeCloud();
  initFirebaseAuth();
  window.addEventListener('rgauth-ready', () => { initFirebaseAuth(); render(); });
  let day = D.today();
  setInterval(() => { if (D.today() !== day) { day = D.today(); if (!sess) render(); } }, 60000);
}
boot();
