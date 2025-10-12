const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "friend",
    aliases: ["friend2"],
    version: "1.0",
    author: "Helal x GPT-5",
    description: "Create a friend frame with two users' profile pictures 🌸",
    category: "fun"
  },

  onStart: async function ({ api, event, args }) {
    try {
      // ফ্রেম লিঙ্ক
      const neonFrame = "https://i.imgur.com/4X5oBcb.jpeg";
      const whiteFrame = "https://i.imgur.com/0RXSQZW.jpeg";

      // ফ্রেম সিলেকশন
      const frame = event.body.startsWith("/friend2") ? whiteFrame : neonFrame;

      // mention করা ইউজার
      const mentions = Object.keys(event.mentions || {});
      const senderID = event.senderID;

      let user1 = senderID;
      let user2;

      // mention না করলে error
      if (mentions.length === 0) {
        return api.sendMessage("❌ | Please mention one user!", event.threadID, event.messageID);
      } else {
        user2 = mentions[0];
      }

      // প্রোফাইল পিক URL
      const url1 = `https://graph.facebook.com/${user1}/picture?width=512&height=512`;
      const url2 = `https://graph.facebook.com/${user2}/picture?width=512&height=512`;

      // লোকাল ফাইল পাথ
      const img1 = path.join(__dirname, "friend1.png");
      const img2 = path.join(__dirname, "friend2.png");
      const framePath = path.join(__dirname, "frame.png");
      const final = path.join(__dirname, "final.png");

      // ফটো ডাউনলোড
      const download = async (url, dest) => {
        const res = await axios.get(url, { responseType: "arraybuffer" });
        fs.writeFileSync(dest, Buffer.from(res.data, "binary"));
      };

      await download(url1, img1);
      await download(url2, img2);
      await download(frame, framePath);

      // ImageMagick ব্যবহার (Goat bot এ বিল্ট-ইন থাকে)
      const { exec } = require("child_process");
      const cmd = `magick convert ${framePath} \\( ${img1} -resize 400x400 -gravity center -extent 400x400 \\) -geometry +160+250 -composite \\( ${img2} -resize 400x400 -gravity center -extent 400x400 \\) -geometry +960+250 -composite ${final}`;

      exec(cmd, (err) => {
        if (err) {
          console.error(err);
          return api.sendMessage("❌ | Error generating frame.", event.threadID, event.messageID);
        }

        api.sendMessage({
          body: "🌸 | Friendship Frame Ready!",
          attachment: fs.createReadStream(final)
        }, event.threadID, () => {
          // clean up
          fs.unlinkSync(img1);
          fs.unlinkSync(img2);
          fs.unlinkSync(framePath);
          fs.unlinkSync(final);
        });
      });
    } catch (e) {
      console.error(e);
      api.sendMessage("❌ | Something went wrong!", event.threadID, event.messageID);
    }
  }
};
