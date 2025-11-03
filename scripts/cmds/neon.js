const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  let step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.closePath();
  ctx.stroke();
}

function drawDiamond(ctx, cx, cy, width, height) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - height / 2);
  ctx.lineTo(cx + width / 2, cy);
  ctx.lineTo(cx, cy + height / 2);
  ctx.lineTo(cx - width / 2, cy);
  ctx.closePath();
  ctx.stroke();
}

function drawRose(ctx, cx, cy, size) {
  // Simple rose petals like loops - artistic neon rose effect
  ctx.lineWidth = 6;
  ctx.shadowColor = ctx.strokeStyle;
  ctx.shadowBlur = 25;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    let angle = (i * Math.PI) / 3;
    let x1 = cx + Math.cos(angle) * size * 0.5;
    let y1 = cy + Math.sin(angle) * size * 0.5;
    let x2 = cx + Math.cos(angle + Math.PI / 6) * size;
    let y2 = cy + Math.sin(angle + Math.PI / 6) * size;
    ctx.moveTo(cx, cy);
    ctx.bezierCurveTo(x1, y1, x2, y2, cx, cy);
  }
  ctx.stroke();
}

module.exports = {
  config: {
    name: "neon",
    version: "1.2",
    author: "Helal",
    category: "image",
    shortDescription: "Add neon glow shapes or text to photo",
    guide: "/neon <type> <color> [text] (reply to a photo)",
  },

  onStart: async function ({ event, message, args }) {
    try {
      if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
        return message.reply("❌ Please reply to a photo.");
      }

      let type = (args[0] || "circle").toLowerCase();
      let color = args[1] || "#00ffff";
      let text = args.slice(2).join(" ") || "NEON";

      const validTypes = [
        "circle",
        "square",
        "triangle",
        "diamond",
        "star",
        "text",
        "rose"
      ];

      if (!validTypes.includes(type)) {
        return message.reply("❌ Invalid type! Use one of: " + validTypes.join(", "));
      }

      const url = event.messageReply.attachments[0].url;
      const img = await loadImage(url);

      const canvas = createCanvas(img.width, img.height);
      const ctx = canvas.getContext("2d");

      // Draw original image
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Setup neon glow styles
      ctx.lineWidth = 15;
      ctx.shadowColor = color;
      ctx.shadowBlur = 30;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.font = `${Math.floor(img.height / 6)}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const centerX = img.width / 2;
      const centerY = img.height / 2;
      const padding = 25;
      const size = Math.min(centerX, centerY) - padding;

      // Draw shapes/text according to type
      switch (type) {
        case "circle":
          ctx.beginPath();
          ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
          ctx.stroke();
          break;
        case "square":
          ctx.strokeRect(centerX - size, centerY - size, size * 2, size * 2);
          break;
        case "triangle":
          ctx.beginPath();
          ctx.moveTo(centerX, centerY - size);
          ctx.lineTo(centerX - size, centerY + size);
          ctx.lineTo(centerX + size, centerY + size);
          ctx.closePath();
          ctx.stroke();
          break;
        case "diamond":
          drawDiamond(ctx, centerX, centerY, size * 2, size * 1.5);
          break;
        case "star":
          drawStar(ctx, centerX, centerY, 5, size, size / 2.5);
          break;
        case "text":
          ctx.fillText(text, centerX, centerY);
          ctx.strokeText(text, centerX, centerY);
          break;
        case "rose":
          drawRose(ctx, centerX, centerY, size);
          break;
      }

      // Save image and send
      const outPath = path.join(__dirname, "neon_output.png");
      fs.writeFileSync(outPath, canvas.toBuffer());

      return message.reply({
        body: `✨ Neon ${type} glow added with color ${color}${type === "text" ? ` and text "${text}"` : ""}`,
        attachment: fs.createReadStream(outPath),
      });

    } catch (err) {
      console.error(err);
      return message.reply("❌ Error processing image.");
    }
  },
};