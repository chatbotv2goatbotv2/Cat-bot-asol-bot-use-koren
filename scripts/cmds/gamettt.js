// tictactoe.js
// Tic Tac Toe game command for Messenger bot
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

// Tic Tac Toe initial empty board
function getEmptyBoard() {
  return [
    ["-", "-", "-"],
    ["-", "-", "-"],
    ["-", "-", "-"]
  ];
}

function formatBoard(board) {
  return board.map(row => row.join(" | ")).join("\n");
}

// Check winner
function checkWinner(board) {
  for (let i = 0; i < 3; i++) {
    if (board[i][0] !== "-" && board[i][0] === board[i][1] && board[i][1] === board[i][2]) return board[i][0];
    if (board[0][i] !== "-" && board[0][i] === board[1][i] && board[1][i] === board[2][i]) return board[0][i];
  }
  if (board[0][0] !== "-" && board[0][0] === board[1][1] && board[1][1] === board[2][2]) return board[0][0];
  if (board[0][2] !== "-" && board[0][2] === board[1][1] && board[1][1] === board[2][0]) return board[0][2];
  return null;
}

module.exports = {
  config: {
    name: "tictactoe",
    version: "1.0",
    author: "Helal x GPT",
    role: 0,
    shortDescription: "Play Tic Tac Toe",
    category: "fun",
    guide: "{pn} tictactoe"
  },

  onStart: async function({ api, event }) {
    const threadID = event.threadID;

    if (!global.gameThreads) global.gameThreads = {};
    if (!global.gameThreads[threadID]) global.gameThreads[threadID]) global.gameThreads[threadID] = {};

    const board = getEmptyBoard();
    const sentMsg = await api.sendMessage("🎮 Tic Tac Toe!\nReply with your move (A1,B2,C3...)\n\n" + formatBoard(board), threadID);

    global.gameThreads[threadID]["tictactoe"] = {
      messageID: sentMsg.messageID,
      board: board,
      timeout: setTimeout(() => {
        api.sendMessage("⏰ Time's up! Game over!", threadID);
        api.unsendMessage(sentMsg.messageID);
        global.gameThreads[threadID]["tictactoe"] = null;
      }, 2 * 60 * 1000)
    };
  },

  onChat: async function({ api, event }) {
    const threadID = event.threadID;
    const reply = event.messageReply;
    const body = (event.body || "").trim().toUpperCase();
    if (!reply || !body) return;
    if (!global.gameThreads || !global.gameThreads[threadID]) return;

    const current = global.gameThreads[threadID]["tictactoe"];
    if (!current || !current.messageID) return;
    if (reply.messageID !== current.messageID) return;

    const board = current.board;
    const posMap = { "A1":[0,0], "A2":[0,1], "A3":[0,2], "B1":[1,0], "B2":[1,1], "B3":[1,2], "C1":[2,0], "C2":[2,1], "C3":[2,2] };
    if (!posMap[body]) return api.sendMessage("❌ Invalid move! Use A1,B2,C3...", threadID);

    const [x, y] = posMap[body];
    if (board[x][y] !== "-") return api.sendMessage("❌ Already filled!", threadID);

    board[x][y] = "X"; // player move
    const winner = checkWinner(board);

    if (winner) {
      clearTimeout(current.timeout);
      api.sendMessage(`🎉 Congratulations ${event.senderName}! You won!\n` + formatBoard(board), threadID);

      // update score
      const scores = loadScores();
      if (!scores[threadID]) scores[threadID] = {};
      if (!scores[threadID]["tictactoe"]) scores[threadID]["tictactoe"] = {};
      scores[threadID]["tictactoe"][event.senderName] = (scores[threadID]["tictactoe"][event.senderName] || 0) + 1;
      saveScores(scores);

      api.unsendMessage(current.messageID);
      global.gameThreads[threadID]["tictactoe"] = null;
    } else {
      // bot random move
      let empty = [];
      for (let i=0;i<3;i++){
        for(let j=0;j<3;j++){
          if(board[i][j] === "-") empty.push([i,j]);
        }
      }
      if(empty.length === 0){
        clearTimeout(current.timeout);
        api.sendMessage("🤝 Game Draw!\n" + formatBoard(board), threadID);
        api.unsendMessage(current.messageID);
        global.gameThreads[threadID]["tictactoe"] = null;
        return;
      }
      const [bx,by] = empty[Math.floor(Math.random()*empty.length)];
      board[bx][by] = "O";

      const winner2 = checkWinner(board);
      if(winner2){
        clearTimeout(current.timeout);
        api.sendMessage("💀 Bot won!\n" + formatBoard(board), threadID);
        api.unsendMessage(current.messageID);
        global.gameThreads[threadID]["tictactoe"] = null;
      } else {
        // update board
        await api.sendMessage("🎮 Tic Tac Toe!\nReply with your move\n\n" + formatBoard(board), threadID);
        current.board = board;
      }
    }
  }
};