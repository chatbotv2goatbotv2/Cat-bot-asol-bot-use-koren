const fs = require("fs-extra");
const path = require("path");
const https = require("https");
const { commands } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    aliases: ["menu"],
    version: "2.2",
    author: "Helal",
    countDown: 5,
    role: 0,
    category: "system",
    shortDescription: { en: "Show all commands by category with emoji 🌺" },
  },

  onStart: async function ({ message }) {
    const videoURL = "https://i.imgur.com/nGM34ds.mp4"; // তোমার ভিডিও লিংক
    const cacheDir = path.join(__dirname, "cache");
    const videoPath = path.join(cacheDir, "help_video.mp4");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    if (!fs.existsSync(videoPath)) await downloadFile(videoURL, videoPath);

    // Category-wise grouping
    const categories = {};
    for (const [name, value] of commands) {
      const cat = value.config.category?.toUpperCase() || "OTHER";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(name);
    }

    // Emoji per category
    const emojiMap = {
      GAME: "🎮",
      SOCIAL: "💬",
      SYSTEM: "⚙️",
      INFO: "📘",
      OTHER: "🧩",
    };

    // Build message
    let msg = "🌺 ⌬⌬ 𝐂𝐚𝐭 𝐁𝐨𝐭 ⌬⌬ 🌺\n───────────────\n\n";

    for (const cat in categories) {
      const catEmoji = emojiMap[cat] || "🌟";
      msg += `${catEmoji} 𝗛𝗘𝗔𝗗𝗜𝗡𝗚 ${catEmoji}\n`; // category title line
      categories[cat].forEach((cmd) => {
        msg += `${catEmoji} ${cmd}\n`;
      });
      msg += "\n";
    }

    msg += "───────────────\n";
    msg += `🌸 Total Commands: ${commands.size}\n🎬 Video Below 👇`;

    // Send with attachment
    return message.reply({
      body: msg,
      attachment: fs.createReadStream(videoPath),
    });
  },
};

// Downloader helper
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", reject);
  });
}
