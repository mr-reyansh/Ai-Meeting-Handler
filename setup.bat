@echo off
REM AI Meeting Intelligence System - Setup Script for Windows
REM Automates the setup process

echo.
echo 🚀 AI Meeting Intelligence System Setup
echo ========================================
echo.

REM Check Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do echo ✅ Node.js found: %%i

REM Check npm
where npm >nul 2>nul
if errorlevel 1 (
    echo ❌ npm is not installed.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm -v') do echo ✅ npm found: %%i

REM Backend Setup
echo.
echo 📦 Setting up Backend...
cd backend

if not exist .env (
    echo Creating .env file...
    (
        echo DB_USER=system
        echo DB_PASSWORD=oracle
        echo DB_CONNECT=localhost:1521/XE
        echo OPENAI_API_KEY=your-openai-api-key-here
        echo PORT=5000
        echo NODE_ENV=development
    ) > .env
    echo ⚠️  Please update backend\.env with your credentials
) else (
    echo ✅ .env file already exists
)

echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed

cd ..

REM Frontend Setup
echo.
echo 🎨 Setting up Frontend...
cd frontend

echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed

cd ..

echo.
echo ✅ Setup Complete!
echo.
echo 📝 Next steps:
echo 1. Update backend\.env with your Oracle credentials
echo 2. Add your OpenAI API key to backend\.env
echo 3. Run the database schema: sqlplus system/oracle, then @schema.sql
echo 4. Start backend: cd backend ^&^& npm start
echo 5. Start frontend: cd frontend ^&^& npm run dev
echo 6. Open http://localhost:3000
echo.
pause
