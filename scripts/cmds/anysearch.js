const yts = require("yt-search");
const ytdl = require("@distube/ytdl-core");
const fs = require("fs");

module.exports = {
  config: {
    name: "anysearch",
    aliases: ["ytfind", "ytsearch"],
    version: "2.5",
    author: "Helal Islam",
    category: "media",
    shortDescription: "Search and download YouTube videos directly.",
    longDescription:
      "Search any YouTube video (Bangla or English) and reply with number to download directly.",
    guide: "{pn} <search query>",
  },

  onStart: async function ({ api, message, args, event }) {
    const query = args.join(" ");
    if (!query) return message.reply("⚠️ | Please enter a search term.");

    const searchResults = await yts(query);
    const videos = searchResults.videos.slice(0, 6);
    if (!videos.length)
      return message.reply("❌ | No results found on YouTube!");

    let msg = `🎬 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗦𝗲𝗮𝗿𝗰𝗵 𝗥𝗲𝘀𝘂𝗹𝘁𝘀\n\n`;
    videos.forEach(
      (v, i) =>
        (msg += `📀 ${i + 1}. ${v.title}\n👁️ ${v.views} views\n⏱️ ${v.timestamp}\n\n`)
    );
    msg += `🎯 Reply with the number (1-${videos.length}) to download.`;

    const sent = await message.reply(msg);

    const handleReply = async (replyEvent) => {
      if (replyEvent.senderID !== event.senderID) return;

      const index = parseInt(replyEvent.body) - 1;
      if (isNaN(index) || index < 0 || index >= videos.length)
        return message.reply("⚠️ Invalid number, try again!");

      const video = videos[index];
      message.reply(`⬇️ Downloading "${video.title}"... Please wait.`);

      try {
        const stream = ytdl(video.url, { filter: "audioandvideo", quality: "lowest" });
        const filePath = `./${video.videoId}.mp4`;

        stream.pipe(fs.createWriteStream(filePath));
        stream.on("end", () => {
          message.reply({
            body: `🎥 | ${video.title}\n🔗 ${video.url}`,
            attachment: fs.createReadStream(filePath),
          });
          fs.unlinkSync(filePath);
        });
      } catch (err) {
        console.error(err);
        message.reply("❌ | Failed to download the video!");
      }

      api.removeListener("message", handleReply);
    };

    api.on("message", handleReply);
  },
};
