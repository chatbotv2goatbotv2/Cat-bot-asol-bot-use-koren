const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "sing",
    aliases: ["music", "gan", "গান"], // 🔥 একাধিক কমান্ড নাম
    version: "3.0.0",
    author: "Helal",
    countDown: 5,
    role: 0,
    shortDescription: "Download and play YouTube songs 🎵",
    longDescription: "Search any song by name or YouTube link and the bot will send the MP3 audio file 💿",
    category: "🎶 Music",
    guide: {
      en: "{pn} <song name or YouTube link>\n\nExample:\n{pn} faded\n{pn} https://youtu.be/60ItHLz5WEA"
    }
  },

  onStart: async function ({ api, event, args }) {
    const checkUrl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
    const baseApiUrl = async () => {
      const { data } = await axios.get("https://raw.githubusercontent.com/cyber-ullash/cyber-ullash/refs/heads/main/UllashApi.json");
      return data.api;
    };

    if (!args[0])
      return api.sendMessage("⚠️ Please provide a song name or YouTube link!", event.threadID);

    const input = args.join(" ");
    const path = __dirname + "/song.mp3";

    // 🎯 যদি YouTube লিংক হয়
    if (checkUrl.test(input)) {
      const id = input.match(checkUrl)[1];
      const { data } = await axios.get(`${await baseApiUrl()}/ytDl3?link=${id}&format=mp3`);
      const audio = (await axios.get(data.downloadLink, { responseType: "arraybuffer" })).data;

      fs.writeFileSync(path, Buffer.from(audio));
      return api.sendMessage(
        { body: `🎧 ${data.title}\n📦 Quality: ${data.quality}`, attachment: fs.createReadStream(path) },
        event.threadID,
        () => fs.unlinkSync(path)
      );
    }

    // 🔎 সার্চ করে গান দেখাবে
    const { data } = await axios.get(`${await baseApiUrl()}/ytFullSearch?songName=${input}`);
    const results = data.slice(0, 6);

    if (results.length === 0)
      return api.sendMessage("❌ No results found.", event.threadID);

    let msg = "🎶 Choose your song by replying with the number:\n\n";
    const thumbs = [];

    let i = 1;
    for (const r of results) {
      thumbs.push(await getThumb(r.thumbnail, `${i}.jpg`));
      msg += `🎵 ${i++}. ${r.title}\n⏱️ Duration: ${r.time}\n📺 Channel: ${r.channel.name}\n\n`;
    }

    api.sendMessage(
      { body: msg + "👉 Reply with your chosen number.", attachment: await Promise.all(thumbs) },
      event.threadID,
      (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: module.exports.config.name,
          author: event.senderID,
          results
        });
      }
    );
  },

  onReply: async function ({ api, event, Reply }) {
    try {
      const { author, results } = Reply;
      if (event.senderID !== author)
        return api.sendMessage("⚠️ Only the original requester can reply!", event.threadID);

      const num = parseInt(event.body);
      if (isNaN(num) || num < 1 || num > results.length)
        return api.sendMessage("❌ Please reply with a valid number (1–6).", event.threadID);

      const song = results[num - 1];
      const path = __dirname + "/song.mp3";

      const { data } = await axios.get(`${await (async () => {
        const { data } = await axios.get("https://raw.githubusercontent.com/cyber-ullash/cyber-ullash/refs/heads/main/UllashApi.json");
        return data.api;
      })()}/ytDl3?link=${song.id}&format=mp3`);

      const audio = (await axios.get(data.downloadLink, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(path, Buffer.from(audio));

      await api.sendMessage(
        { body: `🎧 Now playing: ${data.title}\n📡 Quality: ${data.quality}`, attachment: fs.createReadStream(path) },
        event.threadID,
        () => fs.unlinkSync(path)
      );
    } catch (e) {
      console.log(e);
      api.sendMessage("❌ Failed to send audio (maybe >26MB).", event.threadID);
    }
  }
};

// 🧩 Thumbnail download helper
async function getThumb(url, file) {
  const res = await axios.get(url, { responseType: "stream" });
  res.data.path = file;
  return res.data;
}