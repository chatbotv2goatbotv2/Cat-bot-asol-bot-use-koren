module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "commands"],
    version: "3.3",
    author: "Helal Islam",
    cooldowns: 5,
    role: 0,
    shortDescription: "Show all available commands",
    longDescription: "",
    category: "system"
  },

  onStart: async function ({ message, commands }) {
    const cmds = [...commands.values()]
      .map(cmd => `⚡ ${cmd.config.name}`)
      .join("\n");

    const msg = 
`╭══════════════════════════╮
        🤖 𝗗𝗜𝗚𝗜𝗧𝗔𝗟 𝗔𝗜 𝗠𝗘𝗡𝗨 💠
╰══════════════════════════╯

🌟 𝗔𝗩𝗔𝗜𝗟𝗔𝗕𝗟𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 🌟
━━━━━━━━━━━━━━━━━━
${cmds}
━━━━━━━━━━━━━━━━━━

⚙️ 𝗣𝗥𝗘𝗙𝗜𝗫: .
💬 𝗘𝗫𝗔𝗠𝗣𝗟𝗘: .help

👑 𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗗 𝗕𝗬: 𝗛𝗘𝗟𝗔𝗟 𝗜𝗦𝗟𝗔𝗠 💻
🔰 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬: 𝗛𝗘𝗟𝗔𝗟 𝗜𝗦𝗟𝗔𝗠 ⚡`;

    message.reply(msg);
  }
};
