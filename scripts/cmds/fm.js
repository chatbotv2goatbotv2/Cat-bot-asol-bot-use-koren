const Canvas = require("canvas");
const axios = require("axios");

module.exports = {
  config: {
    name: "fm",
    aliases: ["fmcollage", "profilecollage"],
    version: "1.0",
    author: "Helal",
    shortDescription: "Create Neon Circle Profile Collage of group members",
    longDescription: "Generates a round collage of group member profile pictures with neon rings",
    category: "fun",
    guide: "{pn}fm"
  },

  onStart: async function({ message, api, args, prefix }) {
    try {
      const threadID = message.threadID;
      const threadInfo = await api.getThreadInfo(threadID);
      const members = threadInfo.participants || [];

      if (!members.length) return message.reply("❌ No members found.");

      // --- Load profile pics ---
      const images = [];
      for (let mem of members) {
        try {
          const userInfo = await api.getUserInfo(mem.id);
          const picURL = userInfo[mem.id].profilePicUrl;
          const img = await Canvas.loadImage(picURL);
          images.push({ id: mem.id, img });
        } catch (e) {
          console.log("Profile pic load failed for: " + mem.id);
        }
      }

      // --- Canvas setup ---
      const size = 600;
      const canvas = Canvas.createCanvas(size, size);
      const ctx = canvas.getContext("2d");

      // --- Draw neon circles and images ---
      const total = images.length;
      const center = size / 2;
      const radius = 200;

      images.forEach((member, idx) => {
        const angle = (idx / total) * 2 * Math.PI;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);

        // Draw neon circle
        ctx.beginPath();
        ctx.arc(x, y, 35, 0, 2 * Math.PI);

        if (threadInfo.adminIDs?.some(a => a.id === member.id)) ctx.strokeStyle = "red"; // admin
        else if (member.id === message.senderID) ctx.strokeStyle = "blue"; // active sender
        else ctx.strokeStyle = "purple"; // others

        ctx.lineWidth = 5;
        ctx.stroke();

        // Draw profile pic inside circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(member.img, x - 30, y - 30, 60, 60);
        ctx.restore();
      });

      const buffer = canvas.toBuffer();
      return message.reply({ attachment: buffer });

    } catch (err) {
      console.log(err);
      return message.reply("❌ Error creating collage. Credit: Helal");
    }
  }
};
