const fetch = require("node-fetch");

module.exports = {
  config: {
    name: "autotime",
    version: "4.0",
    author: "Helal",
    countDown: 0,
    role: 0,
    category: "🕓 Utility",
    shortDescription: "Always-on auto send current time to all groups every 1 hour"
  },

  onStart: async function({ api }) {
    console.log("🕓 AutoTime v4 started — sending time to all groups every 1 hour...");

    // Immediately send once
    await sendTimeToAllGroups(api);

    // Then every 1 hour
    setInterval(async () => {
      await sendTimeToAllGroups(api);
    }, 60 * 60 * 1000); // 1 hour
  }
};

async function sendTimeToAllGroups(api) {
  try {
    const now = new Date();

    // English
    const enTime = now.toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    // Bangla
    const bnTime = now.toLocaleString("bn-BD", {
      timeZone: "Asia/Dhaka",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    // Hijri date via Aladhan API
    const res = await fetch(
      `https://api.aladhan.com/v1/gToH?date=${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`
    );
    const data = await res.json();
    const hijri = data.data.hijri;

    const arHijri = `${hijri.weekday.ar}، ${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`;

    const hijriBnMap = {
      "محرم": "মুহাররম",
      "صفر": "সফর",
      "ربيع الأول": "রবিউল আউয়াল",
      "ربيع الآخر": "রবিউস সানি",
      "جمادى الأولى": "জামাদিউল আউয়াল",
      "جمادى الآخرة": "জামাদিউস সানি",
      "رجب": "রজব",
      "شعبان": "শা’বান",
      "رمضان": "রমজান",
      "شوال": "শাওয়াল",
      "ذو القعدة": "জিলক্বদ",
      "ذو الحجة": "জিলহজ"
    };

    const banglaHijriMonth = hijriBnMap[hijri.month.ar] || hijri.month.ar;
    const banglaHijri = `${hijri.day} ${banglaHijriMonth} ${hijri.year} হিজরি`;

    // UI Formatting
    const msg =
`🌟━━━━━━━━━━━━━━🌟
🕒 *CURRENT TIME UPDATE*
━━━━━━━━━━━━━━
🌎 English: ${enTime}
🇧🇩 বাংলা: ${bnTime}
🕌 العربية (Hijri): ${arHijri}
📘 বাংলা হিজরি: ${banglaHijri}
━━━━━━━━━━━━━━
📅 Today: ${now.toLocaleDateString("en-GB")}
💬 Group: {GROUP_NAME_EMOJI}
✨ Stay Happy & Productive! ✨
🌟━━━━━━━━━━━━━━🌟`;

    // Get all group threads
    const allThreads = await api.getThreadList(100, null, ["INBOX"]);
    const groupThreads = allThreads.filter(t => t.isGroup);

    for (const thread of groupThreads) {
      try {
        const groupName = thread.threadName || "Group";
        const finalMsg = msg.replace("{GROUP_NAME_EMOJI}", `💌 ${groupName} 💌`);
        await api.sendMessage(finalMsg, thread.threadID);
      } catch (e) {
        console.error(`❌ Failed to send to ${thread.threadName || thread.threadID}:`, e.message);
      }
    }

    console.log(`✅ Sent hourly time to ${groupThreads.length} groups at ${now.toLocaleTimeString()}`);
  } catch (err) {
    console.error("AutoTime v4 Error:", err.message);
  }
}
