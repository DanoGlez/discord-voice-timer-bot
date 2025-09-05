# 🐳 Docker Configuration

This directory contains all Docker-related files for the Discord Voice Timer Bot.

## 📁 Structure

```
docker/
├── Dockerfile                  # Main Docker image configuration
├── docker-compose.yml          # Base Docker Compose configuration
├── docker-compose.dev.yml      # Development overrides
├── docker-compose.prod.yml     # Production overrides
├── .dockerignore              # Files to exclude from Docker context
└── scripts/
    ├── deploy.sh              # Linux/Mac deployment script
    └── deploy.bat             # Windows deployment script
```

## 🚀 Quick Start

### From Project Root

```bash
# Using Makefile (recommended)
make deploy        # Build and start
make logs          # View logs
make down          # Stop

# Or using scripts
./docker/scripts/deploy.sh     # Linux/Mac
./docker/scripts/deploy.bat    # Windows
```

### From Docker Directory

```bash
cd docker

# Basic commands
docker-compose up -d           # Start
docker-compose down            # Stop
docker-compose logs -f         # View logs
docker-compose restart         # Restart

# Development mode
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Production mode
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## ⚙️ Configuration

### Environment Variables

Create `.env` file in project root:

```env
DISCORD_TOKEN=your_discord_bot_token_here
NODE_ENV=production
```

### Docker Compose Files

- **`docker-compose.yml`**: Base configuration with resource limits and health checks
- **`docker-compose.dev.yml`**: Development overrides with debug options
- **`docker-compose.prod.yml`**: Production overrides with strict resource limits

## 📊 Monitoring

```bash
# Container status
make status

# Resource usage
docker stats discord-voice-timer-bot

# Logs with timestamp
docker-compose logs -f --timestamps
```

## 🔧 Maintenance

```bash
# Update bot
git pull
make build
make up

# Clean up
make clean

# Backup data
tar -czf bot-backup-$(date +%Y%m%d).tar.gz ../data/
```

## 🐛 Troubleshooting

### Common Issues

1. **Permission errors**: Ensure Docker daemon is running
2. **Port conflicts**: Check if port 3000 is available
3. **Build failures**: Run `make clean` and try again

### Reset Everything

```bash
make down
make clean
make deploy
```

For more detailed troubleshooting, see the main [DOCKER.md](../DOCKER.md) file.
