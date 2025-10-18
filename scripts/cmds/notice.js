// notice.js
// Broadcast a notice message to all threads where the bot is added.
// Author: Helal

const fs = require("fs");

module.exports = {
  config: {
    name: "notice",
    aliases: ["broadcast", "bc"],
    version: "1.0",
    author: "Helal",
    countDown: 10,
    role: 2, // admin only
    category: "system",
    shortDescription: {
      en: "Send notice to all groups where the bot is in"
    }
  },

  onStart: async function ({ message, args, api }) {
    if (!args || args.length === 0)
      return message.reply("⚠️ Please type a message.\nExample: /notice Server maintenance tonight 10PM.");

    const noticeText = args.join(" ");
    message.reply("📢 Sending notice to all groups... Please wait a few moments.");

    try {
      // Read thread list directly from bot storage (no config needed)
      const threads = await api.getThreadList(1000, null, ["INBOX"]);
      const groupThreads = threads.filter(t => t.isGroup);

      let sent = 0, failed = 0;
      for (const t of groupThreads) {
        try {
          await api.sendMessage(`📢 NOTICE FROM ADMIN\n\n${noticeText}\n\n- Sent by Helal`, t.threadID);
          sent++;
          await new Promise(r => setTimeout(r, 800)); // avoid spam block
        } catch (err) {
          failed++;
        }
      }

      message.reply(`✅ Broadcast complete!\n\nSent: ${sent}\nFailed: ${failed}`);
    } catch (err) {
      console.error(err);
      message.reply("❌ Error while sending notice.");
    }
  }
};