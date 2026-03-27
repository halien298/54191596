// index.js
const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;

const KEY_LENGTH = 15;
const CHARS = 'QWERTZUIOPASDFGHJKLYXCVBNMqwertzuiopasdfghjklyxcvbnm123456789@€Đđ-';

let currentKey = generateKey(KEY_LENGTH);
console.log("Initial key: " + currentKey);

function generateKey(length) {
  const bytes = crypto.randomBytes(length);
  let key = '';
  for (let i = 0; i < length; i++) {
    key += CHARS[bytes[i] % CHARS.length];
  }
  return key;
}

function scheduleKeyRotation() {
  const now = Date.now();
  const msUntilNextMinute = 60000 - (now % 60000);
  setTimeout(() => {
    rotateKey();
    setInterval(rotateKey, 60000);
  }, msUntilNextMinute);
}

function rotateKey() {
  currentKey = generateKey(KEY_LENGTH);
  console.log("New key: " + currentKey);
}

app.get('/key', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  res.set('Access-Control-Allow-Origin', '*');
  res.json({ key: currentKey, generatedAt: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  res.set('Access-Control-Allow-Origin', '*');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Idiot's Playground</title>
  <link rel="icon" type="image/png" href="https://i.pinimg.com/736x/8b/b8/87/8bb887efbcf379cff28271ea480e705f.jpg">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

    body {
      margin: 0;
      height: 100vh;
      overflow: hidden;
      background: linear-gradient(180deg, #1a0033, #330066, #ff00aa);
      font-family: 'VT323', monospace;
      color: #ffccff;
      position: relative;
    }

    /* Vaporwave Background Effects */
    .bg-grid {
      position: absolute;
      inset: 0;
      background: 
        linear-gradient(rgba(255,0,255,0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,255,255,0.08) 1px, transparent 1px);
      background-size: 50px 50px;
      pointer-events: none;
      z-index: 1;
    }

    .sunset {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 30%, rgba(255,100,200,0.4), transparent 70%);
      z-index: 2;
      animation: sunsetPulse 20s infinite alternate;
    }

    @keyframes sunsetPulse {
      0% { opacity: 0.6; }
      100% { opacity: 1; }
    }

    /* Top Right Key */
    .top-key {
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0,0,0,0.7);
      padding: 12px 24px;
      border: 3px solid #ff00ff;
      border-radius: 8px;
      font-size: 1.8rem;
      letter-spacing: 4px;
      z-index: 100;
      box-shadow: 0 0 20px #ff00ff;
      text-shadow: 0 0 10px #ff00ff;
    }

    /* Center Box */
    .box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      padding: 40px 60px;
      background: rgba(10, 5, 40, 0.85);
      border: 4px solid #ff00ff;
      border-radius: 15px;
      z-index: 10;
      box-shadow: 0 0 40px #ff00ff, 0 0 80px rgba(255,0,255,0.5);
      min-width: 380px;
    }

    .key-center {
      font-size: 3.2rem;
      letter-spacing: 8px;
      font-weight: bold;
      text-shadow: 0 0 15px #ff00ff, 0 0 30px #aa00ff;
      margin-bottom: 15px;
    }

    .time {
      font-size: 1.4rem;
      color: #ccffcc;
      margin-bottom: 10px;
    }

    .note {
      font-size: 1.1rem;
      color: #ffccff;
      opacity: 0.9;
    }

    /* Mouse-following snow */
    .mouse-snow {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 5;
    }

    .mflake {
      position: absolute;
      background: #ffffff;
      border-radius: 50%;
      opacity: 0.9;
      pointer-events: none;
      box-shadow: 0 0 8px #aaccff;
    }

    /* Spotify Player */
    .spotify-container {
      margin-top: 25px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 0 30px rgba(30, 215, 96, 0.6);
    }

    .discord-btn {
      position: fixed;
      top: 20px;
      left: 20px;
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #7289da, #5865f2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      box-shadow: 0 0 25px #7289da;
      transition: all 0.3s;
      z-index: 100;
    }

    .discord-btn:hover {
      transform: scale(1.15) rotate(10deg);
      box-shadow: 0 0 40px #99aaff;
    }

    .discord-btn img {
      width: 34px;
      height: 34px;
    }
  </style>
</head>
<body>

  <div class="bg-grid"></div>
  <div class="sunset"></div>
  
  <!-- Top Right Key -->
  <div class="top-key" id="topKey">${currentKey}</div>

  <!-- Discord Button -->
  <a class="discord-btn" href="https://discord.gg/AAnmrCTRk6" target="_blank">
    <img src="https://cdn-icons-png.flaticon.com/512/2111/2111370.png" alt="Discord">
  </a>

  <div class="box">
    <div class="key-center" id="centerKey">${currentKey}</div>
    <div class="time" id="currentTime">Time: --:--:--</div>
    <div class="note">Key changes every minute • Refresh if needed</div>

    <!-- Spotify Embed -->
    <div class="spotify-container">
      <iframe style="border-radius:12px" 
              src="https://open.spotify.com/embed/track/2ZuMOcabaMzyXPPjFoYQGe?utm_source=generator" 
              width="100%" 
              height="152" 
              frameBorder="0" 
              allowfullscreen="" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
      </iframe>
    </div>
  </div>

  <!-- Mouse Following Snow Container -->
  <div class="mouse-snow" id="mouseSnow"></div>

  <script>
    // Live time
    function updateTime() {
      const now = new Date();
      document.getElementById("currentTime").innerText = 
        "Time: " + now.toLocaleTimeString('en-US', { hour12: false });
    }
    setInterval(updateTime, 1000);
    updateTime();

    // Mouse following snow effect
    const mouseSnowContainer = document.getElementById('mouseSnow');
    let lastX = 0, lastY = 0;

    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - (mouseSnowContainer.lastTime || 0) < 40) return; // limit creation rate
      mouseSnowContainer.lastTime = now;

      const flake = document.createElement('div');
      flake.className = 'mflake';
      
      const size = 5 + Math.random() * 11;
      flake.style.width = size + 'px';
      flake.style.height = size + 'px';
      flake.style.left = (e.clientX + (Math.random() * 40 - 20)) + 'px';
      flake.style.top = (e.clientY - 20) + 'px';
      
      const duration = 1.2 + Math.random() * 1.8;
      flake.style.transition = \`all \${duration}s linear\`;
      
      mouseSnowContainer.appendChild(flake);

      // Animate downward
      setTimeout(() => {
        flake.style.transform = \`translateY(\${window.innerHeight + 100}px)\`;
        flake.style.opacity = '0';
      }, 10);

      // Remove after animation
      setTimeout(() => flake.remove(), duration * 1000 + 200);
    });

    // Auto refresh key display every 5 seconds (in case of rotation)
    setInterval(() => {
      fetch('/key')
        .then(res => res.json())
        .then(data => {
          document.getElementById('topKey').textContent = data.key;
          document.getElementById('centerKey').textContent = data.key;
        })
        .catch(() => {});
    }, 5000);
  </script>
</body>
</html>`;

  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Idiot's Playground running on port ${PORT}`);
  scheduleKeyRotation();
});
