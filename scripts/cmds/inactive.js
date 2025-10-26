module.exports = {
  config: {
    name: "inactive",
    aliases: ["kickinactive"],
    version: "2.0",
    author: "Helal + GPT-5",
    countDown: 10,
    role: 1, // only admin
    category: "admin",
    shortDescription: { en: "Kick inactive members (count-based)" },
    longDescription: { en: "Kick the last <count> inactive members from the group (admins only)." },
    guide: { en: "{pn} <count>\nExample: /inactive 10" }
  },

  onStart: async function ({ api, event, args, message }) {
    const threadID = event.threadID;
    const senderID = event.senderID;
    const count = parseInt(args[0]);

    if (isNaN(count) || count <= 0)
      return message.reply("⚠️ Please provide a valid number.\nExample: /inactive 10");

    const threadInfo = await api.getThreadInfo(threadID);
    const adminIDs = threadInfo.adminIDs.map(a => a.id);

    if (!adminIDs.includes(senderID))
      return message.reply("🚫 Only group admins can use this command.");

    if (!threadInfo.isGroup)
      return message.reply("⚠️ This command only works in groups.");

    message.reply(`🔍 Checking ${count} inactive members...`);

    // Filter members who are not admin or bot
    const normalMembers = threadInfo.userInfo.filter(
      u => !adminIDs.includes(u.id) && !u.isMessengerUserOwner && u.id != api.getCurrentUserID()
    );

    // Sort by message count ascending (least active first)
    const sorted = normalMembers.sort((a, b) => (a.messageCount || 0) - (b.messageCount || 0));
    const toKick = sorted.slice(0, count);

    if (toKick.length === 0)
      return message.reply("✅ No inactive members found!");

    message.reply(`⚠️ Removing ${toKick.length} inactive members...`);

    for (const member of toKick) {
      try {
        await api.removeUserFromGroup(member.id, threadID);
        await new Promise(res => setTimeout(res, 1000)); // delay 1s between each
      } catch (e) {
        console.error(`❌ Failed to remove ${member.id}:`, e.message);
      }
    }

    return message.reply(`✅ Successfully removed ${toKick.length} inactive members.`);
  }
};