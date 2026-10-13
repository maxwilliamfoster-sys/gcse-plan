/* ============================================================
   GCSE Plan — UI layer (calm, shadcn-style via Basecoat)
   Router, views, lessons, flashcards, quizzes, events, boot.
   Engine lives in app.js (planner, sync, data) and timetable.js (bell times).
   ============================================================ */

/* ---------- icons (Lucide, ISC licence, plus subject marks) ---------- */
const IC = {
  today: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  week: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
  book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  map: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
  settings: '<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  chevL: '<path d="m15 18-6-6 6-6"/>',
  chevR: '<path d="m9 18 6-6-6-6"/>',
  chevD: '<path d="m6 9 6 6 6-6"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3"/>',
  ext: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  fire: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  bolt: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  live: '<path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/>',
  coffee: '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/>',
  star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  pencil: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  doc: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  trophy: '<path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978"/><path d="M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978"/><path d="M18 9h1.5a1 1 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"/><path d="M6 9H4.5a1 1 0 0 1 0-5H6"/>',
  cards: '<rect width="18" height="14" x="3" y="7" rx="2"/><path d="M7 7V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"/>',
  user: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
  google: '<path d="M21 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5a4.3 4.3 0 0 1-1.9 2.8v2.3h3A9 9 0 0 0 21 12.2z" fill="#4285F4" stroke="none"/><path d="M12 21.3c2.5 0 4.6-.8 6.1-2.3l-3-2.3c-.8.6-1.9.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H3.8v2.4A9.2 9.2 0 0 0 12 21.3z" fill="#34A853" stroke="none"/><path d="M6.9 13.8a5.5 5.5 0 0 1 0-3.6V7.8H3.8a9.2 9.2 0 0 0 0 8.4z" fill="#FBBC05" stroke="none"/><path d="M12 6.5c1.3 0 2.5.5 3.5 1.4l2.6-2.6A9.2 9.2 0 0 0 3.8 7.8l3.1 2.4C7.6 8.1 9.6 6.5 12 6.5z" fill="#EA4335" stroke="none"/>',
  maths: '<path d="M6.5 3.5v6M3.5 6.5h6M14.5 6.5h6M4 14.5l5 5M9 14.5l-5 5M14.5 17h6"/><circle cx="17.5" cy="14.3" r=".9" fill="currentColor"/><circle cx="17.5" cy="19.7" r=".9" fill="currentColor"/>',
  science: '<path d="M9 2.8h6M10 2.8v6.4L4.6 18.6a1.7 1.7 0 0 0 1.5 2.6h11.8a1.7 1.7 0 0 0 1.5-2.6L14 9.2V2.8"/><path d="M7.2 14.5h9.6"/>',
  englang: '<path d="M4 4.5h16v11.5H9.5L4.5 20z"/><path d="M8.5 8.5h7M8.5 12h4.5"/>',
  englit: '<path d="M20.5 3.5C12.5 3.5 6 9.5 5 19"/><path d="M20.5 3.5c0 7.5-5.5 12-12 12.5"/><path d="M3.5 20.5 7 17"/>',
  hist: '<path d="M3 21h18M12 3l9 4.5H3z"/><path d="M5.5 10v8M10 10v8M14 10v8M18.5 10v8M4 10h16M4 18h16"/>',
  german: '<path d="M3 4.5h11.5v8.5H7.5L3 16.5z"/><path d="M10.5 16v1.5h6l4.5 3.5V9.5h-3.5"/>',
};
function ic(name, cls) { return `<svg class="ico${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[name] || ''}</svg>`; }
const KIND_ICON = { learn: 'book', recall: 'bulb', exam: 'pencil', final: 'target', paper: 'doc', cards: 'cards' };
const sv = (sid) => sid ? `--c:var(--${sid})` : '--c:var(--muted-foreground)';
const ccol = (c) => 'var(--c' + (c || 0) + ')';
const CONF_WORD = ['Not rated', 'Don\'t know it', 'Shaky', 'Okay, some gaps', 'Good', 'Exam-ready'];
function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }
function minsTxt(m) { if (m < 60) return m + ' min'; const h = Math.floor(m / 60), r = m % 60; return h + ' h' + (r ? ' ' + r + ' min' : ''); }
function nextExam(d) { return PAPERS.find((p) => p.date >= d && !p.approx) || null; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
const shortName = (s) => s.name.replace('Combined ', '').replace('English ', 'Eng. ');

/* ---------- XP, streak, sound ---------- */
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
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.16, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.03); t += gap;
    }
  },
  correct() { this.play([[784, 0.14, 0.09], [1175, 0.24, 0]], 'sine', 0.14); },
  wrong() { this.play([[247, 0.16, 0.12], [196, 0.26, 0]], 'triangle', 0.12); },
  tick() { this.play([[988, 0.07, 0]], 'sine', 0.07); },
  win() { this.play([[523, 0.14, 0.11], [659, 0.14, 0.11], [784, 0.14, 0.11], [1047, 0.4, 0]], 'sine', 0.14); },
};
function buzz(ms) { try { const ua = navigator.userActivation; if (navigator.vibrate && (!ua || ua.hasBeenActive)) navigator.vibrate(ms); } catch (e) { /* not supported */ } }
function xpFloat(n, el) {
  const f = document.createElement('div'); f.className = 'xpfloat'; f.textContent = '+' + n + ' XP';
  const r = el ? el.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0 };
  f.style.left = (r.left + r.width / 2) + 'px'; f.style.top = (r.top - 6) + 'px';
  document.body.appendChild(f); setTimeout(() => f.remove(), 950);
}
function toast(msg) {
  $$('.toast').forEach((t) => t.remove());
  const el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); el.textContent = msg;
  document.body.appendChild(el); setTimeout(() => el.remove(), 2300);
}

/* ---------- shared bits ---------- */
function mastery(s) { const a = subjectAvg(s); return Math.round((a.avg / 5) * 100); }
function rate5(id, cur) {
  return `<div class="rate5" role="group" aria-label="Confidence, 1 to 5">` + [1, 2, 3, 4, 5].map((r) =>
    `<button type="button" data-rate="${esc(id)}" data-r="${r}" aria-pressed="${cur === r}" title="${CONF_WORD[r]}" style="--rc:${ccol(r)}">${r}</button>`).join('') + '</div>';
}
function confChip(c) { return `<span class="chip"><i class="dot" style="background:${ccol(c)}"></i>${esc(CONF_WORD[c || 0])}</span>`; }
const SPEC_PDF = {
  maths: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/mathematics/2015/specification-and-sample-assesment/gcse-maths-2015-specification.pdf',
  science: 'https://filestore.aqa.org.uk/resources/science/specifications/AQA-8464-SP-2016.PDF',
  englang: 'https://filestore.aqa.org.uk/resources/english/specifications/AQA-8700-SP-2015.PDF',
  englit: 'https://cdn.sanity.io/files/p28bar15/green/1d552450a822e04717de340917da5d3b91896f1a.pdf',
  hist: 'https://www.ocr.org.uk/Images/207163-specification-accredited-gcse-history-a-first-teaching-2019-with-first-assessment-2021-j410.pdf',
  german: 'https://filestore.aqa.org.uk/resources/german/specifications/AQA-8662-SP-2024.PDF',
};
function specLine(t) {
  const ref = (RG.spec || {})[t.id];
  return ref ? `<p class="spec-ref">Official spec: <a href="${esc(SPEC_PDF[t.subj.id])}" target="_blank" rel="noopener">${esc(ref)}</a></p>` : '';
}
function note(html, tone, icon) { return `<div class="note" data-tone="${tone || 'info'}">${ic(icon || 'info')}<div>${html}</div></div>`; }
function extLink(label, url) { return `<a class="xlink" href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}${ic('ext', 'xs')}</a>`; }
// link keys from the timetable data ('app' was the old separate flashcard app, now the Practice tab here)
function ttLinks(keys) {
  return (keys || []).map((k) => k === 'app' ? `<a class="xlink" href="#/practice/decks">Practice decks in this app</a>` : TT.LINKS[k] ? extLink(TT.LINKS[k][0], TT.LINKS[k][1]) : '').join('');
}
function vidList(list) {
  return `<ul class="vids">${list.map((v) => `<li><a href="https://www.youtube.com/watch?v=${esc(v.id)}" target="_blank" rel="noopener"><span class="play">${ic('play')}</span><span><span class="t">${esc(v.title)}</span><span class="meta">${esc(v.channel)}${v.length ? ', ' + esc(v.length) : ''}</span></span></a></li>`).join('')}</ul>`;
}
function seg(items, cur, label) {
  return `<nav class="seg" aria-label="${esc(label)}">${items.map(([key, text, hrefTo]) => `<a href="${hrefTo}" aria-current="${key === cur ? 'page' : 'false'}">${esc(text)}</a>`).join('')}</nav>`;
}
function subjChips(cur, base) {
  return `<nav class="chips" aria-label="Subject">${[['', 'All']].concat(RG.subjects.map((s) => [s.id, shortName(s)])).map(([id, n]) =>
    `<a href="${base}${id ? '?s=' + id : ''}" aria-current="${(cur || '') === id ? 'page' : 'false'}" style="${sv(id || null)}">${id ? '<i class="dot"></i>' : ''}${esc(n)}</a>`).join('')}</nav>`;
}
function pageHead(title, sub, back) {
  return `<header class="phead">${back ? `<a class="back" href="${back[1]}" data-back>${ic('chevL')}${esc(back[0])}</a>` : ''}<h1>${title}</h1>${sub ? `<p class="muted">${sub}</p>` : ''}</header>`;
}

/* ---------- router ----------
   #/today[/date] · #/week[/monday] · #/subjects[/id[/tab]] · #/topic/id · #/rate · #/practice[/tab]?s=id · #/plan[/tab] · #/settings
   Every navigation is a real history entry, so the browser/phone back button works everywhere. */
