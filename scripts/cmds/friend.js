const fs = require("fs");
const axios = require("axios");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "friend",
    version: "1.0",
    author: "Helal x GPT",
    countDown: 5,
    role: 0,
    shortDescription: "Create a friendship frame 🩵",
    longDescription: "Generate a cool friendship frame between two users using their profile pictures.",
    category: "fun"
  },

  onStart: async function ({ api, event }) {
    try {
      const mention = Object.keys(event.mentions);
      const sender = event.senderID;
      const friendID = mention[0];

      if (!friendID) {
        return api.sendMessage(
          "🌺 | Tag a friend!\nExample: .friend @username",
          event.threadID,
          event.messageID
        );
      }

      // Path setup
      const cachePath = path.join(__dirname, "cache");
      if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

      const frameType = "neon"; // তুমি চাইলে "white" এ পরিবর্তন করতে পারো
      const bgPath =
        frameType === "neon"
          ? path.join(__dirname, "cache", "neon_frame.png")
          : path.join(__dirname, "cache", "white_frame.png");

      // Frame images link
      const neonLink = "https://i.imgur.com/nfV3zK5.png";
      const whiteLink = "https://i.imgur.com/Ta1X0bA.png";

      // Download frame if missing
      if (!fs.existsSync(bgPath)) {
        const link = frameType === "neon" ? neonLink : whiteLink;
        const response = await axios.get(link, { responseType: "arraybuffer" });
        fs.writeFileSync(bgPath, Buffer.from(response.data, "binary"));
      }

      // Get user profile pictures
      const senderPic = await axios.get(
        `https://graph.facebook.com/${sender}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" }
      );
      const friendPic = await axios.get(
        `https://graph.facebook.com/${friendID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" }
      );

      const senderAvatarPath = path.join(cachePath, `${sender}.png`);
      const friendAvatarPath = path.join(cachePath, `${friendID}.png`);

      fs.writeFileSync(senderAvatarPath, Buffer.from(senderPic.data, "binary"));
      fs.writeFileSync(friendAvatarPath, Buffer.from(friendPic.data, "binary"));

      // Create frame image
      const frame = await loadImage(bgPath);
      const senderAvatar = await loadImage(senderAvatarPath);
      const friendAvatar = await loadImage(friendAvatarPath);

      const canvas = createCanvas(frame.width, frame.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(frame, 0, 0, frame.width, frame.height);

      // Circle crop and draw profile pics
      const circle = (img, x, y, size) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, x, y, size, size);
        ctx.restore();
      };

      // Positions (adjust if needed)
      circle(senderAvatar, 90, 130, 220);
      circle(friendAvatar, 430, 130, 220);

      const outputPath = path.join(cachePath, `friend_${sender}_${friendID}.png`);
      fs.writeFileSync(outputPath, canvas.toBuffer());

      // Send image
      api.sendMessage(
        {
          body: `🌺 Friendship Frame Ready!\n💫 ${event.senderID} 🤝 ${event.mentions[friendID]}`,
          attachment: fs.createReadStream(outputPath)
        },
        event.threadID,
        () => {
          fs.unlinkSync(outputPath);
          fs.unlinkSync(senderAvatarPath);
          fs.unlinkSync(friendAvatarPath);
        }
      );
    } catch (err) {
      console.log(err);
      api.sendMessage("❌ | Error generating frame.", event.threadID, event.messageID);
    }
  }
};
