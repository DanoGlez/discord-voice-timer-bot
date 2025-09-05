const { EmbedBuilder, PermissionFlagsBits, REST, Routes } = require('discord.js');
const config = require('../config/config.js');
const path = require('path');

class CommandHandler {
    constructor(client, dataManager, voiceHandler) {
        this.client = client;
        this.dataManager = dataManager;
        this.voiceHandler = voiceHandler;
    }

    async registerSlashCommands() {
        if (!process.env.DISCORD_TOKEN || !this.client.user) {
            console.error('❌ Cannot register commands without token or client');
            return;
        }

        try {
            const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

            console.log('🔄 Registering slash commands...');

            await rest.put(Routes.applicationCommands(this.client.user.id), {
                body: config.SLASH_COMMANDS,
            });

            console.log('✅ Slash commands registered successfully');
        } catch (error) {
            console.error('❌ Error registering slash commands:', error);
        }
    }

    async handleInteraction(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const { commandName } = interaction;

        try {
            switch (commandName) {
                case 'config':
                    await this.handleConfigCommand(interaction);
                    break;
                case 'stats':
                    await this.handleStatsCommand(interaction);
                    break;
                case 'reset':
                    await this.handleResetCommand(interaction);
                    break;
                case 'live':
                    await this.handleLiveCommand(interaction);
                    break;
            }
        } catch (error) {
            console.error('Error executing command:', error);

            const errorMessage = '❌ An error occurred while executing the command.';

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: errorMessage, ephemeral: true });
            } else {
                await interaction.reply({ content: errorMessage, ephemeral: true });
            }
        }
    }

    async handleConfigCommand(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: '❌ You need administrator permissions to use this command.',
                ephemeral: true,
            });
        }

        const channel = interaction.options.getChannel('logchannel');

        await this.dataManager.setGuildConfig(interaction.guild.id, {
            logChannelId: channel.id,
        });

        await interaction.reply({
            content: `✅ Log channel configured: ${channel}`,
            ephemeral: true,
        });
    }

    async handleStatsCommand(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const guildId = interaction.guild.id;
        const now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let period = 'month';

        const periodArg = interaction.options.getString('periodo');

        if (periodArg) {
            const periodLower = periodArg.toLowerCase();

            if (periodLower === 'week' || periodLower === 'semana') {
                period = 'week';
            } else if (periodLower === 'day' || periodLower === 'dia' || periodLower === 'día') {
                period = 'day';
            } else if (periodArg.includes('/')) {
                const [monthArg, yearArg] = periodArg.split('/');
                month = parseInt(monthArg);
                year = parseInt(yearArg);

                if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
                    return interaction.editReply(
                        '❌ Invalid date format. Use MM/YYYY (e.g: 09/2025)'
                    );
                }
            }
        }

        const sessions = await this.dataManager.loadVoiceSessions(guildId, year, month);
        const filteredSessions = this.filterSessionsByPeriod(sessions, period, year, month);

        if (filteredSessions.length === 0) {
            return interaction.editReply(
                '📊 No data to show for the selected period.'
            );
        }

        const stats = this.calculateStats(filteredSessions);
        const embed = this.createStatsEmbed(stats, period, month, year);

        await interaction.editReply({ embeds: [embed] });
    }

    async handleResetCommand(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: '❌ You need administrator permissions to use this command.',
                ephemeral: true,
            });
        }

        const guildId = interaction.guild.id;
        const now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;

        const periodArg = interaction.options.getString('periodo');

        if (periodArg && periodArg.includes('/')) {
            const [monthArg, yearArg] = periodArg.split('/');
            month = parseInt(monthArg);
            year = parseInt(yearArg);

            if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
                return interaction.reply({
                    content: '❌ Invalid date format. Use MM/YYYY (e.g: 09/2025)',
                    ephemeral: true,
                });
            }
        }

        const success = await this.dataManager.deleteVoiceSessions(guildId, year, month);

        if (success) {
            await interaction.reply({
                content: `✅ Data for ${this.getPeriodText('month', month, year)} deleted successfully.`,
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: '❌ No data found to delete for that period.',
                ephemeral: true,
            });
        }
    }

    async handleLiveCommand(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const guildId = interaction.guild.id;
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        // Leer datos del archivo mensual actual
        const fileName = `${guildId}_${year}_${month.toString().padStart(2, '0')}.json`;
        const filePath = path.join('./data', fileName);

        let userData = {};
        try {
            const fs = require('fs').promises;
            const data = await fs.readFile(filePath, 'utf8');
            userData = JSON.parse(data);
        } catch (error) {
            return interaction.editReply('📊 No data to show for this month.');
        }

        if (Object.keys(userData).length === 0) {
            return interaction.editReply('📊 No accumulated minutes to show for this month.');
        }

        const embed = this.createLiveStatsEmbed(userData, interaction.guild.name, month, year);
        await interaction.editReply({ embeds: [embed] });
    }

    createLiveStatsEmbed(userData, guildName, month, year) {
        const embed = new EmbedBuilder()
            .setTitle(`📊 Accumulated Minutes - ${guildName}`)
            .setColor(config.EMBED_COLOR)
            .setTimestamp();

        // Sort users by accumulated minutes
        const sortedUsers = Object.entries(userData)
            .sort((a, b) => b[1].totalMinutes - a[1].totalMinutes)
            .slice(0, 10); // Top 10

        if (sortedUsers.length > 0) {
            const userList = sortedUsers
                .map((user, index) => {
                    const [, userInfo] = user;
                    return `${index + 1}. **${userInfo.username}** - ${userInfo.totalMinutes} minutes`;
                })
                .join('\n');

            embed.addFields({
                name: `⏱️ Top Users (${month.toString().padStart(2, '0')}/${year})`,
                value: userList,
                inline: false,
            });
        }

        embed.setFooter({
            text: 'Current month data • Updated every minute',
        });

        return embed;
    }

    // Maintain compatibility with text commands (optional)
    async handleMessage(message) {
        if (message.author.bot || !message.content.startsWith('!')) return;

        const args = message.content.slice(1).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (command === 'help') {
            await this.showHelp(message);
        }
    }

    async showHelp(message) {
        const embed = new EmbedBuilder()
            .setTitle('📖 Voice Timer Bot Commands')
            .setColor(config.EMBED_COLOR)
            .setDescription(
                'This bot now uses **Slash Commands**. Type `/` and select a command:'
            )
            .addFields(
                {
                    name: '⚙️ `/config logchannel:#channel`',
                    value: 'Configure log channel (Admin)',
                    inline: false,
                },
                {
                    name: '📊 `/stats [period]`',
                    value: 'Show statistics\n**Periods:** `day`, `week`, `MM/YYYY`',
                    inline: false,
                },
                {
                    name: '⏱️ `/live`',
                    value: 'Show accumulated minutes in real time',
                    inline: false,
                },
                {
                    name: '🗑️ `/reset [period]`',
                    value: 'Reset data for specified period (Admin)',
                    inline: false,
                }
            )
            .setFooter({ text: 'The bot automatically tracks time in voice channels' });

        message.reply({ embeds: [embed], ephemeral: true });
    }

    filterSessionsByPeriod(sessions, period, _year, _month) {
        const now = new Date();

        if (period === 'day' || period === 'dia' || period === 'día') {
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            return sessions.filter(session => {
                const sessionDate = new Date(session.joinTime);
                return sessionDate >= today;
            });
        } else if (period === 'week' || period === 'semana') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return sessions.filter(session => {
                const sessionDate = new Date(session.joinTime);
                return sessionDate >= weekAgo;
            });
        }

        return sessions;
    }

    calculateStats(sessions) {
        const userStats = new Map();
        const channelStats = new Map();
        let totalTime = 0;

        sessions.forEach(session => {
            const { userId, username, channelName, duration } = session;

            totalTime += duration;

            if (!userStats.has(userId)) {
                userStats.set(userId, { username, totalTime: 0, sessions: 0 });
            }
            const userStat = userStats.get(userId);
            userStat.totalTime += duration;
            userStat.sessions += 1;

            if (!channelStats.has(channelName)) {
                channelStats.set(channelName, { totalTime: 0, sessions: 0 });
            }
            const channelStat = channelStats.get(channelName);
            channelStat.totalTime += duration;
            channelStat.sessions += 1;
        });

        return { userStats, channelStats, totalTime, totalSessions: sessions.length };
    }

    createStatsEmbed(stats, period, month, year) {
        const { userStats, channelStats, totalTime, totalSessions } = stats;

        const embed = new EmbedBuilder()
            .setTitle(`📊 Voice Statistics - ${this.getPeriodText(period, month, year)}`)
            .setColor(config.EMBED_COLOR)
            .addFields({
                name: '📈 General Summary',
                value: `**Total sessions:** ${totalSessions}\n**Total time:** ${this.formatDuration(totalTime)}`,
                inline: false,
            });

        const topUsers = Array.from(userStats.entries())
            .sort((a, b) => b[1].totalTime - a[1].totalTime)
            .slice(0, 5);

        if (topUsers.length > 0) {
            const userList = topUsers
                .map(
                    (user, index) =>
                        `${index + 1}. **${user[1].username}** - ${this.formatDuration(user[1].totalTime)}`
                )
                .join('\n');

            embed.addFields({
                name: '👑 Top Users',
                value: userList,
                inline: true,
            });
        }

        const topChannels = Array.from(channelStats.entries())
            .sort((a, b) => b[1].totalTime - a[1].totalTime)
            .slice(0, 5);

        if (topChannels.length > 0) {
            const channelList = topChannels
                .map(
                    (channel, index) =>
                        `${index + 1}. **${channel[0]}** - ${this.formatDuration(channel[1].totalTime)}`
                )
                .join('\n');

            embed.addFields({
                name: '🎤 Top Channels',
                value: channelList,
                inline: true,
            });
        }

        return embed;
    }

    getPeriodText(period, month, year) {
        if (period === 'day' || period === 'dia' || period === 'día') return 'Today';
        if (period === 'week' || period === 'semana') return 'Last week';

        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];

        return `${monthNames[month - 1]} ${year}`;
    }

    formatDuration(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }
}

module.exports = CommandHandler;
