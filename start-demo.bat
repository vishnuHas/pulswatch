@echo off
echo ========================================
echo   PulseWatch Demo Starter
echo ========================================
echo.
echo Starting backend server...
echo.
start cmd /k "cd /d %~dp0 && npm run server"
echo.
echo Backend started on http://localhost:5000
echo.
echo ========================================
echo NEXT STEP: Start ngrok
echo ========================================
echo.
echo Run this command in a new terminal:
echo   ngrok http 5000
echo.
echo Then copy the ngrok URL and update Vercel:
echo   1. Go to vercel.com/dashboard
echo   2. Settings -^> Environment Variables
echo   3. Update NEXT_PUBLIC_API_URL
echo   4. Redeploy
echo.
pause
