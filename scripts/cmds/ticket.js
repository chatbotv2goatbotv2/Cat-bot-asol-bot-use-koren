const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");

module.exports = {
  config: {
    name: "ticket",
    version: "1.3",
    author: "Helal",
    countDown: 3,
    role: 0,
    shortDescription: "Generate real-life style Windows 10 ticket with user profile photo",
    category: "utility",
    guide: "{pn} <bus|train|plane>"
  },

  onStart: async function ({ api, event, args, message }) {
    const threadID = event.threadID;
    const senderID = event.senderID;
    const type = args[0] ? args[0].toLowerCase() : null;

    if (!type || !["bus", "train", "plane"].includes(type)) {
      return message.reply("❌ Please specify ticket type: bus, train, or plane\nUsage: /ticket bus");
    }

    try {
      // Get user info
      const userInfo = await api.getUserInfo(senderID);
      const userName = userInfo[senderID]?.name || "Unknown User";

      // Try to fetch user avatar more reliably via Facebook graph with axios
      let avatarBuffer;
      try {
        // Get actual image as buffer to confirm it's valid
        const avatarUrl = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&redirect=false`;
        const response = await axios.get(avatarUrl);
        const avatarLink = response.data.data.url;

        // Download avatar image buffer
        const imageResp = await axios.get(avatarLink, { responseType: "arraybuffer" });
        avatarBuffer = Buffer.from(imageResp.data, "binary");
      } catch (e) {
        avatarBuffer = null;
      }

      // Load avatar or fallback
      let avatar;
      if (avatarBuffer) {
        avatar = await loadImage(avatarBuffer);
      } else {
        avatar = await loadImage("https://i.imgur.com/4fJ6oFj.png"); // fallback avatar image
      }

      // Canvas dimensions
      const width = 900;
      const height = 400;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Background gradient - Windows 10 style dark theme
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#141414");
      gradient.addColorStop(1, "#0f0f0f");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Outer neon border glow
      ctx.shadowColor = "#00a8ff";
      ctx.shadowBlur = 25;
      ctx.strokeStyle = "#00a8ff";
      ctx.lineWidth = 8;
      ctx.strokeRect(10, 10, width - 20, height - 20);
      ctx.shadowBlur = 0;

      // Header bar (blue)
      ctx.fillStyle = "#0078d7";
      ctx.fillRect(0, 0, width, 70);

      ctx.font = "bold 30px Segoe UI";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText("🎟️ Premium Ticket - Windows 10 Edition 🎟️", width / 2, 45);

      // Dotted perforation line vertical middle
      ctx.strokeStyle = "#00a8ff";
      ctx.lineWidth = 3;
      ctx.setLineDash([15, 15]);
      ctx.beginPath();
      ctx.moveTo(width / 2, 80);
      ctx.lineTo(width / 2, height - 20);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw user avatar circle left side
      const avatarSize = 160;
      const avatarX = 80;
      const avatarY = height / 2 - avatarSize / 2 + 10;

      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
      ctx.restore();

      // Neon ring around avatar
      ctx.beginPath();
      ctx.shadowColor = "#00a8ff";
      ctx.shadowBlur = 18;
      ctx.strokeStyle = "#00a8ff";
      ctx.lineWidth = 7;
      ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Ticket info area (right side)
      ctx.textAlign = "left";

      // Passenger name
      ctx.fillStyle = "#00a8ff";
      ctx.font = "24px Segoe UI";
      ctx.fillText("Passenger Name:", width / 2 + 40, 110);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 32px Segoe UI";
      ctx.fillText(userName, width / 2 + 40, 150);

      // Ticket type
      ctx.fillStyle = "#00a8ff";
      ctx.font = "24px Segoe UI";
      ctx.fillText("Ticket Type:", width / 2 + 40, 190);
      ctx.fillStyle = "#fff";
      ctx.font = "28px Segoe UI";
      ctx.fillText(type.charAt(0).toUpperCase() + type.slice(1), width / 2 + 40, 230);

      // Date & time
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-GB");
      const timeStr = now.toLocaleTimeString("en-GB", { hour12: false });

      ctx.fillStyle = "#00a8ff";
      ctx.font = "24px Segoe UI";
      ctx.fillText("Date:", width / 2 + 40, 270);
      ctx.fillStyle = "#fff";
      ctx.fillText(dateStr, width / 2 + 110, 270);

      ctx.fillStyle = "#00a8ff";
      ctx.fillText("Time:", width / 2 + 40, 310);
      ctx.fillStyle = "#fff";
      ctx.fillText(timeStr, width / 2 + 110, 310);

      // Seat number (random)
      const seatNum = `S-${Math.floor(Math.random() * 50) + 1}`;
      ctx.fillStyle = "#00a8ff";
      ctx.fillText("Seat No:", width / 2 + 40, 350);
      ctx.fillStyle = "#fff";
      ctx.fillText(seatNum, width / 2 + 130, 350);

      // Ticket number (random)
      const ticketNum = `TKT${Math.floor(100000 + Math.random() * 900000)}`;
      ctx.fillStyle = "#00a8ff";
      ctx.fillText("Ticket No:", width / 2 + 40, 390);
      ctx.fillStyle = "#fff";
      ctx.fillText(ticketNum, width / 2 + 150, 390);

      // Barcode pattern on right edge (vertical lines)
      const barX = width - 65;
      const barY = 80;
      const barHeight = height - 110;
      for (let i = 0; i < 60; i++) {
        ctx.fillStyle = i % 2 === 0 ? "#00a8ff" : "#005f8c";
        ctx.fillRect(barX, barY + i * 5, 18, 4);
      }

      // Save & send image
      const buffer = canvas.toBuffer("image/png");
      const imagePath = path.join(__dirname, "ticket.png");
      fs.writeFileSync(imagePath, buffer);

      await message.reply({
        body: "🎫 Your premium Windows 10 style ticket is ready! Safe travels!",
        attachment: fs.createReadStream(imagePath)
      });

      fs.unlinkSync(imagePath);

    } catch (error) {
      console.error("Ticket generation error:", error);
      message.reply("❌ Error generating ticket image. Please try again later.");
    }
  }
};