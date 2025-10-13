const fs = require("fs-extra");
const path = require("path");
const https = require("https");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.19",
    author: "HELAL",
    countDown: 10,
    role: 0,
    shortDescription: { en: "View command usage and list all commands directly" },
    longDescription: { en: "View command usage and list all commands directly" },
    category: "info",
    guide: { en: "{pn} / help cmdName" },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);

    // === Video setup ===
    const videoURL = "https://i.imgur.com/SeCKeXp.mp4"; // your fixed video link
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    const videoPath = path.join(cacheDir, "help_video.mp4");

    // Download video if not cached
    if (!fs.existsSync(videoPath)) {
      try {
        await downloadFile(videoURL, videoPath);
      } catch (e) {
        console.error("Video download failed:", e);
      }
    }

    // === If no argument: show command list ===
    if (args.length === 0) {
      const categories = {};
      let msg = `╭──🥀BOT📌──╮\n│\n│   All Command\n│`;

      // Group commands by category
      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;
        const category = value.config.category || "Uncategorized";
        if (!categories[category]) categories[category] = [];
        categories[category].push(name);
      }

      // Build message
      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += `\n│\n│ ╭─♦────♦───♦─\n│ │ 『 ${category.toUpperCase()} 』`;
          const names = categories[category].sort();
          for (let i = 0; i < names.length; i += 3) {
            const cmds = names.slice(i, i + 3).map((item) => `✯${item}`);
            msg += `\n│ │ ${cmds.join("  ")}`;
          }
          msg += `\n│ ╰──★──✯──★──✯`;
        }
      });

      const totalCommands = commands.size;
      msg += `\n│\n│ CONTACT FACEBOOK:\n│ https://www.facebook.com/profile.php?id=61568305950691\n│\n│ TOTAL COMMANDS: ${totalCommands}\n│\n│ ╰──────♦•♥•♦──────╯\n│ The end`;

      // === Reply once with video ===
      return message.reply({
        body: msg,
        attachment: fs.existsSync(videoPath) ? fs.createReadStream(videoPath) : undefined
      });
    }

    // === If user asks for a specific command ===
    const commandName = args[0].toLowerCase();
    const command = commands.get(commandName) || commands.get(aliases.get(commandName));

    if (!command) {
      return message.reply(`❌ Command "${commandName}" not found.`);
    }

    const configCommand = command.config;
    const roleText = roleTextToString(configCommand.role);
    const author = configCommand.author || "Unknown";
    const longDescription = configCommand.longDescription?.en || "No description";
    const guideBody = configCommand.guide?.en || "No guide available.";
    const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

    const response = `╭──Cat•Bot•Command──╮
│
│ ╭─♦─ CAT••BOT ──♦──♦
│ │ ${configCommand.name}
│ ├── INFO
│ │ Description: ${longDescription}
│ │ Other names: ${configCommand.aliases ? configCommand.aliases.join(", ") : "Do not have"}
│ │ Version: ${configCommand.version || "1.0"}
│ │ Role: ${roleText}
│ │ Time per command: ${configCommand.countDown || 1}s
│ ╰━━♦━━━♥━━♦
│
╰────────────╯`;

    return message.reply({
      body: response,
      attachment: fs.existsSync(videoPath) ? fs.createReadStream(videoPath) : undefined
    });
  },
};

// === Role text helper ===
function roleTextToString(roleText) {
  switch (roleText) {
    case 0: return "0 (All users)";
    case 1: return "1 (Group administrators)";
    case 2: return "2 (Admin bot)";
    default: return "Unknown role";
  }
}

// === Download helper ===
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        fs.unlink(dest, () => {});
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
                                }
