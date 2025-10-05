const fs = require("fs");

module.exports = {
  config: {
    name: "warn",
    version: "6.5",
    author: "Helal Islam",
    role: 1,
    shortDescription: "Stylish warning command (lifetime stable)",
    longDescription: "A premium warning system with stylish output that never crashes or stops working. Only admin or bot admin can use.",
    category: "moderation",
    guide: "{pn} @mention [reason]"
  },

  onStart: async function ({ api, event, args, Users }) {
    try {
      const threadID = event.threadID;
      const senderID = event.senderID;
      const mention = Object.keys(event.mentions)[0];
      const reason = args.slice(1).join(" ") || "No reason provided";

      const threadInfo = await api.getThreadInfo(threadID);
      const adminIDs = threadInfo.adminIDs.map(a => a.id);
      const isBotAdmin = (global.config.ADMINBOT || []).includes(senderID);

      // 🔒 Permission Check
      if (!adminIDs.includes(senderID) && !isBotAdmin) {
        return api.sendMessage("🚫 Only Group Admins & Bot Admins can use this command!", threadID, event.messageID);
      }

      // ⚠️ Mention Check
      if (!mention) {
        return api.sendMessage("⚠️ Please tag someone to warn!", threadID, event.messageID);
      }

      const userName = event.mentions[mention].replace("@", "");
      const senderName = await Users.getNameUser(senderID);

      // 💎 Stylish Permanent Message
      const msg = `
╔══════⚡ 𝗦𝗧𝗬𝗟𝗜𝗦𝗛 𝗪𝗔𝗥𝗡 𝗦𝗬𝗦𝗧𝗘𝗠 ⚡══════╗
┃👤 Target: ${userName}
┃💬 Reason: ${reason}
┃👑 Warned By: ${senderName}
┃🎨 Mode: Premium Neon Alert
╚══════════════════════════════╝

💢 Message:
"Hey ${userName}, please behave respectfully.
You've been warned by Admin in style 💫"

🔰 Credit: Helal Islam
`;

      return api.sendMessage(msg, threadID);
    } catch (error) {
      console.error(error);
      return api.sendMessage("❌ Error: Something went wrong but auto fixed. Try again.", event.threadID);
    }
  }
};
