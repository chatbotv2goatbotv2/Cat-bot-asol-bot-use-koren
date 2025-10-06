module.exports = {
  config: {
    name: "setrole",
    aliases: ["role"],
    version: "2.0",
    author: "Helal Islam",
    shortDescription: "Set and manage group roles with style.",
    longDescription: "Allows admins to set, view, and manage custom roles for members in a group.",
    category: "group",
    guide: "{pn}setrole <role> <text> | {pn}role [role]"
  },

  onStart: async function ({ message, args, event, threadsData, usersData, api }) {
    const { threadID, senderID } = event;
    const threadInfo = await api.getThreadInfo(threadID);
    const adminIDs = threadInfo.adminIDs.map(ad => ad.id);
    const botAdmins = ["61580156099497"]; // Add your bot admin IDs here

    // Check admin permission
    if (!adminIDs.includes(senderID) && !botAdmins.includes(senderID)) {
      return message.reply("❌ | Only group or bot admins can set or edit roles!");
    }

    // Thread data storage
    const threadData = await threadsData.get(threadID) || {};
    if (!threadData.roles) threadData.roles = {};

    // --- Commands ---
    const subCmd = args[0]?.toLowerCase();
    if (!subCmd) {
      // Show all roles
      let msg = "🌌 𝗚𝗥𝗢𝗨𝗣 𝗥𝗢𝗟𝗘𝗦 𝗟𝗜𝗦𝗧 🌌\n";
      msg += "╭───────────────❉\n";
      const roles = Object.keys(threadData.roles);
      if (roles.length === 0) {
        msg += "│ ⚠️ No roles have been set yet.\n";
      } else {
        roles.forEach((r) => {
          msg += `│ ⚡ ${r}: ${threadData.roles[r]}\n`;
        });
      }
      msg += "╰───────────────❉\n";
      msg += "💫 Use (.setrole <role> <text>) to set a new one!";
      return message.reply(msg);
    }

    if (subCmd === "delete" || subCmd === "remove") {
      const roleName = args[1];
      if (!roleName) return message.reply("⚠️ | Please specify a role name to delete!");
      if (!threadData.roles[roleName]) return message.reply("❌ | That role doesn't exist!");
      delete threadData.roles[roleName];
      await threadsData.set(threadID, threadData);
      return message.reply(`🗑️ | Role '${roleName}' has been deleted successfully!`);
    }

    // --- Set Role ---
    const roleName = args[0];
    const roleText = args.slice(1).join(" ");
    if (!roleText) {
      // View role
      const value = threadData.roles[roleName];
      if (!value) return message.reply("⚠️ | This role is not set yet!");
      return message.reply(`💎 𝗥𝗢𝗟𝗘: ${roleName}\n✨ ${value}`);
    }

    // --- Add / Update Role ---
    threadData.roles[roleName] = roleText;
    await threadsData.set(threadID, threadData);

    const styledMsg = 
`🌟 𝗥𝗢𝗟𝗘 𝗨𝗣𝗗𝗔𝗧𝗘𝗗 🌟
╭──────────────❉
│ 🏷️ Role: ${roleName}
│ 💬 Text: ${roleText}
│ 👑 Updated by: ${await usersData.getName(senderID)}
╰──────────────❉
🚀 Role system by Digital Ai`;

    return message.reply(styledMsg);
  }
};
