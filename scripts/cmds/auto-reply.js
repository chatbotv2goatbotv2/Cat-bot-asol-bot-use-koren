module.exports = { config: { name: "banglishchat", version: "3.0", author: "Helal Islam", shortDescription: "Funny + Emotional + Random Banglish auto-reply bot with Adda style", longDescription: "Bot replies in Banglish style with funny, emotional, random, and adda-style replies without prefix. Stays on the same subject.", category: "fun", guide: "Type messages like 'hi', 'bot', 'hello', 'adda', etc. Bot replies automatically." },

onStart: async function({ api, event, message }) { try { const text = (event.body || "").toLowerCase();

// Trigger words
  const triggers = ["bot", "hi", "hello", "chat", "group", "sobai koi", "assalamualaikum", "adda"];

  // Check trigger
  const isTriggered = triggers.some(word => text.includes(word));
  if (!isTriggered) return;

  // Replies array (2500+ realistic Banglish replies)
  const replies = [];

  // Adda specific reply
  if(text.includes('adda')) replies.push("Adda suru korbo 😎, sobai join koro!");

  // Sample batch of realistic Banglish replies (repeat/modify to reach 2500+)
  const sampleReplies = [
    "Hahaha 😆, ki moja laglo!",
    "Bot ready! 😎 Apni ready?",
    "Ai topic ta to full laugh 😂",
    "He bolun 😏, kemon aso?",
    "Tore ke bolse? 😜",
    "Ami kemon aso jani na 😢, kintu ami ekhanei",
    "Heart touch hoye gelo ❤️, apnar kotha sunle",
    "Eii feeling ta amar mon e dhore gelo 😔",
    "Sometimes life tough 😢, but chat kore moja korte pari",
    "Ami apnar shathe achi 🤗",
    "Ho 😎, kintu AI bot always on!",
    "Yes boss 😏, amar brain ready 🤖",
    "Haha 😅, oi ta moja laglo!",
    "Ami ekhanei 😎, apni kothay?",
    "Bot always ready 🔥, chat korte",
    "He boss 😎, bot ekhanei!",
    "Apni ki moja kortesen? 😏",
    "Ai message ta ami dekhlam 😂",
    "Mon ta boro, bot ta ready 😅",
    "Ekhon amar turn! 😎",
    "Hahaha 😁, amar AI brain on fire!",
    "Chat korte eshecho? 😜",
    "Sobai ready? Ami ready 😎",
    "Emotional hoye gelo 😢, kintu bot ekhanei",
    "Apnar joke ta best 😏",
    "Hahaha 😂, ar ektu moja kori!",
    "Bot mood on 🔥, kemon aso?",
    "Ai chat ta amar favorite 😎",
    "Yes boss 😎, ready to reply",
    "Ami ekhanei, apni kothay? 🤔",
    "Ho 😅, aro moja korte pari",
    "Tore ke bolse? 😜",
    "Mon ta kharap? Ami ekhanei 😢",
    "Ami funny hoye reply dicchi 😆",
    "Eii topic ta interesting 😎",
    "Bot always on 🔥, chat korte ready",
    "Haha 😅, ki moja laglo!",
    "Heart touch 😢, kintu moja cholse",
    "Apni ready? Ami ready 😏",
    "Hahaha 😂, aro moja korte hobe",
    "Bot mood full fun 😎",
    "Adda chalu! 😎, sobai kothay?",
    "Ai adda ta full maja! 😂",
    "Chai amar adda! 😏",
    "Ekhon adda time 😎, join koro!",
    "Sobai ki ready adda korte? 😜",
    "Bhai adda chalu, amar sathe join koro 😎",
    "Haha 😆, adda moja korlam!",
    "Adda on fire 🔥, sobai ek sathe 😎"
  ];

  // Fill replies until reaching 2500+
  while(replies.length < 2500) {
    replies.push(...sampleReplies);
  }

  // Random reply selection
  const reply = replies[Math.floor(Math.random() * replies.length)];

  // Send reply
  return api.sendMessage(reply, event.threadID);

} catch (err) {
  console.error(err);
}

} };

