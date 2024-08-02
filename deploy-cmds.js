const dotenv = require("dotenv");
dotenv.config();
const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

const commands = [];
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    // Guild specific applications
    // const data = await rest.put(
    //   Routes.applicationGuildCommands(
    //     process.env.CLIENT_ID,
    //     process.env.GUILD_ID
    //   ),
    //   { body: commands }
    // );

    // Global applications
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      {
        body: commands,
      }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );

    // Guild deletion / id based
    // rest
    //   .delete(Routes.applicationGuildCommand(process.env.CLIENT_ID, process.env.GUILD_ID, "commandId"))
    //   .then(() => console.log("Successfully deleted guild command"))
    //   .catch(console.error);

    // Global deletion / id based
    // rest
    //   .delete(Routes.applicationCommand(process.env.CLIENT_ID, "commandId"))
    //   .then(() => console.log("Successfully deleted application command"))
    //   .catch(console.error);

    // for guild-based commands / delete all
    // rest
    //   .put(
    //     Routes.applicationGuildCommands(
    //       process.env.CLIENT_ID,
    //       process.env.GUILD_ID
    //     ),
    //     { body: [] }
    //   )
    //   .then(() => console.log("Successfully deleted all guild commands."))
    //   .catch(console.error);

    // for global commands / delete all
    // rest
    //   .put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] })
    //   .then(() => console.log("Successfully deleted all application commands."))
    //   .catch(console.error);
  } catch (error) {
    console.error(error);
  }
})();
