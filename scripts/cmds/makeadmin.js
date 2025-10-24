module.exports = {
  config: {
    name: "makeadmin",
    aliases: ["madmin", "respect"],
    version: "2.0",
    author: "Helal",
    countDown: 0,
    role: 0,
    shortDescription: "Promote a mentioned user to admin",
    longDescription: "Only group admins can use this command to make another user admin (with confirmation).",
    category: "moderation",
    guide: "{pn} @username"
  },

  onStart: async function ({ api, event }) {
    try {
      const { threadID, senderID, messageID } = event;
      const threadInfo = await api.getThreadInfo(threadID);

      // ✅ Check if the command sender is an admin
      const isAdmin = threadInfo.adminIDs.some(a => (a.id || a) == senderID);
      if (!isAdmin)
        return api.sendMessage("❌ Only group admins can use this command!", threadID, messageID);

      // ✅ Check mention
      const mention = Object.keys(event.mentions || {});
      if (mention.length === 0)
        return api.sendMessage("⚠️ Please mention a user to make admin!", threadID, messageID);

      const targetID = mention[0];
      const targetName = event.mentions[targetID];

      // ✅ Ask for confirmation
      const confirmMsg = await api.sendMessage(
        `⚠️ Are you sure you want to make ${targetName} an admin?\nPlease react 👍 to confirm or ❌ to cancel.`,
        threadID
      );

      // ✅ Save for reaction handler
      global.GoatBot.onReaction.set(confirmMsg.messageID, {
        commandName: module.exports.config.name,
        author: senderID,
        targetID,
        threadID
      });

    } catch (err) {
      console.error("MakeAdmin Error:", err);
    }
  },

  onReaction: async function ({ api, event, Reaction }) {
    const { author, targetID, threadID } = Reaction;
    if (event.userID !== author) return;

    const botID = api.getCurrentUserID();
    const threadInfo = await api.getThreadInfo(threadID);
    const botIsAdmin = threadInfo.adminIDs.some(a => (a.id || a) == botID);

    if (!botIsAdmin)
      return api.sendMessage("⚠️ I need admin rights to promote others!", threadID);

    if (event.reaction === "👍") {
      try {
        await api.changeAdminStatus(threadID, targetID, true);
        return api.sendMessage(
          `✅ Successfully promoted <@${targetID}> to admin.`,
          threadID,
          null,
          { mentions: [{ id: targetID, tag: "user" }] }
        );
      } catch (e) {
        return api.sendMessage("❌ Failed to make admin. Check my permissions!", threadID);
      }
    } else if (event.reaction === "❌") {
      return api.sendMessage("🚫 Operation cancelled.", threadID);
    }
  }
};
