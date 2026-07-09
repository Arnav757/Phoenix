@echo off
title Phoenix Group Website
cd /d "%~dp0"

echo ============================================
echo   Phoenix Group - launching local preview
echo ============================================
echo.

REM Install dependencies the first time only
if not exist "node_modules\next" (
  echo First run: installing dependencies, this may take a few minutes...
  call npm install
)

echo Starting the site... a browser tab will open shortly.
echo Keep THIS window open while presenting. Close it to stop the site.
echo.

REM Open the browser once the server has had time to boot
start "" /min cmd /c "timeout /t 14 /nobreak >nul & start "" http://localhost:3000"

REM Run the dev server in this window
call npm run dev
