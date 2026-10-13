/* Translations. English case texts live in cases.js; this file holds all UI strings (EN + RU)
 * and the Russian versions of the case texts and the SQL manual.
 * Table/column names and data values stay in English on purpose: that is what real SQL looks like.
 */
(function (root) {
  'use strict';

  var en = {
    loading: 'LOADING…',
    title_h1: 'SQL<br>DETECTIVE',
    title_sub: 'PETTY OFFENSES DIVISION',
    start: 'Start', cont: 'Continue',
    sound_on: 'Sound: on', sound_off: 'Sound: off',
    scan_on: 'Scanlines: on', scan_off: 'Scanlines: off',
    lang_btn: 'Language: English',
    title_note: 'An original game about learning SQL by solving petty crimes. All characters and cases are made up.',
    cases_h: 'CASE FILES', cases_sub: 'Los Datos Police Department — Petty Offenses Division',
    case_label: 'CASE {0}', new_topic: 'new: {0}',
    locked_toast: 'Solve the previous case first!',
    back_title: '◀ Title screen',
    taskbar_case: 'Case {0}: {1}',
    i_exit: 'exit', i_settings: 'settings', i_messages: 'messages', i_clues: 'clues', i_manual: 'manual', i_web: 'web browser', i_search: 'search', i_arrest: 'arrest',
    exit_confirm: 'Leave this case? Your progress in the case will be lost.',
    w_messages: 'Incoming Messages', w_manual: 'SQL Manual', w_search: 'Search Tables', w_history: 'Query History',
    w_results: 'results', w_arrest: 'Submit Arrest', w_file: 'File — {0}', w_settings: 'settings', w_browser: 'web browser',
    row_one: '{0} row', row_many: '{0} rows',
    dbl_hint: ' · double-click a row to open the person’s file',
    no_results: 'No results.',
    zero_rows: '<h3>0 rows</h3><p>Your query worked, but <b>nothing matched</b>. Maybe one of the conditions is too strict (check spelling and quotes).</p>',
    next: 'Next ▶', got_it: 'Got it!',
    hist_btn: 'View History', save_tbl: 'Save Table', tbl_ph: 'table_name', submit: 'Submit',
    oops: '⚠ Oops!', hist_empty: 'No queries yet — run one first!',
    saved_toast: 'Saved as table “{0}” — it is on your desktop now!',
    err_tblname: 'Table names can only contain letters, numbers and underscores (and can’t start with a number).',
    err_exists: 'A table called <b>{0}</b> already exists. Pick another name.',
    q_empty: 'Type a query first! For example: <b>SELECT * FROM {0}</b>',
    q_readonly: 'This terminal is <b>read-only</b>: only <b>SELECT</b> queries are allowed. (We investigate. We don’t edit the evidence!)',
    q_one: 'Please run <b>one query at a time</b> (remove the extra “;”).',
    e_no_table: 'There is no table called <b>{0}</b>.', e_did_you: ' Did you mean <b>{0}</b>?', e_tables: '<br>Tables on this computer: {0}.',
    e_no_col: 'There is no column called <b>{0}</b>.', e_cols: '<br>Available columns: {0}.',
    e_quote_tip: '<br><i>If <b>{0}</b> is a piece of text, put it in single quotes, like \'Red\'.</i>',
    e_ambig: 'The column <b>{0}</b> exists in more than one table. Tell me which one, e.g. <b>{1}</b> — where <b>m</b> is the nickname you gave the table (…JOIN members <b>m</b> ON …).',
    e_incomplete: 'Your query looks <b>unfinished</b>. Did you forget a closing quote, a closing bracket, or the rest of the sentence (like a table after FROM)?',
    e_token: 'I can’t read this: <b>{0}</b>. Usually this means a <b>quote that was never closed</b> — text like \'Red\' needs a quote on both sides.',
    e_aggr: 'Counting functions like COUNT() can’t be used inside <b>WHERE</b>. Use <b>GROUP BY</b> and then <b>HAVING COUNT(*) = …</b> instead.',
    e_group: 'Problem with grouping: {0}. Remember: every column you select must be in GROUP BY or inside COUNT/SUM/etc.',
    e_stuck: 'I got stuck near <b>{0}</b>.<br>',
    e_need_from: 'A query needs <b>FROM</b> to say which table to look at, e.g. <b>SELECT * FROM {0}</b>.',
    e_kw: 'The keyword <b>{0}</b> is in a wrong place or something is missing right before it. Order must be: SELECT, FROM, JOIN, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT.',
    e_other: 'Check for a missing <b>comma</b> between column names, missing <b>quotes</b> around text, a missing <b>AND</b>/<b>OR</b>, or a keyword in the wrong order.',
    e_default: 'The computer says: {0}',
    f_top: 'FORM PO 442 — Arrest Warrant for PETTY OFFENSES', f_case_no: 'Case No. {0}',
    f_head: 'Los Datos Police Department<small>for the</small>Petty Offenses Division',
    f_title: 'ARREST WARRANT', f_sub: 'FOR PETTY OFFENSES',
    f_cmd: 'YOU ARE COMMANDED', f_to_arrest: ' to arrest ', f_under: ' under the accusation of ',
    f_name_ph: 'First Last', f_submit: 'SUBMIT ARREST WARRANT',
    f_noname: 'Write the full name of the person to arrest first.',
    f_noperson: 'Nobody called “{0}” appears in the files for this case. Check the spelling (first and last name).',
    wrong_toast: 'Wrong person! {0} has an alibi. Strike {1}.',
    spud_wrong: 'Hmm, that was not the right person. Re-read the clues and check <i>every</i> condition. ',
    spud_wrong2: 'Want a hint? Just click me.',
    arrested: 'SUSPECT ARRESTED',
    solved_stats: 'Case solved: <b>{0}</b><br>Wrong arrests: {1} · Hints used: {2}',
    next_case: 'Next case ▶', case_list: 'Case list', all_done: 'All cases solved! Back to menu',
    spud_ask: 'Need help, Detective? I can give you a <b>hint</b>, or replay the briefing.',
    hint_label: 'Hint {0}/{1}: ', hint_full: 'here is a full example.',
    b_hint: 'Hint', b_repeat: 'Repeat briefing', b_close: 'Close', copy_title: 'Click to copy into the query window',
    s_sound: 'Sound effects', s_crt: 'Old-monitor scanlines', s_lang: 'Language', s_unlock: 'Unlock all cases', s_reset: 'Reset progress',
    unlocked_toast: 'All cases unlocked!', reset_confirm: 'Delete all progress?', reset_toast: 'Progress reset.',
    engine_fail: 'Could not start the SQL engine:'
  };

  var ru = {
    loading: 'ЗАГРУЗКА…',
    title_h1: 'SQL<br>ДЕТЕКТИВ',
    title_sub: 'ОТДЕЛ МЕЛКИХ ПРЕСТУПЛЕНИЙ',
    start: 'Старт', cont: 'Продолжить',
    sound_on: 'Звук: вкл', sound_off: 'Звук: выкл',
    scan_on: 'Полосы на экране: вкл', scan_off: 'Полосы на экране: выкл',
    lang_btn: 'Язык: Русский',
    title_note: 'Оригинальная игра, в которой вы учите SQL, раскрывая мелкие преступления. Все персонажи и дела вымышлены.',
    cases_h: 'ДЕЛА', cases_sub: 'Полиция Лос-Датос — Отдел мелких преступлений',
    case_label: 'ДЕЛО {0}', new_topic: 'новое: {0}',
    locked_toast: 'Сначала раскройте предыдущее дело!',
    back_title: '◀ На титульный экран',
    taskbar_case: 'Дело {0}: {1}',
    i_exit: 'выход', i_settings: 'настройки', i_messages: 'сообщения', i_clues: 'улики', i_manual: 'учебник', i_web: 'браузер', i_search: 'поиск', i_arrest: 'арест',
    exit_confirm: 'Покинуть дело? Прогресс в этом деле будет потерян.',
    w_messages: 'Входящие сообщения', w_manual: 'Учебник SQL', w_search: 'Поиск по таблицам', w_history: 'История запросов',
    w_results: 'результат', w_arrest: 'Оформить арест', w_file: 'Досье — {0}', w_settings: 'настройки', w_browser: 'браузер',
    row_one: '{0} строка', row_few: '{0} строки', row_many: '{0} строк',
    dbl_hint: ' · двойной клик по строке открывает досье человека',
    no_results: 'Нет результатов.',
    zero_rows: '<h3>0 строк</h3><p>Запрос выполнился, но <b>ничего не нашлось</b>. Возможно, одно из условий слишком строгое (проверьте написание и кавычки).</p>',
    next: 'Дальше ▶', got_it: 'Понятно!',
    hist_btn: 'История', save_tbl: 'Сохранить таблицу', tbl_ph: 'имя_таблицы', submit: 'Выполнить',
    oops: '⚠ Ой!', hist_empty: 'Запросов пока нет — сначала выполните один!',
    saved_toast: 'Сохранено как таблица «{0}» — она уже на рабочем столе!',
    err_tblname: 'Имя таблицы может содержать только латинские буквы, цифры и подчёркивания (и не может начинаться с цифры).',
    err_exists: 'Таблица <b>{0}</b> уже существует. Выберите другое имя.',
    q_empty: 'Сначала введите запрос! Например: <b>SELECT * FROM {0}</b>',
    q_readonly: 'Этот терминал <b>только для чтения</b>: разрешены лишь запросы <b>SELECT</b>. (Мы расследуем, а не правим улики!)',
    q_one: 'Выполняйте <b>по одному запросу за раз</b> (уберите лишнюю «;»).',
    e_no_table: 'Таблицы <b>{0}</b> не существует.', e_did_you: ' Может быть, вы имели в виду <b>{0}</b>?', e_tables: '<br>Таблицы на этом компьютере: {0}.',
    e_no_col: 'Столбца <b>{0}</b> не существует.', e_cols: '<br>Доступные столбцы: {0}.',
    e_quote_tip: '<br><i>Если <b>{0}</b> — это текст, возьмите его в одинарные кавычки, например \'Red\'.</i>',
    e_ambig: 'Столбец <b>{0}</b> есть сразу в нескольких таблицах. Укажите, в какой именно, например <b>{1}</b>, где <b>m</b> — псевдоним, который вы дали таблице (…JOIN members <b>m</b> ON …).',
    e_incomplete: 'Запрос выглядит <b>незаконченным</b>. Вы не забыли закрывающую кавычку, закрывающую скобку или продолжение (например, таблицу после FROM)?',
    e_token: 'Не могу прочитать это: <b>{0}</b>. Обычно это значит, что <b>кавычка не закрыта</b> — текст вроде \'Red\' нужно взять в кавычки с обеих сторон.',
    e_aggr: 'Функции подсчёта вроде COUNT() нельзя использовать в <b>WHERE</b>. Используйте <b>GROUP BY</b>, а затем <b>HAVING COUNT(*) = …</b>.',
    e_group: 'Проблема с группировкой: {0}. Помните: каждый выбранный столбец должен быть в GROUP BY или внутри COUNT/SUM и т. п.',
    e_stuck: 'Я запнулся возле <b>{0}</b>.<br>',
    e_need_from: 'Запросу нужен <b>FROM</b> — он говорит, в какую таблицу смотреть, например <b>SELECT * FROM {0}</b>.',
    e_kw: 'Слово <b>{0}</b> стоит не на своём месте, или прямо перед ним чего-то не хватает. Порядок такой: SELECT, FROM, JOIN, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT.',
    e_other: 'Проверьте: нет ли пропущенной <b>запятой</b> между столбцами, <b>кавычек</b> вокруг текста, пропущенного <b>AND</b>/<b>OR</b>, или слов в неправильном порядке.',
    e_default: 'Компьютер сообщает: {0}',
    f_top: 'БЛАНК ПО-442 — Ордер на арест за МЕЛКИЕ ПРЕСТУПЛЕНИЯ', f_case_no: 'Дело № {0}',
    f_head: 'Полиция Лос-Датос<small>Отдел</small>мелких преступлений',
    f_title: 'ОРДЕР НА АРЕСТ', f_sub: 'ЗА МЕЛКОЕ ПРЕСТУПЛЕНИЕ',
    f_cmd: 'ВАМ ПРИКАЗАНО', f_to_arrest: ' арестовать ', f_under: ' по обвинению в ',
    f_name_ph: 'Имя Фамилия (как в таблице)', f_submit: 'ПОДАТЬ ОРДЕР НА АРЕСТ',
    f_noname: 'Сначала впишите полное имя того, кого арестовываете (латиницей, как в таблицах).',
    f_noperson: 'В материалах дела нет никого по имени «{0}». Проверьте написание (имя и фамилия латиницей).',
    wrong_toast: 'Не тот человек! У {0} есть алиби. Ошибок: {1}.',
    spud_wrong: 'Хм, это не тот человек. Перечитайте улики и проверьте <i>каждое</i> условие. ',
    spud_wrong2: 'Нужна подсказка? Просто кликните по мне.',
    arrested: 'ПРЕСТУПНИК АРЕСТОВАН',
    solved_stats: 'Дело раскрыто: <b>{0}</b><br>Ошибочных арестов: {1} · Подсказок: {2}',
    next_case: 'Следующее дело ▶', case_list: 'Список дел', all_done: 'Все дела раскрыты! В меню',
    spud_ask: 'Нужна помощь, детектив? Могу дать <b>подсказку</b> или повторить инструктаж.',
    hint_label: 'Подсказка {0}/{1}: ', hint_full: 'вот готовый пример.',
    b_hint: 'Подсказка', b_repeat: 'Повторить инструктаж', b_close: 'Закрыть', copy_title: 'Клик — скопировать в окно запросов',
    s_sound: 'Звуковые эффекты', s_crt: 'Полосы старого монитора', s_lang: 'Язык', s_unlock: 'Открыть все дела', s_reset: 'Сбросить прогресс',
    unlocked_toast: 'Все дела открыты!', reset_confirm: 'Удалить весь прогресс?', reset_toast: 'Прогресс сброшен.',
    engine_fail: 'Не удалось запустить SQL-движок:'
  };

  /* ------------------------------------------------------------ Russian manual */
  var manual = {
    nulls: {
      title: 'NULL, IS NULL',
      html: '<p><b>NULL</b> — это <i>пустая</i> ячейка: «здесь ничего нет». Это не ноль и не пустой текст.</p><p>Искать NULL через <b>=</b> <b>нельзя</b>:</p><pre>WHERE returned_on = NULL   -- не найдёт НИЧЕГО!</pre><p>Используйте <b>IS NULL</b> и <b>IS NOT NULL</b>:</p><pre>SELECT *\nFROM prop_checkouts\nWHERE returned_on IS NULL\n  AND phone IS NOT NULL</pre><p>(Почему? NULL значит «неизвестно», а «равно ли неизвестное неизвестному?» — тоже неизвестно.)</p>'
    },
    distinct: {
      title: 'DISTINCT',
      html: '<p><b>DISTINCT</b> убирает повторяющиеся строки из результата:</p><pre>SELECT DISTINCT gate\nFROM gate_scans</pre><p>Внутри COUNT он считает только <i>разные</i> значения:</p><pre>SELECT first_name, last_name,\n  COUNT(*) AS scans,\n  COUNT(DISTINCT gate) AS gates_used\nFROM gate_scans\nGROUP BY first_name, last_name</pre><p><b>COUNT(*)</b> считает все строки, а <b>COUNT(DISTINCT gate)</b> — сколько <i>разных</i> ворот встретилось.</p>'
    },
    aggregates: {
      title: 'SUM, AVG, MIN, MAX',
      html: '<p><b>Агрегатные функции</b> сжимают много строк в одно число:</p><pre>SUM(amount)   -- сумма\nAVG(amount)   -- среднее\nMIN(amount)   -- наименьшее\nMAX(amount)   -- наибольшее</pre><p>С GROUP BY получается по одному результату на группу:</p><pre>SELECT first_name, last_name,\n  SUM(amount) AS total,\n  MAX(amount) AS biggest\nFROM purchases\nGROUP BY first_name, last_name\nHAVING SUM(amount) > 300</pre><p>Фильтровать по таким числам нужно через <b>HAVING</b>, а не WHERE. <b>ROUND(AVG(amount), 1)</b> округляет длинные дроби.</p>'
    },
    leftjoin: {
      title: 'LEFT JOIN',
      html: '<p>Обычный <b>JOIN</b> оставляет только строки, у которых есть пара в другой таблице. <b>LEFT JOIN</b> оставляет <i>все</i> строки левой таблицы, а где пары нет, столбцы правой таблицы равны <b>NULL</b>:</p><pre>SELECT s.first_name, n.badged_at\nFROM staff s\nLEFT JOIN night_badges n\n  ON s.staff_id = n.staff_id</pre><p>Приём: чтобы найти строки <b>без</b> пары, добавьте IS NULL:</p><pre>... LEFT JOIN night_badges n ON s.staff_id = n.staff_id\nWHERE n.badge_id IS NULL</pre><p>«Все из staff, кого нет в night_badges».</p>'
    },
    dates: {
      title: 'Даты',
      html: '<p>Даты хранятся как текст: <b>\'2025-06-28\'</b> (год-месяц-день). Такой порядок правильно сортируется, и BETWEEN работает:</p><pre>WHERE borrowed_on BETWEEN \'2025-06-01\' AND \'2025-06-30\'</pre><p><b>strftime</b> достаёт часть даты:</p><pre>strftime(\'%Y\', d)  -- год      2025\nstrftime(\'%m\', d)  -- месяц    06\nstrftime(\'%d\', d)  -- день     28\nstrftime(\'%w\', d)  -- день недели 0=вс … 6=сб</pre><p>Результат — <i>текст</i>, поэтому сравнивайте с кавычками: <b>strftime(\'%m\', d) = \'06\'</b>.</p><p>Чтобы вычесть одну дату из другой, используйте <b>julianday</b> (она превращает дату в номер дня):</p><pre>julianday(returned_on) - julianday(borrowed_on)</pre>'
    },
    basics: {
      title: 'SELECT и FROM',
      html: '<p><b>Таблица</b> — это сетка: столбцы — виды информации, строки — записи.</p><p>Чтобы посмотреть таблицу, задайте вопрос на языке SQL:</p><pre>SELECT *\nFROM residents</pre><p><b>SELECT</b> — какие столбцы показать. Звёздочка <b>*</b> означает «все». <b>FROM</b> — из какой таблицы.</p><p>Можно выбрать столбцы по именам:</p><pre>SELECT first_name, last_name\nFROM residents</pre><p><b>Важно:</b> названия таблиц, столбцов и сами данные в игре на английском — так выглядит настоящая база. Поэтому пишите <b>\'Red\'</b>, а не «рыжий».</p><p>Совет: двойной клик по строке с человеком открывает его досье!</p>'
    },
    where: {
      title: 'WHERE, AND, OR',
      html: '<p><b>WHERE</b> оставляет только строки, подходящие под условие:</p><pre>SELECT *\nFROM residents\nWHERE hair_color = \'Red\'</pre><p>Текст берётся в одинарные кавычки <b>\'вот так\'</b>, числа — без кавычек.</p><p>Условия можно объединять: <b>AND</b> — должны выполняться оба, <b>OR</b> — хотя бы одно.</p><pre>WHERE hair_color = \'Red\' AND shoe_size = 11</pre><p>Сравнения: <b>=</b> равно, <b>&gt;</b> больше, <b>&lt;</b> меньше, <b>&gt;=</b>, <b>&lt;=</b>.</p>'
    },
    operators: {
      title: 'LIKE, BETWEEN, !=',
      html: '<p><b>!=</b> значит «не равно»:</p><pre>WHERE department != \'Legal\'</pre><p><b>BETWEEN</b> проверяет диапазон (оба края включены):</p><pre>WHERE swipe_time BETWEEN \'12:10\' AND \'12:40\'</pre><p><b>LIKE</b> ищет по шаблону. <b>%</b> означает «что угодно»:</p><pre>WHERE first_name LIKE \'D%\'   -- начинается на D\nWHERE last_name LIKE \'%son\'  -- заканчивается на son</pre><p><b>IN</b> проверяет список:</p><pre>WHERE floor IN (3, 4, 5)</pre>'
    },
    order: {
      title: 'ORDER BY, LIMIT',
      html: '<p><b>ORDER BY</b> сортирует результат. Добавьте <b>DESC</b>, чтобы шло от большего к меньшему:</p><pre>SELECT *\nFROM stays\nORDER BY checked_out_at DESC</pre><p><b>LIMIT</b> оставляет только первые строки:</p><pre>SELECT * FROM stays\nORDER BY checked_out_at DESC\nLIMIT 1</pre><p>Порядок слов важен: SELECT, FROM, WHERE, ORDER BY, LIMIT.</p>'
    },
    group: {
      title: 'COUNT, GROUP BY, HAVING',
      html: '<p><b>COUNT(*)</b> считает строки:</p><pre>SELECT COUNT(*) FROM visits</pre><p><b>GROUP BY</b> делает одну строку результата на каждую группу:</p><pre>SELECT first_name, COUNT(*)\nFROM visits\nGROUP BY first_name</pre><p><b>HAVING</b> фильтрует группы (как WHERE, но для подсчётов):</p><pre>GROUP BY first_name\nHAVING COUNT(*) = 3</pre><p>Можно считать:</p><pre>WHERE cookies_start - cookies_sold != cookies_end</pre><p>А ещё можно вложить один запрос в другой с помощью <b>( )</b>:</p><pre>WHERE visit_date IN (SELECT log_date FROM jar_log WHERE ...)</pre>'
    },
    join: {
      title: 'JOIN',
      html: '<p>Связанные факты часто лежат в разных таблицах и соединены номерами (ID). <b>JOIN</b> склеивает таблицы:</p><pre>SELECT *\nFROM loans\nJOIN members ON loans.member_id = members.member_id</pre><p>Читайте так: «для каждой выдачи найди читателя с тем же member_id».</p><p>Таблицам можно давать короткие псевдонимы и соединять несколько таблиц подряд:</p><pre>SELECT m.first_name, b.title\nFROM loans l\nJOIN members m ON l.member_id = m.member_id\nJOIN books b ON l.book_id = b.book_id\nWHERE b.genre = \'Cooking\'</pre>'
    }
  };

  /* ------------------------------------------------------------ Russian cases */
  var cases = {
    1: {
      title: 'Гном-одиночка',
      crime: 'Кража садового гнома',
      warrant: 'краже одного (1) садового гнома по имени «Сэр Реджинальд» из палисадника дома 14 по Maple Lane, что нарушает <b>12 LD PC 101(a)</b>, запрещающую <b>МЕЛКУЮ КРАЖУ НА ТЕРРИТОРИИ ШТАТА ЛОС-ДАТОС</b>.',
      briefing: [
        'Добро пожаловать, новичок! Я офицер Спад, ваш помощник. Не обращайте внимания на фуражку: я знаю всё об этом отделе. В основном — где лежат закуски.',
        'Ваше первое дело: кто-то украл садового гнома по имени «Сэр Реджинальд» из дома 14 по Maple Lane. Владелец безутешен. Два дня он плачет в свои помидоры.',
        'Откройте <b>улики</b>, чтобы прочитать полицейский протокол, затем таблицу <b>residents</b> и пишите SQL-запросы в окне <b>поиск</b>. В <b>учебнике</b> есть всё необходимое.',
        'Когда поймёте, кто виноват, откройте <b>арест</b>, впишите полное имя (как в таблице, латиницей) и подайте ордер. Удачи, детектив!'
      ],
      clues: [
        { title: 'протокол', text: '<h3>Протокол происшествия №0001</h3><p><b>Потерпевший:</b> мистер Джеральд Хобноб, Maple Lane, 14</p><p><b>Пропало:</b> садовый гном в красной шапке с чуть отколотым носом. Откликается на «Сэр Реджинальд».</p><p>Вора видели бегущим по улице на закате. Сосед говорит, что у него были <b>рыжие волосы</b> (в таблице: <b>hair_color = \'Red\'</b>).</p>' },
        { title: 'фото_клумбы', text: '<h3>Фото с места происшествия</h3><p>В клумбе с тюльпанами найден один грязный след.</p><p>Эксперты измерили его: <b>размер обуви 11</b> (столбец <b>shoe_size</b>).</p><p><i>Заметка экспертов: «Просим также сообщить мистеру Хобнобу, что тюльпаны больше не место преступления».</i></p>' }
      ],
      hints: [
        'Начните с просмотра всей таблицы: SELECT * FROM residents',
        'Вам нужны люди с рыжими волосами И размером обуви 11. Используйте WHERE и AND.',
        "Пример: SELECT * FROM residents WHERE hair_color = 'Red' AND shoe_size = 11"
      ]
    },
    2: {
      title: 'Скандал с пропавшим бутербродом',
      crime: 'Кража бутерброда из офисного холодильника',
      warrant: 'поедании чужого бутерброда с тунцом и маринованным огурцом в комнате отдыха на 4-м этаже компании Quibble &amp; Co., что нарушает <b>12 LD PC 101(c)</b>, запрещающую <b>МЕЛКУЮ КРАЖУ НА ТЕРРИТОРИИ ШТАТА ЛОС-ДАТОС</b>.',
      briefing: [
        'Отличная работа с гномом, детектив! Теперь дело посерьёзнее: из офисного холодильника компании Quibble & Co. исчез бутерброд с тунцом и огурцом.',
        'Камеру в комнате отдыха как раз «чистили» (никто в это не верит). Зато <b>журнал пропусков</b> здания работал отлично.',
        'В уликах — временное окно и показания свидетеля. В учебнике новое: <b>LIKE</b>, <b>BETWEEN</b> и <b>!=</b>. Они пригодятся.'
      ],
      clues: [
        { title: 'слова_потерпевшего', text: '<h3>Показания — мистер Пруитт</h3><p>«Я положил бутерброд в холодильник в <b>12:10</b>. Когда вернулся в <b>12:40</b>, его не было. Остался только грустный огурец».</p>' },
        { title: 'записка_свидетеля', text: '<h3>Записка свидетеля — уборщица</h3><p>«Я видела, как кто-то прокрался в <b>Break Room</b> (комнату отдыха). Имя у него начиналось на букву <b>D</b>, это точно».</p><p>«И он точно <b>не из отдела Legal</b>. Эти люди вообще не обедают, по-моему, они роботы».</p>' }
      ],
      hints: [
        'Вор должен был пройти в Break Room между 12:10 и 12:40.',
        "Для временного окна используйте BETWEEN, а для имён на D — LIKE 'D%'.",
        "Пример: SELECT * FROM badge_swipes WHERE location = 'Break Room' AND swipe_time BETWEEN '12:10' AND '12:40' AND first_name LIKE 'D%' AND department != 'Legal'"
      ]
    },
    3: {
      title: 'Хаос при выезде',
      crime: 'Оставил гостиничный номер в безобразном виде',
      warrant: 'том, что оставил в номере отеля Grand Zorro 47 резиновых уточек, недоеденную головку сыра и блёстки, что нарушает <b>21 LD PC 310(b)</b>, запрещающую <b>НАРУШЕНИЕ ОБЩЕСТВЕННОГО ПОРЯДКА НА ТЕРРИТОРИИ ШТАТА ЛОС-ДАТОС</b>.',
      briefing: [
        'Детектив! Управляющий отеля Grand Zorro в ярости. Гость оставил номер, полный резиновых уточек и блёсток. Горничные в шоке.',
        'У отеля есть таблица <b>stays</b> с этажами и временем выезда. У управляющего есть очень точная теория о том, кто это был, — читайте улики.',
        'Новое в учебнике: <b>ORDER BY</b> и <b>LIMIT</b>. Сортировка — лучший друг детектива.'
      ],
      clues: [
        { title: 'жалоба_управляющего', text: '<h3>Жалоба — управляющий отеля</h3><p>«Номер с блёстками был <b>на 3-м этаже или выше</b>. Я знаю, потому что блёстки нашли в лифте, едущем <i>вверх</i>».</p><p>«А ещё гость <b>отказался платить штраф за поздний выезд</b>» (столбец <b>late_fee_paid</b>, значение <b>\'No\'</b>).</p>' },
        { title: 'записка_ночного_портье', text: '<h3>Записка — ночной портье</h3><p>«Из подходящих гостей виновный выехал <b>самым последним</b>. Наверное, потому что ещё прятал улики-уточки».</p>' }
      ],
      hints: [
        "Сначала отфильтруйте: floor >= 3 и late_fee_paid = 'No'.",
        'Затем отсортируйте по checked_out_at от самого позднего: ORDER BY checked_out_at DESC.',
        "Пример: SELECT * FROM stays WHERE floor >= 3 AND late_fee_paid = 'No' ORDER BY checked_out_at DESC LIMIT 1"
      ]
    },
    4: {
      title: 'Ограбление банки с печеньем',
      crime: 'Систематическая кража печенья из пекарни',
      warrant: 'систематической краже печенья из банки на прилавке пекарни Pat’s Perfect Pastries, что нарушает <b>12 LD PC 101(d)</b>, запрещающую <b>ПОВТОРНУЮ МЕЛКУЮ КРАЖУ НА ТЕРРИТОРИИ ШТАТА ЛОС-ДАТОС</b>.',
      briefing: [
        'Очередная волна преступности, детектив. Банка с печеньем в пекарне Pat’s Perfect Pastries всё время пустеет, и Пэт не думает, что это мыши. «Мыши честные», — говорит Пэт.',
        'У вас две таблицы: <b>jar_log</b> (сколько было печенья каждый день) и <b>visits</b> (кто заходил в пекарню).',
        'Идея такая: найдите дни, когда печенье пропадало, а затем найдите того, кто был там <i>во все</i> эти дни. В учебнике теперь есть <b>COUNT</b>, <b>GROUP BY</b> и <b>HAVING</b>.'
      ],
      clues: [
        { title: 'заметки_пэт', text: '<h3>Заметки Пэт</h3><p>«Каждое утро я кладу в банку <b>60 печений</b>. К закрытию <i>cookies_start − cookies_sold</i> должно равняться <i>cookies_end</i>».</p><p>«Если не равно — кто-то угощался без спроса».</p>' },
        { title: 'замечание_по_камере', text: '<h3>Замечание по видеонаблюдению</h3><p>Камера снимает только кассу, а не банку. Но Пэт уверена, что вор приходил <b>в каждый из дней</b>, когда печенье пропадало.</p><p>Подсказка от офицера Спада: посчитайте, сколько из «плохих» дней посетил каждый клиент.</p>' }
      ],
      hints: [
        'Найдите дни с пропажей: SELECT * FROM jar_log WHERE cookies_start - cookies_sold != cookies_end',
        "Затем посмотрите визиты ровно в эти даты: ... WHERE visit_date IN ('дата1', 'дата2', 'дата3')",
        'Сгруппируйте визиты по клиентам и посчитайте их. Тот, кто был во ВСЕ дни пропаж, и есть вор.'
      ]
    },
    5: {
      title: 'Просрочка в библиотеке',
      crime: 'Возврат испорченной библиотечной книги',
      warrant: 'возврате библиотечной кулинарной книги с опозданием и в подливке, муке и пятне неизвестного происхождения, что нарушает <b>33 LD PC 502</b>, запрещающую <b>ПОРЧУ ОБЩЕСТВЕННОГО ИМУЩЕСТВА НА ТЕРРИТОРИИ ШТАТА ЛОС-ДАТОС</b>.',
      briefing: [
        'Детектив, нам позвонила библиотекарь из публичной библиотеки Dunhill. Кулинарную книгу вернули <i>с опозданием</i> и <i>всю в подливке</i>. Она очень спокойна. Слишком спокойна.',
        'На этот раз информация разложена по <b>трём таблицам</b>: <b>members</b>, <b>books</b> и <b>loans</b>. В loans только номера (ID), поэтому таблицы придётся <b>соединять (JOIN)</b>.',
        'Прочитайте новую главу учебника. JOIN выглядит страшно, но это всего лишь «соедини эти две таблицы по совпадающему ID».'
      ],
      clues: [
        { title: 'записка_библиотекаря', text: '<h3>Записка библиотекаря</h3><p>«Испорченная книга была из жанра <b>Cooking</b>. Пятна подливки не врут».</p><p>«Её вернули <b>после срока возврата</b>. Просрочена <i>и</i> противна».</p>' },
        { title: 'обрывок_читательского_билета', text: '<h3>Оторванный уголок читательского билета</h3><p>Приклеился к книге. Читается лишь часть адреса: <b>«…Dunhill»</b>.</p><p>Значит, виновный <b>живёт в Dunhill</b> (столбец <b>city</b>).</p>' }
      ],
      hints: [
        'Вам нужны loans + books (для жанра) + members (для города).',
        'JOIN members ON loans.member_id = members.member_id. То же самое для books по book_id.',
        "Пример: SELECT * FROM loans l JOIN members m ON l.member_id = m.member_id JOIN books b ON l.book_id = b.book_id WHERE b.genre = 'Cooking' AND l.returned_on > l.due_on AND m.city = 'Dunhill'"
      ]
    },
    6: {
      title: 'Беспредел у парковочного счётчика',
      crime: 'Вандализм: разбит парковочный счётчик',
      warrant: 'разбитии парковочного счётчика №17 на Pine Street «очень энергичным замахом боулинг-шара», по описанию свидетелей, что нарушает <b>48 LD MC 447(b)</b>, запрещающую <b>ВАНДАЛИЗМ НА ТЕРРИТОРИИ ШТАТА ЛОС-ДАТОС</b>.',
      briefing: [
        'Вот оно, детектив, — ваше последнее дело. Парковочный счётчик №17 на Pine Street разнесли вдребезги около трёх часов ночи.',
        'На этот раз улики не на бумаге. Откройте <b>браузер</b> и прочитайте, что пишут в интернете. Важны две страницы: местные новости и форум боулинг-лиги Dunhill Lanes.',
        'Таблицы: <b>meter_events</b> (кто и где парковался, и когда), <b>cars</b> и <b>people</b>. Соедините их через JOIN. Объедините всё. Я в вас верю!'
      ],
      clues: [
        { title: 'записка_от_шефа', text: '<h3>Записка от шефа</h3><p>«Не беспокойте больше свидетелей. Они уже всё рассказали газете. Загляните в <b>браузер</b>».</p><p>«И пусть никто больше не говорит слово “метр-мэйд”».</p>' }
      ],
      sites: {
        home: {
          title: 'Стартовая страница',
          html: '<h2 style="margin:0 0 8px">Добро пожаловать в NetSurfer 97</h2><p>Ваше окно во всемирную паутину!</p><ul><li><a data-go="news">Dunhill Daily — местные новости</a></li><li><a data-go="lanes">Форум боулинг-лиги Dunhill Lanes</a></li><li><a data-go="recipes">Уголок бабушкиных рецептов</a></li></ul>'
        },
        news: {
          title: 'Dunhill Daily',
          html: '<h2 style="margin:0">DUNHILL DAILY</h2><hr><h3>Парковочный счётчик расплющен ночным нападением</h3><p>Парковочный счётчик <b>№17</b> на Pine Street превращён в металлолом за ночь. По данным полиции, нападение произошло <b>между 2:00 и 3:30 ночи</b>.</p><p>Жительница, проснувшаяся от шума, видела, как <b>зелёный хэтчбек</b> (в таблице: <b>body = \'Hatchback\'</b>, <b>color = \'Green\'</b>) умчался прочь. «К зеркалу была привязана маленькая кегля», — добавила она.</p><p style="font-size:12px;color:#555">Читайте также: <a data-go="lanes">форум Dunhill Lanes</a></p>'
        },
        lanes: {
          title: 'Форум Dunhill Lanes',
          html: '<h2 style="margin:0">Dunhill Lanes — форум лиги</h2><hr><p><b>Re: Кто носил счастливую куртку?</b></p><p><i>Написал PinPal88:</i> «Говорят, кто-то из нашей лиги ударил шаром по парковочному счётчику! Мы <b>боулеры</b>, а не преступники! Ну. В основном».</p><p><i>Написал StrikeBot:</i> «Напоминание: в городском справочнике только члены лиги имеют хобби “<b>Bowling</b>” (столбец <b>hobby</b>)».</p>'
        },
        recipes: {
          title: 'Бабушкины рецепты',
          html: '<h2 style="margin:0">Уголок бабушкиных рецептов</h2><p>Сегодня: как сделать тост. Шаг 1: положите хлеб в тостер.</p><p><i>Эта страница не имеет отношения к делу, но тосты отличные.</i></p>'
        }
      },
      hints: [
        'Прочитайте новости и форум боулеров в браузере. Выпишите: номер счётчика, временное окно, тип кузова, цвет машины и хобби.',
        'meter_events → cars (по plate) → people (по owner_id = person_id).',
        "Пример: SELECT * FROM meter_events e JOIN cars c ON e.plate = c.plate JOIN people p ON c.owner_id = p.person_id WHERE e.meter_id = 17 AND e.event_time BETWEEN '02:00' AND '03:30' AND c.body = 'Hatchback' AND c.color = 'Green' AND p.hobby = 'Bowling'"
      ]
    },
    7: {
      title: 'Призрак реквизиторской',
      crime: 'Кража Золотой короны из любительского театра',
      warrant: 'том, что взял реквизит <b>Золотая корона</b> из реквизиторской Dunhill Community Theatre и так и не вернул, что нарушает <b>12 LD PC 101(e)</b>, запрещающую <b>МЕЛКУЮ КРАЖУ НА ТЕРРИТОРИИ ШТАТА ЛОС-ДАТОС</b>.',
      briefing: [
        'Детектив, завтра премьера, а <b>Золотая корона</b> из реквизиторской исчезла. Режиссёр ходит кругами и шепчется с пластиковым черепом.',
        'В реквизиторской есть таблица <b>prop_checkouts</b>. Когда кто-то возвращает вещь, дата попадает в <b>returned_on</b>. Если не вернул… ячейка остаётся <b>пустой</b>. В SQL пустая ячейка называется <b>NULL</b>.',
        'Осторожно: NULL — это не ноль и не пустой текст. Это «здесь ничего нет», и искать его через <b>=</b> нельзя. В учебнике появилась новая глава об этом.'
      ],
      clues: [
        { title: 'тирада_режиссёра', text: '<h3>Тирада режиссёра</h3><p>«Золотую корону взяли и <b>так и не вернули</b>. Ни слова, ни открытки!»</p><p>«И тот, кто её взял, <b>не оставил номера телефона</b> в журнале. Как всегда».</p>' },
        { title: 'журнал_реквизита', text: '<h3>Журнал выдачи реквизита</h3><p>Памятка, приколотая к журналу: «<i>Реквизит нужно вернуть в течение недели. Кто не вернул — вор и ещё хам.</i>»</p><p>Заметка Спада: пустые ячейки в таблицах отображаются как <b>NULL</b>. Ищите их через <b>IS NULL</b>, а не через <b>= NULL</b>.</p>' }
      ],
      hints: [
        'Пустые ячейки — это NULL. Сначала посмотрите всю таблицу и найдите их: SELECT * FROM prop_checkouts',
        'Проверяйте NULL через IS NULL (а не = NULL), например: WHERE returned_on IS NULL.',
        "Пример: SELECT * FROM prop_checkouts WHERE prop = 'Golden Crown' AND returned_on IS NULL AND phone IS NULL"
      ]
    },
    8: {
      title: 'Заяц на воротах',
      crime: 'Вынос гигантского плюшевого медведя с ярмарки',
      warrant: 'том, что вынес с ярмарки Wobbly Wheel главный приз — <b>трёхметрового плюшевого медведя по имени Мистер Обнимашка</b>, что нарушает <b>12 LD PC 101(f)</b>, запрещающую <b>МЕЛКУЮ КРАЖУ НА ТЕРРИТОРИИ ШТАТА ЛОС-ДАТОС</b>.',
      briefing: [
        'Ярмарка Wobbly Wheel лишилась главного приза: трёхметрового плюшевого медведя по имени Мистер Обнимашка. Никто не видел, как он уходил. А он очень большой.',
        'На ярмарке есть таблица <b>gate_scans</b>: каждый раз, когда браслет сканируют на одних из четырёх ворот, добавляется строка.',
        'Охрана считает, что вор ходил туда-сюда через <b>разные ворота</b>, чтобы запутать их. Просто считать строки не получится (некоторые люди просто обожают ярмарку). Нужно считать <b>разные</b> ворота — тут пригодится <b>DISTINCT</b>.'
      ],
      clues: [
        { title: 'рапорт_охраны', text: '<h3>Рапорт охраны</h3><p>«Чей-то браслет всё время появлялся на <b>разных воротах</b>. Я бы сказал, что за выходные он прошёл <b>как минимум через 3 разных ворот</b>. Хитрый».</p>' },
        { title: 'записка_из_кассы', text: '<h3>Записка из билетной кассы</h3><p>«Внимание: многие обожают нашу ярмарку и приходят снова и снова, всегда через <b>одни и те же ворота</b>. Тот, у кого больше всего сканирований, скорее всего просто фанат».</p><p>«Считайте <b>разные ворота</b>, а не визиты».</p>' }
      ],
      hints: [
        'Сначала узнайте, какие вообще бывают ворота: SELECT DISTINCT gate FROM gate_scans',
        'Сгруппируйте сканирования по человеку и посчитайте, через сколько разных ворот он проходил: COUNT(DISTINCT gate).',
        'Пример: SELECT first_name, last_name, COUNT(DISTINCT gate) AS gates_used FROM gate_scans GROUP BY first_name, last_name HAVING COUNT(DISTINCT gate) >= 3'
      ]
    },
    9: {
      title: 'Взломщик копилки',
      crime: 'Опустошение школьной копилки и трата денег по городу',
      warrant: 'краже содержимого школьной копилки для сбора средств в Dunhill Elementary и трате денег мелкими хитрыми порциями по всему городу, что нарушает <b>12 LD PC 101(g)</b>, запрещающую <b>МЕЛКУЮ КРАЖУ НА ТЕРРИТОРИИ ШТАТА ЛОС-ДАТОС</b>.',
      briefing: [
        'Большую копилку для сбора средств в Dunhill Elementary опустошили за ночь. С тех пор кто-то тратит деньги по всему городу. Аккуратно.',
        'В таблице <b>purchases</b> — все покупки в пяти маленьких магазинах города, оплаченные помеченными монетами. В учебнике новые инструменты: <b>SUM</b>, <b>AVG</b>, <b>MIN</b> и <b>MAX</b>.',
        'Они называются «агрегатными функциями»: сжимают много строк в одно число. Вместе с <b>GROUP BY</b> получается по одному числу на человека.'
      ],
      clues: [
        { title: 'сводка_лавочников', text: '<h3>Сводка от лавочников</h3><p>«Кто бы это ни был, он потратил <b>больше $300 в сумме</b>. Но никогда не сорил деньгами: <b>ни одной покупки на $30 и больше</b>. И всегда тратит хоть что-то: <b>ничего дешевле $5</b>».</p>' },
        { title: 'записка_бухгалтера', text: '<h3>Записка школьного бухгалтера</h3><p>«<b>Средняя покупка меньше $15</b>. Много мелких покупок, которые складываются. Одни тратят много на одну вещь, а этот вор — подъедал по чуть-чуть».</p>' }
      ],
      hints: [
        'Сумма, среднее, наименьшая и наибольшая покупка по каждому человеку: SELECT first_name, last_name, SUM(amount), AVG(amount), MIN(amount), MAX(amount) FROM purchases GROUP BY first_name, last_name',
        'Группы фильтруйте через HAVING (не WHERE): HAVING SUM(amount) > 300 AND … по условию на каждую улику.',
        'Пример: SELECT first_name, last_name, SUM(amount) AS total, AVG(amount) AS average, MIN(amount) AS smallest, MAX(amount) AS biggest FROM purchases GROUP BY first_name, last_name HAVING SUM(amount) > 300 AND AVG(amount) < 15 AND MIN(amount) >= 5 AND MAX(amount) < 30'
      ]
    },
    10: {
      title: 'Пропавший кубок',
      crime: 'Кража школьного кубка по чемпионату орфографии',
      warrant: 'краже <b>Золотого кубка чемпионата по орфографии</b> из витрины Dunhill Elementary за одну ночь, что нарушает <b>33 LD PC 503</b>, запрещающую <b>КРАЖУ ОБЩЕСТВЕННОГО ИМУЩЕСТВА НА ТЕРРИТОРИИ ШТАТА ЛОС-ДАТОС</b>.',
      briefing: [
        'Золотой кубок по орфографии пропал из Dunhill Elementary за одну ночь. В заявлении для прессы директор написала «разочарован» с ошибкой. Дважды.',
        'Две таблицы: <b>staff</b> (все, кто работает в школе) и <b>night_badges</b> (кто прошёл через главный вход по пропуску прошлой ночью).',
        'На этот раз виновного <b>нет</b> в журнале. Обычный JOIN выбрасывает людей без пары. Вам нужен <b>LEFT JOIN</b>: он оставляет всех из левой таблицы, а пустые места заполняет NULL.'
      ],
      clues: [
        { title: 'показания_директора', text: '<h3>Показания — директор</h3><p>«У вора был <b>ключ от здания</b>. Ещё я нашла на полу <b>сеточку для волос</b>, так что это кто-то из <b>Cafeteria</b> (столовой)».</p>' },
        { title: 'записка_охраны', text: '<h3>Записка охраны</h3><p>«Главный вход записывает все пропуска. Но вор прошёл через чёрный ход, поэтому его <b>вообще нет в журнале прошлой ночи</b>. На чёрном ходе нет считывателя. Скоро поставим».</p>' }
      ],
      hints: [
        'Вам нужны сотрудники, у которых НЕТ строки в night_badges. Обычный JOIN их отбросит, поэтому используйте LEFT JOIN staff … ON …',
        'После LEFT JOIN у людей без пары в столбцах пропусков стоит NULL: WHERE n.badge_id IS NULL.',
        "Пример: SELECT * FROM staff s LEFT JOIN night_badges n ON s.staff_id = n.staff_id WHERE n.badge_id IS NULL AND s.has_key = 'Yes' AND s.department = 'Cafeteria'"
      ]
    },
    11: {
      title: 'Тайна садовых ножниц',
      crime: 'Присвоение взятых напрокат садовых ножниц',
      warrant: 'том, что взял единственные <b>садовые ножницы (Hedge Trimmer)</b> из прокатной мастерской Dunhill, удерживал их намного дольше срока и подстриг городскую изгородь в скульптуру мэра, что нарушает <b>12 LD PC 108</b>, запрещающую <b>НЕЦЕЛЕВОЕ ИСПОЛЬЗОВАНИЕ ВЗЯТОГО ВО ВРЕМЕННОЕ ПОЛЬЗОВАНИЕ ИМУЩЕСТВА НА ТЕРРИТОРИИ ШТАТА ЛОС-ДАТОС</b>.',
      briefing: [
        'Детектив, городскую изгородь у мэрии кто-то подстриг в удивительно точную скульптуру мэра. Мэру не льстит. Единственные садовые ножницы в городе принадлежат прокатной мастерской Dunhill Tool Library.',
        'В таблице <b>tool_loans</b> у каждой выдачи две даты: <b>borrowed_on</b> и <b>returned_on</b>. Даты записаны текстом, например <b>2025-06-28</b>: год, месяц, день. Такой порядок выбран не случайно — он правильно сортируется.',
        'Новая глава учебника: <b>даты</b>. <b>strftime</b> достаёт месяц или день недели, а <b>julianday</b> позволяет вычесть одну дату из другой.'
      ],
      clues: [
        { title: 'журнал_мастерской', text: '<h3>Журнал мастера проката</h3><p>«Садовые ножницы взяли <b>в июне</b> и держали <b>больше 10 дней</b>. Правило — 7 дней. Я повесила это правило на очень большой плакат».</p>' },
        { title: 'квитанция_возврата', text: '<h3>Квитанция о возврате</h3><p>«Ножницы вернули в листьях в <b>субботу</b>. По воскресеньям мы закрыты, и вор, очевидно, это знал».</p><p>Заметка Спада: <b>strftime(\'%w\', date)</b> возвращает день недели: 0 — воскресенье, 6 — суббота.</p>' }
      ],
      hints: [
        "Начните с инструмента: WHERE tool = 'Hedge Trimmer'. Потом разберите каждую улику про даты отдельно.",
        "Месяц: strftime('%m', borrowed_on) = '06'. Сколько держал: julianday(returned_on) - julianday(borrowed_on) > 10. День недели: strftime('%w', returned_on) = '6'.",
        "Пример: SELECT * FROM tool_loans WHERE tool = 'Hedge Trimmer' AND strftime('%m', borrowed_on) = '06' AND julianday(returned_on) - julianday(borrowed_on) > 10 AND strftime('%w', returned_on) = '6'"
      ]
    }
  };

  root.SQLD_I18N = { en: { ui: en }, ru: { ui: ru, manual: manual, cases: cases } };
})(typeof window !== 'undefined' ? window : globalThis);
