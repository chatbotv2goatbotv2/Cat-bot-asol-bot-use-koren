// friend.js
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Jimp = require("jimp");

module.exports = {
  config: {
    name: "friend",
    aliases: ["friend2"],
    version: "1.2",
    author: "Helal",
    description: "Create a friendship frame with two users' profile pictures 🌸",
    category: "fun"
  },

  onStart: async function({ api, event, args }) {
    const threadID = event.threadID;
    const messageID = event.messageID;
    const body = (event.body || "").trim();

    // FRAME LINKS (you provided)
    const NEON_FRAME = "https://i.imgur.com/4X5oBcb.jpeg"; // friend
    const WHITE_FRAME = "https://i.imgur.com/0RXSQZW.jpeg"; // friend2

    // fallback avatar (in case FB pic fails)
    const FALLBACK_AVATAR = "https://i.imgur.com/8wVbK6H.png"; // small neutral avatar (public)

    // utility: download as Buffer
    const downloadBuffer = async (url, timeout = 20000) => {
      try {
        const res = await axios.get(url, { responseType: "arraybuffer", timeout });
        return Buffer.from(res.data, "binary");
      } catch (e) {
        return null;
      }
    };

    // safe tmp dir
    const tmpDir = path.join(__dirname, "tmp_friend");
    try { fs.mkdirSync(tmpDir, { recursive: true }); } catch (e) {}

    // helper cleanup specific files
    const cleanupFiles = (files = []) => {
      for (const f of files) {
        try { if (fs.existsSync(f)) fs.unlinkSync(f); } catch (e) {}
      }
      // try remove dir if empty
      try {
        const remaining = fs.readdirSync(tmpDir);
        if (remaining.length === 0) fs.rmdirSync(tmpDir);
      } catch (e) {}
    };

    try {
      // choose frame based on alias or message start
      const lower = body.toLowerCase();
      const useWhite = lower.startsWith("friend2") || lower.startsWith("/friend2");
      const frameUrl = useWhite ? WHITE_FRAME : NEON_FRAME;

      // mentions
      const mentions = event.mentions || {};
      const mentionIds = Object.keys(mentions);

      // decide user1 & user2: if one mention -> sender + mention, if multiple -> first two mentions
      let userA = event.senderID;
      let userB = null;
      if (mentionIds.length === 0) {
        return api.sendMessage("❗ Please mention one user. Example: friend @username", threadID, messageID);
      } else if (mentionIds.length === 1) {
        userB = mentionIds[0];
      } else {
        userB = mentionIds[0]; // we use first mentioned
      }

      // build profile pic URLs (Graph)
      const urlA = `https://graph.facebook.com/${userA}/picture?width=512&height=512`;
      const urlB = `https://graph.facebook.com/${userB}/picture?width=512&height=512`;

      // file paths
      const stamp = Date.now();
      const pAPath = path.join(tmpDir, `pA_${userA}_${stamp}.png`);
      const pBPath = path.join(tmpDir, `pB_${userB}_${stamp}.png`);
      const framePath = path.join(tmpDir, `frame_${useWhite ? "w" : "n"}_${stamp}.png`);
      const outPath = path.join(tmpDir, `friend_out_${stamp}.png`);

      // download concurrently with fallback
      const [bufA, bufB, bufFrame] = await Promise.all([
        downloadBuffer(urlA),
        downloadBuffer(urlB),
        downloadBuffer(frameUrl)
      ]);

      // fallback if profile download failed
      const finalBufA = bufA || (await downloadBuffer(FALLBACK_AVATAR));
      const finalBufB = bufB || (await downloadBuffer(FALLBACK_AVATAR));
      const finalFrameBuf = bufFrame || (await downloadBuffer(frameUrl)) || (await downloadBuffer(FALLBACK_AVATAR));

      if (!finalBufA || !finalBufB || !finalFrameBuf) {
        cleanupFiles([pAPath, pBPath, framePath, outPath]);
        return api.sendMessage("❌ | Unable to download required images. Try again later.", threadID, messageID);
      }

      // save
      fs.writeFileSync(pAPath, finalBufA);
      fs.writeFileSync(pBPath, finalBufB);
      fs.writeFileSync(framePath, finalFrameBuf);

      // load into Jimp
      let imgA = await Jimp.read(pAPath).catch(() => null);
      let imgB = await Jimp.read(pBPath).catch(() => null);
      let imgFrame = await Jimp.read(framePath).catch(() => null);

      if (!imgA || !imgB || !imgFrame) {
        cleanupFiles([pAPath, pBPath, framePath, outPath]);
        return api.sendMessage("❌ | Corrupted image files. Try again.", threadID, messageID);
      }

      const FRAME_W = imgFrame.bitmap.width;
      const FRAME_H = imgFrame.bitmap.height;

      // compute avatar size & positions (tweakable)
      const AVATAR_SIZE = Math.floor(Math.min(FRAME_W, FRAME_H) * 0.26);
      const leftX = Math.floor(FRAME_W * 0.14);
      const rightX = Math.floor(FRAME_W * 0.62);
      const avatarY = Math.floor(FRAME_H * 0.2);

      // circular mask
      const mask = new Jimp(AVATAR_SIZE, AVATAR_SIZE, 0x00000000);
      mask.scan(0, 0, mask.bitmap.width, mask.bitmap.height, function(x, y, idx) {
        const rx = x - AVATAR_SIZE/2;
        const ry = y - AVATAR_SIZE/2;
        if (rx*rx + ry*ry <= (AVATAR_SIZE/2)*(AVATAR_SIZE/2)) {
          this.bitmap.data[idx + 0] = 255;
          this.bitmap.data[idx + 1] = 255;
          this.bitmap.data[idx + 2] = 255;
          this.bitmap.data[idx + 3] = 255;
        } else {
          this.bitmap.data[idx + 3] = 0;
        }
      });

      imgA.resize(AVATAR_SIZE, AVATAR_SIZE).mask(mask, 0, 0);
      imgB.resize(AVATAR_SIZE, AVATAR_SIZE).mask(mask, 0, 0);

      const canvas = imgFrame.clone();

      canvas.composite(imgA, leftX, avatarY);
      canvas.composite(imgB, rightX, avatarY);

      // add small name labels (if mention text exists)
      let nameA = (event.senderID && (event.senderID === userA) && (event.senderID in (event.mentions || {}))) ? event.mentions[userA] : null;
      // if mention mapping exists, use it; otherwise fetch simple placeholder like "You" or numeric id
      nameA = event.mentions && event.mentions[userA] ? event.mentions[userA] : "You";
      const nameBLabel = event.mentions && event.mentions[userB] ? event.mentions[userB] : `User`;

      const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
      const textOffsetY = avatarY + AVATAR_SIZE + 8;
      // print centered in avatar box width = AVATAR_SIZE
      canvas.print(font, leftX, textOffsetY, { text: nameA, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER }, AVATAR_SIZE, 20);
      canvas.print(font, rightX, textOffsetY, { text: nameBLabel, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER }, AVATAR_SIZE, 20);

      await canvas.writeAsync(outPath);

      await api.sendMessage({ body: "🌸 Friendship frame created!", attachment: fs.createReadStream(outPath) }, threadID, () => {
        cleanupFiles([pAPath, pBPath, framePath, outPath]);
      }, messageID);

    } catch (err) {
      console.error("Friend command error:", err);
      try { api.sendMessage("❌ | Something went wrong while creating the frame. Check console logs.", threadID, messageID); } catch(e){}
    }
  }
};
