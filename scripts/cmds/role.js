const fs = require("fs");
const path = require("path");
const roleFile = path.join(__dirname, "botData", "roles.json");

if (!fs.existsSync(path.dirname(roleFile))) fs.mkdirSync(path.dirname(roleFile), { recursive: true });
if (!fs.existsSync(roleFile)) fs.writeFileSync(roleFile, "{}");

module.exports = {
  config: {
    name: "setrole",
    aliases: ["role"],
    version: "2.0",
    author: "Helal Islam",
    shortDescription: "Set or view custom group roles",
    longDescription: "Set custom text for roles like Admin, Mod, Top etc. Works even after restart.",
    category: "system",
    guide: {
      en: "{pn} setrole <role> <text>\n{pn} role <role>\n{pn} role delete <role>"
    }
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const isGroupAdmin = role === 1 || role === 2;
    if (!isGroupAdmin) return message.reply("🚫 | Only Group Admin or Bot Admin can use this command.");

    const data = JSON.parse(fs.readFileSync(roleFile, "utf8"));
    const threadID = event.threadID;
    if (!data[threadID]) data[threadID] = {};

    const action = args[0]?.toLowerCase();
    const roleName = args[1]?.toLowerCase();
    const roleText = args.slice(2).join(" ");

    // --- Set Role ---
    if (action === "setrole" || action === "set") {
      if (!roleName || !roleText) return message.reply("⚠️ | Usage: .setrole <role> <text>");
      data[threadID][roleName] = roleText;
      fs.writeFileSync(roleFile, JSON.stringify(data, null, 2));
      return message.reply(`✅ | Role '${roleName}' has been set to:\n✨ ${roleText}`);
    }

    // --- View Role ---
    if (action === "role" && roleName) {
      if (data[threadID][roleName]) {
        return message.reply(`💫 | Role '${roleName}':\n${data[threadID][roleName]}`);
      } else {
        return message.reply(`⚠️ | This role is not set yet!`);
      }
    }

    // --- Delete Role ---
    if (action === "role" && args[1] === "delete") {
      const delName = args[2]?.toLowerCase();
      if (!delName) return message.reply("⚠️ | Usage: .role delete <role>");
      if (!data[threadID][delName]) return message.reply(`❌ | That role doesn't exist!`);
      delete data[threadID][delName];
      fs.writeFileSync(roleFile, JSON.stringify(data, null, 2));
      return message.reply(`🗑️ | Role '${delName}' has been deleted successfully!`);
    }

    // --- Show All Roles ---
    if (!action) {
      const roles = Object.keys(data[threadID]);
      if (roles.length === 0) return message.reply("⚠️ | No roles set yet!");
      let msg = "🌈 𝗦𝗘𝗧 𝗥𝗢𝗟𝗘𝗦 🌈\n\n";
      for (const [role, text] of Object.entries(data[threadID])) {
        msg += `⚡ ${role}: ${text}\n`;
      }
      return message.reply(msg);
    }

    return message.reply("⚙️ | Use:\n.setrole <role> <text>\n.role <role>\n.role delete <role>");
  }
};
