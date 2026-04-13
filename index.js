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
  <!-- High quality favicon (will be replaced when you send new link) -->
  <link rel="icon" type="image/png" href="https://media.discordapp.net/attachments/1347659584868847688/1487075902205726921/image.png?ex=69c7d2db&is=69c6815b&hm=b50ac181d7dd30ba50f664c8cb390bd91a5ae914bd7dc038eebda35a8a16f87f&=&format=webp&quality=lossless&width=415&height=412">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

    body {
      margin: 0;
      height: 100vh;
      overflow: hidden;
      background: #000000;
      font-family: "VT323", monospace;
      color: #ccddff;
      position: relative;
    }

    /* White radioactive radiation lines only */
    #particleCanvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      pointer-events: none;
      opacity: 0.9;
    }

    /* Top Center Time */
    .time-top {
      position: fixed;
      top: 25px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 2.1rem;
      color: #aaccff;
      z-index: 100;
      text-shadow: 0 0 15px #ffffff;
    }

    /* Center Content - Icon + Links */
    .center-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      z-index: 10;
    }

    .main-icon {
      width: 280px;
      height: 280px;
      object-fit: cover;
      object-position: center 25%;
      border: 6px solid #ffffff;
      border-radius: 12px;
      box-shadow: 0 0 50px #ffffff;
      margin-bottom: 35px;
      image-rendering: crisp-edges; /* Better quality for pixel art / sharp edges */
    }

    .links {
      display: flex;
      gap: 45px;
      justify-content: center;
    }

    .link-btn {
      background: rgba(0,0,0,0.9);
      color: #ccddff;
      padding: 16px 36px;
      border: 3px solid #ffffff;
      border-radius: 12px;
      font-size: 1.6rem;
      text-decoration: none;
      transition: all 0.3s;
      box-shadow: 0 0 25px #ffffff;
    }

    .link-btn:hover {
      transform: scale(1.12);
      box-shadow: 0 0 40px #ffffff;
      color: #ffffff;
    }

    /* Top Right Key */
    .top-key {
      position: fixed;
      top: 25px;
      right: 25px;
      background: rgba(0,0,0,0.85);
      padding: 12px 24px;
      border: 3px solid #ffffff;
      border-radius: 8px;
      font-size: 1.8rem;
      letter-spacing: 4px;
      z-index: 100;
      box-shadow: 0 0 20px #ffffff;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .top-key-label {
      font-size: 1.1rem;
      color: #aaccff;
    }
  </style>
</head>
<body>

  <!-- White radioactive lines only -->
  <canvas id="particleCanvas"></canvas>

  <!-- Top Center Time -->
  <div class="time-top" id="currentTime">Time: --:--:--</div>

  <!-- Top Right Key -->
  <div class="top-key" id="topKey">
    <span class="top-key-label">KEY:</span>
    ${currentKey}
  </div>

  <!-- Center Content -->
  <div class="center-content">
    <img src="https://media.discordapp.net/attachments/1347659584868847688/1487075902205726921/image.png?ex=69c7d2db&is=69c6815b&hm=b50ac181d7dd30ba50f664c8cb390bd91a5ae914bd7dc038eebda35a8a16f87f&=&format=webp&quality=lossless&width=415&height=412" 
         class="main-icon" alt="Idiot's Playground">
    
    <div class="links">
      <a href="https://discord.gg/AAnmrCTRk6" target="_blank" class="link-btn">DISCORD</a>
      <a href="https://www.youtube.com/@ladapagalaga" target="_blank" class="link-btn">YOUTUBE</a>
    </div>
  </div>

  <script>
    // Live time
    function updateTime() {
      document.getElementById("currentTime").innerText = "Time: " + new Date().toLocaleTimeString('en-US', { hour12: false });
    }
    setInterval(updateTime, 1000);
    updateTime();

    // White radioactive lines only (clean & smooth)
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let points = [];
    let intensity = 1.0;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Create points
    for (let i = 0; i < 52; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.1,
        vy: (Math.random() - 0.5) * 1.1
      });
    }

    function animate() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update points
      for (let p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }

      // Draw white radiation lines
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 190) {
            const alpha = (1 - dist / 190) * 0.75 * intensity;
            ctx.strokeStyle = \`rgba(255, 255, 255, \${alpha})\`;
            ctx.lineWidth = 1.8 * intensity;
            ctx.shadowBlur = 22 * intensity;
            ctx.shadowColor = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }
    animate();

    // Gentle pulse for radioactive feel
    setInterval(() => {
      intensity = 2.4;
      setTimeout(() => intensity = 1.0, 160);
    }, 520);

    // Auto refresh key
    setInterval(() => {
      fetch('/key').then(r => r.json()).then(d => {
        document.getElementById('topKey').innerHTML = '<span class="top-key-label">KEY:</span> ' + d.key;
      });
    }, 5000);
  </script>
</body>
</html>`;

  res.send(html);
});

app.listen(PORT, () => {
  console.log("Idiot's Playground running on port " + PORT);
  scheduleKeyRotation();
});
