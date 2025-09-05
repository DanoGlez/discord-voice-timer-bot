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

**Using Make (recommended):**
```bash
make deploy
```

**Using scripts:**
```bash
# Windows
./docker/scripts/deploy.bat

# Linux/Mac
./docker/scripts/deploy.sh
```

**Manual:**
```bash
cd docker
docker-compose up -d
```

Done! 🎉 Your bot is running.

## 📁 Docker Structure

All Docker-related files are now organized in the `docker/` directory:

```
docker/
├── Dockerfile                  # Container image definition
├── docker-compose.yml          # Main configuration
├── docker-compose.dev.yml      # Development overrides
├── docker-compose.prod.yml     # Production overrides
├── .dockerignore              # Build context exclusions
├── README.md                  # Docker-specific documentation
└── scripts/
    ├── deploy.sh              # Linux/Mac deployment
    └── deploy.bat             # Windows deployment
```

## Useful Commands

### Bot Management
```bash
# Using Make (from project root)
make logs          # View real-time logs
make down          # Stop the bot
make restart       # Restart the bot
make status        # Check status

# Using Docker Compose (from docker/ directory)
cd docker
docker-compose logs -f
docker-compose down
docker-compose restart
docker-compose ps
```

### Updates
```bash
# Using Make
git pull
make build
make up

# Using Docker Compose
git pull
cd docker
docker-compose build
docker-compose up -d
```

## Advanced Configurations

### Development
```bash
# Using Make
make dev

# Using Docker Compose
cd docker
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### Production
```bash
# Using Make
make prod

# Using Docker Compose
cd docker
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
2. Check logs: `make logs` or `cd docker && docker-compose logs`

### File permissions
```bash
# On Linux/Mac, if permission issues occur
sudo chown -R $USER:$USER data/
```

### Clean everything and start fresh
```bash
# Using Make
make down
make clean
make deploy

# Using Docker Compose
cd docker
docker-compose down --rmi all
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
