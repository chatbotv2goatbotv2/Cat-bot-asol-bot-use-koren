const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "commands"],
    version: "2.0",
    author: "Helal",
    countDown: 5,
    role: 0,
    shortDescription: "Show all available commands",
    longDescription: "Display a categorized list of all available bot commands with a video.",
    category: "system",
    guide: "{pn} or {pn} <command name>"
  },

  onStart: async function ({ message, args }) {
    const commandFolders = fs.readdirSync(path.join(__dirname, ".."));
    let allCommands = [];

    for (const folder of commandFolders) {
      const folderPath = path.join(__dirname, "..", folder);
      if (!fs.statSync(folderPath).isDirectory()) continue;

      const files = fs.readdirSync(folderPath).filter(file => file.endsWith(".js"));
      for (const file of files) {
        try {
          const command = require(path.join(folderPath, file));
          if (command.config?.name) {
            allCommands.push({
              name: command.config.name,
              category: command.config.category || "Misc"
            });
          }
        } catch (e) { }
      }
    }

    if (allCommands.length === 0)
      return message.reply("❌ | Failed to load help list.");

    // Categorize commands
    const categories = {};
    for (const cmd of allCommands) {
      const category = cmd.category.toUpperCase();
      if (!categories[category]) categories[category] = [];
      categories[category].push(cmd.name);
    }

    // Emojis for each category
    const categoryEmojis = {
      GAME: "🎮",
      GROUP: "👥",
      IMAGE: "🖼️",
      SYSTEM: "🧠",
      FUN: "🎭",
      ECONOMY: "💰",
      ISLAMIC: "☪️",
      UTILITY: "📌",
      MISC: "✨"
    };

    let helpMessage = "╭─────『 🌺 𝐁𝐎𝐓 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 🌺 』─────╮\n\n";
    for (const [category, cmds] of Object.entries(categories)) {
      const emoji = categoryEmojis[category] || "🌸";
      helpMessage += `            ${emoji} ${category} ${emoji}\n`;
      helpMessage += cmds.map(c => `🌺 ${c}`).join("\n") + "\n\n";
    }
    helpMessage += "╰─────────────────────────────💫";

    // Send help message + video
    await message.reply({
      body: helpMessage,
      attachment: await global.utils.getStreamFromURL("https://i.imgur.com/1lNzAqy.mp4")
    });
  }
};
