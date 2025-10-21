module.exports = {
  config: {
    name: "antigali",
    aliases: ["antibad"],
    version: "8.2",
    author: "Helal",
    countDown: 0,
    role: 0,
    shortDescription: "Auto detect bad words & kick offenders",
    longDescription: "Detects Bengali & English bad words automatically. Warns 7 times, then removes user if bot is admin. Admins are exempt.",
    category: "🛡️ Moderation",
  },

  onStart: async function({ api, event }) {
    return api.sendMessage(
      "🛡️ Anti-BadWords system always active!\nAdmins are exempt. ✅",
      event.threadID
    );
  },

  onChat: async function({ api, event }) {
    try {
      if (!event.body) return;
      const msg = event.body.toLowerCase();
      const { threadID, senderID, messageID } = event;

      const badWords = [
        "কুত্তার বাচ্চা","মাগী","মাগীচোদ","চোদা","চুদ","চুদা","চুদামারান",
        "চুদির","চুত","চুদি","চুতমারানি","চুদের বাচ্চা","shawya","বালের","বালের ছেলে","বালছাল",
        "বালছাল কথা","মাগীর ছেলে","রান্ডি","রান্দি","রান্দির ছেলে","বেশ্যা","বেশ্যাপনা",
        "khanki","mgi","তোকে চুদি","তুই চুদ","fuck","f***","fck","fuk","fking","fing","fucking",
        "motherfucker","guyar","mfer","motherfuer","mthrfckr","putki","abdullak chudi","abdullak xudi","jawra","bot chudi","bastard",
        "asshole","a$$hole","a*hole","dick","fu***k","cock","prick","pussy","mariak cudi","cunt","fag","faggot","retard",
        "magi","magir","magirchele","land","randir","randirchele","chuda","chud","chudir","chut","chudi","chutmarani",
        "tor mayer","tor baper","toke chudi","chod","jairi","khankir pola","khanki magi"
      ];

      // No bad word = ignore
      if (!badWords.some(word => msg.includes(word))) return;

      // Get thread info to check admin
      const threadInfo = await api.getThreadInfo(threadID);
      const isAdmin = (uid) => threadInfo.adminIDs.some(a => (a.id || a) == uid);

      // 🛑 If sender is admin → ignore
      if (isAdmin(senderID)) return;

      global.antigali = global.antigali || {};
      if (!global.antigali[threadID]) global.antigali[threadID] = {};
      if (!global.antigali[threadID][senderID]) global.antigali[threadID][senderID] = 0;

      global.antigali[threadID][senderID] += 1;
      const warnCount = global.antigali[threadID][senderID];

      const userInfo = await api.getUserInfo(senderID);
      const name = userInfo[senderID]?.name || "User";

      const warnMsgs = [
        "😶 First Warning!",
        "😬 Second Warning!",
        "😐 Third Warning!",
        "😕 Fourth Warning!",
        "😠 Fifth Warning!",
        "😡 Sixth Warning!",
        "💀 Seventh Warning! You will be removed!"
      ];

      await api.sendMessage(
`⚠️ PROHIBITED LANGUAGE DETECTED
👤 User: ${name}
📛 Warning: ${warnCount}/7
${warnMsgs[warnCount - 1] || ""}`,
        threadID,
        messageID
      );

      setTimeout(() => api.unsendMessage(messageID).catch(() => {}), 60000);

      if (warnCount >= 7) {
        const botID = api.getCurrentUserID();

        if (!isAdmin(botID)) {
          global.antigali[threadID][senderID] = 6;
          return api.sendMessage(
            `⚠️ Cannot remove ${name} — Bot is not an admin!`,
            threadID
          );
        }

        try {
          await api.removeUserFromGroup(senderID, threadID);
          global.antigali[threadID][senderID] = 0;
          return api.sendMessage(`🚨 ${name} has been removed (7 warnings).`, threadID);
        } catch {
          global.antigali[threadID][senderID] = 6;
          return api.sendMessage(`⚠️ Failed to remove ${name}, check permissions.`, threadID);
        }
      }
    } catch (err) {
      console.error("AntiGali Error:", err);
    }
  }
};