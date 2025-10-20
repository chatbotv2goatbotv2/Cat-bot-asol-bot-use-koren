// show.js
// Show all commands by category (with /show all support)
// Author: Helal

const { commands } = global.GoatBot;

module.exports = {
  config: {
    name: "show",
    aliases: ["cmdlist", "category"],
    version: "2.0",
    author: "Helal",
    countDown: 5,
    role: 0,
    category: "system",
    shortDescription: { en: "Show commands by category or all" },
  },

  onStart: async function ({ message, args }) {
    try {
      if (!args[0]) {
        return message.reply(
          "⚙️ Usage:\n/show <category>\n/show all\n\nExample:\n/show game\n/show ai\n/show all"
        );
      }

      const inputCat = args.join(" ").trim().toUpperCase();
      const categories = {};

      for (const [name, cmd] of commands) {
        const cat = (cmd.config.category || "OTHER").toUpperCase();
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(name);
      }

      const emojiMap = {
        TEXT: "✨",
        TOOLS: "🧰",
        UTILITY: "🧩",
        WIKI: "📚",
        GAME: "🎮",
        SYSTEM: "⚙️",
        INFO: "📘",
        IMAGE: "🖼️",
        OWNER: "👑",
        OTHER: "📦",
        ADMIN: "🛠️",
        MUSIC: "🎵",
        AI: "🤖",
        "AI-IMAGE": "🧠",
        YOUTUBE: "📺",
        GOOGLE: "🌍",
        ECONOMY: "💰",
        SOCIAL: "💬",
        WEATHER: "🌦️",
        ISLAMIC: "🕌",
        CONFIG: "⚙️",
        CONTACT: "☎️",
        IDEA: "💡",
        CHAT: "💭",
        FUN: "🎉",
        MEDIA: "🖥️",
        VIDEO: "🎬",
        SECURITY: "🔒",
        SERVER: "🖧",
        EDUCATION: "🎓",
        ROLEPLAY: "🎭",
        STICKER: "🏷️",
        MEME: "😂",
        LOVE: "💖",
        MODERATION: "🚨",
        RANK: "📈",
        ANIME: "🌸",
        BOT: "🤖",
        SUPPORT: "🧩",
        DATABASE: "🗃️",
        DEVELOPER: "💻",
        NSFW: "🚫",
      };

      // if user typed /show all → show everything
      if (inputCat === "ALL") {
        let msg = "🌍 𝗔𝗟𝗟 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗜𝗘𝗦 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 🌍\n\n";
        for (const cat in categories) {
          const emoji = emojiMap[cat] || "📁";
          msg += `${emoji} ${cat}\n`;
          msg += categories[cat].map((c) => `⚡ ${c}`).join("\n");
          msg += "\n\n";
        }
        return message.reply(msg);
      }

      // single category show
      const found = categories[inputCat];
      if (!found) return message.reply(`❌ No commands found in category: ${inputCat}`);

      const emoji = emojiMap[inputCat] || "📁";
      const msg = `${emoji} Commands in category [${inputCat}]:\n\n${found
        .map((n) => `⚡ ${n}`)
        .join("\n")}`;

      return message.reply(msg);
    } catch (err) {
      console.error(err);
      return message.reply("❌ Error while listing commands.");
    }
  },
};