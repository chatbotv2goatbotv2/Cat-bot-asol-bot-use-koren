const yts = require("yt-search");
const ytdl = require("@distube/ytdl-core");
const fs = require("fs");

module.exports = {
  config: {
    name: "anysearch",
    aliases: ["ytfind", "ytsearch"],
    version: "3.5",
    author: "Helal Islam",
    category: "media",
    shortDescription: "Search & download YouTube videos.",
    longDescription: "Search YouTube (Bangla/English) & download by reply number.",
    guide: "{pn}anysearch <keywords>",
  },

  onStart: async function ({ message, args, event, commandName }) {
    const query = args.join(" ");
    if (!query) return message.reply("⚠️ | Please provide a search query!");

    try {
      const results = await yts(query);
      const videos = results.videos.slice(0, 5);
      if (!videos.length) return message.reply("❌ | No results found!");

      let msg = "🎬 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗦𝗲𝗮𝗿𝗰𝗵 𝗥𝗲𝘀𝘂𝗹𝘁𝘀\n\n";
      videos.forEach((v, i) => {
        msg += `📀 ${i + 1}. ${v.title}\n👁️ ${v.views} views\n⏱️ ${v.timestamp}\n\n`;
      });
      msg += `🎯 Reply with number (1–${videos.length}) to download 🎧`;

      const sent = await message.reply(msg);

      global.GoatBot.onReply.set(sent.messageID, {
        commandName,
        author: event.senderID,
        videos,
      });
    } catch (e) {
      console.error(e);
      return message.reply("❌ | YouTube search failed!");
    }
  },

  onReply: async function ({ message, event, Reply }) {
    if (event.senderID !== Reply.author) return;

    const index = parseInt(event.body) - 1;
    if (isNaN(index) || index < 0 || index >= Reply.videos.length)
      return message.reply("⚠️ | Invalid number! Try again.");

    const video = Reply.videos[index];
    const filePath = `./${video.videoId}.mp4`;

    message.reply(`⬇️ Downloading “${video.title}” ...`);

    try {
      const stream = ytdl(video.url, { filter: "audioandvideo", quality: "lowest" });
      const writeStream = fs.createWriteStream(filePath);
      stream.pipe(writeStream);

      writeStream.on("finish", () => {
        message.reply({
          body: `🎥 | ${video.title}\n🔗 ${video.url}`,
          attachment: fs.createReadStream(filePath),
        });
        fs.unlinkSync(filePath);
      });
    } catch (err) {
      console.error(err);
      message.reply("❌ | Failed to download video!");
    }
  },
};
