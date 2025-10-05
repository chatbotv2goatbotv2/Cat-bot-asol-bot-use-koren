const Jimp = require("jimp");

module.exports = {
  config: {
    name: "fm",
    aliases: ["funmosaic", "fmpic"],
    version: "1.0",
    author: "Helal",
    shortDescription: "Create a group profile collage with Neon Circles.",
    longDescription: "Generates a single image with round Neon Circles for all group members: red for admin, blue for active, purple for others.",
    category: "fun",
    guide: "{pn}fm"
  },

  onStart: async function({ message }) {
    try {
      // Placeholder member list for paste-only version
      const members = [
        { name: "Admin1", isAdmin: true, isActive: true },
        { name: "Active1", isAdmin: false, isActive: true },
        { name: "Member1", isAdmin: false, isActive: false },
        { name: "Member2", isAdmin: false, isActive: false },
        { name: "Member3", isAdmin: false, isActive: false },
        { name: "Member4", isAdmin: false, isActive: false },
        // Add more members dynamically if needed
      ];

      const canvasSize = 800;
      const membersPerRow = Math.ceil(Math.sqrt(members.length));
      const cell = Math.floor(canvasSize / membersPerRow);
      const image = new Jimp(canvasSize, canvasSize, 0x00000000);

      // Create colored placeholder for each member
      for (let i = 0; i < members.length; i++) {
        const member = members[i];
        const row = Math.floor(i / membersPerRow);
        const col = i % membersPerRow;
        const x = col * cell + cell / 2;
        const y = row * cell + cell / 2;

        let color = 0x800080FF; // Purple
        if (member.isAdmin) color = 0xFF0000FF; // Red
        else if (member.isActive) color = 0x0000FFFF; // Blue

        // Create round placeholder
        const avatar = new Jimp(cell - 10, cell - 10, color);

        const mask = new Jimp(avatar.bitmap.width, avatar.bitmap.height, 0x00000000);
        const radius = avatar.bitmap.width / 2;
        mask.scan(0, 0, mask.bitmap.width, mask.bitmap.height, (px, py, idx) => {
          const dx = px - radius;
          const dy = py - radius;
          if (dx * dx + dy * dy <= radius * radius) mask.bitmap.data[idx + 3] = 255;
        });
        avatar.mask(mask, 0, 0);

        image.composite(avatar, x - radius, y - radius);
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
