/* Deutsch Master — lógica de la app.
   Seguridad: todo el DOM se construye con createElement/textContent (nunca innerHTML),
   los datos solo viven en este dispositivo (localStorage) y toda importación se valida. */
'use strict';
(function () {
  if (typeof DATA === 'undefined') { document.body.textContent = 'Error cargando los datos de la app.'; return; }

  /* =========================================================
     UTILIDADES
     ========================================================= */
  const VERSION = '1.0.0';
  const $ = (s, r = document) => r.querySelector(s);
  const SVGNS = 'http://www.w3.org/2000/svg';
  const DAY = 864e5;
  const ARTS = ['der', 'die', 'das'];
  const TYPES = { n: 'Sustantivo', v: 'Verbo', a: 'Adjetivo', x: 'Otro' };
  const TYPE_SHORT = { n: 'Sust.', v: 'Verbo', a: 'Adj.', x: 'Otro' };
  const INTERVALS = [0, 1, 3, 7, 14, 30];             // días por caja Leitner (0 = nueva)
  const BOX_LABEL = ['Nuevas', 'Caja 1', 'Caja 2', 'Caja 3', 'Caja 4', 'Dominadas'];
  const LIMITS = { str: 120, ex: 400, tags: 10, tag: 30, words: 20000, file: 5 * 1024 * 1024 };
  const CASES = { A: 'Akkusativ', D: 'Dativ', W: 'Wechsel (Akk/Dat)', G: 'Genitiv' };
  const CASE_SHORT = { A: 'Akk', D: 'Dat', W: 'Akk/Dat', G: 'Gen' };

  const ICONS = {
    home: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',
    book: 'M4 5a2 2 0 0 1 2-2h12v15H6a2 2 0 0 0-2 2zM4 20a2 2 0 0 0 2 2h12v-4',
    target: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8M12 11.5v1',
    layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5',
    gear: 'M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1',
    speaker: 'M4 9v6h4l5 4V5L8 9zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12',
    edit: 'M4 20h4L19 9l-4-4L4 16zM14 6l4 4',
    trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
    x: 'M6 6l12 12M18 6L6 18',
    plus: 'M12 5v14M5 12h14'
  };

  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else if (k === 'value') el.value = v;
        else if (k === 'checked') el.checked = !!v;
        else if (k === 'style') continue;               // nunca estilos en línea (CSP)
        else el.setAttribute(k, v === true ? '' : String(v));
      }
    }
    add(el, kids);
    return el;
  }
  function add(el, kids) {
    for (const c of [kids].flat(Infinity)) {
      if (c == null || c === false) continue;
      el.append(c instanceof Node ? c : String(c));
    }
    return el;
  }
  function fill(el, ...kids) { el.replaceChildren(); return add(el, kids); }
  function icon(name, cls) {
    const s = document.createElementNS(SVGNS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('class', 'ico' + (cls ? ' ' + cls : ''));
    s.setAttribute('aria-hidden', 'true');
    const p = document.createElementNS(SVGNS, 'path');
    p.setAttribute('d', ICONS[name]);
    s.append(p);
    return s;
  }
  // Texto con **negrita** y *cursiva* (solo para contenido estático de la app)
  function rich(text) {
    const out = [];
    const re = /\*\*([^*]+)\*\*|\*((?:[^*]|\*\*[^*]+\*\*)+?)\*(?!\*)/g;
    let last = 0, m;
    text = String(text);
    while ((m = re.exec(text))) {
      if (m.index > last) out.push(text.slice(last, m.index));
      if (m[1] != null) out.push(h('strong', null, m[1]));
      else out.push(h('em', null, rich(m[2])));
      last = re.lastIndex;
    }
    if (last < text.length) out.push(text.slice(last));
    return out;
  }
  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = randInt(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function randInt(n) {
    const b = new Uint32Array(1); crypto.getRandomValues(b); return b[0] % n;
  }
  function uid() {
    const b = new Uint8Array(8); crypto.getRandomValues(b);
    return Array.from(b, x => x.toString(16).padStart(2, '0')).join('').slice(0, 14);
  }
  // Limpia texto: sin caracteres de control ni de dirección (bidi), espacios normalizados, longitud máxima
  function clean(s, max) {
    return String(s == null ? '' : s).normalize('NFC')
      .replace(/[\u0000-\u001F\u007F-\u009F​-‏‪-‮⁠-⁩﻿]/g, ' ')
      .replace(/\s+/g, ' ').trim().slice(0, max);
  }
  const num = (v, d) => (typeof v === 'number' && Number.isFinite(v)) ? v : d;
  const clampInt = (v, lo, hi) => Math.min(hi, Math.max(lo, Math.round(num(v, lo))));
  const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };
  const endOfToday = () => startOfToday() + DAY - 1;
  const dayKey = (t = Date.now()) => { const d = new Date(t); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const fold = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const translit = s => String(s).toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  const pct = (a, b) => b ? Math.round(100 * a / b) : 0;
  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 3;
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  const nounLabel = w => w.type === 'n' ? w.art + ' ' + w.de : w.de;
  const plLabel = w => !w.pl ? '' : (w.pl === '–' ? 'sin plural' : 'die ' + w.pl);
  function artSpan(art, extra) { return h('span', { class: 'art a-' + art + (extra ? ' ' + extra : '') }, art); }
  function wordNode(w) {
    return h('span', { class: 'wd' }, w.type === 'n' ? [artSpan(w.art), ' '] : null, h('span', { class: w.type === 'n' ? 'g-' + w.art : '' }, w.de));
  }

  /* =========================================================
     ESTADO Y ALMACENAMIENTO (solo local)
     ========================================================= */
  const KEY = 'deutschmaster.v1';
  function defaults() {
    return {
      v: 1, words: [], days: {}, verbStats: {},
      settings: {
        autoSpeak: true, rate: 0.9, voice: '', lastBackup: 0,
        vocab: { dir: 'mix', mode: 'type', source: 'due', types: ['n', 'v', 'a', 'x'], tag: '', count: 20, askG: true, askP: true },
        verbs: { count: 15, source: 'all', pres: false }
      }
    };
  }
  function sanitizeWord(o, keepProgress) {
    if (!o || typeof o !== 'object' || Array.isArray(o)) return null;
    let type = ['n', 'v', 'a', 'x'].includes(o.type) ? o.type : (ARTS.includes(o.art) ? 'n' : 'x');
    const art = ARTS.includes(o.art) ? o.art : '';
    if (type === 'n' && !art) type = 'x';
    const de = clean(o.de, LIMITS.str), es = clean(o.es, LIMITS.str);
    if (!de || !es) return null;
    const tags = Array.isArray(o.tags) ? [...new Set(o.tags.map(t => clean(t, LIMITS.tag)).filter(Boolean))].slice(0, LIMITS.tags) : [];
    const w = {
      id: (typeof o.id === 'string' && /^[a-z0-9]{6,24}$/.test(o.id)) ? o.id : uid(),
      type, art: type === 'n' ? art : '', de, pl: type === 'n' ? clean(o.pl, LIMITS.str) : '', es,
      ex: clean(o.ex, LIMITS.ex), tags, created: clampInt(o.created || Date.now(), 0, 9e15),
      box: 0, due: 0, seen: 0, ok: 0, ko: 0, gOk: 0, gKo: 0
    };
    if (keepProgress) {
      w.box = clampInt(o.box, 0, 5); w.due = clampInt(o.due, 0, 9e15);
      for (const k of ['seen', 'ok', 'ko', 'gOk', 'gKo']) w[k] = clampInt(o[k], 0, 1e7);
    }
    return w;
  }
  function sanitizeState(d) {
    const s = defaults();
    if (!d || typeof d !== 'object') return s;
    const seen = new Set();
    if (Array.isArray(d.words)) {
      for (const o of d.words.slice(0, LIMITS.words)) {
        const w = sanitizeWord(o, true);
        if (!w || seen.has(w.id)) continue;
        seen.add(w.id); s.words.push(w);
      }
    }
    if (d.days && typeof d.days === 'object') {
      for (const k of Object.keys(d.days).slice(-3700)) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(k)) continue;
        const v = d.days[k] || {};
        s.days[k] = { n: clampInt(v.n, 0, 1e6), ok: clampInt(v.ok, 0, 1e6) };
      }
    }
    if (d.verbStats && typeof d.verbStats === 'object') {
      const valid = new Set(DATA.verbs.map(v => v.inf));
      for (const k of Object.keys(d.verbStats)) if (valid.has(k)) {
        const v = d.verbStats[k] || {};
        s.verbStats[k] = { ok: clampInt(v.ok, 0, 1e6), ko: clampInt(v.ko, 0, 1e6) };
      }
    }
    const st = d.settings || {};
    s.settings.autoSpeak = st.autoSpeak !== false;
    s.settings.rate = Math.min(1.3, Math.max(0.5, num(st.rate, 0.9)));
    s.settings.voice = clean(st.voice, 200);
    s.settings.lastBackup = clampInt(st.lastBackup, 0, 9e15);
    const v = st.vocab || {};
    const sv = s.settings.vocab;
    if (['es', 'de', 'mix'].includes(v.dir)) sv.dir = v.dir;
    if (['type', 'mc'].includes(v.mode)) sv.mode = v.mode;
    if (['due', 'all', 'new', 'hard'].includes(v.source)) sv.source = v.source;
    if (Array.isArray(v.types)) { const t = v.types.filter(x => TYPES[x]); if (t.length) sv.types = t; }
    sv.tag = clean(v.tag, LIMITS.tag);
    if ([10, 20, 30, 50, 0].includes(v.count)) sv.count = v.count;
    sv.askG = v.askG !== false; sv.askP = v.askP !== false;
    const vb = st.verbs || {};
    if ([10, 15, 25, 0].includes(vb.count)) s.settings.verbs.count = vb.count;
    if (['all', 'hard', 'sep'].includes(vb.source)) s.settings.verbs.source = vb.source;
    s.settings.verbs.pres = !!vb.pres;
    return s;
  }
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      return sanitizeState(JSON.parse(raw));
    } catch (e) { console.warn('No se pudo leer el almacenamiento', e); return defaults(); }
  }
  let S = load();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); return true; }
    catch (e) { toast('No se pudo guardar (almacenamiento lleno o bloqueado)', 'err'); return false; }
  }
  const wkey = w => w.type + '|' + (w.art || '') + '|' + w.de.toLowerCase();
  function logAnswer(ok) {
    const k = dayKey();
    const d = S.days[k] || (S.days[k] = { n: 0, ok: 0 });
    d.n++; if (ok) d.ok++;
  }
  function streak() {
    let n = 0, t = Date.now();
    if (!S.days[dayKey(t)]) t -= DAY;        // si hoy aún no has practicado, cuenta desde ayer
    while (S.days[dayKey(t)] && S.days[dayKey(t)].n > 0) { n++; t -= DAY; }
    return n;
  }
  const isDue = w => w.due <= endOfToday();
  function promote(w, ok) {
    w.seen++;
    if (ok) { w.ok++; w.box = Math.min(5, w.box + 1); w.due = startOfToday() + INTERVALS[w.box] * DAY; }
    else { w.ko++; w.box = 1; w.due = startOfToday(); }
  }
  function allTags() { return [...new Set(S.words.flatMap(w => w.tags))].sort((a, b) => a.localeCompare(b, 'de')); }

  /* =========================================================
     VOZ (síntesis local del dispositivo, sin conexión)
     ========================================================= */
  const hasTTS = 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
  let voices = [];
  function loadVoices() { if (hasTTS) voices = speechSynthesis.getVoices().filter(v => /^de(-|_|$)/i.test(v.lang)); }
  if (hasTTS) { loadVoices(); speechSynthesis.addEventListener?.('voiceschanged', loadVoices); }
  function speak(text) {
    if (!hasTTS) { toast('La voz no está disponible en este navegador'); return; }
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text).slice(0, 300));
      u.lang = 'de-DE';
      const v = voices.find(x => x.voiceURI === S.settings.voice) || voices.find(x => /de-DE/i.test(x.lang)) || voices[0];
      if (v) u.voice = v;
      u.rate = S.settings.rate;
      speechSynthesis.speak(u);
    } catch (e) { /* sin voz */ }
  }
  const speakWord = w => speak(w.type === 'n' ? w.art + ' ' + w.de : w.de);
  function speakBtn(textFn, label) {
    return h('button', { class: 'icon-btn', type: 'button', title: 'Escuchar', 'aria-label': label || 'Escuchar', onclick: e => { e.stopPropagation(); speak(typeof textFn === 'function' ? textFn() : textFn); } }, icon('speaker'));
  }

  /* =========================================================
     UI GENERAL: navegación, avisos, diálogos
     ========================================================= */
  const VIEWS = {
    home: { label: 'Inicio', icon: 'home', render: renderHome },
    words: { label: 'Vocabulario', icon: 'book', render: renderWords },
    practice: { label: 'Práctica', icon: 'target', render: renderPractice },
    grammar: { label: 'Gramática', icon: 'layers', render: renderGrammar },
    settings: { label: 'Ajustes', icon: 'gear', render: renderSettings }
  };
  let route = { view: 'home', sub: null };
  let game = null;
  let keyHandler = null;

  function setKeys(fn) {
    if (keyHandler) document.removeEventListener('keydown', keyHandler);
    keyHandler = fn;
    if (fn) document.addEventListener('keydown', fn);
  }
  function go(view, sub) {
    route = { view, sub: sub == null ? null : sub };
    render();
    window.scrollTo(0, 0);
  }
  function render() {
    setKeys(null);
    if (hasTTS) speechSynthesis.cancel();
    renderNav();
    const main = $('#main');
    fill(main, VIEWS[route.view].render());
  }
  function renderNav() {
    const nav = $('#nav');
    fill(nav, 
      h('div', { class: 'brand' }, h('span', { class: 'brand-mark' }, 'D'), h('span', { class: 'brand-txt' }, 'Deutsch', h('small', null, 'Master'))),
      ...Object.entries(VIEWS).map(([k, v]) => h('button', {
        class: 'nav-btn' + (route.view === k ? ' active' : ''), type: 'button', 'aria-current': route.view === k ? 'page' : null,
        onclick: () => go(k)
      }, icon(v.icon), h('span', null, v.label)))
    );
  }
  function toast(msg, kind) {
    const t = $('#toast');
    t.textContent = msg;
    t.className = 'show' + (kind ? ' ' + kind : '');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { t.className = ''; }, 2800);
  }
  function dialog(title, text, buttons) {
    return new Promise(res => {
      const close = v => { ov.remove(); document.removeEventListener('keydown', onKey, true); res(v); };
      const onKey = e => { if (e.key === 'Escape') { e.stopPropagation(); close(null); } };
      const ov = h('div', { class: 'overlay', onclick: e => { if (e.target === ov) close(null); } },
        h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
          h('h3', null, title), text ? h('p', null, text) : null,
          h('div', { class: 'row end wrap' }, buttons.map(b => h('button', { class: 'btn ' + (b.cls || ''), type: 'button', onclick: () => close(b.value) }, b.label)))));
      document.body.append(ov);
      document.addEventListener('keydown', onKey, true);
      ov.querySelector('.modal .btn:last-child')?.focus();
    });
  }
  const confirmDlg = (title, text, okLabel, danger) =>
    dialog(title, text, [{ label: 'Cancelar', value: false }, { label: okLabel || 'Aceptar', value: true, cls: danger ? 'danger' : 'primary' }]).then(v => v === true);

  function seg(options, value, onChange, cls) {
    const wrap = h('div', { class: 'seg' + (cls ? ' ' + cls : ''), role: 'group' });
    const btns = options.map(o => h('button', {
      type: 'button', class: (o.cls || '') + (o.value === value ? ' on' : ''), 'aria-pressed': String(o.value === value),
      onclick: () => { btns.forEach(b => { b.classList.remove('on'); b.setAttribute('aria-pressed', 'false'); }); btn(o).classList.add('on'); btn(o).setAttribute('aria-pressed', 'true'); onChange(o.value); }
    }, o.label));
    const btn = o => btns[options.indexOf(o)];
    add(wrap, btns);
    return wrap;
  }
  function toggle(label, checked, onChange, hint) {
    const inp = h('input', { type: 'checkbox', checked, onchange: e => onChange(e.target.checked) });
    return h('label', { class: 'toggle' }, inp, h('span', { class: 'sw' }), h('span', { class: 'tl' }, label, hint ? h('small', null, hint) : null));
  }
  function field(label, control, hint) {
    const tag = /^(INPUT|TEXTAREA|SELECT)$/.test(control.tagName) ? 'label' : 'div';
    return h(tag, { class: 'field' }, h('span', { class: 'fl' }, label), control, hint ? h('span', { class: 'hint' }, hint) : null);
  }
  function textInput(attrs) {
    return h('input', Object.assign({ type: 'text', autocomplete: 'off', autocorrect: 'off', autocapitalize: 'off', spellcheck: 'false', maxlength: LIMITS.str }, attrs));
  }

  // Barra de umlauts: inserta en el último campo enfocado sin cerrar el teclado del iPad
  let lastInput = null;
  document.addEventListener('focusin', e => { if (e.target.matches?.('input[type=text], textarea')) lastInput = e.target; });
  function umlautBar() {
    return h('div', { class: 'umlauts', 'aria-label': 'Caracteres alemanes' },
      ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'].map(ch => h('button', {
        type: 'button', class: 'uml', tabindex: '-1',
        onpointerdown: e => { e.preventDefault(); insertChar(ch); },
        onclick: e => { if (e.detail === 0) insertChar(ch); }      // teclado / accesibilidad
      }, ch)));
  }
  function insertChar(ch) {
    const inp = lastInput && document.body.contains(lastInput) ? lastInput : null;
    if (!inp) return;
    const s = inp.selectionStart ?? inp.value.length, e = inp.selectionEnd ?? s;
    inp.value = inp.value.slice(0, s) + ch + inp.value.slice(e);
    inp.focus();
    try { inp.setSelectionRange(s + 1, s + 1); } catch (_) { /* */ }
    inp.dispatchEvent(new Event('input', { bubbles: true }));
  }

  /* =========================================================
     INICIO
     ========================================================= */
  function renderHome() {
    const hr = new Date().getHours();
    const greet = hr < 12 ? 'Guten Morgen' : hr < 19 ? 'Guten Tag' : 'Guten Abend';
    const today = new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
    const words = S.words;
    const due = words.filter(isDue).length;
    const td = S.days[dayKey()] || { n: 0, ok: 0 };
    const gTot = words.reduce((a, w) => a + w.gOk + w.gKo, 0), gOk = words.reduce((a, w) => a + w.gOk, 0);
    const root = h('div', { class: 'view' },
      h('header', { class: 'vh' }, h('div', null, h('h1', null, greet + '!'), h('p', { class: 'muted cap' }, today))));

    if (!words.length) {
      root.append(h('section', { class: 'card hero' },
        h('h2', null, 'Empieza aquí'),
        h('p', null, 'Tu vocabulario está vacío. Puedes cargar un mazo base de nivel A2/B1 o empezar a añadir tus propias palabras.'),
        h('div', { class: 'row wrap' },
          h('button', { class: 'btn primary', type: 'button', onclick: () => loadDeck('basis') }, 'Cargar vocabulario base (' + DATA.decks.basis.items.length + ')'),
          h('button', { class: 'btn', type: 'button', onclick: () => loadDeck('luftfahrt') }, 'Cargar aviación (' + DATA.decks.luftfahrt.items.length + ')'),
          h('button', { class: 'btn', type: 'button', onclick: () => go('words') }, 'Añadir mis palabras'))));
    }

    root.append(h('div', { class: 'tiles' },
      tile('Palabras', words.length, words.length ? words.filter(w => w.box === 5).length + ' dominadas' : ''),
      tile('Pendientes hoy', due, due ? 'Repaso + nuevas' : 'Todo al día', due ? 'accent' : ''),
      tile('Racha', streak() + (streak() === 1 ? ' día' : ' días'), td.n ? 'Hoy: ' + td.n + ' respuestas' : 'Hoy aún no has practicado'),
      tile('Acierto hoy', td.n ? pct(td.ok, td.n) + ' %' : '—', td.n ? td.ok + ' / ' + td.n : ''),
      tile('Género', gTot ? pct(gOk, gTot) + ' %' : '—', gTot ? 'der / die / das' : 'Sin datos aún')));

    if (words.length) {
      root.append(h('div', { class: 'row wrap cta' },
        h('button', { class: 'btn primary big', type: 'button', disabled: !due, onclick: () => startVocab(Object.assign({}, S.settings.vocab, { source: 'due', types: ['n', 'v', 'a', 'x'], tag: '' })) },
          due ? 'Practicar pendientes (' + Math.min(due, S.settings.vocab.count || due) + ')' : 'Nada pendiente hoy'),
        h('button', { class: 'btn big', type: 'button', onclick: () => startBlitz() }, 'der · die · das rápido'),
        h('button', { class: 'btn big', type: 'button', onclick: () => go('practice') }, 'Más juegos')));
    }

    const grid = h('div', { class: 'grid2' });
    if (words.length) {
      const counts = [0, 0, 0, 0, 0, 0];
      words.forEach(w => counts[w.box]++);
      const max = Math.max(1, ...counts);
      grid.append(h('section', { class: 'card' }, h('h3', null, 'Nivel de dominio'),
        h('div', { class: 'bars' }, counts.map((c, i) => {
          const fill = h('span', { class: 'fill b' + i });
          fill.style.width = (100 * c / max) + '%';
          return h('div', { class: 'bar-row' }, h('span', { class: 'bl' }, BOX_LABEL[i]), h('span', { class: 'track' }, fill), h('span', { class: 'bn' }, c));
        })),
        h('p', { class: 'hint' }, 'Cada acierto sube la palabra una caja y espacia su repaso (1, 3, 7, 14 y 30 días). Un fallo la devuelve a la caja 1.')));
    }
    // Actividad 14 días
    const daysArr = [];
    for (let i = 13; i >= 0; i--) { const k = dayKey(Date.now() - i * DAY); daysArr.push({ k, d: S.days[k] || { n: 0, ok: 0 } }); }
    const dmax = Math.max(1, ...daysArr.map(x => x.d.n));
    grid.append(h('section', { class: 'card' }, h('h3', null, 'Actividad (14 días)'),
      h('div', { class: 'spark' }, daysArr.map(x => {
        const col = h('span', { class: 'col' + (x.d.n ? '' : ' empty') });
        col.style.height = Math.max(4, Math.round(100 * x.d.n / dmax)) + 'px';
        return h('div', { class: 'sc', title: x.k + ': ' + x.d.n + ' respuestas' }, col, h('small', null, new Date(x.k + 'T12:00').toLocaleDateString('de-DE', { weekday: 'narrow' })));
      }))));
    // Más falladas
    const hard = words.filter(w => w.ko > 0).sort((a, b) => (b.ko / b.seen) - (a.ko / a.seen) || b.ko - a.ko).slice(0, 8);
    if (hard.length) {
      grid.append(h('section', { class: 'card' }, h('h3', null, 'Las que más se te resisten'),
        h('ul', { class: 'mini-list' }, hard.map(w => h('li', null, wordNode(w), h('span', { class: 'muted' }, w.es), h('span', { class: 'badge bad' }, w.ko + '✗')))),
        h('button', { class: 'btn small', type: 'button', onclick: () => startVocab(Object.assign({}, S.settings.vocab, { source: 'hard', types: ['n', 'v', 'a', 'x'], tag: '' })) }, 'Practicar difíciles')));
    }
    root.append(grid);

    if (words.length && Date.now() - S.settings.lastBackup > 14 * DAY) {
      root.append(h('section', { class: 'card warn' },
        h('div', null, h('strong', null, 'Copia de seguridad'), h('p', null, S.settings.lastBackup ? 'Tu última copia tiene más de 14 días.' : 'Aún no has hecho ninguna copia. Tus datos solo están en este iPad.')),
        h('button', { class: 'btn', type: 'button', onclick: () => exportJSON() }, 'Exportar ahora')));
    }
    return root;
  }
  function tile(label, value, sub, cls) {
    return h('div', { class: 'tile' + (cls ? ' ' + cls : '') }, h('span', { class: 'tl' }, label), h('strong', null, String(value)), h('small', null, sub || ''));
  }

  /* =========================================================
     VOCABULARIO (base de datos)
     ========================================================= */
  function parsePlural(raw, de) {
    const t = clean(raw, LIMITS.str);
    if (!t) return { pl: '' };
    if (/^(–|-|—|sin plural|kein plural|0)$/i.test(t)) return { pl: '–' };
    if (t.startsWith('¨') || t.startsWith('̈')) return { err: 'Con cambio de vocal escribe el plural completo (p. ej. Bücher).' };
    let p = t.replace(/^die\s+/i, '');
    if (/^-[a-zäöüß]+$/i.test(p)) p = de + p.slice(1);
    return { pl: cap(p) };
  }
  function renderWords() {
    let editing = null;          // id en edición
    let type = 'n', art = '';
    const inDe = textInput({ placeholder: 'p. ej. Hund', lang: 'de' });
    const inPl = textInput({ placeholder: 'Hunde · -e · – (sin plural)', lang: 'de' });
    const inEs = textInput({ placeholder: 'p. ej. perro', lang: 'es' });
    const inEx = h('textarea', { rows: 2, maxlength: LIMITS.ex, placeholder: 'Frase de ejemplo (opcional)', lang: 'de', autocorrect: 'off', spellcheck: 'false', autocapitalize: 'off' });
    const inTags = textInput({ placeholder: 'p. ej. Lección 1, Reisen', lang: 'es' });
    const plHint = h('span', { class: 'hint' }, ' ');
    const formTitle = h('h3', null, 'Añadir palabra');
    const cancelBtn = h('button', { class: 'btn hidden', type: 'button', onclick: () => resetForm() }, 'Cancelar');
    const saveBtn = h('button', { class: 'btn primary', type: 'button', onclick: () => saveWord() }, 'Guardar');

    let artSeg, typeSeg;
    const artWrap = h('div', { class: 'field' }, h('span', { class: 'fl' }, 'Artículo'));
    const plField = field('Plural', inPl);
    plField.append(plHint);
    function buildArtSeg() {
      artSeg = seg(ARTS.map(a => ({ value: a, label: a, cls: 'a-' + a })), art, v => { art = v; }, 'arts');
      fill(artWrap, h('span', { class: 'fl' }, 'Artículo'), artSeg);
    }
    function buildTypeSeg() {
      typeSeg = seg(Object.entries(TYPES).map(([k, v]) => ({ value: k, label: v })), type, v => { type = v; updateType(); });
      fill(typeWrap, h('span', { class: 'fl' }, 'Tipo'), typeSeg);
    }
    const typeWrap = h('div', { class: 'field' });
    function updateType() {
      artWrap.classList.toggle('hidden', type !== 'n');
      plField.classList.toggle('hidden', type !== 'n');
      inDe.placeholder = type === 'n' ? 'p. ej. Hund' : type === 'v' ? 'p. ej. fahren' : type === 'a' ? 'p. ej. schnell' : 'p. ej. trotzdem';
    }
    inPl.addEventListener('input', () => {
      const r = parsePlural(inPl.value, cap(clean(inDe.value, LIMITS.str).replace(/^(der|die|das)\s+/i, '')));
      plHint.textContent = r.err ? r.err : r.pl ? '→ ' + (r.pl === '–' ? 'sin plural' : 'die ' + r.pl) : ' ';
      plHint.classList.toggle('err', !!r.err);
    });
    inDe.addEventListener('input', () => {
      const m = /^(der|die|das)\s+/i.exec(inDe.value);
      if (m && type === 'n') { art = m[1].toLowerCase(); inDe.value = inDe.value.slice(m[0].length); buildArtSeg(); }
    });
    [inDe, inPl, inEs, inTags].forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); saveWord(); } }));

    const tagChips = h('div', { class: 'chips' });
    function drawTagChips() {
      fill(tagChips, ...allTags().slice(0, 24).map(t => h('button', {
        class: 'chip', type: 'button', onclick: () => {
          const cur = inTags.value.split(',').map(x => x.trim()).filter(Boolean);
          if (!cur.includes(t)) cur.push(t);
          inTags.value = cur.join(', ');
        }
      }, '+ ' + t)));
    }

    function resetForm() {
      editing = null; type = 'n'; art = '';
      inDe.value = inPl.value = inEs.value = inEx.value = inTags.value = '';
      plHint.textContent = ' ';
      formTitle.textContent = 'Añadir palabra';
      saveBtn.textContent = 'Guardar';
      cancelBtn.classList.add('hidden');
      buildTypeSeg(); buildArtSeg(); updateType(); drawTagChips();
    }
    function editWord(w) {
      editing = w.id; type = w.type; art = w.art;
      inDe.value = w.de; inPl.value = w.pl; inEs.value = w.es; inEx.value = w.ex; inTags.value = w.tags.join(', ');
      formTitle.textContent = 'Editar palabra';
      saveBtn.textContent = 'Guardar cambios';
      cancelBtn.classList.remove('hidden');
      buildTypeSeg(); buildArtSeg(); updateType();
      formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      inDe.focus();
    }
    function saveWord() {
      let de = clean(inDe.value, LIMITS.str).replace(/^(der|die|das)\s+/i, '');
      const es = clean(inEs.value, LIMITS.str);
      if (type === 'n') de = cap(de);
      if (!de) { toast('Escribe la palabra en alemán', 'err'); inDe.focus(); return; }
      if (type === 'n' && !art) { toast('Elige el artículo (der, die o das)', 'err'); return; }
      if (!es) { toast('Escribe la traducción al español', 'err'); inEs.focus(); return; }
      let pl = '';
      if (type === 'n') {
        const r = parsePlural(inPl.value, de);
        if (r.err) { toast(r.err, 'err'); inPl.focus(); return; }
        pl = r.pl;
      }
      const tags = [...new Set(inTags.value.split(',').map(t => clean(t, LIMITS.tag)).filter(Boolean))].slice(0, LIMITS.tags);
      const data = { type, art: type === 'n' ? art : '', de, pl, es, ex: clean(inEx.value, LIMITS.ex), tags };
      const k = wkey(data);
      const dup = S.words.find(w => wkey(w) === k && w.id !== editing);
      if (dup) { toast('Esa palabra ya existe: ' + nounLabel(dup) + ' — ' + dup.es, 'err'); return; }
      if (editing) {
        const w = S.words.find(x => x.id === editing);
        if (w) Object.assign(w, data);
        toast('Palabra actualizada');
      } else {
        S.words.push(sanitizeWord(Object.assign({ id: uid(), created: Date.now() }, data), false));
        toast('Añadida: ' + nounLabel(data));
      }
      if (save()) {
        const keepType = type, keepTags = inTags.value, wasEditing = !!editing;
        resetForm();
        type = keepType; buildTypeSeg(); updateType();
        inTags.value = wasEditing ? '' : keepTags;        // mantener etiquetas para añadir en serie
        refreshList();
        inDe.focus();
      }
    }

    const formCard = h('section', { class: 'card form-card' },
      formTitle, typeWrap, artWrap,
      field('Alemán', inDe), plField, field('Español', inEs, 'Varios significados separados por comas.'),
      field('Ejemplo', inEx), field('Etiquetas', inTags), tagChips,
      umlautBar(),
      h('div', { class: 'row end' }, cancelBtn, saveBtn));

    // ---- lista ----
    const q = textInput({ placeholder: 'Buscar en alemán, español o etiqueta…', type: 'search', class: 'search' });
    const fType = h('select', { 'aria-label': 'Tipo' }, h('option', { value: '' }, 'Todos los tipos'), Object.entries(TYPES).map(([k, v]) => h('option', { value: k }, v)));
    const fTag = h('select', { 'aria-label': 'Etiqueta' });
    const fSort = h('select', { 'aria-label': 'Orden' },
      h('option', { value: 'new' }, 'Recientes'), h('option', { value: 'de' }, 'Alemán A→Z'), h('option', { value: 'es' }, 'Español A→Z'),
      h('option', { value: 'ko' }, 'Más falladas'), h('option', { value: 'box' }, 'Menos dominadas'));
    const countEl = h('span', { class: 'muted' });
    const list = h('div', { class: 'wlist' });
    let limit = 200;
    function drawTagFilter() {
      const cur = fTag.value;
      fill(fTag, h('option', { value: '' }, 'Todas las etiquetas'), allTags().map(t => h('option', { value: t }, t)));
      fTag.value = allTags().includes(cur) ? cur : '';
    }
    function refreshList() {
      drawTagFilter();
      const qq = fold(clean(q.value, 100));
      let arr = S.words.filter(w => (!fType.value || w.type === fType.value) && (!fTag.value || w.tags.includes(fTag.value)) &&
        (!qq || fold(w.de + ' ' + w.pl + ' ' + w.es + ' ' + w.tags.join(' ') + ' ' + w.art).includes(qq)));
      const s = fSort.value;
      arr.sort(s === 'de' ? (a, b) => a.de.localeCompare(b.de, 'de') : s === 'es' ? (a, b) => a.es.localeCompare(b.es, 'es') :
        s === 'ko' ? (a, b) => b.ko - a.ko : s === 'box' ? (a, b) => a.box - b.box : (a, b) => b.created - a.created);
      countEl.textContent = arr.length + (arr.length === 1 ? ' palabra' : ' palabras') + (arr.length !== S.words.length ? ' de ' + S.words.length : '');
      if (!S.words.length) {
        fill(list, h('div', { class: 'empty' }, h('p', null, 'Aún no hay palabras.'),
          h('button', { class: 'btn', type: 'button', onclick: () => loadDeck('basis') }, 'Cargar vocabulario base A2/B1')));
        return;
      }
      fill(list, ...arr.slice(0, limit).map(w => h('div', { class: 'wrow' },
        h('div', { class: 'wmain' }, h('div', { class: 'wde' }, wordNode(w), w.type === 'n' && w.pl ? h('span', { class: 'pl' }, plLabel(w)) : h('span', { class: 'tchip' }, TYPE_SHORT[w.type])),
          h('div', { class: 'wes' }, w.es), w.ex ? h('div', { class: 'wex' }, w.ex) : null,
          w.tags.length ? h('div', { class: 'wtags' }, w.tags.map(t => h('span', { class: 'tag' }, t))) : null),
        h('div', { class: 'wside' },
          h('span', { class: 'lvl l' + w.box, title: BOX_LABEL[w.box] }, w.box === 0 ? 'nueva' : w.box === 5 ? '★' : String(w.box)),
          speakBtn(() => w.type === 'n' ? w.art + ' ' + w.de : w.de),
          h('button', { class: 'icon-btn', type: 'button', title: 'Editar', 'aria-label': 'Editar', onclick: () => editWord(w) }, icon('edit')),
          h('button', { class: 'icon-btn danger', type: 'button', title: 'Borrar', 'aria-label': 'Borrar', onclick: async () => {
            if (await confirmDlg('Borrar palabra', '¿Borrar «' + nounLabel(w) + '»? Se pierde también su progreso.', 'Borrar', true)) {
              S.words = S.words.filter(x => x.id !== w.id); save(); if (editing === w.id) resetForm(); refreshList(); toast('Borrada');
            }
          } }, icon('trash'))))));
      if (arr.length > limit) list.append(h('button', { class: 'btn more', type: 'button', onclick: () => { limit += 300; refreshList(); } }, 'Mostrar más (' + (arr.length - limit) + ')'));
    }
    let tq;
    q.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { limit = 200; refreshList(); }, 150); });
    [fType, fTag, fSort].forEach(s => s.addEventListener('change', () => { limit = 200; refreshList(); }));

    resetForm();
    refreshList();
    return h('div', { class: 'view' },
      h('header', { class: 'vh' }, h('div', null, h('h1', null, 'Vocabulario'), h('p', { class: 'muted' }, 'Tu base de datos personal. Todo se guarda solo en este dispositivo.'))),
      h('div', { class: 'words-layout' }, formCard,
        h('section', { class: 'card list-card' }, h('div', { class: 'toolbar' }, q, fType, fTag, fSort), h('div', { class: 'row between' }, countEl), list)));
  }

  /* ---- mazos ---- */
  function deckWords(id) {
    const d = DATA.decks[id];
    return d.items.map(s => {
      const p = s.split('|');
      if (ARTS.includes(p[0])) return { type: 'n', art: p[0], de: p[1], pl: p[2], es: p[3], tags: [d.tag] };
      return { type: p[0], art: '', de: p[1], pl: '', es: p[2], tags: [d.tag] };
    });
  }
  function mergeWords(list, keepProgress) {
    const keys = new Map(S.words.map(w => [wkey(w), w]));
    let added = 0, dup = 0, bad = 0;
    for (const o of list) {
      if (S.words.length >= LIMITS.words) { bad++; continue; }
      const w = sanitizeWord(o, keepProgress);
      if (!w) { bad++; continue; }
      const k = wkey(w);
      if (keys.has(k)) {
        const ex = keys.get(k);                     // añade etiquetas nuevas a la existente
        w.tags.forEach(t => { if (!ex.tags.includes(t) && ex.tags.length < LIMITS.tags) ex.tags.push(t); });
        dup++; continue;
      }
      if (S.words.some(x => x.id === w.id)) w.id = uid();
      keys.set(k, w); S.words.push(w); added++;
    }
    return { added, dup, bad };
  }
  function loadDeck(id) {
    const r = mergeWords(deckWords(id), false);
    save();
    toast(r.added + ' palabras añadidas' + (r.dup ? ' · ' + r.dup + ' ya existían' : ''));
    render();
  }

  /* =========================================================
     PRÁCTICA: centro de juegos
     ========================================================= */
  function renderPractice() {
    if (route.sub === 'game' && game) { const box = h('div', { class: 'view game' }); game.mount(box); return box; }
    if (route.sub === 'vocab') return renderVocabSetup();
    if (route.sub === 'verbs') return renderVerbSetup();
    const nouns = S.words.filter(w => w.type === 'n').length;
    const games = [
      { t: 'Vocabulario', d: 'Significado, género y plural en ambos sentidos (ESP ⇄ DEU), con repetición espaciada.', meta: S.words.filter(isDue).length + ' pendientes hoy', go: () => go('practice', 'vocab'), main: true },
      { t: 'der · die · das', d: 'Ráfaga de 20 sustantivos: solo el artículo, lo más rápido posible.', meta: nouns >= 10 ? nouns + ' sustantivos' : 'Usa el mazo base', go: () => startBlitz() },
      { t: 'Verbos irregulares', d: 'Präteritum, Partizip II y auxiliar (haben / sein).', meta: DATA.verbs.length + ' verbos', go: () => go('practice', 'verbs') },
      { t: 'Casos en frases', d: 'Elige el artículo o pronombre correcto en contexto.', meta: DATA.caseDrills.length + ' frases', go: () => startCases() },
      { t: 'Preposición → caso', d: '¿Akkusativ, Dativ, Wechsel o Genitiv?', meta: DATA.preps.length + ' preposiciones', go: () => startPrepCase() },
      { t: 'Verbos con preposición', d: 'warten auf + Akk, Angst haben vor + Dat…', meta: DATA.verbPreps.length + ' verbos', go: () => startVerbPrep() }
    ];
    return h('div', { class: 'view' },
      h('header', { class: 'vh' }, h('div', null, h('h1', null, 'Práctica'), h('p', { class: 'muted' }, 'Elige un juego.'))),
      h('div', { class: 'games' }, games.map(g => h('button', { class: 'game-card' + (g.main ? ' main' : ''), type: 'button', onclick: g.go },
        h('strong', null, g.t), h('span', null, g.d), h('small', null, g.meta)))));
  }

  function selectBySource(pool, src) {
    if (src === 'due') {
      const now = endOfToday();
      const reviews = pool.filter(w => w.seen && w.due <= now).sort((a, b) => a.due - b.due);
      const news = shuffle(pool.filter(w => !w.seen));
      return reviews.concat(news);
    }
    if (src === 'new') return shuffle(pool.filter(w => !w.seen));
    if (src === 'hard') return pool.filter(w => w.ko > 0).sort((a, b) => (b.ko / b.seen) - (a.ko / a.seen) || b.ko - a.ko);
    return shuffle(pool);
  }
  function renderVocabSetup() {
    const c = S.settings.vocab;
    const info = h('p', { class: 'avail' });
    const tagSel = h('select', { 'aria-label': 'Etiqueta', onchange: e => { c.tag = e.target.value; upd(); } },
      h('option', { value: '' }, 'Todas las etiquetas'), allTags().map(t => h('option', { value: t }, t)));
    tagSel.value = allTags().includes(c.tag) ? c.tag : (c.tag = '');
    function upd() {
      const pool = S.words.filter(w => c.types.includes(w.type) && (!c.tag || w.tags.includes(c.tag)));
      const n = selectBySource(pool, c.source).length;
      const take = c.count === 0 ? n : Math.min(n, c.count);
      info.textContent = n ? take + ' palabras en esta sesión (' + n + ' disponibles)' : 'No hay palabras con estos filtros.';
      startBtn.disabled = !n;
      save();
    }
    const typeChips = h('div', { class: 'chips' }, Object.entries(TYPES).map(([k, v]) => {
      const b = h('button', { type: 'button', class: 'chip sel' + (c.types.includes(k) ? ' on' : ''), 'aria-pressed': String(c.types.includes(k)),
        onclick: () => {
          if (c.types.includes(k)) { if (c.types.length === 1) return; c.types = c.types.filter(x => x !== k); } else c.types.push(k);
          b.classList.toggle('on', c.types.includes(k)); b.setAttribute('aria-pressed', String(c.types.includes(k))); upd();
        } }, v);
      return b;
    }));
    const startBtn = h('button', { class: 'btn primary big', type: 'button', onclick: () => startVocab(c) }, 'Empezar');
    const view = h('div', { class: 'view narrow' },
      h('header', { class: 'vh' }, h('div', null, h('button', { class: 'back', type: 'button', onclick: () => go('practice') }, '‹ Práctica'), h('h1', null, 'Vocabulario'))),
      h('section', { class: 'card setup' },
        field('Sentido', seg([{ value: 'es', label: 'ESP → DEU' }, { value: 'de', label: 'DEU → ESP' }, { value: 'mix', label: 'Mixto' }], c.dir, v => { c.dir = v; save(); })),
        field('Respuesta', seg([{ value: 'type', label: 'Escribir' }, { value: 'mc', label: 'Opciones' }], c.mode, v => { c.mode = v; save(); })),
        field('Qué palabras', seg([{ value: 'due', label: 'Pendientes' }, { value: 'new', label: 'Nuevas' }, { value: 'hard', label: 'Difíciles' }, { value: 'all', label: 'Todas' }], c.source, v => { c.source = v; upd(); })),
        field('Tipos', typeChips),
        field('Etiqueta', tagSel),
        field('Cantidad', seg([10, 20, 30, 50, 0].map(n => ({ value: n, label: n ? String(n) : 'Todas' })), c.count, v => { c.count = v; upd(); })),
        h('div', { class: 'toggles' },
          toggle('Preguntar género', c.askG, v => { c.askG = v; save(); }, 'der / die / das en sustantivos'),
          toggle('Preguntar plural', c.askP, v => { c.askP = v; save(); }, 'Solo si la palabra tiene plural guardado')),
        info, h('div', { class: 'row end' }, startBtn)));
    upd();
    return view;
  }

  /* ---- motor de corrección ---- */
  function stripArt(s) { return s.replace(/^(der|die|das)\s+/i, ''); }
  function matchDe(given, right) {
    const g = clean(given, 200), r = right;
    if (!g) return { ok: false };
    const gs = stripArt(g);
    const lc = x => x.toLowerCase();
    if (lc(gs) === lc(r) || lc(g) === lc(r)) {
      return { ok: true, note: gs !== r && gs.charAt(0) !== r.charAt(0) && lc(gs) === lc(r) && /^[A-ZÄÖÜ]/.test(r) ? 'Los sustantivos se escriben con mayúscula.' : '' };
    }
    if (translit(gs) === translit(r)) return { ok: true, note: 'Escríbelo con ä / ö / ü / ß: ' + r };
    if (/^sich\s/i.test(r) && lc(gs) === lc(r.replace(/^sich\s+/i, ''))) return { ok: true, note: 'Es reflexivo: ' + r };
    return { ok: false };
  }
  function normEs(s) {
    return fold(s).replace(/\([^)]*\)/g, ' ').replace(/[¿?¡!.:"']/g, ' ').replace(/^\s*(el|la|los|las|un|una|unos|unas|lo)\s+/, '').replace(/\s+/g, ' ').trim();
  }
  function matchEs(given, right) {
    const g = normEs(clean(given, 200));
    if (!g) return { ok: false };
    const alts = [right, ...right.split(/[,;/]/)].map(normEs).filter(Boolean);
    if (alts.includes(g)) return { ok: true };
    if (alts.some(a => a.length >= 5 && lev(g, a) <= 1)) return { ok: true, note: 'Casi: revisa la ortografía (' + right + ').' };
    return { ok: false };
  }
  function matchPl(given, right) {
    const g = clean(given, 200);
    if (right === '–') return { ok: /^(–|-|—|sin plural|kein plural|keiner|0)$/i.test(g) };
    if (!g) return { ok: false };
    const gs = g.replace(/^die\s+/i, '');
    if (gs.toLowerCase() === right.toLowerCase()) return { ok: true };
    if (translit(gs) === translit(right)) return { ok: true, note: 'Escríbelo con umlaut: ' + right };
    return { ok: false };
  }
  function multiMatch(given, right) {       // admite alternativas "a/b"
    const g = clean(given, 100).toLowerCase().replace(/\s+/g, ' ');
    if (!g) return { ok: false };
    const alts = right.split('/').map(x => x.trim().toLowerCase());
    if (alts.includes(g)) return { ok: true };
    if (alts.some(a => translit(a) === translit(g))) return { ok: true, note: 'Con umlaut / ß: ' + right };
    return { ok: false };
  }
  function mcOptions(w, field) {
    const right = w[field];
    let pool = S.words.filter(x => x.id !== w.id && x.type === w.type && x[field].toLowerCase() !== right.toLowerCase());
    if (pool.length < 3) pool = S.words.filter(x => x.id !== w.id && x[field].toLowerCase() !== right.toLowerCase());
    const seen = new Set([right.toLowerCase()]); const opts = [];
    for (const x of shuffle(pool)) { const v = x[field]; if (!seen.has(v.toLowerCase())) { seen.add(v.toLowerCase()); opts.push(v); } if (opts.length === 3) break; }
    opts.push(right);
    return shuffle(opts);
  }

  /* ---- cabecera común de juego ---- */
  function gameHeader(title, i, total, onExit) {
    const bar = h('span', { class: 'pfill' });
    bar.style.width = (100 * i / Math.max(1, total)) + '%';
    return h('div', { class: 'ghead' },
      h('button', { class: 'back', type: 'button', onclick: onExit }, '‹ Salir'),
      h('div', { class: 'gtitle' }, h('strong', null, title), h('span', { class: 'muted' }, Math.min(i + 1, total) + ' / ' + total)),
      h('div', { class: 'progress' }, bar));
  }
  const exitGame = () => { game = null; go('practice'); };
  function isTyping(e) { return e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT'); }

  /* =========================================================
     JUEGO: VOCABULARIO
     ========================================================= */
  function startVocab(cfg) {
    cfg = Object.assign({}, cfg);
    let pool = S.words.filter(w => cfg.types.includes(w.type) && (!cfg.tag || w.tags.includes(cfg.tag)));
    pool = selectBySource(pool, cfg.source);
    if (!pool.length) { toast('No hay palabras con ese filtro', 'err'); return; }
    if (cfg.mode === 'mc' && S.words.length < 4) { cfg.mode = 'type'; toast('Con menos de 4 palabras se juega escribiendo'); }
    const chosen = shuffle(pool.slice(0, cfg.count || pool.length));
    const items = chosen.map(w => ({ w, dir: cfg.dir === 'mix' ? (randInt(2) ? 'es' : 'de') : cfg.dir, retry: false }));
    runVocab(items, cfg);
  }
  function runVocab(items, cfg) {
    let i = 0, firstOk = 0, firstTotal = items.length;
    const failed = [];
    const g = {};
    g.mount = box => { g.box = box; draw(); };
    function draw() {
      if (i >= items.length) return summary();
      const it = items[i], w = it.w;
      const askG = cfg.askG && w.type === 'n';
      const askP = cfg.askP && w.type === 'n' && !!w.pl;
      const ans = { art: '', main: '', pl: '' };
      let checked = false, result = null;
      const field = it.dir === 'es' ? 'de' : 'es';

      const prompt = it.dir === 'es'
        ? h('div', { class: 'prompt' }, h('span', { class: 'plabel' }, 'Traduce al alemán · ' + TYPES[w.type]), h('div', { class: 'pbig' }, w.es))
        : h('div', { class: 'prompt' }, h('span', { class: 'plabel' }, 'Traduce al español · ' + TYPES[w.type]),
          h('div', { class: 'pbig de' }, askG ? w.de : nounLabel(w), speakBtn(() => askG ? w.de : nounLabel(w))));

      const parts = h('div', { class: 'answers' });
      let artSegEl = null;
      if (askG) {
        artSegEl = seg(ARTS.map(a => ({ value: a, label: a, cls: 'a-' + a })), '', v => { ans.art = v; }, 'arts big');
        parts.append(h('div', { class: 'afield' }, h('span', { class: 'fl' }, 'Género'), artSegEl));
      }
      let mainInput = null, optBtns = [];
      if (cfg.mode === 'mc') {
        const opts = mcOptions(w, field);
        optBtns = opts.map((o, k) => h('button', { type: 'button', class: 'opt', onclick: () => {
          if (checked) return;
          ans.main = o; optBtns.forEach(b => b.classList.remove('on')); optBtns[k].classList.add('on');
          if (!askG && !askP) check();
        } }, h('kbd', null, String(k + 1)), o));
        parts.append(h('div', { class: 'afield' }, h('span', { class: 'fl' }, it.dir === 'es' ? 'Palabra' : 'Significado'), h('div', { class: 'opts' }, optBtns)));
      } else {
        mainInput = textInput({ lang: it.dir === 'es' ? 'de' : 'es', placeholder: it.dir === 'es' ? 'Palabra en alemán' + (askG ? ' (sin artículo)' : '') : 'Significado en español', class: 'big-in', oninput: e => { ans.main = e.target.value; } });
        parts.append(h('div', { class: 'afield' }, h('span', { class: 'fl' }, it.dir === 'es' ? 'Palabra' : 'Significado'), mainInput));
      }
      let plInput = null;
      if (askP) {
        plInput = textInput({ lang: 'de', placeholder: 'Plural', class: 'big-in', oninput: e => { ans.pl = e.target.value; } });
        parts.append(h('div', { class: 'afield' }, h('span', { class: 'fl' }, 'Plural'),
          h('div', { class: 'row' }, plInput, h('button', { type: 'button', class: 'btn', onclick: () => { plInput.value = '–'; ans.pl = '–'; } }, 'sin plural'))));
      }
      const needsUml = (it.dir === 'es' && cfg.mode === 'type') || askP;
      const fb = h('div', { class: 'feedback' });
      const btnCheck = h('button', { class: 'btn primary big', type: 'button', onclick: () => check() }, 'Comprobar');
      const btnNext = h('button', { class: 'btn primary big hidden', type: 'button', onclick: () => next() }, i + 1 < items.length ? 'Siguiente →' : 'Ver resultado');
      const btnOverride = h('button', { class: 'btn hidden', type: 'button', onclick: () => { result.all = true; btnOverride.classList.add('hidden'); fb.classList.remove('bad'); fb.classList.add('ok'); fb.firstChild.textContent = '✓ Contada como correcta'; } }, 'Contar como correcta');

      function check() {
        if (checked) return;
        if (mainInput) ans.main = mainInput.value;
        if (plInput) ans.pl = plInput.value;
        checked = true;
        const rows = []; const notes = [];
        let all = true;
        if (askG) {
          const ok = ans.art === w.art; all = all && ok;
          rows.push([ok, 'Género', ans.art || '—', w.art]);
          w.gOk += ok ? 1 : 0; w.gKo += ok ? 0 : 1;
        }
        const m = cfg.mode === 'mc' ? { ok: ans.main === w[field] } : (it.dir === 'es' ? matchDe(ans.main, w.de) : matchEs(ans.main, w.es));
        all = all && m.ok; if (m.note) notes.push(m.note);
        rows.push([m.ok, it.dir === 'es' ? 'Palabra' : 'Significado', clean(ans.main, 100) || '—', w[field]]);
        if (askP) {
          const p = matchPl(ans.pl, w.pl); all = all && p.ok; if (p.note) notes.push(p.note);
          rows.push([p.ok, 'Plural', clean(ans.pl, 100) || '—', w.pl === '–' ? 'sin plural' : w.pl]);
        }
        result = { all };
        fb.className = 'feedback ' + (all ? 'ok' : 'bad');
        fill(fb, 
          h('div', { class: 'fbt' }, all ? '✓ Richtig!' : '✗ No del todo'),
          h('table', { class: 'fbrows' }, rows.map(([ok, l, gv, rv]) => h('tr', { class: ok ? 'ok' : 'bad' }, h('td', null, ok ? '✓' : '✗'), h('td', null, l), h('td', null, ok ? rv : [h('s', null, gv), ' → ', h('strong', null, rv)])))),
          notes.length ? h('p', { class: 'note' }, notes.join(' ')) : null,
          h('div', { class: 'solution' }, wordNode(w), w.type === 'n' && w.pl ? h('span', { class: 'pl' }, ' · ' + plLabel(w)) : null, h('span', { class: 'muted' }, ' — ' + w.es), speakBtn(() => nounLabel(w))),
          w.ex ? h('p', { class: 'wex' }, w.ex) : null);
        if (artSegEl) artSegEl.querySelectorAll('button').forEach(b => { b.disabled = true; if (b.textContent === w.art) b.classList.add('right'); });
        optBtns.forEach(b => { b.disabled = true; if (b.lastChild.textContent === w[field]) b.classList.add('right'); else if (b.classList.contains('on')) b.classList.add('wrong'); });
        if (mainInput) mainInput.readOnly = true;
        if (plInput) plInput.readOnly = true;
        btnCheck.classList.add('hidden'); btnNext.classList.remove('hidden');
        if (!all && cfg.mode === 'type') btnOverride.classList.remove('hidden');
        if (S.settings.autoSpeak) speak(nounLabel(w));
        save();
        btnNext.focus({ preventScroll: true });
      }
      function next() {
        if (!checked) return;
        const ok = result.all;
        if (!it.retry) {
          promote(w, ok);
          if (ok) firstOk++; else failed.push(w);
        }
        logAnswer(ok);
        if (!ok && !it.retry) items.push({ w, dir: it.dir, retry: true });   // vuelve al final de la sesión
        save();
        i++; draw();
      }
      fill(g.box, 
        gameHeader('Vocabulario', i, items.length, exitGame),
        h('section', { class: 'card qcard' + (it.retry ? ' retry' : '') }, it.retry ? h('span', { class: 'badge' }, 'Repaso del fallo') : null, prompt, parts,
          needsUml ? umlautBar() : null, fb, h('div', { class: 'row end' }, btnOverride, btnCheck, btnNext)));
      setKeys(e => {
        if (e.isComposing) return;
        if (e.key === 'Enter') { if (e.target.tagName === 'BUTTON') return; e.preventDefault(); checked ? next() : check(); return; }
        if (!isTyping(e) && !checked && optBtns.length && /^[1-4]$/.test(e.key)) optBtns[+e.key - 1]?.click();
      });
      if (mainInput && !askG) mainInput.focus({ preventScroll: true });
    }
    function summary() {
      setKeys(null);
      const p = pct(firstOk, firstTotal);
      fill(g.box, 
        gameHeader('Vocabulario', firstTotal, firstTotal, exitGame),
        h('section', { class: 'card summary' },
          h('div', { class: 'score' + (p >= 80 ? ' good' : p >= 50 ? ' mid' : ' low') }, h('strong', null, p + ' %'), h('span', null, firstOk + ' de ' + firstTotal + ' a la primera')),
          h('h3', null, p >= 90 ? 'Ausgezeichnet!' : p >= 70 ? 'Sehr gut!' : p >= 50 ? 'Gut, weiter so!' : 'Übung macht den Meister.'),
          failed.length ? h('div', null, h('h4', null, 'Para repasar'),
            h('ul', { class: 'mini-list' }, failed.map(w => h('li', null, wordNode(w), w.pl ? h('span', { class: 'pl' }, plLabel(w)) : null, h('span', { class: 'muted' }, w.es))))) : null,
          h('div', { class: 'row wrap end' },
            failed.length ? h('button', { class: 'btn', type: 'button', onclick: () => { const f = failed.map(w => ({ w, dir: cfg.dir === 'mix' ? (randInt(2) ? 'es' : 'de') : cfg.dir, retry: false })); runVocab(shuffle(f), cfg); } }, 'Repetir fallos') : null,
            h('button', { class: 'btn', type: 'button', onclick: () => go('practice', 'vocab') }, 'Configurar otra'),
            h('button', { class: 'btn primary', type: 'button', onclick: () => { game = null; go('home'); } }, 'Inicio'))));
    }
    game = g;
    go('practice', 'game');
    return g;
  }

  /* =========================================================
     JUEGO: der / die / das
     ========================================================= */
  function startBlitz() {
    let nouns = S.words.filter(w => w.type === 'n');
    let tracked = true;
    if (nouns.length < 10) { nouns = deckWords('basis').filter(w => w.type === 'n'); tracked = false; }
    const items = shuffle(nouns).slice(0, 20);
    let i = 0, ok = 0; const errs = []; const t0 = Date.now();
    const g = {};
    g.mount = box => { g.box = box; draw(); };
    function draw() {
      if (i >= items.length) return end();
      const w = items[i];
      let done = false;
      const btns = ARTS.map((a, k) => h('button', { type: 'button', class: 'blitz-btn a-' + a, onclick: () => choose(a) }, h('kbd', null, String(k + 1)), a));
      function choose(a) {
        if (done) return; done = true;
        const right = a === w.art;
        btns.forEach(b => { b.disabled = true; if (b.lastChild.textContent === w.art) b.classList.add('right'); else if (b.lastChild.textContent === a) b.classList.add('wrong'); });
        word.classList.add('g-' + w.art);
        if (right) ok++; else errs.push(w);
        if (tracked) { w.gOk += right ? 1 : 0; w.gKo += right ? 0 : 1; logAnswer(right); save(); }
        setTimeout(() => { i++; draw(); }, right ? 450 : 1300);
      }
      const word = h('div', { class: 'blitz-word' }, w.de);
      fill(g.box, 
        gameHeader('der · die · das', i, items.length, exitGame),
        h('section', { class: 'card blitz' }, !tracked ? h('p', { class: 'hint' }, 'Usando el mazo base (tienes menos de 10 sustantivos propios).') : null,
          word, h('div', { class: 'muted center' }, w.es), h('div', { class: 'blitz-btns' }, btns)));
      setKeys(e => { if (/^[1-3]$/.test(e.key)) btns[+e.key - 1].click(); });
    }
    function end() {
      setKeys(null);
      const secs = Math.round((Date.now() - t0) / 1000);
      fill(g.box, 
        gameHeader('der · die · das', items.length, items.length, exitGame),
        h('section', { class: 'card summary' },
          h('div', { class: 'score' + (ok / items.length >= .8 ? ' good' : ok / items.length >= .5 ? ' mid' : ' low') }, h('strong', null, ok + ' / ' + items.length), h('span', null, secs + ' s')),
          errs.length ? h('div', null, h('h4', null, 'Fallos'), h('ul', { class: 'mini-list' }, errs.map(w => h('li', null, wordNode(w), h('span', { class: 'muted' }, w.es))))) : h('h3', null, 'Perfekt! 🎯'),
          h('div', { class: 'row end wrap' }, h('button', { class: 'btn', type: 'button', onclick: exitGame }, 'Juegos'), h('button', { class: 'btn primary', type: 'button', onclick: () => startBlitz() }, 'Otra ronda'))));
    }
    game = g; go('practice', 'game');
  }

  /* =========================================================
     JUEGO: verbos irregulares
     ========================================================= */
  function renderVerbSetup() {
    const c = S.settings.verbs;
    return h('div', { class: 'view narrow' },
      h('header', { class: 'vh' }, h('div', null, h('button', { class: 'back', type: 'button', onclick: () => go('practice') }, '‹ Práctica'), h('h1', null, 'Verbos irregulares'))),
      h('section', { class: 'card setup' },
        field('Qué verbos', seg([{ value: 'all', label: 'Todos' }, { value: 'hard', label: 'Más fallados' }, { value: 'sep', label: 'Separables' }], c.source, v => { c.source = v; save(); })),
        field('Cantidad', seg([10, 15, 25, 0].map(n => ({ value: n, label: n ? String(n) : 'Todos' })), c.count, v => { c.count = v; save(); })),
        h('div', { class: 'toggles' }, toggle('Preguntar también el presente (er/sie/es)', c.pres, v => { c.pres = v; save(); }, 'fährt, liest, nimmt…')),
        h('div', { class: 'row end' }, h('button', { class: 'btn primary big', type: 'button', onclick: () => startVerbs() }, 'Empezar'))));
  }
  function startVerbs() {
    const c = S.settings.verbs;
    let pool = DATA.verbs.slice();
    if (c.source === 'sep') pool = pool.filter(v => v.pr.includes(' '));
    if (c.source === 'hard') {
      pool = pool.filter(v => S.verbStats[v.inf]?.ko).sort((a, b) => S.verbStats[b.inf].ko - S.verbStats[a.inf].ko);
      if (!pool.length) { toast('Aún no has fallado ningún verbo: empieza con «Todos»'); return; }
    } else pool = shuffle(pool);
    const items = shuffle(pool.slice(0, c.count || pool.length)).map(v => ({ v, retry: false }));
    let i = 0, firstOk = 0; const total = items.length; const failed = [];
    const g = {};
    g.mount = box => { g.box = box; draw(); };
    function draw() {
      if (i >= items.length) return end();
      const it = items[i], v = it.v;
      let checked = false, aux = '', allOk = false;
      const inPr = c.pres ? textInput({ lang: 'de', class: 'big-in', placeholder: 'er/sie/es …' }) : null;
      const inPt = textInput({ lang: 'de', class: 'big-in', placeholder: 'Präteritum (er/sie/es)' });
      const inP2 = textInput({ lang: 'de', class: 'big-in', placeholder: 'Partizip II' });
      const auxSeg = seg([{ value: 'haben', label: 'haben' }, { value: 'sein', label: 'sein' }], '', x => { aux = x; });
      const fb = h('div', { class: 'feedback' });
      const bCheck = h('button', { class: 'btn primary big', type: 'button', onclick: () => check() }, 'Comprobar');
      const bNext = h('button', { class: 'btn primary big hidden', type: 'button', onclick: () => next() }, 'Siguiente →');
      function check() {
        if (checked) return; checked = true;
        const rows = []; const notes = [];
        if (inPr) { const r = multiMatch(inPr.value.replace(/^(er|sie|es)\s+/i, ''), v.pr); rows.push([r.ok, 'Präsens', inPr.value, 'er ' + v.pr]); if (r.note) notes.push(r.note); }
        const r1 = multiMatch(inPt.value.replace(/^(er|sie|es)\s+/i, ''), v.pt); rows.push([r1.ok, 'Präteritum', inPt.value, v.pt]); if (r1.note) notes.push(r1.note);
        const r2 = multiMatch(inP2.value.replace(/^(hat|ist)\s+/i, ''), v.p2); rows.push([r2.ok, 'Partizip II', inP2.value, v.p2]); if (r2.note) notes.push(r2.note);
        const auxOk = v.aux.split('/').includes(aux); rows.push([auxOk, 'Auxiliar', aux || '—', v.aux]);
        allOk = rows.every(r => r[0]);
        const st = S.verbStats[v.inf] || (S.verbStats[v.inf] = { ok: 0, ko: 0 });
        if (!it.retry) { if (allOk) { st.ok++; firstOk++; } else { st.ko++; failed.push(v); } }
        logAnswer(allOk); save();
        fb.className = 'feedback ' + (allOk ? 'ok' : 'bad');
        fill(fb, h('div', { class: 'fbt' }, allOk ? '✓ Richtig!' : '✗ No del todo'),
          h('table', { class: 'fbrows' }, rows.map(([ok, l, gv, rv]) => h('tr', { class: ok ? 'ok' : 'bad' }, h('td', null, ok ? '✓' : '✗'), h('td', null, l), h('td', null, ok ? rv : [h('s', null, clean(gv, 60) || '—'), ' → ', h('strong', null, rv)])))),
          notes.length ? h('p', { class: 'note' }, notes.join(' ')) : null,
          h('div', { class: 'solution' }, h('strong', null, v.inf + ' – ' + v.pt + ' – ' + (v.aux.startsWith('sein') ? 'ist ' : 'hat ') + v.p2), speakBtn(() => v.inf + ', ' + v.pt + ', ' + v.p2)));
        [inPr, inPt, inP2].forEach(x => { if (x) x.readOnly = true; });
        auxSeg.querySelectorAll('button').forEach(b => { b.disabled = true; });
        bCheck.classList.add('hidden'); bNext.classList.remove('hidden'); bNext.focus({ preventScroll: true });
        if (S.settings.autoSpeak) speak(v.inf + ', ' + v.pt + ', ' + v.p2);
      }
      function next() {
        if (!allOk && !it.retry) items.push({ v, retry: true });
        i++; draw();
      }
      fill(g.box, gameHeader('Verbos irregulares', i, items.length, exitGame),
        h('section', { class: 'card qcard' + (it.retry ? ' retry' : '') }, it.retry ? h('span', { class: 'badge' }, 'Repaso del fallo') : null,
          h('div', { class: 'prompt' }, h('span', { class: 'plabel' }, v.es), h('div', { class: 'pbig de' }, v.inf, speakBtn(v.inf))),
          h('div', { class: 'answers' },
            inPr ? h('div', { class: 'afield' }, h('span', { class: 'fl' }, 'Präsens (er)'), inPr) : null,
            h('div', { class: 'afield' }, h('span', { class: 'fl' }, 'Präteritum'), inPt),
            h('div', { class: 'afield' }, h('span', { class: 'fl' }, 'Partizip II'), inP2),
            h('div', { class: 'afield' }, h('span', { class: 'fl' }, 'Auxiliar'), auxSeg)),
          umlautBar(), fb, h('div', { class: 'row end' }, bCheck, bNext)));
      setKeys(e => { if (e.key === 'Enter' && !e.isComposing && e.target.tagName !== 'BUTTON') { e.preventDefault(); checked ? next() : check(); } });
      (inPr || inPt).focus({ preventScroll: true });
    }
    function end() {
      setKeys(null);
      const p = pct(firstOk, total);
      fill(g.box, gameHeader('Verbos irregulares', total, total, exitGame),
        h('section', { class: 'card summary' },
          h('div', { class: 'score' + (p >= 80 ? ' good' : p >= 50 ? ' mid' : ' low') }, h('strong', null, p + ' %'), h('span', null, firstOk + ' de ' + total + ' a la primera')),
          failed.length ? h('div', null, h('h4', null, 'Para repasar'), verbTable(failed)) : h('h3', null, 'Perfekt!'),
          h('div', { class: 'row end wrap' }, h('button', { class: 'btn', type: 'button', onclick: exitGame }, 'Juegos'), h('button', { class: 'btn primary', type: 'button', onclick: () => startVerbs() }, 'Otra ronda'))));
    }
    game = g; go('practice', 'game');
  }

  /* =========================================================
     JUEGOS DE OPCIÓN MÚLTIPLE (casos, preposiciones)
     ========================================================= */
  function runMC(title, items) {
    let i = 0, ok = 0; const failed = [];
    const g = {};
    g.mount = box => { g.box = box; draw(); };
    function draw() {
      if (i >= items.length) return end();
      const it = items[i];
      let done = false;
      const fb = h('div', { class: 'feedback' });
      const bNext = h('button', { class: 'btn primary big hidden', type: 'button', onclick: () => { i++; draw(); } }, i + 1 < items.length ? 'Siguiente →' : 'Ver resultado');
      const promptEl = it.prompt();
      const btns = it.options.map((o, k) => h('button', { type: 'button', class: 'opt', onclick: () => choose(o, k) }, h('kbd', null, String(k + 1)), o));
      function choose(o, k) {
        if (done) return; done = true;
        const right = o === it.answer;
        if (right) ok++; else failed.push(it);
        logAnswer(right); save();
        btns.forEach((b, j) => { b.disabled = true; if (it.options[j] === it.answer) b.classList.add('right'); else if (j === k) b.classList.add('wrong'); });
        it.reveal?.(promptEl);
        fb.className = 'feedback ' + (right ? 'ok' : 'bad');
        fill(fb, h('div', { class: 'fbt' }, right ? '✓ Richtig!' : '✗ Era: ' + it.answer), it.explain ? h('p', null, rich(it.explain)) : null);
        bNext.classList.remove('hidden'); bNext.focus({ preventScroll: true });
        if (S.settings.autoSpeak && it.say) speak(it.say);
      }
      fill(g.box, gameHeader(title, i, items.length, exitGame),
        h('section', { class: 'card qcard' }, promptEl, h('div', { class: 'opts' + (it.options.length > 4 ? ' many' : '') }, btns), fb, h('div', { class: 'row end' }, bNext)));
      setKeys(e => {
        if (e.key === 'Enter' && done && e.target.tagName !== 'BUTTON') { e.preventDefault(); i++; draw(); return; }
        if (!done && /^[1-9]$/.test(e.key)) btns[+e.key - 1]?.click();
      });
    }
    function end() {
      setKeys(null);
      const p = pct(ok, items.length);
      fill(g.box, gameHeader(title, items.length, items.length, exitGame),
        h('section', { class: 'card summary' },
          h('div', { class: 'score' + (p >= 80 ? ' good' : p >= 50 ? ' mid' : ' low') }, h('strong', null, ok + ' / ' + items.length), h('span', null, p + ' %')),
          failed.length ? h('div', null, h('h4', null, 'Para repasar'), h('ul', { class: 'mini-list col' }, failed.map(f => h('li', null, h('strong', null, f.review), h('span', { class: 'muted' }, f.explain ? rich(f.explain) : ''))))) : h('h3', null, 'Perfekt!'),
          h('div', { class: 'row end wrap' }, h('button', { class: 'btn', type: 'button', onclick: exitGame }, 'Juegos'), h('button', { class: 'btn primary', type: 'button', onclick: () => g.again() }, 'Otra ronda'))));
    }
    game = g;
    return g;
  }
  function startCases() {
    const items = shuffle(DATA.caseDrills).slice(0, 15).map(d => {
      const [a, b] = d.s.split('___');
      const full = a + d.a + b;
      return {
        options: shuffle(d.o), answer: d.a, explain: d.e, say: full, review: full,
        prompt: () => h('div', { class: 'prompt' }, h('span', { class: 'plabel' }, 'Completa la frase'),
          h('div', { class: 'pbig sentence' }, a, h('span', { class: 'blank' }, '___'), b)),
        reveal: el => { const bl = el.querySelector('.blank'); bl.textContent = d.a; bl.classList.add('filled'); }
      };
    });
    const g = runMC('Casos en frases', items); g.again = startCases; go('practice', 'game');
  }
  function startPrepCase() {
    const opts = ['Akkusativ', 'Dativ', 'Wechsel (Akk/Dat)', 'Genitiv'];
    const items = shuffle(DATA.preps).slice(0, 15).map(p => ({
      options: opts, answer: CASES[p.c], explain: p.ex, say: p.ex.split('→')[0], review: p.p + ' → ' + CASES[p.c],
      prompt: () => h('div', { class: 'prompt' }, h('span', { class: 'plabel' }, '¿Qué caso rige?'), h('div', { class: 'pbig de' }, p.p), h('div', { class: 'muted center' }, p.es))
    }));
    const g = runMC('Preposición → caso', items); g.again = startPrepCase; go('practice', 'game');
  }
  function startVerbPrep() {
    const combos = [...new Set(DATA.verbPreps.map(x => x.p + ' + ' + CASE_SHORT[x.c]))];
    const items = shuffle(DATA.verbPreps).slice(0, 15).map(x => {
      const right = x.p + ' + ' + CASE_SHORT[x.c];
      const swapped = x.p + ' + ' + (x.c === 'A' ? 'Dat' : 'Akk');
      const others = shuffle(combos.filter(c => c !== right && c !== swapped)).slice(0, 2);
      return {
        options: shuffle([right, swapped, ...others]), answer: right, explain: x.ex, say: x.ex, review: x.v + ' ' + right + ' — ' + x.es,
        prompt: () => h('div', { class: 'prompt' }, h('span', { class: 'plabel' }, x.es), h('div', { class: 'pbig de' }, x.v + ' ', h('span', { class: 'blank' }, '___')))
      };
    });
    const g = runMC('Verbos con preposición', items); g.again = startVerbPrep; go('practice', 'game');
  }

  /* =========================================================
     GRAMÁTICA
     ========================================================= */
  const COLCLS = { m: 'c-der', f: 'c-die', n: 'c-das', pl: 'c-pl' };
  function tableEl(t) {
    const cols = t.cols || [];
    const hasHead = t.head && t.head.some(Boolean);
    return h('div', { class: 'tablewrap' }, h('table', { class: 'gram' },
      hasHead ? h('thead', null, h('tr', null, t.head.map((c, i) => h('th', { class: COLCLS[cols[i]] || null }, c)))) : null,
      h('tbody', null, t.rows.map(r => h('tr', null, r.map((c, i) => h(i === 0 && t.head && t.head[0] === '' ? 'th' : 'td', { class: COLCLS[cols[i]] || null }, rich(c))))))));
  }
  function sectionEl(s) {
    return h('section', { class: 'card gsec' }, s.h ? h('h3', null, s.h) : null,
      s.p ? h('p', null, rich(s.p)) : null,
      s.table ? tableEl(s.table) : null,
      s.list ? h('ul', { class: 'glist' }, s.list.map(x => h('li', null, rich(x)))) : null,
      s.note ? h('p', { class: 'gnote' }, rich(s.note)) : null);
  }
  function verbTable(list) {
    return h('div', { class: 'tablewrap' }, h('table', { class: 'gram verbs' },
      h('thead', null, h('tr', null, ['Infinitiv', 'Español', 'Präsens (er)', 'Präteritum', 'Partizip II', ''].map(x => h('th', null, x)))),
      h('tbody', null, list.map(v => h('tr', null, h('th', null, v.inf), h('td', { class: 'muted' }, v.es), h('td', null, v.pr), h('td', null, v.pt),
        h('td', null, h('span', { class: 'aux' }, v.aux.startsWith('sein') ? (v.aux.includes('/') ? 'ist/hat' : 'ist') : (v.aux.includes('/') ? 'hat/ist' : 'hat')), ' ', v.p2),
        h('td', null, speakBtn(() => v.inf + ', ' + v.pt + ', ' + v.p2)))))));
  }
  function dynamicTopic(kind) {
    const out = [];
    if (kind === 'preps') {
      for (const c of ['A', 'D', 'W', 'G']) {
        out.push(h('section', { class: 'card gsec' }, h('h3', null, CASES[c] + (c === 'W' ? ' — Wechselpräpositionen' : '')),
          c === 'W' ? h('p', null, rich('**Wohin?** (movimiento / cambio de lugar) → **Akkusativ**. **Wo?** (posición) → **Dativ**.')) : null,
          c === 'G' ? h('p', null, rich('En el habla informal muchas veces se usan con Dativ (*wegen dem Wetter*), pero lo correcto es el Genitiv.')) : null,
          h('div', { class: 'tablewrap' }, h('table', { class: 'gram' }, h('thead', null, h('tr', null, h('th', null, 'Präp.'), h('th', null, 'Español'), h('th', null, 'Ejemplo'))),
            h('tbody', null, DATA.preps.filter(p => p.c === c).map(p => h('tr', null, h('th', null, p.p), h('td', null, p.es), h('td', null, p.ex, ' ', speakBtn(p.ex.split('→')[0])))))))));
      }
      out.push(sectionEl({ h: 'Contracciones habituales', table: { head: ['Contracción', 'Forma completa', 'Ejemplo'], rows: [
        ['am', 'an dem', 'am Montag, am Flughafen'], ['ans', 'an das', 'ans Meer'], ['im', 'in dem', 'im Büro'], ['ins', 'in das', 'ins Kino'],
        ['beim', 'bei dem', 'beim Arzt'], ['vom', 'von dem', 'vom Bahnhof'], ['zum', 'zu dem', 'zum Flughafen'], ['zur', 'zu der', 'zur Arbeit'], ['aufs', 'auf das', 'aufs Land']] } }));
      out.push(sectionEl({ h: 'Verbos de posición (Wechselpräpositionen)', table: { head: ['Wohin? + Akk (acción, regular)', 'Wo? + Dat (estado, irregular)'], rows: [
        ['legen (tumbar, poner) — hat gelegt', 'liegen (estar tumbado) — hat gelegen'], ['stellen (poner de pie) — hat gestellt', 'stehen (estar de pie) — hat gestanden'],
        ['setzen (sentar) — hat gesetzt', 'sitzen (estar sentado) — hat gesessen'], ['hängen (colgar) — hat gehängt', 'hängen (estar colgado) — hat gehangen'],
        ['stecken (meter) — hat gesteckt', 'stecken (estar metido) — hat gesteckt']] } }));
      out.push(h('div', { class: 'row end' }, h('button', { class: 'btn primary', type: 'button', onclick: () => startPrepCase() }, 'Practicar preposiciones'), h('button', { class: 'btn', type: 'button', onclick: () => startCases() }, 'Practicar casos en frases')));
    }
    if (kind === 'verbPreps') {
      let filter = '';
      const tbody = h('tbody');
      const draw = () => fill(tbody, ...DATA.verbPreps.filter(x => !filter || x.c === filter).slice().sort((a, b) => a.p.localeCompare(b.p) || a.v.localeCompare(b.v)).map(x =>
        h('tr', null, h('th', null, x.v), h('td', { class: 'nowrap' }, h('strong', null, x.p), ' + ', h('span', { class: x.c === 'A' ? 'case-a' : 'case-d' }, CASE_SHORT[x.c])), h('td', null, x.es), h('td', null, x.ex, ' ', speakBtn(x.ex)))));
      draw();
      out.push(h('section', { class: 'card gsec' },
        h('div', { class: 'row between wrap' }, h('h3', null, 'Verbos con preposición fija'), seg([{ value: '', label: 'Todos' }, { value: 'A', label: '+ Akk' }, { value: 'D', label: '+ Dat' }], '', v => { filter = v; draw(); })),
        h('p', { class: 'gnote' }, rich('Pregunta por cosas: **wo(r) + preposición** → *Worauf wartest du? — Darauf.* Por personas: *Auf wen wartest du?*')),
        h('div', { class: 'tablewrap' }, h('table', { class: 'gram' }, h('thead', null, h('tr', null, ['Verbo', 'Prep.', 'Español', 'Ejemplo'].map(x => h('th', null, x)))), tbody))));
      out.push(h('div', { class: 'row end' }, h('button', { class: 'btn primary', type: 'button', onclick: () => startVerbPrep() }, 'Practicar')));
    }
    if (kind === 'verbs') {
      const q = textInput({ type: 'search', placeholder: 'Buscar verbo o significado…', class: 'search' });
      const wrap = h('div');
      const draw = () => { const f = fold(q.value.trim()); fill(wrap, verbTable(DATA.verbs.filter(v => !f || fold(v.inf + ' ' + v.es + ' ' + v.pt + ' ' + v.p2).includes(f)))); };
      q.addEventListener('input', draw); draw();
      out.push(h('section', { class: 'card gsec' }, h('div', { class: 'row between wrap' }, h('h3', null, DATA.verbs.length + ' verbos irregulares y separables frecuentes'), q), wrap));
      out.push(sectionEl({ h: 'Notas', list: DATA.verbNotes }));
      out.push(h('div', { class: 'row end' }, h('button', { class: 'btn primary', type: 'button', onclick: () => go('practice', 'verbs') }, 'Practicar verbos')));
    }
    return out;
  }
  function renderGrammar() {
    const topics = DATA.grammar;
    const cur = topics.find(t => t.id === route.sub) || topics[0];
    const listEl = h('nav', { class: 'topics', 'aria-label': 'Temas' }, topics.map(t => h('button', {
      type: 'button', class: 'topic' + (t === cur ? ' on' : ''), onclick: () => { route.sub = t.id; render(); $('#main').scrollTo?.(0, 0); window.scrollTo(0, 0); }
    }, h('strong', null, t.title), h('small', null, t.sub))));
    const content = h('div', { class: 'gcontent' }, h('header', { class: 'vh' }, h('div', null, h('h1', null, cur.title), h('p', { class: 'muted' }, cur.sub))),
      cur.dynamic ? dynamicTopic(cur.dynamic) : cur.sections.map(sectionEl),
      ['pronomen', 'artikel', 'possessiv'].includes(cur.id) ? h('div', { class: 'row end' }, h('button', { class: 'btn primary', type: 'button', onclick: () => startCases() }, 'Practicar casos en frases')) : null);
    setTimeout(() => listEl.querySelector('.on')?.scrollIntoView({ block: 'nearest', inline: 'center' }), 0);
    return h('div', { class: 'view grammar' }, listEl, content);
  }

  /* =========================================================
     AJUSTES · COPIAS · IMPORTACIÓN
     ========================================================= */
  function stamp() { return dayKey().replace(/-/g, ''); }
  async function deliver(blob, filename) {
    const file = typeof File !== 'undefined' ? new File([blob], filename, { type: blob.type }) : null;
    if (file && navigator.canShare && navigator.canShare({ files: [file] }) && /iPad|iPhone|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document) {
      try { await navigator.share({ files: [file], title: filename }); return true; }
      catch (e) { if (e.name === 'AbortError') return false; }
    }
    const url = URL.createObjectURL(blob);
    const a = h('a', { href: url, download: filename, rel: 'noopener' });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return true;
  }
  async function exportJSON() {
    const data = { app: 'deutsch-master', version: 1, exported: new Date().toISOString(), words: S.words, days: S.days, verbStats: S.verbStats };
    const ok = await deliver(new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' }), 'deutsch-backup-' + stamp() + '.json');
    if (ok) { S.settings.lastBackup = Date.now(); save(); toast('Copia exportada'); if (route.view !== 'practice') render(); }
  }
  function csvCell(v) {
    let s = String(v == null ? '' : v);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;                 // evita inyección de fórmulas en Excel
    return /[;"\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  async function exportCSV() {
    const rows = [['articulo', 'aleman', 'plural', 'espanol', 'ejemplo', 'etiquetas', 'tipo']]
      .concat(S.words.map(w => [w.art, w.de, w.pl, w.es, w.ex, w.tags.join(', '), w.type]));
    const txt = '﻿' + rows.map(r => r.map(csvCell).join(';')).join('\r\n');
    await deliver(new Blob([txt], { type: 'text/csv;charset=utf-8' }), 'deutsch-vocabulario-' + stamp() + '.csv');
  }
  function parseCSV(text) {
    text = text.replace(/^﻿/, '');
    const first = text.split(/\r?\n/, 1)[0] || '';
    const delim = (first.match(/;/g) || []).length >= (first.match(/,/g) || []).length ? ';' : (first.includes('\t') ? '\t' : ',');
    const rows = []; let row = [], cell = '', q = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; continue; }
      if (ch === '"') q = true;
      else if (ch === delim) { row.push(cell); cell = ''; }
      else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; if (rows.length > LIMITS.words + 1) break; }
      else cell += ch;
    }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    return rows.filter(r => r.some(c => c.trim()));
  }
  function csvToWords(rows) {
    if (!rows.length) return [];
    const norm = s => fold(s).replace(/[^a-z]/g, '');
    const MAP = { articulo: 'art', artikel: 'art', art: 'art', article: 'art', aleman: 'de', deutsch: 'de', wort: 'de', german: 'de', palabra: 'de',
      plural: 'pl', espanol: 'es', spanisch: 'es', spanish: 'es', traduccion: 'es', significado: 'es', ejemplo: 'ex', beispiel: 'ex', example: 'ex',
      etiquetas: 'tags', etiqueta: 'tags', tags: 'tags', tipo: 'type', typ: 'type', type: 'type' };
    let cols = ['art', 'de', 'pl', 'es', 'ex', 'tags', 'type'];
    const headerHits = rows[0].filter(c => MAP[norm(c)]).length;
    if (headerHits >= 2) { cols = rows[0].map(c => MAP[norm(c)] || null); rows = rows.slice(1); }
    const TYPEMAP = { n: 'n', sustantivo: 'n', nomen: 'n', v: 'v', verbo: 'v', verb: 'v', a: 'a', adjetivo: 'a', adjektiv: 'a', x: 'x', otro: 'x', andere: 'x' };
    return rows.map(r => {
      const o = {};
      cols.forEach((k, i) => { if (k && r[i] != null) o[k] = r[i].trim().replace(/^'(?=[=+\-@])/, ''); });
      o.art = (o.art || '').toLowerCase();
      let de = clean(o.de, LIMITS.str);
      const m = /^(der|die|das)\s+/i.exec(de);
      if (m) { if (!o.art) o.art = m[1].toLowerCase(); de = de.slice(m[0].length); }
      o.type = TYPEMAP[norm(o.type || '')] || (ARTS.includes(o.art) ? 'n' : 'x');
      if (o.type === 'n') { de = cap(de); const p = parsePlural(o.pl || '', de); o.pl = p.err ? '' : p.pl; }
      o.de = de;
      o.tags = (o.tags || '').split(/[,|]/);
      return o;
    });
  }
  async function importFile(file) {
    if (!file) return;
    if (file.size > LIMITS.file) { toast('Archivo demasiado grande (máx. 5 MB)', 'err'); return; }
    let text;
    try { text = await file.text(); } catch (e) { toast('No se pudo leer el archivo', 'err'); return; }
    const isJSON = /\.json$/i.test(file.name) || /^\s*[{[]/.test(text);
    if (isJSON) {
      let d;
      try { d = JSON.parse(text); } catch (e) { toast('El archivo JSON no es válido', 'err'); return; }
      if (Array.isArray(d)) d = { words: d };
      if (!d || typeof d !== 'object' || !Array.isArray(d.words)) { toast('No parece una copia de Deutsch Master', 'err'); return; }
      const choice = await dialog('Importar copia', 'Contiene ' + d.words.length + ' palabras. ¿Cómo quieres importarla?', [
        { label: 'Cancelar', value: null }, { label: 'Añadir a lo actual', value: 'merge', cls: 'primary' }, { label: 'Reemplazar todo', value: 'replace', cls: 'danger' }]);
      if (!choice) return;
      if (choice === 'replace') {
        if (!(await confirmDlg('Reemplazar todo', 'Se borrará tu vocabulario y progreso actuales y se sustituirán por la copia. ¿Continuar?', 'Reemplazar', true))) return;
        const keep = S.settings;
        S = sanitizeState(Object.assign({}, d, { settings: keep }));
        save(); toast(S.words.length + ' palabras importadas'); render(); return;
      }
      const r = mergeWords(d.words, true);
      save(); toast(r.added + ' añadidas · ' + r.dup + ' duplicadas' + (r.bad ? ' · ' + r.bad + ' no válidas' : '')); render();
      return;
    }
    const words = csvToWords(parseCSV(text));
    if (!words.length) { toast('No se encontraron filas en el CSV', 'err'); return; }
    const r = mergeWords(words, false);
    save(); toast(r.added + ' añadidas · ' + r.dup + ' duplicadas' + (r.bad ? ' · ' + r.bad + ' no válidas' : '')); render();
  }

  function renderSettings() {
    const st = S.settings;
    const fileIn = h('input', { type: 'file', accept: '.json,.csv,.txt,application/json,text/csv', class: 'hidden', onchange: e => { importFile(e.target.files[0]); e.target.value = ''; } });
    const voiceSel = h('select', { 'aria-label': 'Voz', onchange: e => { st.voice = e.target.value; save(); } },
      h('option', { value: '' }, 'Automática (alemán)'), voices.map(v => h('option', { value: v.voiceURI }, v.name + ' (' + v.lang + ')')));
    voiceSel.value = voices.some(v => v.voiceURI === st.voice) ? st.voice : '';
    const rateLbl = h('span', { class: 'muted' }, st.rate.toFixed(2) + '×');
    const rate = h('input', { type: 'range', min: '0.5', max: '1.3', step: '0.05', value: String(st.rate), oninput: e => { st.rate = +e.target.value; rateLbl.textContent = st.rate.toFixed(2) + '×'; }, onchange: () => save() });
    const persistEl = h('span', { class: 'muted' }, 'comprobando…');
    if (navigator.storage?.persisted) navigator.storage.persisted().then(p => { persistEl.textContent = p ? 'Almacenamiento persistente concedido ✓' : 'Persistencia no garantizada por el sistema: exporta copias con regularidad.'; }).catch(() => { persistEl.textContent = '—'; });
    else persistEl.textContent = '—';

    return h('div', { class: 'view' },
      h('header', { class: 'vh' }, h('div', null, h('h1', null, 'Ajustes'))),
      h('div', { class: 'grid2' },
        h('section', { class: 'card' }, h('h3', null, 'Copia de seguridad'),
          h('p', { class: 'muted' }, st.lastBackup ? 'Última copia: ' + new Date(st.lastBackup).toLocaleString('es-ES') : 'Aún no has hecho ninguna copia.'),
          h('div', { class: 'row wrap' },
            h('button', { class: 'btn primary', type: 'button', onclick: () => exportJSON() }, 'Exportar copia (JSON)'),
            h('button', { class: 'btn', type: 'button', onclick: () => exportCSV() }, 'Exportar CSV (Excel)'),
            h('button', { class: 'btn', type: 'button', onclick: () => fileIn.click() }, 'Importar JSON o CSV'), fileIn),
          h('p', { class: 'hint' }, 'En el iPad, «Exportar» abre el menú Compartir: elige «Guardar en Archivos» (iCloud Drive). El CSV admite las columnas articulo; aleman; plural; espanol; ejemplo; etiquetas; tipo — así puedes preparar listas en Excel e importarlas de golpe.')),
        h('section', { class: 'card' }, h('h3', null, 'Mazos de vocabulario'),
          Object.entries(DATA.decks).map(([id, d]) => {
            const existing = new Set(S.words.map(wkey));
            const fresh = deckWords(id).filter(w => !existing.has(wkey(sanitizeWord(w)))).length;
            return h('div', { class: 'deck' }, h('div', null, h('strong', null, d.name), h('small', { class: 'muted' }, d.items.length + ' palabras · etiqueta «' + d.tag + '»' + (fresh < d.items.length ? ' · ' + fresh + ' nuevas' : ''))),
              h('button', { class: 'btn small', type: 'button', disabled: !fresh, onclick: () => loadDeck(id) }, fresh ? 'Añadir' : 'Añadido'));
          })),
        h('section', { class: 'card' }, h('h3', null, 'Voz y práctica'),
          toggle('Pronunciar la respuesta automáticamente', st.autoSpeak, v => { st.autoSpeak = v; save(); }),
          hasTTS ? [field('Voz alemana', voiceSel, voices.length ? '' : 'Si no aparece ninguna, descárgala en Ajustes del iPad → Accesibilidad → Contenido leído → Voces → Alemán.'),
            field('Velocidad', h('div', { class: 'row' }, rate, rateLbl)),
            h('button', { class: 'btn small', type: 'button', onclick: () => speak('Guten Abend! Ich lerne jeden Tag Deutsch.') }, 'Probar voz')] : h('p', { class: 'muted' }, 'Este navegador no ofrece síntesis de voz.')),
        h('section', { class: 'card' }, h('h3', null, 'Privacidad y seguridad'),
          h('ul', { class: 'glist' },
            h('li', null, rich('Tus datos se guardan **solo en este dispositivo**: la app no envía nada a ningún servidor, no tiene analítica ni cuentas.')),
            h('li', null, 'No carga recursos externos (fuentes, CDN…). Una política de seguridad (CSP) bloquea cualquier script o conexión ajenos a la propia app.'),
            h('li', null, 'Las importaciones se validan y se limpian antes de guardarse; el texto nunca se interpreta como código.'),
            h('li', null, 'El CSV exportado está protegido frente a fórmulas maliciosas al abrirlo en Excel.'),
            h('li', null, 'Funciona sin conexión una vez instalada en la pantalla de inicio.')),
          h('p', null, persistEl)),
        h('section', { class: 'card danger-zone' }, h('h3', null, 'Datos'),
          h('p', { class: 'muted' }, S.words.length + ' palabras · ' + Object.keys(S.days).length + ' días con actividad'),
          h('div', { class: 'row wrap' },
            h('button', { class: 'btn', type: 'button', onclick: async () => {
              if (await confirmDlg('Reiniciar progreso', 'Se mantienen las palabras, pero se borran cajas, estadísticas y racha. ¿Continuar?', 'Reiniciar', true)) {
                S.words.forEach(w => Object.assign(w, { box: 0, due: 0, seen: 0, ok: 0, ko: 0, gOk: 0, gKo: 0 })); S.days = {}; S.verbStats = {}; save(); toast('Progreso reiniciado'); render();
              } } }, 'Reiniciar progreso'),
            h('button', { class: 'btn danger', type: 'button', onclick: async () => {
              if (!(await confirmDlg('Borrar todo', 'Se borrarán TODAS las palabras y el progreso de este dispositivo.', 'Continuar', true))) return;
              if (!(await confirmDlg('¿Seguro?', 'Esta acción no se puede deshacer. Si no tienes copia, exporta antes.', 'Borrar definitivamente', true))) return;
              const keep = S.settings; S = defaults(); S.settings = keep; save(); toast('Datos borrados'); render();
            } }, 'Borrar todo'))),
        h('section', { class: 'card' }, h('h3', null, 'Acerca de'), h('p', { class: 'muted' }, 'Deutsch Master v' + VERSION + ' · A2/B1'))));
  }

  /* =========================================================
     ARRANQUE
     ========================================================= */
  window.addEventListener('storage', e => { if (e.key === KEY) { S = load(); if (route.view !== 'practice') render(); } });
  render();
  if (navigator.storage?.persist) navigator.storage.persist().catch(() => {});
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
