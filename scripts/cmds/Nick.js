module.exports = {
  config: {
    name: "nick",
    version: "2.5",
    author: "Helal",
    description: "Change group member nickname (Admin only) 🌺",
    category: "group"
  },

  onStart: async function ({ api, event, args }) {
    const botAdmins = ["61579763841166", "61580156099497"]; // ✅ Fixed bot admin UID list
    const senderID = event.senderID;

    // 🔹 Check if the sender is a group admin
    const threadInfo = await api.getThreadInfo(event.threadID);
    const isGroupAdmin = threadInfo.adminIDs.some(admin => admin.id === senderID);
    const isBotAdmin = botAdmins.includes(senderID);

    if (!isGroupAdmin && !isBotAdmin) {
      return api.sendMessage("🚫 | Only group or bot admins can use this command!", event.threadID);
    }

    // 🔹 Check if mention and nickname provided
    const mention = Object.keys(event.mentions)[0];
    const newNick = args.slice(1).join(" ");

    if (!mention) {
      return api.sendMessage("🌺 | Please mention a user.\nExample: .nick @user NewName", event.threadID);
    }

    if (!newNick) {
      return api.sendMessage("🌸 | Please type the new nickname after mention.", event.threadID);
    }

    try {
      await api.changeNickname(newNick, event.threadID, mention);
      api.sendMessage(`✅ | Nickname changed to "${newNick}" successfully 🌺`, event.threadID);
    } catch (error) {
      console.error(error);
      api.sendMessage("❌ | Failed to change nickname! Make sure the bot has admin rights.", event.threadID);
    }
  }
};
