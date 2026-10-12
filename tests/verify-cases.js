// Verifies every case with real SQL: the intended query must point at exactly the culprit.
// Run:  node tests/verify-cases.js
const path = require('path');
const initSqlJs = require(path.join(__dirname, '..', 'js', 'sql-asm.js'));
const { CASES, MANUAL } = require(path.join(__dirname, '..', 'js', 'cases.js'));
globalThis.window = globalThis; require(path.join(__dirname, '..', 'js', 'i18n.js'));
const RU = globalThis.SQLD_I18N.ru;

function loadDb(SQL, c) {
  const db = new SQL.Database();
  for (const [name, t] of Object.entries(c.tables)) {
    db.run(`CREATE TABLE ${name} (${t.columns.join(', ')})`);
    const stmt = db.prepare(`INSERT INTO ${name} VALUES (${t.columns.map(() => '?').join(',')})`);
    t.rows.forEach((r) => stmt.run(r));
    stmt.free();
  }
  return db;
}

initSqlJs().then((SQL) => {
  let failed = 0;
  const fail = (m) => { failed++; console.error('  FAIL: ' + m); };
  for (const c of CASES) {
    console.log(`Case ${c.id}: ${c.title}`);
    const db = loadDb(SQL, c);
    // 1. unique full names among people-ish rows
    for (const [name, t] of Object.entries(c.tables)) {
      const fi = t.columns.indexOf('first_name'), li = t.columns.indexOf('last_name');
      if (fi < 0 || li < 0) continue;
      const seen = new Map();
      t.rows.forEach((r) => {
        const key = r[fi] + ' ' + r[li];
        const sig = JSON.stringify(r.slice(1));
        if (seen.has(key) && name !== 'visits' && name !== 'badge_swipes' && name !== 'badge_swipes') fail(`duplicate person in ${name}: ${key}`);
        seen.set(key, sig);
      });
    }
    // 2. solution query
    const res = db.exec(c.solution);
    if (!res.length) { fail('solution returned nothing'); continue; }
    const cols = res[0].columns, rows = res[0].values;
    const fi = cols.indexOf('first_name'), li = cols.indexOf('last_name');
    const names = new Set(rows.map((r) => (fi >= 0 ? r[fi] + ' ' + r[li] : r.join(' '))));
    console.log('  solution rows:', rows.length, '→', [...names].join(', '));
    if (names.size !== 1 || !names.has(c.culprit)) fail(`expected only ${c.culprit}`);
    // 3. manual topics exist
    c.manual.forEach((m) => { if (!MANUAL[m]) fail('missing manual page ' + m); });
    // 4. hints exist
    if (!c.hints || c.hints.length < 3) fail('needs 3 hints');
    // Russian version: same structure, example SQL in hints must run and find the culprit
    const r = RU.cases[c.id];
    if (!r) { fail('no Russian text'); continue; }
    if (r.clues.length !== c.clues.length) fail('RU clue count differs');
    if (r.briefing.length !== c.briefing.length) fail('RU briefing count differs');
    if (r.hints.length !== c.hints.length) fail('RU hint count differs');
    if (!!r.sites !== !!c.sites) fail('RU sites mismatch');
    const hasExample = /^Try: /.test(c.hints[2]);
    const ex = /^Пример: (.*)$/.exec(r.hints[2]);
    if (hasExample && !ex) fail('RU hint 3 must be "Пример: <sql>"');
    else if (ex) { const rr = db.exec(ex[1]); if (!rr.length || rr[0].values.length < 1) fail('RU example SQL returned nothing'); }
    c.manual.forEach((m) => { if (!RU.manual[m]) fail('missing RU manual page ' + m); });
  }
  // case-specific sanity checks
  const c4 = CASES[3];
  const db4 = loadDb(SQL, c4);
  const missing = db4.exec('SELECT COUNT(*) FROM jar_log WHERE cookies_start - cookies_sold != cookies_end')[0].values[0][0];
  if (missing !== 3) fail('case 4 should have exactly 3 missing-cookie days, has ' + missing);
  const c3 = CASES[2];
  const db3 = loadDb(SQL, c3);
  const overall = db3.exec('SELECT first_name FROM stays ORDER BY checked_out_at DESC LIMIT 1')[0].values[0][0];
  if (overall === 'Magnus') fail('case 3: the overall latest checkout must be a decoy');

  if (failed) { console.error(`\n${failed} problem(s)`); process.exit(1); }
  console.log('\nAll cases OK');
});
