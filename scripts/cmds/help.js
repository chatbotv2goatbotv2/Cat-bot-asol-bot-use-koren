const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "cmd", "commands"],
    version: "2.0",
    author: "Helal",
    role: 0,
    description: "Show all available commands or details of a specific one",
    category: "system",
    usage: ".help [command]",
  },

  onStart: async function ({ api, event, args, commandModules }) {
    const { threadID, messageID } = event;

    // command name check
    if (args[0]) {
      const cmdName = args[0].toLowerCase();
      const command = commandModules.get(cmdName);
      if (!command) return api.sendMessage(`❌ | Command "${cmdName}" not found!`, threadID, messageID);

      const info = command.config || {};
      const emoji = getEmoji(info.category);

      return api.sendMessage(
        `╭── ${emoji} ${info.name?.toUpperCase() || cmdName} ──╮\n` +
        `📘 Description: ${info.description || "No description"}\n` +
        `⚙️ Category: ${info.category || "Unknown"}\n` +
        `🧩 Usage: ${info.usage || ".help <command>"}\n` +
        `💫 Version: ${info.version || "1.0"}\n` +
        `╰────────────────────╯`,
        threadID,
        messageID
      );
    }

    // list all commands
    const categories = {};
    commandModules.forEach(cmd => {
      const cat = cmd.config.category || "Other";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd.config.name);
    });

    let msg = "╭──────『 𝗕𝗢𝗧 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗠𝗘𝗡𝗨 』──────╮\n\n";

    for (const [category, cmds] of Object.entries(categories)) {
      const emoji = getEmoji(category);
      msg += `╭── ${emoji} ${category.toUpperCase()} ──╮\n`;
      msg += cmds.map(c => `│ ${emoji} ${c}`).join("\n") + "\n";
      msg += "╰────────────────────╯\n\n";
    }

    msg += "💡 Type: `.help <command>` to view details.\n\n⚡ Powered by Helal";

    api.sendMessage(msg, threadID, messageID);
  },
};

function getEmoji(category) {
  category = category?.toLowerCase();
  if (category.includes("admin")) return "👑";
  if (category.includes("game")) return "🎮";
  if (category.includes("quiz")) return "❓";
  if (category.includes("image")) return "🖼️";
  if (category.includes("media")) return "🎵";
  if (category.includes("ai")) return "🤖";
  if (category.includes("system")) return "⚙️";
  if (category.includes("utility")) return "📌";
  if (category.includes("fun")) return "🎭";
  if (category.includes("info")) return "ℹ️";
  if (category.includes("love")) return "💖";
  if (category.includes("group")) return "👥";
  if (category.includes("islam")) return "🕌";
  if (category.includes("rank")) return "🏆";
  if (category.includes("tool")) return "🧰";
  return "💫";
}