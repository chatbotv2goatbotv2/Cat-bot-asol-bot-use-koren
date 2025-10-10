// guessflag.js
// Guess the Flag game command for Messenger bot
// Reply-based answers, auto unsend, score update

const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname, "gameScores.json");
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, "{}");

function loadScores() {
  return JSON.parse(fs.readFileSync(dataFile));
}

function saveScores(scores) {
  fs.writeFileSync(dataFile, JSON.stringify(scores, null, 2));
}

// Sample flags
const flags = [
  { country: "France", emoji: "🇫🇷" },
  { country: "Japan", emoji: "🇯🇵" },
  { country: "USA", emoji: "🇺🇸" },
  { country: "Germany", emoji: "🇩🇪" },
  { country: "India", emoji: "🇮🇳" },
  { country: "Brazil", emoji: "🇧🇷" },
  { country: "Canada", emoji: "🇨🇦" }
];

function randomFlag() {
  return flags[Math.floor(Math.random() * flags.length)];
}

module.exports = {
  config: {
    name: "guessflag",
    version: "1.0",
    author: "Helal x GPT",
    role: 0,
    shortDescription: "Guess the Flag game",
    category: "fun",
    guide: "{pn} guessflag"
  },

  onStart: async function({ api, event }) {
    const threadID = event.threadID;

    if (!global.gameThreads) global.gameThreads = {};
    if (!global.gameThreads[threadID]) global.gameThreads[threadID]) global.gameThreads[threadID] = {};

    const flag = randomFlag();

    const sentMsg = await api.sendMessage(
      `🏳️ Guess the Flag!\n${flag.emoji}\nReply with the country name`,
      threadID
    );

    global.gameThreads[threadID]["guessflag"] = {
      messageID: sentMsg.messageID,
      correctAnswer: flag.country.toLowerCase(),
      timeout: setTimeout(() => {
        api.sendMessage(`⏰ Time's up! Correct answer: ${flag.country}`, threadID);
        api.unsendMessage(sentMsg.messageID);
        global.gameThreads[threadID]["guessflag"] = null;
      }, 2 * 60 * 1000)
    };
  },

  onChat: async function({ api, event }) {
    const threadID = event.threadID;
    const reply = event.messageReply;
    const body = (event.body || "").trim().toLowerCase();
    if (!reply || !body) return;
    if (!global.gameThreads || !global.gameThreads[threadID]) return;

    const current = global.gameThreads[threadID]["guessflag"];
    if (!current || !current.messageID) return;
    if (reply.messageID !== current.messageID) return;

    const user = event.senderName || "Unknown";
    const scores = loadScores();
    if (!scores[threadID]) scores[threadID] = {};
    if (!scores[threadID]["guessflag"]) scores[threadID]["guessflag"] = {};

    if (body === current.correctAnswer) {
      api.sendMessage(`🎉 Congratulations ${user}! Correct answer: ${current.correctAnswer}`, threadID);
      scores[threadID]["guessflag"][user] = (scores[threadID]["guessflag"][user] || 0) + 1;
      saveScores(scores);
      clearTimeout(current.timeout);
      api.unsendMessage(current.messageID);
      global.gameThreads[threadID]["guessflag"] = null;
    } else {
      api.sendMessage(`❌ Wrong answer! Try again or check later.`, threadID);
    }
  }
};