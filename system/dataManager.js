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
            console.log('📁 Carpeta de datos inicializada');
        } catch (error) {
            console.error('Error creando carpeta de datos:', error);
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
            console.log('⚙️ Configuraciones de servidores cargadas');
        } catch (error) {
            console.log('⚙️ Archivo de configuración no encontrado, creando nuevo...');
        }
    }

    async saveGuildConfigs() {
        try {
            const configPath = path.join(config.DATA_FOLDER, 'guild_configs.json');
            const configs = Object.fromEntries(this.guildConfigs);
            await fs.writeFile(configPath, JSON.stringify(configs, null, 2));
        } catch (error) {
            console.error('Error guardando configuraciones:', error);
        }
    }

    // Nuevo método para cargar sesiones activas desde JSON
    async loadActiveSessions() {
        try {
            const filePath = path.join(config.DATA_FOLDER, 'active_sessions.json');
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.log('📝 No se encontraron sesiones activas previas');
            return {};
        }
    }

    // Nuevo método para guardar sesiones activas en JSON
    async saveActiveSessions(activeSessions) {
        try {
            const filePath = path.join(config.DATA_FOLDER, 'active_sessions.json');
            const sessionsObject = Object.fromEntries(activeSessions);
            await fs.writeFile(filePath, JSON.stringify(sessionsObject, null, 2));
            console.log('💾 Sesiones activas guardadas');
        } catch (error) {
            console.error('❌ Error guardando sesiones activas:', error);
        }
    }

    // Nuevo método para cargar minutos acumulados desde JSON
    async loadAccumulatedMinutes() {
        try {
            const filePath = path.join(config.DATA_FOLDER, 'accumulated_minutes.json');
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.log('📊 No se encontraron minutos acumulados previos');
            return {};
        }
    }

    // Nuevo método para guardar minutos acumulados en JSON
    async saveAccumulatedMinutes(accumulatedMinutes) {
        try {
            const filePath = path.join(config.DATA_FOLDER, 'accumulated_minutes.json');
            await fs.writeFile(filePath, JSON.stringify(accumulatedMinutes, null, 2));
            console.log('💾 Minutos acumulados guardados');
        } catch (error) {
            console.error('❌ Error guardando minutos acumulados:', error);
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
                console.log(`📝 Creando nuevo archivo de datos: ${fileName}`);
            }

            // Actualizar o crear entrada del usuario
            const userKey = sessionData.userId;
            if (!data[userKey]) {
                data[userKey] = {
                    username: sessionData.username,
                    totalMinutes: 0,
                };
            }

            // Añadir minutos
            data[userKey].totalMinutes += sessionData.minutes || 1;
            data[userKey].username = sessionData.username; // Actualizar nombre por si cambió

            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('❌ Error guardando sesión de voz:', error);
        }
    }

    async loadVoiceSessions(guildId, year, month) {
        try {
            const fileName = `${guildId}_${year}_${month.toString().padStart(2, '0')}.json`;
            const filePath = path.join(config.DATA_FOLDER, fileName);
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return []; // Retornar array vacío si no existe el archivo
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
