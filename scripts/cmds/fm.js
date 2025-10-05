// fm.js (Author: Helal)
// Tries: 1) global.GoatBot.utils.combineImages (no extra install), 2) Jimp-based collage,
// fallback -> safe text summary. Paste this in your commands folder.

module.exports = {
  config: {
    name: "fm",
    aliases: ["funmosaic", "fmpic"],
    version: "1.0",
    author: "Helal",
    shortDescription: "Create a group profile collage with Neon Circles.",
    longDescription: "Tries multiple strategies to produce a collage: uses built-in utils if present, else Jimp, else sends diagnostic fallback.",
    category: "fun",
    guide: "{pn}fm"
  },

  onStart: async function({ message, api, args, prefix }) {
    try {
      const threadID = message.threadID;
      const threadInfo = await (api.getThreadInfo ? api.getThreadInfo(threadID).catch(()=>null) : Promise.resolve(null));
      if (!threadInfo || !threadInfo.participants) {
        return message.reply("❌ Thread info not available. `api.getThreadInfo` pailam na. Bot permission/endpoint check korun. Credit: Helal");
      }

      const members = threadInfo.participants; // expect array of objects with id/isAdmin/isActive fields
      // Normalize members to have id + flags
      const normalized = members.map(m => ({
        id: m.id || m.userID || m.user_id || m.uid,
        isAdmin: !!m.isAdmin || !!m.is_admin || !!m.admin,
        isActive: !!m.isActive || !!m.is_active || false,
        name: m.name || m.fullName || m.userName || (m.id ? String(m.id) : "unknown")
      }));

      // --- Try method A: GoatBot provided util combineImages (no install) ---
      try {
        const utils = global?.GoatBot?.utils || (global?.goatbot && global.goatbot.utils);
        if (utils && typeof utils.combineImages === "function" && typeof utils.writeTempImage === "function") {
          // Build images array accepted by combineImages: either urls or { color, url, round }
          const images = normalized.map(m => {
            let color = "#800080"; // purple
            if (m.isAdmin) color = "#FF0000";
            else if (m.isActive) color = "#0000FF";
            const url = m.id ? `https://graph.facebook.com/${m.id}/picture?width=512&height=512` : null;
            return { url, color, round: true };
          });

          // combineImages(images, width, height, cellW, cellH, round)
          const size = 1500;
          const perRow = Math.ceil(Math.sqrt(images.length));
          const cell = Math.floor(size / perRow);
          const combined = await utils.combineImages(images, size, size, cell, cell, true);
          const outPath = await utils.writeTempImage(combined, `group_collage_fm_${Date.now()}.png`);
          return message.reply({ attachment: require("fs").createReadStream(outPath) });
        }
      } catch (eA) {
        // ignore, try next method
        console.warn("fm.js: combineImages failed:", eA);
      }

      // --- Try method B: Jimp-based (if Jimp installed in runtime) ---
      let Jimp = null;
      try {
        Jimp = require("jimp");
      } catch (e) {
        Jimp = null;
      }

      if (Jimp) {
        // create collage with real profile pics (with fallbacks)
        const canvasSize = 1400;
        const perRow = Math.ceil(Math.sqrt(normalized.length));
        const cell = Math.floor(canvasSize / perRow);
        const padding = Math.max(6, Math.floor(cell * 0.06));
        const inner = cell - padding * 2;
        const outImage = new Jimp(canvasSize, canvasSize, 0x00000000);

        // helper mask
        const createMask = (size) => {
          const mask = new Jimp(size, size, 0x00000000);
          const r = size / 2;
          mask.scan(0, 0, size, size, (x, y, idx) => {
            const dx = x - r, dy = y - r;
            if (dx*dx + dy*dy <= r*r) mask.bitmap.data[idx+3] = 255;
          });
          return mask;
        };

        const avatarMask = createMask(inner);
        const glowSize = Math.max(8, Math.round(inner * 0.12));
        const glowTotal = inner + glowSize * 2;
        const glowMask = createMask(glowTotal);

        const fetchAvatar = async (id, colorHex) => {
          if (!id) return new Jimp(inner, inner, colorHex);
          const url = `https://graph.facebook.com/${id}/picture?width=512&height=512`;
          try {
            const img = await Jimp.read(url);
            img.cover(inner, inner);
            return img;
          } catch (e) {
            // fallback solid color
            return new Jimp(inner, inner, colorHex);
          }
        };

        for (let i = 0; i < normalized.length; i++) {
          const m = normalized[i];
          const row = Math.floor(i / perRow);
          const col = i % perRow;
          const cx = Math.round(col * cell + cell/2);
          const cy = Math.round(row * cell + cell/2);

          let colorHex = 0xFF8000FF; // fallback ARGB
          // choose color hex ARGB for Jimp constructor: 0xRRGGBBAA
          if (m.isAdmin) colorHex = 0xFF0000FF; // red
          else if (m.isActive) colorHex = 0x0000FFFF; // blue
          else colorHex = 0x800080FF; // purple

          const avatar = await fetchAvatar(m.id, colorHex);
          avatar.mask(avatarMask, 0, 0);

          const glow = new Jimp(glowTotal, glowTotal, colorHex);
          glow.mask(glowMask, 0, 0);
          glow.opacity(0.55);

          const gX = Math.round(cx - glowTotal/2);
          const gY = Math.round(cy - glowTotal/2);
          const aX = Math.round(cx - inner/2);
          const aY = Math.round(cy - inner/2);

          outImage.composite(glow, gX, gY);
          outImage.composite(avatar, aX, aY);
        }

        const outPath = __dirname + `/group_collage_fm_${Date.now()}.png`;
        await outImage.writeAsync(outPath);
        return message.reply({ attachment: require("fs").createReadStream(outPath) });
      }

      // --- Fallback method C: No image util available => send diagnostic + small placeholder summary ---
      const admins = normalized.filter(m=>m.isAdmin).map(m=>m.name).slice(0,50);
      const actives = normalized.filter(m=>m.isActive && !m.isAdmin).map(m=>m.name).slice(0,50);
      const othersCount = normalized.filter(m=>!m.isAdmin && !m.isActive).length;

      let txt = `⚠️ Unable to generate collage automatically.\n\n`;
      txt += `Reason: No image utility found in bot environment.\n\n`;
      txt += `Admins (${admins.length}): ${admins.join(", ") || "None"}\n`;
      txt += `Active (${actives.length}): ${actives.join(", ") || "None"}\n`;
      txt += `Others: ${othersCount}\n\n`;
      txt += `Options to get full image:\n`;
      txt += `1) If your bot has a built-in util: ensure \`global.GoatBot.utils.combineImages\` & \`writeTempImage\` exist.\n`;
      txt += `2) Install Jimp on your bot host: run \`npm install jimp\` then re-run this command.\n`;
      txt += `3) If you want, paste the output of this message here—ami tarpor apnar exact environment onujayi final file dibo.\n\n`;
      txt += `Credit: Helal`;

      return message.reply(txt);

    } catch (err) {
      console.error("fm.js unexpected error:", err);
      return message.reply("❌ Unexpected error while creating collage. Ami try korlam but problem holo. Credit: Helal");
    }
  }
};
