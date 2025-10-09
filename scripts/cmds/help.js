const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "help",
    aliases: ["menu"],
    version: "1.2",
    role: 0,
    shortDescription: "Show all bot commands",
    longDescription: "Stylish help command with category icons and usage info",
    category: "system",
    guide: {
      en: "{pn} or {pn} <command name>"
    }
  },

  onStart: async function ({ message, args, event }) {
    try {
      const commandsPath = path.join(__dirname, "..");
      const categories = {};
      const emojiMap = {
        game: "🎮",
        quiz: "❓",
        utility: "📌",
        image: "🖼️",
        info: "ℹ️",
        system: "⚙️",
        ai: "🤖",
        fun: "🎭",
        music: "🎵",
        tool: "🧰",
        social: "💬",
        group: "👥",
        admin: "👑",
        economy: "💰"
      };

      // Auto detect all commands
      fs.readdirSync(commandsPath).forEach(file => {
        if (!file.endsWith(".js")) return;
        const cmd = require(path.join(commandsPath, file));
        if (!cmd.config || !cmd.config.name) return;
        const category = cmd.config.category || "other";
        if (!categories[category]) categories[category] = [];
        categories[category].push(cmd.config);
      });

      // if command name provided
      if (args[0]) {
        const name = args[0].toLowerCase();
        const cmdFile = fs.readdirSync(commandsPath).find(f => f.startsWith(name + ".js"));
        if (!cmdFile) return message.reply(`❌ | Command "${name}" not found!`);
        const cmd = require(path.join(commandsPath, cmdFile));
        const e = emojiMap[cmd.config.category] || "✨";
        const usage = cmd.config.guide?.en || "No usage info";
        const desc = cmd.config.longDescription || cmd.config.shortDescription || "No description";
        return message.reply(
`╭──${e} ${cmd.config.name.toUpperCase()} ──╮
│ 💬 ${desc}
│ 📘 Usage: ${usage}
│ 🗂 Category: ${cmd.config.category || "other"}
│ 🔢 Version: ${cmd.config.version || "1.0"}
│ 👥 Role: ${cmd.config.role == 2 ? "Admin" : cmd.config.role == 1 ? "GroupAdmin" : "Everyone"}
╰───────────────────💫`
        );
      }

      // Show all commands
      let msg = "╭───✨ 𝗕𝗢𝗧 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 ✨───╮\n";
      for (const category in categories) {
        const e = emojiMap[category] || "📂";
        msg += `\n${e} ${category.toUpperCase()}\n`;
        categories[category].forEach(cmd => {
          msg += `  • ${cmd.name}\n`;
        });
      }
      msg += "\n💡 Use: .help <command> to view details\n╰────────────────────────💫";
      message.reply(msg);

    } catch (err) {
      console.error(err);
      message.reply("❌ | Error in help command!");
    }
  }
};