const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname, "autoreply_data.json");

// Load saved memory
let memory = {};
if (fs.existsSync(dataFile)) {
  try {
    memory = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  } catch {
    memory = {};
  }
}

module.exports = {
  config: {
    name: "autoreply",
    aliases: ["ar"],
    version: "3.0",
    author: "Helal",
    countDown: 3,
    role: 0,
    category: "utility",
    shortDescription: { en: "Smart Auto Reply (Bangla + Banglish + permanent)" },
  },

  onStart: async function ({ message, args }) {
    const sub = args[0]?.toLowerCase();
    if (!sub) {
      return message.reply(
        "⚙️ AutoReply Commands:\n" +
        "/ar add <trigger> | <reply>\n" +
        "/ar remove <trigger>\n" +
        "/ar list\n" +
        "/ar clear\n\n" +
        "Example:\n/ar add hello | Hi! Kemon acho?"
      );
    }

    // Add trigger
    if (sub === "add") {
      const content = args.slice(1).join(" ");
      if (!content.includes("|"))
        return message.reply("❗ Use `|` to separate trigger & reply.\nExample:\n/ar add hello | Hi! Kemon acho?");
      const [trigger, reply] = content.split("|").map(t => t.trim());
      if (!trigger || !reply) return message.reply("⚠️ Invalid format!");
      memory[trigger.toLowerCase()] = reply;
      saveData();
      return message.reply(`✅ Added AutoReply!\n🔑 Trigger: ${trigger}\n💬 Reply: ${reply}`);
    }

    // Remove
    if (sub === "remove") {
      const trigger = args.slice(1).join(" ").toLowerCase();
      if (!trigger) return message.reply("❌ Usage: /ar remove <trigger>");
      if (!memory[trigger]) return message.reply("⚠️ No such trigger found!");
      delete memory[trigger];
      saveData();
      return message.reply(`🗑️ Removed AutoReply for '${trigger}'`);
    }

    // List
    if (sub === "list") {
      const data = Object.entries(memory);
      if (!data.length) return message.reply("📭 No AutoReply found!");
      let msg = "🧠 AutoReply List\n_____________________\n";
      for (const [key, val] of data) msg += `🔹 ${key} → ${val}\n`;
      return message.reply(msg);
    }

    // Clear all
    if (sub === "clear") {
      memory = {};
      saveData();
      return message.reply("🧹 Cleared all AutoReplies!");
    }
  },

  onChat: async function ({ event, message }) {
    const text = (event.body || "").toLowerCase();
    if (!text) return;

    const keys = Object.keys(memory);
    if (!keys.length) return;

    const found = keys.find(k => text.includes(k));
    if (!found) return;

    const reply = memory[found];

    // Detect Bangla
    const banglaChars = /[\u0980-\u09FF]/;
    const isBangla = banglaChars.test(text);

    let response = reply;
    if (!isBangla) {
      response = reply
        .replace(/আপনি/g, "apni")
        .replace(/তুমি/g, "tumi")
        .replace(/আমি/g, "ami")
        .replace(/ধন্যবাদ/g, "thanks")
        .replace(/ভালো/g, "valo")
        .replace(/কেমন/g, "kemon")
        .replace(/হয়/g, "hoy")
        .replace(/নাম/g, "nam");
    }

    return message.reply(response);
  }
};

// Save data function
function saveData() {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(memory, null, 2));
  } catch (err) {
    console.error("❌ Failed to save AutoReply data:", err);
  }
}
