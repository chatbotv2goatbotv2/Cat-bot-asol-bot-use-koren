const { getThreadList, sendMessage } = global.api || {};

module.exports = {
  config: {
    name: "autosend",
    version: "2.0",
    author: "Helal + GPT",
    longDescription: "Auto message every 14 minutes to keep bot active",
    category: "system"
  },

  onLoad: async function () {
    // প্রতি 14 মিনিটে একবার করে বার্তা পাঠাবে
    const INTERVAL = 14 * 60 * 1000;

    const sendAutoMessage = async () => {
      try {
        const time = new Date().toLocaleTimeString("en-GB", { hour12: false });
        const message = `🌺 Cat is running ✅\n🕒 ${time}`;
        const threads = await global.api.getThreadList(50, null, ["INBOX"]);

        for (const t of threads) {
          if (t.isGroup && t.threadID) {
            await global.api.sendMessage(message, t.threadID);
          }
        }
        console.log(`[AutoSend] Sent message to all groups at ${time}`);
      } catch (err) {
        console.error("[AutoSend Error]:", err);
      }
    };

    // প্রথম বার ও interval-এ পাঠানো
    await sendAutoMessage();
    setInterval(sendAutoMessage, INTERVAL);
  }
};