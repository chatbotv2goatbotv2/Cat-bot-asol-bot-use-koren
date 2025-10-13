const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "commands"],
    version: "5.0",
    author: "Helal x GPT-5",
    description: "Show all available commands with category and video",
    category: "settings"
  },

  onStart: async function ({ api, event }) {
    try {
      const cmdsPath = path.join(__dirname, "./");
      const files = fs.readdirSync(cmdsPath).filter(f => f.endsWith(".js"));

      let categories = {};

      for (const file of files) {
        try {
          const cmd = require(path.join(cmdsPath, file));
          const cat = (cmd.config?.category || "OTHER").toUpperCase();
          const name = cmd.config?.name || file.replace(".js", "");
          if (!categories[cat]) categories[cat] = [];
          categories[cat].push(name);
        } catch (e) {}
      }

      const catEmojis = {
        SETTINGS: "⚙️",
        GAME: "🎮",
        FUN: "🎭",
        IMAGE: "🖼️",
        QUIZ: "🧩",
        SOCIAL: "💬",
        ADMIN: "👑",
        TOOLS: "🧰",
        MUSIC: "🎵",
        AI: "🤖",
        ANIME: "🌸",
        ECONOMY: "💰",
        INFO: "📚",
        SEARCH: "🔍",
        UTILITY: "🪄",
        OTHER: "✨"
      };

      let msg = "╭──〔 🌺 𝗕𝗢𝗧 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 𝗠𝗘𝗡𝗨 🌺 〕──╮\n\n";

      for (const cat in categories) {
        const emoji = catEmojis[cat] || "✨";
        msg += ` ${emoji} ${cat}\n`;
        msg += categories[cat].map(n => `   🌺 ${n}`).join("\n");
        msg += "\n\n";
      }

      msg += "╰──────────────────────────────╯\n";
      msg += "🎬 Watch the demo video below ⬇️";

      const videoUrl = "https://i.imgur.com/nGM34ds.mp4";

      // Send help list + video
      api.sendMessage(
        {
          body: msg,
          attachment: await global.utils.getStreamFromURL(videoUrl)
        },
        event.threadID
      );
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ | Failed to load help list.", event.threadID);
    }
  }
};
