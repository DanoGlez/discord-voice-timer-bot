const { Client, GatewayIntentBits } = require('discord.js');
const DataManager = require('./system/dataManager.js');
const VoiceHandler = require('./system/voiceHandler.js');
const CommandHandler = require('./commands/commandHandler.js');
require('dotenv').config();

class VoiceTimerBot {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });

        // Inicializar módulos
        this.dataManager = new DataManager();
        this.voiceHandler = new VoiceHandler(this.client, this.dataManager);
        this.commandHandler = new CommandHandler(this.client, this.dataManager, this.voiceHandler);

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.client.on('clientReady', async () => {
            console.log(`✅ Bot conectado como ${this.client.user.tag}`);
            console.log(`🎤 Monitoreando ${this.client.guilds.cache.size} servidor(es)`);

            // Registrar slash commands
            await this.commandHandler.registerSlashCommands();

            // Revisar usuarios ya conectados al iniciar
            console.log('🔍 Revisando usuarios ya conectados...');
            await this.voiceHandler.checkAndUpdateActiveSessions();
        });

        // Eventos de voz
        this.client.on('voiceStateUpdate', (oldState, newState) => {
            this.voiceHandler.handleVoiceStateUpdate(oldState, newState);
        });

        // Eventos de slash commands
        this.client.on('interactionCreate', interaction => {
            this.commandHandler.handleInteraction(interaction);
        });

        // Mantener compatibilidad con comandos de texto para ayuda
        this.client.on('messageCreate', message => {
            this.commandHandler.handleMessage(message);
        });

        // Manejo de errores
        this.client.on('error', error => {
            console.error('Error del cliente Discord:', error);
        });

        process.on('unhandledRejection', error => {
            console.error('Unhandled Promise Rejection:', error);
        });

        // Manejo de cierre del proceso
        process.on('SIGINT', () => {
            console.log('\n🛑 Cerrando bot...');
            this.shutdown();
        });

        process.on('SIGTERM', () => {
            console.log('\n🛑 Cerrando bot...');
            this.shutdown();
        });
    }

    async shutdown() {
        console.log('🔄 Finalizando sesiones activas...');
        await this.voiceHandler.stopMinutelyCheck();

        console.log('✅ Bot cerrado correctamente');
        process.exit(0);
    }

    start() {
        if (!process.env.DISCORD_TOKEN) {
            console.error(
                '❌ Token de Discord no encontrado. Asegúrate de configurar DISCORD_TOKEN en el archivo .env'
            );
            process.exit(1);
        }

        this.client.login(process.env.DISCORD_TOKEN).catch(error => {
            console.error('❌ Error al conectar con Discord:', error);
            process.exit(1);
        });
    }
}

// Iniciar el bot
const bot = new VoiceTimerBot();
bot.start();
