import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js'

const token = "discord bot token here"
const client = new Client({ 
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers
    ]
})

const prefix = "!"

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`)
})

client.on('messageCreate', (message) => {
    if (message.content === `${prefix}ping`) {
        message.reply('Pong!')
    }

    if (message.content === `${prefix}embed`) {
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Title')
            .setDescription('Description')
            .setImage('https://i.imgur.com/AfFp7pu.png');

        message.channel.send({ embeds: [exampleEmbed] });
    }

    if (message.content === `${prefix}myinfo`) {
        const user = message.author;
        const member = message.member;

        const infoEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle(`${user.username}'s Info`)
            .addFields(
                { name: 'Username', value: user.tag, inline: true },
                { name: 'User ID', value: user.id, inline: true },
                { name: 'Account Created', value: user.createdAt.toDateString(), inline: false },
                { name: 'Joined Server', value: member.joinedAt.toDateString(), inline: false },
                { name: 'Roles', value: member.roles.cache.map(role => role.name).join(', '), inline: false }
            )
            .setThumbnail(user.displayAvatarURL());
        
        message.channel.send({ embeds: [infoEmbed] });
    }
})

client.login(token)