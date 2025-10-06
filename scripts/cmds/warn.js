module.exports = {
  config: {
    name: "warn",
    aliases: ["warning", "wrn"],
    version: "8.5",
    author: "Helal Islam 💫",
    shortDescription: "Warn users with stylish system",
    longDescription: "Add or check warnings for group members. After 3 warnings, auto-kick system activates.",
    category: "system",
    guide: {
      en: "{pn} @mention [reason]\n{pn} check [@mention]\n{pn} reset [@mention]"
    }
  },

  onStart: async function ({ api, event, args }) {
    const threadID = event.threadID;
    const senderID = event.senderID;

    if (!global.userWarns) global.userWarns = {};

    const mention = Object.keys(event.mentions || {});
    const command = args[0]?.toLowerCase();

    // 🔍 CHECK WARN STATUS
    if (command === "check") {
      if (!mention[0]) return api.sendMessage("⚙️ Usage: .warn check @user", threadID);
      const target = mention[0];
      const warns = global.userWarns[threadID]?.[target] || 0;

      return api.sendMessage(
        `🌐 𝗪𝗔𝗥𝗡 𝗖𝗛𝗘𝗖𝗞 𝗣𝗔𝗡𝗘𝗟 🌐\n` +
        `👤 User: ${event.mentions[target]}\n` +
        `⚠️ Total Warnings: ${warns}/3\n\n` +
        (warns >= 3 ? "🚫 This user has been auto-banned!" : "🟢 User is safe (for now)"),
        threadID
      );
    }

    // 🔄 RESET WARN
    if (command === "reset") {
      if (!mention[0]) return api.sendMessage("⚙️ Usage: .warn reset @user", threadID);
      const target = mention[0];
      if (global.userWarns[threadID]?.[target]) {
        delete global.userWarns[threadID][target];
        return api.sendMessage(`✅ Warning reset for ${event.mentions[target]}`, threadID);
      } else {
        return api.sendMessage("⚠️ No warnings found for this user.", threadID);
      }
    }

    // ⚠️ ADD WARN
    if (!mention[0]) return api.sendMessage("⚙️ Usage: .warn @user [reason]", threadID);
    const target = mention[0];
    const reason = args.slice(1).join(" ") || "No reason provided";

    global.userWarns[threadID] = global.userWarns[threadID] || {};
    global.userWarns[threadID][target] = (global.userWarns[threadID][target] || 0) + 1;
    const warns = global.userWarns[threadID][target];

    if (warns >= 3) {
      api.sendMessage(
        `🚨 𝗔𝗨𝗧𝗢 𝗔𝗖𝗧𝗜𝗢𝗡 𝗧𝗥𝗜𝗚𝗚𝗘𝗥𝗘𝗗 🚨\n` +
        `👤 User: ${event.mentions[target]}\n` +
        `⚠️ 3rd Warning reached!\n` +
        `💥 Action: Auto Removal Initiated.`,
        threadID
      );

      try {
        await api.removeUserFromGroup(target, threadID);
      } catch {
        api.sendMessage("⚙️ Could not remove user (maybe admin).", threadID);
      }

      delete global.userWarns[threadID][target];
      return;
    }

    // 🌈 STYLISH WARN MESSAGE
    const msg = 
      `╭─🌌 𝗗𝗜𝗚𝗜𝗧𝗔𝗟 𝗪𝗔𝗥𝗡 𝗦𝗬𝗦𝗧𝗘𝗠 🌌\n` +
      `│ 👤 User: ${event.mentions[target]}\n` +
      `│ ⚠️ Warning: ${warns}/3\n` +
      `│ 📝 Reason: ${reason}\n` +
      `│ 🕶️ Warned by: <@${senderID}>\n` +
      `╰─────────────💫\n` +
      (warns === 2 ? "🚨 One more and you're gone!" : "🌀 Behave well next time!");

    api.sendMessage(msg, threadID);
  }
};
