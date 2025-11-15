@echo off
echo ========================================
echo   PulseWatch - Update Network IP
echo ========================================
echo.

REM Get current IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    goto :found
)

:found
REM Remove leading spaces
set IP=%IP: =%

echo Current Network IP: %IP%
echo.
echo This IP will be saved to server-config.json
echo.
set /p CONFIRM="Update IP? (Y/N): "

if /i "%CONFIRM%"=="Y" (
    REM Update server-config.json
    echo { > server-config.json
    echo   "host": "0.0.0.0", >> server-config.json
    echo   "port": 5000, >> server-config.json
    echo   "staticIP": "%IP%", >> server-config.json
    echo   "note": "Updated on %date% at %time%" >> server-config.json
    echo } >> server-config.json
    
    echo.
    echo ✅ IP updated successfully!
    echo.
    echo Next steps:
    echo 1. Restart your server: npm run server
    echo 2. Update Vercel environment variable:
    echo    NEXT_PUBLIC_API_URL = http://%IP%:5000
    echo 3. Redeploy Vercel
    echo.
) else (
    echo.
    echo ❌ Update cancelled
    echo.
)

pause
