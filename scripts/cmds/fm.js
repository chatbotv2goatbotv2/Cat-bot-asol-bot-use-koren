const Jimp = require("jimp");

module.exports = {
  config: {
    name: "fm",
    aliases: ["funmosaic", "fmpic"],
    version: "1.0",
    author: "Helal", // Author credit
    shortDescription: "Create a group profile collage with neon circles.",
    longDescription: "Collect all group members profile pics and create a single round collage with neon circle glow effect: red for admin, blue for active, purple for others.",
    category: "fun",
    guide: "{pn}fm"
  },

  onStart: async function({ message, api }) {
    try {
      const threadID = message.threadID;
      const threadInfo = await api.getThreadInfo(threadID);
      const members = threadInfo.participants;

      // --- Canvas setup ---
      const canvasSize = 1500;
      const image = new Jimp(canvasSize, canvasSize, 0x00000000);

      const radius = 60;
      const margin = 20;
      const membersPerRow = Math.ceil(Math.sqrt(members.length));
      const step = (canvasSize - margin * 2) / membersPerRow;

      // --- Draw round profile with neon circle ---
      async function drawNeonProfile(x, y, url, neonColor) {
        const avatar = await Jimp.read(url);
        avatar.resize(radius * 2, radius * 2);

        // Circular mask
        const mask = new Jimp(radius * 2, radius * 2, 0x00000000);
        mask.scan(0, 0, mask.bitmap.width, mask.bitmap.height, function(px, py, idx) {
          const dx = px - radius;
          const dy = py - radius;
          if (dx * dx + dy * dy <= radius * radius) mask.bitmap.data[idx + 3] = 255;
        });
        avatar.mask(mask, 0, 0);

        // Neon glow border
        const glowSize = 12;
        const glow = new Jimp(radius * 2 + glowSize * 2, radius * 2 + glowSize * 2, 0x00000000);

        const glowCircle = new Jimp(glow.bitmap.width, glow.bitmap.height, neonColor);
        const glowMask = new Jimp(glow.bitmap.width, glow.bitmap.height, 0x00000000);
        const newRadius = radius + glowSize;
        glowMask.scan(0, 0, glowMask.bitmap.width, glowMask.bitmap.height, function(px, py, idx) {
          const dx = px - newRadius;
          const dy = py - newRadius;
          if (dx * dx + dy * dy <= newRadius * newRadius) glowMask.bitmap.data[idx + 3] = 150; // semi-transparent glow
        });
        glowCircle.mask(glowMask, 0, 0);
        glow.composite(glowCircle, 0, 0);

        image.composite(glow, x - newRadius, y - newRadius);
        image.composite(avatar, x - radius, y - radius);
      }

      // --- Place members in grid ---
      for (let i = 0; i < members.length; i++) {
        const member = members[i];
        const row = Math.floor(i / membersPerRow);
        const col = i % membersPerRow;
        const x = margin + col * step + step / 2;
        const y = margin + row * step + step / 2;

        // Neon colors
        let color = 0x800080FF; // Purple
        if (member.isAdmin) color = 0xFF0000FF; // Red
        else if (member.isActive) color = 0x0000FFFF; // Blue

        const profileURL = `https://graph.facebook.com/${member.id}/picture?width=200&height=200`;
        await drawNeonProfile(x, y, profileURL, color);
      }

      const outPath = __dirname + "/group_collage.png";
      await image.writeAsync(outPath);

      return message.reply({ attachment: require("fs").createReadStream(outPath) });
    } catch (err) {
      console.error(err);
      return message.reply("❌ Error creating collage. Credit: Helal");
    }
  }
};
