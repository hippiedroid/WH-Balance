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
        const steamid = interaction.options.getString('steamid');
        const filePath = path.join('C:/Omega/servers/WinterHideout/profiles/KR_BANKING/PlayerDataBase/', `${steamid}.json`);

        // Read the JSON file
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
