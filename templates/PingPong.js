import { Client, GatewayIntentBits } from 'discord.js'

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
        m.channel.send('Pong!')
    }
})

client.login(token)