const { createCanvas } = require("canvas");
const fs = require("fs");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "pc",
    version: "1.1",
    author: "Helal",
    role: 0,
    shortDescription: "Neon calendar with glowing square border + time & date",
    category: "utility",
  },

  onStart: async function ({ message }) {
    try {
      const now = moment().tz("Asia/Dhaka");
      const time = now.format("hh:mm:ss A"); // 12-hour format
      const date = now.format("dddd, MMMM Do YYYY");

      const width = 800;
      const height = 400;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Black background
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);

      // Neon square border
      const borderColor = "#00ffff";
      ctx.lineWidth = 15;
      ctx.shadowColor = borderColor;
      ctx.shadowBlur = 40;
      ctx.strokeStyle = borderColor;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      // Reset shadow for text
      ctx.shadowBlur = 0;

      // Neon text function
      function neonText(text, x, y, size, color) {
        ctx.font = `bold ${size}px Arial`;
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        ctx.shadowBlur = 0;
      }

      // Title
      neonText("📅 Neon Calendar", 260, 100, 50, "#00ffff");

      // Date
      neonText(date, 100, 200, 35, "#39ff14");

      // Time
      neonText(`🕒 Time: ${time}`, 240, 300, 45, "#ff1493");

      // Save image
      const buffer = canvas.toBuffer("image/png");
      const path = `${__dirname}/calendar.png`;
      fs.writeFileSync(path, buffer);

      // Send image with message
      message.reply(
        {
          body: `🗓️ Date: ${date}\n⏰ Time: ${time} (Asia/Dhaka)`,
          attachment: fs.createReadStream(path),
        },
        () => fs.unlinkSync(path)
      );
    } catch (err) {
      console.error(err);
      message.reply("⚠️ Failed to generate calendar image.");
    }
  },
};