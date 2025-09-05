module.exports = {
    // Fixed global configuration
    DATA_FOLDER: './data',
    EMBED_COLOR: '#7289da', // Discord blue color

    // Fixed Slash Commands
    SLASH_COMMANDS: [
        {
            name: 'stats',
            description: 'Shows voice channel time statistics',
            options: [
                {
                    name: 'periodo',
                    description: 'Time period (day, week, or MM/YYYY)',
                    type: 3, // STRING
                    required: false,
                },
            ],
        },
        {
            name: 'reset',
            description: 'Reset time data (administrators only)',
            options: [
                {
                    name: 'periodo',
                    description: 'Period to reset (MM/YYYY)',
                    type: 3, // STRING
                    required: false,
                },
            ],
        },
        {
            name: 'config',
            description: 'Configure log channel (administrators only)',
            options: [
                {
                    name: 'logchannel',
                    description: 'Channel for voice logs',
                    type: 7, // CHANNEL
                    required: true,
                },
            ],
        },
        {
            name: 'live',
            description: 'Shows accumulated minutes in real time',
            options: [],
        },
    ],
};
