module.exports = {
  config: {
    name: "calcu",
    aliases: ["calculator"],
    version: "1.0",
    author: "Helal + GPT-5",
    countDown: 3,
    role: 0,
    category: "utility",
    shortDescription: { en: "Simple calculator" }
  },

  onStart: async function ({ message, event, args }) {
    const expression = args.join(" ");
    if (!expression) {
      return message.reply("🧮 Please enter a math expression!\n\nExample:\n/calcu 25*4\n/calcu (10+5)/3");
    }

    try {
      // নিরাপদ evaluate
      if (/[^0-9+\-*/().% ]/.test(expression)) {
        return message.reply("⚠️ Invalid characters detected! Use only numbers and + - * / ( ) %");
      }

      const result = Function(`"use strict"; return (${expression})`)();
      message.reply(`✅ *Result:* ${result}`);
    } catch (err) {
      message.reply("❌ Error while calculating! Please check your expression.");
    }
  }
};
