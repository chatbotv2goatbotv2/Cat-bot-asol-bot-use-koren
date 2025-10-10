module.exports = {
  config: {
    name: "riddleboard",
    version: "1.0",
    author: "Helal x GPT",
    shortDescription: "Show top riddle winners",
    longDescription: "Displays the top members with highest riddle scores",
    category: "fun",
    guide: "{p}riddleboard"
  },

  onStart: async function({ api, event }) {
    sendLeaderboard(api, event.threadID);
  }
};

// -------------------- Internal leaderboard function --------------------
let scores = {}; // Use same scores object from riddle module

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