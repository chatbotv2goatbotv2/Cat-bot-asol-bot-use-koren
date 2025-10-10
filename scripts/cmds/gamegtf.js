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

// Sample flags (Banglish)
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
  return flags[Math.floor(Math.random()*flags.length)];
}

module.exports = {
  config: {
    name: "guessflag",
    category: "fun",
    description: "Guess the Flag game"
  },

  onStart: async function({ api, event }) {
    const threadID = event.threadID;
    const flag = randomFlag();

    const sentMsg = await api.sendMessage(
      `🧩 Guess the Flag!\n${flag.emoji}\nReply with country name (Banglish)\n⏳ You have 2 minutes!`,
      threadID
    );

    if(!global.GoatBot.games) global.GoatBot.games={};
    global.GoatBot.games[threadID+"_guessflag"] = {
      messageID: sentMsg.messageID,
      playerID: event.senderID,
      answer: flag.country.toLowerCase(),
      timeout: setTimeout(()=>{
        api.sendMessage(`⏰ Time's up! Correct answer: ${flag.country}`, threadID);
        api.unsendMessage(sentMsg.messageID);
        delete global.GoatBot.games[threadID+"_guessflag"];
      },2*60*1000)
    };
  },

  onReply: async function({ api, event, Reply }) {
    const key = event.threadID+"_guessflag";
    const current = global.GoatBot.games[key];
    if(!current || event.messageReply.messageID!==current.messageID) return;
    if(event.senderID!==current.playerID) return;

    const body = (event.body||"").toLowerCase();
    const user = event.senderName || "Unknown";
    const scores = loadScores();
    if(!scores[event.threadID]) scores[event.threadID]={};
    if(!scores[event.threadID]["guessflag"]) scores[event.threadID]["guessflag"]={};

    if(body === current.answer.toLowerCase()){
      api.sendMessage(`🎉 Congratulations ${user}! Correct answer: ${current.answer}`, event.threadID);
      scores[event.threadID]["guessflag"][user] = (scores[event.threadID]["guessflag"][user]||0)+1;
      saveScores(scores);
      clearTimeout(current.timeout);
      api.unsendMessage(current.messageID);
      delete global.GoatBot.games[key];
    } else {
      api.sendMessage("❌ Wrong answer! Try again.", event.threadID);
    }
  }
};