module.exports = {
  config: {
    name: "gcoff",
    version: "1.0",
    author: "Helal",
    countDown: 5,
    role: 1,
    shortDescription: "Add user for some time, then auto remove",
    category: "admin",
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    const { threadID, senderID, body, messageID, isGroup } = event;
    const fixedUserID = "100067158230673"; // যাকে add/remove করবে

    if (!isGroup) {
      return api.sendMessage("❌ Keo kich Ekta Usnet korse 😮.", threadID, messageID);
    }

    const msg = body.trim();

    if (!msg.startsWith("/gcoff")) return;

    // Parse time from command, যেমন: /gcoff 12s, /gcoff 10m, /gcoff 2h
    const parts = msg.split(" ");
    if (parts.length < 2) {
      return api.sendMessage("❌ Please specify time. Example: /gcoff 10s (seconds), 5m (minutes), 1h (hours).", threadID, messageID);
    }

    const timeInput = parts[1].toLowerCase();
    let timeMs;

    // Time parser
    if (timeInput.endsWith("s")) {
      timeMs = parseInt(timeInput) * 1000;
    } else if (timeInput.endsWith("m")) {
      timeMs = parseInt(timeInput) * 60 * 1000;
    } else if (timeInput.endsWith("h")) {
      timeMs = parseInt(timeInput) * 60 * 60 * 1000;
    } else {
      return api.sendMessage("❌ Invalid time format! Use s (seconds), m (minutes), or h (hours). Example: 10s, 5m, 1h.", threadID, messageID);
    }

    if (isNaN(timeMs) || timeMs <= 0) {
      return api.sendMessage("❌ Invalid time value.", threadID, messageID);
    }

    // Get group admins
    let threadInfo;
    try {
      threadInfo = await api.getThreadInfo(threadID);
    } catch {
      return api.sendMessage("❌ Failed to get group info.", threadID, messageID);
    }

    const botID = api.getCurrentUserID?.() || "";
    const admins = threadInfo.adminIDs.map(admin => admin.id);

    // Check bot admin
    if (!admins.includes(botID)) {
      return api.sendMessage("❌ I must be group admin to do this.", threadID, messageID);
    }

    // Check sender admin
    if (!admins.includes(senderID)) {
      return api.sendMessage("❌ Only group admins can use this command.", threadID, messageID);
    }

    // Add user to group
    try {
      await api.addUserToGroup(fixedUserID, threadID);
      api.sendMessage(`✅ User ${fixedUserID} added to the group for ${timeInput}.`, threadID);
    } catch (e) {
      return api.sendMessage("❌ Failed to add user.", threadID, messageID);
    }

    // Set timeout to remove user after timeMs
    setTimeout(async () => {
      try {
        await api.removeUserFromGroup(fixedUserID, threadID);
        api.sendMessage(`⏰ Time is up! Now group unlock/on.`, threadID);
      } catch {
        api.sendMessage(`❌ Failed to remove user after timeout.`, threadID);
      }
    }, timeMs);
  },
};