const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname, "rps_score.json");
let scores = {};
if (fs.existsSync(dataFile)) {
  try {
    scores = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  } catch {
    scores = {};
  }
}

const cooldown = new Set();

module.exports = {
  config: {
    name: "rps",
    aliases: ["rockpaperscissors", "toprps"],
    version: "4.0",
    author: "Helal",
    countDown: 3,
    role: 0,
    category: "game",
    shortDescription: { en: "Play Rock Paper Scissors with leaderboard 🏆" },
  },

  onStart: async function ({ message, args, event, usersData }) {
    const sender = event.senderID;
    const command = args[0]?.toLowerCase();

    // Leaderboard command
    if (event.body.toLowerCase() === "/toprps") {
      if (!Object.keys(scores).length)
        return message.reply("📭 এখনও কেউ খেলেনি ভাই!");

      // নামগুলো নিয়ে আসা
      const top = Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

      let msg = "🏆 *Top RPS Players*\n_______________________\n";
      for (let i = 0; i < top.length; i++) {
        const uid = top[i][0];
        let name;
        try {
          const user = await usersData.get(uid);
          name = user?.name || `Unknown (${uid})`;
        } catch {
          name = `Unknown (${uid})`;
        }
        msg += `${i + 1}. 👤 ${name} → ${top[i][1]} pts\n`;
      }

      return message.reply(msg);
    }

    // Game play
    const userChoice = command;
    if (!userChoice || !["rock", "paper", "scissors"].includes(userChoice)) {
      return message.reply(
        "✊ Rock Paper Scissors ✋✂️\n\n" +
        "Usage:\n/rps rock\n/rps paper\n/rps scissors\n\n🏆 Use /toprps to see top players!"
      );
    }

    if (cooldown.has(sender))
      return message.reply("⏳ 5 seconds wait lagbe ager game er por!");

    cooldown.add(sender);
    setTimeout(() => cooldown.delete(sender), 5000);

    const choices = ["rock", "paper", "scissors"];
    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    let result = "";
    if (userChoice === botChoice) result = "🤝 It's a tie!";
    else if (
      (userChoice === "rock" && botChoice === "scissors") ||
      (userChoice === "paper" && botChoice === "rock") ||
      (userChoice === "scissors" && botChoice === "paper")
    ) {
      result = "🎉 You win!";
      scores[sender] = (scores[sender] || 0) + 1;
    } else result = "😜 I win!";

    saveData();

    // User name show
    const userData = await usersData.get(sender);
    const userName = userData?.name || "Player";

    return message.reply(
      `🎮 *Rock Paper Scissors*\n\n` +
      `👤 ${userName}\n` +
      `🧍‍♂️ You chose: ${emoji(userChoice)}\n` +
      `🤖 Bot chose: ${emoji(botChoice)}\n\n` +
      `${result}\n` +
      (scores[sender] ? `🏅 Your score: ${scores[sender]} pts` : "")
    );
  },
};

function emoji(choice) {
  switch (choice) {
    case "rock": return "✊ Rock";
    case "paper": return "✋ Paper";
    case "scissors": return "✂️ Scissors";
    default: return choice;
  }
}

function saveData() {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(scores, null, 2));
  } catch (err) {
    console.error("❌ Failed to save RPS score:", err);
  }
}
