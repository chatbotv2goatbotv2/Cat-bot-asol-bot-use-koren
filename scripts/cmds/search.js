const axios = require("axios");

module.exports = {
  config: {
    name: "search",
    version: "5.0",
    author: "Helal + GPT-5",
    role: 0,
    shortDescription: "Search YouTube videos (no API key needed)",
    longDescription: "Find YouTube videos instantly and reply with number to get link.",
    category: "YouTube",
    guide: {
      en: "{pn} <query>\nExample:\n{pn} Minecraft tutorial"
    }
  },

  onStart: async function ({ message, args, event }) {
    if (!args[0]) return message.reply("❗ Please provide something to search.\nExample:\n/search Minecraft funny moments");

    const query = args.join(" ");
    message.reply(`🔍 Searching YouTube for: "${query}"...`);

    try {
      // YouTube search without API key (scraping endpoint)
      const res = await axios.get(`https://ytsearch-api.vercel.app/search?query=${encodeURIComponent(query)}`);
      const results = res.data.videos?.slice(0, 8);

      if (!results || results.length === 0) {
        return message.reply("❌ No results found.");
      }

      let text = `🔎 YouTube Search Results for: "${query}"\n\n`;
      results.forEach((v, i) => {
        text += `${i + 1}. ${v.title}\n`;
      });
      text += `\n👉 Reply with the number (1-${results.length}) to get the link.`;

      const msg = await message.reply(text);

      // Save reply session
      global.GoatBot.onReply.set(msg.messageID, {
        commandName: "search",
        author: event.senderID,
        messageID: msg.messageID,
        results
      });

    } catch (err) {
      console.error(err);
      message.reply("❌ Failed to fetch YouTube results. Try again later.");
    }
  },

  onReply: async function ({ event, api, Reply }) {
    if (event.senderID !== Reply.author) return;
    const choice = parseInt(event.body.trim());
    if (isNaN(choice) || choice < 1 || choice > Reply.results.length)
      return api.sendMessage("❌ Invalid choice.", event.threadID);

    const video = Reply.results[choice - 1];
    const videoLink = video.url || `https://www.youtube.com/watch?v=${video.videoId}`;

    return api.sendMessage(videoLink, event.threadID, event.messageID);
  }
};
