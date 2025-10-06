module.exports = {
  config: {
    name: "gcpro",
    aliases: ["groupprotect", "protect"],
    version: "9.5",
    author: "Helal Islam 💫",
    shortDescription: "Activate stylish group protection",
    longDescription:
      "Activates advanced group security: prevents name/theme change, spam messages, and protects admin settings with neon-styled alerts.",
    category: "system",
    guide: {
      en: "{pn} on/off"
    }
  },

  onStart: async function ({ message, event, args, api, threadsData }) {
    const threadID = event.threadID;
    const threadInfo = await api.getThreadInfo(threadID);

    // Protection toggle
    if (!args[0]) {
      return message.reply("⚙️ Usage: .gcpro on / .gcpro off");
    }

    if (args[0].toLowerCase() === "on") {
      global.gcProtection = global.gcProtection || {};
      global.gcProtection[threadID] = {
        name: threadInfo.threadName,
        protection: true,
        spamCount: {}
      };

      return message.reply(
        "🌌 **DIGITAL GC PROTECTION ACTIVATED!**\n" +
        "🔒 Group is now under security mode.\n" +
        "👑 Only Admins & Bot Admin can change settings."
      );
    }

    if (args[0].toLowerCase() === "off") {
      if (global.gcProtection?.[threadID]) delete global.gcProtection[threadID];
      return message.reply("🔓 GC Protection Disabled Successfully!");
    }
  },

  onEvent: async function ({ event, api }) {
    const threadID = event.threadID;
    const data = global.gcProtection?.[threadID];
    if (!data?.protection) return;

    try {
      const info = await api.getThreadInfo(threadID);

      // 🔥 1️⃣ Name Protection
      if (info.threadName !== data.name) {
        await api.setTitle(data.name, threadID);
        return api.sendMessage(
          "⚠️ Group name change detected!\n" +
          "🔁 Name restored by 🌌 *Digital AI System* 🔮",
          threadID
        );
      }

      // 🔥 2️⃣ Spam Protection
      if (event.type === "message" && event.senderID) {
        const sender = event.senderID;
        data.spamCount[sender] = (data.spamCount[sender] || 0) + 1;

        if (data.spamCount[sender] > 5) {
          data.spamCount[sender] = 0;
          return api.sendMessage(
            "⚡ *SPAM DETECTED!* ⚡\n" +
            "User warned 🚫\n" +
            "🌈 Keep the chat clean!",
            threadID
          );
        }

        setTimeout(() => {
          if (data.spamCount[sender]) data.spamCount[sender]--;
        }, 8000);
      }

      // 🔥 3️⃣ Quick Reaction & Emoji Change Protection
      if (event.logMessageType === "log:thread-icon" || event.logMessageType === "log:thread-emoji") {
        await api.changeThreadEmoji("💫", threadID);
        return api.sendMessage("🚫 Emoji change blocked!", threadID);
      }

      // 🔥 4️⃣ Theme Change Block
      if (event.logMessageType === "log:thread-color") {
        await api.changeThreadColor("#000000", threadID);
        return api.sendMessage("🛡️ Theme modification not allowed!", threadID);
      }

    } catch (err) {
      console.error("GC Protection Error:", err);
    }
  }
};
