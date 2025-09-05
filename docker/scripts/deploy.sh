#!/bin/bash

# Quick deployment script for Discord Voice Timer Bot
echo "🚀 Starting Discord Voice Timer Bot deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

# Navigate to project root (one level up from docker/scripts)
cd "$(dirname "$0")/../.." || exit 1

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found"
    echo "📋 Copying .env.example to .env..."
    cp .env.example .env
    echo "✏️  Please edit the .env file and add your DISCORD_TOKEN"
    echo "📖 You can get your token at: https://discord.com/developers/applications"
    read -p "Have you configured your DISCORD_TOKEN in the .env file? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Please configure your token before continuing."
        exit 1
    fi
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p data logs

# Build and run with Docker Compose from docker directory
echo "🔨 Building Docker image..."
cd docker
docker-compose build

echo "🚀 Starting the bot..."
docker-compose up -d

echo "✅ Bot deployed successfully!"
echo ""
echo "📋 Useful commands:"
echo "📊 View logs: cd docker && docker-compose logs -f"
echo "🛑 Stop bot: cd docker && docker-compose down"
echo "🔄 Restart: cd docker && docker-compose restart"
