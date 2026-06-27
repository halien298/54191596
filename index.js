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
      background: radial-gradient(circle at center, #1a0033 0%, #000000 70%);
      font-family: "VT323", monospace;
      color: #ccddff;
      position: relative;
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

    .audio-player {
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(10,10,30,0.95);
      border: 3px solid #ff00ff;
      border-radius: 12px;
      padding: 12px 28px;
      display: flex;
      align-items: center;
      gap: 16px;
      z-index: 100;
      box-shadow: 0 0 30px #ff00ff;
    }
    .audio-player button {
      background: transparent;
      border: 2px solid #ccddff;
      color: #ccddff;
      font-family: "VT323", monospace;
      font-size: 1.4rem;
      padding: 6px 18px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .audio-player button:hover {
      background: #ff00ff;
      color: #000;
      box-shadow: 0 0 20px #ff00ff;
    }
    .audio-player .volume {
      width: 130px;
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

  <div class="audio-player">
    <button id="playBtn">▶ PLAY</button>
    <button id="pauseBtn">⏸ PAUSE</button>
    <input type="range" id="volumeSlider" class="volume" min="0" max="1" step="0.01" value="0.7">
    <span id="nowPlaying" style="font-size:1.3rem; color:#ff99ff;">Background Track</span>
  </div>

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

    for (let i = 0; i < 120; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.8,
        vy: (Math.random() - 0.5) * 1.8,
        size: Math.random() * 3 + 1
      });
    }

    function animate() {
      ctx.fillStyle = 'rgba(10, 0, 25, 0.45)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let p of points) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) { p.vx *= -1.05; p.x = Math.max(0, Math.min(canvas.width, p.x)); }
        if (p.y < 0 || p.y > canvas.height) { p.vy *= -1.05; p.y = Math.max(0, Math.min(canvas.height, p.y)); }

        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ff99ff';
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 210) {
            const alpha = (1 - dist / 210) * 0.75 * intensity;
            ctx.strokeStyle = \`rgba(180, 220, 255, \${alpha})\`;
            ctx.lineWidth = 1.6 * intensity;
            ctx.shadowBlur = 25 * intensity;
            ctx.shadowColor = '#88aaff';
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
      intensity = 3.2;
      setTimeout(() => intensity = 1.0, 220);
    }, 680);

    // Audio
    const audioIframe = document.createElement('iframe');
    audioIframe.style.display = 'none';
    audioIframe.width = "0"; audioIframe.height = "0";
    audioIframe.src = "https://www.youtube.com/embed/PCG1W1VpIqo?autoplay=1&loop=1&playlist=PCG1W1VpIqo&controls=0&modestbranding=1&rel=0";
    audioIframe.allow = "autoplay; encrypted-media";
    document.body.appendChild(audioIframe);

    let isPlaying = true;

    document.getElementById('playBtn').addEventListener('click', () => {
      try { audioIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*'); isPlaying = true; } catch(e) {}
    });

    document.getElementById('pauseBtn').addEventListener('click', () => {
      try { audioIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*'); isPlaying = false; } catch(e) {}
    });

    document.getElementById('volumeSlider').addEventListener('input', (e) => {
      try {
        const vol = Math.round(e.target.value * 100);
        audioIframe.contentWindow.postMessage(\`{"event":"command","func":"setVolume","args":[\${vol}]}\`, '*');
      } catch(e) {}
    });

    window.addEventListener('load', () => {
      setTimeout(() => {
        try { audioIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*'); } catch(e) {}
      }, 1200);
    });

    document.addEventListener('keydown', e => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (isPlaying) document.getElementById('pauseBtn').click();
        else document.getElementById('playBtn').click();
      }
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
