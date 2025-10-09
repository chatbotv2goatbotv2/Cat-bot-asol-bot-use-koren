const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "uptimeauto",
    version: "2.0",
    author: "Helal",
    category: "system",
    shortDescription: "Auto send uptime message in group",
  },

  onLoad: function ({ api }) {
    const INTERVAL = 12 * 60 * 1000; // 12 minutes (change if needed)

    setInterval(async () => {
      const now = moment().tz("Asia/Dhaka").format("hh:mm A, DD/MM/YYYY");
      const message = `🌺 Cat is running ✅\n🕒 ${now}`;

      // Fetch all groups (threads)
      const threads = await api.getThreadList(100, null, ["INBOX"]);
      for (const thread of threads) {
        if (thread.isGroup && thread.name) {
          try {
            api.sendMessage(message, thread.threadID);
          } catch (e) {
            console.log(`[Error] Couldn't send in: ${thread.threadID}`);
          }
        }
      }
    }, INTERVAL);
  },
};