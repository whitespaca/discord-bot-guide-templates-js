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

client.on('messageCreate', message => {
    if (message.content === `${prefix}ping`) {
        message.channel.send('Pong!')
    }
})

client.login(token)