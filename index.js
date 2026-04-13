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
  <link rel="icon" type="image/png" href="https://media.discordapp.net/attachments/1347659584868847688/1487075902205726921/image.png?ex=69c7d2db&is=69c6815b&hm=b50ac181d7dd30ba50f664c8cb390bd91a5ae914bd7dc038eebda35a8a16f87f&=&format=webp&quality=lossless&width=415&height=412">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

    body {
      margin: 0;
      height: 100vh;
      overflow: hidden;
      background: #000000; /* PURE BLACK */
      font-family: "VT323", monospace;
      color: #ccddff;
      position: relative;
    }

    /* White radioactive lines */
    #particleCanvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      pointer-events: none;
      opacity: 0.92;
    }

    /* Top Center Time */
    .time-top {
      position: fixed;
      top: 28px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 2.2rem;
      color: #aaccff;
      z-index: 100;
      text-shadow: 0 0 12px #ffffff;
    }

    /* Center Content */
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
      box-shadow: 0 0 55px #ffffff;
      margin-bottom: 38px;
      image-rendering: crisp-edges;
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
      box-shadow: 0 0 22px #ffffff;
    }

    .link-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 0 45px #ffffff;
      color: #ffffff;
    }

    /* Top Right Key */
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
      box-shadow: 0 0 22px #ffffff;
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .top-key-label {
      font-size: 1.15rem;
      color: #aaccff;
    }

    /* Volume Control */
    .volume-control {
      position: fixed;
      bottom: 35px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 100;
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(0,0,0,0.8);
      padding: 10px 20px;
      border-radius: 12px;
      border: 2px solid #ffffff;
    }

    .volume-label {
      color: #aaccff;
      font-size: 1.3rem;
    }

    .volume-slider {
      width: 220px;
      accent-color: #ffffff;
      cursor: pointer;
    }
  </style>
</head>
<body>

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

  <!-- Background Music -->
  <div style="display:none;">
    <iframe id="bgMusic" 
            width="0" height="0" 
            src="https://www.youtube.com/embed/oK3gZnDJnx0?autoplay=1&loop=1&playlist=oK3gZnDJnx0&controls=0&modestbranding=1" 
            frameborder="0" 
            allow="autoplay; encrypted-media">
    </iframe>
  </div>

  <!-- Volume Control -->
  <div class="volume-control">
    <span class="volume-label">VOLUME</span>
    <input type="range" id="volumeSlider" class="volume-slider" min="0" max="100" value="65">
  </div>

  <script>
    // Live time
    function updateTime() {
      document.getElementById("currentTime").innerText = "Time: " + new Date().toLocaleTimeString('en-US', { hour12: false });
    }
    setInterval(updateTime, 1000);
    updateTime();

    // White radioactive lines
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

    for (let i = 0; i < 55; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.05,
        vy: (Math.random() - 0.5) * 1.05
      });
    }

    function animate() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';   // pure black fade
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 195) {
            const alpha = (1 - dist / 195) * 0.78 * intensity;
            ctx.strokeStyle = \`rgba(255, 255, 255, \${alpha})\`;
            ctx.lineWidth = 1.85 * intensity;
            ctx.shadowBlur = 24 * intensity;
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

    setInterval(() => {
      intensity = 2.6;
      setTimeout(() => intensity = 1.0, 170);
    }, 530);

    // Auto refresh key
    setInterval(() => {
      fetch('/key').then(r => r.json()).then(d => {
        document.getElementById('topKey').innerHTML = '<span class="top-key-label">KEY:</span> ' + d.key;
      });
    }, 5000);

    // Volume control for background music
    const volumeSlider = document.getElementById('volumeSlider');
    const musicFrame = document.getElementById('bgMusic');

    volumeSlider.addEventListener('input', () => {
      const vol = parseInt(volumeSlider.value);
      try {
        musicFrame.contentWindow.postMessage({
          event: 'command',
          func: 'setVolume',
          args: [vol]
        }, '*');
      } catch(e) {}
    });

    // Force music start
    window.addEventListener('load', () => {
      setTimeout(() => {
        try {
          musicFrame.contentWindow.postMessage({ event: 'command', func: 'playVideo' }, '*');
        } catch(e) {}
      }, 1200);
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
