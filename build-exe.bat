@echo off
REM Builds a single-file SQL-Detective.exe into the "dist" folder. Needs Node.js (https://nodejs.org).
cd /d "%~dp0"
call npm install
if errorlevel 1 goto fail
call npm run dist
if errorlevel 1 goto fail
echo.
echo Done! Your game: %~dp0dist\SQL-Detective.exe
pause
exit /b 0
:fail
echo Build failed.
pause
exit /b 1
