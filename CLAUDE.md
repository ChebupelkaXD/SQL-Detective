# SQL Detective — project notes for Claude

Offline browser game (also packaged as Windows .exe via Electron) where the player solves petty crimes with SQL.
Inspired by the idea of "Database Detective: Minor Crimes Division" (Steam); all content/characters are original.
The user (Pavel) speaks Russian; reply in Russian. Game UI supports EN and RU.

## Layout
- `index.html`, `css/style.css` — retro 90s desktop UI (1280x720 stage scaled to window)
- `js/cases.js` — 11 cases + `SANDBOX`, generated deterministically; each has exactly one culprit
- `js/i18n.js` — EN/RU UI strings + Russian case texts and manual; `js/extras.js` — manual tips/figures, wallpapers, extra UI strings
- `js/game.js` — windows, SQL terminal (sql.js asm build in `js/sql-asm.js`), friendly errors, arrest flow, Officer Spud hints, music player UI
- `js/music.js` — procedural background music (Web Audio, 7 tracks, no audio files)
- `js/chars.js` — characters and icons as inline SVG (optional real art from `assets/`, see `art()`)
- `js/achievements.js` — achievement list + strings for profile/sandbox/X-ray; `js/xray.js` — splits WHERE into AND-conditions (used by the X-ray window)
- `main.js`, `package.json`, `build-exe.bat`, `.github/workflows/build-exe.yml` — Electron wrapper / .exe build (Actions artifact `SQL-Detective-exe`)
- `tests/verify-cases.js` — `npm test`: checks every case with real SQL (EN and RU consistency)

## Conventions
- Adding a case: add to `cases.js` (+ planted rows so only the culprit matches), add RU text in `i18n.js`, run `npm test`. Tables where one person has many rows go into `LOG_TABLES` in the test. New manual chapters need EN (`cases.js`), RU (`i18n.js`) and tip/recap (`extras.js`).
- Table/column names and data values stay English on purpose (real SQL).
- Test the UI with Playwright (Chromium at /opt/pw-browsers/chromium, launch with `--no-sandbox`); screenshots are the way to check visuals.
- Commit trailer and branch rules come from the session instructions. Branch: `claude/epic-knuth-j5g7wq`.

## In progress / next ideas
Done: art from `assets/` (user generated it by hand; no external generation needed any more), cases 7-11 (NULL, DISTINCT,
aggregates, LEFT JOIN, dates), sandbox (pseudo-case `SANDBOX` in `cases.js`, all tables), achievements + detective profile
(`js/achievements.js`, progress in localStorage `sqld.progress` = done/ach/stats), query X-ray (`js/xray.js`, pure + tested),
SQL autocomplete chips, Ctrl+Up/Down query history, read-aloud button for briefings (Web Speech API), progress export/import.

Ideas left:
1. Random/daily case generator (seeded templates with a guaranteed single culprit).
2. More cases (CASE/COALESCE, string functions, UNION), more wallpapers/music.
3. Per-case art for the new cases 7-11 (`CLUE_ART` in `game.js`; images are optional) and suspects/icons as real pictures.
4. Voice-over quality (pick a nicer voice), sound effects for achievements.
