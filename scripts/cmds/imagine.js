const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "imagine",
    version: "8.0",
    author: "Helal + GPT-5",
    role: 0,
    shortDescription: "Unlimited AI image generator (auto API switch)",
    longDescription: "Generates AI images with auto API fallback (no API key, no limit).",
    category: "AI-IMAGE",
    guide: {
      en: "{pn} <prompt>\nExample:\n{pn} make a gaming logo"
    }
  },

  onStart: async function ({ message, args }) {
    if (!args[0]) return message.reply("⚠️ Please enter a prompt!\nExample: /imagine anime boy with sword");

    const prompt = args.join(" ");
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    message.reply(`🎨 Generating AI image for:\n"${prompt}"\nPlease wait 10–15s...`);

    // 3 backup API system
    const apis = [
      q => `https://image.pollinations.ai/prompt/${encodeURIComponent(q)}`,
      q => `https://image.b64api.xyz/prompt/${encodeURIComponent(q)}`,
      q => `https://api.itsrose.rest/image/imagine?prompt=${encodeURIComponent(q)}`
    ];

    let success = false;
    let imgPath = path.join(cacheDir, `ai_${Date.now()}.jpg`);

    for (const api of apis) {
      try {
        const url = api(prompt);
        const res = await axios.get(url, { responseType: "arraybuffer", timeout: 25000 });
        fs.writeFileSync(imgPath, res.data);
        success = true;
        break;
      } catch (err) {
        console.log(`❌ Failed on ${api.name || "API"}: ${err.message}`);
      }
    }

    if (!success) {
      return message.reply("🚫 All AI sources busy right now! Try again later 💀");
    }

    await message.reply({
      body: `✅ Here’s your generated image for:\n✨ ${prompt}`,
      attachment: fs.createReadStream(imgPath)
    });

    // Cleanup cache after 10s
    setTimeout(() => fs.emptyDirSync(cacheDir), 10000);
  }
};
