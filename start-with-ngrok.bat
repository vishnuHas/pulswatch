@echo off
title PulseWatch with ngrok
color 0A

echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║              🚀 PulseWatch - ngrok Setup                  ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Starting backend server...
echo.

REM Start backend in new window
start "PulseWatch Backend" cmd /k "cd /d %~dp0 && npm run server"

REM Wait for server to start
timeout /t 5 /nobreak >nul

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║              🌐 Starting ngrok tunnel...                  ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Backend started! Now starting ngrok...
echo.
echo IMPORTANT: Copy the ngrok URL and update Vercel:
echo   1. Copy the HTTPS URL from ngrok window
echo   2. Go to vercel.com/dashboard
echo   3. Settings -^> Environment Variables
echo   4. Update NEXT_PUBLIC_API_URL with ngrok URL
echo   5. Redeploy
echo.
echo Press any key to start ngrok...
pause >nul

REM Start ngrok
ngrok http 5000
