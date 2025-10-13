const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "help",
    aliases: ["menu"],
    version: "7.0",
    author: "Helal",
    description: "Shows all commands with video and categories 🌺",
    category: "system"
  },

  onStart: async function ({ api, event }) {
    try {
      // 📂 Command folder path
      const cmdsPath = path.join(__dirname, "./");
      const files = fs.readdirSync(cmdsPath).filter(f => f.endsWith(".js"));

      // 🗂️ Create category list
      let categories = {};
      for (const file of files) {
        try {
          const cmd = require(path.join(cmdsPath, file));
          const cat = cmd.config?.category?.toUpperCase() || "OTHER";
          const name = cmd.config?.name || file.replace(".js", "");
          if (!categories[cat]) categories[cat] = [];
          categories[cat].push(name);
        } catch (e) {}
      }

      // 🌸 Make message
      let msg = "╭──〔 🌺 𝗕𝗢𝗧 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 🌺 〕──╮\n\n";

      const emojiMap = {
        SYSTEM: "⚙️",
        GAME: "🎮",
        QUIZ: "🧩",
        IMAGE: "🖼️",
        ADMIN: "👑",
        SOCIAL: "💬",
        MUSIC: "🎵",
        AI: "🤖",
        INFO: "📚",
        UTILITY: "📌",
        OTHER: "✨"
      };

      for (const cat in categories) {
        const emoji = emojiMap[cat] || "🌺";
        msg += `${emoji} ${cat}\n`;
        msg += categories[cat].map(c => `   🌺 ${c}`).join("\n") + "\n\n";
      }

      msg += "╰──────────────────────────────╯\n🎬 Watch the demo video below ⬇️";

      // 🎥 Video link (Imgur mp4)
      const videoLink = "https://i.imgur.com/nGM34ds.mp4";

      api.sendMessage(
        {
          body: msg,
          attachment: await global.utils.getStreamFromURL(videoLink)
        },
        event.threadID
      );
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ | Failed to load help list.", event.threadID);
    }
  }
};
