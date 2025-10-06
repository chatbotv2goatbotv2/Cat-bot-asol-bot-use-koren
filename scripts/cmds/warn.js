module.exports = {
  config: {
    name: "warn",
    aliases: ["warning", "wrn"],
    version: "9.0",
    author: "Helal Islam 💫",
    shortDescription: "Stylish working warn system",
    longDescription: "Warn users, auto remove after 3 warns. Fixed all errors.",
    category: "system",
    guide: {
      en: "{pn} @mention [reason]\n{pn} check [@mention]\n{pn} reset [@mention]"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const threadID = event.threadID;
      const senderID = event.senderID;

      if (!global.userWarns) global.userWarns = {};

      const mention = Object.keys(event.mentions || {});
      const command = args[0]?.toLowerCase();

      // ✅ CREATE GROUP ENTRY
      if (!global.userWarns[threadID]) global.userWarns[threadID] = {};

      // 🔍 CHECK WARN
      if (command === "check") {
        if (!mention[0]) return api.sendMessage("⚙️ Usage: .warn check @user", threadID);
        const target = mention[0];
        const warns = global.userWarns[threadID][target] || 0;

        return api.sendMessage(
          `🌐 𝗪𝗔𝗥𝗡 𝗖𝗛𝗘𝗖𝗞 𝗣𝗔𝗡𝗘𝗟 🌐\n👤 User: ${event.mentions[target]}\n⚠️ Warnings: ${warns}/3\n${warns >= 3 ? "🚫 Auto ban triggered!" : "🟢 Safe"}`
          , threadID, event.messageID);
      }

      // 🔄 RESET WARN
      if (command === "reset") {
        if (!mention[0]) return api.sendMessage("⚙️ Usage: .warn reset @user", threadID);
        const target = mention[0];
        if (global.userWarns[threadID][target]) {
          delete global.userWarns[threadID][target];
          return api.sendMessage(`✅ Warning reset for ${event.mentions[target]}`, threadID);
        } else {
          return api.sendMessage("⚠️ No warnings found.", threadID);
        }
      }

      // ⚠️ ADD WARN
      if (!mention[0]) return api.sendMessage("⚙️ Usage: .warn @user [reason]", threadID);
      const target = mention[0];
      const reason = args.slice(1).join(" ") || "No reason provided";

      // ADD WARN COUNT
      global.userWarns[threadID][target] = (global.userWarns[threadID][target] || 0) + 1;
      const warns = global.userWarns[threadID][target];

      // 🌈 STYLISH WARN MESSAGE
      const warnMsg =
        `╭─🌌 𝗗𝗜𝗚𝗜𝗧𝗔𝗟 𝗪𝗔𝗥𝗡 𝗦𝗬𝗦𝗧𝗘𝗠 🌌\n` +
        `│ 👤 User: ${event.mentions[target]}\n` +
        `│ ⚠️ Warning: ${warns}/3\n` +
        `│ 📝 Reason: ${reason}\n` +
        `│ 👮 Warned by: <@${senderID}>\n` +
        `╰─────────────💫\n` +
        (warns === 2 ? "🚨 One more & you're gone!" : warns === 3 ? "💥 Auto kick triggered!" : "🌀 Stay calm next time!");

      await api.sendMessage(warnMsg, threadID, event.messageID);

      // 🚫 AUTO REMOVE IF 3 WARN
      if (warns >= 3) {
        setTimeout(async () => {
          try {
            await api.removeUserFromGroup(target, threadID);
            api.sendMessage(`🚫 ${event.mentions[target]} has been removed (3 warnings reached).`, threadID);
            delete global.userWarns[threadID][target];
          } catch (e) {
            api.sendMessage("⚙️ Could not remove user (maybe admin).", threadID);
          }
        }, 1500);
      }
    } catch (err) {
      return api.sendMessage(`❌ Error: ${err.message}`, event.threadID);
    }
  }
};
