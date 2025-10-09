const yts = require("yt-search");

module.exports = {
  config: {
    name: "anysearch",
    aliases: ["ytsearch", "yts"],
    version: "1.0",
    author: "Helal",
    category: "media",
    shortDescription: "Search YouTube and send links",
    longDescription: "Search YouTube videos & reply number to show link.",
    guide: "{pn}anysearch <keywords>"
  },

  onStart: async function ({ message, args, event }) {
    const query = args.join(" ");
    if (!query) return message.reply("🔍 | Need search query!");

    message.reply(`🔎 Searching YouTube for: ${query}`);

    try {
      const res = await yts(query);
      const videos = res.videos.slice(0, 5);
      if (!videos.length) return message.reply("❌ | No results found!");

      let msg = "🎥 YouTube Search Results\n\n";
      videos.forEach((v, i) => {
        msg += `${i + 1}. ${v.title}\n🔗 ${v.url}\n\n`;
      });
      msg += `➡️ Reply with the number (1–${videos.length}) to see link.`;

      const sent = await message.reply(msg);
      global.GoatBot.onReply.set(sent.messageID, {
        commandName: this.config.name,
        author: event.senderID,
        videos
      });
    } catch (e) {
      console.log(e);
      message.reply("⚠️ | Search failed!");
    }
  },

  onReply: async function ({ message, event, Reply }) {
    if (event.senderID !== Reply.author) return;

    const num = parseInt(event.body.trim());
    if (isNaN(num) || num < 1 || num > Reply.videos.length) {
      return message.reply("⚠️ | Invalid number! Try again.");
    }

    const video = Reply.videos[num - 1];
    return message.reply(`🎬 ${${video.url}`);
  }
};
