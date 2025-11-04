const config = require("../../config.json");

module.exports = {
  config: {
    name: "fork",
    version: "1.0",
    author: "Helal",
    countDown: 5,
    role: 2, // Only admin (owner)
    shortDescription: "Show the fork link (Owner only)",
    category: "system",
  },

  onStart: async function ({ api, event }) {
    const ownerID = config.adminBot || []; // config.json theke admin nibe
    const senderID = event.senderID;

    // Only owner check
    if (!ownerID.includes(senderID)) {
      return api.sendMessage("❌ Only owner can use this command!", event.threadID, event.messageID);
    }

    // Fork link (file theke fixed)
    const forkLink = "https://github.com/mohammadhelal323/Helal-.git";

    // Reply message
    api.sendMessage(
      `👨‍💻 Helal Islam Fork link:\n${forkLink}`,
      event.threadID,
      event.messageID
    );
  },
};