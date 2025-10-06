const axios = require('axios');

module.exports.config = {
    name: "chatboy",
    aliases: ["bot", "hi", "ki obosta", "assalamualaikum", "chat", "adda"],
    version: "1.0.0",
    author: "Helal Islam",
    countDown: 0,
    role: 0,
    description: "Boy style funny replies",
    category: "chat"
};

const replies = [
    "Kemon aso bhai? 😎",
    "Shuno, amar ekta plan ase 😏",
    "Tumi aj ki korso? 🧐",
    "Bhai, ekta adda kore na? 😂",
    "Dekhchi tumi active aso 😎",
    "Tumar sathe ekta game khelte ichcha ase 🎮",
    "Bhai, aj diner ki plan? 😏",
    "Oi, kotha bolo to 😎",
    "Tumi ki khawa shesh korso? 😋",
    "Dekh, ami ekta joke bolbo 🤣",
    "Ajkale tumi onek busy mone hoccho 🫣",
    "Bhai, amar sathe ek cup cha ☕?",
    "Tumi amar sathe ekta story share korbe? 😎",
    "Oi bhai, ekta secret ache 🤫",
    "Tumi jani, ami always ready 😏",
    "Bhai, ekta quiz khelbo? 🧐",
    "Tumi ajka onek energetic 😎",
    "Dekhlam tumi ekta video dekhso 🎥",
    "Oi bhai, ekta plan ase, join korbi? 😏",
    "Tumi aj ekta fun idea pabe 😂",
    "Dekh, ekta challenge ase, accept korbi? 😎",
    "Bhai, tumi ekta meme pathao 😏",
    "Oi, ajkale tumi busy? 🫣",
    "Tumi ajkale ekta story share korso? 😎",
    "Bhai, amar sathe ekta music share korbi? 🎶",
    "Oi bhai, ekta game plan ase 🎮",
    "Tumi jani, ami always ready 😏",
    "Ajkale tumi onek energetic 😎",
    "Oi bhai, ekta fun idea ase 😂",
    "Tumi ekta challenge accept korbi? 😎",
    "Bhai, ekta meme pathao 😏",
    "Oi, ajka tumi busy? 🫣",
    "Tumi ajkale ekta story share korso? 😎",
    "Bhai, amar sathe ekta music share korbi? 🎶",
    "Oi bhai, ekta game plan ase 🎮",
    "Tumi jani, ami always ready 😏",
    "Ajkale tumi onek energetic 😎",
    "Oi bhai, ekta fun idea ase 😂",
    "Tumi ekta challenge accept korbi? 😎",
    "Bhai, ekta meme pathao 😏",
    "Oi, ajka tumi busy? 🫣",
    "Tumi ajkale ekta story share korso? 😎",
    "Bhai, amar sathe ekta music share korbi? 🎶",
    "Oi bhai, ekta game plan ase 🎮",
    "Tumi jani, ami always ready 😏",
    "Ajkale tumi onek energetic 😎",
    "Oi bhai, ekta fun idea ase 😂",
    "Tumi ekta challenge accept korbi? 😎",
    "Bhai, ekta meme pathao 😏",
    "Oi, ajka tumi busy? 🫣",
    "Tumi ajkale ekta story share korso? 😎",
    "Bhai, amar sathe ekta music share korbi? 🎶"
];

// Eikhane aro 2000+ similar replies add korte hobe...
for (let i = 0; i < 1950; i++) {
    replies.push(`Random fun reply ${i + 1} 😎`);
}

module.exports.onChat = async ({ api, event }) => {
    try {
        const msg = event.body ? event.body.toLowerCase() : "";
        const triggerWords = ["bot", "hi", "ki obosta", "assalamualaikum", "chat", "adda"];
        if (triggerWords.some(word => msg.startsWith(word))) {
            const response = replies[Math.floor(Math.random() * replies.length)];
            await api.sendMessage(response, event.threadID, event.messageID);
        }
    } catch (err) {
        console.log(err);
        await api.sendMessage("Error occured!", event.threadID, event.messageID);
    }
};
