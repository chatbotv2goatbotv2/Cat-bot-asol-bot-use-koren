const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "help",
    aliases: ["menu"],
    version: "7.0",
    author: "Helal",
    description: "Show all available commands 🌺",
    category: "system",
  },

  onStart: async function ({ api, event }) {
    try {
      const cmdsPath = path.join(__dirname, "./");
      const files = fs.readdirSync(cmdsPath).filter(file => file.endsWith(".js"));

      let categories = {};

      // auto detect all command files
      for (const file of files) {
        try {
          const cmd = require(path.join(cmdsPath, file));
          const cat = cmd.config?.category?.toUpperCase() || "OTHER";
          const name = cmd.config?.name || file.replace(".js", "");
          if (!categories[cat]) categories[cat] = [];
          categories[cat].push(name);
        } catch (e) {}
      }

      let msg = "╭─────『 🌺 𝐂𝐀𝐓 𝐁𝐎𝐓 𝐌𝐄𝐍𝐔 🌺 』─────╮\n\n";

      // stylish category with emojis
      const catEmojis = {
        GAME: "🎮",
        GROUP: "👥",
        IMAGE: "🖼️",
        SYSTEM: "🧠",
        FUN: "🎭",
        MUSIC: "🎵",
        AI: "🤖",
        QUIZ: "❓",
        ADMIN: "👑",
        ECONOMY: "💰",
        ISLAMIC: "☪️",
        TOOLS: "🧰",
        MEDIA: "🎬",
        WIKI: "📘",
        UTILITY: "📌",
        OTHER: "🪅"
      };

      for (const category in categories) {
        const emoji = catEmojis[category] || "✨";
        msg += `            ${emoji} ${category} ${emoji}\n`;
        msg += categories[category].map(cmd => `🌺 ${cmd}`).join("\n") + "\n\n";
      }

      msg += "╰─────────────────────────────💫\n";

      // video link
      const videoUrl = "https://i.imgur.com/1lNzAqy.mp4";

      api.sendMessage(
        {
          body: msg,
          attachment: await global.utils.getStreamFromURL(videoUrl),
        },
        event.threadID
      );
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ | Failed to load help list.", event.threadID);
    }
  },
};
