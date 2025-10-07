const axios = require("axios");

module.exports = {
  config: {
    name: "anysearch",
    aliases: ["ytsearch", "yts"],
    version: "4.0",
    author: "Helal Islam",
    shortDescription: "Search and play YouTube videos.",
    longDescription: "Search any video on YouTube and play the one you select by replying with the number.",
    category: "media",
    guide: "{pn} <video name>",
  },

  onStart: async function ({ message, args, event }) {
    const query = args.join(" ");
    if (!query) return message.reply("🔍 | Please enter something to search on YouTube.");

    message.reply(`⏳ | Searching for **${query}** ...`);

    try {
      const res = await axios.get(
        `https://yt-api-delta.vercel.app/api/search?query=${encodeURIComponent(query)}`
      );
      const results = res.data.results?.slice(0, 5);

      if (!results || results.length === 0)
        return message.reply("❌ | No results found, try another keyword!");

      let text = `🌌 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗦𝗲𝗮𝗿𝗰𝗵 𝗥𝗲𝘀𝘂𝗹𝘁𝘀 🌌\n🔎 Keyword: ${query}\n\n`;
      for (let i = 0; i < results.length; i++) {
        const v = results[i];
        text += `${i + 1}. 🎬 ${v.title}\n📺 ${v.channel}\n🕒 ${v.duration}\n\n`;
      }
      text += `Reply with the video number (1-${results.length}) to get that video 🎧`;

      message.reply(text, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          author: event.senderID,
          messageID: info.messageID,
          results,
        });
      });
    } catch (e) {
      console.log(e);
      message.reply("⚠️ | Error fetching YouTube results.");
    }
  },

  onReply: async function ({ message, Reply, event }) {
    if (event.senderID !== Reply.author) return;
    const choice = parseInt(event.body.trim());

    if (isNaN(choice) || choice < 1 || choice > Reply.results.length)
      return message.reply("❌ | Invalid number. Choose from 1–5.");

    const video = Reply.results[choice - 1];
    message.reply({
      body: `🎬 ${video.title}\n📺 ${video.channel}\n🔗 ${video.url}`,
    });
  },
};
