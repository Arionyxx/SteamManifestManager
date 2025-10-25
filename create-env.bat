@echo off
echo Creating .env file...

(
echo DB_HOST=localhost
echo DB_PORT=5432
echo DB_NAME=steam_manifests
echo DB_USER=postgres
echo DB_PASSWORD=postgres
echo.
echo PORT=3001
echo NODE_ENV=development
echo CLIENT_URL=http://localhost:5173
) > .env

echo ✅ .env file created successfully!
echo.
echo Now run: npm run db:migrate
pause
