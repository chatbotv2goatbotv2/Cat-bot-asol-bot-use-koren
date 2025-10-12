// friend.js
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Jimp = require("jimp");

module.exports = {
  config: {
    name: "friend",
    aliases: ["friend2"],
    version: "1.1",
    author: "Helal",
    description: "Create a friendship frame with two users' profile pictures 🌸",
    category: "fun"
  },

  onStart: async function({ api, event, args }) {
    const threadID = event.threadID;
    const messageID = event.messageID;

    try {
      // frame links (you gave)
      const neonFrame = "https://i.imgur.com/4X5oBcb.jpeg"; // /friend
      const whiteFrame = "https://i.imgur.com/0RXSQZW.jpeg"; // /friend2

      // decide frame by command alias or body
      const isFriend2 = (event.body || "").toLowerCase().startsWith("friend2") || (event.body || "").toLowerCase().startsWith("/friend2");
      const frameUrl = isFriend2 ? whiteFrame : neonFrame;

      // get mentions
      const mentionsObj = event.mentions || {};
      const mentionIds = Object.keys(mentionsObj);

      if (mentionIds.length === 0) {
        return api.sendMessage("❌ | Please mention one user. Example: friend @user", threadID, messageID);
      }

      const user1 = event.senderID; // command sender
      const user2 = mentionIds[0]; // first mentioned user

      // helper to download buffer via axios
      const downloadBuffer = async (url) => {
        const res = await axios.get(url, { responseType: "arraybuffer", timeout: 20000 });
        return Buffer.from(res.data, "binary");
      };

      // profile pic URLs (graph.facebook)
      const p1Url = `https://graph.facebook.com/${user1}/picture?width=512&height=512`;
      const p2Url = `https://graph.facebook.com/${user2}/picture?width=512&height=512`;

      // temp paths
      const tmpDir = path.join(__dirname, "tmp_friend");
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

      const p1Path = path.join(tmpDir, `p1_${user1}.png`);
      const p2Path = path.join(tmpDir, `p2_${user2}.png`);
      const framePath = path.join(tmpDir, `frame_${isFriend2 ? "w" : "n"}.png`);
      const outPath = path.join(tmpDir, `friend_out_${Date.now()}.png`);

      // download images
      const [p1Buf, p2Buf, frameBuf] = await Promise.all([
        downloadBuffer(p1Url).catch(() => null),
        downloadBuffer(p2Url).catch(() => null),
        downloadBuffer(frameUrl).catch(() => null)
      ]);

      if (!p1Buf || !p2Buf || !frameBuf) {
        cleanupFiles([p1Path, p2Path, framePath, outPath]);
        return api.sendMessage("❌ | Failed to download one of the images (profile or frame). Try again.", threadID, messageID);
      }

      fs.writeFileSync(p1Path, p1Buf);
      fs.writeFileSync(p2Path, p2Buf);
      fs.writeFileSync(framePath, frameBuf);

      // load images with Jimp
      const [imgP1, imgP2, imgFrame] = await Promise.all([
        Jimp.read(p1Path),
        Jimp.read(p2Path),
        Jimp.read(framePath)
      ]);

      // sizes - adaptable if frame size differs
      const FRAME_W = imgFrame.bitmap.width;
      const FRAME_H = imgFrame.bitmap.height;

      // we will place two circular avatars — compute sizes relative to frame
      // tune these values if your frames require other positions
      const AVATAR_SIZE = Math.floor(Math.min(FRAME_W, FRAME_H) * 0.25); // 25% of min dimension
      const leftX = Math.floor(FRAME_W * 0.18); // left avatar top-left x
      const rightX = Math.floor(FRAME_W * 0.60); // right avatar top-left x
      const avatarY = Math.floor(FRAME_H * 0.22); // top y for both

      // prepare circular masks
      const mask = new Jimp(AVATAR_SIZE, AVATAR_SIZE, 0x00000000);
      mask.scan(0, 0, mask.bitmap.width, mask.bitmap.height, function(x, y, idx) {
        const rx = x - AVATAR_SIZE/2;
        const ry = y - AVATAR_SIZE/2;
        if (rx*rx + ry*ry <= (AVATAR_SIZE/2)*(AVATAR_SIZE/2)) {
          // inside circle -> white (opaque)
          this.bitmap.data[idx + 0] = 255;
          this.bitmap.data[idx + 1] = 255;
          this.bitmap.data[idx + 2] = 255;
          this.bitmap.data[idx + 3] = 255;
        } else {
          // outside -> transparent
          this.bitmap.data[idx + 3] = 0;
        }
      });

      // resize avatars and apply mask to make circle
      imgP1.resize(AVATAR_SIZE, AVATAR_SIZE).mask(mask, 0, 0);
      imgP2.resize(AVATAR_SIZE, AVATAR_SIZE).mask(mask, 0, 0);

      // composite onto a clone of frame
      const canvas = imgFrame.clone();

      canvas.composite(imgP1, leftX, avatarY);
      canvas.composite(imgP2, rightX, avatarY);

      // optional: add small text names under avatars (mention text)
      const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
      const name1 = mentionsObj[user1] ? mentionsObj[user1] : user1;
      const name2 = mentionsObj[user2] ? mentionsObj[user2] : user2;

      // center text under each avatar
      const textOffsetY = avatarY + AVATAR_SIZE + 8;
      canvas.print(font, leftX, textOffsetY, {
        text: name1,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
      }, AVATAR_SIZE, 20);
      canvas.print(font, rightX, textOffsetY, {
        text: name2,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
      }, AVATAR_SIZE, 20);

      // write output
      await canvas.writeAsync(outPath);

      // send file
      await api.sendMessage({
        body: "🌸 | Friendship Frame Ready!",
        attachment: fs.createReadStream(outPath)
      }, threadID, () => {
        // cleanup
        cleanupFiles([p1Path, p2Path, framePath, outPath]);
      }, messageID);

    } catch (err) {
      console.error(err);
      try { api.sendMessage("❌ | Something went wrong while creating the frame. Check console.", threadID, messageID); } catch(e){}
    }

    // helper cleanup
    function cleanupFiles(list){
      for (const f of list) {
        try { if (fs.existsSync(f)) fs.unlinkSync(f); } catch(e){}
      }
      try { if (fs.existsSync(path.join(__dirname, "tmp_friend")) ) fs.rmdirSync(path.join(__dirname, "tmp_friend")) } catch(e){}
    }
  }
};
