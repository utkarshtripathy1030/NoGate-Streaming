@echo off
REM NoGate Project Launcher
REM This batch file provides quick access to common development tasks

setlocal enabledelayedexpansion

:menu
cls
echo.
echo ================================================
echo           NoGate - Project Launcher
echo ================================================
echo.
echo Select an option:
echo.
echo 1. Install Dependencies (npm install)
echo 2. Start Development Server (npm run dev)
echo 3. Build for Production (npm run build)
echo 4. Preview Production Build (npm run preview)
echo 5. Run Type Check (npm run type-check)
echo 6. Lint Code (npm run lint)
echo 7. Open Project in Explorer
echo 8. Clean Node Modules
echo 9. Exit
echo.

set /p choice="Enter your choice (1-9): "

if "%choice%"=="1" goto install
if "%choice%"=="2" goto dev
if "%choice%"=="3" goto build
if "%choice%"=="4" goto preview
if "%choice%"=="5" goto typecheck
if "%choice%"=="6" goto lint
if "%choice%"=="7" goto explorer
if "%choice%"=="8" goto clean
if "%choice%"=="9" goto end
echo Invalid choice. Please try again.
timeout /t 2
goto menu

:install
cls
echo.
echo Installing dependencies...
echo.
call npm install
echo.
pause
goto menu

:dev
cls
echo.
echo Starting development server...
echo.
call npm run dev
pause
goto menu

:build
cls
echo.
echo Building for production...
echo.
call npm run build
echo.
pause
goto menu

:preview
cls
echo.
echo Previewing production build...
echo.
call npm run preview
pause
goto menu

:typecheck
cls
echo.
echo Running type check...
echo.
call npm run type-check
echo.
pause
goto menu

:lint
cls
echo.
echo Linting code...
echo.
call npm run lint
echo.
pause
goto menu

:explorer
cls
echo.
echo Opening project in Explorer...
start explorer.exe "%cd%"
timeout /t 2
goto menu

:clean
cls
echo.
echo Are you sure you want to delete node_modules? (Y/N)
set /p confirm="Enter choice: "
if /i "%confirm%"=="Y" (
    echo.
    echo Removing node_modules...
    rmdir /s /q node_modules
    echo Removing package-lock.json...
    del package-lock.json
    echo.
    echo Cleaned! Run option 1 to reinstall dependencies.
    pause
) else (
    echo Cancelled.
    timeout /t 1
)
goto menu

:end
cls
echo.
echo Thank you for using NoGate Project Launcher!
echo.
pause
exit /b 0
