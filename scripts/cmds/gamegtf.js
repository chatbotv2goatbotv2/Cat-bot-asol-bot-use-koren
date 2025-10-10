const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname,"gameScores.json");
if(!fs.existsSync(dataFile)) fs.writeFileSync(dataFile,"{}");

function loadScores() {
  return JSON.parse(fs.readFileSync(dataFile));
}

function saveScores(scores) {
  fs.writeFileSync(dataFile, JSON.stringify(scores,null,2));
}

// Sample flags (Banglish)
const flags = [
  { country: "India", emoji: "🇮🇳" },
  { country: "USA", emoji: "🇺🇸" },
  { country: "Japan", emoji: "🇯🇵" },
  { country: "France", emoji: "🇫🇷" },
  { country: "Brazil", emoji: "🇧🇷" },
  { country: "Germany", emoji: "🇩🇪" },
  { country: "Canada", emoji: "🇨🇦" }
];

function randomFlag() {
  return flags[Math.floor(Math.random()*flags.length)];
}

module.exports = {
  config: {
    name: "gg",
    category: "fun",
    description: "Guess the Flag game",
    guide: "/gg"
  },

  onStart: async function({ api, event }) {
    const threadID = event.threadID;
    const flag = randomFlag();

    const sentMsg = await api.sendMessage(
      `🧩 Guess the Flag!\n${flag.emoji}\nReply to this message with country name (Banglish)`,
      threadID
    );

    if(!global.GoatBot.games) global.GoatBot.games={};
    global.GoatBot.games[threadID+"_gg"] = {
      messageID: sentMsg.messageID,
      playerID: event.senderID,
      answer: flag.country.toLowerCase()
    };
  },

  onReply: async function({ api, event, Reply }) {
    const key = event.threadID+"_gg";
    const current = global.GoatBot.games[key];
    if(!current || event.messageReply?.messageID !== current.messageID) return;
    if(event.senderID !== current.playerID) return;

    const body = (event.body||"").toLowerCase();
    const user = event.senderName || "Unknown";
    const scores = loadScores();
    if(!scores[event.threadID]) scores[event.threadID]={};
    if(!scores[event.threadID]["gg"]) scores[event.threadID]["gg"]={};

    if(body === current.answer){
      api.sendMessage(`🎉 Congratulations ${user}! Right answer: ${current.answer}`, event.threadID);

      // Update score
      scores[event.threadID]["gg"][user] = (scores[event.threadID]["gg"][user]||0)+1;
      saveScores(scores);

      // Auto unsend flag message
      api.unsendMessage(current.messageID);
      delete global.GoatBot.games[key];
    } else {
      api.sendMessage(`❌ Wrong answer! Try again.`, event.threadID);
    }
  }
};