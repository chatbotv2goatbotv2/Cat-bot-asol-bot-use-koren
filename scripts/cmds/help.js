module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "commands", "cmd"],
    version: "7.3",
    author: "Helal Islam",
    shortDescription: "Show all commands in clean, vodro/fancy style.",
    longDescription: "Displays all commands category-wise with neat alignment and stylish look.",
    category: "system",
    guide: "{pn} [command]"
  },

  onStart: async function ({ message, prefix }) {
    try {
      const allCommands = global.GoatBot.commands;
      const categories = {};

      // Clean category names
      const cleanCategory = (text) => text ? text.toUpperCase() : "OTHERS";

      // Categorize commands
      for (const [name, cmd] of allCommands) {
        if (!cmd?.config || cmd.config.name === "help") continue;
        const cat = cleanCategory(cmd.config.category);
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(cmd.config.name);
      }

      // Category emojis
      const emojiMap = {
        "AI-IMAGE": "🎨",
        FUN: "🎮",
        SYSTEM: "⚙️",
        OTHERS: "📁"
      };

      // Build menu message
      let menuMsg = "🌌 𝗗𝗜𝗚𝗜𝗧𝗔𝗟 𝗔𝗜 𝗠𝗘𝗡𝗨 🌌\n━━━━━━━━━━━━━━━━\n";

      const sortedCats = Object.keys(categories).sort();
      for (const cat of sortedCats) {
        if (!categories[cat] || categories[cat].length === 0) continue;
        const icon = emojiMap[cat] || "✨";
        const cmds = categories[cat].sort();

        menuMsg += `╭─${icon}『 ${cat} 』\n`;
        for (let i = 0; i < cmds.length; i += 2) {
          const cmd1 = cmds[i];
          const cmd2 = cmds[i + 1];
          if (cmd2) {
            menuMsg += `│ ⚡ ${cmd1}  \n | ⚡ ${cmd2}\n`;
          } else {
            menuMsg += `│ ⚡ ${cmd1}\n`;
          }
        }
        menuMsg += `╰─────────\n`;
      }

      const totalCommands = allCommands.size - 1;

      menuMsg +=
        `━━━━━━━━━━━━━━━━\n` +
        `👑 Developed by: Helal Islam\n` +
        `🚀 Powered by: Digital AI System\n` +
        `Prefix: ${prefix} | Version: 7.3\n` +
        `━━━━━━━━━━━━━━━━`;

      return message.reply(menuMsg);

    } catch (err) {
      console.error(err);
      return message.reply("❌ Error loading Digital AI Menu!");
    }
  }
};
