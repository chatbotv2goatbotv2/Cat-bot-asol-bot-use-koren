const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "funnyleave",
    eventType: ["log:unsubscribe"],
    version: "1.1",
    author: "Helal",
    category: "🎭 FUN",
  },

  onStart: async function ({ event, api }) {
    try {
      const leftUser = event.logMessageData.leftParticipantFbId;
      const userInfo = await api.getUserInfo(leftUser);
      const name = userInfo[leftUser]?.name || "Someone";

      // Funny messages (random)
      const funnyTexts = [
        `🤣 ${name} just rage quit!`,
        `💨 ${name} escaped the chaos!`,
        `😂 ${name} couldn’t handle the vibes!`,
        `👀 ${name} left without saying bye!`,
        `😏 ${name} said: “I’m outta here!”`,
      ];
      const text = funnyTexts[Math.floor(Math.random() * funnyTexts.length)];

      // Download the video from Imgur
      const videoUrl = "https://i.imgur.com/KwXubhi.mp4";
      const videoPath = path.join(__dirname, "funnyleave.mp4");
      const response = await axios.get(videoUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(videoPath, Buffer.from(response.data));

      // Send funny message + video
      api.sendMessage(
        { body: text, attachment: fs.createReadStream(videoPath) },
        event.threadID,
        () => fs.unlinkSync(videoPath) // delete after sending
      );
    } catch (e) {
      console.error("Funny Leave Error:", e);
    }
  },
};
