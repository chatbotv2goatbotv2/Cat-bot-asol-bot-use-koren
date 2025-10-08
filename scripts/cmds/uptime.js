const moment = require("moment");

module.exports = {
  config: {
    name: "uptime",
    version: "1.5",
    author: "Helal_Islam",
    countDown: 5,
    role: 0,
    shortDescription: "Show bot uptime in stylish glow mode",
    longDescription: "Displays the bot uptime with animated progress bar using message edits",
    category: "system",
  },

  onStart: async function ({ api, event }) {
    const start = Date.now();
    const messageID = await new Promise((resolve) => {
      api.sendMessage("⚙️ Loading... ▱▱▱▱▱▱ 0%", event.threadID, (err, info) => {
        if (!err) resolve(info.messageID);
      });
    });

    // Fancy progress with glow color transitions 🌈
    const bars = [
      { text: "▰▱▱▱▱▱ 10%", color: "🔴" },
      { text: "▰▰▱▱▱▱ 30%", color: "🟠" },
      { text: "▰▰▰▱▱▱ 50%", color: "🟡" },
      { text: "▰▰▰▰▱▱ 70%", color: "🟢" },
      { text: "▰▰▰▰▰▱ 90%", color: "🔵" },
      { text: "▰▰▰▰▰▰ 100%", color: "🟣" },
    ];

    for (let i = 0; i < bars.length; i++) {
      await new Promise((r) => setTimeout(r, 600));
      api.editMessage(`${bars[i].color} Loading... ${bars[i].text}`, messageID);
    }

    const uptime = process.uptime();
    const days = Math.floor(uptime / (3600 * 24));
    const hours = Math.floor((uptime % (3600 * 24)) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const formatted = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    await new Promise((r) => setTimeout(r, 800));

    const finalMsg = `
🌟╭──────────────────────────────╮
🌟│  🌈 BOT UPTIME STATUS 🌈
🌟│──────────────────────────────│
🌟│ 🕒 Uptime: ${formatted}
🌟│ ⚙️ Progress: ▰▰▰▰▰▰ 100%
🌟│ 📅 Date: ${moment().format("DD/MM/YYYY, HH:mm:ss")}
🌟│ 🟢 Status: ONLINE & STABLE
🌟│ 💖 Powered By: Helal Islam
🌟╰──────────────────────────────╯
`;

    api.editMessage(finalMsg, messageID);
  },
};
