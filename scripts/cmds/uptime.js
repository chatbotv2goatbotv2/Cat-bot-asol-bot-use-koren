module.exports = {
  config: {
    name: "uptime",
    version: "3.0",
    author: "Helal Islam",
    countDown: 5,
    role: 0,
    shortDescription: "Check bot uptime with animated loading bar",
    longDescription: "Shows how long the bot has been running with cool animated emoji loading effect.",
    category: "system",
    guide: "{pn}uptime"
  },

  onStart: async function ({ message }) {
    const startTime = process.uptime();
    const hours = Math.floor(startTime / 3600);
    const minutes = Math.floor((startTime % 3600) / 60);
    const seconds = Math.floor(startTime % 60);

    const stages = [
      "▱▱▱▱▱▱ 0%",
      "▰▱▱▱▱▱ 20%",
      "▰▰▱▱▱▱ 40%",
      "▰▰▰▱▱▱ 60%",
      "▰▰▰▰▱▱ 80%",
      "▰▰▰▰▰▰ 100%"
    ];

    const msg = await message.reply("⚙️ Loading Uptime...");

    for (let i = 0; i < stages.length; i++) {
      await new Promise(res => setTimeout(res, 1000));
      await message.edit(msg.messageID, `⚙️ Loading Uptime...\n${stages[i]}`);
    }

    const uptimeMsg = 
`✅ 𝗕𝗢𝗧 𝗨𝗣𝗧𝗜𝗠𝗘 𝗥𝗘𝗣𝗢𝗥𝗧  
🕒 𝗧𝗜𝗠𝗘 𝗨𝗣: ${hours}h ${minutes}m ${seconds}s  
💾 𝗠𝗘𝗠𝗢𝗥𝗬 𝗨𝗦𝗘𝗗: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB  
⚡ 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬: 𝐇𝐞𝐥𝐚𝐥 𝐈𝐬𝐥𝐚𝐦`;

    await new Promise(res => setTimeout(res, 800));
    await message.edit(msg.messageID, uptimeMsg);
  }
};
