/* Extras: textbook-style manual content (tips, recaps, figures), UI strings for it, and desktop wallpapers. */
(function (root) {
  'use strict';
  var I = root.SQLD_I18N;

  /* ---------------------------------------------------------------- UI strings */
  Object.assign(I.en.ui, {
    man_cover_title: 'The Recruit’s<br>SQL Handbook',
    man_cover_sub: 'Los Datos Police Department<br>Petty Offenses Division',
    man_cover_note: 'Less than 20 pages. Honest.',
    man_owner: 'Property of Detective:',
    man_chapter: 'Chapter {0}', man_cover_tab: 'Cover', man_tip: 'Spud says', man_recap: 'Remember', man_page: 'page {0}',
    man_prev: '◀ Previous', man_next: 'Next ▶',
    fig_table: 'table', fig_col: 'column', fig_row: 'row = one record', fig_cell: 'a value',
    fig_all: 'all rows', fig_match: 'matching rows', fig_where: 'WHERE',
    fig_a: 'loans', fig_b: 'members', fig_link: 'same ID',
    s_bg: 'Wallpaper', s_bg_tip: 'Pick a desktop background',
    bg_teal: 'Classic teal', bg_sunset: 'Sunset', bg_night: 'Night city', bg_blueprint: 'Blueprint', bg_candy: 'Candy dots',
    bg_forest: 'Green hills', bg_checker: 'Checkerboard', bg_terminal: 'Terminal', bg_sky: 'Blue sky', bg_cork: 'Cork board'
  });
  Object.assign(I.ru.ui, {
    man_cover_title: 'Справочник SQL<br>для новобранца',
    man_cover_sub: 'Полиция Лос-Датос<br>Отдел мелких преступлений',
    man_cover_note: 'Меньше 20 страниц. Честное слово.',
    man_owner: 'Принадлежит детективу:',
    man_chapter: 'Глава {0}', man_cover_tab: 'Обложка', man_tip: 'Спад советует', man_recap: 'Запомните', man_page: 'стр. {0}',
    man_prev: '◀ Назад', man_next: 'Дальше ▶',
    fig_table: 'таблица', fig_col: 'столбец', fig_row: 'строка = одна запись', fig_cell: 'значение',
    fig_all: 'все строки', fig_match: 'подходящие строки', fig_where: 'WHERE',
    fig_a: 'loans', fig_b: 'members', fig_link: 'одинаковый ID',
    s_bg: 'Обои', s_bg_tip: 'Выберите фон рабочего стола',
    bg_teal: 'Классика', bg_sunset: 'Закат', bg_night: 'Ночной город', bg_blueprint: 'Чертёж', bg_candy: 'Конфетный горох',
    bg_forest: 'Зелёные холмы', bg_checker: 'Шахматная доска', bg_terminal: 'Терминал', bg_sky: 'Голубое небо', bg_cork: 'Пробковая доска'
  });

  /* ---------------------------------------------------------------- manual extras */
  root.SQLD_MANUAL_X = {
    en: {
      basics: { tip: 'Every table is just a spreadsheet. If you can read a spreadsheet, you can read a database!', recap: ['SELECT picks columns — * means all of them', 'FROM names the table', 'Double-click a person’s row to open their file'], fig: 'basics' },
      where: { tip: 'Text goes in \'single quotes\'. Numbers don’t. Mixing them up is the number one rookie mistake.', recap: ['WHERE keeps only matching rows', 'AND = both true, OR = at least one', '=  >  <  >=  <=  compare values'], fig: 'where' },
      operators: { tip: 'LIKE \'D%\' reads: “starts with D, then anything”. The % is the joker of SQL.', recap: ['!= means “is not”', 'BETWEEN includes both ends', '% inside LIKE means “anything”', 'IN (a, b, c) checks a list'] },
      order: { tip: 'DESC = biggest first. ASC = smallest first (the default). Sorting plus LIMIT 1 finds the “most” or “least” of anything.', recap: ['ORDER BY sorts the rows', 'DESC reverses the order', 'LIMIT cuts the list short'] },
      group: { tip: 'WHERE filters rows BEFORE grouping. HAVING filters groups AFTER counting. Don’t mix them up!', recap: ['COUNT(*) counts rows', 'GROUP BY makes one row per group', 'HAVING filters groups', 'A query in ( ) brackets is a “subquery”'] },
      join: { tip: 'If two tables share an ID column, you can JOIN them. Short nicknames (l, m, b) save a lot of typing.', recap: ['JOIN … ON a.id = b.id glues rows together', 'Give tables nicknames', 'Write m.first_name when two tables share a column name'], fig: 'join' }
    },
    ru: {
      basics: { tip: 'Любая таблица — это просто электронная таблица. Если вы умеете читать её, вы умеете читать базу данных!', recap: ['SELECT выбирает столбцы, * — это «все»', 'FROM называет таблицу', 'Двойной клик по строке человека открывает его досье'], fig: 'basics' },
      where: { tip: 'Текст берётся в \'одинарные кавычки\', числа — без. Путаница с этим — ошибка новичка номер один.', recap: ['WHERE оставляет только подходящие строки', 'AND = оба условия, OR = хотя бы одно', '=  >  <  >=  <=  сравнивают значения'], fig: 'where' },
      operators: { tip: 'LIKE \'D%\' читается так: «начинается на D, а дальше что угодно». Знак % — джокер в SQL.', recap: ['!= значит «не равно»', 'BETWEEN включает оба края', '% внутри LIKE — «что угодно»', 'IN (a, b, c) проверяет список'] },
      order: { tip: 'DESC — от большего к меньшему. ASC — от меньшего к большему (по умолчанию). Сортировка плюс LIMIT 1 находит «самое-самое» в чём угодно.', recap: ['ORDER BY сортирует строки', 'DESC меняет порядок на обратный', 'LIMIT обрезает список'] },
      group: { tip: 'WHERE фильтрует строки ДО группировки. HAVING фильтрует группы ПОСЛЕ подсчёта. Не путайте!', recap: ['COUNT(*) считает строки', 'GROUP BY делает одну строку на группу', 'HAVING фильтрует группы', 'Запрос в скобках ( ) — это «подзапрос»'] },
      join: { tip: 'Если у двух таблиц есть общий столбец с ID, их можно соединить через JOIN. Короткие псевдонимы (l, m, b) экономят кучу времени.', recap: ['JOIN … ON a.id = b.id склеивает строки', 'Давайте таблицам псевдонимы', 'Пишите m.first_name, если столбец с таким именем есть в двух таблицах'], fig: 'join' }
    }
  };

  /* ---------------------------------------------------------------- manual figures (inline SVG) */
  var INK = '#2b1a14';
  function tx(x, y, s, extra) { return '<text x="' + x + '" y="' + y + '" font-family="Georgia,serif" font-size="15" fill="' + INK + '" ' + (extra || '') + '>' + s + '</text>'; }
  root.SQLD_FIGURES = {
    basics: function (t) {
      var cols = ['first_name', 'last_name', 'shoe_size'], rows = [['Winifred', 'Plum', '11'], ['Felix', 'Dobbs', '9'], ['Iris', 'Kettle', '7']];
      var s = '<svg viewBox="0 0 520 190" class="fig" xmlns="http://www.w3.org/2000/svg"><rect x="80" y="26" width="360" height="120" fill="#fff" stroke="' + INK + '" stroke-width="3"/>' +
        '<rect x="80" y="26" width="360" height="30" fill="#e8dcc0" stroke="' + INK + '" stroke-width="3"/>';
      cols.forEach(function (c, i) { s += tx(92 + i * 120, 47, '<tspan font-family="Courier New,monospace" font-weight="bold" font-size="14">' + c + '</tspan>'); });
      rows.forEach(function (r, j) { r.forEach(function (v, i) { s += tx(92 + i * 120, 80 + j * 30, '<tspan font-family="Courier New,monospace" font-size="14">' + v + '</tspan>'); }); s += '<line x1="80" x2="440" y1="' + (92 + j * 30) + '" y2="' + (92 + j * 30) + '" stroke="#c9b98f"/>'; });
      s += '<path d="M240 26 V12" stroke="#c0272d" stroke-width="3"/>' + tx(240, 10, t('fig_col'), 'text-anchor="middle" fill="#c0272d" font-style="italic"') +
        '<path d="M80 105 H58" stroke="#c0272d" stroke-width="3"/><path d="M58 105 l8 -5 m-8 5 l8 5" stroke="#c0272d" stroke-width="3" fill="none"/>' + tx(52, 128, t('fig_row'), 'text-anchor="end" fill="#c0272d" font-style="italic"') +
        '<path d="M375 76 Q400 160 380 172" stroke="#c0272d" stroke-width="3" fill="none"/>' + tx(380, 186, t('fig_cell'), 'text-anchor="middle" fill="#c0272d" font-style="italic"') + '</svg>';
      return s;
    },
    where: function (t) {
      var s = '<svg viewBox="0 0 520 170" class="fig" xmlns="http://www.w3.org/2000/svg">';
      for (var i = 0; i < 6; i++) s += '<rect x="20" y="' + (20 + i * 22) + '" width="130" height="16" fill="' + (i === 1 || i === 4 ? '#f2d046' : '#fff') + '" stroke="' + INK + '" stroke-width="2"/>';
      s += tx(85, 162, t('fig_all'), 'text-anchor="middle" font-style="italic"');
      s += '<path d="M185 30 H335 L275 90 V135 L245 150 V90 Z" fill="#cdbbe8" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' + tx(260, 62, t('fig_where'), 'text-anchor="middle" font-family="Courier New,monospace" font-weight="bold" fill="#b020d0"');
      s += '<path d="M160 70 H190 M160 108 H190" stroke="' + INK + '" stroke-width="3"/>';
      s += '<rect x="380" y="60" width="120" height="16" fill="#f2d046" stroke="' + INK + '" stroke-width="2"/><rect x="380" y="86" width="120" height="16" fill="#f2d046" stroke="' + INK + '" stroke-width="2"/>' + tx(440, 130, t('fig_match'), 'text-anchor="middle" font-style="italic"');
      s += '<path d="M268 142 H370" stroke="' + INK + '" stroke-width="3"/><path d="M360 135 l10 7 -10 7" stroke="' + INK + '" stroke-width="3" fill="none"/></svg>';
      return s;
    },
    join: function (t) {
      function tbl(x, name, cols, rows, hl) {
        var s = '<rect x="' + x + '" y="30" width="170" height="' + (26 + rows.length * 24) + '" fill="#fff" stroke="' + INK + '" stroke-width="3"/><rect x="' + x + '" y="30" width="170" height="26" fill="#e8dcc0" stroke="' + INK + '" stroke-width="3"/>';
        s += tx(x + 85, 20, '<tspan font-weight="bold">' + name + '</tspan>', 'text-anchor="middle"');
        cols.forEach(function (c, i) { s += tx(x + 8 + i * 80, 48, '<tspan font-family="Courier New,monospace" font-size="12" font-weight="bold">' + c + '</tspan>'); });
        rows.forEach(function (r, j) {
          if (j === hl) s += '<rect x="' + (x + 2) + '" y="' + (58 + j * 24) + '" width="166" height="22" fill="#f2d046"/>';
          r.forEach(function (v, i) { s += tx(x + 8 + i * 80, 74 + j * 24, '<tspan font-family="Courier New,monospace" font-size="13">' + v + '</tspan>'); });
        });
        return s;
      }
      var s = '<svg viewBox="0 0 520 190" class="fig" xmlns="http://www.w3.org/2000/svg">';
      s += tbl(20, t('fig_a'), ['loan_id', 'member_id'], [['1', '18'], ['2', '4'], ['3', '9']], 0);
      s += tbl(330, t('fig_b'), ['member_id', 'city'], [['4', 'Pinecrest'], ['9', 'Westmarsh'], ['18', 'Dunhill']], 2);
      s += '<path d="M190 74 C250 74 270 130 330 122" stroke="#c0272d" stroke-width="3.5" fill="none" stroke-dasharray="7 5"/><circle cx="190" cy="74" r="5" fill="#c0272d"/><circle cx="330" cy="122" r="5" fill="#c0272d"/>';
      s += tx(260, 168, t('fig_link'), 'text-anchor="middle" fill="#c0272d" font-style="italic"') + '</svg>';
      return s;
    }
  };

  /* ---------------------------------------------------------------- wallpapers */
  function uri(svg) { return 'url("data:image/svg+xml;utf8,' + encodeURIComponent(svg) + '")'; }
  function rng(a) { return function () { a = (Math.imul(a, 1664525) + 1013904223) >>> 0; return a / 4294967296; }; }
  function skyline() {
    var r = rng(7), s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 360" preserveAspectRatio="xMidYMax slice">';
    [['#18204a', 0.62, 0], ['#0f1535', 1, 1]].forEach(function (layer) {
      var x = 0;
      while (x < 1280) {
        var w = 50 + r() * 70, h = (60 + r() * 200) * layer[1];
        s += '<rect x="' + x + '" y="' + (360 - h) + '" width="' + w + '" height="' + h + '" fill="' + layer[0] + '"/>';
        if (layer[2]) for (var wy = 360 - h + 12; wy < 350; wy += 18) for (var wx = x + 8; wx < x + w - 10; wx += 16) if (r() < 0.35) s += '<rect x="' + wx + '" y="' + wy + '" width="7" height="9" fill="#ffd966" opacity="' + (0.5 + r() * 0.5).toFixed(2) + '"/>';
        x += w + 4;
      }
    });
    for (var i = 0; i < 60; i++) s += '<circle cx="' + (r() * 1280).toFixed(0) + '" cy="' + (r() * 150).toFixed(0) + '" r="' + (r() * 1.4 + 0.4).toFixed(1) + '" fill="#fff" opacity=".7"/>';
    return s + '<circle cx="1050" cy="70" r="30" fill="#fff6c9"/></svg>';
  }
  function hills() {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" preserveAspectRatio="xMidYMax slice"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fe0f2"/><stop offset="1" stop-color="#e8f7d8"/></linearGradient></defs>' +
      '<rect width="1280" height="720" fill="url(#g)"/><circle cx="1050" cy="130" r="60" fill="#fff2a8"/>' +
      '<path d="M0 470 Q250 330 520 450 T1280 420 V720 H0Z" fill="#7cc576"/><path d="M0 560 Q300 440 640 540 T1280 520 V720 H0Z" fill="#4fa85a"/><path d="M0 650 Q360 560 760 640 T1280 620 V720 H0Z" fill="#2f8a47"/></svg>';
  }
  function clouds() {
    var r = rng(21), s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d7fd8"/><stop offset="1" stop-color="#8fd0f5"/></linearGradient></defs><rect width="1280" height="720" fill="url(#g)"/>';
    for (var i = 0; i < 9; i++) {
      var cx = r() * 1200 + 40, cy = 60 + r() * 520, k = 0.6 + r() * 0.9;
      s += '<g fill="#fff" opacity=".92" transform="translate(' + cx.toFixed(0) + ' ' + cy.toFixed(0) + ') scale(' + k.toFixed(2) + ')"><ellipse cx="0" cy="0" rx="70" ry="26"/><ellipse cx="-34" cy="-14" rx="38" ry="26"/><ellipse cx="22" cy="-22" rx="44" ry="30"/></g>';
    }
    return s + '</svg>';
  }
  function cork() {
    var r = rng(5), s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#b98a58"/>';
    for (var i = 0; i < 420; i++) s += '<circle cx="' + (r() * 400).toFixed(0) + '" cy="' + (r() * 400).toFixed(0) + '" r="' + (r() * 3 + 0.5).toFixed(1) + '" fill="' + ['#9c6f3f', '#c99a66', '#a87a48', '#d6aa75'][Math.floor(r() * 4)] + '" opacity=".7"/>';
    return s + '</svg>';
  }

  root.SQLD_WALLPAPERS = [
    { id: 'teal', css: '#178a96' },
    { id: 'sunset', css: 'linear-gradient(#2b1055 0%, #7b4fb5 30%, #e86f8c 60%, #f6a35c 82%, #f9d976 100%)' },
    { id: 'night', css: uri(skyline()) + ' center bottom / cover no-repeat, linear-gradient(#070b24, #1c2a5a)' },
    { id: 'blueprint', css: 'repeating-linear-gradient(0deg, rgba(255,255,255,.22) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, rgba(255,255,255,.22) 0 1px, transparent 1px 24px), #1b4d8c' },
    { id: 'candy', css: 'radial-gradient(circle, #ffffffaa 0 7px, transparent 8px) 0 0 / 40px 40px, radial-gradient(circle, #ffffff66 0 5px, transparent 6px) 20px 20px / 40px 40px, #e5799c' },
    { id: 'forest', css: uri(hills()) + ' center bottom / cover no-repeat' },
    { id: 'checker', css: 'conic-gradient(#1c7c87 25%, #26a0ad 0 50%, #1c7c87 0 75%, #26a0ad 0) 0 0 / 64px 64px' },
    { id: 'terminal', css: 'repeating-linear-gradient(0deg, rgba(40,255,120,.07) 0 1px, transparent 1px 4px), radial-gradient(circle at 50% 40%, #0b2a17, #03100a)' },
    { id: 'sky', css: uri(clouds()) + ' center / cover no-repeat' },
    { id: 'cork', css: uri(cork()) + ' 0 0 / 400px 400px' }
  ];
})(window);
