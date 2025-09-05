# 📋 Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- Automated testing system
- Multi-language support
- Web statistics dashboard
- REST API for external integration

---

## [1.3.1] - 2025-09-05

### 🔧 Changed

- **🌍 Language Internationalization**: Complete translation of all system messages, logs, and console output to English
  - Console logs and system messages now in English
  - Slash command descriptions translated
  - Error messages and user feedback in English
  - Help messages and embed content in English
  - Maintained backward compatibility for Spanish period inputs (`dia`, `semana`)
- **📚 Code Documentation**: All code comments translated to English for better international collaboration

### 🐛 Fixed

- **🕐 Time Locale**: Changed time display format from Spanish (`es-ES`) to English (`en-US`) for consistency
- **📝 Console Output**: Standardized all console messages to English for universal understanding

---

## [1.3.0] - 2025-09-05

### 🎉 Added

- **🐳 Docker Support**: Complete containerization for easy deployment
    - `Dockerfile` with Alpine Linux for lightweight images
    - `docker-compose.yml` for orchestration with data persistence
    - Automated deployment scripts (`deploy.bat` for Windows, `deploy.sh` for Linux/Mac)
    - Development and production Docker configurations
- **📖 Docker Documentation**: Comprehensive `DOCKER.md` guide with:
    - 2-minute quick start instructions
    - Advanced configuration options
    - Troubleshooting guide
    - Monitoring and maintenance commands
- **🔒 Security Improvements**: Non-root user execution in containers
- **📊 Resource Management**: CPU and memory limits for production deployments
- **🔄 Auto-restart**: Automatic bot restart on failures
- **📝 Log Rotation**: Automatic log management to prevent disk space issues
- **🏥 Health Checks**: Container health monitoring
- **⚙️ CI/CD Pipeline**: GitHub Actions workflow for automated Docker builds

### 🔧 Changed

- **📚 Documentation**: Updated README.md with Docker installation section
- **🔧 Configuration**: Enhanced `.gitignore` with Docker-specific entries
- **📦 Project Structure**: Added Docker-related configuration files

### 📚 Documentation

- **DOCKER.md**: Complete Docker deployment guide
- **README.md**: Added Docker installation instructions with quick start
- **GitHub Actions**: Automated build and security scanning workflow
- **Environment Templates**: Enhanced `.env.example` with Docker considerations

---

## [1.2.0] - 2025-09-05

### 🎉 Added

- **Smart filter**: Deafened users no longer count time automatically
- **`/live` command**: Shows accumulated minutes from the current month in real time
- **Modular structure**: Complete reorganization into folders (`commands/`, `system/`, `config/`)
- **Complete documentation**: Professional README, CONTRIBUTING.md, and GitHub templates
- **Improved logs**: More detailed and informative logging system

### 🔧 Changed

- **Data structure**: Simplified to user → minutes format (no individual records)
- **Detection system**: First check detects, second adds time (more accurate)
- **Discord.js event**: Migrated from `ready` to `clientReady` for future compatibility

### 🐛 Fixed

- **Deprecation warning**: Removed Discord.js v14 warning
- **Optimized memory**: Reduced memory usage by eliminating duplicate sessions
- **Stability**: Improved error handling and disconnections

### 📚 Documentation

- **README.md**: Complete documentation with badges and examples
- **package.json**: Professional metadata and optimized keywords
- **.env.example**: Example file for configuration
- **LICENSE**: MIT license added
- **.gitignore**: Complete file for Node.js

---

## [1.1.0] - 2025-09-04

### 🎉 Added

- **Minute-based review system**: The bot checks channels every 60 seconds
- **Persistent storage**: Data saved in JSON files per month
- **`/stats` command**: Detailed statistics by periods (day, week, month)
- **`/reset` command**: Reset data by administrators
- **Multi-server**: Full support for multiple servers

### 🔧 Changed

- **Slash Commands**: Complete migration to modern slash commands
- **File structure**: Data organized by `{guildId}_{year}_{month}.json`

### 🐛 Fixed

- **Change detection**: Proper handling when users change channels
- **Permissions**: Administrator permission verification for sensitive commands

---

## [1.0.0] - 2025-09-03

### 🎉 Added

- **Basic detection**: Voice connection/disconnection monitoring
- **Configurable logs**: Customizable log channel per server
- **Basic commands**: Initial text command system
- **JSON storage**: Basic data persistence system

### 📚 Documentation

- Initial project documentation
- Basic installation instructions

---

## Change Types

- **🎉 Added** - for new features
- **🔧 Changed** - for changes in existing functionality
- **⚠️ Deprecated** - for features that will be removed soon
- **🗑️ Removed** - for removed features
- **🐛 Fixed** - for bug fixes
- **🔒 Security** - for security improvements
- **📚 Documentation** - for documentation changes
- **⚡ Performance** - for performance improvements