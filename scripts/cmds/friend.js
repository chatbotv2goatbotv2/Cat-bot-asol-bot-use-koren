const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Canvas = require("canvas");

module.exports = {
  config: {
    name: "friend",
    aliases: ["friend2"],
    version: "1.0",
    author: "Helal",
    role: 0,
    shortDescription: "Create friendship frame with another user",
    longDescription: "Make a friendship photo frame using your and mentioned user's profile pictures",
    category: "fun",
    guide: {
      en: "{pn} @mention\n{pn}2 @mention",
    },
  },

  onStart: async function ({ event, api, usersData, args, commandName }) {
    const mention = Object.keys(event.mentions)[0];
    const senderID = event.senderID;

    if (!mention) {
      return api.sendMessage("⚠️ | Please mention a friend!", event.threadID, event.messageID);
    }

    const user1 = senderID;
    const user2 = mention;

    try {
      const avatar1 = await axios.get(`https://graph.facebook.com/${user1}/picture?height=512&width=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" });
      const avatar2 = await axios.get(`https://graph.facebook.com/${user2}/picture?height=512&width=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" });

      const img1 = await Canvas.loadImage(Buffer.from(avatar1.data, "utf-8"));
      const img2 = await Canvas.loadImage(Buffer.from(avatar2.data, "utf-8"));

      // Choose frame based on command
      const frameURL =
        commandName === "friend2"
          ? "https://i.imgur.com/AV5FsvB.png" // White frame
          : "https://i.imgur.com/wPuCr9U.png"; // Neon frame

      const frame = await Canvas.loadImage(frameURL);

      const canvas = Canvas.createCanvas(frame.width, frame.height);
      const ctx = canvas.getContext("2d");

      // Draw frame background
      ctx.drawImage(frame, 0, 0, frame.width, frame.height);

      // Circle 1
      ctx.save();
      ctx.beginPath();
      ctx.arc(260, 230, 130, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img1, 130, 100, 260, 260);
      ctx.restore();

      // Circle 2
      ctx.save();
      ctx.beginPath();
      ctx.arc(760, 230, 130, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img2, 630, 100, 260, 260);
      ctx.restore();

      const filePath = path.join(__dirname, "cache", `friend_${Date.now()}.png`);
      const out = fs.createWriteStream(filePath);
      const stream = canvas.createPNGStream();
      stream.pipe(out);
      out.on("finish", () => {
        api.sendMessage(
          {
            body: "🌸 Friendship Frame Ready 🌸",
            attachment: fs.createReadStream(filePath),
          },
          event.threadID,
          () => fs.unlinkSync(filePath),
          event.messageID
        );
      });
    } catch (err) {
      console.log(err);
      return api.sendMessage("❌ | Failed to create frame!", event.threadID, event.messageID);
    }
  },
};
