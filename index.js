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
            console.log(`✅ Bot connected as ${this.client.user.tag}`);
            console.log(`🎤 Monitoring ${this.client.guilds.cache.size} server(s)`);

            // Register slash commands
            await this.commandHandler.registerSlashCommands();

            // Check already connected users on startup
            console.log('🔍 Checking already connected users...');
            await this.voiceHandler.checkAndUpdateActiveSessions();
        });

        // Eventos de voz
        this.client.on('voiceStateUpdate', (oldState, newState) => {
            this.voiceHandler.handleVoiceStateUpdate(oldState, newState);
        });

        // Slash command events
        this.client.on('interactionCreate', interaction => {
            this.commandHandler.handleInteraction(interaction);
        });

        // Maintain compatibility with text commands for help
        this.client.on('messageCreate', message => {
            this.commandHandler.handleMessage(message);
        });

        // Error handling
        this.client.on('error', error => {
            console.error('Discord client error:', error);
        });

        process.on('unhandledRejection', error => {
            console.error('Unhandled Promise Rejection:', error);
        });

        // Process shutdown handling
        process.on('SIGINT', () => {
            console.log('\n🛑 Shutting down bot...');
            this.shutdown();
        });

        process.on('SIGTERM', () => {
            console.log('\n🛑 Shutting down bot...');
            this.shutdown();
        });
    }

    async shutdown() {
        console.log('🔄 Finalizing active sessions...');
        await this.voiceHandler.stopMinutelyCheck();

        console.log('✅ Bot shut down correctly');
        process.exit(0);
    }

    start() {
        if (!process.env.DISCORD_TOKEN) {
            console.error(
                '❌ Discord token not found. Make sure to configure DISCORD_TOKEN in the .env file'
            );
            process.exit(1);
        }

        this.client.login(process.env.DISCORD_TOKEN).catch(error => {
            console.error('❌ Error connecting to Discord:', error);
            process.exit(1);
        });
    }
}

// Start the bot
const bot = new VoiceTimerBot();
bot.start();
