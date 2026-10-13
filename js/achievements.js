/* Achievements, ranks and the UI strings for the sandbox, detective profile, X-ray and extras.
 * Unlocking is done in game.js via award(id); this file only holds the list and the texts. */
(function (root) {
  'use strict';
  var I = root.SQLD_I18N;

  // [id, icon, English name, English description, Russian name, Russian description]
  var DEF = [
    ['first_blood', '🏅', 'First Arrest', 'Solve your first case.', 'Первый арест', 'Раскройте своё первое дело.'],
    ['no_hints', '🧠', 'Unaided', 'Solve a case without using any hints.', 'Сам с усам', 'Раскройте дело, не используя подсказки.'],
    ['flawless', '💎', 'Flawless', 'Solve a case with no hints and no wrong arrests.', 'Чистая работа', 'Раскройте дело без подсказок и без ложных арестов.'],
    ['stubborn', '🥔', 'Wrong Potato', 'Arrest the wrong person 3 times in one case.', 'Не та картошка', 'Арестуйте не того человека 3 раза в одном деле.'],
    ['quick_draw', '⚡', 'Quick Draw', 'Solve a case in under 4 minutes.', 'Быстрее ветра', 'Раскройте дело меньше чем за 4 минуты.'],
    ['efficient', '✂️', 'Short and Sweet', 'Solve a case using 3 queries or fewer.', 'Краткость — сестра таланта', 'Раскройте дело, выполнив не больше 3 запросов.'],
    ['rookie_grad', '🎓', 'Academy Graduate', 'Solve 6 cases.', 'Выпускник академии', 'Раскройте 6 дел.'],
    ['all_cases', '👑', 'Chief of Detectives', 'Solve every case.', 'Шеф детективов', 'Раскройте все дела.'],
    ['perfectionist', '🌟', 'Perfect Record', 'Earn 3 stars on every case.', 'Безупречная репутация', 'Получите 3 звезды в каждом деле.'],
    ['s_join', '🔗', 'Table Glue', 'Run a query with JOIN.', 'Клей для таблиц', 'Выполните запрос с JOIN.'],
    ['s_group', '🐑', 'Counting Sheep', 'Run a query with GROUP BY.', 'Счётчик овец', 'Выполните запрос с GROUP BY.'],
    ['s_sub', '🌀', 'Query Inception', 'Run a query with a subquery inside.', 'Запрос в запросе', 'Выполните запрос с подзапросом.'],
    ['s_null', '👀', 'Nothing to See', 'Find empty cells with IS NULL.', 'Ничего нет', 'Найдите пустые ячейки через IS NULL.'],
    ['s_distinct', '🔎', 'One of a Kind', 'Use DISTINCT.', 'Один такой', 'Используйте DISTINCT.'],
    ['s_aggr', '🧮', 'Number Cruncher', 'Use SUM, AVG, MIN or MAX.', 'Счетовод', 'Используйте SUM, AVG, MIN или MAX.'],
    ['s_left', '🧲', 'Leftover Hunter', 'Run a query with LEFT JOIN.', 'Охотник за пропавшими', 'Выполните запрос с LEFT JOIN.'],
    ['s_dates', '⏰', 'Time Detective', 'Use strftime or julianday.', 'Следователь по времени', 'Используйте strftime или julianday.'],
    ['oops10', '🤕', 'Learning the Hard Way', 'Get 10 SQL error messages. Everyone does.', 'Учимся на ошибках', 'Получите 10 сообщений об ошибке SQL. Это нормально.'],
    ['saver', '📦', 'Evidence Locker', 'Save a query result as a table.', 'Камера хранения улик', 'Сохраните результат запроса как таблицу.'],
    ['sandbox', '🏖️', 'Playground', 'Run 10 queries in the Sandbox.', 'Игровая площадка', 'Выполните 10 запросов в песочнице.'],
    ['decorator', '🛋️', 'Interior Designer', 'Change the desktop wallpaper.', 'Дизайнер интерьера', 'Смените обои рабочего стола.'],
    ['dj', '🎧', 'DJ Spud', 'Play a track in the music player.', 'DJ Спад', 'Включите музыку в плеере.'],
    ['xray', '👁️', 'X-Ray Vision', 'Use the query X-ray.', 'Рентгеновское зрение', 'Используйте «Рентген» запроса.']
  ];

  var en = {
    i_tables: 'all tables', w_tables: 'Archive Tables',
    sandbox_btn: '🔍 Sandbox', profile_btn: '🏅 Detective profile', taskbar_sandbox: 'Sandbox — free play',
    prof_h: 'DETECTIVE PROFILE', prof_sub: 'Los Datos Police Department — personal file',
    prof_rank: 'Rank', prof_cases: 'Cases solved', prof_stars: 'Stars', prof_queries: 'Queries run', prof_errors: 'Oops moments', prof_hints: 'Hints used', prof_strikes: 'Wrong arrests',
    prof_tab_ach: 'Achievements', prof_tab_arrested: 'Arrested', prof_back: '◀ Case files', prof_none: 'unsolved',
    ach_unlocked: 'Achievement unlocked!', ach_count: '{0} of {1} unlocked',
    rank_0: 'Rookie', rank_1: 'Constable', rank_2: 'Detective', rank_3: 'Senior Detective', rank_4: 'Chief of Detectives',
    xray_btn: 'X-ray', w_xray: 'Query X-ray', xray_intro: 'How many rows survive each condition of your WHERE:', xray_start: 'all rows (before WHERE)',
    xray_or: 'X-ray works with <b>AND</b> conditions. Your WHERE contains an <b>OR</b>, so I can’t split it up.',
    xray_none: 'X-ray needs a <b>SELECT … FROM … WHERE …</b> query with conditions to look at.',
    xray_unsupported: 'X-ray can’t look inside this kind of query yet. Try a plain <b>SELECT … FROM … WHERE</b>.',
    xray_zero: 'This condition removes everything. Check its spelling, quotes and the values in the table.',
    speak: 'Read aloud', speak_stop: 'Stop reading',
    sug_hint: 'Tab = accept',
    s_export: 'Export progress', s_import: 'Import progress', export_done: 'Progress saved to a file.', import_ok: 'Progress imported!', import_bad: 'That file is not a SQL Detective save.'
  };
  var ru = {
    i_tables: 'все таблицы', w_tables: 'Таблицы архива',
    sandbox_btn: '🔍 Песочница', profile_btn: '🏅 Профиль детектива', taskbar_sandbox: 'Песочница — свободная игра',
    prof_h: 'ПРОФИЛЬ ДЕТЕКТИВА', prof_sub: 'Полиция Лос-Датос — личное дело',
    prof_rank: 'Звание', prof_cases: 'Дел раскрыто', prof_stars: 'Звёзды', prof_queries: 'Запросов', prof_errors: 'Ошибок SQL', prof_hints: 'Подсказок', prof_strikes: 'Ложных арестов',
    prof_tab_ach: 'Достижения', prof_tab_arrested: 'Арестованные', prof_back: '◀ К делам', prof_none: 'не раскрыто',
    ach_unlocked: 'Достижение получено!', ach_count: 'Получено {0} из {1}',
    rank_0: 'Новобранец', rank_1: 'Патрульный', rank_2: 'Детектив', rank_3: 'Старший детектив', rank_4: 'Шеф детективов',
    xray_btn: 'Рентген', w_xray: 'Рентген запроса', xray_intro: 'Сколько строк остаётся после каждого условия вашего WHERE:', xray_start: 'все строки (до WHERE)',
    xray_or: 'Рентген работает с условиями через <b>AND</b>. В вашем WHERE есть <b>OR</b>, поэтому я не могу его разобрать.',
    xray_none: 'Для рентгена нужен запрос <b>SELECT … FROM … WHERE …</b> с условиями.',
    xray_unsupported: 'В такой запрос рентген пока заглянуть не может. Попробуйте обычный <b>SELECT … FROM … WHERE</b>.',
    xray_zero: 'Это условие отсекает всё. Проверьте написание, кавычки и значения в таблице.',
    speak: 'Прочитать вслух', speak_stop: 'Остановить чтение',
    sug_hint: 'Tab — принять',
    s_export: 'Экспорт прогресса', s_import: 'Импорт прогресса', export_done: 'Прогресс сохранён в файл.', import_ok: 'Прогресс загружен!', import_bad: 'Этот файл — не сохранение SQL Детектива.'
  };
  DEF.forEach(function (d) {
    en['ach_' + d[0]] = d[2]; en['ach_' + d[0] + '_d'] = d[3];
    ru['ach_' + d[0]] = d[4]; ru['ach_' + d[0] + '_d'] = d[5];
  });
  Object.assign(I.en.ui, en);
  Object.assign(I.ru.ui, ru);

  root.SQLD_ACH = DEF.map(function (d) { return { id: d[0], icon: d[1] }; });
})(typeof window !== 'undefined' ? window : globalThis);
