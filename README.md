<!-- 🟣 HELAL CAT GOAT BOT NEON README 🟣 -->

<!-- Glowing Header -->
<p align="center">
  <img src="https://i.imgur.com/dBaSKWF.gif" width="100%" height="40"/>
</p>

<h1 align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&size=35&duration=4000&pause=1000&color=00FFF9&center=true&vCenter=true&width=700&lines=✦+HELAL+CAT+GOAT+BOT+✦;⚡+Messenger+Multi+Device+Bot+⚡;💫+Developed+By+Helal+💫" alt="Typing Animation">
</h1>

<p align="center">
  <img src="https://i.imgur.com/IhjLvb0.jpeg" width="350" height="350" style="border-radius: 15px;">
</p>

<!-- Glowing Divider -->
<p align="center">
  <img src="https://i.imgur.com/dBaSKWF.gif" width="100%" height="40"/>
</p>

---

## 💠 About Project
> ✨ **HELAL CAT GOAT BOT** is a futuristic **Messenger Multi-Device AI bot** that automates chats, sends media, replies emotionally, plays games, and much more — everything inside your Messenger! 💬  

---

## 🧠 Features

🌟 **Smart Auto Chat** – Natural AI chat that feels human  
🎨 **Photo Editor** – Edit or enhance images instantly  
🖼️ **Image Generator** – Text → Image AI creation  
📽️ **Video Downloader** – YouTube, FB, TikTok supported  
🎮 **Mini Games** – Fun interactive chat games  
😂 **Funny Commands** – 100+ entertaining actions  
💌 **Group Tools** – Admin, AntiSpam, AutoReact, Kick modules  
🔒 **Owner Tools** – Fork, Key, and System Control  

---

## ⚙️ Main Deploy Workflow (Node.js CI)
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