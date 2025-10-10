// gametop.js
// Game leaderboard command for Messenger bot
// Shows per-game scores + total scores

const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname, "gameScores.json");
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, "{}");

function loadScores() {
  return JSON.parse(fs.readFileSync(dataFile));
}

module.exports = {
  config: {
    name: "gametop",
    version: "1.0",
    author: "Helal x GPT",
    role: 0,
    shortDescription: "Show leaderboard of all games",
    category: "fun",
    guide: "{pn} gametop"
  },

  onStart: async function({ api, event }) {
    const threadID = event.threadID;
    const scores = loadScores();
    const threadScores = scores[threadID] || {};

    if (!Object.keys(threadScores).length)
      return api.sendMessage("🏆 No game scores yet!", threadID);

    let msg = "🏆 Game Leaderboard:\n\n";

    // Per game leaderboard
    Object.keys(threadScores).forEach(game => {
      msg += `${game.toUpperCase()}:\n`;
      const sorted = Object.entries(threadScores[game]).sort((a, b) => b[1] - a[1]);
      sorted.forEach(([user, score], i) => {
        msg += `${i + 1}. ${user} — ${score}\n`;
      });
      msg += "\n";
    });

    // Total scores
    let totalScores = {};
    Object.values(threadScores).forEach(gameObj => {
      Object.entries(gameObj).forEach(([user, score]) => {
        totalScores[user] = (totalScores[user] || 0) + score;
      });
    });

    msg += "Total Scores:\n";
    const sortedTotal = Object.entries(totalScores).sort((a, b) => b[1] - a[1]);
    sortedTotal.forEach(([user, score], i) => {
      msg += `${i + 1}. ${user} — ${score}\n`;
    });

    api.sendMessage(msg, threadID);
  }
};