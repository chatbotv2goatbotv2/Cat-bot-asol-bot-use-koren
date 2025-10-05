const axios = require("axios");

module.exports = {
  config: {
    name: "mc",
    aliases: ["mcstatus", "minecraft"],
    version: "1.1",
    author: "Helal Islam",
    shortDescription: "Check Minecraft server status in fancy style.",
    longDescription: "Fetches full Minecraft server info with stylish emoji header/footer.",
    category: "🎮 GAME",
    guide: "{pn}mc <IP> [PORT]"
  },

  onStart: async function ({ message, args, prefix }) {
    if (!args[0]) return message.reply(`❌ Please provide the server IP.\n\n📌 Example:\n${prefix}mc play.hypixel.net 25565`);

    const ip = args[0];
    const port = args[1] || 25565;

    message.reply(`⏳ Checking Minecraft server status for 🌐 ${ip}:${port} ...`);

    try {
      const res = await axios.get(`https://api.mcsrvstat.us/2/${ip}:${port}`);
      const data = res.data;

      if (!data || !data.online) {
        return message.reply(`❌ Server 🌐 ${ip}:${port} is offline or unreachable.`);
      }

      let replyMsg = `🌌 𝗠𝗜𝗡𝗘𝗖𝗥𝗔𝗙𝗧 𝗦𝗧𝗔𝗧𝗨𝗦 🌌\n━━━━━━━━━━━━━━━━\n`;
      replyMsg += `│ 🌐 Server: ${data.hostname || ip}\n`;
      replyMsg += `│ 🖥️ IP: ${data.ip || ip}\n`;
      replyMsg += `│ 🔌 Port: ${data.port || port}\n`;
      replyMsg += `│ 👥 Online: ${data.players.online} / ${data.players.max}\n`;
      replyMsg += `│ 🛠️ Version: ${data.version}\n`;
      replyMsg += `│ 💬 MOTD: ${data.motd?.clean?.join(" ") || "N/A"}\n`;
      replyMsg += `│ 🖧 Software: ${data.software || "Unknown"}\n`;
      replyMsg += `│ 📡 Protocol: ${data.protocol || "N/A"}\n`;
      replyMsg += `━━━━━━━━━━━━━━━━\n`;
      replyMsg += `👑 Developed by: Helal Islam\n`;
      replyMsg += `🚀 Powered by: Digital AI System\n`;
      replyMsg += `Prefix: ${prefix} | Version: 1.1\n`;
      replyMsg += `━━━━━━━━━━━━━━━━`;

      return message.reply(replyMsg);

    } catch (err) {
      console.error(err);
      return message.reply("❌ Error fetching server info. Make sure the IP/Port is correct.");
    }
  }
};
