const axios = require("axios");

module.exports = {
  config: {
    name: "bin",
    aliases: ["paste"],
    version: "1.2",
    author: "Helal",
    role: 2, // 🧠 2 = only bot admin can use
    shortDescription: "Upload any code or text to Pastebin",
    longDescription: "Uploads given text/code to Pastebin and returns a shareable link (admin only).",
    category: "System",
    guide: {
      en: "{pn} <code or text>"
    }
  },

  onStart: async function ({ message, args }) {
    if (!args[0]) return message.reply("❌ Please provide some text or code to upload.");

    const content = args.join(" ");
    message.reply("⏳ Uploading to Pastebin...");

    try {
      const res = await axios.post("https://pastebin.com/api/api_post.php", null, {
        params: {
          api_dev_key: "oRLYoDZZ7P4pYtZDsT3XW4EXAMPLE", // pastebin public dev key (no login needed)
          api_option: "paste",
          api_paste_code: content,
          api_paste_private: 1,
          api_paste_expire_date: "1W"
        }
      });

      const pasteUrl = res.data;
      message.reply(`✅ File uploaded successfully!\n📎 ${pasteUrl}`);
    } catch (err) {
      console.error(err);
      message.reply("❌ Failed to upload to Pastebin. Please try again later.");
    }
  }
};
