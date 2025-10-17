const axios = require("axios");

module.exports = {
  config: {
    name: "mc",
    aliases: ["mcstatus", "minecraft"],
    version: "3.5",
    author: "Helal Islam",
    shortDescription: "Auto detect Java, Bedrock & Geyser servers.",
    longDescription: "Detects if a Minecraft server is Java, Bedrock, or Geyser hybrid and shows player & version info.",
    category: "🎮 GAME",
    guide: "{pn}mc <server-ip> [port]"
  },

  onStart: async function ({ message, args, prefix }) {
    if (!args[0])
      return message.reply(`❌ Please provide the server IP.\n\n📌 Example:\n${prefix}mc play.hypixel.net`);

    const ip = args[0];
    const port = args[1] || 25565;

    message.reply(`🕹️ Checking Minecraft server 🌍`);

    try {
      // Try Java first
      const javaRes = await axios.get(`https://api.mcsrvstat.us/2/${ip}:${port}`);
      const j = javaRes.data;

      if (j && j.online) {
        let serverType = "Java Edition";

        // Check if Geyser or Floodgate keywords exist
        const motdText = (j.motd?.clean?.join(" ") || "").toLowerCase();
        if (motdText.includes("geyser") || motdText.includes("floodgate")) {
          serverType = "Java + Bedrock (Geyser Supported)";
        }

        return message.reply(
          `───[ ${serverType.toUpperCase()} ]──
👥 Players: ${j.players.online} / ${j.players.max}
⚙️ Version: ${j.version || "Unknown"}
━━━━━━━━━━━━━━━━━━━
Server is online ✅`
        );
      }

      // Try Bedrock API if Java failed
      const bedrockRes = await axios.get(`https://api.mcstatus.io/v2/status/bedrock/${ip}:${port}`);
      const b = bedrockRes.data;

      if (b && b.online) {
        return message.reply(
          `───[ BEDROCK SERVER STATUS ]──
👥 Players: ${b.players.online} / ${b.players.max}
⚙️ Version: ${b.version.name || "Unknown"}
━━━━━━━━━━━━━━━━━━━
Server is online✅`
        );
      }

      return message.reply(`❌ Server is offline.`);
    } catch (err) {
      console.error(err);
      return message.reply("❌ Server not found..");
    }
  }
};
