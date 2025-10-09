const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "owner",
    author: "Helal", // Converted By GoatBot V3
    role: 0,
    shortDescription: "Show Owner/Admin Info",
    longDescription: "Displays the owner/admin information with attached video.",
    category: "admin",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    try {
      const ownerInfo = {
        name: 'Helal',
        gender: 'Male',
        age: '13',
        hobby: 'Oiato ki bola lage',
        facebook: '61580156099497',
        nick: 'Hello'
      };

      // --- ImgUr video link ---
      const videoUrl = 'https://i.imgur.com/EEatTo4.mp4'; // এখানে তোর ইমগুর ভিডিও লিঙ্ক বসা
      
      // --- Temp folder ---
      const tmpFolderPath = path.join(__dirname, 'tmp');
      if (!fs.existsSync(tmpFolderPath)) {
        fs.mkdirSync(tmpFolderPath);
      }

      // --- Download video from imgur ---
      const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
      const videoPath = path.join(tmpFolderPath, 'owner_video.mp4');
      fs.writeFileSync(videoPath, Buffer.from(videoResponse.data, 'binary'));

      // --- Stylish Message ---
      const response = `
╭─────────────✦
│ 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡
│
│ ✧ 𝗡𝗮𝗺𝗲: Helal Islam  
│ ✧ 𝗡𝗶𝗰𝗸: Hello
│ ✧ 𝗔𝗴𝗲: 14
│ ✧ 𝗛𝗼𝗯𝗯𝘆:Oitao ki bola lagbo
│ ✧ 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: 61580156099497
│
╰─────────────✦`;

      // --- Send message + video ---
      await api.sendMessage({
        body: response,
        attachment: fs.createReadStream(videoPath)
      }, event.threadID, event.messageID);

      // --- Reaction system ---
      if (event.body && event.body.toLowerCase().includes('owner')) {
        api.setMessageReaction('👑', event.messageID, (err) => {}, true);
      }

    } catch (error) {
      console.error('Error in owner command:', error);
      return api.sendMessage('❌ Something went wrong while fetching Owner info.', event.threadID);
    }
  },
};
