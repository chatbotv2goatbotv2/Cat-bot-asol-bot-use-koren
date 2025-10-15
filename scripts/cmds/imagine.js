const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "imagine",
    version: "5.2",
    author: "Helal + GPT-5",
    role: 0,
    shortDescription: "Generate 4 unique AI design versions",
    longDescription: "Creates 4 AI variations like Bing Image Generator — different styles, lighting, and moods.",
    category: "AI-IMAGE",
    guide: {
      en: "{pn} <prompt>\n\nExample:\n{pn} Make a gaming logo"
    }
  },

  onStart: async function ({ message, args }) {
    if (!args[0]) return message.reply("❗ Please provide a prompt.\n\nExample:\n/imagine futuristic warrior logo");

    const prompt = args.join(" ");
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const variations = [
      `${prompt}, modern minimalist style, flat vector, clean geometric design`,
      `${prompt}, 3D rendered, neon lights, glowing edges, futuristic vibe`,
      `${prompt}, detailed digital painting, fantasy theme, soft lighting`,
      `${prompt}, cyberpunk style, dark tone, neon highlights, cinematic`
    ];

    message.reply(`🎨 Creating 4 AI image variations for:\n"${prompt}"\nPlease wait 10–25 seconds...`);

    try {
      // Using new StableDiffusion API (Free mirror)
      const imagePromises = variations.map(async (v, i) => {
        const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(v)}?width=512&height=512&n=1`;
        const filePath = path.join(cacheDir, `ai_${Date.now()}_${i}.jpg`);
        const res = await axios.get(apiUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(filePath, res.data);
        return fs.createReadStream(filePath);
      });

      const files = await Promise.all(imagePromises);

      await message.reply({
        body: `✅ 4 designs generated for:\n🎯 ${prompt}`,
        attachment: files
      });

      // Clean cache
      setTimeout(() => fs.emptyDirSync(cacheDir), 15000);

    } catch (err) {
      console.error("Error in imagine command:", err.message);
      return message.reply("❌ Failed to generate images. Please try again later.");
    }
  }
};
