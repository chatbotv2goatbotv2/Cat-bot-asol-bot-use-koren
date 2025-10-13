const fs = require("fs");
const path = require("path");
const axios = require("axios");

// === YOUR OPENAI API KEY HERE ===
// 🟢 Paste your key inside the quotes below 👇
const OPENAI_API_KEY = "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";

module.exports = {
  config: {
    name: "imagine",
    aliases: ["img", "aiimg", "draw"],
    version: "2.0",
    author: "Helal",
    countDown: 5,
    role: 0,
    description: "Generate AI images using OpenAI (no setup needed).",
    category: "image",
    guide: {
      en: "/imagine <your prompt>"
    }
  },

  onStart: async function ({ api, event, args }) {
    const prompt = args.join(" ");
    if (!prompt) return api.sendMessage("❗ Usage: /imagine <prompt>", event.threadID, event.messageID);

    if (!OPENAI_API_KEY || !OPENAI_API_KEY.startsWith("sk-")) {
      return api.sendMessage("❌ Please set your OpenAI API key inside imagine.js first!", event.threadID, event.messageID);
    }

    const waitMsg = await api.sendMessage(`🎨 Generating 4 AI images for:\n"${prompt}"\nPlease wait...`, event.threadID);

    try {
      const res = await axios.post("https://api.openai.com/v1/images/generations", {
        model: "gpt-image-1",
        prompt,
        n: 4,
        size: "1024x1024"
      }, {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      });

      const data = res.data.data;
      if (!data || data.length === 0) throw new Error("No image data returned");

      const dir = path.join(__dirname, "imagine_cache");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

      const files = [];
      for (let i = 0; i < data.length; i++) {
        const imgData = data[i];
        const file = path.join(dir, `img_${Date.now()}_${i + 1}.png`);
        const imgBuffer = imgData.b64_json
          ? Buffer.from(imgData.b64_json, "base64")
          : (await axios.get(imgData.url, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(file, imgBuffer);
        files.push(file);
      }

      // Send menu message
      let msg = `🌺 𝐈𝐌𝐀𝐆𝐈𝐍𝐄 — Choose your favorite image!\n\n`;
      msg += files.map((_, i) => `🖼️ ${i + 1}. Image ${i + 1}`).join("\n");
      msg += `\n\nReply with 1–${files.length} to select one image.`;

      api.sendMessage({
        body: msg,
        attachment: files.map(f => fs.createReadStream(f))
      }, event.threadID, (err, info) => {
        if (err) return api.sendMessage("❌ Failed to send images.", event.threadID);
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "imagine",
          author: event.senderID,
          files
        });
      }, event.messageID);

      api.unsendMessage(waitMsg.messageID);
    } catch (e) {
      console.error(e);
      api.sendMessage("❌ Failed to generate image.\nCheck your key or try again later.", event.threadID, event.messageID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    if (event.senderID !== Reply.author) return;
    const choice = parseInt(event.body);
    if (isNaN(choice) || choice < 1 || choice > Reply.files.length)
      return api.sendMessage("❗ Please reply with a valid number (1–4).", event.threadID, event.messageID);

    const selected = Reply.files[choice - 1];
    await api.sendMessage({
      body: `✅ Here is your selected image (${choice})`,
      attachment: fs.createReadStream(selected)
    }, event.threadID, event.messageID);

    // cleanup
    for (const f of Reply.files) fs.existsSync(f) && fs.unlinkSync(f);
    global.GoatBot.onReply.delete(Reply.messageID);
  }
};
