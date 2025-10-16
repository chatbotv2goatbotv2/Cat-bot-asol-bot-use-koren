const axios = require("axios");

module.exports = {
  config: {
    name: "search",
    version: "6.0",
    author: "Helal + GPT-5",
    role: 0,
    shortDescription: "Search YouTube videos (no key needed)",
    longDescription: "Search YouTube instantly without API key — reply with number to get the video link.",
    category: "YouTube",
    guide: {
      en: "{pn} <query>\nExample:\n{pn} Minecraft funny moments"
    }
  },

  onStart: async function ({ message, args, event }) {
    if (!args[0])
      return message.reply("❗ Type something to search.\nExample:\n/search Minecraft tutorial");

    const query = args.join(" ");
    await message.reply(`🔍 Searching YouTube for: "${query}" ...`);

    try {
      // free scraper (no api key)
      const response = await axios.get(`https://yt-api.eu.org/api/search?q=${encodeURIComponent(query)}`);
      const results = response.data?.data?.slice(0, 8);

      if (!results || results.length === 0)
        return message.reply("❌ No results found.");

      let msg = `🎬 YouTube Results for: "${query}"\n\n`;
      results.forEach((video, index) => {
        msg += `${index + 1}. ${video.title}\n`;
      });
      msg += `\n👉 Reply with a number (1-${results.length}) to get the link.`;

      const replyMsg = await message.reply(msg);

      global.GoatBot.onReply.set(replyMsg.messageID, {
        commandName: "search",
        author: event.senderID,
        messageID: replyMsg.messageID,
        results
      });
    } catch (e) {
      console.error(e);
      message.reply("❌ YouTube search failed. Try again later.");
    }
  },

  onReply: async function ({ event, api, Reply }) {
    if (event.senderID !== Reply.author) return;
    const choice = parseInt(event.body.trim());
    if (isNaN(choice) || choice < 1 || choice > Reply.results.length)
      return api.sendMessage("❌ Invalid number.", event.threadID);

    const video = Reply.results[choice - 1];
    const link = video.url || `https://www.youtube.com/watch?v=${video.videoId}`;
    return api.sendMessage(link, event.threadID, event.messageID);
  }
};
