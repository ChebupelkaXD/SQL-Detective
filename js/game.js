/* SQL Detective — game UI. Everything runs locally in the browser (SQLite via sql.js, asm build). */
(function () {
  'use strict';
  const { CASES, MANUAL } = window.SQLD;
  const CH = window.SQLD_CHARS;

  /* ------------------------------------------------------------ helpers */
  const $ = (s, r) => (r || document).querySelector(s);
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function el(tag, props, html) {
    const e = document.createElement(tag);
    if (props) Object.keys(props).forEach((k) => { if (k === 'on') Object.keys(props.on).forEach((ev) => e.addEventListener(ev, props.on[ev])); else if (k in e) e[k] = props[k]; else e.setAttribute(k, props[k]); });
    if (html != null) e.innerHTML = html;
    return e;
  }
  const store = {
    get(k, d) { try { const v = localStorage.getItem('sqld.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('sqld.' + k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };
  const I18N = window.SQLD_I18N;
  const settings = Object.assign({ sound: true, crt: true, bg: 'teal', lang: ((navigator.language || 'en').toLowerCase().indexOf('ru') === 0) ? 'ru' : 'en' }, store.get('settings', {}));
  function t(k) {
    const a = arguments, d = (I18N[settings.lang] || I18N.en).ui;
    const s0 = d[k] != null ? d[k] : (I18N.en.ui[k] != null ? I18N.en.ui[k] : k);
    return s0.replace(/\{(\d+)\}/g, (m, i) => (a[+i + 1] != null ? a[+i + 1] : ''));
  }
  function rowsText(n) {
    if (settings.lang === 'ru') { const m10 = n % 10, m100 = n % 100; return t(m10 === 1 && m100 !== 11 ? 'row_one' : (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) ? 'row_few' : 'row_many', n); }
    return t(n === 1 ? 'row_one' : 'row_many', n);
  }
  function loc(c) { const r = settings.lang === 'ru' && I18N.ru.cases[c.id]; return r ? Object.assign({}, c, r) : c; }
  function MN(k) { return (settings.lang === 'ru' && I18N.ru.manual[k]) || MANUAL[k]; }
  const C = () => loc(G.c);
  let progress = store.get('progress', { done: {}, unlockAll: false });
  function applyBg() {
    const w = window.SQLD_WALLPAPERS.find((x) => x.id === settings.bg) || window.SQLD_WALLPAPERS[0];
    ['#desktop', '#screen-cases'].forEach((q) => { const e = $(q); if (e) e.style.background = w.css; });
  }
  function saveSettings() { store.set('settings', settings); document.body.classList.toggle('crt', settings.crt); applyBg(); }
  function saveProgress() { store.set('progress', progress); }

  /* ------------------------------------------------------------ sound */
  let actx = null;
  function tone(f, d, type, vol, delay) {
    if (!settings.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = actx.currentTime + (delay || 0);
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type || 'square'; o.frequency.value = f;
      g.gain.setValueAtTime(vol || 0.04, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
      o.connect(g); g.connect(actx.destination); o.start(t0); o.stop(t0 + d + 0.02);
    } catch (e) { /* no audio */ }
  }
  const sfx = {
    click() { tone(560, 0.05); },
    key() { tone(900 + Math.random() * 200, 0.02, 'square', 0.015); },
    ok() { [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.18, 'triangle', 0.06, i * 0.12)); },
    bad() { tone(150, 0.25, 'sawtooth', 0.06); tone(110, 0.3, 'sawtooth', 0.06, 0.12); },
    open() { tone(420, 0.04); tone(640, 0.05, 'square', 0.04, 0.05); }
  };

  /* ------------------------------------------------------------ stage scaling */
  const stage = $('#stage');
  function fit() { stage.style.transform = 'scale(' + Math.min(innerWidth / 1280, innerHeight / 720) + ')'; }
  addEventListener('resize', fit); fit();
  const scale = () => Math.min(innerWidth / 1280, innerHeight / 720);

  /* ------------------------------------------------------------ game state */
  let SQL = null;
  let G = null; // per-case state

  function typeOf(rows, i) {
    for (const r of rows) { const v = r[i]; if (v != null) return typeof v === 'number' ? (Number.isInteger(v) ? 'INTEGER' : 'REAL') : 'TEXT'; }
    return 'TEXT';
  }
  function buildDb(c) {
    const db = new SQL.Database();
    Object.keys(c.tables).forEach((name) => {
      const t = c.tables[name];
      db.run('CREATE TABLE ' + name + ' (' + t.columns.map((col, i) => col + ' ' + typeOf(t.rows, i)).join(', ') + ')');
      const st = db.prepare('INSERT INTO ' + name + ' VALUES (' + t.columns.map(() => '?').join(',') + ')');
      t.rows.forEach((r) => st.run(r));
      st.free();
    });
    return db;
  }
  function schema() {
    const out = {};
    const res = G.db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY rowid");
    (res[0] ? res[0].values : []).forEach((r) => {
      const info = G.db.exec('PRAGMA table_info(' + r[0] + ')')[0];
      out[r[0]] = info.values.map((v) => v[1]);
    });
    return out;
  }
  function rowObj(columns, values) { const o = {}; columns.forEach((c, i) => { o[c] = values[i]; }); return o; }

  /* ------------------------------------------------------------ window manager */
  const winlayer = $('#winlayer'), taskbar = $('#taskbar');
  let wins = {}, zTop = 10, cascade = 0;

  function resetDesktop() {
    wins = {}; zTop = 10; cascade = 0;
    winlayer.innerHTML = ''; taskbar.innerHTML = '';
    taskbar.appendChild(el('div', { className: 'tcase' }, esc(t('taskbar_case', G.c.id, C().title))));
    taskbar.appendChild(el('div', { className: 'clock', id: 'clock' }, '9:41 AM'));
  }
  function focusWin(w) {
    w.el.style.zIndex = ++zTop; w.el.classList.remove('hidden');
    Object.keys(wins).forEach((k) => wins[k].btn.classList.toggle('active', wins[k] === w));
  }
  function closeWin(id) {
    const w = wins[id]; if (!w) return;
    w.el.remove(); w.btn.remove(); delete wins[id];
  }
  function openWin(id, title, build, opt) {
    opt = opt || {};
    if (wins[id]) { focusWin(wins[id]); return wins[id]; }
    sfx.open();
    const w = { id };
    const node = el('div', { className: 'win' + (opt.nob ? ' nob' : '') });
    node.style.width = (opt.w || 520) + 'px'; node.style.height = (opt.h || 360) + 'px';
    const n = cascade++ % 7;
    node.style.left = (opt.x != null ? opt.x : 215 + n * 30) + 'px';
    node.style.top = (opt.y != null ? opt.y : 24 + n * 30) + 'px';
    const tb = el('div', { className: 'tb' });
    const tt = el('span', { className: 'tt' }, esc(title));
    const tc = el('span', { className: 'tc' });
    const bMin = el('b', { title: 'Minimize' }, '_'), bClose = el('b', { title: 'Close' }, '×');
    tc.append(bMin, bClose); tb.append(tt, tc);
    const body = el('div', { className: 'wb' });
    node.append(tb, body);
    winlayer.appendChild(node);
    const btn = el('button', { className: 'tbtn' }, esc(title));
    taskbar.insertBefore(btn, $('#clock'));
    w.el = node; w.body = body; w.btn = btn; w.tt = tt;
    wins[id] = w;
    bClose.addEventListener('click', (e) => { e.stopPropagation(); sfx.click(); closeWin(id); });
    bMin.addEventListener('click', (e) => { e.stopPropagation(); sfx.click(); node.classList.add('hidden'); btn.classList.remove('active'); });
    btn.addEventListener('click', () => { sfx.click(); if (node.classList.contains('hidden') || !btn.classList.contains('active')) focusWin(w); else { node.classList.add('hidden'); btn.classList.remove('active'); } });
    node.addEventListener('mousedown', () => focusWin(w));
    // dragging
    tb.addEventListener('pointerdown', (e) => {
      if (e.target === bMin || e.target === bClose) return;
      const sx = e.clientX, sy = e.clientY, ox = node.offsetLeft, oy = node.offsetTop, k = scale();
      tb.setPointerCapture(e.pointerId);
      const move = (ev) => {
        node.style.left = Math.max(-node.offsetWidth + 80, Math.min(1280 - 80, ox + (ev.clientX - sx) / k)) + 'px';
        node.style.top = Math.max(0, Math.min(686 - 30, oy + (ev.clientY - sy) / k)) + 'px';
      };
      const up = () => { tb.removeEventListener('pointermove', move); tb.removeEventListener('pointerup', up); };
      tb.addEventListener('pointermove', move); tb.addEventListener('pointerup', up);
    });
    build(body, w);
    focusWin(w);
    return w;
  }

  /* ------------------------------------------------------------ tables & dossiers */
  function cellHtml(v) {
    if (v == null) return '<td class="null">NULL</td>';
    if (typeof v === 'number') return '<td class="num">' + v + '</td>';
    return '<td>' + esc(v) + '</td>';
  }
  function tableView(columns, rows, infoText) {
    const wrap = el('div', { style: 'display:flex;flex-direction:column;height:100%' });
    const scroll = el('div', { className: 'tbl-wrap', style: 'flex:1;overflow:auto;padding:4px 6px;user-select:text' });
    let h = '<table class="data"><thead><tr>' + columns.map((c) => '<th>' + esc(c) + '</th>').join('') + '</tr></thead><tbody>';
    rows.forEach((r, i) => { h += '<tr data-i="' + i + '">' + r.map(cellHtml).join('') + '</tr>'; });
    h += '</tbody></table>';
    scroll.innerHTML = h;
    const hasName = columns.indexOf('first_name') >= 0 && columns.indexOf('last_name') >= 0;
    scroll.addEventListener('click', (e) => {
      const tr = e.target.closest('tr[data-i]'); if (!tr) return;
      scroll.querySelectorAll('tr.sel').forEach((x) => x.classList.remove('sel')); tr.classList.add('sel');
    });
    scroll.addEventListener('dblclick', (e) => {
      const tr = e.target.closest('tr[data-i]'); if (!tr || !hasName) return;
      openDossier(rowObj(columns, rows[+tr.dataset.i]));
    });
    const info = el('div', { className: 'tbl-info' }, esc(infoText) + (hasName ? esc(t('dbl_hint')) : ''));
    wrap.append(scroll, info);
    return wrap;
  }
  function openTable(name) {
    const res = G.db.exec('SELECT * FROM ' + name)[0] || { columns: [], values: [] };
    openWin('tbl:' + name, name, (b) => { b.appendChild(tableView(res.columns, res.values, rowsText(res.values.length))); }, { nob: true, w: Math.min(760, 120 + res.columns.length * 118), h: 400 });
  }
  function openDossier(o) {
    const nm = o.first_name + ' ' + o.last_name;
    const look = CH.lookFor(o);
    const no = 10000 + (CH.hash(nm) % 90000);
    openWin('dos:' + nm, t('w_file', nm), (b) => {
      let dl = '';
      Object.keys(o).forEach((k) => { if (k === 'first_name' || k === 'last_name') return; dl += '<dt>' + esc(k.replace(/_/g, ' ')) + ':</dt><dd>' + esc(o[k] == null ? '—' : o[k]) + '</dd>'; });
      b.innerHTML = '<div class="dossier"><div class="pic">' + CH.person(look, { holdSign: String(no) }) + '</div><div style="flex:1"><h3>' + esc(nm) + '</h3><dl>' + dl + '</dl></div></div>';
    }, { nob: true, w: 470, h: 330, x: 420, y: 80 });
  }

  /* ------------------------------------------------------------ query tool */
  const KW = new Set('select from where and or not like between in is null order by group having limit offset desc asc distinct join on inner left as count sum avg min max case when then else end union all exists cross outer natural using'.split(' '));
  function highlight(sql) {
    const ids = new Set();
    const sc = schema(); Object.keys(sc).forEach((t) => { ids.add(t.toLowerCase()); sc[t].forEach((c) => ids.add(c.toLowerCase())); });
    const re = /('(?:[^']|'')*'?|"[^"]*"?)|(--[^\n]*)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|([\s\S])/g;
    let out = '', m;
    while ((m = re.exec(sql))) {
      if (m[1]) out += '<span class="s">' + esc(m[1]) + '</span>';
      else if (m[2]) out += '<span class="c">' + esc(m[2]) + '</span>';
      else if (m[3]) out += '<span class="n">' + m[3] + '</span>';
      else if (m[4]) { const w = m[4].toLowerCase(); out += KW.has(w) ? '<span class="k">' + esc(m[4]) + '</span>' : ids.has(w) ? '<span class="i">' + esc(m[4]) + '</span>' : esc(m[4]); }
      else out += esc(m[5]);
    }
    return out + '\n';
  }
  function lev(a, b) {
    const d = []; for (let i = 0; i <= a.length; i++) { d[i] = [i]; } for (let j = 0; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  function closest(word, list) {
    let best = null, bd = 99; word = word.toLowerCase();
    list.forEach((x) => { const d = lev(word, x.toLowerCase()); if (d < bd) { bd = d; best = x; } });
    return bd <= Math.max(2, Math.floor(word.length / 3)) ? best : null;
  }
  const B = (s) => '<b>' + esc(s) + '</b>';
  function explain(msg, sql) {
    const sc = schema(), tables = Object.keys(sc);
    let m;
    if ((m = /no such table: (.+)/.exec(msg))) {
      const s1 = closest(m[1], tables);
      return t('e_no_table', esc(m[1])) + (s1 ? t('e_did_you', esc(s1)) : '') + t('e_tables', tables.map(B).join(', '));
    }
    if ((m = /no such column: (.+)/.exec(msg))) {
      const name = m[1].split('.').pop();
      const used = [];
      const re = /\b(?:from|join)\s+([A-Za-z_]\w*)/gi; let tt;
      while ((tt = re.exec(sql))) if (sc[tt[1]]) used.push(tt[1]);
      const cols = []; (used.length ? used : tables).forEach((u) => sc[u].forEach((c) => { if (cols.indexOf(c) < 0) cols.push(c); }));
      const s1 = closest(name, cols);
      return t('e_no_col', esc(m[1])) + (s1 ? t('e_did_you', esc(s1)) : '') + t('e_cols', cols.map(B).join(', ')) + t('e_quote_tip', esc(name));
    }
    if ((m = /ambiguous column name: (.+)/.exec(msg))) return t('e_ambig', esc(m[1]), esc('m.' + m[1]));
    if (/incomplete input/.test(msg)) return t('e_incomplete');
    if ((m = /unrecognized token: "(.*)"/.exec(msg))) return t('e_token', esc(m[1]));
    if (/misuse of aggregate/.test(msg)) return t('e_aggr');
    if (/GROUP BY|aggregate/i.test(msg)) return t('e_group', esc(msg));
    if ((m = /near "(.*)": syntax error/.exec(msg))) {
      const tok = m[1];
      let tips;
      if (/^\s*select/i.test(sql) && !/\bfrom\b/i.test(sql)) tips = t('e_need_from', esc(tables[0]));
      else if (/^(where|and|or|order|group|limit|having|join|on)$/i.test(tok)) tips = t('e_kw', esc(tok.toUpperCase()));
      else tips = t('e_other');
      return t('e_stuck', esc(tok)) + tips;
    }
    return t('e_default', esc(msg));
  }
  function runQuery(sql) {
    let q = sql.replace(/--[^\n]*/g, '').trim().replace(/;+\s*$/, '');
    if (!q) throw { friendly: t('q_empty', esc(Object.keys(schema())[0])) };
    if (!/^(select|with)\b/i.test(q)) throw { friendly: t('q_readonly') };
    if (/;/.test(q.replace(/'(?:[^']|'')*'/g, ''))) throw { friendly: t('q_one') };
    try { return { q, res: G.db.exec(q)[0] || { columns: [], values: [] } }; }
    catch (e) { throw { friendly: explain(e.message || String(e), q) }; }
  }
  function showResults(res, q) {
    const count = res.values.length;
    const ttl = () => t('w_results') + ' — ' + rowsText(count);
    const build = (b) => {
      b.innerHTML = '';
      if (!res.columns.length) b.appendChild(el('div', { className: 'paper' }, '<p>' + esc(t('no_results')) + '</p>'));
      else if (!count) {
        const w = el('div', { style: 'display:flex;flex-direction:column;height:100%' });
        w.append(el('div', { className: 'paper', style: 'flex:1' }, t('zero_rows')));
        b.appendChild(w);
      } else b.appendChild(tableView(res.columns, res.values, rowsText(count)));
    };
    const w = wins.results;
    if (w) { build(w.body); focusWin(w); w.tt.textContent = ttl(); w.btn.textContent = t('w_results'); }
    else { const nw = openWin('results', t('w_results'), build, { nob: true, w: Math.min(900, 140 + res.columns.length * 120), h: 360, x: 215, y: 330 }); nw.tt.textContent = ttl(); }
  }
  function openSearch(prefill) {
    openWin('search', t('w_search'), (b, w) => {
      const first = Object.keys(schema())[0];
      b.innerHTML =
        '<div class="q-wrap"><div class="editor"><pre></pre><textarea spellcheck="false" autocomplete="off" autocapitalize="off"></textarea></div>' +
        '<div class="q-err hidden"></div>' +
        '<div class="q-bar"><button class="btn" data-a="hist">' + esc(t('hist_btn')) + '</button>' +
        '<label><input type="checkbox" data-a="save"> ' + esc(t('save_tbl')) + '</label><input type="text" data-a="sname" placeholder="' + esc(t('tbl_ph')) + '" maxlength="24">' +
        '<span class="grow"></span><button class="btn" data-a="go">' + esc(t('submit')) + '</button></div></div>';
      const ta = $('textarea', b), pre = $('pre', b), err = $('.q-err', b), save = $('[data-a=save]', b), sname = $('[data-a=sname]', b);
      const sync = () => { pre.innerHTML = highlight(ta.value); pre.scrollTop = ta.scrollTop; };
      ta.value = prefill || G.lastQuery || ('SELECT *\nFROM ' + first);
      ta.addEventListener('input', () => { sync(); sfx.key(); });
      ta.addEventListener('scroll', () => { pre.scrollTop = ta.scrollTop; });
      ta.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); go(); } if (e.key === 'Tab') { e.preventDefault(); const s = ta.selectionStart; ta.value = ta.value.slice(0, s) + '  ' + ta.value.slice(ta.selectionEnd); ta.selectionStart = ta.selectionEnd = s + 2; sync(); } });
      function go() {
        err.classList.add('hidden');
        try {
          const out = runQuery(ta.value);
          G.lastQuery = ta.value;
          if (G.history[G.history.length - 1] !== ta.value) G.history.push(ta.value);
          if (save.checked) {
            const nmv = (sname.value || '').trim() || ('saved_' + (G.savedN + 1));
            if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(nmv)) throw { friendly: t('err_tblname') };
            if (schema()[nmv]) throw { friendly: t('err_exists', esc(nmv)) };
            try { G.db.run('CREATE TABLE ' + nmv + ' AS ' + out.q); } catch (e) { throw { friendly: explain(e.message, out.q) }; }
            G.savedN++; addIcon('table', nmv, () => openTable(nmv)); save.checked = false; sname.value = '';
            toast(t('saved_toast', nmv), true);
          }
          showResults(out.res, out.q);
          sfx.ok();
        } catch (e) {
          err.innerHTML = '<b>' + esc(t('oops')) + '</b> ' + (e.friendly || esc(e.message || e)); err.classList.remove('hidden'); sfx.bad();
        }
      }
      b.addEventListener('click', (e) => {
        const a = e.target.dataset && e.target.dataset.a;
        if (a === 'go') go();
        if (a === 'hist') openHistory(ta, sync);
      });
      sync();
      setTimeout(() => ta.focus(), 50);
    }, { w: 640, h: 330, x: 330, y: 330 });
    if (prefill && wins.search) { const ta = $('textarea', wins.search.body); ta.value = prefill; ta.dispatchEvent(new Event('input')); }
  }
  function openHistory(ta, sync) {
    const w = openWin('history', t('w_history'), (b) => {
      b.innerHTML = G.history.length ? '' : '<p class="tbl-hint">' + esc(t('hist_empty')) + '</p>';
      G.history.slice().reverse().forEach((q) => {
        const row = el('div', { style: 'padding:6px;border-bottom:1px solid var(--lav-dark);cursor:pointer;font:14px var(--mono);white-space:pre-wrap' }, esc(q));
        row.addEventListener('click', () => { ta.value = q; sync(); closeWin('history'); ta.focus(); });
        row.addEventListener('mouseenter', () => { row.style.background = '#fff'; }); row.addEventListener('mouseleave', () => { row.style.background = ''; });
        b.appendChild(row);
      });
    }, { w: 460, h: 280, x: 400, y: 120 });
    return w;
  }

  /* ------------------------------------------------------------ other apps */
  function openMessages() {
    openWin('messages', t('w_messages'), (b) => {
      let i = 0, typing = null;
      const paras = C().briefing;
      b.innerHTML = '<div class="msg"><div class="face">' + CH.spud('happy') + '</div><div class="txt"><div class="body"></div><div class="nav"><span></span><button class="btn">' + esc(t('next')) + '</button></div></div></div>';
      const body = $('.body', b), nav = $('.nav span', b), next = $('.nav button', b);
      function show() {
        const full = paras[i]; let n = 0; clearInterval(typing);
        const plain = full.replace(/<[^>]+>/g, '');
        body.innerHTML = ''; nav.textContent = (i + 1) + ' / ' + paras.length;
        next.textContent = i === paras.length - 1 ? t('got_it') : t('next');
        // typewriter on visible characters, but keep tags: reveal by progressively slicing the plain length mapping
        typing = setInterval(() => {
          n += 2; let shown = 0, out = '', inTag = false;
          for (let k = 0; k < full.length && shown < n; k++) { const ch = full[k]; out += ch; if (ch === '<') inTag = true; else if (ch === '>') inTag = false; else if (!inTag) shown++; }
          body.innerHTML = out; if (n % 6 === 0) sfx.key();
          if (n >= plain.length) { clearInterval(typing); typing = null; body.innerHTML = full; }
        }, 16);
        body._full = full;
      }
      next.addEventListener('click', () => {
        sfx.click();
        if (typing) { clearInterval(typing); typing = null; body.innerHTML = paras[i]; return; }
        if (i < paras.length - 1) { i++; show(); } else closeWin('messages');
      });
      show();
    }, { nob: true, w: 640, h: 300, x: 300, y: 90 });
  }
  function openClues() {
    openWin('clues', t('i_clues'), (b) => {
      const list = el('div', { className: 'clue-list' });
      C().clues.forEach((cl, i) => {
        const ic = el('div', { className: 'icon' }, CH.ICONS.doc + '<span>' + esc(cl.title) + '</span>');
        ic.addEventListener('dblclick', () => openClue(i)); ic.addEventListener('click', () => { sfx.click(); openClue(i); });
        list.appendChild(ic);
      });
      b.appendChild(list);
    }, { w: 360, h: 220, x: 215, y: 60 });
  }
  function openClue(i) {
    const cl = C().clues[i];
    openWin('clue:' + i, cl.title, (b) => { b.innerHTML = '<div class="paper">' + cl.text + '</div>'; }, { nob: true, w: 480, h: 290, x: 250 + i * 40, y: 120 + i * 30 });
  }
  function openManual() {
    openWin('manual', t('w_manual'), (b) => {
      const pages = G.c.manual;
      const X = (window.SQLD_MANUAL_X[settings.lang] || window.SQLD_MANUAL_X.en);
      const TABC = ['#c0272d', '#e08a1e', '#d9b800', '#3d9a52', '#2f7fc0', '#8e5aa8'];
      b.innerHTML = '<div class="book"><div class="tabs"></div><div class="sheet"><div class="pg"></div><div class="bnav"><button class="btn" data-a="prev"></button><span class="pgno"></span><button class="btn" data-a="next"></button></div></div></div>';
      const tabs = $('.tabs', b), pg = $('.pg', b), prev = $('[data-a=prev]', b), next = $('[data-a=next]', b), pgno = $('.pgno', b);
      let cur = pages.length - 1; // -1 = cover
      function show(i) {
        cur = i;
        const k = pages[i];
        pg.classList.toggle('cover', i < 0);
        if (i < 0) {
          pg.innerHTML = '<div class="cv"><div class="cv-badge">' + CH.spud('happy') + '</div><h2>' + t('man_cover_title') + '</h2><div class="cv-sub">' + t('man_cover_sub') + '</div>' +
            '<div class="cv-own">' + esc(t('man_owner')) + ' <span></span></div><div class="cv-note">' + esc(t('man_cover_note')) + '</div></div>';
        } else {
          const m = MN(k), x = X[k] || {};
          let h = '<div class="kick">' + esc(t('man_chapter', i + 1)) + '</div><h3>' + esc(m.title) + '</h3>';
          if (x.fig && window.SQLD_FIGURES[x.fig]) h += '<div class="figure">' + window.SQLD_FIGURES[x.fig](t) + '</div>';
          h += '<div class="body">' + m.html + '</div>';
          if (x.tip) h += '<div class="tipbox"><div class="face">' + CH.spud('happy') + '</div><div class="tt"><b>' + esc(t('man_tip')) + '</b>' + esc(x.tip) + '</div></div>';
          if (x.recap) h += '<div class="recap"><h4>' + esc(t('man_recap')) + '</h4><ul>' + x.recap.map((r) => '<li>' + esc(r) + '</li>').join('') + '</ul></div>';
          pg.innerHTML = h;
          pg.querySelectorAll('pre').forEach((pre) => { pre.innerHTML = highlight(pre.textContent).replace(/\n$/, ''); });
        }
        pg.scrollTop = 0;
        tabs.querySelectorAll('button').forEach((x) => x.classList.toggle('on', +x.dataset.i === i));
        prev.style.visibility = i < 0 ? 'hidden' : 'visible'; next.style.visibility = i >= pages.length - 1 ? 'hidden' : 'visible';
        prev.textContent = t('man_prev'); next.textContent = t('man_next');
        pgno.textContent = i < 0 ? '' : '— ' + t('man_page', i + 2) + ' —';
      }
      const addTab = (i, label, color) => { const bt = el('button', { 'data-i': i, style: 'background:' + color }, esc(label)); bt.addEventListener('click', () => { sfx.click(); show(i); }); tabs.appendChild(bt); };
      addTab(-1, t('man_cover_tab'), '#2c4a8a');
      pages.forEach((k, i) => addTab(i, (i + 1) + '. ' + MN(k).title, TABC[i % TABC.length]));
      prev.addEventListener('click', () => { sfx.click(); show(cur - 1); });
      next.addEventListener('click', () => { sfx.click(); show(cur + 1); });
      show(cur);
    }, { nob: true, w: 880, h: 540, x: 215, y: 24 });
  }
  function openBrowser() {
    openWin('web', t('w_browser'), (b) => {
      const sites = C().sites; const hist = ['home'];
      b.innerHTML = '<div class="browser"><div class="bar"><button class="btn" data-a="back">◀</button><button class="btn" data-a="home">⌂</button><div class="url"></div></div><div class="page"></div></div>';
      const url = $('.url', b), page = $('.page', b);
      function go(k, push) { if (!sites[k]) return; if (push) hist.push(k); url.textContent = 'http://www.' + k + '.net/'; page.innerHTML = sites[k].html; page.scrollTop = 0; w_title(sites[k].title); }
      function w_title(t) { wins.web.tt.textContent = t + ' — NetSurfer 97'; }
      page.addEventListener('click', (e) => { const a = e.target.closest('[data-go]'); if (a) { sfx.click(); go(a.dataset.go, true); } });
      $('[data-a=back]', b).addEventListener('click', () => { if (hist.length > 1) { hist.pop(); go(hist[hist.length - 1], false); } });
      $('[data-a=home]', b).addEventListener('click', () => go('home', true));
      setTimeout(() => go('home', false), 0);
    }, { nob: true, w: 760, h: 460, x: 220, y: 40 });
  }
  function setLang(l) {
    settings.lang = l; saveSettings();
    document.documentElement.lang = l;
    if (G && !$('#desktop').classList.contains('hidden')) relocalize();
  }
  function relocalize() {
    Object.keys(wins).slice().forEach((id) => { if (id !== 'settings' && id.indexOf('tbl:') !== 0) closeWin(id); });
    Object.keys(wins).slice().forEach((id) => { if (id.indexOf('tbl:') === 0) closeWin(id); });
    buildIcons(); hideBubble();
    const tc = $('.tcase', taskbar); if (tc) tc.textContent = t('taskbar_case', G.c.id, C().title);
    if (wins.settings) { closeWin('settings'); openSettings(); }
  }
  function openSettings() {
    openWin('settings', t('w_settings'), (b) => {
      b.innerHTML = '<div class="paper" style="font:16px/2 var(--ui)"><label><input type="checkbox" data-s="sound"> ' + esc(t('s_sound')) + '</label><br><label><input type="checkbox" data-s="crt"> ' + esc(t('s_crt')) + '</label><br>' +
        '<label>' + esc(t('s_lang')) + ': <select data-s="lang"><option value="en">English</option><option value="ru">Русский</option></select></label><br>' +
        '<div class="bg-h">' + esc(t('s_bg')) + '</div><div class="swatches"></div>' +
        '<button class="btn" data-a="unlock">' + esc(t('s_unlock')) + '</button> <button class="btn" data-a="reset">' + esc(t('s_reset')) + '</button></div>';
      $('[data-s=sound]', b).checked = settings.sound; $('[data-s=crt]', b).checked = settings.crt; $('[data-s=lang]', b).value = settings.lang;
      const sw = $('.swatches', b);
      window.SQLD_WALLPAPERS.forEach((w) => {
        const d = el('div', { className: 'swatch' + (settings.bg === w.id ? ' on' : ''), title: t('bg_' + w.id) });
        d.style.background = w.css;
        d.addEventListener('click', () => { sfx.click(); settings.bg = w.id; saveSettings(); sw.querySelectorAll('.swatch').forEach((x) => x.classList.toggle('on', x === d)); });
        sw.appendChild(d);
      });
      b.addEventListener('change', (e) => {
        const k = e.target.dataset.s; if (!k) return;
        if (k === 'lang') { setLang(e.target.value); return; }
        settings[k] = e.target.checked; saveSettings();
      });
      b.addEventListener('click', (e) => {
        const a = e.target.dataset.a;
        if (a === 'unlock') { progress.unlockAll = true; saveProgress(); toast(t('unlocked_toast'), true); }
        if (a === 'reset' && confirm(t('reset_confirm'))) { progress = { done: {}, unlockAll: false }; saveProgress(); toast(t('reset_toast')); }
      });
    }, { nob: true, w: 460, h: 350, x: 400, y: 90 });
  }

  /* ------------------------------------------------------------ arrest */
  function allPeople() {
    const map = {};
    Object.keys(G.c.tables).forEach((t) => {
      const T = G.c.tables[t], fi = T.columns.indexOf('first_name'), li = T.columns.indexOf('last_name');
      if (fi < 0 || li < 0) return;
      T.rows.forEach((r) => { const k = norm(r[fi] + ' ' + r[li]); if (!map[k]) map[k] = rowObj(T.columns, r); });
    });
    return map;
  }
  const norm = (s) => s.toLowerCase().replace(/[^a-z ]/g, '').replace(/\s+/g, ' ').trim();
  function openArrest() {
    openWin('arrest', t('w_arrest'), (b) => {
      const c = C();
      b.innerHTML = '<div class="paper warrant"><div class="w-top"><span>' + esc(t('f_top')) + '</span><span>' + esc(t('f_case_no', 840000 + c.id * 137)) + '</span></div>' +
        '<div class="w-head">' + t('f_head') + '</div>' +
        '<h2>' + esc(t('f_title')) + '</h2><h4>' + esc(t('f_sub')) + '</h4>' +
        '<div class="line"><b style="background:none">' + esc(t('f_cmd')) + '</b>' + esc(t('f_to_arrest')) + '<input type="text" placeholder="' + esc(t('f_name_ph')) + '" maxlength="40">' + esc(t('f_under')) + c.warrant + '</div>' +
        '<button class="submit">' + esc(t('f_submit')) + '</button><div class="fb hidden"></div></div>';
      const inp = $('input', b), fb = $('.fb', b);
      const go = () => {
        const key = norm(inp.value);
        if (!key) { fb.innerHTML = esc(t('f_noname')); fb.classList.remove('hidden'); sfx.bad(); return; }
        const people = allPeople();
        if (!people[key]) { fb.innerHTML = t('f_noperson', esc(inp.value.trim())); fb.classList.remove('hidden'); sfx.bad(); return; }
        if (key === norm(c.culprit)) { solved(people[key]); return; }
        G.strikes++; fb.classList.add('hidden');
        const o = people[key];
        toast(t('wrong_toast', o.first_name + ' ' + o.last_name, G.strikes));
        sfx.bad(); sayAsSpud(t('spud_wrong') + (G.strikes >= 2 ? t('spud_wrong2') : ''));
      };
      $('.submit', b).addEventListener('click', go);
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
      setTimeout(() => inp.focus(), 50);
    }, { nob: true, w: 640, h: 500, x: 280, y: 36 });
  }
  function solved(row) {
    sfx.ok();
    const pen = G.hints + G.strikes;
    const stars = pen === 0 ? 3 : pen <= 2 ? 2 : 1;
    const prev = progress.done[G.c.id];
    progress.done[G.c.id] = { stars: Math.max(stars, prev ? prev.stars : 0) };
    saveProgress();
    const ov = $('#overlay'); ov.className = 'on'; ov.innerHTML = '';
    const sc = el('div', { className: 'arrest-screen' });
    sc.appendChild(el('h1', {}, t('arrested')));
    const pos = [[20, 150, -8], [150, 420, 4], [1060, 130, 6], [1000, 380, -4], [30, 480, 3], [1100, 520, -3]];
    pos.forEach((p) => { const cop = el('div', { className: 'cop', style: 'left:' + p[0] + 'px;top:' + p[1] + 'px;transform:rotate(' + p[2] + 'deg);animation-delay:' + (Math.random()).toFixed(2) + 's' }, CH.spud('happy')); sc.appendChild(cop); });
    const cols = ['#ff5370', '#ffee77', '#6fff8a', '#66c8ff', '#d28bff'];
    for (let i = 0; i < 14; i++) sc.appendChild(el('div', { className: 'balloon', style: 'left:' + (60 + Math.random() * 1120) + 'px;background:' + cols[i % cols.length] + ';animation-duration:' + (6 + Math.random() * 6).toFixed(1) + 's;animation-delay:' + (-Math.random() * 8).toFixed(1) + 's' }));
    sc.appendChild(el('div', { className: 'culprit' }, CH.person(CH.lookFor(row), { jumpsuit: true }) + '<div class="nm">' + esc(G.c.culprit) + '</div>'));
    sc.appendChild(el('div', { className: 'stats' }, '<div class="stars">' + '★'.repeat(stars) + '☆'.repeat(3 - stars) + '</div>' + t('solved_stats', esc(C().title), G.strikes, G.hints)));
    const btns = el('div', { className: 'btns' });
    const last = G.idx === CASES.length - 1;
    if (!last) btns.appendChild(el('button', { className: 'btn big', on: { click: () => { sfx.click(); ov.className = ''; startCase(G.idx + 1); } } }, t('next_case')));
    btns.appendChild(el('button', { className: 'btn big', on: { click: () => { sfx.click(); ov.className = ''; showCases(); } } }, last ? t('all_done') : t('case_list')));
    sc.appendChild(btns);
    ov.appendChild(sc);
  }

  /* ------------------------------------------------------------ assistant (Officer Spud) */
  const bubble = $('#bubble'), spudEl = $('#spud');
  function sayAsSpud(html, extra) {
    bubble.innerHTML = '<div>' + html + '</div><div class="bb"></div>';
    const bb = $('.bb', bubble);
    (extra || [[t('b_hint'), giveHint], [t('b_repeat'), () => { hideBubble(); openMessages(); }], [t('b_close'), hideBubble]]).forEach((x) => bb.appendChild(el('button', { className: 'btn', on: { click: () => { sfx.click(); x[1](); } } }, x[0])));
    bubble.classList.remove('hidden'); sfx.open();
  }
  function hideBubble() { bubble.classList.add('hidden'); }
  function giveHint() {
    const hs = C().hints;
    if (G.hints < hs.length) G.hints++;
    const h = hs[G.hints - 1];
    let html = t('hint_label', G.hints, hs.length);
    const m = /^(?:Try|Пример): (.*)$/.exec(h);
    html += m ? esc(t('hint_full')) + '<code>' + esc(m[1]) + '</code>' : esc(h);
    sayAsSpud(html);
    if (m) { const code = $('code', bubble); code.style.cursor = 'pointer'; code.title = t('copy_title'); code.addEventListener('click', () => { openSearch(m[1]); }); }
  }
  spudEl.addEventListener('click', () => { if (!bubble.classList.contains('hidden')) { hideBubble(); return; } sayAsSpud(t('spud_ask')); });

  /* ------------------------------------------------------------ desktop / screens */
  function toast(msg, good) {
    const t = el('div', { className: 'toast' + (good ? ' good' : '') }, msg);
    stage.appendChild(t); setTimeout(() => t.remove(), 3200);
  }
  const icons = $('#icons');
  function addIcon(kind, label, fn) {
    const ic = el('div', { className: 'icon' }, CH.ICONS[kind] + '<span>' + esc(label) + '</span>');
    ic.addEventListener('click', () => { sfx.click(); fn(); });
    icons.appendChild(ic);
  }
  function show(id) { ['screen-title', 'screen-cases', 'desktop'].forEach((s) => $('#' + s).classList.toggle('hidden', s !== id)); }

  function buildIcons() {
    const c = G.c;
    icons.innerHTML = '';
    addIcon('exit', t('i_exit'), () => { if (confirm(t('exit_confirm'))) showCases(); });
    addIcon('settings', t('i_settings'), openSettings);
    addIcon('messages', t('i_messages'), openMessages);
    addIcon('clues', t('i_clues'), openClues);
    addIcon('manual', t('i_manual'), openManual);
    if (c.sites) addIcon('web', t('i_web'), openBrowser);
    addIcon('search', t('i_search'), () => openSearch());
    Object.keys(schema()).forEach((tb) => addIcon('table', tb, () => openTable(tb)));
    addIcon('arrest', t('i_arrest'), openArrest);
  }
  function startCase(idx) {
    const c = CASES[idx];
    G = { idx, c, db: buildDb(c), history: [], lastQuery: '', strikes: 0, hints: 0, savedN: 0 };
    show('desktop'); hideBubble();
    resetDesktop();
    buildIcons();
    spudEl.innerHTML = CH.spud();
    openMessages();
    clearInterval(clockT); clockT = setInterval(clock, 20000); clock();
  }
  let clockT = 0;
  function clock() { const e = $('#clock'); if (e) { const d = new Date(); e.textContent = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); } }

  function isUnlocked(i) { return progress.unlockAll || i === 0 || !!progress.done[CASES[i - 1].id]; }
  function showCases() {
    show('screen-cases');
    const s = $('#screen-cases'); s.innerHTML = '<h2>' + esc(t('cases_h')) + '</h2><p>' + esc(t('cases_sub')) + '</p>';
    const grid = el('div', { className: 'case-grid' });
    CASES.forEach((c0, i) => {
      const c = loc(c0);
      const done = progress.done[c.id], ok = isUnlocked(i);
      const card = el('div', { className: 'case-card' + (ok ? '' : ' locked') },
        '<div class="num">' + esc(t('case_label', c.id)) + '</div>' + (done ? '<div class="stars">' + '★'.repeat(done.stars) + '☆'.repeat(3 - done.stars) + '</div>' : '') +
        '<h3>' + esc(c.title) + '</h3><div class="crime">' + esc(c.crime) + '</div><div class="tags">' + c0.manual.slice(-1).map((k) => esc(t('new_topic', MN(k).title))).join('') + '</div>' + (ok ? '' : '<div class="lock">🔒</div>'));
      card.addEventListener('click', () => { if (!ok) { toast(t('locked_toast')); sfx.bad(); return; } sfx.click(); startCase(i); });
      grid.appendChild(card);
    });
    s.appendChild(grid);
    s.appendChild(el('button', { className: 'btn', style: 'margin-top:22px', on: { click: () => { sfx.click(); showTitle(); } } }, esc(t('back_title'))));
  }
  function showTitle() {
    show('screen-title');
    const s = $('#screen-title');
    s.innerHTML = '<h1>' + t('title_h1') + '</h1><h2>' + esc(t('title_sub')) + '</h2><div class="spud-big">' + CH.spud('happy') + '</div>';
    const row = el('div', { className: 'title-btns', style: 'margin-top:14px' });
    const hasProg = Object.keys(progress.done).length > 0;
    row.appendChild(el('button', { className: 'btn big', on: { click: () => { sfx.click(); showCases(); } } }, esc(hasProg ? t('cont') : t('start'))));
    row.appendChild(el('button', { className: 'btn big', on: { click: () => { settings.sound = !settings.sound; saveSettings(); sfx.click(); showTitle(); } } }, esc(settings.sound ? t('sound_on') : t('sound_off'))));
    row.appendChild(el('button', { className: 'btn big', on: { click: () => { settings.crt = !settings.crt; saveSettings(); showTitle(); } } }, esc(settings.crt ? t('scan_on') : t('scan_off'))));
    row.appendChild(el('button', { className: 'btn big', on: { click: () => { setLang(settings.lang === 'ru' ? 'en' : 'ru'); showTitle(); } } }, esc(t('lang_btn'))));
    s.appendChild(row);
    s.appendChild(el('div', { className: 'small-note' }, esc(t('title_note'))));
  }

  /* ------------------------------------------------------------ boot */
  saveSettings(); document.documentElement.lang = settings.lang;
  show('screen-title');
  $('#screen-title').innerHTML = '<h1>' + esc(t('loading')) + '</h1>';
  initSqlJs().then((S) => { SQL = S; showTitle(); }).catch((e) => { $('#screen-title').innerHTML = '<h2>' + esc(t('engine_fail')) + '<br>' + esc(e.message || e) + '</h2>'; });
})();
