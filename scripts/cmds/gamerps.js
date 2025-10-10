// rps.js
// Rock Paper Scissors game command for Messenger bot
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

const choices = ["rock", "paper", "scissors"];

function getBotChoice() {
  return choices[Math.floor(Math.random() * choices.length)];
}

function decideWinner(user, bot) {
  if (user === bot) return "draw";
  if (
    (user === "rock" && bot === "scissors") ||
    (user === "paper" && bot === "rock") ||
    (user === "scissors" && bot === "paper")
  ) return "user";
  return "bot";
}

module.exports = {
  config: {
    name: "rps",
    version: "1.0",
    author: "Helal x GPT",
    role: 0,
    shortDescription: "Play Rock Paper Scissors",
    category: "fun",
    guide: "{pn} rps"
  },

  onStart: async function({ api, event }) {
    const threadID = event.threadID;

    if (!global.gameThreads) global.gameThreads = {};
    if (!global.gameThreads[threadID]) global.gameThreads[threadID]) global.gameThreads[threadID] = {};

    const sentMsg = await api.sendMessage(
      "✂️ Rock Paper Scissors!\nReply with rock, paper, or scissors",
      threadID
    );

    global.gameThreads[threadID]["rps"] = {
      messageID: sentMsg.messageID,
      timeout: setTimeout(() => {
        api.sendMessage("⏰ Time's up! Game over!", threadID);
        api.unsendMessage(sentMsg.messageID);
        global.gameThreads[threadID]["rps"] = null;
      }, 2 * 60 * 1000)
    };
  },

  onChat: async function({ api, event }) {
    const threadID = event.threadID;
    const reply = event.messageReply;
    const body = (event.body || "").trim().toLowerCase();
    if (!reply || !body) return;
    if (!global.gameThreads || !global.gameThreads[threadID]) return;

    const current = global.gameThreads[threadID]["rps"];
    if (!current || !current.messageID) return;
    if (reply.messageID !== current.messageID) return;

    if (!choices.includes(body))
      return api.sendMessage("❌ Invalid choice! Use rock, paper, or scissors.", threadID);

    const botChoice = getBotChoice();
    const result = decideWinner(body, botChoice);
    const user = event.senderName || "Unknown";

    const scores = loadScores();
    if (!scores[threadID]) scores[threadID] = {};
    if (!scores[threadID]["rps"]) scores[threadID]["rps"] = {};

    if (result === "user") {
      api.sendMessage(`🎉 Congratulations ${user}! You won!\nBot chose: ${botChoice}`, threadID);
      scores[threadID]["rps"][user] = (scores[threadID]["rps"][user] || 0) + 1;
    } else if (result === "bot") {
      api.sendMessage(`💀 Bot won!\nBot chose: ${botChoice}`, threadID);
    } else {
      api.sendMessage(`🤝 Draw!\nBot chose: ${botChoice}`, threadID);
    }

    saveScores(scores);
    clearTimeout(current.timeout);
    api.unsendMessage(current.messageID);
    global.gameThreads[threadID]["rps"] = null;
  }
};