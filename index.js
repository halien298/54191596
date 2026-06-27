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
      background: #0a000f;
      font-family: "VT323", monospace;
      color: #ccddff;
      position: relative;
    }

    /* Background Grid + Scanline like flawless */
    body::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: 
        linear-gradient(rgba(100, 0, 150, 0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(100, 0, 150, 0.06) 1px, transparent 1px);
      background-size: 50px 50px;
      pointer-events: none;
      z-index: 2;
      animation: scan 10s linear infinite;
      opacity: 0.6;
    }

    @keyframes scan {
      0% { background-position: 0 0; }
      100% { background-position: 0 200px; }
    }

    #particleCanvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
      mix-blend-mode: screen;
    }

    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 40px;
      z-index: 100;
      background: rgba(10, 0, 15, 0.7);
      border-bottom: 2px solid rgba(255,255,255,0.1);
    }

    .time-top {
      font-size: 2.1rem;
      color: #aaccff;
      text-shadow: 0 0 15px #ff00ff;
    }

    .top-key {
      background: rgba(0,0,0,0.85);
      padding: 12px 24px;
      border: 2px solid #ffffff;
      border-radius: 6px;
      font-size: 1.9rem;
      letter-spacing: 5px;
      box-shadow: 0 0 20px #ff00ff;
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
      width: 260px;
      height: 260px;
      object-fit: cover;
      border: 6px solid #ffffff;
      border-radius: 12px;
      box-shadow: 0 0 60px #ff00ff, 0 0 120px #9900ff;
      margin-bottom: 50px;
      image-rendering: crisp-edges;
    }

    .links {
      display: flex;
      gap: 40px;
      justify-content: center;
    }

    .link-btn {
      background: rgba(15,15,35,0.9);
      color: #ccddff;
      padding: 18px 42px;
      border: 3px solid #ffffff;
      border-radius: 8px;
      font-size: 1.8rem;
      text-decoration: none;
      transition: all 0.3s ease;
      box-shadow: 0 0 25px #ff00ff;
    }

    .link-btn:hover {
      transform: scale(1.1) translateY(-4px);
      box-shadow: 0 0 50px #ff00ff;
      background: #2a0040;
      color: white;
    }

    /* Hidden Music */
    #bgMusic { display: none; }
  </style>
</head>
<body>
  <canvas id="particleCanvas"></canvas>

  <!-- Header -->
  <div class="header">
    <div class="time-top" id="currentTime">TIME: --:--:--</div>
    <div class="top-key" id="topKey">
      KEY: <span id="keyValue">------</span>
    </div>
  </div>

  <!-- Center -->
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
          frameborder="0" allow="autoplay; encrypted-media"></iframe>

  <script>
    // Time
    function updateTime() {
      const timeEl = document.getElementById("currentTime");
      timeEl.textContent = "TIME: " + new Date().toLocaleTimeString('en-US', { hour12: false });
    }
    setInterval(updateTime, 1000);
    updateTime();

    // Key
    async function fetchKey() {
      try {
        const r = await fetch('/key');
        const d = await r.json();
        document.getElementById('keyValue').textContent = d.key;
      } catch(e) {}
    }
    setInterval(fetchKey, 4500);
    fetchKey();

    // Particles
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let points = [];
    let intensity = 1;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    for (let i = 0; i < 70; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.6,
        vy: (Math.random() - 0.5) * 1.6
      });
    }

    function animate() {
      ctx.fillStyle = 'rgba(10, 0, 15, 0.6)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      points.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff66ff';
        ctx.fillRect(p.x, p.y, 2.5, 2.5);
      });

      // Connections
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 170) {
            ctx.strokeStyle = \`rgba(180, 200, 255, \${(1 - dist/170) * 0.5 * intensity})\`;
            ctx.lineWidth = 1.1;
            ctx.shadowBlur = 8;
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

    // Pulse
    setInterval(() => { intensity = 2.5; setTimeout(() => intensity = 1, 200); }, 800);

    // Music
    const music = document.getElementById('bgMusic');
    window.addEventListener('load', () => {
      setTimeout(() => {
        try {
          music.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        } catch(e) {}
      }, 1400);
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
