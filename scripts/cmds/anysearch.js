const yts = require("yt-search");
const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "anysearch",
    version: "5.0",
    author: "Helal Islam",
    category: "media",
    shortDescription: "Search and download YouTube videos",
    longDescription: "Search YouTube videos by keyword and download by replying with number.",
    guide: {
      en: "{p}anysearch <keywords>"
    }
  },

  onStart: async function ({ message, args, event }) {
    const query = args.join(" ");
    if (!query) return message.reply("🔍 Please enter something to search!");
    message.reply(`🎬 Searching YouTube for: ${query} ...`);

    try {
      const results = await yts(query);
      const videos = results.videos.slice(0, 5);

      if (!videos.length) return message.reply("❌ No results found!");

      let msg = "🎥 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗦𝗲𝗮𝗿𝗰𝗵 𝗥𝗲𝘀𝘂𝗹𝘁𝘀\n\n";
      videos.forEach((v, i) => {
        msg += `📀 ${i + 1}. ${v.title}\n👁️ ${v.views} views\n⏱️ ${v.timestamp}\n\n`;
      });
      msg += "🎯 Reply with number (1–5) to download that video.";

      const sent = await message.reply(msg);
      global.GoatBot.onReply.set(sent.messageID, {
        commandName: "anysearch",
        author: event.senderID,
        videos
      });
    } catch (e) {
      console.log(e);
      message.reply("⚠️ YouTube search failed! Try again later.");
    }
  },

  onReply: async function ({ message, event, Reply }) {
    if (event.senderID !== Reply.author) return;

    const choice = parseInt(event.body.trim());
    if (isNaN(choice) || choice < 1 || choice > Reply.videos.length)
      return message.reply("⚠️ Invalid choice! Type number 1–5.");

    const video = Reply.videos[choice - 1];
    const filePath = path.join(__dirname, `${video.videoId}.mp4`);

    message.reply(`⬇️ Downloading “${video.title}” ...`);

    try {
      const stream = ytdl(video.url, { filter: "audioandvideo", quality: "lowest" });
      const writer = fs.createWriteStream(filePath);
      stream.pipe(writer);

      writer.on("finish", async () => {
        try {
          await message.reply({
            body: `🎥 ${video.title}\n🔗 ${video.url}`,
            attachment: fs.createReadStream(filePath)
          });
        } catch {
          message.reply(`🎥 ${video.title}\n🔗 ${video.url}`);
        }
        fs.unlinkSync(filePath);
      });

      writer.on("error", (err) => {
        console.log(err);
        message.reply(`❌ Error saving video. Here’s the link:\n${video.url}`);
      });
    } catch (err) {
      console.log(err);
      message.reply(`❌ Download failed! Here’s the video link:\n${video.url}`);
    }
  }
};
