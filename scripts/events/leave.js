const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "leave",
    version: "2.0",
    author: "Helal Islam",
    category: "events"
  },

  onStart: async function ({ api, event, usersData }) {
    if (event.logMessageType !== "log:unsubscribe") return;
    
    return async function () {
      const { threadID } = event;
      const { leftParticipantFbId } = event.logMessageData;

      // Skip if bot itself leaves
      if (leftParticipantFbId == api.getCurrentUserID()) return;

      // Get user name
      const userName = await usersData.getName(leftParticipantFbId);

      // Video URL
      const videoUrl = "https://i.imgur.com/KwXubhi.mp4";
      const filePath = __dirname + "/cache/leaveVideo.mp4";

      try {
        // Download video
        const res = await axios.get(videoUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(filePath, Buffer.from(res.data, "binary"));

        // Send message with video
        api.sendMessage(
          {
            body: `${userName} left the group 😢`,
            attachment: fs.createReadStream(filePath)
          },
          threadID,
          () => fs.unlinkSync(filePath) // auto delete cache
        );

      } catch (e) {
        console.error("Leave event error:", e);
      }
    };
  }
};
