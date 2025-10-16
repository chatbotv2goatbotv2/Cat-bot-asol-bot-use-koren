const axios = require("axios");

let recentResults = {};

module.exports = {
  config: {
    name: "search",
    version: "4.3",
    author: "Helal",
    category: "media",
    role: 0,
    shortDescription: "Search YouTube videos",
    longDescription: "Search YouTube and reply with a number to get only the video link.",
    guide: {
      en: "{pn} <query>\nExample: /search Minecraft funny moments"
    }
  },

  onStart: async function ({ message, args, event }) {
    const query = args.join(" ");
    if (!query)
      return message.reply("❗ Please enter a search term.\nExample: /search Minecraft funny moments");

    const api = `https://yt-api.eu.org/api/search?query=${encodeURIComponent(query)}`;

    try {
      message.reply(`🔍 Searching YouTube for: "${query}" ...`);

      const res = await axios.get(api);
      const data = res.data.data;

      if (!data || data.length === 0)
        return message.reply("❌ No results found!");

      const results = data.slice(0, 10);
      recentResults[event.threadID] = results;

      let msg = results
        .map(
          (v, i) =>
            `${i + 1}. 🎬 ${v.title}\n👤 ${v.channelTitle}\n⏱️ ${v.lengthText}\n👁️ ${v.viewCount}\n`
        )
        .join("\n");

      return message.reply({
        body: `✅ YouTube results for: "${query}"\n\n${msg}\n💬 Reply with a number (1–10) to get the video link only.`
      });

    } catch (err) {
      console.error(err);
      return message.reply("❌ Failed to search YouTube.");
    }
  },

  onReply: async function ({ message, event }) {
    const results = recentResults[event.threadID];
    if (!results) return;

    const index = parseInt(event.body);
    if (isNaN(index) || index < 1 || index > results.length)
      return message.reply("❌ Invalid number! (1–10)");

    const selected = results[index - 1];
    delete recentResults[event.threadID];

    // শুধু link পাঠাবে, অন্য কিছু না
    return message.reply(selected.url);
  }
};
