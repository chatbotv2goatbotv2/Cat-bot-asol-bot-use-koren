const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "fm",
    version: "4.0",
    author: "Helal Islam",
    description: "Premium fullscreen collage of all group members' profile pictures with round shapes and stylish layout",
    commandCategory: "GROUP",
    usages: ".fm",
    cooldowns: 10
  },

  onStart: async function({ api, event }) {
    try {
      const info = await api.getThreadInfo(event.threadID);
      if (!info || !info.participantIDs) {
        return api.sendMessage("⚠️ Couldn't get group members.", event.threadID);
      }

      const members = info.participantIDs || [];
      const admins = info.adminIDs?.map(a => a.id) || [];
      const groupName = info.threadName || "Unnamed Group";

      if (members.length === 0)
        return api.sendMessage("⚠️ No members found.", event.threadID);

      api.sendMessage(`🎨 Preparing premium collage of ${members.length} members...`, event.threadID);

      const width = 1920, height = 1080;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Premium gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#1e3c72");
      gradient.addColorStop(1, "#2a5298");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Group name header
      ctx.font = "bold 80px Sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(`🌌 ${groupName.toUpperCase()} 🌌`, width / 2, 100);

      // Profile pics placement
      const radius = 70;
      const margin = 20;
      let x = radius + margin;
      let y = 200;

      for (let i = 0; i < members.length; i++) {
        try {
          const id = members[i];
          const url = `https://graph.facebook.com/${id}/picture?width=200&height=200&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
          const res = await axios.get(url, { responseType: "arraybuffer" });
          const img = await loadImage(Buffer.from(res.data, "binary"));

          // Draw round profile pic
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, x - radius, y - radius, radius * 2, radius * 2);
          ctx.restore();

          // White border
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2, true);
          ctx.lineWidth = 4;
          ctx.strokeStyle = "#ffffff";
          ctx.stroke();

          // Next position
          x += radius * 2 + margin;
          if (x + radius > width) {
            x = radius + margin;
            y += radius * 2 + margin;
          }
        } catch (err) {
          console.log("⚠️ Error fetching profile:", err.message);
        }
      }

      // Footer with emojis & info
      const adminCount = admins.length;
      const memberCount = members.length;
      ctx.font = "bold 40px Sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(`👑 Admins: ${adminCount} | 👥 Members: ${memberCount} | 🚀 Powered by Digital AI`, width / 2, height - 50);

      const out = path.join(__dirname, `fm_fullscreen_${Date.now()}.jpg`);
      fs.writeFileSync(out, canvas.toBuffer("image/jpeg"));

      await api.sendMessage(
        {
          body: `🌟 ${groupName} - Fullscreen Collage 🌟\n👑 Admins: ${adminCount}\n👥 Members: ${memberCount}`,
          attachment: fs.createReadStream(out)
        },
        event.threadID
      );

      fs.unlinkSync(out);
    } catch (e) {
      console.error(e);
      api.sendMessage("❌ Error creating premium collage.", event.threadID);
    }
  }
};
