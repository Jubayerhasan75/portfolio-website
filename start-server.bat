@echo off
title Jubayer Hasan Portfolio - dev server
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install it from https://nodejs.org and run this file again.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing dependencies. This only happens the first time...
  call npm install
  if errorlevel 1 (
    echo.
    echo npm install failed. See the messages above.
    pause
    exit /b 1
  )
)

echo.
echo Starting the site at http://localhost:5173
echo Keep this window open while you use it. Press Ctrl+C to stop.
echo.
call npm run dev -- --open
pause
