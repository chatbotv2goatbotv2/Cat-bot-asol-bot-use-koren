const fs = require("fs-extra");
const axios = require("axios");
const { alldown } = require("shaon-videos-downloader");

module.exports = {
    config: {
        name: "download",
        version: "1.0.1",
        author: "Helal",
        role: 0,
        description: "Auto download video from link (supports chat links)",
        category: "user",
        usages: "autodl [video link]",
        cooldowns: 5
    },

    // Manual command trigger
    onStart: async function ({ api, event, args }) {
        const link = args.join(" ");
        if (!link || !link.startsWith("https://"))
            return api.sendMessage("❌ | Please provide a valid video link.", event.threadID, event.messageID);

        await handleDownload(api, event, link);
    },

    // Auto download when a link is sent in chat
    onEvent: async function ({ api, event }) {
        const content = event.body ? event.body : "";
        if (!content.startsWith("https://")) return; // ignore if not a link

        await handleDownload(api, event, content);
    }
};

// Core download function
async function handleDownload(api, event, link) {
    try {
        api.setMessageReaction("⚠️", event.messageID, (err) => {}, true);

        // Get direct video URL from shaon-videos-downloader
        const data = await alldown(link);
        if (!data || !data.url)
            return api.sendMessage("❌ | Could not fetch video URL.", event.threadID, event.messageID);

        const videoUrl = data.url;
        api.setMessageReaction("☢️", event.messageID, (err) => {}, true);

        // Download video
        const videoData = (await axios.get(videoUrl, { responseType: "arraybuffer" })).data;

        // Ensure cache folder
        const path = __dirname + "/cache/auto.mp4";
        await fs.ensureDir(__dirname + "/cache");
        await fs.writeFile(path, videoData);

        // Send video
        return api.sendMessage({
            body: "🤖 | Auto Downloader Complete! Enjoy your video 🎬",
            attachment: fs.createReadStream(path)
        }, event.threadID, event.messageID);

    } catch (error) {
        console.log("Error:", error);
        return api.sendMessage("❌ | Failed to download video.", event.threadID, event.messageID);
    }
}