const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "help",
    aliases: ["h"],
    version: "2.0",
    cooldown: 3,
    description: "Show all available commands or command usage details",
    category: "system",
  },

  onStart: async function ({ api, event, args, commandName, prefix }) {
    try {
      const cmdsDir = path.join(__dirname, ".."); 
      const categories = fs.readdirSync(cmdsDir);
      let allCommands = [];

      // Load all commands
      for (const category of categories) {
        const catPath = path.join(cmdsDir, category);
        if (fs.statSync(catPath).isDirectory()) {
          const files = fs.readdirSync(catPath).filter(f => f.endsWith(".js"));
          for (const file of files) {
            const cmd = require(path.join(catPath, file));
            if (cmd.config) {
              allCommands.push({
                name: cmd.config.name,
                desc: cmd.config.description || "No description",
                cat: cmd.config.category || category,
                usage: cmd.config.usage || "No usage info",
                role: cmd.config.role || "Everyone"
              });
            }
          }
        }
      }

      // If no argument -> show all command names
      if (!args[0]) {
        let msg = "✨ 𝗕𝗢𝗧 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧 ✨\n\n";
        const grouped = {};

        // Group by category
        for (const cmd of allCommands) {
          if (!grouped[cmd.cat]) grouped[cmd.cat] = [];
          grouped[cmd.cat].push(cmd.name);
        }

        for (const cat in grouped) {
          msg += `💠 ${cat.toUpperCase()}\n› ${grouped[cat].join(", ")}\n\n`;
        }

        msg += `💡 Type: ${prefix}help <command>\nTo see details of any command.`;
        return api.sendMessage(msg, event.threadID, event.messageID);
      }

      // If argument -> show specific command info
      const name = args[0].toLowerCase();
      const cmd = allCommands.find(c => c.name.toLowerCase() === name);
      if (!cmd)
        return api.sendMessage(`❌ | Command "${name}" not found!`, event.threadID, event.messageID);

      const styledMsg = `
╭───💫 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢 💫
│ 🧩 Name: ${cmd.name}
│ 💬 Description: ${cmd.desc}
│ ⚙️ Category: ${cmd.cat}
│ 📘 Usage: ${prefix}${cmd.name} ${cmd.usage}
│ 👑 Role: ${cmd.role}
│ 🔢 Version: ${cmd.version || "1.0"}
╰─────────────────────────✦`;

      api.sendMessage(styledMsg, event.threadID, event.messageID);

    } catch (err) {
      api.sendMessage(`❌ | Error in help command!\n${err.message}`, event.threadID, event.messageID);
    }
  },
};
