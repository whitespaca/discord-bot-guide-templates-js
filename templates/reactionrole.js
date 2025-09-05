import { REST, Routes, Client, GatewayIntentBits, EmbedBuilder } from 'discord.js'

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

const commands = [
    { name: 'ping', description: 'Replies with Pong!' },
    { name: 'embed', description: 'Sends an embed' },
    { name: 'myinfo', description: 'Shows your profile info' },
    { name: 'reactionrole', description: 'Sets up a reaction role message' }
]

client.once('ready', async () => {
    console.log(`Logged in as ${client.user?.tag}!`)

    const rest = new REST().setToken(token);

    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
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

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        await interaction.reply('Pong!');
    }

    if (commandName === 'embed') {
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Title')
            .setDescription('Description')
            .setImage('https://i.imgur.com/AfFp7pu.png');
        
        await interaction.reply({ embeds: [exampleEmbed] });
    }

    if (commandName === 'myinfo') {
        const user = interaction.user;
        const member = interaction.member;

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
        
        await interaction.reply({ embeds: [infoEmbed] });
    }

    if (commandName === 'reactionrole') {
        if (!interaction.member.permissions.has('ManageRoles')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const role = interaction.guild.roles.cache.find(r => r.name === "Example Role");

        if (!role) {
            return interaction.reply({ content: 'Role not found. Please create a role named "Example Role".', ephemeral: true });
        }

        const reactionRoleEmbed = new EmbedBuilder()
            .setColor(0xFFFF00)
            .setTitle('Reaction Role')
            .setDescription(`React with ✅ to get the "${role.name}" role!`);
        
        const message = await interaction.reply({ embeds: [reactionRoleEmbed], fetchReply: true });
        await message.react('✅');

        const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot;
        const collector = message.createReactionCollector({ filter, dispose: true });

        collector.on('collect', async (reaction, user) => {
            const member = await interaction.guild.members.fetch(user.id);
            if (member.roles.cache.has(role.id)) return;
            await member.roles.add(role);
        });

        collector.on('remove', async (reaction, user) => {
            const member = await interaction.guild.members.fetch(user.id);
            if (!member.roles.cache.has(role.id)) return;
            await member.roles.remove(role);
        });
        
        await interaction.followUp({ content: 'Reaction role message set up!', ephemeral: true });
    }
})

client.login(token)