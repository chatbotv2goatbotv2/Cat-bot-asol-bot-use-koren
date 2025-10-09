const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "autosenduptime",
    version: "1.0",
    author: "Helal",
    countDown: 0,
    role: 2,
    description: "Auto send uptime status in all groups every 12 minutes"
  },

  onStart: async function({ api }) {
    const sendUptime = async () => {
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      const timeNow = moment.tz("Asia/Dhaka").format("hh:mm A, DD/MM/YYYY");

      const message = `🌺 𝐂𝐚𝐭 𝐢𝐬 𝐫𝐮𝐧𝐧𝐢𝐧𝐠 ✅\n` +
                      `⏱️ 𝐔𝐩𝐭𝐢𝐦𝐞: ${hours}h ${minutes}m ${seconds}s\n` +
                      `🕒 ${timeNow}\n` +
                      `━━━━━━━━━━━━━━━`;

      try {
        const threadList = await api.getThreadList(100, null, ["INBOX"]);
        for (const thread of threadList) {
          if (thread.isGroup) {
            api.sendMessage(message, thread.threadID);
          }
        }
      } catch (err) {
        console.error("AutoSend Error:", err);
      }
    };

    // 12 মিনিট = 12 * 60 * 1000 ms
    sendUptime();
    setInterval(sendUptime, 12 * 60 * 1000);
  }
};