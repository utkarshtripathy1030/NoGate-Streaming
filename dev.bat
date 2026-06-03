@echo off
REM Quick Start Development Environment
REM Automatically installs dependencies and starts dev server
REM Opens browser automatically

setlocal enabledelayedexpansion

cls
echo.
echo ================================================
echo         NoGate - Quick Start Developer Mode
echo ================================================
echo.

REM Check if node_modules exists or if vite is missing
if not exist "node_modules\" (
    echo [SETUP] Installing dependencies for the first time...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] npm install failed!
        echo Please check your internet connection and try again.
        pause
        exit /b 1
    )
    echo.
)

REM Double-check that vite is installed
if not exist "node_modules\vite\" (
    echo [SETUP] Vite not found, installing dependencies...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] Failed to install dependencies!
        pause
        exit /b 1
    )
    echo.
)

echo [INFO] Starting development server...
echo [INFO] The application will open at http://localhost:5173
echo [INFO] Press Ctrl+C to stop the server
echo.

REM Start dev server in background and open browser
REM Give the server 3 seconds to start before opening browser
start "" http://localhost:5173
timeout /t 3 /nobreak

call npm run dev

echo.
echo [INFO] Development server stopped.
pause
exit /b 0
