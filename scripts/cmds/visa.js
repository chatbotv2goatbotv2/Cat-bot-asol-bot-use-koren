const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "visa",
    version: "1.0",
    author: "Helal",
    role: 0,
    shortDescription: "Generate real-like Visa card image with user name",
    category: "image",
    countDown: 3,
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const senderID = event.senderID;
      let name = args.join(" ");
      if (!name) {
        const userInfo = await api.getUserInfo(senderID);
        name = userInfo[senderID]?.name || "USER NAME";
      }
      name = name.toUpperCase();

      const width = 856;
      const height = 540;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Background gradient similar to real Visa card
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#1a237e");
      grad.addColorStop(1, "#283593");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Add card chip image (simple silver rectangle with lines)
      ctx.fillStyle = "#d6d6d6";
      ctx.strokeStyle = "#aaa";
      ctx.lineWidth = 2;
      const chipX = 60;
      const chipY = 140;
      const chipWidth = 140;
      const chipHeight = 90;
      ctx.fillRect(chipX, chipY, chipWidth, chipHeight);

      // Chip inner vertical lines
      ctx.strokeStyle = "#999";
      for (let i = 0; i <= 5; i++) {
        let x = chipX + i * (chipWidth / 5);
        ctx.beginPath();
        ctx.moveTo(x, chipY);
        ctx.lineTo(x, chipY + chipHeight);
        ctx.stroke();
      }

      // Card Number - dummy but formatted like real card
      ctx.fillStyle = "#fff";
      ctx.font = "bold 42px Arial";
      ctx.fillText("**** **** **** 1234", 230, 230);

      // Cardholder Name
      ctx.font = "28px Arial";
      ctx.fillText(name, 230, 310);

      // Valid Thru Text
      ctx.font = "20px Arial";
      ctx.fillStyle = "#ddd";
      ctx.fillText("VALID THRU", 230, 365);

      // Expiry Date
      ctx.fillStyle = "#fff";
      ctx.font = "28px Arial";
      ctx.fillText("12/29", 370, 365);

      // Visa logo (use text with font weight and color)
      ctx.font = "bold 70px Arial";
      ctx.fillStyle = "#fdb913"; // Visa yellow
      ctx.fillText("VISA", width - 200, height - 80);

      // Rounded corners mask (optional)
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      const radius = 30;
      ctx.moveTo(radius, 0);
      ctx.lineTo(width - radius, 0);
      ctx.quadraticCurveTo(width, 0, width, radius);
      ctx.lineTo(width, height - radius);
      ctx.quadraticCurveTo(width, height, width - radius, height);
      ctx.lineTo(radius, height);
      ctx.quadraticCurveTo(0, height, 0, height - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.fill();

      // Save image buffer
      const buffer = canvas.toBuffer("image/png");
      const filePath = path.join(__dirname, "visa_card.png");
      fs.writeFileSync(filePath, buffer);

      await message.reply({
        body: `💳 Visa card generated for ${name}`,
        attachment: fs.createReadStream(filePath),
      });

      // Delete temp file
      fs.unlinkSync(filePath);

    } catch (e) {
      console.error(e);
      message.reply("❌ Failed to generate Visa card.");
    }
  }
};