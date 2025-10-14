const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "imagine",
    aliases: [],
    version: "2.0",
    author: "Helal + GPT-5",
    countDown: 5,
    role: 0,
    shortDescription: "Generate 4 AI images from a single prompt",
    longDescription: "Use powerful AI to create 4 stunning images from your imagination.",
    category: "AI-IMAGE",
    guide: {
      en: "{pn} <prompt>\n\n📌 Example:\n{pn} a dragon flying over a castle\n{pn} a minecraft boy fighting zombie"
    }
  },

  onStart: async function ({ message, args }) {
    if (!args[0]) return message.reply("❗ Please provide a prompt.\n\nExample:\n/imagine a tiger with wings");

    const prompt = args.join(" ");
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    message.reply(`🧠 Generating 4 AI images for:\n✨ "${prompt}"\n\nPlease wait...`);

    try {
      // free public AI endpoint (auto style detection)
      const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

      const imagePromises = Array.from({ length: 4 }, async (_, i) => {
        const filePath = path.join(cacheDir, `imagine_${Date.now()}_${i}.jpg`);
        const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(filePath, response.data);
        return fs.createReadStream(filePath);
      });

      const images = await Promise.all(imagePromises);

      await message.reply({
        body: `🌺 Prompt: ${prompt}\n✅ AI Generated Images (4 Variants):`,
        attachment: images
      });

      // auto cleanup
      setTimeout(() => {
        images.forEach(img => {
          const fp = img.path;
          if (fs.existsSync(fp)) fs.unlinkSync(fp);
        });
      }, 10000);

    } catch (err) {
      console.error(err);
      return message.reply("❌ Failed to generate images. Please try again later.");
    }
  }
};
