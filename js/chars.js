/* Hand-drawn-ish blob characters and desktop icons, all inline SVG (no image files needed). */
(function (root) {
  'use strict';
  var INK = '#2b1a14';
  var SKINS = ['#f6d7a8', '#efc08f', '#d9a070', '#a8704a', '#f3c9b0'];
  var HAIR = { Black: '#2a2220', Brown: '#6b4226', Blonde: '#e3c36a', Red: '#c4481f', Gray: '#a9a9a9', White: '#ececec' };
  var OUTFITS = ['#3b6fb6', '#b5453a', '#4c9a63', '#8e5aa8', '#d99a2b', '#4a4a58', '#2f8f9d'];

  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rnd(seed) { var a = seed; return function () { a = (Math.imul(a, 1664525) + 1013904223) >>> 0; return a / 4294967296; }; }

  function lookFor(row) {
    var key = (row.first_name || '') + ' ' + (row.last_name || '') || 'x';
    var r = rnd(hash(key));
    var hairName = row.hair_color || ['Black', 'Brown', 'Blonde', 'Red', 'Gray'][Math.floor(r() * 5)];
    var styles = ['tuft', 'curly', 'long', 'bun', 'cap', 'none', 'tuft', 'curly'];
    return {
      skin: SKINS[Math.floor(r() * SKINS.length)],
      hair: HAIR[hairName] || HAIR.Brown,
      style: styles[Math.floor(r() * styles.length)],
      stache: r() < 0.22,
      beard: r() < 0.12,
      glasses: r() < 0.3,
      outfit: OUTFITS[Math.floor(r() * OUTFITS.length)],
      mood: Math.floor(r() * 3)
    };
  }

  function hairBack(l) {
    var c = l.hair, s = 'stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"';
    if (l.style === 'long') return '<path d="M42 110 Q30 190 62 200 L138 200 Q170 190 158 110 Q150 40 100 40 Q50 40 42 110Z" fill="' + c + '" ' + s + '/>';
    if (l.style === 'bun') return '<circle cx="100" cy="30" r="20" fill="' + c + '" ' + s + '/>';
    return '';
  }
  function hairFront(l) {
    var c = l.hair, s = 'stroke="' + INK + '" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"';
    switch (l.style) {
      case 'tuft': return '<path d="M80 50 Q92 22 104 46 Q112 24 124 52" fill="' + c + '" ' + s + '/>';
      case 'curly': return '<path d="M52 82 Q46 46 74 48 Q80 28 100 38 Q120 26 128 50 Q156 46 148 82 Q130 56 100 58 Q70 56 52 82Z" fill="' + c + '" ' + s + '/>';
      case 'long': case 'bun': return '<path d="M52 86 Q56 44 100 44 Q144 44 148 86 Q128 60 100 62 Q72 60 52 86Z" fill="' + c + '" ' + s + '/>';
      case 'cap': return '<path d="M50 78 Q56 36 100 36 Q144 36 150 78Z" fill="#cc3d3d" ' + s + '/><path d="M140 76 L176 82 Q168 92 140 88Z" fill="#aa2f2f" ' + s + '/>';
      default: return '';
    }
  }

  /* opts: {holdSign: '17434', jumpsuit: bool, width} */
  function person(l, opts) {
    opts = opts || {};
    var body = opts.jumpsuit ? '#f0a92e' : l.outfit;
    var s = 'stroke="' + INK + '" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"';
    var brow = l.mood === 0 ? '<path d="M64 88 L88 92 M136 88 L112 92" ' + s + ' fill="none"/>' : l.mood === 1 ? '<path d="M64 92 L88 86 M136 92 L112 86" ' + s + ' fill="none"/>' : '<path d="M66 88 Q76 82 88 88 M134 88 Q124 82 112 88" ' + s + ' fill="none"/>';
    var mouth = l.mood === 0 ? '<path d="M88 146 Q100 140 112 146" ' + s + ' fill="none"/>' : l.mood === 1 ? '<path d="M90 144 Q100 154 110 144" ' + s + ' fill="none"/>' : '<path d="M92 146 L108 146" ' + s + ' fill="none"/>';
    var out = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" class="char">';
    out += hairBack(l);
    // shoulders / body
    out += '<path d="M30 240 Q34 178 100 176 Q166 178 170 240Z" fill="' + body + '" ' + s + '/>';
    if (opts.jumpsuit) out += '<rect x="112" y="196" width="26" height="14" rx="3" fill="#fff" ' + s + ' stroke-width="3"/>';
    else out += '<path d="M88 178 L100 200 L112 178" fill="#fff" ' + s + '/>';
    // head
    out += '<ellipse cx="100" cy="112" rx="58" ry="62" fill="' + l.skin + '" ' + s + '/>';
    // ears
    out += '<ellipse cx="42" cy="116" rx="8" ry="12" fill="' + l.skin + '" ' + s + '/><ellipse cx="158" cy="116" rx="8" ry="12" fill="' + l.skin + '" ' + s + '/>';
    // eyes
    out += '<ellipse cx="76" cy="108" rx="13" ry="14" fill="#fff" ' + s + '/><ellipse cx="124" cy="108" rx="13" ry="14" fill="#fff" ' + s + '/>';
    out += '<circle cx="79" cy="110" r="5" fill="' + INK + '"/><circle cx="121" cy="110" r="5" fill="' + INK + '"/>';
    out += brow;
    // nose
    out += '<path d="M96 122 Q100 134 106 126" ' + s + ' stroke-width="4" fill="none"/>';
    if (l.beard) out += '<path d="M60 130 Q64 188 100 188 Q136 188 140 130 Q120 160 100 160 Q80 160 60 130Z" fill="' + l.hair + '" ' + s + '/>';
    if (l.stache) out += '<path d="M78 138 Q88 128 100 136 Q112 128 122 138 Q112 148 100 142 Q88 148 78 138Z" fill="' + l.hair + '" ' + s + ' stroke-width="4"/>';
    out += mouth;
    if (l.glasses) out += '<circle cx="76" cy="108" r="19" fill="rgba(180,220,255,.25)" ' + s + ' stroke-width="4"/><circle cx="124" cy="108" r="19" fill="rgba(180,220,255,.25)" ' + s + ' stroke-width="4"/><path d="M95 106 L105 106" ' + s + ' stroke-width="4"/>';
    out += hairFront(l);
    if (opts.holdSign) {
      out += '<g transform="rotate(-6 100 210)"><rect x="40" y="188" width="120" height="48" rx="3" fill="#2b2b33" ' + s + ' stroke-width="4"/><text x="100" y="212" text-anchor="middle" font-size="9" fill="#cfcfd8" font-family="Georgia,serif">LOS DATOS POLICE DEPT.</text><text x="100" y="231" text-anchor="middle" font-size="22" fill="#fff" font-family="Arial Black,Impact,sans-serif">' + opts.holdSign + '</text></g>';
      out += '<circle cx="40" cy="226" r="11" fill="' + l.skin + '" ' + s + ' stroke-width="4"/><circle cx="160" cy="226" r="11" fill="' + l.skin + '" ' + s + ' stroke-width="4"/>';
    }
    return out + '</svg>';
  }

  /* Officer Spud: potato-shaped cop with a pig-like nose. */
  function spud(mood) {
    var s = 'stroke="' + INK + '" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"';
    var mouth = mood === 'happy' ? '<path d="M86 150 Q100 166 114 150" ' + s + ' fill="#ffb3a0"/>' : mood === 'sad' ? '<path d="M88 156 Q100 144 112 156" ' + s + ' fill="none"/>' : '<path d="M90 152 Q95 158 100 152 Q105 158 110 152" ' + s + ' fill="none"/>';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220" class="spud">' +
      '<path d="M40 130 Q30 40 100 36 Q172 40 164 130 Q160 200 100 202 Q44 200 40 130Z" fill="#c9806a" ' + s + '/>' +
      '<path d="M36 40 Q60 8 100 12 Q140 8 164 40 Q100 56 36 40Z" fill="#4b4fc4" ' + s + '/><rect x="84" y="20" width="32" height="14" rx="3" fill="#f2d046" ' + s + ' stroke-width="3"/>' +
      '<path d="M52 82 L86 88 M148 82 L114 88" ' + s + ' stroke="#6b3b22" stroke-width="7" fill="none"/>' +
      '<ellipse cx="72" cy="104" rx="20" ry="16" fill="#fff" ' + s + '/><ellipse cx="128" cy="104" rx="20" ry="16" fill="#fff" ' + s + '/>' +
      '<circle cx="74" cy="104" r="6" fill="' + INK + '"/><circle cx="126" cy="104" r="6" fill="' + INK + '"/>' +
      '<path d="M92 104 L108 104" ' + s + ' stroke-width="4"/>' +
      '<ellipse cx="100" cy="132" rx="12" ry="9" fill="#e87c86" ' + s + ' stroke-width="4"/><circle cx="95" cy="132" r="2" fill="' + INK + '"/><circle cx="105" cy="132" r="2" fill="' + INK + '"/>' +
      mouth +
      '</svg>';
  }

  function ico(inner) { return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class="ico">' + inner + '</svg>'; }
  var ICONS = {
    exit: ico('<circle cx="32" cy="34" r="24" fill="#d8262c" stroke="#7d0e12" stroke-width="3"/><path d="M32 14 V34" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M20 22 A17 17 0 1 0 44 22" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>'),
    settings: ico('<g fill="#e8e8f0" stroke="#7a7a90" stroke-width="2"><circle cx="32" cy="32" r="14"/><rect x="28" y="4" width="8" height="12"/><rect x="28" y="48" width="8" height="12"/><rect x="4" y="28" width="12" height="8"/><rect x="48" y="28" width="12" height="8"/></g><circle cx="32" cy="32" r="6" fill="#4d9aa6"/>'),
    messages: ico('<rect x="6" y="14" width="52" height="36" rx="3" fill="#fff" stroke="#8a8aa0" stroke-width="2.5"/><path d="M6 16 L32 36 L58 16" fill="none" stroke="#8a8aa0" stroke-width="2.5"/>'),
    clues: ico('<path d="M4 18 H24 L28 24 H60 V54 H4Z" fill="#f2c94c" stroke="#a37d12" stroke-width="2.5"/><path d="M4 28 H60" stroke="#a37d12" stroke-width="2"/>'),
    manual: ico('<rect x="10" y="8" width="42" height="48" rx="3" fill="#2f5db3" stroke="#14295a" stroke-width="2.5"/><rect x="16" y="14" width="30" height="10" fill="#f6e7b4"/><rect x="16" y="30" width="30" height="3" fill="#f6e7b4"/><rect x="16" y="37" width="22" height="3" fill="#f6e7b4"/><circle cx="14" cy="10" r="6" fill="#d8262c"/>'),
    search: ico('<rect x="12" y="6" width="34" height="46" fill="#fff" stroke="#8a8aa0" stroke-width="2.5"/><path d="M18 16h22M18 24h22M18 32h14" stroke="#9a9ab0" stroke-width="2.5"/><circle cx="40" cy="42" r="11" fill="#cfe8ff" stroke="#3a3a55" stroke-width="3.5"/><path d="M48 50 L58 60" stroke="#3a3a55" stroke-width="5" stroke-linecap="round"/>'),
    table: ico('<rect x="8" y="8" width="48" height="48" fill="#fff" stroke="#8a8aa0" stroke-width="2.5"/><path d="M8 22H56M8 36H56M8 48H56M24 8V56M40 8V56" stroke="#8a8aa0" stroke-width="2"/><rect x="8" y="8" width="48" height="14" fill="#c9c9e8"/>'),
    web: ico('<circle cx="32" cy="32" r="26" fill="#3a8fd9" stroke="#14487f" stroke-width="2.5"/><path d="M16 22Q22 14 30 18Q34 26 26 30Q22 40 14 36ZM40 14Q50 18 52 28Q46 30 44 24ZM36 40Q46 36 50 44Q44 54 36 52Z" fill="#4fb360" stroke="#1d6a2e" stroke-width="1.5"/>'),
    arrest: ico('<path d="M10 32 Q8 12 32 10 Q56 12 54 32 Q54 54 32 56 Q10 54 10 32Z" fill="#c9806a" stroke="#2b1a14" stroke-width="3"/><path d="M8 18 Q20 2 32 4 Q44 2 56 18 Q32 24 8 18Z" fill="#4b4fc4" stroke="#2b1a14" stroke-width="3"/><circle cx="24" cy="34" r="6" fill="#fff" stroke="#2b1a14" stroke-width="2"/><circle cx="40" cy="34" r="6" fill="#fff" stroke="#2b1a14" stroke-width="2"/><ellipse cx="32" cy="44" rx="6" ry="4" fill="#e87c86" stroke="#2b1a14" stroke-width="2"/>'),
    doc: ico('<path d="M14 6 H40 L52 18 V58 H14Z" fill="#fff" stroke="#8a8aa0" stroke-width="2.5"/><path d="M40 6 V18 H52" fill="#e8e8f0" stroke="#8a8aa0" stroke-width="2.5"/><path d="M20 28H46M20 36H46M20 44H38" stroke="#9a9ab0" stroke-width="2.5"/>'),
    notepad: ico('<rect x="10" y="10" width="44" height="48" fill="#f6f0b8" stroke="#a89f3e" stroke-width="2.5"/><path d="M16 6v10M26 6v10M36 6v10M46 6v10" stroke="#555" stroke-width="3"/><path d="M16 28H48M16 36H48M16 44H36" stroke="#b5ab4d" stroke-width="2"/>')
  };

  var api = { person: person, spud: spud, lookFor: lookFor, ICONS: ICONS, hash: hash };
  root.SQLD_CHARS = api;
})(typeof window !== 'undefined' ? window : globalThis);
