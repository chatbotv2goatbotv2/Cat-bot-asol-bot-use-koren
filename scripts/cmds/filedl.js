const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "filedl",
    aliases: ["deletefile", "removefile"],
    version: "1.0",
    author: "Helal Islam",
    shortDescription: "Delete a specific command file from the bot system.",
    longDescription: "Permanently delete any command file from the GoatBot commands folder.",
    category: "owner",
    guide: "{pn} <filename.js>"
  },

  onStart: async function ({ message, args }) {
    if (!args[0]) return message.reply("⚠️ Please type the file name!\nExample: .filedl help.js");

    const fileName = args[0];
    const filePath = path.join(__dirname, `${fileName}`);

    // Confirm if file exists
    if (!fs.existsSync(filePath)) {
      return message.reply(`❌ File not found: ${fileName}`);
    }

    try {
      fs.unlinkSync(filePath);
      message.reply(`✅ File deleted successfully!\n🗑️ Removed: ${fileName}`);
    } catch (err) {
      message.reply(`❌ Error while deleting file:\n${err.message}`);
    }
  }
};
