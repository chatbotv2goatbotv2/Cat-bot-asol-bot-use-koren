const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "commands"],
    version: "9.0",
    role: 0,
    shortDescription: "Show all available bot commands",
    longDescription: "Display all available commands and details in a stylish format",
    category: "system",
    guide: {
      en: "{p}help (command name)",
    },
  },

  onStart: async function ({ message, args, commandName }) {
    const cmdPath = path.join(__dirname, "../");
    const categories = {};

    // Auto detect all command folders
    fs.readdirSync(cmdPath).forEach(folder => {
      const folderPath = path.join(cmdPath, folder);
      if (fs.lstatSync(folderPath).isDirectory()) {
        const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".js"));
        if (files.length > 0) categories[folder] = files.map(f => f.replace(".js", ""));
      }
    });

    // Specific command info
    if (args[0]) {
      const findCommand = Object.entries(categories)
        .flatMap(([cat, cmds]) => cmds.map(c => ({ name: c, cat })))
        .find(c => c.name.toLowerCase() === args[0].toLowerCase());

      if (!findCommand) return message.reply(`❌ | Command "${args[0]}" not found!`);

      const cmdFile = require(path.join(cmdPath, findCommand.cat, `${findCommand.name}.js`));
      const info = cmdFile.config || {};
      const usage = info.guide?.en || "No usage info available";

      const details = `
╭──────『 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢 』──────╮
│ 💫 𝗡𝗔𝗠𝗘: ${info.name || findCommand.name}
│ 🧩 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗬: ${info.category || findCommand.cat}
│ 💬 𝗗𝗘𝗦𝗖: ${info.longDescription || info.shortDescription || "No description"}
│ ⚙️ 𝗨𝗦𝗔𝗚𝗘: ${usage}
╰────────────────────────────╯
`;
      return message.reply(details);
    }

    // Emoji for category
    const emojiMap = {
      admin: "👑",
      ai: "🤖",
      fun: "🎭",
      game: "🎮",
      system: "⚙️",
      image: "🖼️",
      group: "👥",
      music: "🎵",
      media: "📺",
      utility: "📌",
      text: "💬",
      custom: "✨",
      islamic: "🕌",
      owner: "🧠",
      other: "💡",
    };

    // Create menu list
    let menu = "╭──────『 𝗕𝗢𝗧 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗠𝗘𝗡𝗨 』──────╮\n\n";
    for (const [cat, cmds] of Object.entries(categories)) {
      const icon = emojiMap[cat.toLowerCase()] || "📁";
      menu += `╭──────${icon} ${cat.toUpperCase()} ──────\n`;
      cmds.forEach(cmd => (menu += `│ 🔹 ${cmd}\n`));
      menu += `╰─────────────────────\n\n`;
    }
    menu += "💡 Type: .help <command> to view details.";

    message.reply(menu);
  },
};
