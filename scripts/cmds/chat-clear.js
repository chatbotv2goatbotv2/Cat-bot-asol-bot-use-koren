// msgdel.js
// Delete all bot messages in group (Admin + Fixed UIDs)
// Author: Helal

const delay = ms => new Promise(res => setTimeout(res, ms));

module.exports = {
  config: {
    name: "msgdel",
    aliases: ["clear", "clearchat"],
    version: "3.0",
    author: "Helal",
    countDown: 5,
    role: 1,
    category: "system",
    shortDescription: { en: "Delete bot messages (GC admin + owner UID)" }
  },

  onStart: async function ({ api, event, message }) {
    try {
      const threadID = event.threadID;
      const senderID = String(event.senderID);
      const botID = String(api.getCurrentUserID());

      // ✅ Fixed owner/admin UIDs
      const allowedOwners = ["61581715990103", "61580156099497"];

      // ✅ Get thread info for GC admins
      const threadInfo = await api.getThreadInfo(threadID);
      const adminIDs = threadInfo.adminIDs.map(a => String(a.id || a));

      // ✅ Check if sender allowed
      if (
        !adminIDs.includes(senderID) &&
        senderID !== botID &&
        !allowedOwners.includes(senderID)
      ) {
        return message.reply("🚫 Only group admins and approved owners can use this command!");
      }

      // ✅ Fetch last 200 messages
      const messages = await api.getThreadHistory(threadID, 200, null);
      const botMessages = messages.filter(m => String(m.senderID) === botID);

      if (botMessages.length === 0) {
        return message.reply("🤖 No bot messages found to delete!");
      }

      let count = 0;
      for (const msg of botMessages) {
        try {
          await api.unsendMessage(msg.messageID);
          count++;
          await delay(250);
        } catch {}
      }

      return message.reply(`🧹 Successfully deleted ${count} message(s)! ✅`);
    } catch (err) {
      console.error(err);
      return message.reply("❌ Error while deleting messages!");
    }
  }
};