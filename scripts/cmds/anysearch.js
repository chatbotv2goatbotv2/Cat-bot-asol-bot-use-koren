const axios = require("axios");

module.exports = {
  config: {
    name: "anysearch",
    version: "5.0",
    author: "Helal Islam",
    countDown: 5,
    role: 0,
    category: "media",
    shortDescription: "Search and select YouTube video",
    longDescription: "Search any YouTube video, view top 5 results, and reply with number to get the video link.",
    guide: {
      en: "{pn} <video name>"
    }
  },

  onStart: async function ({ message, args, event }) {
    const query = args.join(" ");
    if (!query) return message.reply("🔍 | Please type something to search!");

    try {
      message.reply(`⏳ | Searching for **${query}** on YouTube...`);

      const res = await axios.get(
        `https://ytsearch.youtubemusicdownloader.repl.co/search?query=${encodeURIComponent(query)}`
      );
      const results = res.data.videos?.slice(0, 5);

      if (!results || results.length === 0)
        return message.reply("❌ | No results found! Try another keyword.");

      let msg = `🌐 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗦𝗲𝗮𝗿𝗰𝗵 𝗥𝗲𝘀𝘂𝗹𝘁𝘀 🌐\n🔎 Keyword: ${query}\n\n`;
      for (let i = 0; i < results.length; i++) {
        const v = results[i];
        msg += `${i + 1}. 🎬 ${v.title}\n📺 ${v.channel}\n🕒 ${v.duration}\n\n`;
      }
      msg += `⚙️ Reply with a number (1–${results.length}) to get the video link 🎧`;

      message.reply(msg, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          author: event.senderID,
          results
        });
      });
    } catch (e) {
      console.error(e);
      message.reply("⚠️ | YouTube search failed! Please try again later.");
    }
  },

  onReply: async function ({ message, Reply, event }) {
    if (event.senderID !== Reply.author) return;
    const choice = parseInt(event.body.trim());

    if (isNaN(choice) || choice < 1 || choice > Reply.results.length)
      return message.reply("❌ | Invalid choice! Please choose a valid number.");

    const video = Reply.results[choice - 1];
    return message.reply({
      body: `🎬 ${video.title}\n📺 ${video.channel}\n🔗 ${video.url}`
    });
  }
};
