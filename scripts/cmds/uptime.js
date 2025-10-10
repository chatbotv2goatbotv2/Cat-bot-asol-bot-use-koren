const os = require("os");
const moment = require("moment");

module.exports = {
  config: {
    name: "uptime",
    version: "3.0",
    author: "Helal x GPT",
    countDown: 5,
    role: 0,
    shortDescription: "Show bot uptime, ping & system info",
    longDescription: "Check how long the bot has been online with ping and hardware details.",
    category: "system",
    guide: "{p}uptime"
  },

  onStart: async function ({ api, event }) {
    try {
      const start = Date.now();

      // Ping test
      await api.sendMessage("⏳ Checking system status...", event.threadID);
      const ping = Date.now() - start;

      // Uptime
      const totalSeconds = process.uptime();
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor(totalSeconds / 3600) % 24;
      const minutes = Math.floor(totalSeconds / 60) % 60;
      const seconds = Math.floor(totalSeconds % 60);

      let uptimeMsg = "";
      if (days > 0) uptimeMsg += `🗓️ ${days} day${days > 1 ? "s" : ""} `;
      uptimeMsg += `⏰ ${hours}h ${minutes}m ${seconds}s`;

      // Time
      const now = moment().format("dddd, MMMM Do YYYY, h:mm:ss A");

      // System Info
      const platform = os.platform();
      const cpuModel = os.cpus()[0].model;
      const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
      const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
      const usedMem = (totalMem - freeMem).toFixed(2);

      // Stylish message
      const msg = `✨ 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗨𝗦 ✨
──────────────────────────
⚙️ 𝗨𝗽𝘁𝗶𝗺𝗲: ${uptimeMsg}
⚡ 𝗣𝗶𝗻𝗴: ${ping} ms
🕓 𝗧𝗶𝗺𝗲: ${now}
──────────────────────────
💻 𝗦𝗬𝗦𝗧𝗘𝗠 𝗜𝗡𝗙𝗢 💡
🧠 CPU: ${cpuModel}
🪟 Platform: ${platform}
📦 RAM: ${usedMem}GB / ${totalMem}GB
──────────────────────────
🤖 𝗕𝗼𝘁 𝗼𝗻𝗹𝗶𝗻𝗲 & 𝗿𝗲𝗮𝗱𝘆 𝘁𝗼 𝘀𝗲𝗿𝘃𝗲! 🚀`;

      api.sendMessage(msg, event.threadID, event.messageID);
    } catch (err) {
      api.sendMessage(`❌ Error while checking uptime: ${err.message}`, event.threadID, event.messageID);
    }
  }
};