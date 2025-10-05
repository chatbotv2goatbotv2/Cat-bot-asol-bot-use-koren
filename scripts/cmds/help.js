module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "commands", "cmd"],
    version: "7.1",
    author: "Helal Islam",
    shortDescription: "Show all commands in stylish digital menu.",
    longDescription: "Auto-detects commands, categories and displays them with emoji & gradient look.",
    category: "system",
    guide: "{pn} [command]"
  },

  onStart: async function ({ message, prefix }) {
    try {
      const allCommands = global.GoatBot.commands;
      const categories = {};

      // Clean category names
      const cleanCategory = (text) => text ? text.toUpperCase() : "OTHERS";

      for (const [name, cmd] of allCommands) {
        if (!cmd?.config || cmd.config.name === "help") continue;
        const cat = cleanCategory(cmd.config.category);
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(cmd.config.name);
      }

      // Emoji map for categories
      const emojiMap = {
        "AI-IMAGE": "🎨",
        FUN: "🎮",
        SYSTEM: "⚙️",
        OTHERS: "📁"
      };

      // Gradient line effect
      const gradientLine = (length = 20) => {
        const chars = "🌈✨💫🔹⚡";
        let line = "";
        for (let i = 0; i < length; i++) {
          line += chars[Math.floor(Math.random() * chars.length)];
        }
        return line;
      };

      let menuMsg = `🔮 𝗗𝗜𝗚𝗜𝗧𝗔𝗟 𝗔𝗜 𝗠𝗘𝗡𝗨 🔮\n${gradientLine()}\n\n`;

      const sortedCats = Object.keys(categories).sort();
      for (const cat of sortedCats) {
        if (!categories[cat] || categories[cat].length === 0) continue;
        const icon = emojiMap[cat] || "✨";
        const cmds = categories[cat].sort();
        menuMsg += `╭─${icon}『 ${cat} 』\n`;
        for (let i = 0; i < cmds.length; i += 2) {
          const cmd1 = cmds[i];
          const cmd2 = cmds[i + 1];
          if (cmd2) menuMsg += `│ ⚡ ${cmd1}   ⚡ ${cmd2}\n`;
          else menuMsg += `│ ⚡ ${cmd1}\n`;
        }
        menuMsg += `╰${gradientLine(15)}\n\n`;
      }

      const totalCommands = allCommands.size - 1;

      menuMsg +=
        `╭─💫 Bot Info 💫\n` +
        `│ Total Commands: ${totalCommands}\n` +
        `│ Prefix: ${prefix}\n` +
        `│ Type: ${prefix}help <command>\n` +
        `╰${gradientLine(15)}\n\n` +
        `👑 Developed by: Helal Islam\n` +
        `🚀 Powered by: Digital AI System\n`;

      return message.reply(menuMsg);

    } catch (err) {
      console.error(err);
      return message.reply("❌ Error loading Digital AI Menu!");
    }
  }
};
