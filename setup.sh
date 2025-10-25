#!/bin/bash

echo "🚀 Steam Manifest Manager - Setup Script"
echo "========================================"
echo ""

# Check if .env already exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/n): " overwrite
    if [ "$overwrite" != "y" ]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Create .env from .env.example
if [ -f .env.example ]; then
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
else
    echo "❌ .env.example not found!"
    exit 1
fi

echo ""
echo "📝 Please edit the .env file with your database credentials:"
echo "   - DB_HOST (default: localhost)"
echo "   - DB_PORT (default: 5432)"
echo "   - DB_NAME (default: steam_manifests)"
echo "   - DB_USER (default: postgres)"
echo "   - DB_PASSWORD (your postgres password)"
echo ""

read -p "Would you like to open .env in nano now? (y/n): " edit
if [ "$edit" == "y" ]; then
    nano .env
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🗄️  Running database migrations..."
npm run db:migrate

echo ""
echo "✨ Setup complete!"
echo ""
echo "To start the application, run:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:5173 in your browser"
