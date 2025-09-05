# 🎤 Discord Voice Timer Bot

<div align="center">

![Discord.js](https://img.shields.io/badge/Discord.js-v14.14.1-blue?style=for-the-badge&logo=discord)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)

**A modern and efficient Discord bot that automatically tracks the time users spend in voice channels**

[🚀 Installation](#-installation) • [� Docker](#-docker-installation-recommended) • [�📖 Commands](#-commands) • [📚 Documentation](#-documentation) • [⚙️ Configuration](#️-configuration) • [🤝 Contributing](#-contributing)

</div>

## ✨ Key Features

- 🔄 **Automatic Monitoring**: Tracks voice channel time every minute
- 🎯 **Smart Filters**: Automatically ignores bots and deafened users
- 📊 **Organized Data**: Monthly storage in simple JSON files
- 🚀 **Slash Commands**: Modern interface with slash commands
- 🛡️ **Multi-server**: Full support for multiple servers
- 📈 **Detailed Statistics**: Rankings by user and channel
- 🔧 **Simple Configuration**: Customizable log channel
- ⚡ **High Performance**: Optimized and lightweight structure

## 🎯 How it Works

### Smart Detection System

```
📍 First check (e.g: 14:30) → Only detects connected users
⏱️ Second check (e.g: 14:31) → Adds +1 minute to users who remained
🔄 Every minute after → Continues adding time automatically
```

### Automatic Filters

- ❌ **Bots**: Completely ignored
- 🔇 **Deafened users**: Don't count time (can't hear)
- ✅ **Only active users**: Who are actually participating in the channel

## 🤖 Add Bot to Your Server

**Ready to use? Add our bot to your Discord server!**

[![Add to Discord](https://img.shields.io/badge/Add%20to%20Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/oauth2/authorize?client_id=1413627584150769855)

Or copy this link: `https://discord.com/oauth2/authorize?client_id=1413627584150769855`

## 🚀 Installation

### Prerequisites

- Node.js 18.0.0 or higher
- A Discord bot created in [Discord Developer Portal](https://discord.com/developers/applications)

### Installation Steps

1. **Clone the repository**

    ```bash
    git clone https://github.com/DanoGlez/discord-voice-timer-bot.git
    cd discord-voice-timer-bot
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Configure environment variables**

    ```bash
    cp .env.example .env
    # Edit .env and add your token
    ```

4. **Start the bot**
    ```bash
    npm start
    ```

## 🐳 Docker Installation (Recommended)

> 🚀 **Deploy in under 2 minutes!** Docker provides the fastest and most reliable way to get your bot running.

### Why Docker?

- ✅ **Zero Dependencies**: No need to install Node.js or manage versions
- 🔒 **Enhanced Security**: Isolated environment with non-root execution
- 📦 **Universal Compatibility**: Works on Windows, Linux, and macOS
- 🔄 **Effortless Updates**: One command to update everything
- 📊 **Resource Control**: Built-in CPU and memory limits
- 💾 **Data Persistence**: Your bot data is automatically preserved
- 🏥 **Health Monitoring**: Automatic restart if the bot crashes

### Quick Start with Docker

#### Prerequisites

- [Docker Desktop](https://www.docker.com/get-started) (includes Docker Compose)
- A Discord bot token from [Discord Developer Portal](https://discord.com/developers/applications)

#### ⚡ Super Quick Deployment

1. **Get the code**
    ```bash
    git clone https://github.com/DanoGlez/discord-voice-timer-bot.git
    cd discord-voice-timer-bot
    ```

2. **One-click deployment**
    
    **Using Make (recommended):**
    ```bash
    make deploy
    ```
    
    **Using scripts:**
    ```bash
    # Windows
    ./docker/scripts/deploy.bat
    
    # Linux/macOS
    ./docker/scripts/deploy.sh
    ```

3. **That's it!** 🎉 Your bot is now running and will automatically restart if it crashes.

#### Manual Deployment (Alternative)

If you prefer to do it step by step:

```bash
# 1. Copy and configure environment
cp .env.example .env
# Edit .env and add your DISCORD_TOKEN

# 2. Navigate to docker directory and start
cd docker
docker-compose up -d

# 3. Check if it's running
docker-compose logs -f
```

### Docker Management

#### Essential Commands

```bash
# Using Make (from project root)
make logs          # 📊 View real-time logs
make down          # ⏹️ Stop the bot
make restart       # 🔄 Restart the bot
make status        # 📈 Check bot status

# Or using Docker Compose (from docker/ directory)
cd docker
docker-compose logs -f
docker-compose down
docker-compose restart
docker-compose ps
```

#### Updates & Maintenance

```bash
# 🔄 Update to latest version
git pull
make build
make up

# 🧹 Clean up old images (optional)
make clean

# 💾 Backup your bot data
tar -czf bot-backup-$(date +%Y%m%d).tar.gz data/
```

### Advanced Docker Configurations

#### Development Mode
Perfect for testing changes:
```bash
make dev
# Or manually: cd docker && docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

#### Production Mode
Optimized for servers:
```bash
make prod
# Or manually: cd docker && docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Troubleshooting

**Bot won't start?**

1. Check your token: `cat .env | grep DISCORD_TOKEN`
2. View logs: `docker-compose logs`

**Need to reset everything?**
```bash
make down
make clean
make deploy
```

**For more detailed troubleshooting, see [DOCKER.md](./docs/DOCKER.md)**

### Environment Variables

Create a `.env` file in the project root:

```env
# Discord bot token (REQUIRED)
DISCORD_TOKEN=your_token_here

# Port for healthcheck (optional)
PORT=3000
```

## � Documentation

### Quick References

- 🐳 **[DOCKER.md](./docs/DOCKER.md)** - Complete Docker deployment guide with troubleshooting
- 📋 **[CHANGELOG.md](./docs/CHANGELOG.md)** - Detailed version history and changes
- 🤝 **[CONTRIBUTING.md](CONTRIBUTING.md)** - Guidelines for contributors
- 🔒 **[SECURITY.md](SECURITY.md)** - Security policy and vulnerability reporting

### Configuration Files

- 📄 **`.env.example`** - Environment variables template
- � **`docker/`** - Complete Docker configuration directory
  - �🐳 **`Dockerfile`** - Container image definition
  - 📋 **`docker-compose.yml`** - Main Docker configuration
  - 🔧 **`docker-compose.dev.yml`** - Development environment settings
  - 🏭 **`docker-compose.prod.yml`** - Production optimized settings
  - � **`scripts/deploy.{sh,bat}`** - Deployment scripts
- ⚙️ **`Makefile`** - Simplified Docker management commands

## �📖 Commands

The bot uses modern **Slash Commands**. Type `/` in Discord and select:

### 🛠️ Configuration

```
/config logchannel:#channel
```

Configures the channel where connection/disconnection logs will be sent.

> **Permissions**: Administrators only

### 📊 Statistics

```
/stats [period]
```

Shows detailed voice time statistics.

**Examples:**

- `/stats` → Current month
- `/stats period:day` → Last 24 hours
- `/stats period:week` → Last 7 days
- `/stats period:09/2025` → Specific month

### ⏱️ Live Time

```
/live
```

Shows accumulated minutes from the current month in real time.

### 🗑️ Administration

```
/reset [period]
```

Resets data from the specified period.

> **Permissions**: Administrators only

**Examples:**

- `/reset` → Current month
- `/reset period:09/2025` → Specific month

### ❓ Help

```
!help
```

Text command that shows information about slash commands.

## ⚙️ Configuration

### Bot Permissions

The bot needs these permissions on your server:

- ✅ **View channels**
- ✅ **Send messages**
- ✅ **Use application commands**
- ✅ **Connect** (to detect voice events)
- ✅ **View voice state of members**

### Per-Server Configuration

Each server has its own independent configuration:

1. **Log channel** (optional): `/config logchannel:#your-channel`
    - If not configured, the bot won't send logs
    - Only affects connection/disconnection messages

## 📁 Project Structure

```
discord-voice-timer-bot/
├── 📁 commands/           # Command handling
│   └── commandHandler.js
├── 📁 config/            # Bot configuration
│   └── config.js
├── 📁 system/            # Main systems
│   ├── dataManager.js    # Data management
│   └── voiceHandler.js   # Voice events
├── 📁 data/              # Stored data (auto-created)
│   ├── guild_configs.json
│   └── {guildId}_{year}_{month}.json
├── 📁 .github/           # GitHub workflows
├── 📄 index.js           # Entry point
├── 📄 package.json       # Dependencies
├── 📄 .env.example       # Environment variables example
└── 📄 README.md          # This file
```

## 💾 Data Storage

### Simple Data Structure

```json
{
    "user_id": {
        "username": "UserName",
        "totalMinutes": 142
    }
}
```

### File Organization

- `📄 guild_configs.json` → Per-server configuration
- `📄 {guildId}_2025_09.json` → September 2025 data
- `📄 {guildId}_2025_10.json` → October 2025 data

**Advantages:**

- ✅ Separate files per month (easy management)
- ✅ Simple structure (user → minutes)
- ✅ No data duplication
- ✅ Fast lookup

## 🔧 Development

### Available Scripts

```bash
npm start        # Start the bot in production
npm run dev      # Start with auto-reload for development
npm test         # Run tests (coming soon)
```

### Contributing to the Project

1. **Fork** the repository
2. **Create** a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Commit Structure

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add filter for deafened users
fix: correct time calculation on channel change
docs: update installation documentation
```

## 🐛 Troubleshooting

### Common Issues

**❌ Bot doesn't respond to slash commands**

```bash
# Verify that the bot has "Use application commands" permissions
# Slash commands can take up to 1 hour to propagate globally
```

**❌ Data is not being saved**

```bash
# Check write permissions in the project folder
chmod 755 ./data/
```

**❌ Deprecation warning**

```bash
# Make sure you're using Discord.js v14.14.1 or higher
npm update discord.js
```

### System Logs

The bot shows informative logs:

```
🔍 [14:30:45] Checking voice channels...
🎤 [My Server] Channel "General": 3 user(s)
  👁️ Detected: User1
  👁️ Detected: User2
  🔇 Deafened (ignored): User3
📊 [14:30:45] Total: 2 user(s) in 1 active channel(s)
⏱️ [14:31:45] +1 minute added to 2 user(s) who remained connected
```

## 📄 License

This project is under the MIT License. See the [LICENSE](LICENSE) file for more details.

## 🤝 Support

Need help or have suggestions?

- 🐛 [Report a bug](https://github.com/danoglez/discord-voice-timer-bot/issues)
- 💡 [Request feature](https://github.com/danoglez/discord-voice-timer-bot/issues)
- 💬 [Discussions](https://github.com/danoglez/discord-voice-timer-bot/discussions)

## 🌟 Contributors

<a href="https://github.com/danoglez/discord-voice-timer-bot/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=danoglez/discord-voice-timer-bot" />
</a>

---

<div align="center">

**⭐ If this project has been useful to you, consider giving it a star ⭐**

Made with ❤️ for the Discord community

</div>
