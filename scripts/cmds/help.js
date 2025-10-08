const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "commands"],
    version: "10.5",
    role: 0,
    shortDescription: "Show all bot commands (auto)",
    longDescription: "Display all commands with emoji, auto-detect system",
    category: "system",
    guide: {
      en: "{p}help [command name]",
    },
  },

  onStart: async function ({ message, args }) {
    const cmdPath = path.join(__dirname, "../");
    const commandList = [];

    // auto-detect all commands
    fs.readdirSync(cmdPath).forEach(folder => {
      const folderPath = path.join(cmdPath, folder);
      if (fs.lstatSync(folderPath).isDirectory()) {
        fs.readdirSync(folderPath)
          .filter(f => f.endsWith(".js"))
          .forEach(f => {
            try {
              const cmdFile = require(path.join(folderPath, f));
              const name = cmdFile.config?.name || f.replace(".js", "");
              const cat = cmdFile.config?.category?.toLowerCase() || folder.toLowerCase();
              commandList.push({ name, category: cat });
            } catch {}
          });
      }
    });

    // Show single command info
    if (args[0]) {
      const cmd = commandList.find(c => c.name === args[0].toLowerCase());
      if (!cmd) return message.reply(`❌ | Command "${args[0]}" not found!`);
      const file = require(path.join(cmdPath, cmd.category, `${cmd.name}.js`));
      const info = file.config || {};
      const usage = info.guide?.en || "No usage info available";
      return message.reply(
`╭────『 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢 』────╮
│ 💫 NAME: ${info.name || cmd.name}
│ 📂 CATEGORY: ${info.category || cmd.category}
│ 💬 DESC: ${info.longDescription || info.shortDescription || "No description"}
│ ⚙️ USAGE: ${usage}
╰────────────────────────────╯`
      );
    }

    // Emoji map by category/command
    const emojiMap = {
      game: "🎮",
      quiz: "❓",
      image: "🖼️",
      system: "⚙️",
      utility: "📌",
      group: "👥",
      text: "💬",
      admin: "👑",
      ai: "🤖",
      fun: "🎭",
      islamic: "🕌",
      daily: "📅",
      media: "📺",
      owner: "🧠",
      other: "✨",
    };

    // Build full stylish list
    let menu = "╭────『 𝗕𝗢𝗧 𝗠𝗘𝗡𝗨 』────╮\n\n";
    commandList.forEach(cmd => {
      const emoji = emojiMap[cmd.category] || "🔹";
      menu += `${emoji} ${cmd.name}\n`;
    });

    menu += `\n💡 Type: .help <command>\nto see how to use it.\n╰────────────────────────────╯`;

    return message.reply(menu);
  },
};
