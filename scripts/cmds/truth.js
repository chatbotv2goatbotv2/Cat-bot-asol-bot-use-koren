// truth.js
// Author: Helal
// Command: /truth
// Fully working interactive reply system (no config needed)

const truths = [
  "তুমি কখনও কাউকে মিথ্যা বলেছো? 😏",
  "তোমার ক্রাশের নাম বলো 💞",
  "সবচেয়ে লজ্জার মুহূর্ত কোনটা ছিল? 🙈",
  "তুমি কি কখনও পরীক্ষায় নকল করেছো? 😅",
  "তুমি সবচেয়ে বেশি কাকে ভালোবাসো? ❤️",
  "তোমার মোবাইলে সবচেয়ে বেশি কার সাথে চ্যাট হয়? 📱",
  "তুমি যদি অদৃশ্য হতে পারতে, প্রথমে কী করতে? 👻",
  "তুমি কি কখনও বন্ধুর পেছনে কথা বলেছো? 🤭",
  "তোমার জীবনের সবচেয়ে বড় স্বপ্ন কী? 🌟",
  "তুমি কি কখনও কাউকে প্রপোজ করেছো? 💌"
];

module.exports = {
  config: {
    name: "truth",
    aliases: [],
    version: "2.0",
    author: "Helal",
    countDown: 3,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "Bangla Truth question game (reply supported)"
    }
  },

  onStart: async function ({ message, event, commandName }) {
    const randomTruth = truths[Math.floor(Math.random() * truths.length)];
    const replyMsg = await message.reply(`🎯 *TRUTH TIME!*\n\n${randomTruth}\n\n💬 এখন তোমার উত্তর লিখো ↓`);

    // store reply handler
    global.GoatBot.onReply.set(replyMsg.messageID, {
      commandName,
      type: "truthAnswer",
      author: event.senderID
    });
  },

  onReply: async function ({ message, Reply, event }) {
    if (Reply.type === "truthAnswer") {
      return message.reply(`✅ ধন্যবাদ ভাই Helal! তোমার সত্যি উত্তর রেকর্ড হয়েছে 😎\nতুমি বলেছিলে:\n🗣️ "${event.body}"`);
    }
  }
};