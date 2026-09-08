#!/bin/bash

# AI Meeting Intelligence System - Setup Script
# Automates the setup process for Linux/Mac

set -e

echo "🚀 AI Meeting Intelligence System Setup"
echo "========================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+."
    exit 1
fi
echo "✅ Node.js found: $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi
echo "✅ npm found: $(npm -v)"

# Backend Setup
echo ""
echo "📦 Setting up Backend..."
cd backend

if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
DB_USER=system
DB_PASSWORD=oracle
DB_CONNECT=localhost:1521/XE
OPENAI_API_KEY=your-openai-api-key-here
PORT=5000
NODE_ENV=development
EOF
    echo "⚠️  Please update backend/.env with your credentials"
else
    echo "✅ .env file already exists"
fi

echo "Installing dependencies..."
npm install
echo "✅ Backend dependencies installed"

cd ..

# Frontend Setup
echo ""
echo "🎨 Setting up Frontend..."
cd frontend

echo "Installing dependencies..."
npm install
echo "✅ Frontend dependencies installed"

cd ..

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update backend/.env with your Oracle credentials"
echo "2. Add your OpenAI API key to backend/.env"
echo "3. Run the database schema: sqlplus system/oracle < schema.sql"
echo "4. Start backend: cd backend && npm start"
echo "5. Start frontend: cd frontend && npm run dev"
echo "6. Open http://localhost:3000"
echo ""
