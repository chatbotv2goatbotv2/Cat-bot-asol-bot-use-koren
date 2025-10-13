const fs = require("fs-extra");
const path = require("path");
const https = require("https");
const { getPrefix } = global.utils;
const { commands } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    aliases: ["menu"],
    version: "2.0",
    author: "Helal",
    countDown: 10,
    role: 0,
    category: "system",
    shortDescription: { en: "Shows all commands with video 🌺" },
  },

  onStart: async function ({ message, args, event }) {
    const videoURL = "https://i.imgur.com/nGM34ds.mp4"; // তোমার video link
    const cacheDir = path.join(__dirname, "cache");
    const videoPath = path.join(cacheDir, "help_video.mp4");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    // Cache video once
    if (!fs.existsSync(videoPath)) await downloadFile(videoURL, videoPath);

    const categories = {};
    for (const [name, value] of commands) {
      const category = value.config.category?.toUpperCase() || "OTHER";
      if (!categories[category]) categories[category] = [];
      categories[category].push(name);
    }

    // Styled output
    let msg = "🌺 ⌬⌬ 𝐂𝐚𝐭 𝐁𝐨𝐭 ⌬⌬ 🌺\n───────────────\n\n";

    const emojiMap = {
      GAME: "🎮 𝗚𝗔𝗠𝗘",
      SOCIAL: "📷 𝗦𝗢𝗖𝗜𝗔𝗟",
      SYSTEM: "⚙️ 𝗦𝗬𝗦𝗧𝗘𝗠",
      INFO: "📘 𝗜𝗡𝗙𝗢 ",
      OTHER: "🧩 𝗢𝗧𝗛𝗘𝗥",
    };

    for (const cat in categories) {
      msg += `${emojiMap[cat] || cat}\n`;
      categories[cat].forEach((cmd, i) => {
        msg += `${i + 1}️⃣ ${cmd}\n`;
      });
      msg += "\n";
    }

    const totalCommands = commands.size;
    msg += "───────────────\n";
    msg += `🌸 Total Commands: ${totalCommands}\n🎬 Do you love💖`;

    return message.reply({
      body: msg,
      attachment: fs.createReadStream(videoPath),
    });
  },
};

// Download helper
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
