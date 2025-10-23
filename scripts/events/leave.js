const { getTime } = global.utils;

module.exports = {
  config: {
    name: "leave",
    version: "1.0",
    author: "Helal",
    category: "events"
  },

  langs: {
    en: {
      leaveMessages: [
        "😢 {userName} left {boxName}... Maybe WiFi bill due?",
        "🚪 {userName} sneaked out of {boxName}! We saw that 👀",
        "💨 {userName} vanished faster than my motivation!",
        "😭 Goodbye {userName}, don’t forget to come back with snacks 🍟",
        "🧳 {userName} packed bags and escaped from {boxName} ✈️",
        "🤡 {userName} rage quit? Drama loading... 🎬",
        "👻 {userName} disappeared like a ghost from {boxName} 👀",
        "🦋 Bye {userName}! Even butterflies cry sometimes 😭"
      ]
    }
  },

  onStart: async ({ event, threadsData, message, getLang }) => {
    if (event.logMessageType !== "log:unsubscribe") return;

    const { threadID, logMessageData } = event;
    const threadData = await threadsData.get(threadID);
    const threadName = threadData.threadName || "this group";

    const userLeftID = logMessageData.leftParticipantFbId;
    const botID = global.GoatBot.botID;

    // If bot removed, skip message
    if (userLeftID == botID) return;

    try {
      const userInfo = await global.api.getUserInfo(userLeftID);
      const userName = userInfo[userLeftID]?.name || "Someone";
      const leaveList = getLang("leaveMessages");
      const randomMsg = leaveList[Math.floor(Math.random() * leaveList.length)];

      const msg = randomMsg
        .replace(/\{userName\}/g, userName)
        .replace(/\{boxName\}/g, threadName);

      message.send(msg);
    } catch (e) {
      console.error("❌ Error sending leave message:", e);
    }
  }
};