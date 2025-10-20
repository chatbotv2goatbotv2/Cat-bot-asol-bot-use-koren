// see.js
// Show all commands or aliases found inside a command file
// Usage: /see <filename>
// Author: Helal

const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "see",
    aliases: ["checkcmd", "sc"],
    version: "1.0",
    author: "Helal",
    countDown: 3,
    role: 0,
    category: "system",
    shortDescription: { en: "See all commands available inside a file" }
  },

  onStart: async function ({ message, args }) {
    try {
      if (!args[0])
        return message.reply("⚙️ Usage: /see <filename>\nExample: /see help");

      const fname = args[0].trim();
      const filePath = path.join(__dirname, fname + ".js");

      if (!fs.existsSync(filePath))
        return message.reply(`❌ File not found: ${fname}.js`);

      const content = fs.readFileSync(filePath, "utf8");

      // Find all command names & aliases
      const nameMatch = content.match(/name:\s*["'`](.*?)["'`]/);
      const aliasMatch = content.match(/aliases:\s*\[(.*?)\]/);

      let result = `✨ Commands found in [${fname}.js]\n\n`;

      if (nameMatch) result += `💠 Main Command: /${nameMatch[1]}\n`;
      if (aliasMatch) {
        const aliases = aliasMatch[1]
          .split(",")
          .map(a => a.replace(/["'`\s]/g, "").trim())
          .filter(a => a);
        if (aliases.length > 0) {
          result += "\n🎯 Aliases:\n";
          aliases.forEach((a, i) => {
            result += ` ${i + 1}. ⚡ /${a}\n`;
          });
        }
      }

      result += `\n🧠 Author: Helal\n✅ File: ${fname}.js`;

      return message.reply(result);
    } catch (err) {
      console.error(err);
      message.reply("❌ Error reading the file.");
    }
  }
};