// Minecraft Server Status Command
// Author: Helal don't change credit

const axios = require("axios");

module.exports = {
  config: {
    name: "mc",
    aliases: ["mcstatus", "minecraft"],
    version: "4.0",
    author: "Helal",
    shortDescription: "Show Minecraft server status with player list.",
    longDescription: "Checks Java/Bedrock Minecraft servers and displays player info beautifully.",
    category: "game",
    guide: "{pn}mc <server-ip>"
  },

  onStart: async function ({ message, args }) {
    if (!args[0]) return message.reply("❌ Usage: /mc <server-ip>\nExample: /mc play.hypixel.net");

    const ip = args[0];
    message.reply("⏳ Checking Minecraft server status...");

    try {
      const res = await axios.get(`https://api.mcsrvstat.us/2/${ip}`);
      const data = res.data;

      if (!data.online) return message.reply("❌ Server is offline or unreachable.");

      const players = data.players?.list || [];
      const emojiNums = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];
      const playerList = players
        .slice(0, 10)
        .map((p, i) => `${emojiNums[i]} ${p}`)
        .join("\n") || "😴 No players online.";

      const msg = `
🟢 Minecraft Server is Online!

🌍 IP: ${ip}
🏓 Ping: ${data.debug.ping ? data.debug.ping + " ms" : "N/A"}
🧩 Version: ${data.version || "Unknown"}
📜 MOTD: ${data.motd?.clean?.join(" ") || "N/A"}
👥 Players: ${data.players?.online || 0} / ${data.players?.max || 0}

🎮 Online Players (Top 10):
${playerList}

🖼️ Icon: ${data.icon ? "✅ Available" : "❌ Not found"}
━━━━━━━━━━━━━━━━━━━━━━
👑 Coded by Helal
`;

      return message.reply(msg);
    } catch (err) {
      console.error(err);
      return message.reply("❌ Could not fetch server info. Try again later.");
    }
  }
};