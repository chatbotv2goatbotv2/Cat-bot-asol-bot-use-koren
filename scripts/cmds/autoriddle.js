// autoriddle.js
// Paste this file into modules/commands/autoriddle.js
// English-only riddles, per-thread autoriddle on/off, 15min interval, 2min answer timeout

module.exports = {
  config: {
    name: "autoriddle",
    version: "3.1",
    author: "Helal x GPT",
    role: 0,
    shortDescription: "Auto riddles every 15 mins (per-thread) with on/off and leaderboard",
    longDescription: "Sends math, logic, and fun riddles every 15 minutes in the thread where it's turned on. Supports on/off/top and in-chat 'riddletop' alias.",
    category: "fun",
    guide: "{pn} on | off | top"
  },

  // Run commands: autoriddle on / autoriddle off / autoriddle top
  onStart: async function({ api, event, args }) {
    if (!global.autoRiddleThreads) global.autoRiddleThreads = {};

    const sub = (args && args[0]) ? args[0].toLowerCase() : null;
    const threadID = event.threadID;

    // Initialize thread entry if missing
    if (!global.autoRiddleThreads[threadID]) {
      global.autoRiddleThreads[threadID] = {
        enabled: false,
        scores: {},
        current: null,
        timeout: null,
        interval: null
      };
    }

    const entry = global.autoRiddleThreads[threadID];

    // TURN ON
    if (sub === "on") {
      if (entry.enabled) return api.sendMessage("⚠️ Auto Riddle is already ON in this chat.", threadID);
      entry.enabled = true;
      startRiddleForThread(api, threadID);
      entry.interval = setInterval(() => startRiddleForThread(api, threadID), 15 * 60 * 1000); // 15 minutes
      return api.sendMessage("✅ Auto Riddle turned ON for this chat! A new riddle will appear every 15 minutes.", threadID);
    }

    // TURN OFF
    if (sub === "off") {
      if (!entry.enabled) return api.sendMessage("⚠️ Auto Riddle is not running in this chat.", threadID);
      entry.enabled = false;
      clearInterval(entry.interval);
      if (entry.timeout) clearTimeout(entry.timeout);
      entry.current = null;
      entry.interval = null;
      entry.timeout = null;
      return api.sendMessage("🛑 Auto Riddle turned OFF for this chat.", threadID);
    }

    // TOP / Leaderboard
    if (sub === "top") {
      return sendLeaderboard(api, threadID);
    }

    // Help message (no argument)
    return api.sendMessage(
      "🧠 AutoRiddle commands:\n• autoriddle on → Start auto riddles in this chat\n• autoriddle off → Stop auto riddles in this chat\n• autoriddle top → Show leaderboard for this chat\n\nAlias: type `riddletop` in chat to view leaderboard as well.",
      threadID
    );
  },

  // Listen to messages to accept answers and 'riddletop' alias
  onChat: async function({ api, event }) {
    try {
      if (!global.autoRiddleThreads) return;
      const threadID = event.threadID;
      if (!global.autoRiddleThreads[threadID]) return;

      const entry = global.autoRiddleThreads[threadID];
      const body = (event.body || "").trim();
      if (!body) return;

      const lower = body.toLowerCase();

      // Alias command typed directly in chat
      if (lower === "riddletop") {
        return sendLeaderboard(api, threadID);
      }

      // Only accept answers when a riddle is active in this thread
      if (!entry.enabled || !entry.current) return;

      const correct = (entry.current.a || "").toLowerCase();

      // Correct answer
      if (lower === correct) {
        if (entry.timeout) clearTimeout(entry.timeout);
        const user = event.senderName || event.senderID;
        entry.scores[user] = (entry.scores[user] || 0) + 1;
        api.sendMessage(`🎉 Congratulations ${user}! Correct answer: ${entry.current.a} 🏆`, threadID);
        entry.current = null;
        entry.timeout = null;
        return;
      }

      // Wrong answer (give short friendly feedback)
      api.sendMessage("❌ Wrong answer! Try again 😅", threadID);
    } catch (err) {
      console.error("autoriddle onChat error:", err);
    }
  }
};

