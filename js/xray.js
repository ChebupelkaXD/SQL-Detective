/* Query X-ray: splits a SELECT's WHERE clause into its AND-ed conditions so the game can show how many rows survive each one.
 * Pure text analysis (no database), so it can be unit-tested in Node. */
(function (root) {
  'use strict';

  // Words found at bracket depth 0 and outside quotes: [{w, i, j}] (lower-case word, start, end).
  function words(q) {
    var out = [], depth = 0, i = 0;
    while (i < q.length) {
      var ch = q[i];
      if (ch === "'") {
        i++;
        while (i < q.length) { if (q[i] === "'") { if (q[i + 1] === "'") { i += 2; continue; } i++; break; } i++; }
        continue;
      }
      if (ch === '"') { i++; while (i < q.length && q[i] !== '"') i++; i++; continue; }
      if (ch === '(') { depth++; i++; continue; }
      if (ch === ')') { depth--; i++; continue; }
      var m = /^[A-Za-z_][A-Za-z0-9_]*/.exec(q.slice(i));
      if (m) { if (depth === 0) out.push({ w: m[0].toLowerCase(), i: i, j: i + m[0].length }); i += m[0].length; continue; }
      i++;
    }
    return out;
  }

  var ENDERS = { group: 1, order: 1, limit: 1, having: 1, union: 1, intersect: 1, except: 1, window: 1 };

  /* analyse(sql) -> { from, conds: [text, ...] }  or  { error: 'none' | 'or' | 'unsupported' } */
  function analyse(sql) {
    var q = String(sql).replace(/--[^\n]*/g, '').trim().replace(/;+\s*$/, '');
    if (!/^select\b/i.test(q)) return { error: 'unsupported' };
    var ws = words(q);
    var from = null, where = null, end = null;
    for (var k = 0; k < ws.length; k++) {
      var w = ws[k];
      if (w.w === 'union' || w.w === 'intersect' || w.w === 'except') return { error: 'unsupported' };
      if (!from && w.w === 'from') from = w;
      else if (from && !where && w.w === 'where') where = w;
      else if (where && !end && ENDERS[w.w]) end = w;
      else if (from && !where && !end && ENDERS[w.w]) end = w;
    }
    if (!from) return { error: 'unsupported' };
    if (!where) return { error: 'none' };
    var fromText = q.slice(from.j, where.i).trim();
    var cond = q.slice(where.j, end ? end.i : q.length).trim();
    if (!cond) return { error: 'none' };
    var cw = words(cond), cuts = [0], pendingBetween = false;
    for (var n = 0; n < cw.length; n++) {
      var t = cw[n];
      if (t.w === 'or') return { error: 'or' };
      if (t.w === 'between') pendingBetween = true;
      else if (t.w === 'and') { if (pendingBetween) pendingBetween = false; else cuts.push(t.i, t.j); }
    }
    var conds = [];
    for (var c = 0; c < cuts.length; c += 2) {
      var from0 = cuts[c], to0 = c + 1 < cuts.length ? cuts[c + 1] : cond.length;
      var piece = cond.slice(from0, to0).trim();
      if (piece) conds.push(piece);
    }
    return { from: fromText, conds: conds };
  }

  /* SQL strings that count the surviving rows after 0, 1, 2 … conditions */
  function countQueries(a) {
    var qs = ['SELECT COUNT(*) FROM ' + a.from];
    for (var i = 1; i <= a.conds.length; i++) qs.push('SELECT COUNT(*) FROM ' + a.from + ' WHERE ' + a.conds.slice(0, i).map(function (c) { return '(' + c + ')'; }).join(' AND '));
    return qs;
  }

  var api = { analyse: analyse, countQueries: countQueries };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.SQLD_XRAY = api;
})(typeof window !== 'undefined' ? window : globalThis);
