# SQL Detective — project notes for Claude

Offline browser game (also packaged as Windows .exe via Electron) where the player solves petty crimes with SQL.
Inspired by the idea of "Database Detective: Minor Crimes Division" (Steam); all content/characters are original.
The user (Pavel) speaks Russian; reply in Russian. Game UI supports EN and RU.

## Layout
- `index.html`, `css/style.css` — retro 90s desktop UI (1280x720 stage scaled to window)
- `js/cases.js` — 6 cases, generated deterministically; each has exactly one culprit
- `js/i18n.js` — EN/RU UI strings + Russian case texts and manual; `js/extras.js` — manual tips/figures, wallpapers, extra UI strings
- `js/game.js` — windows, SQL terminal (sql.js asm build in `js/sql-asm.js`), friendly errors, arrest flow, Officer Spud hints, music player UI
- `js/music.js` — procedural background music (Web Audio, 7 tracks, no audio files)
- `js/chars.js` — characters and icons as inline SVG
- `main.js`, `package.json`, `build-exe.bat`, `.github/workflows/build-exe.yml` — Electron wrapper / .exe build (Actions artifact `SQL-Detective-exe`)
- `tests/verify-cases.js` — `npm test`: checks every case with real SQL (EN and RU consistency)

## Conventions
- Adding a case: add to `cases.js` (+ `planted` rows so only the culprit matches), add RU text in `i18n.js`, run `npm test`.
- Table/column names and data values stay English on purpose (real SQL).
- Test the UI with Playwright (Chromium at /opt/pw-browsers/chromium, launch with `--no-sandbox`); screenshots are the way to check visuals.
- Commit trailer and branch rules come from the session instructions. Branch: `claude/epic-knuth-j5g7wq`.

## In progress / next ideas
1. **Real images instead of SVG** (user's request). Plan: generate art with the Gemini API using the secret
   `GEMINI_API_KEY` (network secret for `generativelanguage.googleapis.com`, set in the cloud environment; never ask the
   user to paste keys in chat). First check which models/limits the free key allows (list models, try one image).
   Build an `assets/` "slot" system: if `assets/<name>.png` exists use it, else fall back to the SVG from `chars.js`.
   Start with Officer Spud poses, then suspects, arrest screen, icons, manual cover. Ask for chroma-key (flat green) backgrounds
   and remove them with a script. If the free key cannot generate images, fall back to writing prompts for the user to run
   in Gemini manually.
2. More cases (NULL/IS NULL, DISTINCT, SUM/AVG/MIN/MAX, LEFT JOIN, dates), sandbox mode, achievements, optional speech
   (Web Speech API) for briefings.
