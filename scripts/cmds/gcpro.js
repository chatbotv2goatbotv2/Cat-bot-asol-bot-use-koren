const groupProtect = new Map();

module.exports = {
  config: {
    name: "gcpro",
    version: "2.0",
    author: "Helal Islam",
    shortDescription: "Enable stylish group protection.",
    longDescription: "Protects your group from spam, name & emoji changes with neon-style warnings.",
    category: "group",
    guide: "{pn}gcpro [on/off]"
  },

  onStart: async function ({ message, args, event }) {
    const threadID = event.threadID;
    if (!args[0]) return message.reply("⚙️ Use: .gcpro [on/off]");

    if (args[0].toLowerCase() === "on") {
      groupProtect.set(threadID, { spam: {} });
      return message.reply("🛡️✨ 𝗚𝗿𝗼𝘂𝗽 𝗣𝗿𝗼𝘁𝗲𝗰𝘁𝗶𝗼𝗻 𝗠𝗼𝗱𝗲 𝗔𝗰𝘁𝗶𝘃𝗮𝘁𝗲𝗱 ✨🛡️");
    }

    if (args[0].toLowerCase() === "off") {
      groupProtect.delete(threadID);
      return message.reply("🔓 Group Protection Disabled ❌");
    }
  },

  onEvent: async function ({ event, api }) {
    const { threadID, author, type } = event;

    if (!groupProtect.has(threadID)) return;
    const data = groupProtect.get(threadID);

    // 🏷️ Prevent group name change
    if (event.logMessageType === "log:thread-name") {
      api.sendMessage("🚫❌ Group name change is not allowed under 🛡️ Protection Mode!", threadID);
      api.changeThreadTitle("🌌 𝗣𝗿𝗼𝘁𝗲𝗰𝘁𝗲𝗱 𝗚𝗿𝗼𝘂𝗽 🌌", threadID);
    }

    // 💠 Prevent emoji/reaction change
    if (event.logMessageType === "log:thread-icon") {
      api.sendMessage("💢 Reaction or emoji change is 🔒 locked by protection!", threadID);
    }

    // 🚨 Anti-spam system
    if (type === "message") {
      const now = Date.now();
      if (!data.spam[author]) data.spam[author] = [];
      data.spam[author].push(now);
      data.spam[author] = data.spam[author].filter(t => now - t < 8000);

      if (data.spam[author].length > 5) {
        api.sendMessage("⚠️ [𝗪𝗔𝗥𝗡𝗜𝗡𝗚] Stop spamming or you’ll be muted! 🚫", threadID);
      }
    }
  }
};
