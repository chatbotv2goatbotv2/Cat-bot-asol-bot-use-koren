<!-- ✨ NEON CYBER README BY HELAL ✨ -->
<p align="center">
  <img src="https://i.imgur.com/dBaSKWF.gif" height="40" width="100%">
</p>

<h1 align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&size=40&duration=4000&pause=1000&color=00FFF9&center=true&vCenter=true&width=800&lines=✦+HELAL+CAT+GOAT+BOT+✦;🔥+A+Messenger+Multi+Device+Bot+🔥;💫+Developed+By+HELAL+💫">
</h1>

<p align="center">
  <img src="https://i.imgur.com/YCw47Dm.gif" width="400" alt="Neon wave animation"/>
</p>

<p align="center">
  <img src="https://i.imgur.com/dBaSKWF.gif" height="40" width="100%">
</p>

---

## 💠 About Project  
> **𝐇𝐄𝐋𝐀𝐋 𝐂𝐀𝐓 𝐆𝐎𝐀𝐓 𝐁𝐎𝐓** is a **Messenger Multi-Device Bot** built to take your chatting experience to another futuristic level 🚀  
> Simple, fast, and packed with automation, fun, and intelligence 🤖  

---

## 🪄 Features

✨ **Auto Chat** – Seamless, AI-powered conversation  
🎨 **Photo Editing** – Enhance your images instantly  
🧠 **Image Generation** – Create with just text prompts  
🎥 **Video Downloader** – Download from YouTube, TikTok, FB, and more  
🎮 **Mini Games** – Over 20 fun interactive games  
😂 **Fun Commands** – Pranks, jokes, memes & more  

---

## ⚙️ Main YML Deploy Workflows
```yaml
name: Node.js CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x]

    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v2
        with:
          node-version: ${{ matrix.node-version }}
      - name: Install dependencies
        run: npm install
      - name: Start the bot
        env:
          PORT: 8080
        run: npm start