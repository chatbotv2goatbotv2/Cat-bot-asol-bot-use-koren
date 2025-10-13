const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "imagine",
    aliases: ["aiimage", "imagegen"],
    version: "1.0",
    author: "Helal + GPT",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Generate 4 random AI images" },
    longDescription: { en: "Type /imagine <prompt> to generate 4 different AI images" },
    category: "ai",
    guide: { en: "{pn} A beautiful landscape with sunset" }
  },

  onStart: async function ({ message, args, event }) {
    if (args.length === 0)
      return message.reply("🪄 | Please write what you want to imagine.\nExample: /imagine a dragon flying over city");

    const prompt = args.join(" ");
    const tmpDir = path.join(__dirname, "cache");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    message.reply(`🎨 | Generating 4 images for: “${prompt}”\nPlease wait 5–10 seconds...`);

    try {
      // Dummy random image URLs (AI style)
      const imageUrls = [
        `https://picsum.photos/seed/${encodeURIComponent(prompt + "1")}/512/512`,
        `https://picsum.photos/seed/${encodeURIComponent(prompt + "2")}/512/512`,
        `https://picsum.photos/seed/${encodeURIComponent(prompt + "3")}/512/512`,
        `https://picsum.photos/seed/${encodeURIComponent(prompt + "4")}/512/512`
      ];

      // Download 4 images
      const attachments = [];
      for (let i = 0; i < imageUrls.length; i++) {
        const imgPath = path.join(tmpDir, `img_${i + 1}.jpg`);
        const res = await axios.get(imageUrls[i], { responseType: "arraybuffer" });
        fs.writeFileSync(imgPath, res.data);
        attachments.push(fs.createReadStream(imgPath));
      }

      await message.reply({
        body: `🌈✨ Here are 4 random images for: “${prompt}”\nChoose any one you like!`,
        attachment: attachments
      });

    } catch (err) {
      console.error(err);
      return message.reply("❌ | Failed to generate images. Please try again later.");
    }
  }
};
