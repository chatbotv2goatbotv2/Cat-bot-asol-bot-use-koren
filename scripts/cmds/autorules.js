module.exports = {
  config: {
    name: "autorules",
    version: "4.0",
    author: "Helal Islam",
    countDown: 5,
    role: 0,
    shortDescription: "Auto welcome + rules system",
    longDescription:
      "Automatically sends a stylish welcome message and the group rules whenever a new user joins.",
    category: "group",
    guide: {
      en: "{pn}setrules <text> — Set custom rules\n{pn}rules — Show current rules"
    }
  },

  // ---------- COMMAND PART ----------
  onStart: async function ({ message, event, args, threadsData }) {
    const threadID = event.threadID;
    const content = args.join(" ");

    if (args[0] === "setrules") {
      const rulesText = content.slice(8).trim();
      if (!rulesText)
        return message.reply("⚙️ | Please provide rules text after setrules!");
      await threadsData.set(threadID, { rules: rulesText });
      return message.reply("✅ | Group rules successfully set!");
    }

    if (args[0] === "rules") {
      const rules =
        (await threadsData.get(threadID, "rules")) ||
        "🤗 Welcome to our group!\n1️⃣ Be respectful you cannot use bad language.\n2️⃣ No spam.\n3️⃣ Respect admins.\n💫 Protected by Helal Islam Bot";
      return message.reply(`📜 | Group Rules:\n\n${rules}`);
    }

    return message.reply(
      "⚙️ | Use:\n.autorules setrules <text>\n.autorules rules"
    );
  },

  // ---------- EVENT PART ----------
  onEvent: async function ({ event, api, threadsData }) {
    const { logMessageType, logMessageData, threadID } = event;

    // When new members join
    if (logMessageType === "log:subscribe") {
      const rules =
        (await threadsData.get(threadID, "rules")) ||
        "🤗 Welcome to our group!\n1️⃣ Be respectful You cannot use bad language..\n2️⃣ No spam.\n3️⃣ Respect admins.\n→ by Helal Islam Bot";

      try {
        const groupInfo = await api.getThreadInfo(threadID);
        const groupName = groupInfo.name || "this group";
        const addedMembers = logMessageData.addedParticipants.map(
          (m) => m.fullName
        );

        for (let name of addedMembers) {
          await api.sendMessage(
            `🎉 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 ${name} 🎉\n\n🌌 𝗧𝗼 ${groupName} 🌌\n\n📜 𝗥𝗨𝗟𝗘𝗦:\n${rules}\n\n👑 Developed by: Helal Islam\n🚀 Powered by: Digital AI System`,
            threadID
          );
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
};
