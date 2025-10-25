#!/bin/bash

echo "Creating .env file..."

cat > .env << 'ENVFILE'
DB_HOST=localhost
DB_PORT=5432
DB_NAME=steam_manifests
DB_USER=postgres
DB_PASSWORD=postgres

PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
ENVFILE

echo "✅ .env file created successfully!"
echo ""
echo "Now run: npm run db:migrate"
