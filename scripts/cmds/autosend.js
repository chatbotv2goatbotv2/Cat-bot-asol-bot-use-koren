module.exports = {
  config: {
    name: "uptimeauto",
    version: "1.0",
    author: "Helal",
    role: 0,
    shortDescription: "Auto send uptime message every 12 minutes",
    longDescription: "Sends 'Cat is running ✅' in all active groups every 12 minutes automatically",
    category: "system"
  },

  onStart: async function ({ api }) {
    // 12 minutes = 720000 ms
    const interval = 12 * 60 * 1000;

    setInterval(async () => {
      const threads = await api.getThreadList(100, null, ["INBOX"]);
      for (const thread of threads) {
        try {
          if (thread.isGroup && thread.name) {
            await api.sendMessage("🌺 Cat is running ✅", thread.threadID);
          }
        } catch (e) {
          console.log(`❌ Failed to send uptime message in: ${thread.threadID}`);
        }
      }
    }, interval);
  }
};