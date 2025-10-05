// fm.js — multi‑fallback, paste-only. Author: Helal
// Paste this into your commands folder and run {prefix}fm

const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "fm",
    aliases: ["funmosaic", "fmpic"],
    version: "1.0",
    author: "Helal",
    shortDescription: "Create a group profile collage with Neon Circles (multi-fallback).",
    longDescription: "Tries built-in utils, else generates an SVG collage (no extra installs). Admin=red, Active=blue, Others=purple.",
    category: "fun",
    guide: "{pn}fm"
  },

  onStart: async function({ message, api }) {
    try {
      const threadID = message.threadID;
      // Try to get thread info via common methods
      let threadInfo = null;
      const tryCalls = [
        () => api.getThreadInfo ? api.getThreadInfo(threadID) : Promise.reject("no getThreadInfo"),
        () => api.getThreadInfoV2 ? api.getThreadInfoV2(threadID) : Promise.reject("no getThreadInfoV2"),
        () => api.getThread ? api.getThread(threadID) : Promise.reject("no getThread"),
        () => api.getThreadMembers ? api.getThreadMembers(threadID) : Promise.reject("no getThreadMembers"),
        () => api.getThreadList ? api.getThreadList() : Promise.reject("no getThreadList"),
        () => api.getUserInfo ? api.getUserInfo(threadID) : Promise.reject("no getUserInfo")
      ];

      for (let fn of tryCalls) {
        try {
          const res = await fn();
          if (res && (Array.isArray(res) || res.participants || res.members || res.users || res.thread_info)) {
            threadInfo = res;
            break;
          }
        } catch (e) {
          // ignore and continue trying other methods
        }
      }

      if (!threadInfo) {
        return message.reply("❌ Thread info not available. `api.getThreadInfo`/alternatives pailam na. Please make bot admin or ensure your bot framework supports thread info. Credit: Helal");
      }

      // Normalize participants array
      let participants = [];
      if (Array.isArray(threadInfo)) participants = threadInfo;
      else if (threadInfo.participants) participants = threadInfo.participants;
      else if (threadInfo.members) participants = threadInfo.members;
      else if (threadInfo.users) participants = threadInfo.users;
      else {
        // try to find largest array property
        const keys = Object.keys(threadInfo);
        let maxArr = null;
        for (const k of keys) {
          if (Array.isArray(threadInfo[k]) && (!maxArr || threadInfo[k].length > maxArr.length)) maxArr = threadInfo[k];
        }
        if (maxArr) participants = maxArr;
      }

      if (!participants || participants.length === 0) {
        return message.reply("❌ Participants not found in thread info. Check bot permissions. Credit: Helal");
      }

      // Build normalized member info: id, name, isAdmin, isActive
      const members = participants.map((m, idx) => {
        // try multiple common id/name fields
        const id = m.id || m.userID || m.user_id || m.uid || m.ID || m.user || null;
        const name = m.name || m.fullName || m.userName || m.user || (id ? String(id) : `User${idx+1}`);
        const isAdmin = !!(m.isAdmin || m.admin || m.is_admin || m.administer || m.type === 'ADMIN');
        const isActive = !!(m.isActive || m.is_active || m.online || m.active || false);
        return { id, name, isAdmin, isActive };
      });

      // Build image objects (avatar URLs)
      const images = members.map(m => {
        const url = m.id ? `https://graph.facebook.com/${m.id}/picture?width=512&height=512` : null;
        const color = m.isAdmin ? "#FF0000" : (m.isActive ? "#0000FF" : "#800080");
        return { id: m.id, name: m.name, url, color, round: true };
      });

      // --- Try method A: use built-in utils if available ---
      try {
        const utils = global?.GoatBot?.utils || global?.goatbot?.utils;
        if (utils && typeof utils.combineImages === "function" && typeof utils.writeTempImage === "function") {
          const size = 1500;
          const perRow = Math.ceil(Math.sqrt(images.length));
          const cell = Math.floor(size / perRow);
          // combineImages expects array of {url,color,round} in many implementations
          const combined = await utils.combineImages(images, size, size, cell, cell, true);
          const outPath = await utils.writeTempImage(combined, `group_collage_fm_${Date.now()}.png`);
          return message.reply({ attachment: require("fs").createReadStream(outPath) });
        }
      } catch (e) {
        // ignore and continue to SVG fallback
      }

      // --- Method B: Create an SVG collage (no external libs) ---
      // SVG will reference the profile image URLs directly as <image href="..."> inside circles.
      // Many chat clients accept SVG attachments; if client doesn't render, user will still get file.
      const size = 1500;
      const perRow = Math.ceil(Math.sqrt(images.length));
      const cell = Math.floor(size / perRow);
      const radius = Math.floor(cell * 0.42);
      const gap = cell;
      let svgParts = [];
      svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`);
      // background
      svgParts.push(`<rect width="100%" height="100%" fill="#0b0b0b"/>`);

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const row = Math.floor(i / perRow);
        const col = i % perRow;
        const cx = Math.round(col * gap + gap / 2);
        const cy = Math.round(row * gap + gap / 2);

        // unique id for clipPath
        const clipId = `c${i}`;
        // circle background (glow) using colored circle with blur filter (SVG filter)
        const color = img.color;
        // Add clipPath & filter per image
        svgParts.push(`<defs>
  <clipPath id="${clipId}"><circle cx="${cx}" cy="${cy}" r="${radius}"/></clipPath>
  <filter id="f${i}" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="${Math.max(6, Math.round(radius*0.12))}" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="b"/></feMerge>
  </filter>
</defs>`);
        // glow circle
        svgParts.push(`<circle cx="${cx}" cy="${cy}" r="${radius+8}" fill="${color}" opacity="0.45" filter="url(#f${i})"/>`);
        // image (if url present) else solid circle
        if (img.url) {
          // place image centered, but clipped
          const imgSize = radius * 2;
          const imgX = cx - radius;
          const imgY = cy - radius;
          // Use preserveAspectRatio slice to cover
          svgParts.push(`<image x="${imgX}" y="${imgY}" width="${imgSize}" height="${imgSize}" href="${img.url}" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/>`);
        } else {
          // fallback solid fill
          svgParts.push(`<circle cx="${cx}" cy="${cy}" r="${radius-2}" fill="${color}" clip-path="url(#${clipId})"/>`);
        }
        // optional small overlay with initial or name
        const initial = (img.name || "U").trim().charAt(0).toUpperCase();
        svgParts.push(`<text x="${cx}" y="${cy + radius + 14}" text-anchor="middle" font-size="${Math.max(12, Math.round(radius*0.2))}" fill="#ffffff" font-family="Arial">${initial}</text>`);
      }

      svgParts.push(`<text x="${size-10}" y="${size-10}" font-size="14" fill="#ffffff" text-anchor="end" font-family="Arial">Credit: Helal</text>`);
      svgParts.push(`</svg>`);
      const svgContent = svgParts.join("\n");

      // write SVG file
      const outName = `group_collage_fm_${Date.now()}.svg`;
      const outPath = path.join(__dirname, outName);
      fs.writeFileSync(outPath, svgContent, "utf8");

      // send SVG as attachment
      return message.reply({ attachment: fs.createReadStream(outPath) });

    } catch (err) {
      console.error("fm.js error final fallback:", err);
      return message.reply("❌ Unexpected error while creating collage. Ami try korlam but problem holo. Please send fmdebug2 output if still failing. Credit: Helal");
    }
  }
};
