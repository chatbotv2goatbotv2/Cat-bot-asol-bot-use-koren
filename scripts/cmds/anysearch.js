const yts = require('yt-search');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "anysearch",
    aliases: ["ytsearch", "yts"],
    version: "2.0",
    author: "Helal Islam",
    countDown: 5,
    role: 0,
    shortDescription: "Search & play YouTube videos",
    longDescription: "Search YouTube videos and download selected one by replying with number.",
    category: "media",
    guide: {
      en: "{pn} <video name>"
    }
  },

  onStart: async function ({ message, args, event, api }) {
    if (!args[0]) return message.reply("🔎 | Please type something to search on YouTube!");
    const query = args.join(" ");
    message.reply(`🔍 Searching for "${query}"...`);

    try {
      const r = await yts(query);
      const videos = r.videos.slice(0, 6);
      if (videos.length === 0) return message.reply("❌ | No results found!");

      let resultMsg = "🎬 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗦𝗲𝗮𝗿𝗰𝗵 𝗥𝗲𝘀𝘂𝗹𝘁𝘀\n\n";
      for (let i = 0; i < videos.length; i++) {
        resultMsg += `📀 ${i + 1}. ${videos[i].title}\n👁️ ${videos[i].views} views\n⏱️ ${videos[i].timestamp}\n\n`;
      }
      resultMsg += "🎯 Reply with the number (1–6) to download.";

      const sent = await message.reply(resultMsg);
      global.client.handleReply.push({
        name: this.config.name,
        messageID: sent.messageID,
        author: event.senderID,
        videos
      });
    } catch (err) {
      console.error(err);
      message.reply("⚠️ | YouTube search failed! Please try again later.");
    }
  },

  onReply: async function ({ event, api, handleReply, message }) {
    try {
      if (event.senderID !== handleReply.author) return;
      const choice = parseInt(event.body);
      if (isNaN(choice) || choice < 1 || choice > handleReply.videos.length)
        return message.reply("⚠️ | Please reply with a valid number!");

      const video = handleReply.videos[choice - 1];
      const filePath = path.join(__dirname, "cache", `${Date.now()}.mp4`);
      message.reply(`⏳ | Downloading: ${video.title}`);

      const stream = ytdl(video.url, { filter: 'audioandvideo', quality: 'lowest' })
        .pipe(fs.createWriteStream(filePath));

      stream.on('finish', () => {
        message.reply({
          body: `🎥 | ${video.title}\n🔗 ${video.url}`,
          attachment: fs.createReadStream(filePath)
        }, () => fs.unlinkSync(filePath));
      });

      stream.on('error', (err) => {
        console.error(err);
        message.reply("❌ | Failed to download this video!");
      });
    } catch (e) {
      console.error(e);
      message.reply("❌ | Error while processing video!");
    }
  }
};