// -------------------- Helper functions (internal) --------------------

function startRiddleForThread(api, threadID) {
  if (!global.autoRiddleThreads) return;
  const entry = global.autoRiddleThreads[threadID];
  if (!entry || !entry.enabled) return;
  if (entry.current) return; // already an active riddle

  // Riddle pool (English only: fun, logic, math)
  const riddles = [
    // Fun / classic
    { q: "What has keys but can't open locks?", a: "keyboard" },
    { q: "What has a face and hands but no arms or legs?", a: "clock" },
    { q: "What has cities but no houses, forests but no trees, and rivers but no water?", a: "map" },
    { q: "What has a neck but no head?", a: "bottle" },
    { q: "What goes up but never comes down?", a: "age" },
    { q: "What runs but never walks?", a: "water" },
    { q: "What can travel around the world while staying in a corner?", a: "stamp" },
    { q: "I'm tall when I'm young, and short when I'm old. What am I?", a: "candle" },
    { q: "What belongs to you, but others use it more than you do?", a: "name" },

    // Logic riddles
    { q: "If two's company and three's a crowd, what are four and five?", a: "nine" },
    { q: "What comes once in a minute, twice in a moment, but never in a thousand years?", a: "m" },
    { q: "If you have me, you want to share me. Once you share me, you don't have me. What am I?", a: "secret" },
    { q: "What can you catch but not throw?", a: "cold" },
    { q: "The more you take, the more you leave behind. What am I?", a: "footsteps" },

    // Math riddles
    { q: "If 2 + 2 = 8, 3 + 3 = 18, 4 + 4 = 32, then 5 + 5 = ?", a: "50" },
    { q: "A bat and a ball cost $1.10 in total. The bat costs $1 more than the ball. How much is the ball?", a: "0.05" },
    { q: "If there are 6 apples and you take away 4, how many do you have?", a: "4" },
    { q: "If three cats can catch three mice in three minutes, how long will it take 100 cats to catch 100 mice?", a: "3" },
    { q: "A farmer has 17 sheep and all but 9 run away. How many are left?", a: "9" },
    { q: "What is half of two plus two?", a: "3" },
    { q: "If 1 = 5, 2 = 25, 3 = 125, 4 = 625, then 5 = ?", a: "1" }
  ];

  function pickRandom() {
    return riddles[Math.floor(Math.random() * riddles.length)];
  }

  const r = pickRandom();
  entry.current = r;

  api.sendMessage(
    `🧩 New Riddle!\n\n${r.q}\n\n⏳ You have 2 minutes to answer! Reply with the correct answer (English).`,
    threadID
  );

  // set timeout for 2 minutes
  entry.timeout = setTimeout(() => {
    // If still active, reveal answer and reset
    if (entry.current) {
      api.sendMessage(`⏰ Time's up! Correct answer: ${entry.current.a}`, threadID);
      entry.current = null;
      entry.timeout = null;
    }
  }, 2 * 60 * 1000);
}

function sendLeaderboard(api, threadID) {
  const entry = global.autoRiddleThreads && global.autoRiddleThreads[threadID];
  if (!entry) return api.sendMessage("🏆 No data for this chat.", threadID);

  const entries = Object.entries(entry.scores || {});
  if (!entries.length) return api.sendMessage("🏆 No winners yet in this chat!", threadID);

  const sorted = entries.sort((a, b) => b[1] - a[1]).slice(0, 10);
  let msg = "🏆 Top Riddle Winners (this chat):\n\n";
  sorted.forEach(([user, score], i) => {
    msg += `${i + 1}. ${user}: ${score} point${score > 1 ? "s" : ""}\n`;
  });
  api.sendMessage(msg, threadID);
}