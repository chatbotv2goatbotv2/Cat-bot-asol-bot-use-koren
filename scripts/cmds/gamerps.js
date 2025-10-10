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
    description: "Rock Paper Scissors Single-step Game",
    guide: "/rps <rock/paper/scissors>"
  },

  onStart: async function({ api, event, args }) {
    const threadID = event.threadID;
    const userChoice = (args[0]||"").toLowerCase();

    if(!choices.includes(userChoice)) 
      return api.sendMessage("❌ Use: /rps rock | paper | scissors", threadID);

    const botChoice = getBotChoice();
    let result="";
    if(userChoice===botChoice) result="Draw";
    else if(
      (userChoice==="rock" && botChoice==="scissors") ||
      (userChoice==="paper" && botChoice==="rock") ||
      (userChoice==="scissors" && botChoice==="paper")
    ) result="You Win!";
    else result="Bot Wins!";

    const msg = `✂️ You: ${userChoice}\n🤖 Bot: ${botChoice}\n🎯 Result: ${result}`;
    api.sendMessage(msg, threadID);

    // Update score
    const scores = loadScores();
    if(!scores[threadID]) scores[threadID]={};
    if(!scores[threadID]["rps"]) scores[threadID]["rps"]={};
    const user = event.senderName || "Unknown";

    if(result==="You Win!") scores[threadID]["rps"][user] = (scores[threadID]["rps"][user]||0)+1;
    saveScores(scores);
  }
};