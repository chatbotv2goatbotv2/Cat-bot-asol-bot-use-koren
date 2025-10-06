module.exports = {
  config: {
    name: "role",
    version: "7.0",
    author: "Helal Islam",
    role: 0,
    category: "utility",
    shortDescription: "Set & view group roles easily",
    longDescription: "Set custom roles for this group that can be viewed or deleted anytime",
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

  onStart: async function ({ message, args, event, threadsData }) {
    const threadID = event.threadID;
    let roles = await threadsData.get(threadID, "data.roles", {});

    if (args.length === 0)
      return message.reply(
        "⚙️ | Use:\n.setrole <role> <text>\n.role <role>\n.role list\n.role delete <role>"
      );

    const sub = args[0].toLowerCase();

    // delete
    if (sub === "delete") {
      const roleName = args[1]?.toLowerCase();
      if (!roleName) return message.reply("⚠️ | Please specify which role to delete!");
      if (!roles[roleName]) return message.reply("❌ | That role doesn’t exist!");
      delete roles[roleName];
      await threadsData.set(threadID, roles, "data.roles");
      return message.reply(`🗑️ | Role '${roleName}' deleted successfully!`);
    }

    // list
    if (sub === "list") {
      if (Object.keys(roles).length === 0)
        return message.reply("📂 | No roles set for this group yet!");
      let msg = "🌈 𝗥𝗢𝗟𝗘 𝗟𝗜𝗦𝗧 🌈\n\n";
      for (const [k, v] of Object.entries(roles))
        msg += `✨ ${k.toUpperCase()} ➜ ${v}\n`;
      return message.reply(msg);
    }

    // show role
    if (!args[1]) {
      const roleName = sub;
      const role = roles[roleName];
      if (!role) return message.reply("⚠️ | This role is not set yet!");
      return message.reply(`💫 | ${roleName.toUpperCase()} ➜ ${role}`);
    }

    // set role
    const roleName = sub;
    const roleText = args.slice(1).join(" ");
    roles[roleName] = roleText;
    await threadsData.set(threadID, roles, "data.roles");
    return message.reply(`✅ | Role '${roleName}' has been set to:\n✨ ${roleText}`);
  }
};
