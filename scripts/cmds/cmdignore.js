const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "ignoreData.json");

// যদি file না থাকে, তৈরি হবে
if (!fs.existsSync(file)) fs.writeFileSync(file, "{}");

module.exports = {
  config: {
    name: "ignorecmd", // main command file name
    version: "1.0",
    author: "Helal Islam",
    role: 1, // admin only
    shortDescription: "Ignore or unignore users from bot commands",
    longDescription: "Manage ignore list for users 🚫",
    category: "moderation",
    guide: { en: "{p}cmdignore @user | {p}unignore @user" }
  },

  onStart: async function ({ event, message, args }) {
    try {
      const mentions = event.mentions || {};
      const mentionIDs = Object.keys(mentions);

      if (mentionIDs.length === 0)
        return message.reply("⚠️ | Mention a user!");

      const data = JSON.parse(fs.readFileSync(file));
      const targetID = mentionIDs[0];
      const targetName = mentions[targetID] || "Unknown";

      // command type check
      const cmd = args[0]?.toLowerCase() || ""; // first argument after prefix

      if (cmd === "unignore") {
        if (!data[targetID])
          return message.reply(`❌ | ${targetName} is not in ignore list!`);

        delete data[targetID];
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
        return message.reply(`✅ | ${targetName} has been unignored successfully!`);
      }

      // default: ignore
      if (data[targetID])
        return message.reply(`❌ | ${targetName} is already ignored!`);

      data[targetID] = { name: targetName, time: Date.now() };
      fs.writeFileSync(file, JSON.stringify(data, null, 2));

      return message.reply(`🚫 | ${targetName} has been ignored successfully!`);
    } catch (err) {
      console.error(err);
      return message.reply("❌ | Something went wrong!");
    }
  }
};
