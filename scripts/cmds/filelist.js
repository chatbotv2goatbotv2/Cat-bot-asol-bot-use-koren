const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "filelist",
    version: "2.0",
    author: "Helal Islam",
    shortDescription: "Show all bot command files in a stylish way.",
    longDescription: "Lists all available command files from the bot folder with emoji and design.",
    category: "owner",
    guide: "{pn}filelist"
  },

  onStart: async function ({ message }) {
    try {
      const baseDir = path.join(__dirname, "../");
      let result = "🌌✨ 𝗗𝗜𝗚𝗜𝗧𝗔𝗟 𝗔𝗜 𝗙𝗜𝗟𝗘 𝗠𝗘𝗡𝗨 ✨🌌\n\n";

      const getFiles = (dir, files = []) => {
        const items = fs.readdirSync(dir);
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) getFiles(fullPath, files);
          else if (item.endsWith(".js"))
            files.push(fullPath.replace(baseDir, "").replace(/\\/g, "/"));
        }
        return files;
      };

      const files = getFiles(baseDir);
      if (files.length === 0) return message.reply("❌ No files found!");

      result += files.map(f => `⚡ ${f}`).join("\n");
      result += `\n\n👑 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗕𝘆: 𝗛𝗲𝗹𝗮𝗹 𝗜𝘀𝗹𝗮𝗺 ⚡`;

      message.reply(result);
    } catch (err) {
      message.reply("💀 Error showing files!");
      console.error(err);
    }
  }
};
