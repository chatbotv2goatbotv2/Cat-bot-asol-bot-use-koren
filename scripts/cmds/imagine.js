const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "imagine",
    version: "4.0",
    author: "Helal + GPT-5",
    role: 0,
    shortDescription: "Generate 4 AI design variations from one prompt",
    longDescription: "Creates 4 unique design versions (different angles, colors, layouts) from a single prompt — like Bing Image Creator.",
    category: "AI-IMAGE",
    guide: {
      en: "{pn} <prompt>\n\nExample:\n{pn} Make a gaming logo"
    }
  },

  onStart: async function ({ message, args }) {
    if (!args[0]) return message.reply("❗ Please provide a prompt.\n\nExample:\n/imagine Make a gaming logo");

    const prompt = args.join(" ");
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    message.reply(`🎨 Generating 4 design variations for:\n"${prompt}"\nPlease wait 10–20 seconds...`);

    try {
      // চারটা আলাদা version prompt বানানো হচ্ছে
      const variations = [
        `${prompt}, professional modern design, high contrast, HD, centered composition`,
        `${prompt}, minimal logo style, flat color, clean layout, geometric shapes`,
        `${prompt}, vibrant gaming style, neon light, detailed, 3D logo look`,
        `${prompt}, futuristic tech vibe, metallic texture, sharp edges, dynamic motion`
      ];

      const imagePromises = variations.map(async (v, i) => {
        const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(v)}`;
        const filePath = path.join(cacheDir, `imagine_${Date.now()}_${i}.jpg`);
        const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(filePath, response.data);
        return fs.createReadStream(filePath);
      });

      const images = await Promise.all(imagePromises);

      await message.reply({
        body: `✅ Generated 4 AI versions for:\n🎯 "${prompt}"`,
        attachment: images
      });

      // Cleanup
      setTimeout(() => {
        fs.emptyDirSync(cacheDir);
      }, 10000);

    } catch (err) {
      console.error(err);
      return message.reply("❌ Failed to generate images. Try again later.");
    }
  }
};
