// dare.js
// Author: Helal
// Command: /dare
// Fully working interactive reply system (no config needed)

const dares = [
  "তোমার বন্ধুর নাম নিয়ে একটা মজার কবিতা বলো 😆",
  "তিনবার জোরে বলো ‘আমি পাগল!’ 🤪",
  "নিজেকে একটা মজার নাম দাও আর বলো 😝",
  "তোমার প্রিয় খাবারের নাম উল্টো করে বলো 🍕",
  "একটা জোক বলো 😹",
  "একটা গান গাও ৫ সেকেন্ডের জন্য 🎤",
  "তুমি যাকে পছন্দ করো, তার নাম জোরে বলো 😳",
  "তোমার ডান পাশের মানুষটাকে একটা মিষ্টি কথা বলো 💖",
  "তোমার মোবাইলের শেষ মেসেজটা পড়ো aloud 📱",
  "নিজেকে নিয়ে একটা মজার কথা বলো 😂"
];

module.exports = {
  config: {
    name: "dare",
    aliases: [],
    version: "2.0",
    author: "Helal",
    countDown: 3,
    role: 0,
    category: "game",
    shortDescription: {
      en: "Bangla Dare challenge game (reply supported)"
    }
  },

  onStart: async function ({ message, event, commandName }) {
    const randomDare = dares[Math.floor(Math.random() * dares.length)];
    const replyMsg = await message.reply(`🔥 *DARE TIME!*\n\n${randomDare}\n\n💬 Dare complete করলে নিচে reply দাও 👇`);

    global.GoatBot.onReply.set(replyMsg.messageID, {
      commandName,
      type: "dareAnswer",
      author: event.senderID
    });
  },

  onReply: async function ({ message, Reply, event }) {
    if (Reply.type === "dareAnswer") {
      return message.reply(`😎 বাহ Helal! তুমি তোমার Dare complete করেছো!\n🗣️ "${event.body}"`);
    }
  }
};