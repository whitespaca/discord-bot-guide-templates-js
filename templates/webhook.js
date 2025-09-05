import { REST, Routes, Client, GatewayIntentBits, EmbedBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js'
import axios from 'axios';

const token = "discord bot token here"
const client = new Client({ 
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions
    ]
})

const prefix = "!"

const webhookURL = "discord webhook URL here"

const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Sends an embed'),
    new SlashCommandBuilder()
        .setName('myinfo')
        .setDescription('Shows your profile info'),
    new SlashCommandBuilder()
        .setName('reactionrole')
        .setDescription('Sets up a reaction role message'),
    new SlashCommandBuilder()
        .setName('reactionrolebutton')
        .setDescription('Sets up a reaction role button message'),
    new SlashCommandBuilder()
        .setName('webhook')
        .setDescription('Sends a message via webhook')
        .addStringOption(option => 
            option.setName('message')
                .setDescription('The message to send')
                .setRequired(true)
        )
].map(command => command.toJSON())

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

    if (commandName === 'reactionrolebutton') {
        if (!interaction.member.permissions.has('ManageRoles')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const role = interaction.guild.roles.cache.find(r => r.name === "Example Role");
        
        if (!role) {
            return interaction.reply({ content: 'Role not found. Please create a role named "Example Role".', ephemeral: true });
        }

        const button = new ButtonBuilder()
            .setCustomId('getRole')
            .setLabel(`Get ${role.name} Role`)
            .setStyle(ButtonStyle.Primary);

        const reactionRoleEmbed = new EmbedBuilder()
            .setColor(0x00FFFF)
            .setTitle('Reaction Role Button')
            .setDescription(`Click the button below to get the "${role.name}" role!`);
        
        const message = await interaction.reply({ embeds: [reactionRoleEmbed], components: [{ type: 1, components: [button] }], fetchReply: true });

        const filter = i => i.customId === 'getRole' && !i.user.bot;
        const collector = message.createMessageComponentCollector({ filter, time: 600000 });

        collector.on('collect', async i => {
            const member = await interaction.guild.members.fetch(i.user.id);
            if (member.roles.cache.has(role.id)) {
                await member.roles.remove(role);
                await i.reply({ content: `Removed the "${role.name}" role from you.`, ephemeral: true });
            } else {
                await member.roles.add(role);
                await i.reply({ content: `Gave you the "${role.name}" role!`, ephemeral: true });
            }
        });

        collector.on('end', collected => console.log(`Collected ${collected.size} interactions.`));
        await interaction.followUp({ content: 'Reaction role button message set up!', ephemeral: true });
    }

    if (commandName === 'webhook') {
        const messageContent = interaction.options.getString('message');
        try {
            await axios.post(webhookURL, {
                content: messageContent
            });
            await interaction.reply({ content: 'Message sent via webhook!', ephemeral: true });
        } catch (error) {
            console.error('Error sending webhook message:', error);
            await interaction.reply({ content: 'Failed to send message via webhook.', ephemeral: true });
        }
    }
})

client.login(token)