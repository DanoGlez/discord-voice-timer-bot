@echo off
REM Quick deployment script for Discord Voice Timer Bot (Windows)
echo 🚀 Starting Discord Voice Timer Bot deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo ⚠️  .env file not found
    echo 📋 Copying .env.example to .env...
    copy .env.example .env
    echo ✏️  Please edit the .env file and add your DISCORD_TOKEN
    echo 📖 You can get your token at: https://discord.com/developers/applications
    set /p "reply=Have you configured your DISCORD_TOKEN in the .env file? (y/n): "
    if /i not "%reply%" == "y" (
        echo ❌ Please configure your token before continuing.
        pause
        exit /b 1
    )
)

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist data mkdir data
if not exist logs mkdir logs

REM Build and run with Docker Compose
echo 🔨 Building Docker image...
docker-compose build

echo 🚀 Starting the bot...
docker-compose up -d

echo ✅ Bot deployed successfully!
echo 📊 To view logs: docker-compose logs -f
echo 🛑 To stop the bot: docker-compose down
echo 🔄 To restart: docker-compose restart
pause
