@echo off
REM NoGate - Start Frontend + Backend
REM Starts both development servers in separate windows

setlocal enabledelayedexpansion

cls
echo.
echo ================================================
echo    NoGate - Frontend + Backend Start
echo ================================================
echo.

REM Check frontend dependencies
if not exist "node_modules\" (
    echo [SETUP] Installing frontend dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Frontend npm install failed!
        pause
        exit /b 1
    )
)

REM Check backend dependencies
if not exist "backend\node_modules\" (
    echo [SETUP] Installing backend dependencies...
    cd backend
    call npm install
    if errorlevel 1 (
        echo [ERROR] Backend npm install failed!
        cd ..
        pause
        exit /b 1
    )
    cd ..
)

echo.
echo [INFO] Starting Backend on http://localhost:3001...
start "NoGate Backend" cmd /k "cd backend && npm run dev"

echo [INFO] Starting Frontend on http://localhost:5173...
start "" http://localhost:5173
timeout /t 3 /nobreak

echo [INFO] Starting Frontend Dev Server...
call npm run dev

echo.
echo [INFO] Development servers stopped.
pause
exit /b 0
