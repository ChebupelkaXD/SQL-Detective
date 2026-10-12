@echo off
REM Starts the game in its own window (needs Node.js; run "npm install" once first).
cd /d "%~dp0"
if not exist node_modules call npm install
call npm start
