const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "help",
    version: "7.0",
    description: "Show all commands by category in stylish emoji format",
    category: "system",
    usage: "[command name]",
  },

  onStart: async function ({ api, event, args, prefix }) {
    try {
      const baseDir = path.join(__dirname, "..");
      const allCommands = [];

      // Load all commands
      const folders = fs.readdirSync(baseDir);
      for (const folder of folders) {
        const folderPath = path.join(baseDir, folder);
        if (!fs.statSync(folderPath).isDirectory()) continue;
        const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".js"));
        for (const file of files) {
          try {
            const cmd = require(path.join(folderPath, file));
            if (cmd.config && cmd.config.name) {
              allCommands.push({
                name: cmd.config.name,
                cat: cmd.config.category?.toLowerCase() || "others",
                desc: cmd.config.description || "No description"
              });
            }
          } catch (e) { }
        }
      }

      // emoji for each category
      const catEmoji = {
        game: "🎮",
        quiz: "❓",
        fun: "🎭",
        utility: "📌",
        system: "⚙️",
        admin: "👑",
        image: "🖼️",
        info: "ℹ️",
        music: "🎵",
        ai: "🤖",
        group: "👥",
        moderation: "🚫",
        others: "✨"
      };

      // emoji for individual command names (example)
      const cmdEmoji = {
        mc: "🎮",
        ttt: "🎰",
        ping: "📡",
        uptime: "⏱️",
        guess: "🎯",
        quiz: "❓",
        flux: "🖼️",
        system: "🧰",
        accept: "✅",
        help: "📖",
        riddle: "🧠"
      };

      const byCat = {};
      for (const cmd of allCommands) {
        const cat = cmd.cat;
        if (!byCat[cat]) byCat[cat] = [];
        byCat[cat].push(cmd.name);
      }

      // specific command info
      if (args[0]) {
        const name = args[0].toLowerCase();
        const cmd = allCommands.find(c => c.name.toLowerCase() === name);
        if (!cmd) return api.sendMessage(`❌ | Command "${name}" not found!`, event.threadID);

        return api.sendMessage(
          `╭──────────────💫
│ 🧩 Name: ${cmd.name}
│ 💬 Description: ${cmd.desc}
│ ⚙️ Category: ${cmd.cat}
│ 📘 Usage: ${prefix}${cmd.name}
╰────────────────💫`,
          event.threadID
        );
      }

      // build message
      let msg = `╭──────『 𝗕𝗢𝗧 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗠𝗘𝗡𝗨 』──────╮\n`;

      const cats = Object.keys(byCat).sort();
      for (const cat of cats) {
        const emoji = catEmoji[cat] || "✨";
        msg += `\n╭──────${emoji} ${cat.toUpperCase()} ──────\n`;
        for (const cmd of byCat[cat]) {
          const e = cmdEmoji[cmd] || "🔹";
          msg += `│ ${e} ${cmd}\n`;
        }
        msg += `╰─────────────────────\n`;
      }

      msg += `\n💡 Type: ${prefix}help <command>\nTo view command details.`;

      return api.sendMessage(msg, event.threadID);
    } catch (err) {
      return api.sendMessage(`❌ | Error: ${err.message}`, event.threadID);
    }
  },
};
