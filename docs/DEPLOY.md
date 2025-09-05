# 🚀 Quick Docker Deployment

For quick deployment, use the Makefile commands:

```bash
# Deploy the bot
make deploy

# View logs
make logs

# Stop the bot
make down

# Restart
make restart
```

For more detailed Docker documentation, see [docker/README.md](../docker/README.md) and [DOCKER.md](DOCKER.md).

## Alternative Scripts

If Make is not available:

```bash
# Windows
./docker/scripts/deploy.bat

# Linux/Mac
./docker/scripts/deploy.sh
```
