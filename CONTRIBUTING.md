# 🤝 Contributing to Discord Voice Timer Bot

Thank you for your interest in contributing! This document will guide you on how to participate in the project development.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Git
- A Discord bot for testing

### Development Environment Setup

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:

    ```bash
    git clone https://github.com/DanoGlez/discord-voice-timer-bot.git
    cd discord-voice-timer-bot
    ```

3. **Install** dependencies:

    ```bash
    npm install
    ```

4. **Configure** environment variables:

    ```bash
    cp .env.example .env
    # Edit .env with your testing bot token
    ```

5. **Start** the bot in development mode:
    ```bash
    npm run dev
    ```

## 📝 Contribution Guidelines

### Project Structure

```
├── commands/          # Slash commands handling
├── config/           # Bot configuration
├── system/           # Core systems (data, voice)
├── .github/          # GitHub workflows and templates
└── docs/             # Additional documentation
```

### Code Standards

#### Naming Conventions

- **Files**: camelCase (e.g., `voiceHandler.js`)
- **Variables**: camelCase (e.g., `userName`, `guildId`)
- **Constants**: UPPER_CASE (e.g., `EMBED_COLOR`)
- **Classes**: PascalCase (e.g., `VoiceHandler`)

#### Commit Structure

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

feat(voice): add filter for deafened users
fix(commands): fix time formatting in statistics
docs(readme): update installation documentation
refactor(data): optimize storage structure
```

**Commit types:**

- `feat`: New functionality
- `fix`: Bug fixes
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Add or modify tests
- `chore`: Maintenance tasks

### Development Process

1. **Create a branch** for your feature:

    ```bash
    git checkout -b feat/amazing-feature
    ```

2. **Develop** your functionality:
    - Write clean and documented code
    - Follow established conventions
    - Add appropriate logs for debugging

3. **Test** your code:

    ```bash
    npm run dev
    # Test all affected functionalities
    ```

4. **Commit** your changes:

    ```bash
    git add .
    git commit -m "feat(voice): add filter for AFK users"
    ```

5. **Push** to your branch:

    ```bash
    git push origin feat/amazing-feature
    ```

6. **Open** a Pull Request on GitHub

## 🐛 Reporting Bugs

### Before Reporting

- Check that the bug hasn't been reported already
- Make sure you're using the latest version
- Verify it's not a configuration issue

### Bug Report Template

```markdown
## Bug Description

Clear description of the problem

## Steps to Reproduce

1. Do '...'
2. Execute '...'
3. See error

## Expected Behavior

What should have happened

## Actual Behavior

What actually happened

## Environment

- OS: [e.g., Windows 11]
- Node.js: [e.g., 18.17.0]
- Discord.js: [e.g., 14.14.1]
- Bot version: [e.g., 1.2.0]

## Logs
```

Include relevant logs here

```

## Screenshots
If applicable, add screenshots
```

## 💡 Feature Requests

### Feature Request Template

```markdown
## Feature Description

Clear description of the functionality

## Problem It Solves

What current problem does it solve?

## Proposed Solution

How would you like it to work?

## Alternatives Considered

Have you considered other solutions?

## Additional Context

Any additional information
```

## 🔧 Contribution Areas

### High Priority

- 🧪 **Tests**: Implement testing suite
- 📊 **Analytics**: Improve statistics and visualization
- 🌐 **Internationalization**: Multi-language support
- ⚡ **Performance**: Performance optimizations

### Medium Priority

- 🎨 **UI/UX**: Improve embeds and formatting
- 📱 **Mobile**: Discord mobile optimization
- 🔌 **Plugins**: Plugin/extension system
- 📈 **Metrics**: Web statistics dashboard

### Feature Ideas

- Reward system for voice time
- Music bot integration
- Automatic cloud backup
- REST API for external data
- Custom notifications

## 📋 Pull Request Guidelines

### Pre-PR Checklist

- [ ] Code follows established conventions
- [ ] Commits follow conventional format
- [ ] I have tested my code locally
- [ ] I have updated documentation if necessary
- [ ] No conflicts with main branch

### Review Process

1. **Automated checks**: CI/CD will verify code
2. **Code review**: A maintainer will review your code
3. **Testing**: Will be tested in development environment
4. **Merge**: If everything is good, it will be merged

### Response Time

- **Reviews**: 1-3 business days
- **Bug fixes**: High priority
- **Features**: Evaluation according to roadmap

## 🏆 Recognition

### Contributors

All contributors will appear in:

- Main README.md
- GitHub contributors page
- Release notes when applicable

### Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/). We expect all participants to respect it.

## 📞 Contact

Have questions about contributing?

- 💬 **Discussions**: [GitHub Discussions](https://github.com/DanoGlez/discord-voice-timer-bot/discussions)
- 🐛 **Issues**: [GitHub Issues](https://github.com/DanoGlez/discord-voice-timer-bot/issues)
- 📧 **Email**: contact@danoglez.com

---

**Thanks for contributing! 🎉 Your help makes this project better for the entire community.**
