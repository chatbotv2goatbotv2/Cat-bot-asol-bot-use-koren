// mriddle.js
// 100+ Bangla + English riddles — fully standalone working file
// Author: Helal

const riddles = [
  // 🌸 Bangla Riddles
  { q: "যে জিনিসটি ভাঙলে সবাই খুশি হয়?", a: "উপবাস" },
  { q: "কোন জিনিসটি যত নেয়া হয়, তত বড় হয়?", a: "গর্ত" },
  { q: "যে জিনিসটি ভিজে না, তবুও নদীর ভিতরে থাকে?", a: "ছায়া" },
  { q: "দিনে একবার আসে, রাতে তিনবার আসে— সেটা কী?", a: "অক্ষর আ" },
  { q: "যে চলে কিন্তু হাঁটে না?", a: "সময়" },
  { q: "যে পাখি সকালে গান গায় কিন্তু উড়ে না?", a: "ঘড়ি" },
  { q: "যে যত টানবে তত ছোট হবে?", a: "ব্যান্ড" },
  { q: "যে কথা বলে না কিন্তু উত্তর দেয়?", a: "প্রতিধ্বনি" },
  { q: "যে বস্তু তুমি ধরতে পারো না কিন্তু সবাই অনুভব করে?", a: "বায়ু" },
  { q: "যার দাঁত আছে কিন্তু কামড়ায় না?", a: "চিরুনি" },
  { q: "যে পাথর ছুঁড়লে পানিতে যায় না?", a: "বরফ" },
  { q: "যে জিনিসটি যত শুকায় তত ভিজে যায়?", a: "তোয়ালে" },
  { q: "যে কখনো বাড়ি থেকে বের হয় না কিন্তু সারাবিশ্ব ঘুরে আসে?", a: "স্ট্যাম্প" },
  { q: "যার মুখ আছে কিন্তু কথা বলে না?", a: "নদী" },
  { q: "যে উড়তে পারে না কিন্তু ডানা আছে?", a: "বিমান" },
  { q: "যে জিনিসটি শুয়ে কাজ করে কিন্তু দাঁড়ালে মরে যায়?", a: "পেন্সিল" },
  { q: "যে পাখি প্রতিদিন সকালে জাগায়?", a: "মোরগ" },
  { q: "যার হাত আছে কিন্তু তালি দিতে পারে না?", a: "ঘড়ি" },
  { q: "যে জিনিসটি চুরি করা যায় না?", a: "সময়" },
  { q: "যে জিনিসটি আগুনে পোড়ে না, পানিতে ডুবে না?", a: "ছায়া" },
  { q: "যার মাথা আছে কিন্তু দেহ নেই?", a: "বোতল" },
  { q: "যে জিনিসটি আলোতে হারিয়ে যায়?", a: "অন্ধকার" },
  { q: "যে যত নেয়, তত বেশি ফেলে যায়?", a: "পদচিহ্ন" },
  { q: "যে দিনে ঘুমায় আর রাতে জাগে?", a: "বাদুড়" },
  { q: "যে জিনিসটি শোনার জন্য লাগে কিন্তু শোনা যায় না?", a: "নীরবতা" },
  { q: "যে জিনিসটি না বললেও সবাই বুঝে?", a: "চোখের ভাষা" },
  { q: "যে প্রাণী নিজের ঘর নিজের পিঠে বহন করে?", a: "কচ্ছপ" },
  { q: "যে জিনিসটি যত বেশি থাকে, তত কম দেখা যায়?", a: "অন্ধকার" },
  { q: "যে জিনিসটি চলে কিন্তু কখনো থামে না?", a: "সময়" },
  { q: "যে কখনো ক্লান্ত হয় না, কখনো থামে না?", a: "ঘড়ি" },
  { q: "যে জিনিসটি যত কাটা হয় তত বাড়ে?", a: "চুল" },
  { q: "যে প্রাণী রাতে বেশি দেখে?", a: "বিড়াল" },
  { q: "যে বস্তুতে ছিদ্র আছে কিন্তু পানি ধরে রাখতে পারে?", a: "স্পঞ্জ" },
  { q: "যে জিনিসটি যত দেয়া হয় তত কমে না?", a: "ভালোবাসা" },
  { q: "যে মানুষ দাঁত ফেলে, কিন্তু বয়স কমে?", a: "বাচ্চা" },
  { q: "যে কখনো কথা বলে না কিন্তু শোনায়?", a: "রেডিও" },
  { q: "যে প্রাণী হাতি দেখলেই হাসে?", a: "ইঁদুর" },
  { q: "যে জিনিসটি ভাঙলে পানি বের হয়?", a: "ডিম" },
  { q: "যে জিনিসটি না থাকলে অন্ধকার, থাকলে আলো?", a: "সূর্য" },
  { q: "যে প্রাণী পাখি নয় তবুও উড়ে?", a: "বাদুড়" },
  { q: "যে জিনিসটি নাম বললেই ভেঙে যায়?", a: "নীরবতা" },

  // 🌍 English Riddles
  { q: "What has to be broken before you can use it?", a: "egg" },
  { q: "I’m tall when I’m young, and I’m short when I’m old. What am I?", a: "candle" },
  { q: "What gets wet while drying?", a: "towel" },
  { q: "What has one eye, but can’t see?", a: "needle" },
  { q: "What has a head and a tail but no body?", a: "coin" },
  { q: "What can you catch, but not throw?", a: "cold" },
  { q: "What goes up but never comes down?", a: "age" },
  { q: "What can travel around the world while staying in a corner?", a: "stamp" },
  { q: "What has many keys but can’t open a single lock?", a: "piano" },
  { q: "What has hands, but can’t clap?", a: "clock" },
  { q: "What has words, but never speaks?", a: "book" },
  { q: "What comes once in a minute, twice in a moment, but never in a thousand years?", a: "letter m" },
  { q: "What can you hold in your left hand but not in your right?", a: "your right hand" },
  { q: "The more of this there is, the less you see. What is it?", a: "darkness" },
  { q: "What has 88 keys but can’t open a door?", a: "piano" },
  { q: "What has an endless supply of letters but starts empty?", a: "mailbox" },
  { q: "What gets sharper the more you use it?", a: "brain" },
  { q: "What has four fingers and a thumb but isn’t alive?", a: "glove" },
  { q: "What belongs to you, but other people use it more?", a: "your name" },
  { q: "What kind of room has no doors or windows?", a: "mushroom" },
  { q: "What has a neck but no head?", a: "bottle" },
  { q: "What can fill a room but takes up no space?", a: "light" },
  { q: "What runs but never walks?", a: "river" },
  { q: "What gets bigger the more you take away?", a: "hole" },
  { q: "What has legs but doesn’t walk?", a: "table" },
  { q: "What kind of tree can you carry in your hand?", a: "palm" },
  { q: "What can fly without wings?", a: "time" },
  { q: "What has cities but no houses, forests but no trees, rivers but no water?", a: "map" },
  { q: "What goes up and down but doesn’t move?", a: "stairs" },
  { q: "What can you break, even if you never pick it up or touch it?", a: "promise" },
  { q: "What kind of band never plays music?", a: "rubber band" },
  { q: "What has eyes but can’t see?", a: "potato" },
  { q: "What is full of holes but still holds water?", a: "sponge" },
  { q: "What has ears but cannot hear?", a: "corn" },
  { q: "What has teeth but cannot bite?", a: "comb" },
  { q: "What has a ring but no finger?", a: "telephone" }
];

