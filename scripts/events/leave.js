const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "leave",
    version: "2.0",
    author: "Helal + GPT",
    category: "events"
  },

  onStart: async ({ threadsData, message, event, api, usersData }) => {
    if (event.logMessageType !== "log:unsubscribe") return;

    const { threadID, logMessageData } = event;
    const leftID = logMessageData.leftParticipantFbId;

    // Bot নিজে leave করলে কিছু না পাঠাবে
    if (leftID === api.getCurrentUserID()) return;

    try {
      // ইউজারের নাম বের করা
      const userName = await usersData.getName(leftID);

      // ভিডিও URL
      const videoUrl = "https://i.imgur.com/KwXubhi.mp4";
      const filePath = __dirname + "/cache/leave.mp4";

      // ভিডিও ডাউনলোড
      const videoBuffer = (await axios.get(videoUrl, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(filePath, Buffer.from(videoBuffer, "binary"));

      // মেসেজ তৈরি ও পাঠানো
      await message.send({
        body: `${userName} left the group`,
        attachment: fs.createReadStream(filePath)
      });

      // Cache file মুছে ফেলা
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error("❌ Leave Event Error:", err);
    }
  }
};
