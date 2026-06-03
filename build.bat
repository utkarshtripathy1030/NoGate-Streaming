@echo off
REM Production Build Script
REM Builds optimized production version and optionally previews it

setlocal enabledelayedexpansion

cls
echo.
echo ================================================
echo         NoGate - Production Build
echo ================================================
echo.

echo Cleaning previous builds...
if exist "dist\" (
    rmdir /s /q dist
    echo Previous build removed.
)
echo.

echo Type checking...
call npm run type-check
if errorlevel 1 (
    echo.
    echo Type check failed! Please fix errors and try again.
    pause
    exit /b 1
)
echo Type check passed!
echo.

echo Building for production...
call npm run build
if errorlevel 1 (
    echo.
    echo Build failed! Please check the errors above.
    pause
    exit /b 1
)
echo.
echo ================================================
echo Build completed successfully!
echo ================================================
echo.

REM Check build size
for /f %%A in ('dir "dist" /s /b ^| find /c /v ""') do set filecount=%%A

echo.
echo Build Summary:
echo - Output directory: dist/
echo - Files created: !filecount!
echo.

echo Would you like to preview the production build? (Y/N)
set /p preview="Enter choice: "

if /i "%preview%"=="Y" (
    echo.
    echo Previewing production build...
    echo Press Ctrl+C to stop the preview server
    echo.
    call npm run preview
)

echo.
pause
