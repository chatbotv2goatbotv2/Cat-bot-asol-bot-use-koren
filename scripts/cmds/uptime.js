const os = require("os");

module.exports = {
  config: {
    name: "uptime",
    version: "2.0",
    author: "Helal Islam",
    role: 0,
    shortDescription: "Show stylish bot uptime",
    longDescription: "Animated uptime loader with final time details",
    category: "⚙️ SYSTEM",
  },

  onStart: async function({ api, event }) {
    const start = Date.now();
    let loadingStages = [
      "▱▱▱▱▱▱ 0%",
      "▰▱▱▱▱▱ 20%",
      "▰▰▱▱▱▱ 40%",
      "▰▰▰▱▱▱ 60%",
      "▰▰▰▰▱▱ 80%",
      "▰▰▰▰▰▰ 100%"
    ];

    let msg = await api.sendMessage("⚙️ Loading uptime...\n▱▱▱▱▱▱ 0%", event.threadID);
    let i = 1;

    for (const stage of loadingStages.slice(1)) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await api.editMessage(`⚙️ Loading uptime...\n${stage}`, msg.messageID);
    }

    const uptimeSeconds = process.uptime();
    const days = Math.floor(uptimeSeconds / (3600 * 24));
    const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);

    const uptimeText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    const memoryUsage = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
    const cpuModel = os.cpus()[0].model;

    const finalText = `✅ | 𝗕𝗼𝘁 𝗨𝗽𝘁𝗶𝗺𝗲 𝗥𝗲𝗽𝗼𝗿𝘁\n\n` +
      `🕒 𝗧𝗶𝗺𝗲 𝗨𝗽: ${uptimeText}\n` +
      `💾 𝗠𝗲𝗺𝗼𝗿𝘆: ${memoryUsage} MB\n` +
      `💻 𝗖𝗣𝗨: ${cpuModel}\n` +
      `⚡ 𝗦𝘁𝗮𝘁𝘂𝘀: 𝗢𝗻𝗹𝗶𝗻𝗲 ✅\n\n` +
      `🔰 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗕𝘆 𝐇𝐞𝐥𝐚𝐥 𝐈𝐬𝐥𝐚𝐦`;

    await new Promise(resolve => setTimeout(resolve, 800));
    await api.editMessage(finalText, msg.messageID);
  }
};
