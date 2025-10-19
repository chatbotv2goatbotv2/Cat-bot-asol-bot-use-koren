// td.js
// Author: Helal
// Command: /td
// Full interactive Truth or Dare system (no config needed)

const truths = [
  "তুমি কখনও কাউকে মিথ্যা বলেছো? 😏",
  "তোমার ক্রাশের নাম বলো 💞",
  "সবচেয়ে লজ্জার মুহূর্ত কোনটা ছিল? 🙈",
  "তুমি কি কখনও পরীক্ষায় নকল করেছো? 😅",
  "তুমি সবচেয়ে বেশি কাকে ভালোবাসো? ❤️",
  "তুমি যদি অদৃশ্য হতে পারতে, প্রথমে কী করতে? 👻",
  "তোমার মোবাইলে সবচেয়ে বেশি কার সাথে চ্যাট হয়? 📱",
  "তুমি কি কখনও বন্ধুর পেছনে কথা বলেছো? 🤭",
  "তোমার জীবনের সবচেয়ে বড় স্বপ্ন কী? 🌟",
  "তুমি কি কখনও কাউকে প্রপোজ করেছো? 💌"
];

const dares = [
  "তিনবার জোরে বলো ‘আমি পাগল!’ 🤪",
  "নিজেকে একটা মজার নাম দাও আর বলো 😝",
  "একটা গান গাও ৫ সেকেন্ডের জন্য 🎤",
  "তোমার বন্ধুর নাম নিয়ে একটা কবিতা বানাও 😆",
  "তোমার প্রিয় খাবারের নাম উল্টো করে বলো 🍕",
  "তুমি যাকে পছন্দ করো, তার নাম বলো 😳",
  "তোমার মোবাইলের শেষ মেসেজটা পড়ো aloud 📱",
  "নিজেকে নিয়ে একটা মজার কথা বলো 😂",
  "তোমার ডান পাশের মানুষটাকে একটা মিষ্টি কথা বলো 💖",
  "তোমার বন্ধুকে একটা প্রশংসা করো 😍"
];

module.exports = {
  config: {
    name: "tod",
    aliases: ["truth or dare"],
    version: "3.0",
    author: "Helal",
    countDown: 3,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "Bangla Truth or Dare interactive game"
    }
  },

  onStart: async function ({ message, event, commandName }) {
    const replyMsg = await message.reply(
      `🎯 *Truth or Dare Game শুরু!*\n\nতুমি কোনটা বেছে নেবে?\n\n🇹 = Truth\n🔥 = Dare\n\n💬 নিচে লিখো শুধু "truth" বা "dare" ↓`
    );

    global.GoatBot.onReply.set(replyMsg.messageID, {
      commandName,
      type: "choose",
      author: event.senderID
    });
  },

  onReply: async function ({ message, Reply, event }) {
    if (Reply.type === "choose") {
      const choice = event.body.toLowerCase().trim();

      if (choice.includes("truth") || choice.includes("t")) {
        const randomTruth = truths[Math.floor(Math.random() * truths.length)];
        const replyMsg = await message.reply(`🎯 *TRUTH TIME!*\n\n${randomTruth}\n\n💬 এখন তোমার উত্তর দাও ↓`);

        global.GoatBot.onReply.set(replyMsg.messageID, {
          commandName: "td",
          type: "truthAnswer",
          author: event.senderID
        });
      } 
      else if (choice.includes("dare") || choice.includes("d")) {
        const randomDare = dares[Math.floor(Math.random() * dares.length)];
        const replyMsg = await message.reply(`🔥 *DARE TIME!*\n\n${randomDare}\n\n💬 Dare complete করলে নিচে reply দাও 👇`);

        global.GoatBot.onReply.set(replyMsg.messageID, {
          commandName: "td",
          type: "dareAnswer",
          author: event.senderID
        });
      } 
      else {
        return message.reply("❌ শুধু 'truth' বা 'dare' লিখো ভাই Helal 😅");
      }
    }

    if (Reply.type === "truthAnswer") {
      return message.reply(`✅ ধন্যবাদ ভাই Helal! তোমার সত্যি উত্তর রেকর্ড হলো 😎\n🗣️ "${event.body}"`);
    }

    if (Reply.type === "dareAnswer") {
      return message.reply(`🔥 বাহ Helal! তুমি তোমার Dare complete করেছো!\n🗣️ "${event.body}"`);
    }
  }
};