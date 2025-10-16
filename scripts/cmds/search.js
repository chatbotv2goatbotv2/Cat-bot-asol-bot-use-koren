const axios = require("axios");

module.exports = {
  config: {
    name: "search",
    version: "2.0",
    author: "Helal + GPT-5",
    role: 0,
    shortDescription: "Search YouTube videos",
    longDescription: "Find top YouTube videos and get direct video links by replying with the number.",
    category: "MEDIA",
    guide: "{pn} <keywords>"
  },

  onStart: async function ({ message, args, commandName }) {
    if (!args[0]) return message.reply(`❗ Use like:\n/${commandName} minecraft songs`);
    const query = args.join(" ");
    message.reply(`🔎 Searching YouTube for: "${query}" ...`);

    try {
      const res = await axios.get(`https://yt-search.vercel.app/search?query=${encodeURIComponent(query)}`);
      const results = res.data.videos.slice(0, 8);

      if (!results || results.length === 0) {
        return message.reply("❌ No results found. Try another keyword.");
      }

      let replyText = `✅ YouTube results for: "${query}"\n\n`;
      results.forEach((v, i) => {
        replyText += `${i + 1}. 🎬 ${v.title}\n👤 ${v.author.name}\n⏱️ ${v.duration}\n👁️ ${v.views} views\n\n`;
      });
      replyText += `💬 Reply with a number (1–${results.length}) to get the video link.`;

      const msg = await message.reply(replyText);

      // Wait for reply from same user
      message.replyListener = async (event) => {
        if (event.senderID !== message.senderID) return;
        const num = parseInt(event.body);
        if (isNaN(num) || num < 1 || num > results.length) return;

        const link = results[num - 1].url;
        message.reply(link); // ✅ Only pure link
      };
    } catch (err) {
      console.error(err);
      message.reply("❌ Failed to search YouTube. Please try again later.");
    }
  }
};
