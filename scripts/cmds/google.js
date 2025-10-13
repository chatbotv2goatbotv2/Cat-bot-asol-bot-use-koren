const axios = require("axios");

module.exports = {
  config: {
    name: "google",
    aliases: ["gl", "ggl", "googleai"],
    version: "1.0.2",
    author: "SHIFU",
    countDown: 0,
    role: 0,
    category: "google",
    shortDescription: "Chat with AI or ask anything.",
    longDescription: "Ask anything to Google AI or reply to an image for AI description.",
    guide: "{pn} <message> | reply to a photo"
  },

  onStart: async function ({ api, event, args }) {
    const input = args.join(" ").trim();
    const encodedApi = "aHR0cHM6Ly9hcGlzLWtlaXRoLnZlcmNlbC5hcHAvYWkvZGVlcHNlZWtWMz9xPQ==";
    const apiUrl = Buffer.from(encodedApi, "base64").toString("utf-8");

    // যদি মেসেজ reply করা হয়
    if (event.type === "message_reply") {
      const reply = event.messageReply;
      const imageUrl = reply.attachments?.[0]?.url;

      if (!imageUrl) {
        return api.sendMessage("⚠️ অনুগ্রহ করে কোনো ছবি reply করে দাও যাতে আমি বিশ্লেষণ করতে পারি!", event.threadID, event.messageID);
      }

      try {
        api.sendMessage("🧠 অনুগ্রহ করে অপেক্ষা করো... ছবিটা বিশ্লেষণ করা হচ্ছে 🌀", event.threadID, event.messageID);

        const res = await axios.post(`${apiUrl}${encodeURIComponent(input || "Describe this image.")}`, {
          image: imageUrl
        });

        const result = res.data.result || res.data.response || res.data.message || "🤔 কোনো রেসপন্স পাওয়া যায়নি।";
        api.sendMessage(result, event.threadID, event.messageID);
      } catch (err) {
        console.error("AI Image Error:", err.message);
        api.sendMessage("❌ কিছু সমস্যা হয়েছে! আবার চেষ্টা করো।", event.threadID, event.messageID);
      }

      return;
    }

    // টেক্সট ইনপুটের জন্য
    if (!input) {
      return api.sendMessage(
        "👋 হাই! আমি AI Chat Bot.\n💬 আমাকে কিছু জিজ্ঞাসা করো বা কোনো ছবিতে reply করো যাতে আমি বিশ্লেষণ করতে পারি!",
        event.threadID,
        event.messageID
      );
    }

    try {
      api.sendMessage("🤖 প্রসেসিং হচ্ছে... একটু অপেক্ষা করো 🕒", event.threadID, event.messageID);

      const res = await axios.get(`${apiUrl}${encodeURIComponent(input)}`);
      const result = res.data.result || res.data.response || res.data.message || "🤔 কোনো রেসপন্স পাওয়া যায়নি।";

      api.sendMessage(result, event.threadID, event.messageID);
    } catch (err) {
      console.error("AI Text Error:", err.message);
      api.sendMessage("⚠️ সার্ভারে সমস্যা হচ্ছে, পরে চেষ্টা করো!", event.threadID, event.messageID);
    }
  }
};
