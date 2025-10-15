const axios = require("axios");

module.exports = {
  config: {
    name: "server",
    aliases: ["mc", "status"],
    version: "4.0",
    author: "Helal Islam",
    shortDescription: "Check Minecraft server status with progress animation.",
    longDescription: "Shows animated loading, auto-detects Java/Bedrock/Geyser and returns player/version info.",
    category: "🎮 GAME",
    guide: "{pn}mc <ip> [port]"
  },

  onStart: async function ({ api, event, args, message, prefix }) {
    // validation
    if (!args[0]) {
      const pre = prefix || ".";
      return api.sendMessage(`❌ Please provide server IP.\n\n📌 Example:\n${pre}mc play.hypixel.net 25565`, event.threadID);
    }

    const ip = args[0];
    const port = args[1] || 25565;
    const threadID = event.threadID;

    // loading frames (we'll "edit" or unsend+send to simulate animation)
    const frames = [
      "⚪ ⚪ ⚪ ⚪ ⚪",
      "🟠 ⚪ ⚪ ⚪ ⚪",
      "🟠 🟡 ⚪ ⚪ ⚪",
      "🟠 🟡 🔴 ⚪ ⚪",
      "🟠 🟡 🔴 🟢 ⚪",
      "🟠 🟡 🔴 🟢 🟢"
    ];

    const loadingHeader = (step) => `⏳ Checking ${ip}:${port} ...\n\n${frames[step]}\n\nPlease wait...`;

    // helper: try to send message and return info
    function safeSend(body) {
      return new Promise((resolve) => {
        try {
          api.sendMessage(body, threadID, (err, info) => {
            if (err) return resolve({ err });
            return resolve({ info });
          });
        } catch (e) {
          // some frameworks return promise
          try {
            api.sendMessage(body, threadID).then(info => resolve({ info })).catch(err => resolve({ err }));
          } catch (ee) {
            return resolve({ err: ee });
          }
        }
      });
    }

    // helper: try to unsend a message id (many forks call it unsend / unsendMessage / deleteMessage)
    async function safeUnsend(messageID) {
      if (!messageID) return;
      try { if (api.unsend) return api.unsend(messageID); } catch (e) {}
      try { if (api.unsendMessage) return api.unsendMessage(messageID); } catch (e) {}
      try { if (api.deleteMessage) return api.deleteMessage(messageID); } catch (e) {}
      // if none available, do nothing
    }

    // helper: try to edit message (some frameworks support message.edit or api.editMessage)
    async function safeEdit(oldInfo, newBody) {
      // oldInfo may be info returned from sendMessage
      try {
        // if message object has edit
        if (oldInfo && oldInfo.message && typeof oldInfo.message.edit === "function") {
          return oldInfo.message.edit(newBody);
        }
      } catch (e) {}

      try {
        // some frameworks provide api.editMessage
        if (api.editMessage) {
          return api.editMessage(newBody, oldInfo);
        }
      } catch (e) {}

      // fallback: unsend old then send new
      try {
        const id = oldInfo && (oldInfo.messageID || (oldInfo.message && oldInfo.message.messageID) || (oldInfo.mid));
        if (id) await safeUnsend(id);
      } catch (e) {}
      return safeSend(newBody);
    }

    // start: send initial frame
    let sent = await safeSend(loadingHeader(0));
    let sentInfo = sent.info || null;

    // play animation then fetch data
    for (let i = 1; i < frames.length; i++) {
      // wait 600ms between frames
      await new Promise(r => setTimeout(r, 600));
      // try to edit
      const result = await safeEdit(sentInfo, loadingHeader(i));
      // update sentInfo to the latest returned info if available
      if (result && result.info) sentInfo = result.info;
    }

    // slight pause before fetching final
    await new Promise(r => setTimeout(r, 500));

    // fetch server info (try Java first)
    try {
      const javaUrl = `https://api.mcsrvstat.us/2/${ip}:${port}`;
      const javaRes = await axios.get(javaUrl, { timeout: 10000 }).catch(() => null);
      const j = javaRes ? javaRes.data : null;

      if (j && j.online) {
        // prepare nice output
        const motd = j.motd?.clean?.join(" ") || "N/A";
        let serverType = "Java Edition";
        const lowerMotd = motd.toLowerCase();
        if (lowerMotd.includes("geyser") || lowerMotd.includes("floodgate")) serverType = "Java + Bedrock (Geyser)";

        const playersOnline = (j.players && typeof j.players.online !== "undefined") ? j.players.online : "N/A";
        const playersMax = (j.players && typeof j.players.max !== "undefined") ? j.players.max : "N/A";

        const final = `✅ 𝗠𝗜𝗡𝗘𝗖𝗥𝗔𝗙𝗧 𝗦𝗧𝗔𝗧𝗨𝗦 ✅\n━━━━━━━━━━━━━━━━━\n🟢 Type: ${serverType}\n🌐 Host: ${j.hostname || ip}\n🔌 IP: ${j.ip || ip}:${j.port || port}\n👥 Players: ${playersOnline} / ${playersMax}\n⚙️ Version: ${j.version || "Unknown"}\n📜 MOTD: ${motd}\n━━━━━━━━━━━━━━━━━\n`;
        // remove loading message then send final
        try { await safeUnsend(sentInfo && (sentInfo.messageID || (sentInfo.message && sentInfo.message.messageID) || sentInfo.mid)); } catch(e) {}
        return api.sendMessage(final, threadID);
      }

      // if Java offline, try bedrock API
      const bedrockUrl = `https://api.mcstatus.io/v2/status/bedrock/${ip}:${port}`;
      const bedRes = await axios.get(bedrockUrl, { timeout: 10000 }).catch(() => null);
      const b = bedRes ? bedRes.data : null;

      if (b && b.online) {
        const playersOnline = b.players?.online ?? "N/A";
        const playersMax = b.players?.max ?? "N/A";
        const final = `✅ 𝗠𝗜𝗡𝗘𝗖𝗥𝗔𝗙𝗧 (BEDROCK) ✅\n━━━━━━━━━━━━━━━━━\n🟦 Type: Bedrock\n🌐 Host: ${b.host || ip}\n🔌 IP: ${b.host || ip}:${b.port || port}\n👥 Players: ${playersOnline} / ${playersMax}\n⚙️ Version: ${b.version?.name || "Unknown"}\n━━━━━━━━━━━━━━━━━\n`;
        try { await safeUnsend(sentInfo && (sentInfo.messageID || (sentInfo.message && sentInfo.message.messageID) || sentInfo.mid)); } catch(e) {}
        return api.sendMessage(final, threadID);
      }

      // none responded
      try { await safeUnsend(sentInfo && (sentInfo.messageID || (sentInfo.message && sentInfo.message.messageID) || sentInfo.mid)); } catch(e) {}
      return api.sendMessage(`🔴 Server ${ip}:${port} appears OFFLINE or unreachable.`, threadID);

    } catch (err) {
      console.error("MC command error:", err);
      try { await safeUnsend(sentInfo && (sentInfo.messageID || (sentInfo.message && sentInfo.message.messageID) || sentInfo.mid)); } catch(e) {}
      return api.sendMessage("❌ Error fetching server info. Please check IP/Port or try later.", threadID);
    }
  }
};
