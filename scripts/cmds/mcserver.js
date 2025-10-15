const axios = require("axios");

module.exports = {
  config: {
    name: "server",
    aliases: ["mcstatus", "minecraft"],
    version: "2.0",
    author: "Helal Islam (animation fix by GPT-5)",
    shortDescription: "Check Minecraft server status with animated loading bar",
    longDescription: "Shows animated color-dot loading before displaying Minecraft server status",
    category: "🎮 GAME",
    guide: "{pn} <server ip> [port]"
  },

  onStart: async function ({ message, args }) {
    if (!args[0]) {
      return message.reply(
        "❌ Please provide the server IP.\n\n📌 Example:\n/server play.hypixel.net 25565"
      );
    }

    const ip = args[0];
    const port = args[1] || 25565;

    // Animation frames (exact order you wanted)
    const frames = [
      "⚪⚪⚪⚪⚪",
      "🟠⚪⚪⚪⚪",
      "🟠🟡⚪⚪⚪",
      "🟠🟡🔴⚪⚪",
      "🟠🟡🔴🔵⚪",
      "🟠🟡🔴🔵🟢"
    ];

    // Send first message
    let msg = await message.reply(`⏳ Checking server status for 🌐 ${ip}:${port}\n${frames[0]}`);

    // Play animation
    for (let i = 1; i < frames.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      try {
        await msg.edit(`⏳ Checking server status for 🌐 ${ip}:${port}\n${frames[i]}`);
      } catch (e) {
        break; // stop animation if message can't be edited
      }
    }

    // Fetch data after animation completes
    try {
      const res = await axios.get(`https://api.mcsrvstat.us/2/${ip}:${port}`);
      const data = res.data;

      if (!data || !data.online) {
        return msg.edit(`❌ Server 🌐 ${ip}:${port} is offline or unreachable.`);
      }

      // Detect Edition
      const edition = data.software
        ? data.software.includes("Bedrock")
          ? "Bedrock"
          : "Java"
        : "Auto (Possibly Geyser)";

      // Build result message
      const result = `🌍 𝗠𝗜𝗡𝗘𝗖𝗥𝗔𝗙𝗧 𝗦𝗘𝗥𝗩𝗘𝗥 𝗦𝗧𝗔𝗧𝗨𝗦\n━━━━━━━━━━━━━━━━\n` +
        `🟢 Online: ${data.players.online}/${data.players.max}\n` +
        `⚙️ Version: ${data.version || "N/A"}\n` +
        `🧩 Edition: ${edition}\n` +
        `💬 MOTD: ${data.motd?.clean?.join(" ") || "N/A"}\n` +
        `━━━━━━━━━━━━━━━━`;

      return msg.edit(result);
    } catch (err) {
      console.error(err);
      return msg.edit("❌ Error fetching server info. Please try again later.");
    }
  }
};
