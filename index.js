// index.js
const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;
const KEY_LENGTH = 7;
const CHARS = 'lI1iL';
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

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Idiot's Playground</title>
  <link rel="icon" type="image/png" href="https://raw.githubusercontent.com/halien298/54191596/refs/heads/main/b4fdce5dc0c1c3bd7dda0fca077b0dfb158698de_full.jpg">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
   
    body {
      margin: 0;
      height: 100vh;
      overflow: hidden;
      background: #000;
      font-family: "VT323", monospace;
      color: #ccddff;
      position: relative;
    }

    /* Background Effects */
    body::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: 
        linear-gradient(rgba(80, 0, 120, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(80, 0, 120, 0.08) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
      z-index: 2;
      animation: scanline 8s linear infinite;
    }

    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100%); }
    }

    #particleCanvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
    }

    .time-top {
      position: fixed;
      top: 28px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 2.2rem;
      color: #aaccff;
      z-index: 100;
      text-shadow: 0 0 12px #ffffff, 0 0 24px #ff00ff;
    }

    .center-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      z-index: 10;
    }

    .main-icon {
      width: 290px;
      height: 290px;
      object-fit: cover;
      object-position: center 28%;
      border: 5px solid #ffffff;
      border-radius: 14px;
      box-shadow: 0 0 55px #ffffff, 0 0 90px #ff00ff;
      margin-bottom: 38px;
      image-rendering: crisp-edges;
      transition: transform 0.4s;
    }
    .main-icon:hover {
      transform: scale(1.08) rotate(2deg);
    }

    .links {
      display: flex;
      gap: 48px;
      justify-content: center;
    }
    .link-btn {
      background: rgba(20,20,20,0.95);
      color: #ccddff;
      padding: 16px 38px;
      border: 3px solid #ffffff;
      border-radius: 12px;
      font-size: 1.65rem;
      text-decoration: none;
      transition: all 0.3s;
      box-shadow: 0 0 22px #ffffff, 0 0 40px #ff00ff;
    }
    .link-btn:hover {
      transform: scale(1.12);
      box-shadow: 0 0 45px #ffffff, 0 0 70px #ff00ff;
      color: #ffffff;
      background: rgba(40,20,60,0.95);
    }

    .top-key {
      position: fixed;
      top: 28px;
      right: 28px;
      background: rgba(0,0,0,0.9);
      padding: 13px 26px;
      border: 3px solid #ffffff;
      border-radius: 8px;
      font-size: 1.85rem;
      letter-spacing: 4px;
      z-index: 100;
      box-shadow: 0 0 22px #ffffff, 0 0 35px #ff00ff;
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .top-key-label {
      font-size: 1.15rem;
      color: #aaccff;
    }
  </style>
</head>
<body>
  <canvas id="particleCanvas"></canvas>

  <div class="time-top" id="currentTime">Time: --:--:--</div>

  <div class="top-key" id="topKey">
    <span class="top-key-label">KEY:</span>
    <span id="keyValue">LOADING...</span>
  </div>

  <div class="center-content">
    <img src="https://raw.githubusercontent.com/halien298/54191596/refs/heads/main/b4fdce5dc0c1c3bd7dda0fca077b0dfb158698de_full.jpg"
         class="main-icon" alt="Idiot's Playground">
  
    <div class="links">
      <a href="https://discord.gg/AAnmrCTRk6" target="_blank" class="link-btn">DISCORD</a>
      <a href="https://www.youtube.com/@ladapagalaga" target="_blank" class="link-btn">YOUTUBE</a>
    </div>
  </div>

  <!-- Hidden Background Music -->
  <iframe id="bgMusic" width="0" height="0" 
          src="https://www.youtube.com/embed/PCG1W1VpIqo?autoplay=1&loop=1&playlist=PCG1W1VpIqo&controls=0&modestbranding=1&rel=0" 
          frameborder="0" allow="autoplay; encrypted-media" style="display:none;"></iframe>

  <script>
    function updateTime() {
      document.getElementById("currentTime").innerText = "Time: " + new Date().toLocaleTimeString('en-US', { hour12: false });
    }
    setInterval(updateTime, 1000);
    updateTime();

    async function fetchKey() {
      try {
        const r = await fetch('/key');
        const d = await r.json();
        document.getElementById('keyValue').textContent = d.key;
      } catch(e) {}
    }
    setInterval(fetchKey, 4000);
    fetchKey();

    // Optimized Particles
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d', { alpha: true });
    let points = [];
    let intensity = 1.0;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    for (let i = 0; i < 65; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.4,
        vy: (Math.random() - 0.5) * 1.4,
        size: Math.random() * 2.5 + 1
      });
    }

    function animate() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let p of points) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#ff88ff';
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.65 * intensity;
            ctx.strokeStyle = \`rgba(180, 220, 255, \${alpha})\`;
            ctx.lineWidth = 1.2;
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#99bbff';
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

    setInterval(() => {
      intensity = 2.8;
      setTimeout(() => intensity = 1.0, 180);
    }, 750);

    // Background Music (hidden)
    const music = document.getElementById('bgMusic');
    window.addEventListener('load', () => {
      setTimeout(() => {
        try {
          music.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        } catch(e) {}
      }, 1500);
    });
  </script>
</body>
</html>`;

  res.send(html);
});

app.listen(PORT, () => {
  console.log("Idiot's Playground running on port " + PORT);
  scheduleKeyRotation();
});
