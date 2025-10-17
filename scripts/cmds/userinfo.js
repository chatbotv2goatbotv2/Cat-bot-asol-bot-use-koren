module.exports = {
  config: {
    name: "userinfo",
    aliases: ["ui"],
    version: "3.0",
    author: "Helal",
    countDown: 5,
    role: 0,
    category: "utility",
    shortDescription: { en: "Show detailed user info (without link)" }
  },

  onStart: async function ({ message, event, api, usersData }) {
    try {
      const userID = Object.keys(event.mentions)[0] || event.senderID;
      const userInfo = await api.getUserInfo(userID);
      const user = userInfo[userID];
      const gender = user.gender === 2 ? "👦 Male" : user.gender === 1 ? "👧 Female" : "❓ Unknown";

      const name = user.name || "Unknown User";
      const vanity = user.vanity || "N/A";
      const isFriend = user.isFriend ? "✅ Yes" : "❌ No";
      const isBlocked = user.isBlocked ? "🚫 Yes" : "✅ No";

      // Extra details if stored in database
      const userData = await usersData.get(userID);
      const joinTime = userData?.createdAt ? new Date(userData.createdAt).toLocaleString("en-US", { timeZone: "Asia/Dhaka" }) : "N/A";
      const totalMsg = userData?.messageCount || 0;
      const role = userData?.role === 2 ? "👑 Admin" : userData?.role === 1 ? "🔧 Moderator" : "🧑‍💻 User";

      const msg = `
🧾 *USER INFORMATION*

👤 Name: ${name}
🆔 UID: ${userID}
⚧ Gender: ${gender}
⭐ Role: ${role}
💬 Messages Sent: ${totalMsg}
📅 Joined Bot: ${joinTime}
🤝 Friend: ${isFriend}
🚷 Blocked: ${isBlocked}
🔠 Username: ${vanity}

━━━━━━━━━━━━━━━━━━━
`;

      message.reply(msg);
    } catch (err) {
      console.error(err);
      message.reply("⚠️ Unable to fetch user info right now!");
    }
  }
};
