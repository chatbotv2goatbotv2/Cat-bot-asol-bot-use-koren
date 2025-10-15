const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "leave",
    version: "2.0",
    author: "Helal Islam",
    category: "events"
  },

  onStart: async function ({ api, event }) {
    if (event.logMessageType !== "log:unsubscribe") return;

    const { leftParticipantFbId } = event.logMessageData;
    const botID = api.getCurrentUserID();

    // যদি নিজে group থেকে বের হয়, কিছু পাঠাবে না
    if (leftParticipantFbId === botID) return;

    try {
      const userInfo = await api.getUserInfo(leftParticipantFbId);
      const userName = userInfo[leftParticipantFbId].name;

      // Funny leave message list 😆
      const messages = [
        `😢 ${userName} ran away from the group!`,
        `😂 ${userName} just rage-quit! GG!`,
        `😎 ${userName} decided to go solo adventure!`,
        `🕊️ ${userName} has left the building... forever maybe!`
      ];

      // Random message choose করবে
      const finalMessage = messages[Math.floor(Math.random() * messages.length)];

      // Local video path
      const videoPath = path.join(__dirname, "cache", "leave.mp4");

      // Video download না থাকলে link থেকে নেবে
      const videoURL = "https://i.imgur.com/KwXubhi.mp4";

      // Download video if not exists
      if (!fs.existsSync(videoPath)) {
        const axios = require("axios");
        const response = await axios.get(videoURL, { responseType: "arraybuffer" });
        fs.writeFileSync(videoPath, Buffer.from(response.data, "binary"));
      }

      // Send message + video
      api.sendMessage({
        body: finalMessage,
        attachment: fs.createReadStream(videoPath)
      }, event.threadID);

    } catch (error) {
      console.error("Leave event error:", error);
    }
  }
};
