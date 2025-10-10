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

function getEmptyBoard() {
  return [
    ["-", "-", "-"],
    ["-", "-", "-"],
    ["-", "-", "-"]
  ];
}

function formatBoard(board) {
  return board.map(r => r.join(" | ")).join("\n");
}

function checkWinner(b) {
  for (let i=0;i<3;i++){
    if(b[i][0]!=="-" && b[i][0]===b[i][1] && b[i][1]===b[i][2]) return b[i][0];
    if(b[0][i]!=="-" && b[0][i]===b[1][i] && b[1][i]===b[2][i]) return b[0][i];
  }
  if(b[0][0]!=="-" && b[0][0]===b[1][1] && b[1][1]===b[2][2]) return b[0][0];
  if(b[0][2]!=="-" && b[0][2]===b[1][1] && b[1][1]===b[2][0]) return b[0][2];
  return null;
}

module.exports = {
  config: {
    name: "ttt",
    category: "fun",
    description: "Play Tic Tac Toe"
  },

  onStart: async function({ api, event }) {
    const threadID = event.threadID;
    const board = getEmptyBoard();

    const sentMsg = await api.sendMessage(
      `🎮 Tic Tac Toe!\nReply with move (A1,B2,C3...)\n\n${formatBoard(board)}`,
      threadID
    );

    if(!global.GoatBot.games) global.GoatBot.games = {};
    global.GoatBot.games[threadID+"_ttt"] = {
      messageID: sentMsg.messageID,
      board: board,
      playerID: event.senderID,
      timeout: setTimeout(()=>{
        api.sendMessage("⏰ Time's up! Game over!", threadID);
        api.unsendMessage(sentMsg.messageID);
        delete global.GoatBot.games[threadID+"_ttt"];
      }, 2*60*1000)
    };
  },

  onReply: async function({ api, event, Reply }) {
    const key = event.threadID+"_ttt";
    const current = global.GoatBot.games[key];
    if(!current || event.messageReply?.messageID !== current.messageID) return;
    if(event.senderID !== current.playerID) return;

    const body = (event.body||"").toUpperCase();
    const posMap = { "A1":[0,0],"A2":[0,1],"A3":[0,2],"B1":[1,0],"B2":[1,1],"B3":[1,2],"C1":[2,0],"C2":[2,1],"C3":[2,2] };
    if(!posMap[body]) return api.sendMessage("❌ Invalid move! Use A1,B2,C3...", event.threadID);

    const [x,y] = posMap[body];
    if(current.board[x][y]!=="-") return api.sendMessage("❌ Already filled!", event.threadID);

    current.board[x][y]="X";
    let winner = checkWinner(current.board);

    const scores = JSON.parse(fs.readFileSync(path.join(__dirname,"gameScores.json")));

    if(winner){
      clearTimeout(current.timeout);
      api.sendMessage(`🎉 Congratulations! You won!\n${formatBoard(current.board)}`, event.threadID);

      // Update score
      if(!scores[event.threadID]) scores[event.threadID]={};
      if(!scores[event.threadID]["ttt"]) scores[event.threadID]["ttt"]={};
      scores[event.threadID]["ttt"][event.senderName] = (scores[event.threadID]["ttt"][event.senderName]||0)+1;
      saveScores(scores);

      api.unsendMessage(current.messageID);
      delete global.GoatBot.games[key];
    } else {
      // Bot random move
      let empty=[];
      for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
          if(current.board[i][j]==="-") empty.push([i,j]);
        }
      }
      if(empty.length===0){
        clearTimeout(current.timeout);
        api.sendMessage("🤝 Game Draw!\n"+formatBoard(current.board), event.threadID);
        api.unsendMessage(current.messageID);
        delete global.GoatBot.games[key];
        return;
      }
      const [bx,by]=empty[Math.floor(Math.random()*empty.length)];
      current.board[bx][by]="O";

      winner = checkWinner(current.board);
      if(winner){
        clearTimeout(current.timeout);
        api.sendMessage("💀 Bot won!\n"+formatBoard(current.board), event.threadID);
        api.unsendMessage(current.messageID);
        delete global.GoatBot.games[key];
      } else {
        await api.sendMessage("🎮 Tic Tac Toe!\nReply with your move\n\n"+formatBoard(current.board), event.threadID);
      }
    }
  }
};