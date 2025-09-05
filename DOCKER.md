# 🐳 Docker Deployment Guide

## Quick Start (⚡ 2 minutes)

### 1. Clone the repository

```bash
git clone https://github.com/DanoGlez/discord-voice-timer-bot.git
cd discord-voice-timer-bot
```

### 2. Configure Discord token

```bash
# Copy example file
cp .env.example .env

# Edit and add your DISCORD_TOKEN
# Get your token at: https://discord.com/developers/applications
```

### 3. Deploy!

**Windows:**

```cmd
deploy.bat
```

**Linux/Mac:**

```bash
chmod +x deploy.sh
./deploy.sh
```

**Manual:**

```bash
docker-compose up -d
```

Done! 🎉 Your bot is running.

## Useful Commands

### Bot Management

```bash
# View real-time logs
docker-compose logs -f

# Stop the bot
docker-compose down

# Restart the bot
docker-compose restart

# Check status
docker-compose ps
```

### Updates

```bash
# Update code
git pull

# Rebuild and restart
docker-compose build
docker-compose up -d
```

## Advanced Configurations

### Development

```bash
# Use development configuration
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### Production

```bash
# Use production configuration
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Data Backup

```bash
# Create backup of data folder
tar -czf bot-backup-$(date +%Y%m%d).tar.gz data/

# Restore backup
tar -xzf bot-backup-YYYYMMDD.tar.gz
```

## Troubleshooting

### Bot won't start

1. Verify token is configured in `.env`
2. Check logs: `docker-compose logs`

### File permissions

```bash
# On Linux/Mac, if permission issues occur
sudo chown -R $USER:$USER data/
```

### Clean everything and start fresh

```bash
# Stop and remove containers
docker-compose down

# Remove image
docker-compose down --rmi all

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up -d
```

## Monitoring

### View resource usage

```bash
# CPU and memory of container
docker stats discord-voice-timer-bot

# Space used by images
docker system df
```

### Structured logs

Logs are automatically stored and rotated to prevent disk filling:

- Maximum 5MB per file
- Maximum 5 historical files
- Automatic compression
