const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check the balance for a specific SteamID')
        .addStringOption(option =>
            option.setName('steamid')
                .setDescription('The SteamID to check the balance for')
                .setRequired(true)),
    async execute(interaction) {
        const allowedRoleIds = ['1189343657657126934', '1251952830055710751'];
        const allowedChannelId = '1269060120050929813';

        if (interaction.channelId !== allowedChannelId) {
            await interaction.reply({ content: `Wrong channel friend! Please use: <#${allowedChannelId}>.`, ephemeral: true });
            return;
        }

        const member = await interaction.guild.members.fetch(interaction.user.id);
        if (!allowedRoleIds.some(roleId => member.roles.cache.has(roleId))) {
            await interaction.reply({ content: `You must be an admin or a founder to use this command.`, ephemeral: true });
            return;
        }

        const steamid = interaction.options.getString('steamid');
        const filePath = path.join('C:/Omega/servers/WinterHideout/profiles/KR_BANKING/PlayerDataBase/', `${steamid}.json`);

        // Read the JSON file in
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                interaction.reply('There was an error reading the balance data.');
                return;
            }

            try {
                const playerData = JSON.parse(data);
                const balance = playerData.m_OwnedCurrency;
                const playerName = playerData.m_PlayerName;

                if (balance !== undefined) {
                    interaction.reply(`${playerName} currently has ${balance.toLocaleString()} Nova Coins.`);
                } else {
                    interaction.reply(`No balance found for SteamID ${steamid}.`);
                }
            } catch (jsonErr) {
                console.error(jsonErr);
                interaction.reply('There was an error parsing the balance data.');
            }
        });
    },
};