let R = { tab: 'today', parts: [], q: {} }, cardsSubj = null;
const TABS = [['today', 'Today', 'today'], ['week', 'Week', 'week'], ['subjects', 'Subjects', 'book'], ['practice', 'Practice', 'layers'], ['plan', 'Plan', 'map']];
const href = (p) => '#/' + p;
function parseHash() {
  let h = location.hash.replace(/^#\/?/, '');
  // links from the old app: #cards, #more, #subjects-<id>
  const legacy = h.match(/^(today|plan|subjects|cards|more|rate)(?:-(.+))?$/);
  if (legacy) h = legacy[1] === 'cards' ? 'practice' : legacy[1] === 'more' ? 'settings' : legacy[2] ? (TOPIC[legacy[2]] ? 'topic/' + legacy[2] : 'subjects/' + legacy[2]) : legacy[1];
  const [p, qs] = h.split('?');
  const parts = p.split('/').filter(Boolean).map(decodeURIComponent);
  const tab = parts.shift() || 'today';
  const q = {}; new URLSearchParams(qs || '').forEach((v, k) => { q[k] = v; });
  R = { tab: ['today', 'week', 'subjects', 'topic', 'rate', 'practice', 'plan', 'settings'].includes(tab) ? tab : 'today', parts, q };
  cardsSubj = SUBJ[q.s] ? q.s : null;
}
function go(p) { const h = href(p); if (location.hash === h) render(); else location.hash = h; }
// in-app back links step back through history when there is somewhere to go back to
const trail = [];
function noteHash() { const h = location.hash; if (trail.length > 1 && trail[trail.length - 2] === h) trail.pop(); else if (trail[trail.length - 1] !== h) trail.push(h); }

function applyTheme() {
  const t = state.settings.theme || 'system';
  const dark = t === 'dark' || (t === 'system' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
}
function topBar() {
  const sk = streak(), nx = nextExam(D.today()), dx = nx ? D.diff(D.today(), nx.date) : null;
  const navTab = R.tab === 'topic' || R.tab === 'rate' ? 'subjects' : R.tab;
  return `<div class="top-in"><a class="brand" href="#/today"><b>GCSE</b><span>2027</span></a>
    <nav class="toptabs" aria-label="Main">${TABS.map(([r, l, i]) => `<a href="#/${r}" aria-current="${navTab === r ? 'page' : 'false'}">${ic(i)}${l}</a>`).join('')}</nav>
    <div class="stats"><a class="stat" href="#/plan/exams" title="Days to your next exam">${ic('trophy')}<span class="num">${dx == null ? '–' : dx}</span><span class="sr">days to your next exam</span></a>
    <span class="stat${sk ? ' hot' : ''}" title="${plural(sk, 'day')} streak">${ic('fire')}<span class="num">${sk}</span><span class="sr">day streak</span></span>
    <span class="stat" title="Total XP">${ic('bolt')}<span class="num">${state.xp || 0}</span><span class="sr">XP</span></span>
    <a class="btn" data-variant="ghost" data-size="icon" href="#/settings" aria-label="Settings" aria-current="${R.tab === 'settings' ? 'page' : 'false'}">${ic('settings')}</a></div></div>`;
}
function render() {
  const v = $('#view'), top = $('#top'), nav = $('#nav');
  if (authPending()) { top.hidden = true; nav.hidden = true; v.innerHTML = '<div class="login"><div class="appmark">27</div><p class="muted">Loading your plan…</p></div>'; return; }
  if (needsLogin()) { top.hidden = true; nav.hidden = true; v.innerHTML = viewLogin(); return; }
  top.hidden = false; nav.hidden = false;
  applyTheme(); // the theme can change when progress syncs in from another device
  top.innerHTML = topBar();
  const navTab = R.tab === 'topic' || R.tab === 'rate' ? 'subjects' : R.tab;
  $$('#nav a').forEach((a) => a.setAttribute('aria-current', a.dataset.r === navTab ? 'page' : 'false'));
  const P = R.parts;
  const map = {
    today: () => viewToday(P[0]), week: () => viewWeek(P[0]), subjects: () => (P[0] && SUBJ[P[0]] ? viewSubject(SUBJ[P[0]], P[1]) : viewSubjects()),
    topic: () => (TOPIC[P[0]] ? viewTopic(TOPIC[P[0]]) : viewSubjects()), rate: viewRate, practice: () => viewPractice(P[0]), plan: () => viewPlan(P[0]), settings: viewSettings,
  };
  v.innerHTML = map[R.tab]();
  updateSync();
  if (R.tab === 'today' && !P[0]) { const cur = $('#view .tl-item.is-now'); if (cur && !render.scrolled) { render.scrolled = true; cur.scrollIntoView({ block: 'center' }); } }
}

/* ---------- login ---------- */
function viewLogin() {
  const standalone = window.navigator.standalone === true;
  return `<div class="login"><div class="appmark">27</div>
    <div><h1>Your GCSE plan</h1><p class="muted">Sign in so your streak, XP and progress follow you between your phone and computer.</p></div>
    <form id="login-form" class="stack" autocomplete="on" novalidate>
      <input class="input" id="login-email" name="email" type="email" autocomplete="username" inputmode="email" placeholder="Email" aria-label="Email" required>
      <input class="input" id="login-pass" name="password" type="password" autocomplete="current-password" minlength="6" placeholder="Password" aria-label="Password" required>
      ${auth.error ? `<p class="small err" role="alert">${esc(auth.error)}</p>` : ''}
      <button class="btn full" type="submit" ${auth.busy ? 'disabled' : ''}>Sign in</button>
      <button class="btn full" data-variant="outline" type="button" data-act="login-signup" ${auth.busy ? 'disabled' : ''}>Create account</button>
      <div class="or">or</div>
      <button class="btn full" data-variant="outline" type="button" data-act="login-google" ${auth.busy ? 'disabled' : ''}>${ic('google')} Continue with Google</button>
      <p class="tiny muted center">${standalone
        ? 'Google not opening here? Sign in with Google on your computer, set a password in Settings, then use it on this phone.'
        : 'Made your account with Google? You can also set a password in Settings to sign in anywhere.'}</p>
      <button class="btn" data-variant="link" type="button" data-act="login-reset">Forgot password?</button>
    </form>
    <button class="btn" data-variant="ghost" data-act="login-skip">Use without an account</button></div>`;
}

/* ---------- today ---------- */
const KIND_META = {
  live: ['Live lesson', 'live'], self: ['Self-study', null], anki: ['Flashcards', 'layers'], cards: ['Flashcards', 'layers'], eve: ['Optional', 'moon'],
  quiz: ['Mixed quiz', 'target'], break: ['Break', 'coffee'], blurt: ['Review', 'pencil'], paper: ['Timed practice', 'doc'], mark: ['Marking', 'pencil'],
  exam: ['Exam', 'trophy'], prep: ['Exam prep', 'target'], rest: ['', 'moon'],
};
const QUIET = new Set(['break', 'rest', 'eve']);
function timeTxt(it) { return it.start ? (/:/.test(it.end || '') ? it.start + '–' + it.end : it.start) : ''; }
function doable(day) { return day.items.filter((it) => !QUIET.has(it.kind)); }
function pickLine(it, d, canStart) {
  const pk = it.pick;
  if (!pk) return canStart && (it.kind === 'self' || it.kind === 'prep' || it.kind === 'paper') ? '<p class="small muted">Every topic for this subject is done or its exams are over.</p>' : '';
  if (pk.pid) {
    const p = PAPER[pk.pid];
    return `<div class="pick"><div class="grow"><p class="pick-t">${esc(p.subj.name)}: ${esc(p.name)}</p><p class="small muted">${esc(p.subj.board + ' ' + p.code)}, ${minsTxt(p.dur)} timed${pk.why && pk.why.length ? '. Picked because it\'s your ' + esc(pk.why[0]) : ''}</p></div>
      ${canStart && it.done == null ? `<button class="btn" data-act="start" data-d="${d}" data-id="${it.id}">Start paper</button>` : ''}</div>`;
  }
  const t = TOPIC[pk.t];
  return `<div class="pick"><div class="grow"><p class="pick-t"><a href="#/topic/${t.id}">${esc(t.n)}</a></p><p class="small muted">${esc(KIND[pk.k].label)}${pk.why && pk.why.length ? '. ' + esc(pk.why.join(', ').replace(/^./, (c) => c.toUpperCase())) : ''}</p></div>
    ${canStart && it.done == null ? `<button class="btn" data-act="start" data-d="${d}" data-id="${it.id}">Start lesson</button>` : ''}</div>`;
}
function itemBody(it, d, seenVid, canStart) {
  let h = '';
  if (it.replaces) h += `<p class="small muted">No online lessons today, so ${esc(it.replaces)} becomes ${esc(SUBJ[it.sid].name)} self-study.</p>`;
  if (it.skipped) h += `<p class="small muted">This replaces ${esc(it.skipped.replace(' (not attending)', ''))}, which you don't attend.</p>`;
  if (it.pickable) h += pickLine(it, d, canStart);
  if (it.desc) h += `<p class="small">${esc(it.desc)}</p>`;
  if (it.how && it.how.length) h += `<ol class="how">${it.how.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`;
  if (it.kind === 'quiz' || it.kind === 'cards') h += `<div class="row"><button class="btn" data-variant="secondary" data-act="review" data-d="${d}" data-id="${it.id}">Review due cards (${dueCards(D.today()).length})</button></div>`;
  if (it.links && it.links.length) h += `<div class="links">${ttLinks(it.links)}</div>`;
  if (it.videos && it.videos.length) {
    if (seenVid.has(it.sid)) h += `<p class="small muted">This week's ${esc(SUBJ[it.sid].name)} videos are in your earlier ${esc(SUBJ[it.sid].name)} period.</p>`;
    else { seenVid.add(it.sid); h += `<p class="label">Watch this week</p>${vidList(it.videos)}`; }
  }
  return h;
}
function doneCtl(it, d) {
  if (QUIET.has(it.kind) || it.kind === 'exam') return '';
  const on = it.done != null;
  return `<button class="tick" data-act="tick" data-d="${d}" data-id="${it.id}" aria-pressed="${on}" aria-label="${on ? 'Done. Tap to undo' : 'Mark as done'}">${ic('check')}</button>`;
}
function tlItem(it, d, ctx) {
  const meta = KIND_META[it.kind] || ['', null], quiet = QUIET.has(it.kind);
  const cls = ['tl-item', 'k-' + it.kind, it.done != null ? 'is-done' : '', ctx.cur === it ? 'is-now' : '', ctx.next === it ? 'is-next' : ''].filter(Boolean).join(' ');
  const badge = it.kind === 'live' ? `<span class="badge" data-variant="outline">${ic('live')}Live</span>` : it.badge ? `<span class="badge" data-variant="secondary">${esc(it.badge)}</span>` : '';
  const head = `<span class="tl-title">${esc(it.title)}</span>${badge}`;
  const sub = it.focus ? `<span class="tl-focus">${esc(it.focus)}</span>` : (meta[0] && !quiet ? `<span class="tl-focus">${esc(meta[0])}</span>` : '');
  const time = `<span class="tl-time num">${esc(it.start || '')}${it.end && /:/.test(it.end) ? `<small>${esc(it.end)}</small>` : ''}</span>`;
  const dot = `<span class="tl-dot" style="${sv(it.sid)}">${it.done != null ? ic('check') : ''}</span>`;
  if (quiet) return `<li class="${cls}">${time}${dot}<div class="tl-body"><div class="tl-head">${head}</div>${it.desc ? `<p class="small muted">${esc(it.desc)}</p>` : ''}</div></li>`;
  const open = ctx.cur === it || ctx.next === it || ctx.openAll;
  return `<li class="${cls}" style="${sv(it.sid)}">${time}${dot}<details class="tl-body"${open ? ' open' : ''}><summary><span class="tl-head">${head}</span>${sub}${ic('chevD', 'tl-chev')}</summary>
    <div class="tl-more">${itemBody(it, d, ctx.seenVid, ctx.canStart)}</div></details>${doneCtl(it, d)}</li>`;
}
function nowCard(day, pos, mins) {
  const { cur, next } = pos, d = day.d;
  const focusItem = cur && !QUIET.has(cur.kind) ? cur : next;
  let h = '';
  if (!cur && !next) {
    const left = doable(day).filter((it) => it.done == null).length;
    return `<section class="now done-day"><p class="now-k">${day.items.length ? 'School day finished' : 'Nothing scheduled'}</p><h2>${left && day.items.length ? plural(left, 'period') + ' not ticked off yet' : day.items.length ? 'Everything ticked off. Good work.' : 'Enjoy the day.'}</h2></section>`;
  }
  if (cur && QUIET.has(cur.kind)) {
    const endM = /:/.test(cur.end || '') ? toMin(cur.end) - mins : null;
    h += `<p class="now-k">${esc(cur.title)}${endM != null ? ', ' + plural(endM, 'minute') + ' left' : ''}</p>`;
  }
  if (!focusItem) return `<section class="now">${h}</section>`;
  const isCur = focusItem === cur, a = toMin(focusItem.start), b = /:/.test(focusItem.end || '') ? toMin(focusItem.end) : a + 45;
  const pct = isCur ? Math.round((mins - a) / (b - a) * 100) : 0;
  const t = focusItem.pick && focusItem.pick.t ? TOPIC[focusItem.pick.t] : null;
  h += `<p class="now-k">${isCur ? 'Now' : 'Next'}, ${esc(timeTxt(focusItem))}${isCur ? '. ' + plural(b - mins, 'minute') + ' left' : focusItem.start ? '. Starts in ' + minsTxt(a - mins) : ''}</p>
    <h2>${focusItem.kind === 'live' ? 'Live: ' : ''}${esc(focusItem.title)}</h2>
    ${t ? `<p class="now-topic">${esc(t.n)}</p>` : focusItem.focus ? `<p class="now-topic">${esc(focusItem.focus)}</p>` : ''}
    ${isCur ? `<div class="now-bar" role="progressbar" aria-label="Period progress" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>` : ''}`;
  const acts = [];
  if (focusItem.pick && focusItem.done == null) acts.push(`<button class="btn" data-act="start" data-d="${d}" data-id="${focusItem.id}">${focusItem.pick.pid ? 'Start paper' : 'Start lesson'}</button>`);
  if (focusItem.kind === 'anki' || focusItem.kind === 'cards' || focusItem.kind === 'quiz') acts.push(`<button class="btn" data-act="review" data-d="${d}" data-id="${focusItem.id}">Review due cards</button>`);
  if (focusItem.kind === 'live') acts.push(`<span class="small muted">${esc(focusItem.how[0])}</span>`);
  return `<section class="now" style="${sv(focusItem.sid)}">${h}${acts.length ? `<div class="row wrap">${acts.join('')}</div>` : ''}</section>`;
}
function viewToday(dParam) {
  const today = D.today(), d = dParam && /^\d{4}-\d{2}-\d{2}$/.test(dParam) ? dParam : today, isToday = d === today;
  const day = dayPlan(d), ph = day.ph, dow = D.dow(d);
  const now = new Date(), mins = now.getHours() * 60 + now.getMinutes();
  const pos = isToday ? nowIn(day, mins) : { cur: null, next: null };
  let h = `<header class="dayhead">
    <a class="btn" data-variant="ghost" data-size="icon" href="#/today/${D.add(d, -1)}" aria-label="Previous day">${ic('chevL')}</a>
    <div class="grow"><h1>${isToday ? 'Today' : esc(D.fmt(d, { weekday: 'long' }))}</h1><p class="muted">${esc(D.fmt(d, { weekday: isToday ? 'long' : undefined, day: 'numeric', month: 'long' }))}. ${esc(ph.name)}${hasWeeks(ph) ? ', week ' + (ph.wk + 1) : ''}</p></div>
    ${isToday ? '' : '<a class="btn" data-variant="outline" data-size="sm" href="#/today">Today</a>'}
    <a class="btn" data-variant="ghost" data-size="icon" href="#/today/${D.add(d, 1)}" aria-label="Next day">${ic('chevR')}</a></header>`;
  // notes
  const notes = [];
  const allT = TOPICS.filter(tierOk), rated = allT.filter((t) => st(t.id).c).length;
  if (isToday && rated < allT.length * 0.6) notes.push(note(`<b>Rate your topics first</b> (${rated} of ${allT.length} done). It takes 5 minutes and tells the planner what you need. <a href="#/rate">Rate topics</a>`, 'info', 'star'));
  if (d < '2026-10-12') notes.push(note('The plan starts on <b>Monday 12 October</b>. Until then, treat this as a trial run of week 1.'));
  if (day.hol) notes.push(note(`<b>${esc(day.hol)}.</b> ${day.half ? 'Mornings only, then the afternoon off.' : 'No online lessons, so those periods are self-study.'}`, 'info', 'moon'));
  const tmr = examsOn(D.add(d, 1));
  if (tmr.length) notes.push(note(`<b>Exam tomorrow:</b> ${tmr.map((p) => esc(p.subj.name + ', ' + p.name)).join('; ')}. Stop by 9:30pm and sleep.`, 'warn', 'alert'));
  const m = state.settings.mocks.find((x) => x.start > d && D.diff(d, x.start) <= 21);
  if (m) notes.push(note(`<b>${esc(m.name)}</b> start ${esc(D.short(m.start))}, ${plural(D.diff(d, m.start), 'day')} away. The dates are estimates, so fix them in <a href="#/settings">Settings</a>.`, 'info', 'week'));
  if (notes.length) h += `<div class="notes">${notes.join('')}</div>`;
  if (!day.items.length) return h + `<section class="now done-day"><h2>${ph.p === 5 ? 'Exams finished' : 'Nothing scheduled'}</h2><p class="muted">${esc(ph.goal || '')}</p></section>`;
  const work = doable(day), doneN = work.filter((it) => it.done != null).length;
  const ctx = { cur: pos.cur, next: pos.next, seenVid: new Set(), canStart: d >= today }; // one seenVid per day: each subject's videos show once
  h += `${isToday ? nowCard(day, pos, mins) : ''}
    ${work.length ? `<div class="dayprog"><span>${doneN} of ${work.length} done</span><div class="bar" role="progressbar" aria-label="Today's progress" aria-valuenow="${doneN}" aria-valuemin="0" aria-valuemax="${work.length}"><i style="width:${Math.round(doneN / work.length * 100)}%"></i></div></div>` : ''}
    <ol class="timeline">${day.items.map((it) => tlItem(it, d, ctx)).join('')}</ol>`;
  const weekday = dow >= 1 && dow <= 5 && !day.hol && (ph.p === 1 || ph.p === 2 || ph.p === 3);
  h += `<div class="dayfoot">${weekday ? `<button class="btn" data-variant="outline" data-size="sm" data-act="nolive" data-d="${d}">${state.noLive[d] ? 'Online lessons are on today' : 'No online lessons today?'}</button>` : ''}
    ${d >= today ? `<button class="btn" data-variant="ghost" data-size="sm" data-act="rebuild" data-d="${d}">Re-pick topics</button>` : ''}</div>
    <details class="explain"><summary>How each period's topic is chosen</summary><ul class="pts">
      <li>The timetable sets the subject for each period, built around your online lessons.</li>
      <li>The topic is this week's focus from the plan first, then whatever is weakest or due for review.</li>
      <li>Your rating after each lesson sets when the topic comes back: tomorrow for "don't know it", weeks later for "exam-ready".</li>
      <li>Close to an exam, that paper's topics jump the queue.</li></ul></details>`;
  return h;
}

/* ---------- week ---------- */
function mondayOf(d) { return D.add(d, -((D.dow(d) + 6) % 7)); }
function weekRow(it) {
  if (QUIET.has(it.kind) && it.kind !== 'rest') return '';
  const label = it.kind === 'live' ? 'Live: ' + it.title.replace(' (online lesson)', '') : it.kind === 'self' ? SUBJ[it.sid].name : it.kind === 'anki' ? 'Anki' : it.kind === 'quiz' ? 'Mixed quiz' : it.kind === 'blurt' ? 'Blurt' : it.title;
  return `<li style="${sv(it.sid)}"><span class="num">${esc(it.start || '')}</span><i class="dot"></i><span>${esc(label)}</span>${it.kind === 'live' ? ic('live', 'xs') : ''}</li>`;
}
function viewWeek(param) {
  const today = D.today(), mon = mondayOf(param && /^\d{4}-\d{2}-\d{2}$/.test(param) ? param : today), ph = ttPhase(mon);
  let h = `<header class="dayhead"><a class="btn" data-variant="ghost" data-size="icon" href="#/week/${D.add(mon, -7)}" aria-label="Previous week">${ic('chevL')}</a>
    <div class="grow"><h1>Week of ${esc(D.fmt(mon, { day: 'numeric', month: 'long' }))}</h1><p class="muted">${esc(ph.name)}${hasWeeks(ph) ? ', week ' + (ph.wk + 1) : ''}</p></div>
    ${mon === mondayOf(today) ? '' : '<a class="btn" data-variant="outline" data-size="sm" href="#/week">This week</a>'}
    <a class="btn" data-variant="ghost" data-size="icon" href="#/week/${D.add(mon, 7)}" aria-label="Next week">${ic('chevR')}</a></header><div class="weekgrid">`;
  for (let k = 0; k < 7; k++) {
    const d = D.add(mon, k), day = ttDay(d), pl = state.plans[d], done = pl ? Object.keys(pl.done).length : 0;
    h += `<a class="wday${d === today ? ' is-today' : ''}" href="#/today/${d}"><div class="wday-h"><b>${esc(D.fmt(d, { weekday: 'short' }))}</b><span class="muted">${esc(D.fmt(d, { day: 'numeric', month: 'short' }))}</span>${day.hol ? `<span class="badge" data-variant="secondary">${esc(day.hol.replace(' holidays', '').replace(' half term', ' half term'))}</span>` : ''}${done ? `<span class="badge" data-variant="outline">${done} done</span>` : ''}</div>
      <ul>${day.items.map(weekRow).join('') || '<li class="muted">Nothing scheduled</li>'}</ul></a>`;
  }
  h += '</div>';
  if (hasWeeks(ph) || ph.p === 'x') {
    h += `<section class="sect"><h2>This week's focus</h2><ul class="focuslist">${TT_ORDER.map((sid) => `<li style="${sv(sid)}"><a href="#/subjects/${sid}/plan"><i class="dot"></i><b>${esc(SUBJ[sid].name)}</b><span>${esc(focusFor(sid, ph))}</span></a></li>`).join('')}</ul></section>`;
    const withVids = TT_ORDER.filter((sid) => videosFor(sid, ph).length);
    if (withVids.length) h += `<section class="sect"><h2>This week's videos</h2>${withVids.map((sid) => `<div class="vgroup" style="${sv(sid)}"><p class="label"><i class="dot"></i>${esc(SUBJ[sid].name)}</p>${vidList(videosFor(sid, ph))}</div>`).join('')}</section>`;
  }
  const sk = TT.SKIPPED;
  if (Object.keys(sk).length) h += `<p class="small muted foot">ELAC periods (Wed, Thu, Fri) are self-study because you don't attend ELAC. If your online timetable changes after half term, the live lessons need updating.</p>`;
  return h;
}

/* ---------- plan ---------- */
function viewPlan(tab) {
  tab = ['road', 'exams', 'method'].includes(tab) ? tab : 'road';
  let h = pageHead('Plan to June 2027', 'The phases, your exam dates and how the revision works.');
  h += seg([['road', 'Roadmap', '#/plan/road'], ['exams', 'Exams', '#/plan/exams'], ['method', 'How to revise', '#/plan/method']], tab, 'Plan view');
  return h + (tab === 'road' ? planRoad() : tab === 'exams' ? planExams() : planMethod());
}
function planRoad() {
  const d = D.today(), cur = ttPhase(d);
  let h = '<ol class="road">';
  for (const p of TT_PHASES) {
    const cls = d > p.end ? 'past' : String(cur.p) === String(p.p) ? 'now' : '';
    const wkTxt = cls === 'now' && hasWeeks(cur) ? `<span class="badge">Week ${cur.wk + 1} of ${p.weeks}</span>` : '';
    h += `<li class="stage ${cls}"><span class="pin">${cls === 'past' ? ic('check') : ''}</span><div><p class="small muted">${esc(D.short(p.start))} to ${esc(D.short(p.end))}</p><h3>${esc(p.name)} ${wkTxt}</h3><p>${esc(p.goal)}</p></div></li>`;
  }
  h += `<li class="stage"><span class="pin"></span><div><p class="small muted">${esc(D.short(RESULTS_DAY))}</p><h3>Results day</h3></div></li></ol>`;
  h += `<section class="sect"><h2>A normal school day</h2><ul class="pts">
    <li><b>08:00</b> Anki warm-up, then 45-minute periods on the online school's bell times until 16:00.</li>
    <li>Live online lessons stay where they are. Every other period is self-study on one subject, with this week's focus, a recipe and videos.</li>
    <li><b>16:00</b> a 20-minute blurt of the whole day. Optional Anki in the evening.</li>
    <li><b>Saturday</b> one timed practice paper (rotating subject), then marking. <b>Sunday</b> off.</li>
    <li>Half terms and the Christmas catch-up week: mornings only. Easter: full days.</li></ul></section>`;
  h += '<section class="sect"><h2>Key dates</h2><ul class="pts">';
  for (const m of state.settings.mocks) h += `<li><b>${esc(m.name)}:</b> ${esc(D.short(m.start))} to ${esc(D.short(m.end))} <span class="muted">(estimate)</span></li>`;
  for (const x of holidayList()) h += `<li><b>${esc(x[2])}:</b> ${esc(D.short(x[0]))}${x[0] !== x[1] ? ' to ' + esc(D.short(x[1])) : ''}</li>`;
  h += `<li><b>Exams:</b> ${esc(D.short(EXAM_START))} to ${esc(D.short(EXAM_END))}. Contingency day ${esc(D.short(CONTINGENCY))}.</li><li><b>Results day:</b> ${esc(D.full(RESULTS_DAY))}</li></ul>
    <p class="small muted">Holiday and mock dates are estimates. Change them in <a href="#/settings">Settings</a> when you know them.</p></section>`;
  return h;
}
function planExams() {
  const d = D.today(), nx = nextExam(d);
  const rows = PAPERS.filter((p) => !p.approx).slice();
  const months = {};
  for (const p of rows) (months[p.date.slice(0, 7)] = months[p.date.slice(0, 7)] || []).push(p);
  let h = `<div class="xrow special" style="${sv('german')}"><div class="xdate"><b>12 Apr</b><span>to 21 May</span></div><div class="grow"><b>German speaking test</b><p class="small muted">Your school picks the day (set to ${esc(D.short(state.settings.speakingDate))}). 10–12 minutes plus 15 minutes' preparation.</p></div></div>`;
  for (const [ym, ps] of Object.entries(months)) {
    h += `<h2 class="month">${esc(D.fmt(ym + '-01', { month: 'long', year: 'numeric' }))}</h2>`;
    for (const p of ps) {
      const dx = D.diff(d, p.date);
      h += `<div class="xrow${p.date < d ? ' gone' : ''}${p === nx ? ' next' : ''}" style="${sv(p.subj.id)}"><div class="xdate"><b>${esc(D.fmt(p.date, { day: 'numeric', month: 'short' }))}</b><span>${esc(D.fmt(p.date, { weekday: 'short' }))} ${p.time === 'am' ? 'morning' : 'afternoon'}</span></div>
        <div class="grow"><b>${esc(p.subj.name)}</b><p class="small">${esc(p.name)}</p><p class="tiny muted">${esc(p.subj.board + ' ' + p.code)}, ${minsTxt(p.dur)}</p></div><span class="left num">${dx > 0 ? dx + ' days' : dx === 0 ? 'Today' : 'Done'}</span></div>`;
    }
  }
  h += `<div class="xrow special"><div class="xdate"><b>${esc(D.fmt(CONTINGENCY, { day: 'numeric', month: 'short' }))}</b><span>Wed</span></div><div class="grow"><b>Contingency day</b><p class="small muted">Keep it free in case an exam is moved.</p></div></div>`;
  h += `<p class="small muted foot">From the AQA provisional and OCR final June 2027 timetables, and the JCQ common slots for Maths (confirmed by Pearson). Morning exams start at 9:00 and afternoon ones at 13:30. Your own candidate timetable from school is the final word. The May half term (31 May to 4 June) falls in the exam gap: use it for Language Paper 2, History Paper 3, Maths Paper 3 and the three Science Paper 2s.</p>`;
  return h;
}
const METHOD = [
  ['Test yourself (retrieval practice)', 'p', 'Pulling information out of memory is what strengthens it. Every period ends with a question, a blurt or flashcards. If a period is only reading or watching, it didn\'t count.'],
  ['Space it out', 'p', 'Revisit a topic after about 1 day, 3 days, 1 week and 3 weeks. Anki and this app do the spacing for you. Your six Anki subject decks hold about 4,100 cards in plan order. German finishes around the end of February, the rest by early January. The Friday quiz pulls topics from 2–3 weeks back on purpose.'],
  ['Mix subjects (interleaving)', 'p', 'No subject runs twice in a row, and in Maths you mix question types. It feels harder, but that difficulty is what improves exam performance.'],
  ['Past papers and mark schemes', 'p', 'The fastest way to learn what examiners reward. Always mark with the official scheme, and copy its exact wording into your flashcards.'],
  ['Blurting', 'ol', ['Pick a topic. Blank page, 5–8 minutes, write everything you remember.', 'Open your notes and fill the gaps in a different colour.', 'The coloured bits are tomorrow\'s flashcards.']],
  ['Mistake log', 'ol', ['One page per subject: the question, why you lost marks, the correct answer.', 'Redo each one 3 days later, then a week later.', 'Two correct redos in a row: cross it off.']],
  ['Your Anki decks', 'ol', ['There is one deck per subject. Click the subject (for example German (AQA 8662)), not a sub-deck, and new cards arrive in the plan\'s order.', 'New cards a day: German 21, Science 6, History 5, Maths 3, English Literature 2, English Language 2. That is about 40 minutes with reviews: the 08:00 warm-up plus 15–20 minutes in the evening.', 'Nothing printed on the exam sheets is in the decks. Every Physics equation is on the 2027 equation sheet, so you learn units and ideas instead. The Maths deck only has formulae that are NOT on the Edexcel sheet.', 'Be honest: press Again if you didn\'t know it. Good is the normal button.', 'Never skip a day. Reviews pile up fast, and missing a day doubles the next one.']],
  ['Working from home', 'ul', ['Same start time every day (08:00), dressed, at a desk, never in bed.', 'Phone in another room during periods. Use it only for flashcards in the warm-up.', 'Lunch outside or at the gym. Exercise helps memory and focus.', 'Sleep 8–9 hours. Memory is consolidated during sleep, so an all-nighter costs marks.']],
  ['If you fall behind', 'ul', ['Don\'t try to catch up by doubling the next day. Skip the missed period and carry on with today.', 'Put the missed topic on Saturday or your weak list.', 'Priority if time is tight: German vocab every day, History content, Science Paper 1 topics, then the rest.']],
];
function planMethod() {
  let h = '<p class="lead">These are the techniques research rates highest for learning a lot, fast, and the plan is built from them. Rereading and highlighting feel productive but work least well, so the plan avoids them.</p><div class="mgrid">';
  for (const [t, kind, body] of METHOD) h += `<section class="panel"><h3>${esc(t)}</h3>${kind === 'p' ? `<p>${esc(body)}</p>` : `<${kind} class="${kind === 'ol' ? 'how' : 'pts'}">${body.map((x) => `<li>${esc(x)}</li>`).join('')}</${kind}>`}</section>`;
  return h + '</div><p class="small muted foot">The ranking comes from Dunlosky et al. (2013), "Improving Students\' Learning With Effective Learning Techniques". Practice testing and distributed practice were the only two rated high utility.</p>';
}

/* ---------- subjects ---------- */
function viewSubjects() {
  let h = pageHead('Subjects', 'Exam boards, papers, every topic and how to revise each one.');
  h += '<div class="sgrid">';
  for (const s of RG.subjects) {
    const a = subjectAvg(s), np = PAPERS.find((p) => p.subj === s && p.date >= D.today() && !p.approx), pct = mastery(s);
    h += `<a class="scard" href="#/subjects/${s.id}" style="${sv(s.id)}"><span class="sicon">${ic(s.id)}</span><div class="grow"><h3>${esc(s.name)}</h3>
      <p class="small muted">${esc(s.board)} ${esc(s.spec)}${s.tierable ? ', ' + (state.settings.tiers[s.id] === 'F' ? 'Foundation' : 'Higher') : ''}</p>
      <div class="bar" aria-hidden="true"><i style="width:${pct}%"></i></div><p class="tiny muted">${a.rated} of ${a.total} topics rated${np ? '. First exam ' + esc(D.short(np.date)) : ''}</p></div>${ic('chevR', 'muted')}</a>`;
  }
  return h + '</div><a class="btn full" data-variant="outline" href="#/rate">Rate all topics</a>';
}
function viewSubject(s, tab) {
  tab = ['overview', 'topics', 'revise', 'plan'].includes(tab) ? tab : 'overview';
  const a = subjectAvg(s);
  let h = `<header class="phead shero" style="${sv(s.id)}"><a class="back" href="#/subjects" data-back>${ic('chevL')}Subjects</a><div class="row"><span class="sicon lg">${ic(s.id)}</span><div><h1>${esc(s.name)}</h1>
    <p class="muted">${esc(s.board)} ${esc(s.spec)}${s.tierable ? ', ' + (state.settings.tiers[s.id] === 'F' ? 'Foundation' : 'Higher') + ' tier' : ''}. ${a.rated} of ${a.total} topics rated${a.avg ? ', average ' + a.avg.toFixed(1) + ' of 5' : ''}.</p></div></div></header>`;
  h += seg([['overview', 'Overview', `#/subjects/${s.id}`], ['topics', 'Topics', `#/subjects/${s.id}/topics`], ['revise', 'How to revise', `#/subjects/${s.id}/revise`], ['plan', 'Weekly plan', `#/subjects/${s.id}/plan`]], tab, s.name + ' sections');
  return h + (tab === 'topics' ? subjTopics(s) : tab === 'revise' ? subjRevise(s) : tab === 'plan' ? subjPlan(s) : subjOverview(s));
}
function list(arr) { return '<ul class="pts">' + arr.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>'; }
function subjOverview(s) {
  const d = D.today(), g = TT.GUIDE[s.id], G = (RG.given || {})[s.id];
  let h = '<section class="sect"><h2>Papers</h2>';
  for (const p of s.papers) h += `<div class="xrow${p.date < d ? ' gone' : ''}" style="${sv(s.id)}"><div class="xdate"><b>${p.approx ? 'Apr–May' : esc(D.fmt(p.date, { day: 'numeric', month: 'short' }))}</b><span>${p.approx ? 'set by school' : esc(D.fmt(p.date, { weekday: 'short' })) + ' ' + (p.time === 'am' ? 'am' : 'pm')}</span></div><div class="grow"><b>${esc(p.name)}</b><p class="tiny muted">${esc(p.code)}${p.dur ? ', ' + minsTxt(p.dur) : ''}</p></div>${p.approx ? '' : `<span class="left num">${p.date >= d ? D.diff(d, p.date) + ' days' : 'Done'}</span>`}</div>`;
  h += '</section>';
  if (g) h += `<section class="sect"><h2>Exam format</h2>${list(g.exam)}</section>`;
  if (G) h += `<section class="sect"><h2>What the exam gives you</h2><div class="given"><div class="panel" data-tone="ok"><h3>Given in the exam</h3>${list(G.given)}</div>
    <div class="panel" data-tone="warn"><h3>Learn this yourself</h3>${list(G.memorise)}</div><div class="panel"><h3>How it's marked</h3>${list(G.marking)}</div></div>
    ${g ? `<details class="explain"><summary>More on exam aids</summary>${list(g.aids)}</details>` : ''}</section>`;
  h += `<section class="sect"><details class="explain"><summary>How it's assessed, in detail</summary>${list(s.structure)}</details></section>`;
  return h;
}
function topicRow(t, d) {
  const x = st(t.id), tt = taught(t, d);
  return `<li class="trow"><div class="row"><a class="tn grow" href="#/topic/${t.id}">${esc(t.n)}</a>${t.h ? '<span class="badge" data-variant="outline">Higher</span>' : ''}</div>
    <p class="tiny muted">${!tt ? `Taught later. <button class="linkbtn" data-unlock="${t.id}">I've covered it</button>` : x.due ? 'Next review ' + esc(D.short(x.due)) : 'Not started'}</p>${rate5(t.id, x.c || 0)}</li>`;
}
function subjTopics(s) {
  const d = D.today(), groups = [];
  for (const p of s.papers) { const ts = visibleTopics(s).filter((t) => t.paperIds.length < s.papers.length && t.paperIds[0] === p.id); if (ts.length) groups.push([p.name, ts]); }
  const all = visibleTopics(s).filter((t) => t.paperIds.length === s.papers.length || !groups.some((g) => g[1].includes(t)));
  if (all.length) groups.push([groups.length ? 'Across all papers' : 'All papers', all]);
  let h = '<p class="small muted">Rate each topic from 1 (don\'t know it) to 5 (exam-ready). The planner uses this to pick your lessons.</p>';
  for (const [name, ts] of groups) h += `<section class="sect"><h2>${esc(name)}</h2><ul class="tlist">${ts.map((t) => topicRow(t, d)).join('')}</ul></section>`;
  return h;
}
function subjRevise(s) {
  const ph = ttPhase(D.today()), use = hasWeeks(ph) ? ph : { p: ph.p === 4 || ph.p === 5 ? 3 : 1 }, r = recipeFor(s.id, use), g = TT.GUIDE[s.id];
  let h = `<section class="sect"><h2>A 45-minute period, ${use.p === 1 ? 'Phase 1' : 'Phase ' + use.p}</h2><ol class="how">${r.how.map((x) => `<li>${esc(x)}</li>`).join('')}</ol><div class="links">${ttLinks(r.ln)}</div></section>`;
  h += `<section class="sect"><h2>Exam tips</h2>${list((g ? g.tips : []).concat(s.technique))}</section>`;
  const seen = new Set(), links = [[`Official ${s.board} ${s.spec} specification`, SPEC_PDF[s.id]]].concat((g ? g.ln : []).filter((k) => k !== 'app' && TT.LINKS[k]).map((k) => TT.LINKS[k]), s.resources)
    .filter((x) => !seen.has(x[1]) && seen.add(x[1]));
  h += `<section class="sect"><h2>Free resources</h2><div class="links col">${links.map((x) => extLink(x[0], x[1])).join('')}${s.id === 'german' ? '<a class="xlink" href="#/practice/decks?s=german">Practice decks in this app</a>' : ''}</div></section>`;
  if (g) {
    const ticks = state.ticks[s.id] || {}, n = g.topics.filter((_, i) => ticks[i]).length;
    h += `<section class="sect"><h2>Spec checklist <span class="muted num small">${n} of ${g.topics.length}</span></h2><p class="small muted">Tick a topic once you can blurt it from memory and score 70% or more on exam questions.</p>
      <ul class="checklist">${g.topics.map((t, i) => `<li><label><input type="checkbox" class="input" data-tick="${s.id}" data-i="${i}" ${ticks[i] ? 'checked' : ''}><span>${esc(t)}</span></label></li>`).join('')}</ul></section>`;
  }
  return h;
}
function subjPlan(s) {
  const cur = ttPhase(D.today());
  let h = '';
  for (const p of [1, 'x', 2, 3]) {
    const P = TT_PH[p], weeks = TT.PLAN[p][s.id];
    h += `<section class="sect"><h2>${esc(P.name)}</h2><ol class="wplan">${weeks.map((f, wk) => {
      const now = String(cur.p) === String(p) && (p === 'x' || cur.wk === wk);
      const when = p === 'x' ? '28 Dec' : D.fmt(weekStartOf(p, wk), { day: 'numeric', month: 'short' });
      return `<li class="${now ? 'is-now' : ''}" style="${sv(s.id)}"><span class="wk"><b>${p === 'x' ? 'Catch-up' : 'Week ' + (wk + 1)}</b><span class="muted">${esc(when)}</span></span><span>${esc(f)}</span></li>`;
    }).join('')}</ol></section>`;
  }
  return h;
}
function topicWeeks(t) {
  const out = [];
  for (const p of [1, 2, 3]) (RG.focus[p][t.subj.id] || []).forEach((_, wk) => { if (focusTopicIds(t.subj.id, { p, wk }).includes(t.id)) out.push((p === 1 ? 'Phase 1' : 'Phase ' + p) + ' week ' + (wk + 1) + ' (' + D.fmt(weekStartOf(p, wk), { day: 'numeric', month: 'short' }) + ')'); });
  return out;
}
function viewTopic(t) {
  const s = t.subj, x = st(t.id), d = D.today(), np = nextPaper(t, d), wks = topicWeeks(t);
  let h = `<header class="phead" style="${sv(s.id)}"><a class="back" href="#/subjects/${s.id}/topics" data-back>${ic('chevL')}${esc(s.name)}</a><p class="small muted">${esc(s.name)}, ${esc(t.paperIds.map((id) => PAPER[id].code).join(', '))}</p><h1>${esc(t.n)}</h1>
    <div class="row wrap">${t.h ? '<span class="badge" data-variant="outline">Higher only</span>' : ''}${confChip(x.c)}${x.due ? '<span class="chip">Next review ' + esc(D.short(x.due)) + '</span>' : ''}${np ? '<span class="chip">Exam ' + esc(D.short(np.date)) + '</span>' : ''}</div></header>`;
  h += `<div class="row wrap"><button class="btn" data-act="revise" data-t="${t.id}">Start a lesson</button>${t.cardIds && t.cardIds.length >= 2 ? `<button class="btn" data-variant="outline" data-act="quiz" data-src="t-${t.id}">${ic('target')}Quiz me</button>` : ''}</div>`;
  h += `<section class="sect"><h2>How confident are you?</h2>${rate5(t.id, x.c || 0)}</section>`;
  h += `<section class="sect"><h2>Key knowledge</h2><ul class="kp">${t.pts.map((p) => '<li>' + esc(p) + '</li>').join('')}</ul>${specLine(t)}</section>`;
  if (t.cards && t.cards.length) h += `<section class="sect"><h2>Flashcards <span class="muted small num">${t.cards.length}</span></h2><p class="small muted">Answer in your head, then tap to check.</p><ul class="fclist">${t.cards.map((c) => `<li><details><summary>${esc(c[0])}</summary><p>${esc(c[1])}</p></details></li>`).join('')}</ul></section>`;
  h += `<section class="sect"><h2>Exam practice</h2><p>${esc(t.ex)}</p><div class="links">${s.resources.map((r) => extLink(r[0], r[1])).join('')}</div></section>`;
  if (wks.length) h += `<section class="sect"><h2>In your plan</h2>${list(wks)}</section>`;
  return h;
}
function viewRate() {
  let h = pageHead('Rate every topic', 'Be honest, it\'s just for you. 1 means you don\'t know it, 3 is okay, 5 is exam-ready.', ['Subjects', '#/subjects']);
  for (const s of RG.subjects) h += `<section class="sect" style="${sv(s.id)}"><h2 class="row"><span class="sicon sm">${ic(s.id)}</span>${esc(s.name)}</h2><ul class="tlist">${visibleTopics(s).map((t) => topicRow(t, D.today())).join('')}</ul></section>`;
  return h + '<a class="btn full" href="#/today">Done, show my day</a>';
}

/* ---------- practice ---------- */
function viewPractice(tab) {
  tab = ['review', 'decks', 'quizzes'].includes(tab) ? tab : 'review';
  const qs = cardsSubj ? '?s=' + cardsSubj : '';
  let h = pageHead('Practice', 'Flashcards, practice decks and quick quizzes, any time.');
  h += seg([['review', 'Review', '#/practice/review' + qs], ['decks', 'Decks', '#/practice/decks' + qs], ['quizzes', 'Quizzes', '#/practice/quizzes' + qs]], tab, 'Practice type');
  h += subjChips(cardsSubj, '#/practice/' + tab);
  return h + (tab === 'decks' ? viewDecks() : tab === 'quizzes' ? viewQuizzes() : viewReview());
}
function viewReview() {
  const d = D.today();
  const due = dueCards(d, cardsSubj), nw = Math.min(newAllowance(d), newCardPool(cardsSubj).length);
  const seen = Object.keys(state.cards).filter((id) => CARD[id] && (!cardsSubj || CARD[id].t.subj.id === cardsSubj));
  const box = [0, 0, 0, 0, 0, 0]; for (const id of seen) box[state.cards[id].b]++;
  const mx = Math.max(1, ...box);
  return `<section class="panel hero-panel"><h2>${due.length ? plural(due.length, 'card') + ' due' : nw ? plural(nw, 'new card') + ' to learn' : 'All caught up'}</h2>
    <p class="muted">Get a card right and it comes back later (1, 3, 7, 14, then 30 days). Miss it and you'll see it tomorrow.</p>
    <div class="row wrap"><button class="btn" data-act="review" ${due.length + nw ? '' : 'disabled'}>Review ${due.length} due and ${nw} new</button><button class="btn" data-variant="outline" data-act="cram" ${newCardPool(cardsSubj).length + seen.length ? '' : 'disabled'}>Quick practice, 20 cards</button></div></section>
    <section class="sect"><h2>Your memory boxes</h2><div class="boxes">${box.map((n, i) => `<div><b class="num">${n}</b><i style="height:${Math.max(4, n / mx * 72)}px"></i><span>Box ${i}</span></div>`).join('')}</div>
    <p class="small muted">${seen.length} cards started, ${newCardPool(cardsSubj).length} still new${cardsSubj === 'german' || !cardsSubj ? '. German vocab comes first' : ''}. Box 5 is long-term memory.</p></section>`;
}

/* ---------- settings ---------- */
function field(label, sub, control) { return `<div class="setrow"><div class="grow"><p class="l">${label}</p>${sub ? `<p class="s">${sub}</p>` : ''}</div>${control}</div>`; }
function viewSettings() {
  const s = state.settings;
  let h = pageHead('Settings', '');
  if (auth.available) {
    h += `<section class="sect"><h2>Account</h2><div class="panel stack">${auth.user
      ? `<div class="row">${ic('user')}<div class="grow"><b>${esc(auth.user.email || 'Google account')}</b><p class="small muted">Progress syncs to every device you sign in on.</p></div></div>${pwSection()}<button class="btn" data-variant="outline" data-act="signout">Sign out</button>`
      : '<p>You\'re not signed in, so progress is saved on this device only.</p><button class="btn" data-act="signin-now">Sign in or create account</button>'}</div></section>`;
  }
  h += `<section class="sect"><h2>Look and sound</h2><div class="panel">
    ${field('Theme', '', `<select class="select" data-theme-pick aria-label="Theme">${[['system', 'Match device'], ['light', 'Light'], ['dark', 'Dark']].map(([v, l]) => `<option value="${v}" ${(s.theme || 'system') === v ? 'selected' : ''}>${l}</option>`).join('')}</select>`)}
    ${field('Sound effects', 'A chime when you get things right', `<input type="checkbox" class="input" role="switch" data-sound ${s.sound !== false ? 'checked' : ''} aria-label="Sound effects">`)}
    ${field('Type German answers', 'In practice decks, type the word instead of flipping', `<input type="checkbox" class="input" role="switch" data-typemode ${typeOn() ? 'checked' : ''} aria-label="Type German answers">`)}</div></section>`;
  h += `<section class="sect"><h2>Tiers</h2><div class="panel">${['maths', 'science', 'german'].map((id) => field(esc(SUBJ[id].name), 'Higher-only topics hide on Foundation',
    `<select class="select" data-tier="${id}" aria-label="${esc(SUBJ[id].name)} tier"><option value="H" ${s.tiers[id] !== 'F' ? 'selected' : ''}>Higher</option><option value="F" ${s.tiers[id] === 'F' ? 'selected' : ''}>Foundation</option></select>`)).join('')}</div></section>`;
  h += `<section class="sect"><h2>Dates</h2><p class="small muted">Mock and holiday dates are estimates. Change them when your online school confirms them.</p><div class="panel">`;
  s.mocks.forEach((m, i) => { h += field(esc(m.name), '', `<span class="daterange"><input class="input" type="date" data-mock="${i}" data-f="start" value="${esc(m.start)}" aria-label="${esc(m.name)} start"><span class="muted">to</span><input class="input" type="date" data-mock="${i}" data-f="end" value="${esc(m.end)}" aria-label="${esc(m.name)} end"></span>`); });
  h += field('German speaking exam', 'Set by your school (April to May)', `<input class="input" type="date" data-speaking value="${esc(s.speakingDate)}" aria-label="German speaking exam date">`);
  holidayList().forEach((x, i) => { h += field(esc(x[2]), 'No online lessons', `<span class="daterange"><input class="input" type="date" data-hol="${i}" data-f="0" value="${esc(x[0])}" aria-label="${esc(x[2])} start"><span class="muted">to</span><input class="input" type="date" data-hol="${i}" data-f="1" value="${esc(x[1])}" aria-label="${esc(x[2])} end"></span>`); });
  h += '</div></section>';
  h += `<section class="sect"><h2>Backup</h2><div class="panel stack"><div id="sync"></div>
    <div class="row wrap"><button class="btn" data-variant="outline" data-size="sm" data-act="export">Copy backup</button><button class="btn" data-variant="outline" data-size="sm" data-act="import">Restore from box</button></div>
    <textarea class="textarea" id="backup" placeholder="Paste a backup here to restore" aria-label="Backup data"></textarea>
    <div class="row wrap"><button class="btn" data-variant="ghost" data-size="sm" data-act="reset">Reset everything…</button><span id="reset-confirm"></span></div></div></section>`;
  h += `<section class="sect"><h2>Sources</h2><ul class="pts small">
    <li>Exam boards and set texts: confirmed by Max (October 2026).</li>
    <li>Content checked against the official specifications: <a href="${SPEC_PDF.maths}" target="_blank" rel="noopener">Edexcel 1MA1</a>, <a href="${SPEC_PDF.science}" target="_blank" rel="noopener">AQA 8464</a>, <a href="${SPEC_PDF.englang}" target="_blank" rel="noopener">AQA 8700</a>, <a href="${SPEC_PDF.englit}" target="_blank" rel="noopener">AQA 8702</a>, <a href="${SPEC_PDF.hist}" target="_blank" rel="noopener">OCR J410</a>, <a href="${SPEC_PDF.german}" target="_blank" rel="noopener">AQA 8662</a>.</li>
    <li>Formula and equation sheets: Ofqual decision for 2025–2027, the AQA June 2027 Physics Equations Sheet and the Pearson 1MA1 exam aid.</li>
    <li>Timetable: the Autumn 1 2026 online timetable. Videos: hand-checked YouTube picks per week.</li>
    <li>Interface built with <a href="https://github.com/hunvreus/basecoat" target="_blank" rel="noopener">Basecoat</a> (MIT) and <a href="https://lucide.dev" target="_blank" rel="noopener">Lucide</a> icons (ISC).</li></ul></section>`;
  return h;
}
function pwSection() {
  const A = window.RGAuth;
  if (!A || !A.providers || !auth.user || !auth.user.email) return '';
  const prov = A.providers();
  if (prov.includes('password')) return `<p class="small muted">Sign in with ${prov.includes('google.com') ? 'Google, or ' : ''}your email and password.</p>`;
  return `<form class="stack" id="pw-form" novalidate><div><b>Set a password</b><p class="small muted">Then sign in on your phone's home-screen app with <b>${esc(auth.user.email)}</b> and this password. Same account, same progress.</p></div>
    <input type="email" autocomplete="username" value="${esc(auth.user.email)}" hidden aria-hidden="true" tabindex="-1">
    <input class="input" id="pw-new" type="password" autocomplete="new-password" minlength="6" placeholder="New password (6+ characters)" aria-label="New password">
    ${auth.pwMsg ? `<p class="small ${auth.pwOk ? 'ok' : 'err'}" role="alert">${esc(auth.pwMsg)}</p>` : ''}
    <button class="btn" type="submit" ${auth.busy ? 'disabled' : ''}>Set password</button></form>`;
}
async function addPassword() {
  const A = window.RGAuth, pw = ($('#pw-new') || {}).value || '';
  auth.pwMsg = ''; auth.pwOk = false;
  if (pw.length < 6) { auth.pwMsg = 'Use a password of at least 6 characters.'; render(); return; }
  auth.busy = true; render();
  try { await A.addPassword(pw); auth.pwOk = true; auth.pwMsg = ''; toast('Password set. Use it on your phone'); }
  catch (e) { auth.pwMsg = AUTH_ERR[e && e.code] || ((e && e.message) || 'Something went wrong. Try again.'); }
  auth.busy = false; render();
}
function updateSync() {
  const el = $('#sync'); if (!el) return;
  const map = {
    synced: ['ok', auth.available ? 'Synced to your account.' : 'Synced to your Claude account.'],
    connecting: ['', 'Connecting…'],
    readonly: ['warn', 'Saved on this device only.'],
    error: ['warn', 'Saved on this device. Sync will retry on your next change.'],
    local: ['', auth.available ? 'Saved on this device only. Sign in to sync.' : 'Saved on this device only.'],
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
  if (opts.id) {
    const it = dayPlan(opts.date).items.find((x) => x.id === opts.id), pk = it && it.pick;
    if (!pk) return;
    b = pk.pid ? { k: 'paper', pid: pk.pid, m: PAPER[pk.pid].dur + 15 } : { k: pk.k, t: pk.t, m: itemMins(it) };
  } else b = { k: kindFor(st(opts.t).c || 0, dayInfo(D.today()).phase.id, 99), t: opts.t, m: 25 };
  sess = { wasActive: activeOn(D.today()), b, opts, steps: KIND[b.k].steps, step: 0, left: b.m * 60, running: false, checks: {}, rating: 0, cardQ: null, score: '', max: '', xp: 0, fb: null, complete: null };
  showOverlay(); renderSession();
}
// an open session is a history entry, so the phone's back button closes it instead of leaving the app
let sessPushed = false;
function showOverlay() {
  $('#session').hidden = false; document.body.style.overflow = 'hidden';
  if (!sessPushed) { try { history.pushState({ sess: 1 }, ''); sessPushed = true; } catch (e) { /* ignore */ } }
  const f = $('#session .x'); if (f) f.focus({ preventScroll: true });
}
// fromPop: the back button already left the entry. keep: another session opens straight away and reuses it.
function closeSession(fromPop, keep) {
  clearInterval(timerInt); timerInt = null; sess = null;
  $('#session').hidden = true; $('#session').innerHTML = ''; document.body.style.overflow = '';
  if (sessPushed && !fromPop && !keep) { sessPushed = false; history.back(); }
  if (fromPop) sessPushed = false;
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
function contBtn(label, dis, cls) { return `<button class="btn full" data-variant="${cls || 'success'}" data-act="next" ${dis ? 'disabled' : ''}>${esc(label || 'Continue')}</button>`; }
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
    body = `${tag}<div class="hero-ill" style="${sv(subj.id)}">${ic('pencil')}</div><h1 style="text-align:center">Exam practice</h1><div class="card stack"><p>${esc(t.ex)}</p><p class="small muted">Use past-paper questions on this topic and mark them with the official mark scheme.</p><div class="wrap-row">${subj.resources.map((r) => `<a class="btn" data-variant="outline" data-size="sm" href="${esc(r[1])}" target="_blank" rel="noopener">${esc(r[0])}</a>`).join('')}</div></div>${note('<b>Tip:</b> ' + esc(subj.technique[0]), 'blue', 'bulb')}`;
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
      <div class="wrap-row">${p.subj.resources.map((r) => `<a class="btn" data-variant="outline" data-size="sm" href="${esc(r[1])}" target="_blank" rel="noopener">${esc(r[0])}</a>`).join('')}</div></div>`;
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
    return `<div class="fb"><div class="badge">${ic(ok ? 'check' : 'x')}</div><div><h2>${esc(s.fb.msg)}</h2><p>${esc(fbSub(ok, q))}</p></div></div><button class="btn full" data-variant="${ok ? 'success' : 'destructive'}" data-act="cont">Continue</button>`;
  }
  if (s.typing) return s.ptype === 'g' ? `<button class="btn full" data-variant="outline" data-act="idk">I don't know</button>` : `<div class="pair"><button class="btn full" data-variant="outline" data-act="idk">Don't know</button><button class="btn full" data-act="check">Check</button></div>`;
  if (!q.flip) return `<button class="btn full" data-act="flip">Show answer</button>`;
  return `<div class="pair"><button class="btn full" data-variant="outline" data-act="grade" data-ok="0">Didn't know</button><button class="btn full" data-variant="success" data-act="grade" data-ok="1">Knew it!</button></div>`;
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
  if (ok) { Sound.correct(); buzz(12); xpFloat(gain, $('#fc') || btn); }
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
    rateTopic(b.t, s.rating, d); if (!s.opts.id) logMinutes(d, TOPIC[b.t].subj.id, b.m); addXP(20);
    const n = TOPIC[b.t].pts.length, got = Object.values(s.checks).filter(Boolean).length;
    stats = [['Recalled', s.steps.includes('check') ? Math.round(got / n * 100) + '%' : s.rating + '/5', 'var(--green)', 'check'], ['Review', D.short(state.topics[b.t].due).replace(/^\w+ /, ''), 'var(--blue)', 'cal']];
  } else {
    const sc = Number(s.score), mx = Number(s.max);
    (state.papersDone[b.pid] = state.papersDone[b.pid] || []).push({ d, sc: isFinite(sc) ? sc : null, mx: isFinite(mx) && mx > 0 ? mx : null });
    for (const id of Object.keys(s.checks)) if (s.checks[id] && TOPIC[id]) state.topics[id] = Object.assign({}, st(id), { c: 2, due: D.add(d, 1) });
    if (!s.opts.id) logMinutes(d, PAPER[b.pid].subj.id, b.m); addXP(50);
    stats = [['Score', isFinite(sc) && isFinite(mx) && mx > 0 ? Math.round(sc / mx * 100) + '%' : '—', 'var(--green)', 'target'], ['To fix', String(Object.values(s.checks).filter(Boolean).length), 'var(--blue)', 'pencil']];
  }
  if (s.opts.id) { const it = dayPlan(s.opts.date).items.find((x) => x.id === s.opts.id); if (it) markItem(s.opts.date, it, b.t ? s.rating : 1); }
  save();
  s.complete = { title: b.t ? 'Session complete!' : 'Paper logged!', stats, streakUp: !wasActive };
  celebrate();
}
function celebrate() { renderSession(); Sound.win(); buzz([30, 50, 30]); }
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
    const subj = opts && opts.id ? null : cardsSubj;
    list = dueCards(d, subj).slice(0, 60).map((c) => c.id).concat(newCardPool(subj).slice(0, newAllowance(d)).map((c) => c.id));
  }
  sess = { wasActive: activeOn(D.today()), b: { k: 'cards', m: 15 }, opts: opts || {}, deck: { list, i: 0, flip: false, right: 0, wrong: 0, again: {} }, mode, left: 15 * 60, running: false, xp: 0, fb: null, complete: null };
  showOverlay(); renderDeck();
}
function renderDeck() {
  const q = sess.deck;
  if (sess.complete) { $('#session').innerHTML = shell(100, completeBody(), sess.mode === 'practice' ? '<div class="pair"><button class="btn full" data-variant="outline" data-act="next">Done</button><button class="btn full" data-variant="success" data-act="again">Practise again</button></div>' : contBtn('Continue')); return; }
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
// a flashcard period counts as done once you've worked through the cards (or there was nothing due)
function markDeckDone() {
  const o = sess && sess.opts; if (!o || !o.id) return;
  const it = dayPlan(o.date).items.find((x) => x.id === o.id);
  if (it && it.done == null) { markItem(o.date, it, 1); save(); }
}
function deckComplete() {
  const q = sess.deck, wasActive = sess.wasActive;
  addXP(5);
  markDeckDone(); save();
  const total = q.right + q.wrong;
  if (sess.mode === 'practice') {
    const st = deckStats(findDeck(sess.pdeck));
    sess.complete = { title: 'Round complete!', stats: [['First try', q.right + '/' + new Set(q.list).size, 'var(--green)', 'check'], ['Mastered', st.mastered + '/' + st.total, 'var(--blue)', 'star']], streakUp: !wasActive };
    renderDeck(); Sound.win(); buzz([30, 50, 30]); return;
  }
  sess.complete = { title: 'Deck complete!', stats: [['Correct', String(q.right), 'var(--green)', 'check'], ['Accuracy', total ? Math.round(q.right / total * 100) + '%' : '—', 'var(--blue)', 'target']], streakUp: !wasActive };
  renderDeck(); Sound.win(); buzz([30, 50, 30]);
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
  const tog = decks.some((dk) => dk.type) ? `<div class="panel">${field('Type German answers', 'Type the word instead of flipping, or tap der/die/das for genders. Small typos are OK.', `<input type="checkbox" class="input" role="switch" data-typemode ${typeOn() ? 'checked' : ''} aria-label="Type German answers">`)}</div>` : '';
  return `<p class="small muted">Always open, so replay them as often as you like. Get a card right 3 times in a row to master it.</p>${tog}<div class="decks">${decks.map((dk) => {
    const st = deckStats(dk), pct = st.total ? Math.round(st.mastered / st.total * 100) : 0;
    return `<button class="deck" data-act="practice" data-deck="${esc(dk.id)}" style="${sv(dk.sid)}"><span class="deck-ic">${ic(dk.sid)}</span><span class="deck-tx"><b>${esc(dk.name)}</b><span class="tiny">${esc(dk.desc)}</span>
      <span class="deck-bar"><i style="width:${pct}%"></i></span><span class="tiny num">${st.mastered} / ${st.total} mastered${dk.type && typeOn() ? ' · ' + (dk.type === 'g' ? 'tap der/die/das' : 'type answers') : ''}</span></span></button>`;
  }).join('')}</div>`;
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
  if (!f) return `<button class="btn full" data-variant="outline" disabled>Tap an answer</button>`;
  return `<div class="fb"><div class="badge">${ic(f.ok ? 'check' : 'x')}</div><div><h2>${esc(f.msg)}</h2><p>${f.ok ? '+2 XP' : 'Answer: ' + esc(q.ans) + ' · added to your practice pile'}</p></div></div><button class="btn full" data-variant="${f.ok ? 'success' : 'destructive'}" data-act="qnext">${z.i + 1 < z.qs.length ? 'Continue' : 'See your score'}</button>`;
}
function renderQuiz() {
  const z = sess.quiz;
  if (sess.complete) { $('#session').innerHTML = shell(100, completeBody(), '<div class="pair"><button class="btn full" data-variant="outline" data-act="next">Done</button><button class="btn full" data-variant="success" data-act="qagain">New quiz</button></div>'); return; }
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
  if (ok) { Sound.correct(); buzz(12); xpFloat(2, el); }
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
  renderQuiz(); Sound.win(); buzz([30, 50, 30]);
}
function viewQuizzes() {
  const L = quizList();
  let h = `<p class="small muted">10 multiple-choice questions from your revision cards. Anything you miss goes back into your practice decks.</p>`;
  h += `<div class="decks">${L.map((q) => {
    const r = (state.quiz || {})[q.id], of = Math.min(QUIZ_N, q.n), pct = r ? Math.round(r.best / (r.of || of) * 100) : 0;
    return `<button class="deck" data-act="quiz" data-src="${esc(q.id)}" style="${sv(q.sid)}"><span class="deck-ic">${ic(q.sid)}</span><span class="deck-tx"><b>${esc(q.name)}</b><span class="tiny">${esc(q.desc)}</span>
      <span class="deck-bar"><i style="width:${pct}%"></i></span><span class="tiny num">${r ? 'Best ' + r.best + '/' + (r.of || of) + ' · played ' + plural(r.n, 'time') : q.n + ' questions to draw from'}</span></span><span class="qgo">${r ? r.best + '/' + (r.of || of) : 'Go'}</span></button>`;
  }).join('')}</div>`;
  return h;
}


/* ---------- leaving a lesson part-way ---------- */
function midLesson() { return !!(sess && !sess.complete && sess.steps && sess.step > 0); }
function requestClose() {
  if (!sess) return;
  if (midLesson()) {
    setFoot(`<p class="leave-q">Leave this lesson? Your progress in it won't be saved.</p><div class="pair"><button class="btn" data-variant="outline" data-act="stay">Keep going</button><button class="btn" data-variant="destructive" data-act="leave">Leave</button></div>`);
    return;
  }
  if (sess.deck && !sess.complete && sess.deck.i > 0) markDeckDone();
  closeSession();
}
// the phone/browser back button closes an open session (asking first if you're part-way through a lesson)
window.addEventListener('popstate', () => {
  if (!sess) return;
  if (midLesson()) { try { history.pushState({ sess: 1 }, ''); } catch (e) { /* ignore */ } requestClose(); return; }
  sessPushed = false;
  if (sess.deck && !sess.complete && sess.deck.i > 0) markDeckDone();
  closeSession(true);
});

/* ---------- events ---------- */
document.addEventListener('click', (e) => {
  const back = e.target.closest('[data-back]');
  if (back && trail.length > 1) { e.preventDefault(); history.back(); return; }
  const el = e.target.closest('[data-act],[data-rate],[data-unlock],[data-chk],[data-weak]');
  if (!el) return;
  if (el.dataset.rate) {
    quickRate(el.dataset.rate, Number(el.dataset.r)); save(); Sound.tick();
    $$('button', el.parentElement).forEach((b) => b.setAttribute('aria-pressed', b === el ? 'true' : 'false'));
    return;
  }
  if (el.dataset.unlock) { state.unlocked[el.dataset.unlock] = true; save(); render(); toast('Added to your plan'); return; }
  if (el.dataset.chk != null) {
    const on = el.getAttribute('aria-pressed') !== 'true'; sess.checks[el.dataset.chk] = on; el.setAttribute('aria-pressed', on);
    if (on) { Sound.tick(); buzz(8); }
    const cnt = $('#counter'); if (cnt) cnt.textContent = Object.values(sess.checks).filter(Boolean).length + ' / ' + TOPIC[sess.b.t].pts.length;
    return;
  }
  if (el.dataset.weak) { const on = el.getAttribute('aria-pressed') !== 'true'; sess.checks[el.dataset.weak] = on; el.setAttribute('aria-pressed', on); if (on) Sound.tick(); return; }
  const a = el.dataset.act;
  switch (a) {
    case 'tick': {
      const d = el.dataset.d, it = dayPlan(d).items.find((x) => x.id === el.dataset.id); if (!it) break;
      const on = it.done == null;
      markItem(d, it, on ? 1 : null);
      if (on) { addXP(5); Sound.tick(); }
      save(); render();
      if (on) xpFloat(5, $(`[data-act="tick"][data-id="${it.id}"]`));
      break;
    }
    case 'start': openSession({ date: el.dataset.d, id: el.dataset.id }); break;
    case 'revise': openSession({ t: el.dataset.t }); break;
    case 'review': startCards('review', el.dataset.id ? { date: el.dataset.d, id: el.dataset.id } : undefined); break;
    case 'rebuild': rebuildPlan(el.dataset.d); save(); render(); toast('Topics re-picked from your latest ratings'); break;
    case 'nolive': {
      const d = el.dataset.d;
      if (state.noLive[d]) delete state.noLive[d]; else state.noLive[d] = true;
      save(); render(); toast(state.noLive[d] ? 'Live lessons swapped for self-study' : 'Live lessons are back on');
      break;
    }
    case 'close': requestClose(); break;
    case 'stay': if (sess && sess.steps) renderSession(); break;
    case 'leave': closeSession(); break;
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
    case 'cram': startCards('cram'); break;
    case 'practice': startPractice(el.dataset.deck); break;
    case 'quiz': startQuiz(el.dataset.src); break;
    case 'qpick': pickQuiz(Number(el.dataset.i)); break;
    case 'qnext': nextQuiz(); break;
    case 'qagain': { const id = sess && sess.quiz && sess.quiz.src; closeSession(false, true); if (id) startQuiz(id); break; }
    case 'check': checkTyped(($('#ans') || {}).value || ''); break;
    case 'idk': checkTyped('', true); break;
    case 'gpick': checkTyped(el.dataset.g); break;
    case 'override': overrideRight(); break;
    case 'uml': {
      const i = $('#ans'); if (!i || i.readOnly) break;
      const a0 = i.selectionStart == null ? i.value.length : i.selectionStart, b0 = i.selectionEnd == null ? a0 : i.selectionEnd;
      i.value = i.value.slice(0, a0) + el.dataset.ch + i.value.slice(b0); i.focus(); i.setSelectionRange(a0 + 1, a0 + 1); break;
    }
    case 'again': { const id = sess && sess.pdeck; closeSession(false, true); if (id) startPractice(id); break; }
    case 'export': {
      const txt = JSON.stringify(state), ta = $('#backup'); ta.value = txt;
      try { navigator.clipboard.writeText(txt).then(() => toast('Backup copied'), () => { ta.select(); toast('Select all and copy the box'); }); } catch (err) { ta.select(); toast('Select all and copy the box'); }
      break;
    }
    case 'import': {
      try { const obj = JSON.parse($('#backup').value); if (!obj || !obj.settings) throw new Error('bad'); state = migrate(obj); applySettings(); applyTheme(); save(); render(); toast('Progress restored'); }
      catch (err) { toast('That doesn\'t look like a backup. Paste the whole text'); }
      break;
    }
    case 'reset': $('#reset-confirm').innerHTML = '<button class="btn" data-variant="destructive" data-size="sm" data-act="reset-yes">Yes, delete everything</button>'; break;
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
  if (el.dataset.themePick != null) { state.settings.theme = el.value; applyTheme(); save(); return; }
  if (el.dataset.typemode != null) { state.settings.typeMode = el.checked; save(); render(); return; }
  if (el.dataset.sound != null) { state.settings.sound = el.checked; save(); if (el.checked) Sound.correct(); return; }
  if (el.dataset.tick) { const t = state.ticks[el.dataset.tick] || (state.ticks[el.dataset.tick] = {}); t[el.dataset.i] = el.checked; save(); render(); return; }
  if (el.dataset.tier) { state.settings.tiers[el.dataset.tier] = el.value; afterSettings(); }
  else if (el.dataset.mock != null) { const m = state.settings.mocks[Number(el.dataset.mock)]; if (el.value) m[el.dataset.f] = el.value; if (m.end < m.start) m.end = m.start; afterSettings(); }
  else if (el.dataset.speaking != null) { if (el.value) state.settings.speakingDate = el.value; applySettings(); afterSettings(); }
  else if (el.dataset.hol != null) {
    const L = holidayList().map((x) => x.slice()), row = L[Number(el.dataset.hol)];
    if (el.value) row[Number(el.dataset.f)] = el.value;
    if (row[1] < row[0]) row[1] = row[0];
    state.settings.holidays = L; afterSettings();
  }
});
function afterSettings() { rebuildPlan(D.today()); save(); toast('Plan updated'); render(); }
document.addEventListener('keydown', (e) => {
  if (!sess) return;
  if (e.key === 'Escape') { requestClose(); return; }
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
window.addEventListener('hashchange', () => {
  parseHash(); noteHash();
  if (sess) { sessPushed = false; closeSession(true); }
  render.scrolled = false; window.scrollTo(0, 0); render();
});

/* ---------- boot ---------- */
// once a minute: keep the Now card current without collapsing anything you've opened
function refreshNow() {
  if (R.tab !== 'today' || R.parts[0] || sess) return;
  const day = dayPlan(D.today()), t = new Date(), mins = t.getHours() * 60 + t.getMinutes(), pos = nowIn(day, mins);
  const key = (pos.cur && pos.cur.id) + '|' + (pos.next && pos.next.id);
  if (key !== refreshNow.key) { refreshNow.key = key; render(); return; }
  const el = $('#view .now'); if (el) el.outerHTML = nowCard(day, pos, mins);
}
function boot() {
  if (typeof state.xp !== 'number') state.xp = 0;
  applyTheme();
  if (window.matchMedia) { const mq = matchMedia('(prefers-color-scheme: dark)'); if (mq.addEventListener) mq.addEventListener('change', applyTheme); }
  $('#nav').innerHTML = '<div class="nav-in">' + TABS.map(([r, l, i]) => `<a href="#/${r}" data-r="${r}">${ic(i)}<span>${l}</span></a>`).join('') + '</div>';
  parseHash(); noteHash(); render();
  initClaudeCloud();
  initFirebaseAuth();
  window.addEventListener('rgauth-ready', () => { initFirebaseAuth(); render(); });
  let day = D.today();
  setInterval(() => { if (sess) return; if (D.today() !== day) { day = D.today(); render(); } else refreshNow(); }, 60000);
}
boot();
