# Discord Voice Timer Bot - Security Policy

## Supported Versions

We actively support and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.2.x   | :white_check_mark: |
| 1.1.x   | :white_check_mark: |
| < 1.1   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

### 🔒 Private Reporting (Preferred)

1. **Do NOT** create a public GitHub issue for security vulnerabilities
2. Send an email to `contact@danoglez.com` with:
    - A clear description of the vulnerability
    - Steps to reproduce the issue
    - Potential impact assessment
    - Any suggested fixes (if available)

### 📋 What to Include

Please include as much information as possible:

- **Type of vulnerability** (e.g., authentication bypass, data exposure, etc.)
- **Location** (file name, line number, function name)
- **Prerequisites** (special configuration, permissions, etc.)
- **Proof of concept** (code snippet, curl command, etc.)
- **Impact assessment** (what data could be accessed, what actions could be performed)

### ⏰ Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
    - Critical: 24-48 hours
    - High: 1 week
    - Medium: 2 weeks
    - Low: Next release cycle

### 🛡️ Security Best Practices

When using this bot:

1. **Environment Variables**: Never commit `.env` files or expose your Discord token
2. **Permissions**: Follow the principle of least privilege for bot permissions
3. **Updates**: Keep dependencies and the bot itself updated
4. **Monitoring**: Monitor your bot's activity and resource usage
5. **Access Control**: Limit who has access to your bot's hosting environment

### 🏆 Recognition

We believe in responsible disclosure and will:

- Credit security researchers (with their permission)
- Provide a public acknowledgment in our changelog
- Consider featuring your contribution in our documentation

### 📞 Contact Information

- **Security Email**: `contact@danoglez.com`
- **General Issues**: [GitHub Issues](https://github.com/DanoGlez/discord-voice-timer-bot/issues)
- **Documentation**: [Project Wiki](https://github.com/DanoGlez/discord-voice-timer-bot/wiki)

---

Thank you for helping keep Discord Voice Timer Bot and our community safe! 🙏
