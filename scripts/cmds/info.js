module.exports = {
  config: {
    name: "info",
    aliases: ["owner", "botinfo", "admin"],
    version: "6.9.3",
    author: "Helal",
    countDown: 0,
    role: 0,
    description: "Show Cat Bot owner and system info 🌺",
    category: "info",
    guide: {
      en: "{pn} — Show bot information and owner details."
    }
  },

  onStart: async function ({ api, event }) {
    // Uptime calculation
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const message = `
╭──────────────╮
│𝐎𝐰𝐧𝐞𝐫 & 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 🌺  │
╰──────────────╯
🤖 Name: CAT BOT
📜 Version: 2
👑 Owner: ♛ Helal Islam ♛
☪️ Religion: Islam 
🎂 Age: Private 
👷‍♂️ Job: Student 
❤️ Relation: No ❌
👬 Friendly: Yes ✅
📞 Whatsapp: Private 
🌍 Address: Jamalpur, Bangladesh
📅 Creation Date: 10/1/2025
🔌 Made in: Bangladesh 🇧🇩
💬 Prefix: /
💾 Commands Loaded: 142
🕒 Uptime: ${hours}h ${minutes}m ${seconds}s

💳 Facebook: @helal323
───────────────────

…...…,•’\`\`’•,•’\`\`’•,
…...…’•, \`’🌹’\` ,•’
...……... \`’•, ,•’,•’\`\`’•,•’\`\`’•,
,•’\`\`’•,•’\`\`’•,’•…’•, \`’🌹’\` ,•’
’•, \`’🌹’\` ,•’…..... \`’•, ,•’
.... \`’•, ,•’ ...
…...…,•’\`\`’•,•’\`\`’•, 
…...…’•, \`’🌹’\` ,•’ 
...……... \`’•, ,•'
`;

    api.sendMessage(message, event.threadID, event.messageID);
  }
};