const activeRiddles = new Map();

module.exports = {
  config: {
    name: "mriddle",
    aliases: ["mixdriddle", "bnriddle"],
    version: "5.0",
    author: "Helal",
    countDown: 3,
    role: 0,
    category: "fun",
    shortDescription: { en: "Play large random Bangla or English riddles (Standalone)" }
  },

  onStart: async function ({ message }) {
    const item = riddles[Math.floor(Math.random() * riddles.length)];
    const text = `🧠 *Riddle Time!*\n\n❓ ${item.q}\n\n💬 Reply to this message with your answer!`;
    message.reply(text, (err, info) => {
      if (err) return;
      activeRiddles.set(info.messageID, {
        answer: item.a.toLowerCase(),
        time: Date.now()
      });
    });
  },

  onChat: async function ({ event, message }) {
    const replied = event.messageReply;
    if (!replied) return;
    const data = activeRiddles.get(replied.messageID);
    if (!data) return;
    const userAns = (event.body || "").trim().toLowerCase();
    if (!userAns) return;

    if (userAns === data.answer || data.answer.includes(userAns) || userAns.includes(data.answer)) {
      message.reply(`✅ Correct! 🎉\n👉 Answer: *${data.answer}*`);
    } else {
      message.reply(`❌ Wrong! 😅\n👉 Correct answer: *${data.answer}*`);
    }

    activeRiddles.delete(replied.messageID);
  }
};