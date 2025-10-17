module.exports = {
  config: {
    name: "groupinfo",
    aliases: ["gcinfo"],
    version: "3.5",
    author: "Helal",
    countDown: 5,
    role: 0,
    category: "utility",
    shortDescription: { en: "Show full info about this group" },
  },

  onStart: async function ({ message, event, api, threadsData }) {
    try {
      const threadID = event.threadID;
      const threadInfo = await api.getThreadInfo(threadID);

      const name = threadInfo.threadName || "Unnamed Group";
      const id = threadID;
      const adminIDs = threadInfo.adminIDs.map(a => a.id);
      const memberCount = threadInfo.participantIDs.length;
      const approval = threadInfo.approvalMode ? "✅ On" : "❌ Off";
      const emoji = threadInfo.emoji || "💬";
      const nicknames = threadInfo.nicknames || {};

      const adminNames = [];
      for (const admin of adminIDs) {
        const userInfo = await api.getUserInfo(admin);
        adminNames.push(userInfo[admin].name);
      }

      const msg = `
🌐 *GROUP INFORMATION*

🏷️ Group Name: ${name}
🆔 Group ID: ${id}
👥 Total Members: ${memberCount}
👑 Total Admins: ${adminIDs.length}
📩 Join Approval: ${approval}
💬 Group Emoji: ${emoji}

👑 *Admins:*
${adminNames.map(n => `• ${n}`).join("\n")}

🕓 Last Activity: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })}

━━━━━━━━━━━━━━━━━
📚 *Nicknames (if any)*  
${Object.keys(nicknames).length > 0
  ? Object.entries(nicknames)
      .map(([uid, nick]) => `- ${nick}`)
      .join("\n")
  : "No nicknames set."}

✨ *Powered by Cat Bot × GPT-5*
`;

      message.reply(msg);
    } catch (err) {
      console.error(err);
      message.reply("⚠️ Sorry, couldn't fetch group info!");
    }
  },
};
