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
            console.error('❌ No se puede registrar comandos sin token o cliente');
            return;
        }

        try {
            const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

            console.log('🔄 Registrando slash commands...');

            await rest.put(Routes.applicationCommands(this.client.user.id), {
                body: config.SLASH_COMMANDS,
            });

            console.log('✅ Slash commands registrados correctamente');
        } catch (error) {
            console.error('❌ Error registrando slash commands:', error);
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
            console.error('Error ejecutando comando:', error);

            const errorMessage = '❌ Ocurrió un error al ejecutar el comando.';

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
                content: '❌ Necesitas permisos de administrador para usar este comando.',
                ephemeral: true,
            });
        }

        const channel = interaction.options.getChannel('logchannel');

        await this.dataManager.setGuildConfig(interaction.guild.id, {
            logChannelId: channel.id,
        });

        await interaction.reply({
            content: `✅ Canal de logs configurado: ${channel}`,
            ephemeral: true,
        });
    }

    async handleStatsCommand(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const guildId = interaction.guild.id;
        const now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let period = 'mes';

        const periodArg = interaction.options.getString('periodo');

        if (periodArg) {
            const periodLower = periodArg.toLowerCase();

            if (periodLower === 'semana') {
                period = 'semana';
            } else if (periodLower === 'dia' || periodLower === 'día') {
                period = 'dia';
            } else if (periodArg.includes('/')) {
                const [monthArg, yearArg] = periodArg.split('/');
                month = parseInt(monthArg);
                year = parseInt(yearArg);

                if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
                    return interaction.editReply(
                        '❌ Formato de fecha inválido. Usa MM/YYYY (ej: 09/2025)'
                    );
                }
            }
        }

        const sessions = await this.dataManager.loadVoiceSessions(guildId, year, month);
        const filteredSessions = this.filterSessionsByPeriod(sessions, period, year, month);

        if (filteredSessions.length === 0) {
            return interaction.editReply(
                '📊 No hay datos para mostrar en el período seleccionado.'
            );
        }

        const stats = this.calculateStats(filteredSessions);
        const embed = this.createStatsEmbed(stats, period, month, year);

        await interaction.editReply({ embeds: [embed] });
    }

    async handleResetCommand(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: '❌ Necesitas permisos de administrador para usar este comando.',
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
                    content: '❌ Formato de fecha inválido. Usa MM/YYYY (ej: 09/2025)',
                    ephemeral: true,
                });
            }
        }

        const success = await this.dataManager.deleteVoiceSessions(guildId, year, month);

        if (success) {
            await interaction.reply({
                content: `✅ Datos de ${this.getPeriodText('mes', month, year)} eliminados correctamente.`,
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: '❌ No se encontraron datos para eliminar en ese período.',
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
            return interaction.editReply('📊 No hay datos para mostrar en este mes.');
        }

        if (Object.keys(userData).length === 0) {
            return interaction.editReply('📊 No hay minutos acumulados para mostrar en este mes.');
        }

        const embed = this.createLiveStatsEmbed(userData, interaction.guild.name, month, year);
        await interaction.editReply({ embeds: [embed] });
    }

    createLiveStatsEmbed(userData, guildName, month, year) {
        const embed = new EmbedBuilder()
            .setTitle(`📊 Minutos Acumulados - ${guildName}`)
            .setColor(config.EMBED_COLOR)
            .setTimestamp();

        // Ordenar usuarios por minutos acumulados
        const sortedUsers = Object.entries(userData)
            .sort((a, b) => b[1].totalMinutes - a[1].totalMinutes)
            .slice(0, 10); // Top 10

        if (sortedUsers.length > 0) {
            const userList = sortedUsers
                .map((user, index) => {
                    const [, userInfo] = user;
                    return `${index + 1}. **${userInfo.username}** - ${userInfo.totalMinutes} minutos`;
                })
                .join('\n');

            embed.addFields({
                name: `⏱️ Top Usuarios (${month.toString().padStart(2, '0')}/${year})`,
                value: userList,
                inline: false,
            });
        }

        embed.setFooter({
            text: 'Datos del mes actual • Actualizados cada minuto',
        });

        return embed;
    }

    // Mantener compatibilidad con comandos de texto (opcional)
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
            .setTitle('📖 Comandos del Bot de Tiempo de Voz')
            .setColor(config.EMBED_COLOR)
            .setDescription(
                'Este bot ahora usa **Slash Commands**. Escribe `/` y selecciona un comando:'
            )
            .addFields(
                {
                    name: '⚙️ `/config logchannel:#canal`',
                    value: 'Configura el canal de logs (Admin)',
                    inline: false,
                },
                {
                    name: '📊 `/stats [período]`',
                    value: 'Muestra estadísticas\n**Períodos:** `dia`, `semana`, `MM/YYYY`',
                    inline: false,
                },
                {
                    name: '⏱️ `/live`',
                    value: 'Muestra minutos acumulados en tiempo real',
                    inline: false,
                },
                {
                    name: '🗑️ `/reset [período]`',
                    value: 'Reinicia datos del período especificado (Admin)',
                    inline: false,
                }
            )
            .setFooter({ text: 'El bot rastrea automáticamente el tiempo en canales de voz' });

        message.reply({ embeds: [embed], ephemeral: true });
    }

    filterSessionsByPeriod(sessions, period, _year, _month) {
        const now = new Date();

        if (period === 'dia') {
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            return sessions.filter(session => {
                const sessionDate = new Date(session.joinTime);
                return sessionDate >= today;
            });
        } else if (period === 'semana') {
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
            .setTitle(`📊 Estadísticas de Voz - ${this.getPeriodText(period, month, year)}`)
            .setColor(config.EMBED_COLOR)
            .addFields({
                name: '📈 Resumen General',
                value: `**Total de sesiones:** ${totalSessions}\n**Tiempo total:** ${this.formatDuration(totalTime)}`,
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
                name: '👑 Top Usuarios',
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
                name: '🎤 Top Canales',
                value: channelList,
                inline: true,
            });
        }

        return embed;
    }

    getPeriodText(period, month, year) {
        if (period === 'dia') return 'Hoy';
        if (period === 'semana') return 'Última semana';

        const monthNames = [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre',
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
