
<svg width="100%" height="100%" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff00cc">
        <animate attributeName="offset" values="0;1" dur="4s" repeatCount="indefinite"/>
      </stop>
      <stop offset="25%" stop-color="#00ffff">
        <animate attributeName="offset" values="0.25;0" dur="4s" repeatCount="indefinite"/>
      </stop>
      <stop offset="50%" stop-color="#ffcc00">
        <animate attributeName="offset" values="0.5;1" dur="4s" repeatCount="indefinite"/>
      </stop>
      <stop offset="75%" stop-color="#00ff88">
        <animate attributeName="offset" values="0.75;0.25" dur="4s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" stop-color="#ff3366">
        <animate attributeName="offset" values="1;0.5" dur="4s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="#050505"/>

  <!-- Floating glowing dots -->
  <g>
    <circle cx="100" cy="100" r="4" fill="url(#rainbow)">
      <animate attributeName="cy" values="100;380;100" dur="6s" repeatCount="indefinite"/>
      <animate attributeName="cx" values="100;500;100" dur="10s" repeatCount="indefinite"/>
    </circle>
    <circle cx="400" cy="200" r="5" fill="url(#rainbow)">
      <animate attributeName="cy" values="200;50;200" dur="8s" repeatCount="indefinite"/>
      <animate attributeName="cx" values="400;100;400" dur="11s" repeatCount="indefinite"/>
    </circle>
    <circle cx="250" cy="300" r="4" fill="url(#rainbow)">
      <animate attributeName="cy" values="300;80;300" dur="7s" repeatCount="indefinite"/>
      <animate attributeName="cx" values="250;550;250" dur="9s" repeatCount="indefinite"/>
    </circle>
  </g>

  <!-- Outer rainbow border -->
  <rect x="10" y="10" width="580" height="380" rx="25" stroke="url(#rainbow)" stroke-width="4" fill="transparent">
    <animate attributeName="stroke-dasharray" values="20,10;50,5;10,20;20,10" dur="2s" repeatCount="indefinite"/>
  </rect>

  <!-- Inner glowing border -->
  <rect x="18" y="18" width="564" height="364" rx="22" stroke="url(#rainbow)" stroke-width="2" fill="transparent">
    <animate attributeName="stroke-dashoffset" values="0;60;0" dur="4s" repeatCount="indefinite"/>
  </rect>

  <!-- Neon glass panel -->
  <rect x="50" y="50" width="500" height="300" rx="20" fill="#0a0a0af2" stroke="#ffffff22" stroke-width="1.5"/>

  <!-- Title -->
  <text x="50%" y="95" text-anchor="middle" font-size="42" font-family="Segoe UI, Verdana, sans-serif" fill="url(#rainbow)">
    ✨✨ HELAL ✨✨
    <animateTransform attributeName="transform" type="scale" values="1;1.05;1" dur="3s" repeatCount="indefinite"/>
  </text>

  <!-- Rotating ring -->
  <circle cx="300" cy="200" r="70" fill="none" stroke="url(#rainbow)" stroke-width="3">
    <animateTransform attributeName="transform" type="rotate" from="0 300 200" to="360 300 200" dur="8s" repeatCount="indefinite"/>
  </circle>

  <!-- Bot Name in Center -->
  <text x="300" y="215" text-anchor="middle" font-size="48" font-weight="bold" font-family="Consolas, monospace" fill="url(#rainbow)">
    CAT BOT
    <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>
  </text>

  <!-- Footer text -->
  <text x="50%" y="360" text-anchor="middle" font-size="18" font-family="Verdana, sans-serif" fill="url(#rainbow)">
    ⚡ Created by Helal | CAT BOT SYSTEM 2025 ⚡
  </text>
</svg>