module.exports = {
  config: {
    name: "lock",
    aliases: ["gclock"],
    version: "5.0",
    author: "Helal Islam",
    shortDescription: "Lock or unlock the group completely 🔒",
    longDescription: "Lock the group so only admins and bot can send messages. Others will see 'Unable to send'.",
    category: "boxchat",
    guide: "{pn}gc on / off"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const threadInfo = await api.getThreadInfo(threadID);
    const adminIDs = threadInfo.adminIDs.map(a => a.id);
    const botAdmins = global.GoatBot.config.ADMINBOT || [];

    // Permission check
    if (!adminIDs.includes(event.senderID) && !botAdmins.includes(event.senderID))
      return api.sendMessage("⚠️ Only group admin or bot admin can use this!", threadID, messageID);

    if (!args[0]) return api.sendMessage("🔐 Use: .lock gc on / off", threadID, messageID);
    const option = args[0].toLowerCase();

    if (option === "on" || option === "gc") {
      api.sendMessage("🔒 Locking group... please wait", threadID, (err, info) => {
        setTimeout(async () => {
          try {
            await api.changeThreadSetting(threadID, true); // true = lock messages
            api.editMessage("✅ Done ⚡ Group locked successfully", info.messageID);
          } catch (e) {
            api.editMessage("❌ Failed to lock group!", info.messageID);
            console.log(e);
          }
        }, 1500);
      });
    }

    else if (option === "off") {
      api.sendMessage("🔓 Unlocking group... please wait", threadID, (err, info) => {
        setTimeout(async () => {
          try {
            await api.changeThreadSetting(threadID, false); // false = unlock
            api.editMessage("✅ Done ⚡ Group unlocked successfully", info.messageID);
          } catch (e) {
            api.editMessage("❌ Failed to unlock group!", info.messageID);
            console.log(e);
          }
        }, 1500);
      });
    }

    else {
      api.sendMessage("❌ Invalid option! Use: .lock gc on / off", threadID, messageID);
    }
  }
};
