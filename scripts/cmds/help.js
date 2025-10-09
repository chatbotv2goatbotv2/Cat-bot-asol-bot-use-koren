const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "help",
    aliases: ["menu"],
    version: "6.5",
    author: "Helal",
    description: "Shows all commands with clean style 🌺",
    category: "system"
  },

  onStart: async function ({ api, event }) {
    try {
      const cmdsPath = path.join(__dirname, "./");
      const files = fs.readdirSync(cmdsPath).filter(file => file.endsWith(".js"));

      let categories = {};

      for (const file of files) {
        try {
          const cmd = require(path.join(cmdsPath, file));
          const cat = cmd.config?.category?.toUpperCase() || "OTHER";
          const name = cmd.config?.name || file.replace(".js", "");
          if (!categories[cat]) categories[cat] = [];
          categories[cat].push(name);
        } catch (e) {}
      }

      let msg = "─────『 🌺 Cat Bot 🌺 』──────╮\n\n";

      for (const category in categories) {
        msg += `💫 ${category}\n`;
        const list = categories[category]
          .map(cmd => `🌺 ${cmd}`)
          .join("\n");
        msg += list + "\n\n";
      }

      msg += "╰─────────────────────💫";

      api.sendMessage(msg, event.threadID);
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ | Failed to load help list.", event.threadID);
    }
  }
};