class VoiceHandler {
    constructor(client, dataManager) {
        this.client = client;
        this.dataManager = dataManager;
        this.activeSessions = new Map();
        this.lastDetectedUsers = new Set();

        this.startMinutelyCheck();
    }

    startMinutelyCheck() {
        this.minutelyInterval = setInterval(() => {
            this.checkAndUpdateActiveSessions();
        }, 60000);

        console.log('🕐 Sistema de revisión por minutos iniciado');
    }

    async checkAndUpdateActiveSessions() {
        const currentTime = new Date().toLocaleTimeString('es-ES');
        console.log(`🔍 [${currentTime}] Revisando canales de voz...`);

        const currentDetectedUsers = new Set();
        let totalUsersFound = 0;
        let totalChannelsWithUsers = 0;

        for (const guild of this.client.guilds.cache.values()) {
            const { usersCount, channelsCount, detectedUsers } =
                await this.checkGuildVoiceChannels(guild);
            totalUsersFound += usersCount;
            totalChannelsWithUsers += channelsCount;

            detectedUsers.forEach(userKey => currentDetectedUsers.add(userKey));
        }

        let minutesAdded = 0;
        for (const userKey of this.lastDetectedUsers) {
            if (currentDetectedUsers.has(userKey)) {
                await this.addMinuteToUser(userKey);
                minutesAdded++;
            }
        }

        this.lastDetectedUsers = currentDetectedUsers;

        if (totalUsersFound > 0) {
            console.log(
                `📊 [${currentTime}] Total: ${totalUsersFound} usuario(s) en ${totalChannelsWithUsers} canal(es) activo(s)`
            );
            if (minutesAdded > 0) {
                console.log(
                    `⏱️ [${currentTime}] +1 minuto añadido a ${minutesAdded} usuario(s) que permanecieron conectados`
                );
            }
        } else {
            console.log(`📊 [${currentTime}] No hay usuarios conectados en canales de voz`);
        }
    }

    async checkGuildVoiceChannels(guild) {
        let usersInVoice = 0;
        let channelsWithUsers = 0;
        const detectedUsers = [];

        try {
            const voiceChannels = guild.channels.cache.filter(channel => channel.type === 2);

            for (const channel of voiceChannels.values()) {
                if (channel.members.size > 0) {
                    channelsWithUsers++;
                    console.log(
                        `🎤 [${guild.name}] Canal "${channel.name}": ${channel.members.size} usuario(s)`
                    );

                    for (const member of channel.members.values()) {
                        if (!member.user.bot) {
                            // Verificar si el usuario NO está ensordesido (deaf)
                            if (!member.voice.deaf) {
                                const userKey = `${guild.id}_${member.id}`;
                                detectedUsers.push(userKey);
                                usersInVoice++;

                                console.log(`  👁️ Detectado: ${member.displayName}`);
                            } else {
                                console.log(`  🔇 Ensordesido (ignorado): ${member.displayName}`);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error(`❌ Error revisando canales de voz en ${guild.name}:`, error);
        }

        return { usersCount: usersInVoice, channelsCount: channelsWithUsers, detectedUsers };
    }

    async addMinuteToUser(userKey) {
        const [guildId, userId] = userKey.split('_');

        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return;

        const member = guild.members.cache.get(userId);
        if (!member) return;

        const now = new Date();
        const sessionData = {
            guildId,
            userId,
            username: member.displayName,
            minutes: 1,
            year: now.getFullYear(),
            month: now.getMonth() + 1,
        };

        await this.dataManager.saveVoiceSession(sessionData);

        console.log(`  ✅ +1 minuto guardado para ${member.displayName}`);
    }

    async stopMinutelyCheck() {
        if (this.minutelyInterval) {
            clearInterval(this.minutelyInterval);
            console.log('🛑 Sistema de revisión por minutos detenido');
        }
    }

    async handleVoiceStateUpdate(oldState, newState) {
        const userId = newState.member.id;
        const guildId = newState.guild.id;
        const sessionKey = `${guildId}_${userId}`;

        if (!oldState.channel && newState.channel) {
            const joinTime = Date.now();
            this.activeSessions.set(sessionKey, {
                userId,
                username: newState.member.displayName,
                guildId,
                channelId: newState.channel.id,
                channelName: newState.channel.name,
                joinTime,
            });

            await this.logToChannel(
                guildId,
                `🟢 **${newState.member.displayName}** se conectó a **${newState.channel.name}**`
            );
        } else if (oldState.channel && !newState.channel) {
            const session = this.activeSessions.get(sessionKey);
            if (session) {
                this.activeSessions.delete(sessionKey);
                await this.logToChannel(
                    guildId,
                    `🔴 **${session.username}** se desconectó de **${session.channelName}**`
                );
            }
        } else if (
            oldState.channel &&
            newState.channel &&
            oldState.channel.id !== newState.channel.id
        ) {
            const session = this.activeSessions.get(sessionKey);
            if (session) {
                this.activeSessions.set(sessionKey, {
                    ...session,
                    channelId: newState.channel.id,
                    channelName: newState.channel.name,
                });

                await this.logToChannel(
                    guildId,
                    `🔄 **${newState.member.displayName}** cambió de **${oldState.channel.name}** a **${newState.channel.name}**`
                );
            }
        }
    }

    async logToChannel(guildId, message) {
        try {
            const guild = this.client.guilds.cache.get(guildId);
            if (!guild) return;

            const guildConfig = this.dataManager.getGuildConfig(guildId);

            if (guildConfig.logChannelId) {
                const logChannel = guild.channels.cache.get(guildConfig.logChannelId);
                if (logChannel) {
                    await logChannel.send(message);
                }
            }
        } catch (error) {
            console.error('Error enviando log:', error);
        }
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

module.exports = VoiceHandler;
