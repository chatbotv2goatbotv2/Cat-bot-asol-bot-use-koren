module.exports = {
  config: {
    name: "love",
    aliases: ["lovemeter"],
    version: "1.0",
    author: "Helal",
    countDown: 3,
    role: 0,
    category: "fun",
    shortDescription: { en: "Calculate love percentage between two names 💞" }
  },

  onStart: async function ({ message, args }) {
    if (args.length < 2) {
      return message.reply("💘 Usage: /love <Name1> <Name2>\nExample: /love Helal Sara");
    }

    const name1 = args[0];
    const name2 = args.slice(1).join(" ");
    const seed = name1.length * name2.length * Math.floor(Math.random() * 100);
    const percent = (seed % 100) + 1;

    let emoji = "💔";
    if (percent > 80) emoji = "💖💍";
    else if (percent > 60) emoji = "❤️";
    else if (percent > 40) emoji = "💘";
    else if (percent > 20) emoji = "💞";

    const messages = [
      "Perfect couple made in heaven 😍",
      "You two are meant to be ❤️",
      "Some ups and downs, but love is real 💕",
      "Needs more understanding 🤔",
      "Oof... maybe just friends 😅"
    ];
    const msgIndex = Math.min(Math.floor(percent / 20), 4);

    return message.reply(`💞 *Love Meter Result* 💞\n\n❤️ ${name1} + ${name2}\n💌 Compatibility: ${percent}% ${emoji}\n\n💬 ${messages[msgIndex]}`);
  }
};
