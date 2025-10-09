const { performance } = require("perf_hooks");

module.exports = {
  config: {
    name: "uptime",
    aliases: ["upt"],
    version: "6.0",
    author: "Helal",
    role: 0,
    shortDescription: "Show stylish bot uptime",
    category: "system"
  },

  onStart: async function ({ api, event }) {
    const startTime = performance.now();

    // uptime data
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const ram = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);

    // loading stages
    const loadSteps = [
      "▱▱▱▱▱▱ 0%",
      "▰▱▱▱▱▱ 20%",
      "▰▰▱▱▱▱ 40%",
      "▰▰▰▱▱▱ 60%",
      "▰▰▰▰▱▱ 80%",
      "▰▰▰▰▰▰ 100%"
    ];

    // first send loading message
    let msg = await api.sendMessage("⚙️ | Checking bot status...", event.threadID);

    // edit loading gradually
    for (let step of loadSteps) {
      await new Promise(r => setTimeout(r, 700));
      await api.editMessage(`🚀 Loading ${step}`, msg.messageID);
    }

    // final uptime message
    await new Promise(r => setTimeout(r, 700));
    const latency = (performance.now() - startTime).toFixed(0);

    const finalMsg = `
╭───『 🤖 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗨𝗦 』───╮
│⏱️ 𝗨𝗽𝘁𝗶𝗺𝗲: ${hours}h ${minutes}m ${seconds}s
│💾 𝗠𝗲𝗺𝗼𝗿𝘆: ${ram} MB
│⚡ 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲: ${latency}ms
│💫 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗕𝘆: Helal
╰──────────────────────╯
✨ Stay Cool & Stable 😎
`;

    api.editMessage(finalMsg, msg.messageID);
  }
};
