@echo off
echo 🚀 Steam Manifest Manager - Setup Script
echo ========================================
echo.

REM Check if .env already exists
if exist .env (
    echo ⚠️  .env file already exists!
    set /p overwrite="Do you want to overwrite it? (y/n): "
    if /i not "%overwrite%"=="y" (
        echo Setup cancelled.
        exit /b 0
    )
)

REM Create .env from .env.example
if exist .env.example (
    copy .env.example .env >nul
    echo ✅ Created .env file from .env.example
) else (
    echo ❌ .env.example not found!
    exit /b 1
)

echo.
echo 📝 Please edit the .env file with your database credentials:
echo    - DB_HOST (default: localhost)
echo    - DB_PORT (default: 5432)
echo    - DB_NAME (default: steam_manifests)
echo    - DB_USER (default: postgres)
echo    - DB_PASSWORD (your postgres password)
echo.

set /p edit="Would you like to open .env in notepad now? (y/n): "
if /i "%edit%"=="y" (
    notepad .env
)

echo.
echo 📦 Installing dependencies...
call npm install

echo.
echo 🗄️  Running database migrations...
call npm run db:migrate

echo.
echo ✨ Setup complete!
echo.
echo To start the application, run:
echo   npm run dev
echo.
echo Then open http://localhost:5173 in your browser
pause
