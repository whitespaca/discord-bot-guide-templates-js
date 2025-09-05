import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js'

const token = "discord bot token here"
const client = new Client({ 
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ]
})

const prefix = "!"

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`)
})

client.on('messageCreate', m => {
    if (m.content === `${prefix}ping`) {
        m.reply('Pong!')
    }

    if (m.content === `${prefix}embed`) {
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Title')
            .setDescription('Description')
            .setImage('https://i.imgur.com/AfFp7pu.png');

        m.channel.send({ embeds: [exampleEmbed] });
    }
})

client.login(token)