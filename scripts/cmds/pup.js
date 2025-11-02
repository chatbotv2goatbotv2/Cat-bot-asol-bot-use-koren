const { createCanvas, loadImage } = require("canvas");
const os = require("os");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "pup",
    version: "1.3",
    author: "Helal",
    role: 0,
    countDown: 3,
    category: "utility",
    shortDescription: "Smooth neon group info with flowing river wave graphs"
  },

  onStart: async function({ api, event, message }) {
    try {
      if (!global.botStartTime) global.botStartTime = Date.now();

      const threadID = event.threadID;

      const threadInfo = await api.getThreadInfo(threadID);
      const groupName = threadInfo.name || "Unknown Group";
      const memberCount = threadInfo.participantIDs.length || 0;
      const groupIconURL = threadInfo.imageSrc || null;

      // Calculate uptime
      const uptimeMs = Date.now() - global.botStartTime;
      const uptime = msToTime(uptimeMs);

      // RAM usage
      const totalMemMB = Math.round(os.totalmem() / 1024 / 1024);
      const freeMemMB = Math.round(os.freemem() / 1024 / 1024);
      const usedMemMB = totalMemMB - freeMemMB;
      const memPercent = ((usedMemMB / totalMemMB) * 100).toFixed(1);

      // CPU load
      const cpuLoadRaw = os.loadavg()[0];
      const cpuLoad = cpuLoadRaw > 2 ? 2 : cpuLoadRaw;
      const cpuLoadPercent = (cpuLoad / 2) * 100;

      // Ping test
      const pingStart = Date.now();
      await api.sendMessage("⏳ Checking ping...", threadID);
      const ping = Date.now() - pingStart;

      // Canvas setup
      const width = 950;
      const height = 550;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Background gradient dark with subtle glow
      const bgGradient = ctx.createLinearGradient(0, 0, width, height);
      bgGradient.addColorStop(0, "#050A1A");
      bgGradient.addColorStop(1, "#00172F");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Neon border rectangle
      ctx.strokeStyle = "#0ff";
      ctx.lineWidth = 5;
      ctx.shadowColor = "#0ff";
      ctx.shadowBlur = 20;
      ctx.strokeRect(15, 15, width - 30, height - 30);

      // Group icon circle + glow
      const iconSize = 150;
      const iconX = 50;
      const iconY = 60;

      if (groupIconURL) {
        try {
          const img = await loadImage(groupIconURL);
          ctx.save();
          ctx.beginPath();
          ctx.arc(iconX + iconSize / 2, iconY + iconSize / 2, iconSize / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, iconX, iconY, iconSize, iconSize);
          ctx.restore();

          // Neon glow border around icon
          ctx.strokeStyle = "#0ff";
          ctx.lineWidth = 7;
          ctx.shadowColor = "#0ff";
          ctx.shadowBlur = 25;
          ctx.beginPath();
          ctx.arc(iconX + iconSize / 2, iconY + iconSize / 2, iconSize / 2 + 8, 0, Math.PI * 2);
          ctx.stroke();
        } catch {
          // fallback circle
          ctx.fillStyle = "#222";
          ctx.beginPath();
          ctx.arc(iconX + iconSize / 2, iconY + iconSize / 2, iconSize / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = "#222";
        ctx.beginPath();
        ctx.arc(iconX + iconSize / 2, iconY + iconSize / 2, iconSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Text setup
      const textX = iconX + iconSize + 50;
      let textY = 90;
      const lineHeight = 45;

      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.font = "bold 32px Segoe UI, Arial";
      const neonColors = ["#0ff", "#ff00ff", "#00ff00", "#ff4500"];

      function neonText(text, x, y, color = "#0ff") {
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        ctx.shadowBlur = 0;
      }

      neonText(`Group:`, textX, textY, neonColors[0]);
      neonText(groupName, textX + 150, textY, neonColors[1]);
      textY += lineHeight;

      neonText(`Members:`, textX, textY, neonColors[0]);
      neonText(`${memberCount}`, textX + 150, textY, neonColors[1]);
      textY += lineHeight;

      neonText(`Uptime:`, textX, textY, neonColors[0]);
      neonText(uptime, textX + 150, textY, neonColors[1]);
      textY += lineHeight;

      neonText(`RAM Usage:`, textX, textY, neonColors[0]);
      neonText(`${usedMemMB} MB / ${totalMemMB} MB (${memPercent}%)`, textX + 200, textY, neonColors[1]);
      textY += lineHeight;

      neonText(`CPU Load:`, textX, textY, neonColors[0]);
      neonText(cpuLoad.toFixed(2), textX + 150, textY, neonColors[1]);
      textY += lineHeight;

      neonText(`Ping:`, textX, textY, neonColors[0]);
      neonText(`${ping} ms`, textX + 150, textY, neonColors[1]);

      // Graph area setup
      const graphX = 70;
      const graphY = height - 150;
      const graphWidth = width - 140;
      const graphHeight = 100;

      // Draw base line
      ctx.strokeStyle = "#0ff";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#0ff";
      ctx.shadowBlur = 15;

      ctx.beginPath();
      ctx.moveTo(graphX, graphY);
      ctx.lineTo(graphX + graphWidth, graphY);
      ctx.stroke();

      // Generate smooth river wave style points for each stat

      function scaleToGraph(valuePercent) {
        return graphY - (valuePercent / 100) * graphHeight;
      }

      function generateWavePoints(valuePercent, phaseShift = 0) {
        const points = [];
        const step = graphWidth / 20;
        for (let i = 0; i <= 20; i++) {
          // sine wave oscillation added
          const y = scaleToGraph(valuePercent) + Math.sin(i * 0.6 + phaseShift) * 10;
          points.push({ x: graphX + i * step, y });
        }
        return points;
      }

      const uptimePercent = Math.min((uptimeMs / 1000 / 300) * 100, 100); // cap at 5 mins for graph
      const ramPercent = parseFloat(memPercent);
      const cpuPercent = cpuLoadPercent;

      const uptimePoints = generateWavePoints(uptimePercent, 0);
      const ramPoints = generateWavePoints(ramPercent, Math.PI / 2);
      const cpuPoints = generateWavePoints(cpuPercent, Math.PI);

      // Draw smooth bezier curve function
      function drawBezierCurve(points, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.shadowColor = color;
        ctx.shadowBlur = 18;

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length - 2; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }

        // last two points
        ctx.quadraticCurveTo(
          points[points.length - 2].x,
          points[points.length - 2].y,
          points[points.length - 1].x,
          points[points.length - 1].y
        );

        ctx.stroke();
      }

      // Draw the 3 neon wave curves

      drawBezierCurve(uptimePoints, neonColors[0]); // cyan
      drawBezierCurve(ramPoints, neonColors[1]);    // magenta
      drawBezierCurve(cpuPoints, neonColors[2]);    // lime

      // Glowing dots at last point
      function drawDot(point, color) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 25;
        ctx.fill();
      }

      drawDot(uptimePoints[uptimePoints.length - 1], neonColors[0]);
      drawDot(ramPoints[ramPoints.length - 1], neonColors[1]);
      drawDot(cpuPoints[cpuPoints.length - 1], neonColors[2]);

      // Save canvas to image file
      const buffer = canvas.toBuffer("image/png");
      const imgPath = path.join(__dirname, "pup_premium_neon.png");
      fs.writeFileSync(imgPath, buffer);

      // Send image with summary text
      await api.sendMessage(
        {
          body:
            `✨ Premium Neon Group Info ✨\n\n` +
            `Group: ${groupName}\n` +
            `Members: ${memberCount}\n` +
            `Uptime: ${uptime}\n` +
            `RAM Usage: ${usedMemMB}MB / ${totalMemMB}MB (${memPercent}%)\n` +
            `CPU Load: ${cpuLoad.toFixed(2)}\n` +
            `Ping: ${ping} ms\n\n` +
            `🌀 Graph lines show smooth real-time stats waves`,
          attachment: fs.createReadStream(imgPath)
        },
        threadID
      );

      fs.unlinkSync(imgPath);

    } catch (error) {
      console.error(error);
      message.reply("❌ Sorry, failed to generate the premium group info image.");
    }
  }
};

function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor(duration / (1000 * 60 * 60));

  hours = hours < 10 ? "0" + hours : hours.toString();
  minutes = minutes < 10 ? "0" + minutes : minutes.toString();
  seconds = seconds < 10 ? "0" + seconds : seconds.toString();

  return `${hours}:${minutes}:${seconds}`;
}