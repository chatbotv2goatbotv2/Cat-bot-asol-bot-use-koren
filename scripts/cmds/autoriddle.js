module.exports = {
  config: {
    name: "riddle",
    version: "1.0",
    author: "Helal x GPT",
    shortDescription: "Automatic riddle game every 20 minutes",
    longDescription: "Bot sends riddles automatically, checks answers, maintains leaderboard",
    category: "fun",
    guide: "{p}riddle"
  },

  onStart: async function({ api, event }) {
    startRiddle(api, event.threadID);
  },

  onEvent: async function({ api, event }) {
    checkAnswer(api, event);
  },

  onLoad: async function({ api }) {
    setInterval(() => {
      if (currentThread) startRiddle(api, currentThread);
    }, 20 * 60 * 1000); // 20 minutes
  }
};

// -------------------- Internal variables --------------------
let riddles = [
  { q: "What has keys but can't open locks?", a: "keyboard" },
  { q: "What has a face and hands but no arms or legs?", a: "clock" },
  { q: "What has cities but no houses, forests but no trees, and rivers but no water?", a: "map" },
  { q: "What has a neck but no head?", a: "bottle" }
];

let scores = {};
let currentRiddle = null;
let currentThread = null;
let riddleTimeout = null;

// -------------------- Functions --------------------
function pickRandomRiddle() {
  return riddles[Math.floor(Math.random() * riddles.length)];
}

function startRiddle(api, threadID) {
  if (currentRiddle) return;

  currentRiddle = pickRandomRiddle();
  currentThread = threadID;

  api.sendMessage(`🧩 Riddle Time!\n\n${currentRiddle.q}\n\n⏳ You have 2 minutes to answer!`, threadID);

  riddleTimeout = setTimeout(() => {
    api.sendMessage(`⏰ Time's up! The answer was: ${currentRiddle.a}`, threadID);
    currentRiddle = null;
    currentThread = null;
  }, 2 * 60 * 1000); // 2 minutes
}

function checkAnswer(api, event) {
  if (!currentRiddle || event.threadID !== currentThread) return;

  const answer = event.body.trim().toLowerCase();
  if (answer === currentRiddle.a.toLowerCase()) {
    clearTimeout(riddleTimeout);
    api.sendMessage(`🎉 Congratulations ${event.senderName}! Correct answer: ${currentRiddle.a}`, event.threadID);

    // Update score
    const user = event.senderName || event.senderID;
    scores[user] = (scores[user] || 0) + 1;

    // Send leaderboard
    sendLeaderboard(api, event.threadID);

    currentRiddle = null;
    currentThread = null;
  }
}

function sendLeaderboard(api, threadID) {
  const entries = Object.entries(scores);
  if (!entries.length) return api.sendMessage("🏆 No scores yet!", threadID);

  const sorted = entries.sort((a, b) => b[1] - a[1]).slice(0, 5);
  let msg = "🏆 Top Riddle Winners:\n\n";
  sorted.forEach(([user, score], index) => {
    msg += `${index + 1}. ${user}: ${score} points\n`;
  });
  api.sendMessage(msg, threadID);
}