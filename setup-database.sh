#!/bin/bash

echo "🗄️  Setting up Steam Manifest Manager Database..."
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed or not in PATH"
    echo ""
    echo "Please install PostgreSQL:"
    echo "  - Windows: https://www.postgresql.org/download/windows/"
    echo "  - macOS: brew install postgresql"
    echo "  - Linux: sudo apt install postgresql"
    echo ""
    echo "OR use Docker: docker-compose up -d"
    exit 1
fi

echo "✅ PostgreSQL found"
echo ""

# Create database
echo "Creating database 'steam_manifests'..."
psql -U postgres -c "CREATE DATABASE steam_manifests;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database created successfully!"
else
    echo "ℹ️  Database might already exist (this is OK)"
fi

echo ""
echo "Next steps:"
echo "  1. npm run db:migrate"
echo "  2. npm run dev"
echo ""
