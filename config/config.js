module.exports = {
    // Configuración global fija
    DATA_FOLDER: './data',
    EMBED_COLOR: '#7289da', // Color azul Discord

    // Slash Commands fijos
    SLASH_COMMANDS: [
        {
            name: 'stats',
            description: 'Muestra estadísticas de tiempo en canales de voz',
            options: [
                {
                    name: 'periodo',
                    description: 'Período de tiempo (dia, semana, o MM/YYYY)',
                    type: 3, // STRING
                    required: false,
                },
            ],
        },
        {
            name: 'reset',
            description: 'Reinicia datos de tiempo (solo administradores)',
            options: [
                {
                    name: 'periodo',
                    description: 'Período a reiniciar (MM/YYYY)',
                    type: 3, // STRING
                    required: false,
                },
            ],
        },
        {
            name: 'config',
            description: 'Configura el canal de logs (solo administradores)',
            options: [
                {
                    name: 'logchannel',
                    description: 'Canal para logs de voz',
                    type: 7, // CHANNEL
                    required: true,
                },
            ],
        },
        {
            name: 'live',
            description: 'Muestra minutos acumulados en tiempo real',
            options: [],
        },
    ],
};
