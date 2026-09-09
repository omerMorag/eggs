@echo off
cd /d "%~dp0"
echo Installing dependencies...
call npm install
echo Starting the dev server...
start "egg-freezing-journey dev server" cmd /k "npm run dev"
timeout /t 6 /nobreak > nul
start "" "http://localhost:3000"
