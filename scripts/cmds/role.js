const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "roles_data.json");

module.exports = {
  config: {
    name: "role",
    version: "5.0",
    author: "Helal Islam",
    role: 0,
    category: "utility",
    shortDescription: "Create, view and delete roles",
    longDescription: "Manage custom text roles that can be viewed later",
    guide: {
      en: `
🌈 Role System Commands 🌈
--------------------------------
.setrole <role> <text>  → Set a role
.role <role>            → Show that role
.role list              → Show all roles
.role delete <role>     → Delete a role`
    }
  },

  onStart: async function ({ message, args, event }) {
    // Make sure file exists
    if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify({}, null, 2));
    const data = JSON.parse(fs.readFileSync(dataPath));

    const threadID = event.threadID;
    if (!data[threadID]) data[threadID] = {};

    if (args.length === 0)
      return message.reply(
        "⚙️ | Use:\n.setrole <role> <text>\n.role <role>\n.role list\n.role delete <role>"
      );

    const sub = args[0].toLowerCase();

    // ---------- Delete ----------
    if (sub === "delete") {
      const roleName = args[1]?.toLowerCase();
      if (!roleName) return message.reply("⚠️ | Please specify which role to delete!");
      if (!data[threadID][roleName]) return message.reply("❌ | That role doesn’t exist!");
      delete data[threadID][roleName];
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      return message.reply(`🗑️ | Role '${roleName}' deleted successfully!`);
    }

    // ---------- List ----------
    if (sub === "list") {
      const roles = data[threadID];
      if (Object.keys(roles).length === 0)
        return message.reply("📂 | No roles set for this group!");
      let msg = "🌈 𝗥𝗢𝗟𝗘 𝗟𝗜𝗦𝗧 🌈\n";
      for (const [k, v] of Object.entries(roles))
        msg += `✨ ${k.toUpperCase()} ➜ ${v}\n`;
      return message.reply(msg);
    }

    // ---------- Show role ----------
    if (!args[1]) {
      const roleName = sub;
      const role = data[threadID][roleName];
      if (!role) return message.reply("⚠️ | This role is not set yet!");
      return message.reply(`💫 | ${roleName.toUpperCase()} ➜ ${role}`);
    }

    // ---------- Set role ----------
    const roleName = sub;
    const roleText = args.slice(1).join(" ");
    data[threadID][roleName] = roleText;
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return message.reply(`✅ | Role '${roleName}' has been set to:\n✨ ${roleText}`);
  }
};
