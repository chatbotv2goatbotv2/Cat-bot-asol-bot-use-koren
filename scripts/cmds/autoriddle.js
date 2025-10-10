// autoriddle.js
// English riddles, 10-min auto system, reply-only answers

module.exports = {
  config: {
    name: "autoriddle",
    version: "4.0",
    author: "Helal x GPT",
    role: 0,
    shortDescription: "Auto riddles every 10 mins (reply-based)",
    longDescription: "Sends random riddles every 10 minutes. Users must reply to the riddle message to answer. Supports on/off/top leaderboard.",
    category: "fun",
    guide: "{pn} on | off | top"
  },

  onStart: async function({ api, event, args }) {
    if (!global.autoRiddleThreads) global.autoRiddleThreads = {};
    const threadID = event.threadID;
    const cmd = (args[0] || "").toLowerCase();

    if (!global.autoRiddleThreads[threadID]) {
      global.autoRiddleThreads[threadID] = {
        enabled: false,
        scores: {},
        current: null,
        timeout: null,
        interval: null,
        messageID: null
      };
    }

    const thread = global.autoRiddleThreads[threadID];

    // ON
    if (cmd === "on") {
      if (thread.enabled) return api.sendMessage("⚠️ Auto Riddle is already ON in this chat.", threadID);
      thread.enabled = true;
      api.sendMessage("✅ Auto Riddle turned ON for this chat.", threadID);
      thread.interval = setInterval(() => startRiddle(api, threadID), 10 * 60 * 1000); // every 10 min
      return;
    }

    // OFF
    if (cmd === "off") {
      if (!thread.enabled) return api.sendMessage("⚠️ Auto Riddle is already OFF.", threadID);
      thread.enabled = false;
      clearInterval(thread.interval);
      if (thread.timeout) clearTimeout(thread.timeout);
      thread.current = null;
      thread.interval = null;
      thread.messageID = null;
      return api.sendMessage("🛑 Auto Riddle turned OFF for this chat.", threadID);
    }

    // TOP
    if (cmd === "top") return sendLeaderboard(api, threadID);

    // Help
    return api.sendMessage("🧠 Commands:\n• autoriddle on — start riddles\n• autoriddle off — stop riddles\n• autoriddle top — show leaderboard\n\nType `riddletop` anytime to view top players.", threadID);
  },

  onChat: async function({ api, event }) {
    if (!global.autoRiddleThreads) return;
    const threadID = event.threadID;
    const reply = event.messageReply;
    const body = (event.body || "").trim();
    if (!reply || !body) return;
    const thread = global.autoRiddleThreads[threadID];
    if (!thread || !thread.enabled || !thread.current) return;

    // Must reply to the active riddle message
    if (reply.messageID !== thread.messageID) return;

    const correctAns = (thread.current.a || "").toLowerCase();
    const userAns = body.toLowerCase();

    if (userAns === correctAns) {
      if (thread.timeout) clearTimeout(thread.timeout);
      const user = event.senderName || event.senderID;
      thread.scores[user] = (thread.scores[user] || 0) + 1;
      api.sendMessage(`🎉 Congratulations ${user}! Correct answer: ${thread.current.a} 🏆`, threadID);
      thread.current = null;
      thread.messageID = null;
      thread.timeout = null;
    } else {
      api.sendMessage("❌ Wrong answer! Try again 😅", threadID);
    }
  }
};

// ---------- Helper Functions ----------
function startRiddle(api, threadID) {
  const thread = global.autoRiddleThreads[threadID];
  if (!thread || !thread.enabled || thread.current) return;

  const riddles = [
    { q: "What has keys but can’t open locks?", a: "keyboard" },
    { q: "What has a face and hands but no arms or legs?", a: "clock" },
    { q: "What goes up but never comes down?", a: "age" },
    { q: "What has a neck but no head?", a: "bottle" },
    { q: "What can travel around the world while staying in a corner?", a: "stamp" },
    { q: "What has one eye but can’t see?", a: "needle" },
    { q: "I’m tall when I’m young and short when I’m old. What am I?", a: "candle" },
    { q: "If two’s company and three’s a crowd, what are four and five?", a: "nine" },
    { q: "What comes once in a minute, twice in a moment, but never in a thousand years?", a: "m" },
    { q: "If you have me, you want to share me. Once you share me, you don’t have me. What am I?", a: "secret" },
    { q: "The more you take, the more you leave behind. What am I?", a: "footsteps" },
    { q: "If 1 = 5, 2 = 25, 3 = 125, 4 = 625, then 5 = ?", a: "1" },
    { q: "If three cats can catch three mice in three minutes, how long will 100 cats take to catch 100 mice?", a: "3" },
    { q: "A farmer has 17 sheep and all but 9 run away. How many are left?", a: "9" },
    { q: "If 2 + 2 = 8, 3 + 3 = 18, 4 + 4 = 32, then 5 + 5 = ?", a: "50" }
  ];

  const pick = riddles[Math.floor(Math.random() * riddles.length)];
  thread.current = pick;

  api.sendMessage(
    `🧩 New Riddle!\n\n${pick.q}\n\n⏳ You have 2 minutes to reply with the correct answer (English).`,
    threadID,
    (err, info) => {
      if (info && info.messageID) thread.messageID = info.messageID;
    }
  );

  thread.timeout = setTimeout(() => {
    if (thread.current) {
      api.sendMessage(`⏰ Time’s up! Correct answer: ${thread.current.a}`, threadID);
      thread.current = null;
      thread.messageID = null;
      thread.timeout = null;
    }
  }, 2 * 60 * 1000);
}

function sendLeaderboard(api, threadID) {
  const thread = global.autoRiddleThreads[threadID];
  if (!thread || !thread.scores || !Object.keys(thread.scores).length)
    return api.sendMessage("🏆 No winners yet in this chat!", threadID);

  const sorted = Object.entries(thread.scores).sort((a, b) => b[1] - a[1]);
  let msg = "🏆 Top Riddle Players:\n\n";
  sorted.slice(0, 10).forEach(([name, score], i) => {
    msg += `${i + 1}. ${name} — ${score} point${score > 1 ? "s" : ""}\n`;
  });
  api.sendMessage(msg, threadID);
}