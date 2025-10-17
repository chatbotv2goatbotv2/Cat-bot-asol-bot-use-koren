const fetch = require("node-fetch");

module.exports = {
  config: {
    name: "time",
    aliases: ["clock"],
    version: "4.0",
    author: "Helal",
    countDown: 3,
    role: 0,
    category: "utility",
    shortDescription: { en: "Show current time in English, Bangla & Hijri (Arabic + Bangla)" }
  },

  onStart: async function ({ message }) {
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
        second: "2-digit",
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
        second: "2-digit",
        hour12: true
      });

      // Fetch Hijri date (Aladhan API)
      const res = await fetch("https://api.aladhan.com/v1/gToH?date=" +
        `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`);
      const data = await res.json();
      const hijri = data.data.hijri;

      // Arabic Hijri
      const arHijri = `${hijri.weekday.ar}، ${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`;

      // Hijri month Arabic → Bangla map
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
      const banglaHijri = `${hijri.weekday.en === "Friday" ? "শুক্রবার" :
        hijri.weekday.en === "Saturday" ? "শনিবার" :
        hijri.weekday.en === "Sunday" ? "রবিবার" :
        hijri.weekday.en === "Monday" ? "সোমবার" :
        hijri.weekday.en === "Tuesday" ? "মঙ্গলবার" :
        hijri.weekday.en === "Wednesday" ? "বুধবার" : "বৃহস্পতিবার"}, ${hijri.day} ${banglaHijriMonth} ${hijri.year} হিজরি`;

      const msg =
`🕓 *CURRENT TIME (MULTI-LANGUAGE)*

🌎 English:
${enTime}

🇧🇩 বাংলা:
${bnTime}

🕌 العربية (Hijri):
${arHijri}

📘 বাংলা হিজরি:
${banglaHijri}

✨ Timezones:
🇧🇩 Asia/Dhaka | 🕋 Makkah, Saudi Arabia`;

      message.reply(msg);
    } catch (err) {
      console.error(err);
      message.reply("⚠️ Couldn't fetch Hijri or local time right now.");
    }
  }
};
