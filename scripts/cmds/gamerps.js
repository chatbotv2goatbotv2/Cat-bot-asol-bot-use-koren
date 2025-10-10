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

const choices = ["rock","paper","scissors"];

function getBotChoice() {
  return choices[Math.floor(Math.random()*choices.length)];
}

module.exports = {
  config: {
    name: "rps",
    category: "fun",
    description: "Rock Paper Scissors Game"
  },

  onStart: async function({ api, event }) {
    const threadID = event.threadID;

    const sentMsg = await api.sendMessage(
      "✂️ Rock Paper Scissors!\nReply with rock, paper, or scissors",
      threadID
    );

    if(!global.GoatBot.games) global.GoatBot.games={};
    global.GoatBot.games[threadID+"_rps"] = {
      messageID: sentMsg.messageID,
      playerID: event.senderID,
      timeout: setTimeout(()=>{
        api.sendMessage("⏰ Time's up! Game over!", threadID);
        api.unsendMessage(sentMsg.messageID);
        delete global.GoatBot.games[threadID+"_rps"];
      },2*60*1000)
    };
  },

  onReply: async function({ api, event, Reply }) {
    const key = event.threadID+"_rps";
    const current = global.GoatBot.games[key];
    if(!current || event.messageReply?.messageID !== current.messageID) return;
    if(event.senderID !== current.playerID) return;

    const userChoice = (event.body||"").toLowerCase();
    if(!choices.includes(userChoice)) return api.sendMessage("❌ Invalid! Use rock, paper, or scissors", event.threadID);

    const botChoice = getBotChoice();
    let result="";
    if(userChoice===botChoice) result="draw";
    else if(
      (userChoice==="rock" && botChoice==="scissors") ||
      (userChoice==="paper" && botChoice==="rock") ||
      (userChoice==="scissors" && botChoice==="paper")
    ) result="user";
    else result="bot";

    const user = event.senderName || "Unknown";
    const scores = loadScores();
    if(!scores[event.threadID]) scores[event.threadID]={};
    if(!scores[event.threadID]["rps"]) scores[event.threadID]["rps"]={};

    if(result==="user"){
      api.sendMessage(`🎉 Congratulations ${user}! You won!\nBot chose: ${botChoice}`, event.threadID);
      scores[event.threadID]["rps"][user] = (scores[event.threadID]["rps"][user]||0)+1;
    } else if(result==="bot"){
      api.sendMessage(`💀 Bot won!\nBot chose: ${botChoice}`, event.threadID);
    } else {
      api.sendMessage(`🤝 Draw!\nBot chose: ${botChoice}`, event.threadID);
    }

    saveScores(scores);
    clearTimeout(current.timeout);
    api.unsendMessage(current.messageID);
    delete global.GoatBot.games[key];
  }
};