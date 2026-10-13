/* SQL Detective — case files.
 * Every case is generated deterministically (seeded RNG), so the data is identical on every run.
 * Planted rows guarantee exactly one culprit; tests/verify-cases.js checks it with real SQL.
 */
(function (root) {
  'use strict';

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var FIRST = ['Agnes', 'Bruno', 'Cleo', 'Dexter', 'Edith', 'Felix', 'Gwen', 'Harvey', 'Iris', 'Jasper',
    'Kiki', 'Lionel', 'Maude', 'Nigel', 'Olive', 'Pablo', 'Quinn', 'Rosa', 'Stanley', 'Tilda',
    'Ulrich', 'Vera', 'Walter', 'Xena', 'Yosef', 'Zelda', 'Abel', 'Berta', 'Cyrus', 'Dolores',
    'Eugene', 'Fiona', 'Gus', 'Hattie', 'Ignacio', 'Jolene', 'Kurt', 'Lucia', 'Milo', 'Nora',
    'Orville', 'Penny', 'Rufus', 'Sadie', 'Tobias', 'Una', 'Victor', 'Wanda', 'Yuri', 'Zora'];
  var LAST = ['Applebaum', 'Brindle', 'Crumpet', 'Dobbs', 'Eggleston', 'Fumble', 'Grimsby', 'Hobart',
    'Ingram', 'Juniper', 'Kettle', 'Lumley', 'Mortimer', 'Nibbs', 'Oddie', 'Pickering', 'Quimby',
    'Rattigan', 'Snodgrass', 'Tumbler', 'Underhill', 'Vandersloot', 'Wobbleton', 'Yarrow', 'Zephyr',
    'Abernathy', 'Bumble', 'Cobblepot', 'Dingle', 'Fenwick', 'Gudgeon', 'Higgins', 'Jellicoe',
    'Kipper', 'Lovett', 'Muddle', 'Nettleby', 'Pudding', 'Quill', 'Ravenscroft', 'Sprocket', 'Thistle'];

  function Names(rng, taken) {
    var used = {};
    (taken || []).forEach(function (n) { used[n] = 1; });
    return function () {
      for (var i = 0; i < 500; i++) {
        var f = FIRST[Math.floor(rng() * FIRST.length)];
        var l = LAST[Math.floor(rng() * LAST.length)];
        var key = f + ' ' + l;
        if (!used[key] && !used[f] && !used[l]) { used[key] = 1; used[f] = 1; used[l] = 1; return [f, l]; }
      }
      throw new Error('out of names');
    };
  }
  function pick(rng, a) { return a[Math.floor(rng() * a.length)]; }
  function int(rng, lo, hi) { return lo + Math.floor(rng() * (hi - lo + 1)); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function hhmm(mins) { return pad(Math.floor(mins / 60)) + ':' + pad(mins % 60); }
  function shuffle(rng, a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  // Keep generating rows until one does NOT satisfy the "this would make a second culprit" test.
  function safeRow(make, isBad) {
    for (var i = 0; i < 1000; i++) { var r = make(); if (!isBad(r)) return r; }
    throw new Error('could not build a safe row');
  }

  var CASES = [];

  /* ------------------------------------------------------------------ CASE 1 */
  (function () {
    var rng = mulberry32(101);
    var nm = Names(rng, ['Winifred', 'Plum']);
    var streets = ['Maple Lane', 'Oak Street', 'Elm Court', 'Birch Avenue', 'Cedar Road'];
    var hair = ['Black', 'Brown', 'Blonde', 'Red', 'Gray'];
    var jobs = ['Baker', 'Plumber', 'Teacher', 'Retired', 'Mailman', 'Florist', 'Cashier', 'Dentist', 'Student', 'Clown'];
    var bad = function (r) { return r[5] === 'Red' && r[6] === 11; };
    var rows = [];
    var id = 1;
    function mk() {
      var n = nm();
      return [0, n[0], n[1], pick(rng, streets), int(rng, 1, 60), pick(rng, hair), int(rng, 6, 13), pick(rng, jobs)];
    }
    for (var i = 0; i < 34; i++) rows.push(safeRow(mk, bad));
    // planted: decoys and culprit
    rows[3][5] = 'Red'; rows[3][6] = 9;
    rows[8][5] = 'Red'; rows[8][6] = 7;
    rows[14][5] = 'Red'; rows[14][6] = 12;
    rows[19][5] = 'Brown'; rows[19][6] = 11;
    rows[22][5] = 'Black'; rows[22][6] = 11;
    rows[27][5] = 'Gray'; rows[27][6] = 11;
    rows.splice(17, 0, [0, 'Winifred', 'Plum', 'Birch Avenue', 31, 'Red', 11, 'Florist']);
    rows.forEach(function (r) { r[0] = id++; });

    CASES.push({
      id: 1,
      title: 'Gnome Alone',
      crime: 'Petty theft of a garden gnome',
      law: '12 LD PC 101(a)',
      warrant: 'stealing one (1) garden gnome named “Sir Reginald” from the front garden of 14 Maple Lane, violating <b>12 LD PC 101(a)</b> which prohibits <b>PETTY THEFT IN THE STATE OF LOS DATOS</b>.',
      location: '14 Maple Lane',
      manual: ['basics', 'where'],
      briefing: [
        'Welcome, recruit! I’m Officer Spud, your assistant. Don’t let the hat fool you — I know everything about this department. Mostly where the snacks are.',
        'Your first case: someone stole a garden gnome called “Sir Reginald” from 14 Maple Lane. The owner is devastated. He has been crying into his tomato plants for two days.',
        'Open <b>clues</b> to read the police report, then open the <b>residents</b> table and use <b>search</b> to write SQL queries. Your <b>manual</b> will explain everything you need.',
        'When you know who did it, open <b>arrest</b>, type their full name and submit the warrant. Good luck, Detective!'
      ],
      tables: {
        residents: {
          columns: ['resident_id', 'first_name', 'last_name', 'street', 'house_no', 'hair_color', 'shoe_size', 'occupation'],
          rows: rows
        }
      },
      clues: [
        { title: 'police_report', text: '<h3>Incident report #0001</h3><p><b>Victim:</b> Mr. Gerald Hobnob, 14 Maple Lane</p><p><b>Missing item:</b> garden gnome, red hat, slightly chipped nose. Goes by “Sir Reginald”.</p><p>The thief was seen sprinting down the street at dusk. A neighbor says they had <b>red hair</b>.</p>' },
        { title: 'flowerbed_photo', text: '<h3>Evidence photo</h3><p>A single muddy footprint was found in the tulip bed.</p><p>The forensics team measured it: <b>shoe size 11</b>.</p><p><i>Note from forensics: “Please also tell Mr. Hobnob the tulips are not a crime scene any more.”</i></p>' }
      ],
      culprit: 'Winifred Plum',
      solution: "SELECT * FROM residents WHERE hair_color = 'Red' AND shoe_size = 11",
      hints: [
        'Start by looking at the whole table: SELECT * FROM residents',
        'You need people with red hair AND shoe size 11. Use WHERE with AND.',
        "Try: SELECT * FROM residents WHERE hair_color = 'Red' AND shoe_size = 11"
      ]
    });
  })();

  /* ------------------------------------------------------------------ CASE 2 */
  (function () {
    var rng = mulberry32(202);
    var nm = Names(rng, ['Dorian', 'Fitch']);
    var depts = ['Accounting', 'Legal', 'Marketing', 'Sales', 'IT'];
    var locs = ['Lobby', 'Break Room', 'Elevator', 'Server Room', 'Parking'];
    var swipeId = 1;
    var rows = [];
    function isMatch(r) { // r = [id, first, last, dept, loc, time]
      return r[4] === 'Break Room' && r[5] >= '12:10' && r[5] <= '12:40' && /^D/.test(r[1]) && r[3] !== 'Legal';
    }
    var emps = [];
    for (var i = 0; i < 13; i++) { var n = nm(); emps.push([n[0], n[1], pick(rng, depts)]); }
    // names starting with D exist among decoys
    emps[2][0] = 'Dolores'; emps[2][2] = 'Legal';      // D but Legal
    emps[5][0] = 'Dexter'; emps[5][2] = 'Sales';       // D, not Legal, but wrong time
    emps[9][0] = 'Daria'; emps[9][2] = 'IT';           // D, not Legal, wrong place
    emps.push(['Dorian', 'Fitch', 'Marketing']);        // culprit
    // names uniqueness among planted
    emps.forEach(function (e) { e.slice(0, 2); });
    emps.forEach(function (e) {
      var count = int(rng, 3, 5);
      for (var k = 0; k < count; k++) {
        var make = function () {
          return [0, e[0], e[1], e[2], pick(rng, locs), hhmm(int(rng, 8 * 60, 17 * 60 + 30))];
        };
        rows.push(safeRow(make, isMatch));
      }
    });
    // planted rows
    rows.push([0, 'Dolores', emps[2][1], 'Legal', 'Break Room', '12:20']);          // D + window, but Legal
    rows.push([0, 'Dexter', emps[5][1], 'Sales', 'Break Room', '13:05']);           // D, break room, too late
    rows.push([0, 'Daria', emps[9][1], 'IT', 'Server Room', '12:25']);              // D, in window, wrong place
    rows.push([0, emps[0][0], emps[0][1], emps[0][2], 'Break Room', '12:15']);      // window + break room, not D
    rows.push([0, emps[7][0], emps[7][1], emps[7][2], 'Break Room', '12:32']);      // same
    rows.push([0, 'Dorian', 'Fitch', 'Marketing', 'Break Room', '12:27']);          // culprit
    // sanity: nobody else matches
    shuffle(rng, rows);
    rows.sort(function (a, b) { return a[5] < b[5] ? -1 : a[5] > b[5] ? 1 : 0; });
    rows.forEach(function (r) { r[0] = swipeId++; });

    CASES.push({
      id: 2,
      title: 'The Soggy Sandwich Scandal',
      crime: 'Theft of a sandwich from the office fridge',
      law: '12 LD PC 101(c)',
      warrant: 'eating a tuna-and-pickle sandwich belonging to another person in the 4th-floor Break Room of Quibble &amp; Co., violating <b>12 LD PC 101(c)</b> which prohibits <b>PETTY THEFT IN THE STATE OF LOS DATOS</b>.',
      location: 'Quibble & Co. office, 4th floor',
      manual: ['basics', 'where', 'operators'],
      briefing: [
        'Nice work on the gnome, Detective! Now something more serious: a tuna-and-pickle sandwich vanished from the Quibble & Co. office fridge.',
        'The security camera in the break room was “being cleaned” at the time (nobody believes this). But the building’s <b>door badge log</b> was working perfectly.',
        'Check the clues for the time window and witness statements. New in your manual: <b>LIKE</b>, <b>BETWEEN</b> and <b>!=</b>. They will be useful.'
      ],
      tables: {
        badge_swipes: {
          columns: ['swipe_id', 'first_name', 'last_name', 'department', 'location', 'swipe_time'],
          rows: rows
        }
      },
      clues: [
        { title: 'victim_statement', text: '<h3>Statement — Mr. Pruitt</h3><p>“I put my sandwich in the fridge at <b>12:10</b>. When I came back at <b>12:40</b>, it was gone. All that remained was a sad pickle.”</p>' },
        { title: 'witness_note', text: '<h3>Witness note — office cleaner</h3><p>“I saw someone sneak into the <b>Break Room</b>. Their first name started with the letter <b>D</b>, I’m sure of that.”</p><p>“Oh, and they were definitely <b>not from Legal</b>. Those people never eat lunch; I think they are robots.”</p>' }
      ],
      culprit: 'Dorian Fitch',
      solution: "SELECT * FROM badge_swipes WHERE location = 'Break Room' AND swipe_time BETWEEN '12:10' AND '12:40' AND first_name LIKE 'D%' AND department != 'Legal'",
      hints: [
        'The thief must have swiped into the Break Room between 12:10 and 12:40.',
        "Use BETWEEN for the time window and LIKE 'D%' for names starting with D.",
        "Try: SELECT * FROM badge_swipes WHERE location = 'Break Room' AND swipe_time BETWEEN '12:10' AND '12:40' AND first_name LIKE 'D%' AND department != 'Legal'"
      ]
    });
  })();

  /* ------------------------------------------------------------------ CASE 3 */
  (function () {
    var rng = mulberry32(303);
    var nm = Names(rng, ['Magnus', 'Boddington']);
    var rows = [];
    function isBad(r) { // r = [id, first, last, room, floor, due, out, paid]
      return r[4] >= 3 && r[7] === 'No' && r[6] >= '12:55';
    }
    function mk() {
      var n = nm();
      var floor = int(rng, 1, 6);
      var late = rng() < 0.4;
      var out = late ? hhmm(int(rng, 11 * 60 + 5, 14 * 60)) : hhmm(int(rng, 8 * 60, 10 * 60 + 55));
      return [0, n[0], n[1], floor * 100 + int(rng, 1, 20), floor, '11:00', out, rng() < 0.5 ? 'Yes' : 'No'];
    }
    for (var i = 0; i < 28; i++) rows.push(safeRow(mk, isBad));
    var P = function (f, l, floor, out, paid) { return [0, f, l, floor * 100 + int(rng, 1, 20), floor, '11:00', out, paid]; };
    rows.splice(5, 0, P('Hilda', 'Cobbwright', 2, '14:20', 'No'));    // latest overall, but floor 2
    rows.splice(11, 0, P('Roland', 'Peabody', 5, '14:05', 'Yes'));    // late, high floor, but paid
    rows.splice(18, 0, P('Magnus', 'Boddington', 4, '13:40', 'No'));  // culprit
    rows.splice(24, 0, P('Prue', 'Tumblewick', 3, '12:35', 'No'));    // qualifies except earlier
    rows.splice(29, 0, P('Clive', 'Fogarty', 6, '12:50', 'No'));      // qualifies except earlier
    var id = 1; rows.forEach(function (r) { r[0] = id++; });

    CASES.push({
      id: 3,
      title: 'Checkout Chaos',
      crime: 'Leaving a hotel room in a disgraceful state',
      law: '21 LD PC 310(b)',
      warrant: 'leaving 47 rubber ducks, a half-eaten wheel of cheese and glitter in a room of the Grand Zorro Hotel, violating <b>21 LD PC 310(b)</b> which prohibits <b>DISORDERLY CONDUCT IN THE STATE OF LOS DATOS</b>.',
      location: 'The Grand Zorro Hotel',
      manual: ['basics', 'where', 'operators', 'order'],
      briefing: [
        'Detective! The manager of the Grand Zorro Hotel is furious. A guest left their room filled with rubber ducks and glitter. Housekeeping is traumatized.',
        'The hotel keeps a <b>stays</b> table with floors and checkout times. The manager has a very specific theory about who it was — read the clues.',
        'New in your manual: <b>ORDER BY</b> and <b>LIMIT</b>. Sorting is a detective’s best friend.'
      ],
      tables: {
        stays: {
          columns: ['stay_id', 'first_name', 'last_name', 'room', 'floor', 'checkout_due', 'checked_out_at', 'late_fee_paid'],
          rows: rows
        }
      },
      clues: [
        { title: 'manager_complaint', text: '<h3>Complaint — Hotel Manager</h3><p>“The glitter room was <b>on the 3rd floor or higher</b>. I know because the glitter was found in the elevator going <i>up</i>.”</p><p>“Also, the guest <b>refused to pay the late fee</b>.”</p>' },
        { title: 'night_clerk_note', text: '<h3>Note — Night clerk</h3><p>“Among the guests who match, the culprit was <b>the very last one to check out</b>. Probably because they were still hiding duck evidence.”</p>' }
      ],
      culprit: 'Magnus Boddington',
      solution: "SELECT * FROM stays WHERE floor >= 3 AND late_fee_paid = 'No' ORDER BY checked_out_at DESC LIMIT 1",
      hints: [
        'Filter first: floor >= 3 and late_fee_paid = \'No\'.',
        'Then sort by checked_out_at from latest to earliest: ORDER BY checked_out_at DESC.',
        "Try: SELECT * FROM stays WHERE floor >= 3 AND late_fee_paid = 'No' ORDER BY checked_out_at DESC LIMIT 1"
      ]
    });
  })();

  /* ------------------------------------------------------------------ CASE 4 */
  (function () {
    var rng = mulberry32(404);
    var nm = Names(rng, ['Barnaby', 'Crumb']);
    var days = [];
    for (var d = 3; d <= 16; d++) days.push('2025-03-' + pad(d));
    var theft = [days[2], days[6], days[10]];
    var jar = [];
    days.forEach(function (day, i) {
      var start = 60, sold = int(rng, 18, 34), end = start - sold;
      if (theft.indexOf(day) >= 0) end -= int(rng, 9, 15);
      jar.push([i + 1, day, start, sold, end]);
    });
    var customers = [];
    for (var i = 0; i < 14; i++) { var n = nm(); customers.push([n[0], n[1]]); }
    customers.push(['Barnaby', 'Crumb']);
    var items = ['Croissant', 'Eclair', 'Sourdough', 'Muffin', 'Donut', 'Baguette'];
    var rows = [];
    customers.forEach(function (c, idx) {
      var chosen = [];
      if (idx === 14) chosen = theft.slice().concat([days[0], days[12]]);
      else if (idx === 1) chosen = [theft[0], theft[1], days[4], days[9]];
      else if (idx === 4) chosen = [theft[1], theft[2], days[0], days[13]];
      else if (idx === 8) chosen = [theft[0], theft[2], days[5], days[11]];
      else {
        var k = int(rng, 3, 5);
        var pool = days.slice();
        shuffle(rng, pool);
        chosen = pool.slice(0, k);
        var cnt = chosen.filter(function (x) { return theft.indexOf(x) >= 0; }).length;
        if (cnt >= 3) chosen[0] = days[0];
      }
      chosen.forEach(function (day) { rows.push([0, c[0], c[1], day, pick(rng, items)]); });
    });
    rows.sort(function (a, b) { return a[3] < b[3] ? -1 : a[3] > b[3] ? 1 : 0; });
    var id = 1; rows.forEach(function (r) { r[0] = id++; });

    CASES.push({
      id: 4,
      title: 'The Cookie Jar Heist',
      crime: 'Repeated theft of cookies from a bakery',
      law: '12 LD PC 101(d)',
      warrant: 'repeatedly stealing cookies from the counter jar of Pat’s Perfect Pastries, violating <b>12 LD PC 101(d)</b> which prohibits <b>REPEAT PETTY THEFT IN THE STATE OF LOS DATOS</b>.',
      location: 'Pat’s Perfect Pastries',
      manual: ['basics', 'where', 'operators', 'order', 'group'],
      briefing: [
        'Another crime wave, Detective. The cookie jar at Pat’s Perfect Pastries keeps running low, and Pat does not think it is the mice. “The mice are honest,” Pat says.',
        'You have two tables: <b>jar_log</b> (how many cookies there were each day) and <b>visits</b> (who came to the bakery).',
        'The idea: find the days when cookies went missing, then find who was there on <i>all</i> of them. Your manual now covers <b>COUNT</b>, <b>GROUP BY</b> and <b>HAVING</b>.'
      ],
      tables: {
        jar_log: {
          columns: ['log_id', 'log_date', 'cookies_start', 'cookies_sold', 'cookies_end'],
          rows: jar
        },
        visits: {
          columns: ['visit_id', 'first_name', 'last_name', 'visit_date', 'bought'],
          rows: rows
        }
      },
      clues: [
        { title: 'pat_notes', text: '<h3>Pat’s notes</h3><p>“Every morning I put <b>60 cookies</b> in the jar. By closing time, <i>cookies_start − cookies_sold</i> should equal <i>cookies_end</i>.”</p><p>“If it doesn’t, somebody has been helping themselves.”</p>' },
        { title: 'cctv_remark', text: '<h3>CCTV remark</h3><p>The camera only films the till, not the jar. But Pat is certain the thief came in <b>on every single day</b> that cookies went missing.</p><p>Hint from Officer Spud: count how many of the “missing” days each customer visited.</p>' }
      ],
      culprit: 'Barnaby Crumb',
      solution: "SELECT first_name, last_name, COUNT(*) AS days_present FROM visits WHERE visit_date IN (SELECT log_date FROM jar_log WHERE cookies_start - cookies_sold != cookies_end) GROUP BY first_name, last_name HAVING COUNT(*) = 3",
      hints: [
        'Find the days with missing cookies: SELECT * FROM jar_log WHERE cookies_start - cookies_sold != cookies_end',
        "Then look at visits on exactly those dates: ... WHERE visit_date IN ('date1', 'date2', 'date3')",
        'Group the visits by customer and count them. Whoever was there on ALL missing days is the thief.'
      ]
    });
  })();

  /* ------------------------------------------------------------------ CASE 5 */
  (function () {
    var rng = mulberry32(505);
    var nm = Names(rng, ['Philippa', 'Loafington']);
    var cities = ['Dunhill', 'Brookfield', 'Westmarsh', 'Pinecrest'];
    var members = [];
    for (var i = 0; i < 17; i++) { var n = nm(); members.push([i + 1, n[0], n[1], pick(rng, cities)]); }
    members.push([18, 'Philippa', 'Loafington', 'Dunhill']);
    var books = [
      [1, 'Soufflé Secrets', 'Cooking'], [2, 'One Hundred Soups', 'Cooking'], [3, 'The Haunted Lighthouse', 'Mystery'],
      [4, 'Murder at the Marmalade Factory', 'Mystery'], [5, 'Beginner’s Birdwatching', 'Nature'], [6, 'Deep Sea Oddities', 'Nature'],
      [7, 'Space Pirates of Neptune', 'Sci-Fi'], [8, 'The Last Robot Librarian', 'Sci-Fi'], [9, 'Knitting for Cats', 'Hobbies'],
      [10, 'Competitive Cheese Rolling', 'Hobbies']
    ];
    var cooking = [1, 2];
    var loans = [];
    function dayStr(offset) { // days after 2025-09-01
      var d = new Date(Date.UTC(2025, 8, 1 + offset));
      return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate());
    }
    function memberCity(id) { return members[id - 1][3]; }
    function bad(l) { // l = [id, member, book, loaned, due, returned]
      return memberCity(l[1]) === 'Dunhill' && cooking.indexOf(l[2]) >= 0 && l[5] > l[4];
    }
    function mk() {
      var off = int(rng, 0, 60);
      var late = rng() < 0.4;
      return [0, int(rng, 1, 17), int(rng, 1, 10), dayStr(off), dayStr(off + 14), dayStr(off + (late ? int(rng, 15, 30) : int(rng, 5, 14)))];
    }
    for (var j = 0; j < 36; j++) loans.push(safeRow(mk, bad));
    // planted
    var dunhillOthers = members.filter(function (m) { return m[3] === 'Dunhill' && m[0] !== 18; });
    var nonDunhill = members.filter(function (m) { return m[3] !== 'Dunhill'; });
    if (!dunhillOthers.length) { members[0][3] = 'Dunhill'; dunhillOthers = [members[0]]; }
    loans.push([0, 18, 1, dayStr(30), dayStr(44), dayStr(61)]);                         // culprit: cooking, late, Dunhill
    loans.push([0, 18, 3, dayStr(10), dayStr(24), dayStr(20)]);                         // culprit also read a mystery on time
    loans.push([0, nonDunhill[0][0], 1, dayStr(20), dayStr(34), dayStr(52)]);           // cooking late, wrong city
    loans.push([0, nonDunhill[1][0], 2, dayStr(15), dayStr(29), dayStr(49)]);           // cooking late, wrong city
    loans.push([0, dunhillOthers[0][0], 2, dayStr(25), dayStr(39), dayStr(36)]);        // Dunhill + cooking, on time
    loans.push([0, dunhillOthers[0][0], 7, dayStr(5), dayStr(19), dayStr(40)]);         // Dunhill late, wrong genre
    loans.sort(function (a, b) { return a[3] < b[3] ? -1 : a[3] > b[3] ? 1 : 0; });
    var id = 1; loans.forEach(function (l) { l[0] = id++; });

    CASES.push({
      id: 5,
      title: 'Overdue at the Library',
      crime: 'Returning a damaged library book',
      law: '33 LD PC 502',
      warrant: 'returning a library cookbook late and covered in gravy, flour and a mystery stain, violating <b>33 LD PC 502</b> which prohibits <b>DAMAGING PUBLIC PROPERTY IN THE STATE OF LOS DATOS</b>.',
      location: 'Dunhill Public Library',
      manual: ['basics', 'where', 'operators', 'order', 'group', 'join'],
      briefing: [
        'Detective, the librarian at Dunhill Public Library has called us. A cookbook was returned <i>late</i> and <i>covered in gravy</i>. She is very calm about it. Too calm.',
        'This time the information is split across <b>three tables</b>: <b>members</b>, <b>books</b> and <b>loans</b>. The loans table only contains ID numbers, so you will need to <b>JOIN</b> tables together.',
        'Read the new chapter in your manual. JOIN looks scary but it is only “connect these two tables by their matching ID”.'
      ],
      tables: {
        members: { columns: ['member_id', 'first_name', 'last_name', 'city'], rows: members },
        books: { columns: ['book_id', 'title', 'genre'], rows: books },
        loans: { columns: ['loan_id', 'member_id', 'book_id', 'loaned_on', 'due_on', 'returned_on'], rows: loans }
      },
      clues: [
        { title: 'librarian_note', text: '<h3>Note from the librarian</h3><p>“The damaged book was a <b>Cooking</b> book. Gravy stains don’t lie.”</p><p>“It was returned <b>after its due date</b>. Late <i>and</i> gross.”</p>' },
        { title: 'membership_card_scan', text: '<h3>Torn-off corner of a membership card</h3><p>Found stuck to the book. Only part of an address is readable: <b>“…Dunhill”</b>.</p><p>So the culprit <b>lives in Dunhill</b>.</p>' }
      ],
      culprit: 'Philippa Loafington',
      solution: "SELECT m.first_name, m.last_name, b.title FROM loans l JOIN members m ON l.member_id = m.member_id JOIN books b ON l.book_id = b.book_id WHERE b.genre = 'Cooking' AND l.returned_on > l.due_on AND m.city = 'Dunhill'",
      hints: [
        'You need loans + books (for the genre) + members (for the city).',
        'JOIN members ON loans.member_id = members.member_id. Do the same for books with book_id.',
        "Try: SELECT * FROM loans l JOIN members m ON l.member_id = m.member_id JOIN books b ON l.book_id = b.book_id WHERE b.genre = 'Cooking' AND l.returned_on > l.due_on AND m.city = 'Dunhill'"
      ]
    });
  })();

  /* ------------------------------------------------------------------ CASE 6 */
  (function () {
    var rng = mulberry32(606);
    var nm = Names(rng, ['Ramona', 'Gutterball']);
    var cities = ['Dunhill', 'Brookfield', 'Westmarsh'];
    var hobbies = ['Bowling', 'Gardening', 'Chess', 'Fishing', 'Knitting', 'Cycling'];
    var jobs = ['Accountant', 'Barber', 'Chef', 'Driver', 'Nurse', 'Painter', 'Clerk'];
    var bodies = ['Sedan', 'Hatchback', 'Van', 'Truck'];
    var colors = ['Green', 'Blue', 'Red', 'White', 'Black'];
    var people = [], cars = [];
    for (var i = 0; i < 22; i++) {
      var n = nm();
      people.push([i + 1, n[0], n[1], pick(rng, cities), pick(rng, hobbies), pick(rng, jobs)]);
    }
    people.push([23, 'Ramona', 'Gutterball', 'Westmarsh', 'Bowling', 'Barber']);
    var makes = ['Zoomer', 'Plinko', 'Waggle', 'Bumbler', 'Toastmobile'];
    people.forEach(function (p, idx) {
      cars.push(['LD-' + (4000 + idx * 37 + int(rng, 1, 30)), pick(rng, makes), pick(rng, bodies), pick(rng, colors), p[0]]);
    });
    // planted cars
    cars[22] = [cars[22][0], 'Plinko', 'Hatchback', 'Green', 23];                  // culprit
    function setCar(personId, body, color) { var c = cars[personId - 1]; c[2] = body; c[3] = color; }
    // decoys: a bowler with a hatchback of wrong colour, a green hatchback owner who doesn't bowl, a bowler with green sedan
    people[1][4] = 'Bowling'; setCar(2, 'Hatchback', 'Blue');
    people[4][4] = 'Chess'; setCar(5, 'Hatchback', 'Green');
    people[7][4] = 'Bowling'; setCar(8, 'Sedan', 'Green');
    people[10][4] = 'Gardening'; setCar(11, 'Hatchback', 'Green');
    people[13][4] = 'Bowling'; setCar(14, 'Hatchback', 'Green');                    // would be perfect... but not at the meter at that time
    // everyone else must not be (Bowling + Hatchback + Green)
    people.forEach(function (p, idx) {
      if (p[0] === 23 || p[0] === 14) return;
      if (p[4] === 'Bowling' && cars[idx][2] === 'Hatchback' && cars[idx][3] === 'Green') cars[idx][3] = 'Black';
    });
    var plates = cars.map(function (c) { return c[0]; });
    var carByPlate = {}; cars.forEach(function (c) { carByPlate[c[0]] = c; });
    var personById = {}; people.forEach(function (p) { personById[p[0]] = p; });
    function isMatch(e) { // e = [id, meter, plate, time, type]
      var c = carByPlate[e[2]], p = personById[c[4]];
      return e[1] === 17 && e[3] >= '02:00' && e[3] <= '03:30' && c[2] === 'Hatchback' && c[3] === 'Green' && p[4] === 'Bowling';
    }
    var events = [];
    function mk() {
      var meter = int(rng, 1, 25);
      var t = hhmm(int(rng, 0, 23 * 60 + 59));
      return [0, meter, pick(rng, plates), t, rng() < 0.7 ? 'Parked' : 'Left'];
    }
    for (var j = 0; j < 60; j++) events.push(safeRow(mk, isMatch));
    events.push([0, 17, cars[22][0], '02:48', 'Parked']);        // culprit
    events.push([0, 17, cars[13][0], '04:10', 'Parked']);        // other bowler-hatchback, but too late
    events.push([0, 9, cars[13][0], '02:40', 'Parked']);         // ...and elsewhere
    events.push([0, 17, cars[4][0], '02:15', 'Parked']);         // green hatchback, not a bowler
    events.push([0, 17, cars[10][0], '03:05', 'Parked']);        // green hatchback, gardener
    events.push([0, 17, cars[7][0], '02:30', 'Parked']);         // bowler, green sedan
    events.push([0, 17, cars[1][0], '03:20', 'Parked']);         // bowler, blue hatchback
    events.sort(function (a, b) { return a[3] < b[3] ? -1 : a[3] > b[3] ? 1 : 0; });
    var id = 1; events.forEach(function (e) { e[0] = id++; });

    var browserCss = 'font-family:Georgia,serif;';
    CASES.push({
      id: 6,
      title: 'Parking Meter Mayhem',
      crime: 'Vandalism of a public parking meter',
      law: '48 LD MC 447(b)',
      warrant: 'smashing parking meter #17 on Pine Street with what witnesses describe as “a very enthusiastic bowling-ball swing”, violating <b>48 LD MC 447(b)</b> which prohibits <b>VANDALISM IN THE STATE OF LOS DATOS</b>.',
      location: 'Pine Street, meter #17',
      manual: ['basics', 'where', 'operators', 'order', 'group', 'join'],
      briefing: [
        'This is it, Detective — your final case. Parking meter #17 on Pine Street was smashed to pieces at around 3 in the morning.',
        'This time the clues aren’t on paper. You’ll need to open the <b>web browser</b> and read what the internet says. Two pages matter: the local news and the forum of the Dunhill Lanes bowling league.',
        'Tables: <b>meter_events</b> (who parked where, and when), <b>cars</b> and <b>people</b>. Connect them with JOIN. Combine everything. I believe in you!'
      ],
      tables: {
        people: { columns: ['person_id', 'first_name', 'last_name', 'city', 'hobby', 'occupation'], rows: people },
        cars: { columns: ['plate', 'make', 'body', 'color', 'owner_id'], rows: cars },
        meter_events: { columns: ['event_id', 'meter_id', 'plate', 'event_time', 'event_type'], rows: events }
      },
      clues: [
        { title: 'note_from_chief', text: '<h3>Note from the Chief</h3><p>“Don’t bother the witnesses again. They’ve told the newspaper everything. Check the <b>web browser</b>.”</p><p>“And please, nobody say the word ‘meter-maid’ again.”</p>' }
      ],
      sites: {
        home: {
          title: 'Start Page',
          html: '<h2 style="margin:0 0 8px">Welcome to NetSurfer 97</h2><p>Your window to the world wide web!</p><ul><li><a data-go="news">Dunhill Daily — local news</a></li><li><a data-go="lanes">Dunhill Lanes Bowling League Forum</a></li><li><a data-go="recipes">Grandma’s Recipe Corner</a></li></ul>'
        },
        news: {
          title: 'Dunhill Daily',
          html: '<h2 style="margin:0">DUNHILL DAILY</h2><hr><h3>Parking meter flattened in overnight attack</h3><p>Parking meter <b>#17</b> on Pine Street was reduced to scrap overnight. Police say the attack took place <b>between 2:00 and 3:30 AM</b>.</p><p>A resident who woke up to the noise reports seeing <b>a green hatchback</b> speed away. “It had a little bowling pin hanging from the mirror,” she added.</p><p style="font-size:12px;color:#555">Related: <a data-go="lanes">Dunhill Lanes forum</a></p>'
        },
        lanes: {
          title: 'Dunhill Lanes Forum',
          html: '<h2 style="margin:0">Dunhill Lanes — League Forum</h2><hr><p><b>Re: Who wore the lucky jacket?</b></p><p><i>Posted by PinPal88:</i> “Someone in our league swung a ball at a parking meter last night, I heard. We are <b>bowlers</b>, not criminals! Well. Mostly.”</p><p><i>Posted by StrikeBot:</i> “Reminder: league members are the ONLY people with the hobby ‘<b>Bowling</b>’ in the town directory.”</p>'
        },
        recipes: {
          title: 'Grandma’s Recipes',
          html: '<h2 style="margin:0">Grandma’s Recipe Corner</h2><p>Today: how to make toast. Step 1: Put bread in toaster.</p><p><i>This page has nothing to do with the case, but the toast is excellent.</i></p>'
        }
      },
      browserCss: browserCss,
      culprit: 'Ramona Gutterball',
      solution: "SELECT p.first_name, p.last_name FROM meter_events e JOIN cars c ON e.plate = c.plate JOIN people p ON c.owner_id = p.person_id WHERE e.meter_id = 17 AND e.event_time BETWEEN '02:00' AND '03:30' AND c.body = 'Hatchback' AND c.color = 'Green' AND p.hobby = 'Bowling'",
      hints: [
        'Read the news and the bowling forum in the web browser. Write down: meter number, time window, car body, car colour and hobby.',
        'meter_events → cars (by plate) → people (by owner_id = person_id).',
        "Try: SELECT * FROM meter_events e JOIN cars c ON e.plate = c.plate JOIN people p ON c.owner_id = p.person_id WHERE e.meter_id = 17 AND e.event_time BETWEEN '02:00' AND '03:30' AND c.body = 'Hatchback' AND c.color = 'Green' AND p.hobby = 'Bowling'"
      ]
    });
  })();

  var BASE_MANUAL = ['basics', 'where', 'operators', 'order', 'group', 'join'];
  // days after (y, m, d) as 'YYYY-MM-DD'
  function ymd(y, m, d, off) {
    var dt = new Date(Date.UTC(y, m - 1, d + off));
    return dt.getUTCFullYear() + '-' + pad(dt.getUTCMonth() + 1) + '-' + pad(dt.getUTCDate());
  }
  function sum(a) { return a.reduce(function (x, y) { return x + y; }, 0); }

  /* ------------------------------------------------------------------ CASE 7 — NULL */
  (function () {
    var rng = mulberry32(707);
    var nm = Names(rng, ['Quentin', 'Fumblethorpe']);
    var props = ['Golden Crown', 'Rubber Sword', 'Velvet Cape', 'Fake Moustache', 'Cardboard Castle', 'Plastic Skull'];
    var people = [];
    for (var i = 0; i < 12; i++) { var n = nm(); people.push([n[0], n[1], rng() < 0.35 ? null : '555-01' + int(rng, 10, 99)]); }
    people[0][2] = null; people[1][2] = null; people[2][2] = '555-0123'; people[3][2] = '555-0188';
    var culprit = ['Quentin', 'Fumblethorpe', null];
    // row = [id, first, last, phone, prop, borrowed_on, returned_on]
    var bad = function (r) { return r[3] === null && r[4] === 'Golden Crown' && r[6] === null; };
    var rows = [];
    people.forEach(function (p) {
      var k = int(rng, 1, 3);
      for (var j = 0; j < k; j++) {
        rows.push(safeRow(function () {
          var off = int(rng, 0, 70), keep = int(rng, 2, 7);
          var open = rng() < 0.25;
          return [0, p[0], p[1], p[2], pick(rng, props), ymd(2025, 3, 1, off), open ? null : ymd(2025, 3, 1, off + keep)];
        }, bad));
      }
    });
    // planted decoys and culprit
    rows.push([0, people[0][0], people[0][1], null, 'Golden Crown', ymd(2025, 3, 1, 40), ymd(2025, 3, 1, 44)]);   // crown, no phone, but returned
    rows.push([0, people[1][0], people[1][1], null, 'Rubber Sword', ymd(2025, 3, 1, 33), null]);                 // no phone, never returned, wrong prop
    rows.push([0, people[2][0], people[2][1], people[2][2], 'Golden Crown', ymd(2025, 3, 1, 12), null]);         // crown never returned, but left a phone
    rows.push([0, people[3][0], people[3][1], people[3][2], 'Golden Crown', ymd(2025, 3, 1, 55), null]);         // same
    rows.push([0, 'Quentin', 'Fumblethorpe', null, 'Velvet Cape', ymd(2025, 3, 1, 5), ymd(2025, 3, 1, 8)]);      // culprit borrowed other stuff too
    rows.push([0, 'Quentin', 'Fumblethorpe', null, 'Golden Crown', ymd(2025, 3, 1, 60), null]);                   // culprit
    rows.sort(function (a, b) { return a[5] < b[5] ? -1 : a[5] > b[5] ? 1 : 0; });
    var id = 1; rows.forEach(function (r) { r[0] = id++; });

    CASES.push({
      id: 7,
      title: 'The Phantom of the Prop Room',
      crime: 'Theft of the Golden Crown from a community theatre',
      law: '12 LD PC 101(e)',
      warrant: 'taking the <b>Golden Crown</b> prop from the prop room of the Dunhill Community Theatre and never bringing it back, violating <b>12 LD PC 101(e)</b> which prohibits <b>PETTY THEFT IN THE STATE OF LOS DATOS</b>.',
      location: 'Dunhill Community Theatre',
      manual: BASE_MANUAL.concat(['nulls']),
      briefing: [
        'Detective, opening night is tomorrow and the <b>Golden Crown</b> from the prop room has vanished. The director is walking in circles and whispering to a plastic skull.',
        'The prop room keeps a <b>prop_checkouts</b> table. When someone brings a prop back, the date goes into <b>returned_on</b>. If they never brought it back… the cell stays <b>empty</b>. In SQL an empty cell is called <b>NULL</b>.',
        'Careful: NULL is not zero and not an empty text. It means “nothing here”, and you can’t search for it with <b>=</b>. Your manual has a new chapter about it.'
      ],
      tables: {
        prop_checkouts: { columns: ['checkout_id', 'first_name', 'last_name', 'phone', 'prop', 'borrowed_on', 'returned_on'], rows: rows }
      },
      clues: [
        { title: 'director_rant', text: '<h3>The director’s rant</h3><p>“The Golden Crown was checked out and <b>never returned</b>. Not a word, not a postcard!”</p><p>“And whoever took it <b>left no phone number</b> on the sign-out sheet. Typical.”</p>' },
        { title: 'signout_sheet', text: '<h3>Prop-room sign-out sheet</h3><p>Reminder pinned to the sheet: “<i>Props must be returned within a week. If you have not, you are a thief and also rude.</i>”</p><p>Spud’s note: blank cells show up as <b>NULL</b> in the tables. Search them with <b>IS NULL</b>, not with <b>= NULL</b>.</p>' }
      ],
      culprit: 'Quentin Fumblethorpe',
      solution: "SELECT * FROM prop_checkouts WHERE prop = 'Golden Crown' AND returned_on IS NULL AND phone IS NULL",
      hints: [
        'Blank cells are NULL. Look at the whole table first and find them: SELECT * FROM prop_checkouts',
        'Test for NULL with IS NULL (not = NULL), for example: WHERE returned_on IS NULL.',
        "Try: SELECT * FROM prop_checkouts WHERE prop = 'Golden Crown' AND returned_on IS NULL AND phone IS NULL"
      ]
    });
  })();

  /* ------------------------------------------------------------------ CASE 8 — DISTINCT */
  (function () {
    var rng = mulberry32(808);
    var nm = Names(rng, ['Marigold', 'Twinkletoes']);
    var gates = ['North', 'South', 'East', 'West'];
    var days = ['2025-07-04', '2025-07-05', '2025-07-06'];
    var rows = [];
    function scans(f, l, list, count) {
      for (var k = 0; k < count; k++) rows.push([0, f, l, list[k < list.length ? k : int(rng, 0, list.length - 1)], pick(rng, days)]);
    }
    for (var i = 0; i < 12; i++) {
      var n = nm();
      var g1 = pick(rng, gates), g2 = pick(rng, gates);
      scans(n[0], n[1], g1 === g2 || rng() < 0.4 ? [g1] : [g1, g2], int(rng, 2, 4));
    }
    var fan = nm();   // the biggest fan: most scans, but only two gates
    scans(fan[0], fan[1], ['South', 'North'], 9);
    var half = nm();  // another one with two gates
    scans(half[0], half[1], ['East', 'West'], 4);
    scans('Marigold', 'Twinkletoes', ['North', 'East', 'West', 'North', 'East'], 5);   // culprit: 3 different gates
    rows.sort(function (a, b) { return a[4] < b[4] ? -1 : a[4] > b[4] ? 1 : 0; });
    var id = 1; rows.forEach(function (r) { r[0] = id++; });

    CASES.push({
      id: 8,
      title: 'Gate Crasher',
      crime: 'Smuggling a giant plush bear out of the fair',
      law: '12 LD PC 101(f)',
      warrant: 'sneaking the grand prize, a <b>three-metre plush bear named Mr. Snuggles</b>, out of the Wobbly Wheel Fair, violating <b>12 LD PC 101(f)</b> which prohibits <b>PETTY THEFT IN THE STATE OF LOS DATOS</b>.',
      location: 'Wobbly Wheel Fair',
      manual: BASE_MANUAL.concat(['nulls', 'distinct']),
      briefing: [
        'The Wobbly Wheel Fair has lost its grand prize: a three-metre plush bear called Mr. Snuggles. Nobody saw it leave. It is a very big bear.',
        'The fair keeps a <b>gate_scans</b> table: every time a wristband is scanned at one of the four gates, a row is added.',
        'The guards think the thief kept walking in and out through <b>different gates</b> to confuse them. Counting rows won’t work (some people just love the fair). You need to count <b>different</b> gates. That’s a job for <b>DISTINCT</b>.'
      ],
      tables: {
        gate_scans: { columns: ['scan_id', 'first_name', 'last_name', 'gate', 'scan_day'], rows: rows }
      },
      clues: [
        { title: 'guard_report', text: '<h3>Guard report</h3><p>“Somebody’s wristband kept turning up at <b>different gates</b>. I’d say they used <b>at least 3 different gates</b> over the weekend. Sneaky.”</p>' },
        { title: 'ticket_booth_note', text: '<h3>Note from the ticket booth</h3><p>“Warning: lots of people love our fair and come back again and again, always through the <b>same gate</b>. Whoever has the most scans overall is probably just a fan.”</p><p>“Count the <b>different gates</b>, not the visits.”</p>' }
      ],
      culprit: 'Marigold Twinkletoes',
      solution: 'SELECT first_name, last_name, COUNT(DISTINCT gate) AS gates_used FROM gate_scans GROUP BY first_name, last_name HAVING COUNT(DISTINCT gate) >= 3',
      hints: [
        'First find out which gates exist: SELECT DISTINCT gate FROM gate_scans',
        'Group the scans by person and count the different gates each one used: COUNT(DISTINCT gate).',
        'Try: SELECT first_name, last_name, COUNT(DISTINCT gate) AS gates_used FROM gate_scans GROUP BY first_name, last_name HAVING COUNT(DISTINCT gate) >= 3'
      ]
    });
  })();

  /* ------------------------------------------------------------------ CASE 9 — SUM / AVG / MIN / MAX */
  (function () {
    var rng = mulberry32(909);
    var nm = Names(rng, ['Rupert', 'Pennywhistle']);
    var shops = ['Candy Corner', 'Toy Barn', 'Comic Cave', 'Ice Cream Hut', 'Book Nook'];
    function series(n, lo, hi) { var a = []; for (var i = 0; i < n; i++) a.push(int(rng, lo, hi)); return a; }
    function retry(make, ok) { for (var i = 0; i < 2000; i++) { var a = make(); if (ok(a)) return a; } throw new Error('series'); }
    function min(a) { return Math.min.apply(null, a); }
    function max(a) { return Math.max.apply(null, a); }
    function matches(a) { return sum(a) > 300 && sum(a) / a.length < 15 && min(a) >= 5 && max(a) < 30; }
    var spenders = []; // [first, last, amounts]
    var cul = retry(function () { var a = series(25, 5, 24); a[0] = 29; return a; }, matches);
    var d1 = [85, 70, 60, 45, 40, 30];                                                              // big total, but huge single purchases
    var d2 = retry(function () { var a = series(28, 1, 25); a[0] = 2; return a; }, function (a) { return sum(a) > 300 && sum(a) / a.length < 15 && max(a) < 30; }); // tiny purchase present
    var d3 = retry(function () { return series(12, 24, 29); }, function (a) { return sum(a) > 300; });                                                                   // average too high (everything else fits)
    var d4 = series(24, 5, 14);                                                                      // total too low
    var d5 = retry(function () { var a = series(28, 5, 15); a[0] = 55; return a; }, function (a) { return sum(a) > 300 && sum(a) / a.length < 15; });                  // one big splurge, otherwise perfect
    [d1, d2, d3, d4, d5].forEach(function (a) { var n = nm(); spenders.push([n[0], n[1], a]); });
    for (var i = 0; i < 9; i++) { var n = nm(); spenders.push([n[0], n[1], series(int(rng, 3, 7), 3, 45)]); }
    spenders.forEach(function (s) { if (matches(s[2])) s[2].push(60); });                           // never a second culprit
    spenders.push(['Rupert', 'Pennywhistle', cul]);
    var rows = [];
    spenders.forEach(function (s) { s[2].forEach(function (a) { rows.push([0, s[0], s[1], pick(rng, shops), a]); }); });
    shuffle(rng, rows);
    var id = 1; rows.forEach(function (r) { r[0] = id++; });

    CASES.push({
      id: 9,
      title: 'The Piggy Bank Burglar',
      crime: 'Emptying a school piggy bank and spending it in town',
      law: '12 LD PC 101(g)',
      warrant: 'stealing the contents of the Dunhill Elementary fundraiser piggy bank and spending it in small, sneaky amounts all over town, violating <b>12 LD PC 101(g)</b> which prohibits <b>PETTY THEFT IN THE STATE OF LOS DATOS</b>.',
      location: 'Dunhill Elementary School',
      manual: BASE_MANUAL.concat(['nulls', 'distinct', 'aggregates']),
      briefing: [
        'The big fundraiser piggy bank at Dunhill Elementary was emptied overnight. Since then somebody has been spending the money all over town. Carefully.',
        'The <b>purchases</b> table lists everything bought in the town’s five little shops with the marked coins. Your manual has new tools: <b>SUM</b>, <b>AVG</b>, <b>MIN</b> and <b>MAX</b>.',
        'They are called “aggregate functions”: they squash many rows into one number. Together with <b>GROUP BY</b> you get one number per person.'
      ],
      tables: {
        purchases: { columns: ['purchase_id', 'first_name', 'last_name', 'shop', 'amount'], rows: rows }
      },
      clues: [
        { title: 'shopkeeper_summary', text: '<h3>Summary from the shopkeepers</h3><p>“Whoever it is, they spent <b>more than $300 in total</b>. But they never splashed out: <b>no single purchase of $30 or more</b>. And they always spend a bit: <b>nothing under $5</b>.”</p>' },
        { title: 'accountant_note', text: '<h3>Note from the school accountant</h3><p>“The <b>average purchase is under $15</b>. Lots of small purchases that add up. Some people spend big on one thing; this thief nibbled.”</p>' }
      ],
      culprit: 'Rupert Pennywhistle',
      solution: 'SELECT first_name, last_name, SUM(amount) AS total, AVG(amount) AS average, MIN(amount) AS smallest, MAX(amount) AS biggest FROM purchases GROUP BY first_name, last_name HAVING SUM(amount) > 300 AND AVG(amount) < 15 AND MIN(amount) >= 5 AND MAX(amount) < 30',
      hints: [
        'Total, average, smallest and biggest purchase per person: SELECT first_name, last_name, SUM(amount), AVG(amount), MIN(amount), MAX(amount) FROM purchases GROUP BY first_name, last_name',
        'Filter the groups with HAVING (not WHERE): HAVING SUM(amount) > 300 AND … one condition for each clue.',
        'Try: SELECT first_name, last_name, SUM(amount) AS total, AVG(amount) AS average, MIN(amount) AS smallest, MAX(amount) AS biggest FROM purchases GROUP BY first_name, last_name HAVING SUM(amount) > 300 AND AVG(amount) < 15 AND MIN(amount) >= 5 AND MAX(amount) < 30'
      ]
    });
  })();

  /* ------------------------------------------------------------------ CASE 10 — LEFT JOIN */
  (function () {
    var rng = mulberry32(1010);
    var nm = Names(rng, ['Barbara', 'Spoonbender']);
    var depts = ['Teaching', 'Cafeteria', 'Janitorial', 'Office', 'Library'];
    var staff = [];
    for (var i = 0; i < 17; i++) { var n = nm(); staff.push([i + 1, n[0], n[1], pick(rng, depts), rng() < 0.5 ? 'Yes' : 'No']); }
    staff.push([18, 'Barbara', 'Spoonbender', 'Cafeteria', 'Yes']);   // culprit
    function set(id, dept, key) { staff[id - 1][3] = dept; staff[id - 1][4] = key; }
    set(3, 'Cafeteria', 'Yes');   // matches the clues but badged in
    set(6, 'Cafeteria', 'No');    // cafeteria, no key, not in log
    set(9, 'Teaching', 'Yes');    // key, not in log, wrong department
    set(12, 'Janitorial', 'Yes'); // same
    var notLogged = { 6: 1, 9: 1, 12: 1, 18: 1 };
    var logged = {};
    staff.forEach(function (s) { if (!notLogged[s[0]] && (s[0] === 3 || rng() < 0.55)) logged[s[0]] = 1; });
    staff.forEach(function (s) { // nobody else may fit "cafeteria + key + missing from the log"
      if (s[0] !== 18 && s[3] === 'Cafeteria' && s[4] === 'Yes') logged[s[0]] = 1;
    });
    var log = [];
    Object.keys(logged).forEach(function (sid) {
      var k = int(rng, 1, 2);
      for (var j = 0; j < k; j++) log.push([0, +sid, hhmm(int(rng, 18 * 60, 23 * 60 + 30))]);
    });
    log.sort(function (a, b) { return a[2] < b[2] ? -1 : a[2] > b[2] ? 1 : 0; });
    var id = 1; log.forEach(function (r) { r[0] = id++; });

    CASES.push({
      id: 10,
      title: 'The Missing Trophy',
      crime: 'Theft of the school spelling-bee trophy',
      law: '33 LD PC 503',
      warrant: 'stealing the <b>Golden Spelling Bee Trophy</b> from the display case of Dunhill Elementary overnight, violating <b>33 LD PC 503</b> which prohibits <b>THEFT OF PUBLIC PROPERTY IN THE STATE OF LOS DATOS</b>.',
      location: 'Dunhill Elementary School',
      manual: BASE_MANUAL.concat(['nulls', 'distinct', 'aggregates', 'leftjoin']),
      briefing: [
        'The Golden Spelling Bee Trophy has vanished from Dunhill Elementary overnight. The principal spelled “dissapointed” wrong in her press statement. Twice.',
        'Two tables: <b>staff</b> (everyone who works at the school) and <b>night_badges</b> (who badged in at the front door last night).',
        'This time the culprit is the one who is <b>missing</b> from the log. A normal JOIN throws away people with no match. You need <b>LEFT JOIN</b>: it keeps everyone from the left table and fills the empty spots with NULL.'
      ],
      tables: {
        staff: { columns: ['staff_id', 'first_name', 'last_name', 'department', 'has_key'], rows: staff },
        night_badges: { columns: ['badge_id', 'staff_id', 'badged_at'], rows: log }
      },
      clues: [
        { title: 'principal_statement', text: '<h3>Statement — the Principal</h3><p>“The thief had a <b>key to the building</b>. Also, I found a <b>hairnet</b> on the floor, so it must be someone from the <b>Cafeteria</b>.”</p>' },
        { title: 'security_note', text: '<h3>Note from security</h3><p>“The front door logs every badge. But the thief used the back door, so they are <b>not in last night’s log</b> at all. The back door has no badge reader. We are getting one.”</p>' }
      ],
      culprit: 'Barbara Spoonbender',
      solution: "SELECT s.first_name, s.last_name FROM staff s LEFT JOIN night_badges n ON s.staff_id = n.staff_id WHERE n.badge_id IS NULL AND s.has_key = 'Yes' AND s.department = 'Cafeteria'",
      hints: [
        'You need staff who have NO row in night_badges. A normal JOIN drops them, so use LEFT JOIN staff … ON …',
        'After a LEFT JOIN, people without a match have NULL in the badge columns: WHERE n.badge_id IS NULL.',
        "Try: SELECT * FROM staff s LEFT JOIN night_badges n ON s.staff_id = n.staff_id WHERE n.badge_id IS NULL AND s.has_key = 'Yes' AND s.department = 'Cafeteria'"
      ]
    });
  })();

  /* ------------------------------------------------------------------ CASE 11 — dates */
  (function () {
    var rng = mulberry32(1111);
    var nm = Names(rng, ['Gideon', 'Wobblethwaite']);
    var tools = ['Hedge Trimmer', 'Power Drill', 'Ladder', 'Wheelbarrow', 'Pressure Washer', 'Lawn Mower'];
    var people = [];
    for (var i = 0; i < 12; i++) people.push(nm());
    function ts(s) { var p = s.split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2]); }
    function bad(r) { // r = [id, first, last, tool, borrowed, returned]
      var kept = (ts(r[5]) - ts(r[4])) / 86400000;
      return r[3] === 'Hedge Trimmer' && r[4].slice(5, 7) === '06' && kept > 10 && new Date(ts(r[5])).getUTCDay() === 6;
    }
    var rows = [];
    function mk() {
      var p = pick(rng, people), off = int(rng, 0, 80), keep = int(rng, 2, 20);
      return [0, p[0], p[1], pick(rng, tools), ymd(2025, 5, 10, off), ymd(2025, 5, 10, off + keep)];
    }
    for (var j = 0; j < 38; j++) rows.push(safeRow(mk, bad));
    var P = function (idx, tool, b, r) { return [0, people[idx][0], people[idx][1], tool, b, r]; };
    rows.push(['x', 'Gideon', 'Wobblethwaite', 'Hedge Trimmer', '2025-06-12', '2025-06-28']);   // culprit: June, 16 days, Saturday
    rows.push(P(2, 'Hedge Trimmer', '2025-06-10', '2025-06-29'));   // June, 19 days, but Sunday
    rows.push(P(5, 'Hedge Trimmer', '2025-06-20', '2025-06-21'));   // June, Saturday, but 1 day
    rows.push(P(7, 'Hedge Trimmer', '2025-05-20', '2025-05-31'));   // Saturday, 11 days, but May
    rows.push(P(9, 'Power Drill', '2025-06-05', '2025-06-21'));     // everything fits except the tool
    rows.push(P(1, 'Hedge Trimmer', '2025-06-25', '2025-07-05'));   // June, Saturday, only 10 days (not more than 10)
    rows.sort(function (a, b) { return a[4] < b[4] ? -1 : a[4] > b[4] ? 1 : 0; });
    var id = 1; rows.forEach(function (r) { r[0] = id++; });

    CASES.push({
      id: 11,
      title: 'The Hedge Trimmer Mystery',
      crime: 'Keeping a borrowed hedge trimmer far too long',
      law: '12 LD PC 108',
      warrant: 'borrowing the only <b>Hedge Trimmer</b> of the Dunhill Tool Library, keeping it far beyond the lending period and using it to turn the town hedge into a sculpture of the mayor, violating <b>12 LD PC 108</b> which prohibits <b>MISUSE OF BORROWED PROPERTY IN THE STATE OF LOS DATOS</b>.',
      location: 'Dunhill Tool Library',
      manual: BASE_MANUAL.concat(['nulls', 'distinct', 'aggregates', 'leftjoin', 'dates']),
      briefing: [
        'Detective, the town hedge outside City Hall has been trimmed into a remarkably accurate sculpture of the mayor. The mayor is not flattered. The only hedge trimmer in town belongs to the Dunhill Tool Library.',
        'The <b>tool_loans</b> table has two dates for every loan: <b>borrowed_on</b> and <b>returned_on</b>. Dates are written as text like <b>2025-06-28</b>: year, month, day. That order is on purpose, it sorts correctly.',
        'New chapter in your manual: <b>dates</b>. <b>strftime</b> picks out the month or the day of the week, and <b>julianday</b> lets you subtract one date from another.'
      ],
      tables: {
        tool_loans: { columns: ['loan_id', 'first_name', 'last_name', 'tool', 'borrowed_on', 'returned_on'], rows: rows }
      },
      clues: [
        { title: 'librarian_log', text: '<h3>Tool Librarian’s log</h3><p>“The hedge trimmer was borrowed <b>in June</b> and kept for <b>more than 10 days</b>. The rule is 7 days. I put the rule on a very large poster.”</p>' },
        { title: 'return_slip', text: '<h3>Return slip</h3><p>“The trimmer came back covered in leaves on a <b>Saturday</b>. We are closed on Sundays, and the thief obviously knew that.”</p><p>Spud’s note: <b>strftime(\'%w\', date)</b> gives the day of the week: 0 is Sunday, 6 is Saturday.</p>' }
      ],
      culprit: 'Gideon Wobblethwaite',
      solution: "SELECT * FROM tool_loans WHERE tool = 'Hedge Trimmer' AND strftime('%m', borrowed_on) = '06' AND julianday(returned_on) - julianday(borrowed_on) > 10 AND strftime('%w', returned_on) = '6'",
      hints: [
        "Start with the tool: WHERE tool = 'Hedge Trimmer'. Then handle each date clue on its own.",
        "Month: strftime('%m', borrowed_on) = '06'. Days kept: julianday(returned_on) - julianday(borrowed_on) > 10. Weekday: strftime('%w', returned_on) = '6'.",
        "Try: SELECT * FROM tool_loans WHERE tool = 'Hedge Trimmer' AND strftime('%m', borrowed_on) = '06' AND julianday(returned_on) - julianday(borrowed_on) > 10 AND strftime('%w', returned_on) = '6'"
      ]
    });
  })();

  /* ------------------------------------------------------------------ MANUAL */
  var MANUAL = {
    nulls: {
      title: 'NULL, IS NULL',
      html: '<p>A <b>NULL</b> is an <i>empty</i> cell: “nothing here”. It is not zero and not an empty text.</p><p>You <b>cannot</b> find NULLs with <b>=</b>:</p><pre>WHERE returned_on = NULL   -- finds NOTHING!</pre><p>Use <b>IS NULL</b> and <b>IS NOT NULL</b>:</p><pre>SELECT *\nFROM prop_checkouts\nWHERE returned_on IS NULL\n  AND phone IS NOT NULL</pre><p>(Why? NULL means “unknown”, and “is unknown equal to unknown?” is… unknown.)</p>'
    },
    distinct: {
      title: 'DISTINCT',
      html: '<p><b>DISTINCT</b> removes duplicate rows from the result:</p><pre>SELECT DISTINCT gate\nFROM gate_scans</pre><p>Inside COUNT it counts only <i>different</i> values:</p><pre>SELECT first_name, last_name,\n  COUNT(*) AS scans,\n  COUNT(DISTINCT gate) AS gates_used\nFROM gate_scans\nGROUP BY first_name, last_name</pre><p><b>COUNT(*)</b> counts all rows; <b>COUNT(DISTINCT gate)</b> counts how many <i>different</i> gates there are.</p>'
    },
    aggregates: {
      title: 'SUM, AVG, MIN, MAX',
      html: '<p><b>Aggregate functions</b> squash many rows into one number:</p><pre>SUM(amount)   -- total\nAVG(amount)   -- average\nMIN(amount)   -- smallest\nMAX(amount)   -- biggest</pre><p>With GROUP BY you get one result per group:</p><pre>SELECT first_name, last_name,\n  SUM(amount) AS total,\n  MAX(amount) AS biggest\nFROM purchases\nGROUP BY first_name, last_name\nHAVING SUM(amount) > 300</pre><p>Filter on these numbers with <b>HAVING</b>, not WHERE. <b>ROUND(AVG(amount), 1)</b> tidies up long decimals.</p>'
    },
    leftjoin: {
      title: 'LEFT JOIN',
      html: '<p>A normal <b>JOIN</b> keeps only rows that have a partner in the other table. <b>LEFT JOIN</b> keeps <i>every</i> row of the left table; where there is no partner, the right-hand columns are <b>NULL</b>:</p><pre>SELECT s.first_name, n.badged_at\nFROM staff s\nLEFT JOIN night_badges n\n  ON s.staff_id = n.staff_id</pre><p>Trick: to find rows <b>without</b> a partner, add IS NULL:</p><pre>... LEFT JOIN night_badges n ON s.staff_id = n.staff_id\nWHERE n.badge_id IS NULL</pre><p>“Everyone from staff who never appears in night_badges.”</p>'
    },
    dates: {
      title: 'Dates',
      html: '<p>Dates are written as text: <b>\'2025-06-28\'</b> (year-month-day). That order sorts correctly, and BETWEEN works:</p><pre>WHERE borrowed_on BETWEEN \'2025-06-01\' AND \'2025-06-30\'</pre><p><b>strftime</b> extracts a part of a date:</p><pre>strftime(\'%Y\', d)  -- year    2025\nstrftime(\'%m\', d)  -- month   06\nstrftime(\'%d\', d)  -- day     28\nstrftime(\'%w\', d)  -- weekday 0=Sun … 6=Sat</pre><p>The result is <i>text</i>, so compare with quotes: <b>strftime(\'%m\', d) = \'06\'</b>.</p><p>To subtract dates use <b>julianday</b> (it turns a date into a day number):</p><pre>julianday(returned_on) - julianday(borrowed_on)</pre>'
    },
    basics: {
      title: 'SELECT & FROM',
      html: '<p>A <b>table</b> is a grid: columns are the kinds of information, rows are the records.</p><p>To look at a table you ask a question in SQL:</p><pre>SELECT *\nFROM residents</pre><p><b>SELECT</b> says which columns you want. The star <b>*</b> means “all of them”. <b>FROM</b> says which table.</p><p>You can pick columns by name:</p><pre>SELECT first_name, last_name\nFROM residents</pre><p>Tip: double-click a row in a table window to open that person’s file!</p>'
    },
    where: {
      title: 'WHERE, AND, OR',
      html: '<p><b>WHERE</b> keeps only the rows that match a condition:</p><pre>SELECT *\nFROM residents\nWHERE hair_color = \'Red\'</pre><p>Text goes inside single quotes <b>\'like this\'</b>, numbers do not.</p><p>Combine conditions: <b>AND</b> = both must be true, <b>OR</b> = at least one.</p><pre>WHERE hair_color = \'Red\' AND shoe_size = 11</pre><p>Comparisons: <b>=</b> equal, <b>&gt;</b> bigger, <b>&lt;</b> smaller, <b>&gt;=</b>, <b>&lt;=</b>.</p>'
    },
    operators: {
      title: 'LIKE, BETWEEN, !=',
      html: '<p><b>!=</b> means “is not”:</p><pre>WHERE department != \'Legal\'</pre><p><b>BETWEEN</b> checks a range (both ends included):</p><pre>WHERE swipe_time BETWEEN \'12:10\' AND \'12:40\'</pre><p><b>LIKE</b> searches text patterns. <b>%</b> means “anything”:</p><pre>WHERE first_name LIKE \'D%\'   -- starts with D\nWHERE last_name LIKE \'%son\'  -- ends with son</pre><p><b>IN</b> checks a list: <pre>WHERE floor IN (3, 4, 5)</pre></p>'
    },
    order: {
      title: 'ORDER BY, LIMIT',
      html: '<p><b>ORDER BY</b> sorts the results. Add <b>DESC</b> for biggest-first:</p><pre>SELECT *\nFROM stays\nORDER BY checked_out_at DESC</pre><p><b>LIMIT</b> keeps only the first rows:</p><pre>SELECT * FROM stays\nORDER BY checked_out_at DESC\nLIMIT 1</pre><p>Order of the words matters: SELECT, FROM, WHERE, ORDER BY, LIMIT.</p>'
    },
    group: {
      title: 'COUNT, GROUP BY, HAVING',
      html: '<p><b>COUNT(*)</b> counts rows:</p><pre>SELECT COUNT(*) FROM visits</pre><p><b>GROUP BY</b> makes one result row per group:</p><pre>SELECT first_name, COUNT(*)\nFROM visits\nGROUP BY first_name</pre><p><b>HAVING</b> filters groups (like WHERE, but for counts):</p><pre>GROUP BY first_name\nHAVING COUNT(*) = 3</pre><p>You can do maths: <pre>WHERE cookies_start - cookies_sold != cookies_end</pre></p><p>You can also put a query inside another with <b>( )</b>:</p><pre>WHERE visit_date IN (SELECT log_date FROM jar_log WHERE ...)</pre>'
    },
    join: {
      title: 'JOIN',
      html: '<p>Often related facts live in different tables, linked by ID numbers. <b>JOIN</b> glues them together:</p><pre>SELECT *\nFROM loans\nJOIN members ON loans.member_id = members.member_id</pre><p>Read it as: “for each loan, find the member whose member_id matches”.</p><p>You can give tables short nicknames and chain several JOINs:</p><pre>SELECT m.first_name, b.title\nFROM loans l\nJOIN members m ON l.member_id = m.member_id\nJOIN books b ON l.book_id = b.book_id\nWHERE b.genre = \'Cooking\'</pre>'
    }
  };

  var api = { CASES: CASES, MANUAL: MANUAL, mulberry32: mulberry32 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SQLD = api;
})(typeof window !== 'undefined' ? window : globalThis);
