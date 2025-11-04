module.exports = {
  config: {
    name: "info",
    aliases: ["owner", "botinfo", "admin"],
    version: "6.9.0",
    author: "Helal",
    countDown: 0,
    role: 0,
    description: "Show Cat Bot owner and system info 🌺",
    category: "info",
    guide: {
      en: "{pn} — Show bot information and owner details."
    }
  },

  onStart: async function ({ api, event, global, client }) {
    // Safe command count
    const commandCount =
      (global?.GoatBot?.commands?.size ||
       client?.commands?.size ||
       142);

    // Bot uptime calculation
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const message = `
╭──────────────╮
│𝐎𝐰𝐧𝐞𝐫 & 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 🌺  │
╰──────────────╯
🤖 Name: 𝐂𝐀𝐓 𝐁𝐎𝐓
📜 Version: 2
👑 Owner: ♛𝐇𝐞𝐥𝐚𝐥 𝐈𝐬𝐥𝐚𝐦♛
☪️ Religion: Islam 
🥳 Birthday :  Private 
🎂 Age : private 
👨‍🎓 Education: Private 
👷‍♂️ Job : Student 
❤️ Relation : No ❌
👬 Friendly : Yes ✅
👨‍🚒 Bad : As for you
📞 Whatsapp : private 
☎️ Number : private
🌍 Current address : Jamalpur 
📅 Creation Date : 10/1/2025
🗺️ Address : Jamalpur,Bangladesh
🔌 Made in : Bangladesh 🇧🇩
💬 Prefix : /
💾 Commands Loaded: ${commandCount}
🕒 Uptime: ${hours}h ${minutes}m ${seconds}s
───────────────────
🌐 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤:61580156099497
💳 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤:@helal323
───────────────────
24/7 𝐁𝐨𝐭       
…...…,•’``’•,•’``’•,
…...…’•,`’🌹’` ,•’
...……...`’•, ,•’,•’``’•,•’``’•,
,•’``’•,•’``’•,’•…’•,`’🌹’` ,•’
’•,`’🌹’` ,•’….....`’•, ,•’
....`’•, ,•’ ...
…...…,•’``’•,•’``’•, 
…...…’•,`’🌹’` ,•’
...……...`’•, ,•’
───────────────────
💖 Thanks for using me 💖
   I'm Always Free 😀
`;

    api.sendMessage(message, event.threadID, event.messageID);
  }
};