const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "fm",
    aliases: ["facemembers", "face"],
    version: "5.0",
    author: "Helal",
    shortDescription: "Show group members with neon collage style.",
    longDescription: "Creates a beautiful neon collage showing group members — Admins (Red), Top (Blue), Others (Purple).",
    category: "system",
    guide: "{pn}fm"
  },

  onStart: async function ({ api, event, message }) {
    try {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const members = threadInfo.participantIDs || [];
      const admins = threadInfo.adminIDs?.map(a => a.id) || [];
      const groupName = threadInfo.threadName || "Unnamed Group";

      if (!members.length) return message.reply("⚠️ No members found in this group!");

      message.reply(`🎨 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐧𝐠 𝐍𝐞𝐨𝐧 𝐂𝐨𝐥𝐥𝐚𝐠𝐞 𝐟𝐨𝐫 ${members.length} 𝐦𝐞𝐦𝐛𝐞𝐫𝐬...`);

      // Canvas Setup
      const width = 1920, height = 1080;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Background Gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#0f0c29");
      gradient.addColorStop(0.5, "#302b63");
      gradient.addColorStop(1, "#24243e");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Title
      ctx.font = "bold 80px Sans-serif";
      ctx.fillStyle = "#00ffff";
      ctx.textAlign = "center";
      ctx.shadowColor = "#00ffff";
      ctx.shadowBlur = 30;
      ctx.fillText(groupName.toUpperCase(), width / 2, 100);
      ctx.shadowBlur = 0;

      // Grid Setup
      const radius = 65;
      const margin = 20;
      const perRow = Math.floor(width / (radius * 2 + margin));
      let x = radius + margin;
      let y = 200;

      // Random Top members
      const topMembers = members.sort(() => 0.5 - Math.random()).slice(0, 10);

      for (let id of members) {
        try {
          const url = `https://graph.facebook.com/${id}/picture?width=200&height=200&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
          const imgBuffer = (await axios.get(url, { responseType: "arraybuffer" })).data;
          const img = await loadImage(Buffer.from(imgBuffer, "binary"));

          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, x - radius, y - radius, radius * 2, radius * 2);
          ctx.restore();

          // Neon Border Color Logic
          let neonColor = "#a020f0"; // purple default
          if (admins.includes(id)) neonColor = "#ff0040"; // red for admin
          else if (topMembers.includes(id)) neonColor = "#00bfff"; // blue for top members

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2, true);
          ctx.strokeStyle = neonColor;
          ctx.lineWidth = 6;
          ctx.shadowColor = neonColor;
          ctx.shadowBlur = 25;
          ctx.stroke();
          ctx.shadowBlur = 0;

          x += radius * 2 + margin;
          if (x + radius > width) {
            x = radius + margin;
            y += radius * 2 + margin;
          }
        } catch (e) {
          console.log(`⚠️ Error loading profile ${id}: ${e.message}`);
        }
      }

      // Footer Info
      ctx.font = "bold 36px Sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.shadowColor = "#00ffff";
      ctx.shadowBlur = 15;
      ctx.fillText(`👑 Admins: ${admins.length} | 👥 Members: ${members.length}`, width / 2, height - 50);
      ctx.shadowBlur = 0;

      // Save & Send
      const filePath = path.join(__dirname, "neon_group.jpg");
      fs.writeFileSync(filePath, canvas.toBuffer("image/jpeg"));

      await api.sendMessage(
        {
          body: `🌌 𝗡𝗲𝗼𝗻 𝗚𝗿𝗼𝘂𝗽 𝗖𝗼𝗹𝗹𝗮𝗴𝗲\n📸 ${groupName}\n👑 Admins: ${admins.length}\n👥 Members: ${members.length}`,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID
      );

      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(err);
      message.reply("❌ Error creating neon collage!");
    }
  }
};
