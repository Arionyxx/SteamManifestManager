@echo off
echo 🗄️  Setting up Steam Manifest Manager Database...
echo.

REM Check if PostgreSQL is accessible
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL is not installed or not in PATH
    echo.
    echo Please either:
    echo   1. Install PostgreSQL from https://www.postgresql.org/download/windows/
    echo   2. OR use Docker: docker-compose up -d
    echo.
    echo If PostgreSQL is installed, add it to your PATH:
    echo   Example: C:\Program Files\PostgreSQL\15\bin
    echo.
    pause
    exit /b 1
)

echo ✅ PostgreSQL found
echo.

REM Create database
echo Creating database 'steam_manifests'...
psql -U postgres -c "CREATE DATABASE steam_manifests;"

if %errorlevel% equ 0 (
    echo ✅ Database created successfully!
) else (
    echo ℹ️  Database might already exist ^(this is OK^)
)

echo.
echo Next steps:
echo   1. npm run db:migrate
echo   2. npm run dev
echo.
pause
