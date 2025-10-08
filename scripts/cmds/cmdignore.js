const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "banData.json");

if (!fs.existsSync(file)) fs.writeFileSync(file, "{}");

module.exports = {
  config: {
    name: "cmdignore", // command name changed
    version: "1.0",
    author: "Helal Islam",
    role: 1, // admin only
    shortDescription: "Ignore a user from using bot commands",
    longDescription: "Add user to ignore list so they can’t use bot commands 🚫",
    category: "moderation",
    guide: { en: "{p}cmdignore @user" }
  },

  onStart: async function ({ event, message, usersData }) {
    const mentions = Object.keys(event.mentions);
    if (mentions.length === 0)
      return message.reply("⚠️ | Mention a user to ignore!");

    const data = JSON.parse(fs.readFileSync(file));
    const target = mentions[0];
    const name = event.mentions[target];

    if (data[target])
      return message.reply(`❌ | ${name} is already ignored!`);

    data[target] = { name, time: Date.now() };
    fs.writeFileSync(file, JSON.stringify(data, null, 2));

    message.reply(`🚫 | ${name} has been ignored successfully!`);
  }
};
