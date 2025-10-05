const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "fm",
    aliases: ["members", "faces"],
    version: "3.5",
    author: "Creator: Helal Islam",
    shortDescription: "Show group members profile photos in neon styled collage.",
    longDescription: "Displays all group members' profile pictures in neon glowing circular frames (Admin Red, Top Blue, Members Purple).",
    category: "group",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, message }) {
    const threadID = event.threadID;
    const threadInfo = await api.getThreadInfo(threadID);
    const participants = threadInfo.participantIDs || [];
    const admins = threadInfo.adminIDs.map(a => a.id);

    message.reply("🪄 Generating Neon Member Collage... Please wait 🌌");

    const canvasSize = 1500;
    const avatarSize = 130;
    const gap = 25;
    const canvas = createCanvas(canvasSize, canvasSize);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    let x = gap;
    let y = gap;
    let count = 0;

    for (const uid of participants) {
      try {
        const url = `https://graph.facebook.com/${uid}/picture?height=200&width=200&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        const img = await loadImage(url);

        // Detect member type
        const isAdmin = admins.includes(uid);
        const color = isAdmin ? "#ff1e1e" : count < 5 ? "#00bfff" : "#a020f0";

        // Round avatar
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + avatarSize / 2, y + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, x, y, avatarSize, avatarSize);
        ctx.restore();

        // Neon border
        ctx.strokeStyle = color;
        ctx.lineWidth = 8;
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(x + avatarSize / 2, y + avatarSize / 2, avatarSize / 2 + 3, 0, Math.PI * 2, true);
        ctx.stroke();

        x += avatarSize + gap;
        if (x + avatarSize > canvasSize) {
          x = gap;
          y += avatarSize + gap;
        }
        count++;
      } catch (err) {
        continue;
      }
    }

    const outPath = path.join(__dirname, "fm_neon.png");
    const out = fs.createWriteStream(outPath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on("finish", () => {
      message.reply({
        body: "🌌 𝗡𝗲𝗼𝗻 𝗚𝗿𝗼𝘂𝗽 𝗠𝗲𝗺𝗯𝗲𝗿𝘀 𝗟𝗶𝘀𝘁 🌌\n👑 Developed by: Helal Islam\n🚀 Digital AI System",
        attachment: fs.createReadStream(outPath)
      });
    });
  }
};
