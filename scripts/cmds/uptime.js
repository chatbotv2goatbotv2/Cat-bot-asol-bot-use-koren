module.exports = {
  config: {
    name: "uptime",
    version: "3.0",
    author: "Helal Islam",
    category: "system",
    shortDescription: "Show bot uptime with glow animation",
    longDescription: "Displays total running time of the bot with a glowing animated loading effect",
    guide: "{pn}uptime"
  },

  onStart: async function ({ message }) {
    const glowColors = ["✨", "💫", "⚡", "🌟", "🔥"];
    const randomGlow = glowColors[Math.floor(Math.random() * glowColors.length)];

    const loadingStages = [
      `${randomGlow} Initializing System...`,
      `⚡ Loading... ▰▱▱▱▱▱ 10%`,
      `⚡ Loading... ▰▰▱▱▱▱ 25%`,
      `⚡ Loading... ▰▰▰▱▱▱ 50%`,
      `⚡ Loading... ▰▰▰▰▱▱ 75%`,
      `⚡ Loading... ▰▰▰▰▰▰ 100%`,
      `✅ ${randomGlow} System Ready!`
    ];

    // Simulated animated loading
    for (const stage of loadingStages) {
      await message.reply(stage);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Calculate uptime
    const uptime = process.uptime();
    const days = Math.floor(uptime / (60 * 60 * 24));
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const minutes = Math.floor((uptime / 60) % 60);
    const seconds = Math.floor(uptime % 60);

    const now = new Date();
    const timeString = now.toLocaleString("en-GB", { timeZone: "Asia/Dhaka" });

    // Stylish glow panel
    const finalMsg = 
`${randomGlow}╭───────────────────────────────╮
${randomGlow}│  🌈 𝗕𝗢𝗧 𝗨𝗣𝗧𝗜𝗠𝗘 𝗦𝗧𝗔𝗧𝗨𝗦 🌈
${randomGlow}│───────────────────────────────│
${randomGlow}│ 🕒 𝗧𝗶𝗺𝗲 𝗦𝗶𝗻𝗰𝗲 𝗟𝗮𝘂𝗻𝗰𝗵:
${randomGlow}│     ${days}d ${hours}h ${minutes}m ${seconds}s
${randomGlow}│ ⚙️ 𝗣𝗿𝗼𝗴𝗿𝗲𝘀𝘀: ▰▰▰▰▰▰ 100%
${randomGlow}│ 📅 𝗗𝗮𝘁𝗲: ${timeString}
${randomGlow}│ 🟢 𝗦𝘁𝗮𝘁𝘂𝘀: 𝗢𝗡𝗟𝗜𝗡𝗘 & 𝗦𝗧𝗔𝗕𝗟𝗘
${randomGlow}│ 💖 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗕𝘆: 𝐇𝐞𝐥𝐚𝐥 𝐈𝐬𝐥𝐚𝐦
${randomGlow}╰───────────────────────────────╯`;

    await message.reply(finalMsg);
  }
};
