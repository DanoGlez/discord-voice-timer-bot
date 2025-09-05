const fs = require('fs').promises;
const path = require('path');
const config = require('../config/config.js');

class DataManager {
    constructor() {
        this.guildConfigs = new Map();
        this.initializeDataFolder();
        this.loadGuildConfigs();
    }

    async initializeDataFolder() {
        try {
            await fs.mkdir(config.DATA_FOLDER, { recursive: true });
            console.log('📁 Data folder initialized');
        } catch (error) {
            console.error('Error creating data folder:', error);
        }
    }

    async loadGuildConfigs() {
        try {
            const configPath = path.join(config.DATA_FOLDER, 'guild_configs.json');
            const data = await fs.readFile(configPath, 'utf8');
            const configs = JSON.parse(data);

            for (const [guildId, guildConfig] of Object.entries(configs)) {
                this.guildConfigs.set(guildId, guildConfig);
            }
            console.log('⚙️ Guild configurations loaded');
        } catch (error) {
            console.log('⚙️ Configuration file not found, creating new one...');
        }
    }

    async saveGuildConfigs() {
        try {
            const configPath = path.join(config.DATA_FOLDER, 'guild_configs.json');
            const configs = Object.fromEntries(this.guildConfigs);
            await fs.writeFile(configPath, JSON.stringify(configs, null, 2));
        } catch (error) {
            console.error('Error saving configurations:', error);
        }
    }

    // Nuevo método para cargar sesiones activas desde JSON
    async loadActiveSessions() {
        try {
            const filePath = path.join(config.DATA_FOLDER, 'active_sessions.json');
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.log('📝 No previous active sessions found');
            return {};
        }
    }

    // Nuevo método para guardar sesiones activas en JSON
    async saveActiveSessions(activeSessions) {
        try {
            const filePath = path.join(config.DATA_FOLDER, 'active_sessions.json');
            const sessionsObject = Object.fromEntries(activeSessions);
            await fs.writeFile(filePath, JSON.stringify(sessionsObject, null, 2));
            console.log('💾 Active sessions saved');
        } catch (error) {
            console.error('❌ Error saving active sessions:', error);
        }
    }

    // Nuevo método para cargar minutos acumulados desde JSON
    async loadAccumulatedMinutes() {
        try {
            const filePath = path.join(config.DATA_FOLDER, 'accumulated_minutes.json');
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.log('📊 No previous accumulated minutes found');
            return {};
        }
    }

    // Nuevo método para guardar minutos acumulados en JSON
    async saveAccumulatedMinutes(accumulatedMinutes) {
        try {
            const filePath = path.join(config.DATA_FOLDER, 'accumulated_minutes.json');
            await fs.writeFile(filePath, JSON.stringify(accumulatedMinutes, null, 2));
            console.log('💾 Accumulated minutes saved');
        } catch (error) {
            console.error('❌ Error saving accumulated minutes:', error);
        }
    }

    async saveVoiceSession(sessionData) {
        try {
            const { guildId, year, month } = sessionData;
            const fileName = `${guildId}_${year}_${month.toString().padStart(2, '0')}.json`;
            const filePath = path.join(config.DATA_FOLDER, fileName);

            // Cargar datos existentes
            let data = {};
            try {
                const existingData = await fs.readFile(filePath, 'utf8');
                data = JSON.parse(existingData);
            } catch (error) {
                // Si no existe el archivo, crear estructura vacía
                console.log(`📝 Creating new data file: ${fileName}`);
            }

            // Actualizar o crear entrada del usuario
            const userKey = sessionData.userId;
            if (!data[userKey]) {
                data[userKey] = {
                    username: sessionData.username,
                    totalMinutes: 0,
                };
            }

            // Add minutes
            data[userKey].totalMinutes += sessionData.minutes || 1;
            data[userKey].username = sessionData.username; // Update name in case it changed

            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('❌ Error saving voice session:', error);
        }
    }

    async loadVoiceSessions(guildId, year, month) {
        try {
            const fileName = `${guildId}_${year}_${month.toString().padStart(2, '0')}.json`;
            const filePath = path.join(config.DATA_FOLDER, fileName);
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return []; // Return empty array if file doesn't exist
        }
    }

    async deleteVoiceSessions(guildId, year, month) {
        try {
            const fileName = `${guildId}_${year}_${month.toString().padStart(2, '0')}.json`;
            const filePath = path.join(config.DATA_FOLDER, fileName);
            await fs.unlink(filePath);
            return true;
        } catch (error) {
            return false;
        }
    }

    getGuildConfig(guildId) {
        return this.guildConfigs.get(guildId) || {};
    }

    setGuildConfig(guildId, newConfig) {
        const currentConfig = this.getGuildConfig(guildId);
        const updatedConfig = {
            ...currentConfig,
            ...newConfig,
        };

        this.guildConfigs.set(guildId, updatedConfig);
        return this.saveGuildConfigs();
    }
}

module.exports = DataManager;
