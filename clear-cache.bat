@echo off
echo Clearing Next.js cache...
rmdir /s /q .next 2>nul
echo Cache cleared!
echo.
echo Starting development server...
npm run dev
