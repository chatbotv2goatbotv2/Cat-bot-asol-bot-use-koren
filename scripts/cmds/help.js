const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "help",
    version: "3.5",
    cooldown: 3,
    description: "Show all commands or command details",
    category: "system",
    usage: "[command name]"
  },

  onStart: async function ({ api, event, args, commandName, prefix }) {
    try {
      const cmdsDir = path.join(__dirname, "..");
      let allCommands = [];

      const folders = fs.readdirSync(cmdsDir);
      for (const folder of folders) {
        const folderPath = path.join(cmdsDir, folder);
        if (!fs.statSync(folderPath).isDirectory()) continue;

        const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".js"));
        for (const file of files) {
          try {
            const cmd = require(path.join(folderPath, file));
            if (cmd.config && cmd.config.name) {
              allCommands.push({
                name: cmd.config.name,
                desc: cmd.config.description || "No description available",
                cat: cmd.config.category || folder,
                usage: cmd.config.usage || "No usage info",
                role: cmd.config.role || "Everyone",
                version: cmd.config.version || "1.0"
              });
            }
          } catch (e) {
            // Skip broken command files silently
            continue;
          }
        }
      }

      // No argument → show list
      if (!args[0]) {
        let msg = "🎛️ 𝗔𝗟𝗟 𝗔𝗩𝗔𝗜𝗟𝗔𝗕𝗟𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 🎛️\n\n";
        const byCat = {};

        for (const c of allCommands) {
          if (!byCat[c.cat]) byCat[c.cat] = [];
          byCat[c.cat].push(c.name);
        }

        for (const cat in byCat) {
          msg += `💠 ${cat.toUpperCase()}\n› ${byCat[cat].join(", ")}\n\n`;
        }

        msg += `💡 Type: ${prefix}help <command>\nTo see details of any command.`;
        return api.sendMessage(msg, event.threadID, event.messageID);
      }

      // With argument → show details
      const name = args[0].toLowerCase();
      const cmd = allCommands.find(c => c.name.toLowerCase() === name);
      if (!cmd)
        return api.sendMessage(`❌ | Command "${name}" not found!`, event.threadID, event.messageID);

      const info = `
╭───────────────💫
│ 🧩 𝗡𝗔𝗠𝗘: ${cmd.name}
│ 💬 𝗗𝗘𝗦𝗖: ${cmd.desc}
│ ⚙️ 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗬: ${cmd.cat}
│ 📘 𝗨𝗦𝗔𝗚𝗘: ${prefix}${cmd.name} ${cmd.usage}
│ 👑 𝗥𝗢𝗟𝗘: ${cmd.role}
│ 🔢 𝗩𝗘𝗥𝗦𝗜𝗢𝗡: ${cmd.version}
╰────────────────💫`;

      api.sendMessage(info, event.threadID, event.messageID);

    } catch (err) {
      api.sendMessage(`❌ | Help command crashed but auto-fixed!\n${err.message}`, event.threadID, event.messageID);
    }
  },
};
