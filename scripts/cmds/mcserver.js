const axios = require("axios");

module.exports = {
  config: {
    name: "server",
    aliases: ["mc", "mcstatus"],
    version: "2.0",
    author: "Helal",
    shortDescription: "Check Minecraft server status with animation",
    longDescription: "Shows loading animation before displaying full Minecraft server info",
    category: "🎮 GAME",
    guide: "{pn} <IP> [PORT]"
  },

  onStart: async function ({ message, args }) {
    if (!args[0])
      return message.reply("❌ Please provide a server IP.\n\n📌 Example:\n/server play.hypixel.net 25565");

    const ip = args[0];
    const port = args[1] || 25565;

    // Initial loading animation
    const steps = ["⚪⚪⚪⚪⚪", "🟠⚪⚪⚪⚪", "🟠🟡⚪⚪⚪", "🟠🟡🔴⚪⚪", "🟠🟡🔴🔵⚪", "🟠🟡🔴🔵🟢"];
    let msg = await message.reply(`⏳ Checking Minecraft server...\n${steps[0]}`);

    // Animate loading dots
    for (let i = 1; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      try {
        await message.edit(msg.messageID, `⏳ Checking Minecraft server...\n${steps[i]}`);
      } catch (e) {}
    }

    try {
      const res = await axios.get(`https://api.mcsrvstat.us/2/${ip}:${port}`);
      const data = res.data;

      if (!data || !data.online) {
        return message.edit(msg.messageID, `❌ Server ${ip}:${port} is offline or unreachable.`);
      }

      const onlinePlayers = data.players?.online || 0;
      const maxPlayers = data.players?.max || "Unknown";
      const version = data.version || "Unknown";
      const edition = data.software?.includes("Bedrock") ? "Bedrock" : "Java";

      const replyMsg = `🌍 𝗠𝗜𝗡𝗘𝗖𝗥𝗔𝗙𝗧 𝗦𝗘𝗥𝗩𝗘𝗥 𝗦𝗧𝗔𝗧𝗨𝗦
━━━━━━━━━━━━━━━━
🟢 Online: ${onlinePlayers}/${maxPlayers}
⚙️ Version: ${version}
🧩 Edition: ${edition}
💬 MOTD: ${data.motd?.clean?.join(" ") || "N/A"}
━━━━━━━━━━━━━━━━`;

      await message.edit(msg.messageID, replyMsg);
    } catch (err) {
      console.error(err);
      await message.edit(msg.messageID, "❌ Error fetching server info. Check IP/Port.");
    }
  }
};
