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
  const settings = Object.assign({ sound: true, crt: true }, store.get('settings', {}));
  let progress = store.get('progress', { done: {}, unlockAll: false });
  function saveSettings() { store.set('settings', settings); document.body.classList.toggle('crt', settings.crt); }
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
    taskbar.appendChild(el('div', { className: 'tcase' }, 'Case ' + G.c.id + ': ' + esc(G.c.title)));
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
    const info = el('div', { className: 'tbl-info' }, esc(infoText) + (hasName ? ' &nbsp;·&nbsp; double-click a row to open the person’s file' : ''));
    wrap.append(scroll, info);
    return wrap;
  }
  function openTable(name) {
    const res = G.db.exec('SELECT * FROM ' + name)[0] || { columns: [], values: [] };
    openWin('tbl:' + name, name, (b) => { b.appendChild(tableView(res.columns, res.values, res.values.length + ' rows')); }, { nob: true, w: Math.min(760, 120 + res.columns.length * 118), h: 400 });
  }
  function openDossier(o) {
    const nm = o.first_name + ' ' + o.last_name;
    const look = CH.lookFor(o);
    const no = 10000 + (CH.hash(nm) % 90000);
    openWin('dos:' + nm, 'File — ' + nm, (b) => {
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
      const s = closest(m[1], tables);
      return 'There is no table called ' + B(m[1]) + '.' + (s ? ' Did you mean ' + B(s) + '?' : '') + '<br>Tables on this computer: ' + tables.map(B).join(', ') + '.';
    }
    if ((m = /no such column: (.+)/.exec(msg))) {
      const name = m[1].split('.').pop();
      const used = [];
      const re = /\b(?:from|join)\s+([A-Za-z_]\w*)/gi; let t;
      while ((t = re.exec(sql))) if (sc[t[1]]) used.push(t[1]);
      const cols = []; (used.length ? used : tables).forEach((u) => sc[u].forEach((c) => { if (cols.indexOf(c) < 0) cols.push(c); }));
      const s = closest(name, cols);
      return 'There is no column called ' + B(m[1]) + '.' + (s ? ' Did you mean ' + B(s) + '?' : '') + '<br>Available columns: ' + cols.map(B).join(', ') + '.<br><i>If ' + B(name) + ' is a piece of text, put it in single quotes, like \'Red\'.</i>';
    }
    if ((m = /ambiguous column name: (.+)/.exec(msg))) return 'The column ' + B(m[1]) + ' exists in more than one table. Tell me which one, e.g. ' + B('m.' + m[1]) + ' — where <b>m</b> is the nickname you gave the table (…JOIN members <b>m</b> ON …).';
    if (/incomplete input/.test(msg)) return 'Your query looks <b>unfinished</b>. Did you forget a closing quote, a closing bracket, or the rest of the sentence (like a table after FROM)?';
    if ((m = /unrecognized token: "(.*)"/.exec(msg))) return 'I can’t read this: ' + B(m[1]) + '. Usually this means a <b>quote that was never closed</b> — text like \'Red\' needs a quote on both sides.';
    if (/misuse of aggregate/.test(msg)) return 'Counting functions like COUNT() can’t be used inside <b>WHERE</b>. Use <b>GROUP BY</b> and then <b>HAVING COUNT(*) = …</b> instead.';
    if (/GROUP BY|aggregate/i.test(msg)) return 'Problem with grouping: ' + esc(msg) + '. Remember: every column you select must be in GROUP BY or inside COUNT/SUM/etc.';
    if ((m = /near "(.*)": syntax error/.exec(msg))) {
      const tok = m[1];
      let tips = '';
      if (/^\s*select/i.test(sql) && !/\bfrom\b/i.test(sql)) tips = 'A query needs <b>FROM</b> to say which table to look at, e.g. <b>SELECT * FROM ' + esc(tables[0]) + '</b>.';
      else if (/^(where|and|or|order|group|limit|having|join|on)$/i.test(tok)) tips = 'The keyword ' + B(tok.toUpperCase()) + ' is in a wrong place or something is missing right before it. Order must be: SELECT, FROM, JOIN, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT.';
      else tips = 'Check for a missing <b>comma</b> between column names, missing <b>quotes</b> around text, a missing <b>AND</b>/<b>OR</b>, or a keyword in the wrong order.';
      return 'I got stuck near ' + B(tok) + '.<br>' + tips;
    }
    return 'The computer says: ' + esc(msg);
  }
  function runQuery(sql) {
    let q = sql.replace(/--[^\n]*/g, '').trim().replace(/;+\s*$/, '');
    if (!q) throw { friendly: 'Type a query first! For example: <b>SELECT * FROM ' + esc(Object.keys(schema())[0]) + '</b>' };
    if (!/^(select|with)\b/i.test(q)) throw { friendly: 'This terminal is <b>read-only</b>: only <b>SELECT</b> queries are allowed. (We investigate. We don’t edit the evidence!)' };
    if (/;/.test(q.replace(/'(?:[^']|'')*'/g, ''))) throw { friendly: 'Please run <b>one query at a time</b> (remove the extra “;”).' };
    try { return { q, res: G.db.exec(q)[0] || { columns: [], values: [] } }; }
    catch (e) { throw { friendly: explain(e.message || String(e), q) }; }
  }
  function showResults(res, q) {
    const count = res.values.length;
    const build = (b) => {
      b.innerHTML = '';
      if (!res.columns.length) b.appendChild(el('div', { className: 'paper' }, '<p>No results.</p>'));
      else if (!count) {
        const w = el('div', { style: 'display:flex;flex-direction:column;height:100%' });
        w.append(el('div', { className: 'paper', style: 'flex:1' }, '<h3>0 rows</h3><p>Your query worked, but <b>nothing matched</b>. Maybe one of the conditions is too strict (check spelling and quotes).</p>'));
        b.appendChild(w);
      } else b.appendChild(tableView(res.columns, res.values, count + (count === 1 ? ' row' : ' rows')));
    };
    const w = wins.results;
    if (w) { build(w.body); focusWin(w); w.tt.textContent = 'results — ' + count + (count === 1 ? ' row' : ' rows'); w.btn.textContent = 'results'; }
    else { const nw = openWin('results', 'results', build, { nob: true, w: Math.min(900, 140 + res.columns.length * 120), h: 360, x: 215, y: 330 }); nw.tt.textContent = 'results — ' + count + (count === 1 ? ' row' : ' rows'); }
  }
  function openSearch(prefill) {
    openWin('search', 'Search Tables', (b, w) => {
      const first = Object.keys(schema())[0];
      b.innerHTML =
        '<div class="q-wrap"><div class="editor"><pre></pre><textarea spellcheck="false" autocomplete="off" autocapitalize="off"></textarea></div>' +
        '<div class="q-err hidden"></div>' +
        '<div class="q-bar"><button class="btn" data-a="hist">View History</button>' +
        '<label><input type="checkbox" data-a="save"> Save Table</label><input type="text" data-a="sname" placeholder="table_name" maxlength="24">' +
        '<span class="grow"></span><button class="btn" data-a="go">Submit</button></div></div>';
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
            if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(nmv)) throw { friendly: 'Table names can only contain letters, numbers and underscores (and can’t start with a number).' };
            if (schema()[nmv]) throw { friendly: 'A table called ' + B(nmv) + ' already exists. Pick another name.' };
            try { G.db.run('CREATE TABLE ' + nmv + ' AS ' + out.q); } catch (e) { throw { friendly: explain(e.message, out.q) }; }
            G.savedN++; addIcon('table', nmv, () => openTable(nmv)); save.checked = false; sname.value = '';
            toast('Saved as table “' + nmv + '” — it is on your desktop now!', true);
          }
          showResults(out.res, out.q);
          sfx.ok();
        } catch (e) {
          err.innerHTML = '<b>⚠ Oops!</b> ' + (e.friendly || esc(e.message || e)); err.classList.remove('hidden'); sfx.bad();
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
    const w = openWin('history', 'Query History', (b) => {
      b.innerHTML = G.history.length ? '' : '<p class="tbl-hint">No queries yet — run one first!</p>';
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
    openWin('messages', 'Incoming Messages', (b) => {
      let i = 0, typing = null;
      const paras = G.c.briefing;
      b.innerHTML = '<div class="msg"><div class="face">' + CH.spud('happy') + '</div><div class="txt"><div class="body"></div><div class="nav"><span></span><button class="btn">Next ▶</button></div></div></div>';
      const body = $('.body', b), nav = $('.nav span', b), next = $('.nav button', b);
      function show() {
        const full = paras[i]; let n = 0; clearInterval(typing);
        const plain = full.replace(/<[^>]+>/g, '');
        body.innerHTML = ''; nav.textContent = (i + 1) + ' / ' + paras.length;
        next.textContent = i === paras.length - 1 ? 'Got it!' : 'Next ▶';
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
    openWin('clues', 'clues', (b) => {
      const list = el('div', { className: 'clue-list' });
      G.c.clues.forEach((cl, i) => {
        const ic = el('div', { className: 'icon' }, CH.ICONS.doc + '<span>' + esc(cl.title) + '</span>');
        ic.addEventListener('dblclick', () => openClue(i)); ic.addEventListener('click', () => { sfx.click(); openClue(i); });
        list.appendChild(ic);
      });
      b.appendChild(list);
    }, { w: 360, h: 220, x: 215, y: 60 });
  }
  function openClue(i) {
    const cl = G.c.clues[i];
    openWin('clue:' + i, cl.title, (b) => { b.innerHTML = '<div class="paper">' + cl.text + '</div>'; }, { nob: true, w: 480, h: 290, x: 250 + i * 40, y: 120 + i * 30 });
  }
  function openManual() {
    openWin('manual', 'SQL Manual', (b) => {
      const pages = G.c.manual;
      b.innerHTML = '<div class="manual"><nav></nav><div class="page"></div></div>';
      const nav = $('nav', b), page = $('.page', b);
      function show(k) {
        page.innerHTML = '<h3>' + esc(MANUAL[k].title) + '</h3>' + MANUAL[k].html;
        nav.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x.dataset.k === k));
      }
      pages.forEach((k, i) => { const bt = el('button', { 'data-k': k }, (i + 1) + '. ' + esc(MANUAL[k].title)); bt.addEventListener('click', () => { sfx.click(); show(k); }); nav.appendChild(bt); });
      show(pages[pages.length - 1]);
    }, { nob: true, w: 760, h: 440, x: 215, y: 40 });
  }
  function openBrowser() {
    openWin('web', 'web browser', (b) => {
      const sites = G.c.sites; const hist = ['home'];
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
  function openSettings() {
    openWin('settings', 'settings', (b) => {
      b.innerHTML = '<div class="paper" style="font:16px/2 var(--ui)"><label><input type="checkbox" data-s="sound"> Sound effects</label><br><label><input type="checkbox" data-s="crt"> Old-monitor scanlines</label><br>' +
        '<button class="btn" data-a="unlock">Unlock all cases</button> <button class="btn" data-a="reset">Reset progress</button></div>';
      $('[data-s=sound]', b).checked = settings.sound; $('[data-s=crt]', b).checked = settings.crt;
      b.addEventListener('change', (e) => { const k = e.target.dataset.s; if (k) { settings[k] = e.target.checked; saveSettings(); } });
      b.addEventListener('click', (e) => {
        const a = e.target.dataset.a;
        if (a === 'unlock') { progress.unlockAll = true; saveProgress(); toast('All cases unlocked!', true); }
        if (a === 'reset' && confirm('Delete all progress?')) { progress = { done: {}, unlockAll: false }; saveProgress(); toast('Progress reset.'); }
      });
    }, { nob: true, w: 400, h: 190, x: 400, y: 150 });
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
    openWin('arrest', 'Submit Arrest', (b) => {
      const c = G.c;
      b.innerHTML = '<div class="paper warrant"><div class="w-top"><span>FORM PO 442 — Arrest Warrant for PETTY OFFENSES</span><span>Case No. ' + (840000 + c.id * 137) + '</span></div>' +
        '<div class="w-head">Los Datos Police Department<small>for the</small>Petty Offenses Division</div>' +
        '<h2>ARREST WARRANT</h2><h4>FOR PETTY OFFENSES</h4>' +
        '<div class="line"><b style="background:none">YOU ARE COMMANDED</b> to arrest <input type="text" placeholder="First Last" maxlength="40"> under the accusation of ' + c.warrant + '</div>' +
        '<button class="submit">SUBMIT ARREST WARRANT</button><div class="fb hidden"></div></div>';
      const inp = $('input', b), fb = $('.fb', b);
      const go = () => {
        const key = norm(inp.value);
        if (!key) { fb.innerHTML = 'Write the full name of the person to arrest first.'; fb.classList.remove('hidden'); sfx.bad(); return; }
        const people = allPeople();
        if (!people[key]) { fb.innerHTML = 'Nobody called “' + esc(inp.value.trim()) + '” appears in the files for this case. Check the spelling (first and last name).'; fb.classList.remove('hidden'); sfx.bad(); return; }
        if (key === norm(c.culprit)) { solved(people[key]); return; }
        G.strikes++; fb.classList.add('hidden');
        const o = people[key];
        toast('Wrong person! ' + o.first_name + ' ' + o.last_name + ' has an alibi. Strike ' + G.strikes + '.');
        sfx.bad(); sayAsSpud('Hmm, that was not the right person. Re-read the clues and check <i>every</i> condition. ' + (G.strikes >= 2 ? 'Want a hint? Just click me.' : ''));
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
    sc.appendChild(el('h1', {}, 'SUSPECT ARRESTED'));
    const pos = [[20, 150, -8], [150, 420, 4], [1060, 130, 6], [1000, 380, -4], [30, 480, 3], [1100, 520, -3]];
    pos.forEach((p) => { const cop = el('div', { className: 'cop', style: 'left:' + p[0] + 'px;top:' + p[1] + 'px;transform:rotate(' + p[2] + 'deg);animation-delay:' + (Math.random()).toFixed(2) + 's' }, CH.spud('happy')); sc.appendChild(cop); });
    const cols = ['#ff5370', '#ffee77', '#6fff8a', '#66c8ff', '#d28bff'];
    for (let i = 0; i < 14; i++) sc.appendChild(el('div', { className: 'balloon', style: 'left:' + (60 + Math.random() * 1120) + 'px;background:' + cols[i % cols.length] + ';animation-duration:' + (6 + Math.random() * 6).toFixed(1) + 's;animation-delay:' + (-Math.random() * 8).toFixed(1) + 's' }));
    sc.appendChild(el('div', { className: 'culprit' }, CH.person(CH.lookFor(row), { jumpsuit: true }) + '<div class="nm">' + esc(G.c.culprit) + '</div>'));
    sc.appendChild(el('div', { className: 'stats' }, '<div class="stars">' + '★'.repeat(stars) + '☆'.repeat(3 - stars) + '</div>Case solved: <b>' + esc(G.c.title) + '</b><br>Wrong arrests: ' + G.strikes + ' · Hints used: ' + G.hints));
    const btns = el('div', { className: 'btns' });
    const last = G.idx === CASES.length - 1;
    if (!last) btns.appendChild(el('button', { className: 'btn big', on: { click: () => { sfx.click(); ov.className = ''; startCase(G.idx + 1); } } }, 'Next case ▶'));
    btns.appendChild(el('button', { className: 'btn big', on: { click: () => { sfx.click(); ov.className = ''; showCases(); } } }, last ? 'All cases solved! Back to menu' : 'Case list'));
    sc.appendChild(btns);
    ov.appendChild(sc);
  }

  /* ------------------------------------------------------------ assistant (Officer Spud) */
  const bubble = $('#bubble'), spudEl = $('#spud');
  function sayAsSpud(html, extra) {
    bubble.innerHTML = '<div>' + html + '</div><div class="bb"></div>';
    const bb = $('.bb', bubble);
    (extra || [['Hint', giveHint], ['Repeat briefing', () => { hideBubble(); openMessages(); }], ['Close', hideBubble]]).forEach((x) => bb.appendChild(el('button', { className: 'btn', on: { click: () => { sfx.click(); x[1](); } } }, x[0])));
    bubble.classList.remove('hidden'); sfx.open();
  }
  function hideBubble() { bubble.classList.add('hidden'); }
  function giveHint() {
    const hs = G.c.hints;
    if (G.hints < hs.length) G.hints++;
    const h = hs[G.hints - 1];
    let html = 'Hint ' + G.hints + '/' + hs.length + ': ';
    const m = /^Try: (.*)$/.exec(h);
    html += m ? 'here is a full example.<code>' + esc(m[1]) + '</code>' : esc(h);
    sayAsSpud(html);
    if (m) { const code = $('code', bubble); code.style.cursor = 'pointer'; code.title = 'Click to copy into the query window'; code.addEventListener('click', () => { openSearch(m[1]); }); }
  }
  spudEl.addEventListener('click', () => { if (!bubble.classList.contains('hidden')) { hideBubble(); return; } sayAsSpud('Need help, Detective? I can give you a <b>hint</b>, or replay the briefing.'); });

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

  function startCase(idx) {
    const c = CASES[idx];
    G = { idx, c, db: buildDb(c), history: [], lastQuery: '', strikes: 0, hints: 0, savedN: 0 };
    show('desktop'); hideBubble();
    resetDesktop();
    icons.innerHTML = '';
    addIcon('exit', 'exit', () => { if (confirm('Leave this case? Your progress in the case will be lost.')) showCases(); });
    addIcon('settings', 'settings', openSettings);
    addIcon('messages', 'messages', openMessages);
    addIcon('clues', 'clues', openClues);
    addIcon('manual', 'manual', openManual);
    if (c.sites) addIcon('web', 'web browser', openBrowser);
    addIcon('search', 'search', () => openSearch());
    Object.keys(c.tables).forEach((t) => addIcon('table', t, () => openTable(t)));
    addIcon('arrest', 'arrest', openArrest);
    spudEl.innerHTML = CH.spud();
    openMessages();
    clearInterval(clockT); clockT = setInterval(clock, 20000); clock();
  }
  let clockT = 0;
  function clock() { const e = $('#clock'); if (e) { const d = new Date(); e.textContent = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); } }

  function isUnlocked(i) { return progress.unlockAll || i === 0 || !!progress.done[CASES[i - 1].id]; }
  function showCases() {
    show('screen-cases');
    const s = $('#screen-cases'); s.innerHTML = '<h2>CASE FILES</h2><p>Los Datos Police Department — Petty Offenses Division</p>';
    const grid = el('div', { className: 'case-grid' });
    CASES.forEach((c, i) => {
      const done = progress.done[c.id], ok = isUnlocked(i);
      const card = el('div', { className: 'case-card' + (ok ? '' : ' locked') },
        '<div class="num">CASE ' + c.id + '</div>' + (done ? '<div class="stars">' + '★'.repeat(done.stars) + '☆'.repeat(3 - done.stars) + '</div>' : '') +
        '<h3>' + esc(c.title) + '</h3><div class="crime">' + esc(c.crime) + '</div><div class="tags">' + c.manual.slice(-1).map((k) => 'new: ' + esc(MANUAL[k].title)).join('') + '</div>' + (ok ? '' : '<div class="lock">🔒</div>'));
      card.addEventListener('click', () => { if (!ok) { toast('Solve the previous case first!'); sfx.bad(); return; } sfx.click(); startCase(i); });
      grid.appendChild(card);
    });
    s.appendChild(grid);
    s.appendChild(el('button', { className: 'btn', style: 'margin-top:22px', on: { click: () => { sfx.click(); showTitle(); } } }, '◀ Title screen'));
  }
  function showTitle() {
    show('screen-title');
    const s = $('#screen-title');
    s.innerHTML = '<h1>SQL<br>DETECTIVE</h1><h2>PETTY OFFENSES DIVISION</h2><div class="spud-big">' + CH.spud('happy') + '</div>';
    const row = el('div', { className: 'title-btns', style: 'margin-top:14px' });
    const hasProg = Object.keys(progress.done).length > 0;
    row.appendChild(el('button', { className: 'btn big', on: { click: () => { sfx.click(); showCases(); } } }, hasProg ? 'Continue' : 'Start'));
    row.appendChild(el('button', { className: 'btn big', on: { click: () => { settings.sound = !settings.sound; saveSettings(); sfx.click(); showTitle(); } } }, 'Sound: ' + (settings.sound ? 'on' : 'off')));
    row.appendChild(el('button', { className: 'btn big', on: { click: () => { settings.crt = !settings.crt; saveSettings(); showTitle(); } } }, 'Scanlines: ' + (settings.crt ? 'on' : 'off')));
    s.appendChild(row);
    s.appendChild(el('div', { className: 'small-note' }, 'An original game about learning SQL by solving petty crimes. All characters and cases are made up.'));
  }

  /* ------------------------------------------------------------ boot */
  saveSettings();
  show('screen-title');
  $('#screen-title').innerHTML = '<h1>LOADING…</h1>';
  initSqlJs().then((S) => { SQL = S; showTitle(); }).catch((e) => { $('#screen-title').innerHTML = '<h2>Could not start the SQL engine:<br>' + esc(e.message || e) + '</h2>'; });
})();
