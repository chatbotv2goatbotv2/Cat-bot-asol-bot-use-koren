module.exports = {
  config: {
    name: "fm",
    aliases: ["funmosaic", "fmpic"],
    version: "1.0",
    author: "Helal",
    shortDescription: "Create a round collage with neon circle placeholders.",
    longDescription: "Generates a single image with round neon circle placeholders for all group members: red for admin, blue for active, purple for others.",
    category: "fun",
    guide: "{pn}fm"
  },

  onStart: async function({ message, api }) {
    try {
      const threadID = message.threadID;
      const threadInfo = await api.getThreadInfo(threadID);
      const members = threadInfo.participants;

      // --- Setup Canvas using GoatBot default image function ---
      const size = 1500; // canvas size
      const step = Math.ceil(Math.sqrt(members.length));
      const cell = Math.floor(size / step);
      const images = []; // store placeholder images

      // --- Generate placeholder neon circles ---
      for (let i = 0; i < members.length; i++) {
        const member = members[i];
        let color = "#800080"; // default purple
        if (member.isAdmin) color = "#FF0000"; // red
        else if (member.isActive) color = "#0000FF"; // blue

        // Placeholder: color circle
        const circle = {
          color: color,
          index: i
        };
        images.push(circle);
      }

      // --- Create final image using bot's image function ---
      const { writeTempImage, combineImages } = global.GoatBot.utils;
      const finalImage = await combineImages(images, size, size, cell, cell, true); // round circles

      const path = await writeTempImage(finalImage, "group_collage.png");

      return message.reply({ attachment: require("fs").createReadStream(path) });
    } catch (err) {
      console.error(err);
      return message.reply("❌ Error creating collage. Credit: Helal");
    }
  }
};
