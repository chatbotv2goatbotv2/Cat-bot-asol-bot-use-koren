const fs = require("fs");

module.exports = {
  config: {
    name: "warn",
    version: "3.0",
    author: "Creator: Helal Islam",
    role: 1, // Only group admins or bot admins can use
    shortDescription: "Stylish universal warning system",
    longDescription: "A fully English, stylish, and colorful warning command for both boys and girls. Only group and bot admins can use it.",
    category: "moderation",
    guide: "{pn} @mention [reason]"
  },

  onStart: async function ({ api, event, args, Users }) {
    const threadID = event.threadID;
    const senderID = event.senderID;
    const mention = Object.keys(event.mentions)[0];
    const reason = args.slice(1).join(" ") || "No reason provided";

    const threadInfo = await api.getThreadInfo(threadID);
    const adminIDs = threadInfo.adminIDs.map(a => a.id);
    const isBotAdmin = (global.config.ADMINBOT || []).includes(senderID);

    // Permission check
    if (!adminIDs.includes(senderID) && !isBotAdmin) {
      return api.sendMessage("🚫 Only Group Admins & Bot Admins can use this command!", threadID, event.messageID);
    }

    // Mention check
    if (!mention) {
      return api.sendMessage("⚠️ Please tag someone to warn!", threadID, event.messageID);
    }

    const userName = event.mentions[mention].replace("@", "");
    const senderName = await Users.getNameUser(senderID);

    // Gender-based style (optional dynamic color)
    const genderStyle = ["💗 Pink Neon", "💙 Blue Neon", "💜 Purple Glow"];
    const stylePick = genderStyle[Math.floor(Math.random() * genderStyle.length)];

    // Fancy effect message
    const effectMsg = `
╔════════════════════╗
   🌈  PREMIUM WARNING SYSTEM  🌈
╚════════════════════╝

⚡ Target: ${userName}
🎨 Style: ${stylePick}
💢 Reason: ${reason}
👑 Warned by: ${senderName}
───────────────────────────────
💬 Message:
"Hey ${userName}, stay respectful & kind. 
You've just been warned in style ✨"
───────────────────────────────
`;

    // Stylish animated frame
    const frame = `
╭────────────────────────────╮
│ 🔥 Stylish Warn System 🔥  │
│ ⚠️ User: ${userName}       │
│ 💬 Reason: ${reason}        │
│ 🌈 Style: ${stylePick}     │
│ 👑 Admin: ${senderName}    │
╰────────────────────────────╯
`;

    api.sendMessage(effectMsg, threadID);
    api.sendMessage(frame, threadID);
  }
};
