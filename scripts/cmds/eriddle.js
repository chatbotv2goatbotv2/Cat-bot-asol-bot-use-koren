// eriddle.js
// English Riddle Game — Fully Standalone
// No dependency, 100% reply working system
// Author: Helal

const riddles = [
  { q: "What has to be broken before you can use it?", a: "egg" },
  { q: "I’m tall when I’m young, and I’m short when I’m old. What am I?", a: "candle" },
  { q: "What month of the year has 28 days?", a: "all" },
  { q: "What is full of holes but still holds water?", a: "sponge" },
  { q: "What question can you never answer yes to?", a: "are you asleep" },
  { q: "What is always in front of you but can’t be seen?", a: "future" },
  { q: "There’s a one-story house in which everything is yellow. What color are the stairs?", a: "no stairs" },
  { q: "What can you break, even if you never pick it up or touch it?", a: "promise" },
  { q: "What goes up but never comes down?", a: "age" },
  { q: "A man who was outside in the rain without an umbrella or hat didn’t get a single hair on his head wet. Why?", a: "he was bald" },
  { q: "What gets wet while drying?", a: "towel" },
  { q: "What can you keep after giving to someone?", a: "your word" },
  { q: "I shave every day, but my beard stays the same. Who am I?", a: "barber" },
  { q: "You see me once in June, twice in November, and not at all in May. What am I?", a: "letter e" },
  { q: "What can’t talk but will reply when spoken to?", a: "echo" },
  { q: "The more of this there is, the less you see. What is it?", a: "darkness" },
  { q: "What runs all around a backyard, yet never moves?", a: "fence" },
  { q: "What can travel all around the world without leaving its corner?", a: "stamp" },
  { q: "What has many keys but can’t open a single lock?", a: "piano" },
  { q: "What has one eye, but can’t see?", a: "needle" },
  { q: "What has hands, but can’t clap?", a: "clock" },
  { q: "What has words, but never speaks?", a: "book" },
  { q: "What kind of band never plays music?", a: "rubber band" },
  { q: "What has a head and a tail but no body?", a: "coin" },
  { q: "What has legs, but doesn’t walk?", a: "table" },
  { q: "What can fill a room but takes up no space?", a: "light" },
  { q: "What can you catch, but not throw?", a: "cold" },
  { q: "Where does today come before yesterday?", a: "dictionary" },
  { q: "What gets bigger the more you take away?", a: "hole" },
  { q: "What comes once in a minute, twice in a moment, but never in a thousand years?", a: "letter m" },
  { q: "What has a thumb and four fingers, but is not alive?", a: "glove" },
  { q: "What can you hold in your left hand but not in your right?", a: "your right hand" },
  { q: "If two’s company, and three’s a crowd, what are four and five?", a: "nine" },
  { q: "What has a neck but no head?", a: "bottle" },
  { q: "What invention lets you look right through a wall?", a: "window" },
  { q: "What goes through cities and fields, but never moves?", a: "road" },
  { q: "What building has the most stories?", a: "library" },
  { q: "What kind of tree can you carry in your hand?", a: "palm" },
  { q: "What has ears but cannot hear?", a: "corn" },
  { q: "What type of cheese is made backward?", a: "edam" }
];

const activeRiddles = new Map();

module.exports = {
  config: {
    name: "eriddle",
    aliases: ["englishriddle", "riddleen"],
    version: "5.0",
    author: "Helal",
    countDown: 3,
    role: 0,
    category: "fun",
    shortDescription: { en: "Play English riddles (standalone reply system)" }
  },

  onStart: async function ({ message }) {
    const item = riddles[Math.floor(Math.random() * riddles.length)];
    const text = `🧠 *English Riddle Time!*\n\n❓ Question: ${item.q}\n\n💬 Reply to this message with your answer!`;

    message.reply(text, (err, info) => {
      if (err) return;
      activeRiddles.set(info.messageID, {
        answer: item.a.toLowerCase(),
        time: Date.now()
      });
    });
  },

  onChat: async function ({ event, message }) {
    try {
      const replied = event.messageReply;
      if (!replied) return;
      const data = activeRiddles.get(replied.messageID);
      if (!data) return;

      const userAns = (event.body || "").trim().toLowerCase();
      if (!userAns) return;

      if (
        userAns === data.answer ||
        data.answer.includes(userAns) ||
        userAns.includes(data.answer)
      ) {
        message.reply(`✅ Correct! The answer is *${data.answer}* 🎉`);
      } else {
        message.reply(`❌ Wrong! The correct answer was *${data.answer}* 🧩`);
      }

      activeRiddles.delete(replied.messageID);
    } catch (e) {
      console.error(e);
    }
  }
};