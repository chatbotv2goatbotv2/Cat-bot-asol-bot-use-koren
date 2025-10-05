const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "help",
  version: "6.0",
  author: "Helal Islam",
  credits: "Helal Islam",
  role: 0,
  countDown: 5,
  shortDescription: "Show all available commands",
  longDescription: "Auto-detect all bot commands and display them in a stylish digital menu",
  category: "system",
  guide: {
    en: "{pn}"
  }
};

module.exports.run = async function ({ api, event }) {
  try {
    const commandsPath = path.join(__dirname, "/");
    const files = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js") && file !== "help.js");

    let commandNames = [];
    for (const file of files) {
      try {
        const cmd = require(path.join(commandsPath, file));
        if (cmd.config && cmd.config.name) commandNames.push(cmd.config.name);
      } catch (err) {
        console.log(`⚠️ Error loading: ${file}`);
      }
    }

    commandNames.sort();

    let menuList = "";
    for (const name of commandNames) {
      menuList += `⚡ ${name}\n`;
    }

    const msg = `
╭━━━━━━━━━━━━━━━━━━━━━━━╮
   ⚡ DIGITAL AI MENU ⚡
╰━━━━━━━━━━━━━━━━━━━━━━━╯

💠 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀 💠

${menuList || "❌ No commands found!"}

━━━━━━━━━━━━━━━━━━━━━━━
⚙️ Developed by: Helal Islam  
🚀 Powered by: Digital AI System  
━━━━━━━━━━━━━━━━━━━━━━━
💫 Prefix: ( . ) | Version: 6.0  
━━━━━━━━━━━━━━━━━━━━━━━
`;

    return api.sendMessage(msg, event.threadID, event.messageID);
  } catch (e) {
    console.error(e);
    return api.sendMessage("❌ Error loading commands list!", event.threadID);
  }
};
