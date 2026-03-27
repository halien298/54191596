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

  const isFsociety = Math.random() < 0.1;

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
      ${isFsociety ? 
        'background: #000000; color: #00ff41; font-family: monospace;' : 
        'background: #0a0014; font-family: "VT323", monospace; color: #ccddff;'
      }
      position: relative;
    }

    /* Normal mode - dark vaporwave */
    ${!isFsociety ? `
    .bg-grid {
      position: absolute; inset: 0;
      background: linear-gradient(rgba(100,0,255,0.04) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,180,255,0.04) 1px, transparent 1px);
      background-size: 60px 60px;
      z-index: 1;
    }
    ` : `
    /* fsociety mode - only fsociety effects, black background */
    body { animation: glitch 0.6s infinite alternate; }
    @keyframes glitch {
      0% { transform: translate(0); }
      20% { transform: translate(-3px, 2px); }
      40% { transform: translate(2px, -3px); }
      60% { transform: translate(-2px, 3px); }
      100% { transform: translate(0); }
    }
    .scanline {
      position: absolute; inset: 0;
      background: repeating-linear-gradient(transparent 0px, transparent 3px, rgba(0,255,65,0.12) 3px, rgba(0,255,65,0.12) 6px);
      pointer-events: none; z-index: 5; animation: scan 3s linear infinite;
    }
    @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(300%); } }
    .terminal { position: absolute; top: 20px; left: 20px; color: #00ff41; font-size: 1.1rem; }
    `}

    .top-key {
      position: fixed; top: 20px; right: 20px;
      background: rgba(0,0,0,0.85); padding: 12px 24px;
      border: 3px solid ${isFsociety ? '#00ff41' : '#aa44ff'};
      border-radius: 8px; font-size: 1.8rem; letter-spacing: 4px;
      z-index: 100; box-shadow: 0 0 20px ${isFsociety ? '#00ff41' : '#aa44ff'};
      display: flex; align-items: center; gap: 12px;
    }

    .top-key-label { font-size: 1.1rem; color: ${isFsociety ? '#00ff41' : '#88aaff'}; }

    /* Center - only time */
    .box {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      text-align: center; padding: 25px 45px;
      background: rgba(10,5,40,0.9); border: 3px solid ${isFsociety ? '#00ff41' : '#aa44ff'};
      border-radius: 12px; z-index: 10;
    }

    .time { font-size: 1.9rem; color: ${isFsociety ? '#00ff41' : '#aaccff'}; margin: 0; }

    /* Radiation lines - only in normal mode */
    ${!isFsociety ? `
    #particleCanvas {
      position: absolute; top:0; left:0; width:100%; height:100%; z-index:3; pointer-events:none; opacity:0.8;
    }
    ` : ''}

    /* Playlist moved to top left (normal mode only) */
    ${!isFsociety ? `
    .playlist-container {
      position: fixed; top: 95px; left: 20px; z-index: 50;
      width: 380px;
    }
    ` : ''}
  </style>
</head>
<body>

  ${!isFsociety ? '<div class="bg-grid"></div>' : '<div class="scanline"></div>'}
  ${!isFsociety ? '<canvas id="particleCanvas"></canvas>' : ''}

  <!-- Top Right Key -->
  <div class="top-key" id="topKey">
    <span class="top-key-label">KEY:</span>
    ${currentKey}
  </div>

  ${isFsociety ? `
  <!-- fsociety terminal text -->
  <div class="terminal">
    fsociety00<br>
    INITIATING SYSTEM COMPROMISE...<br>
    ACCESS GRANTED
  </div>
  ` : ''}

  <!-- Center Time -->
  <div class="box">
    <div class="time" id="currentTime">Time: --:--:--</div>
  </div>

  ${!isFsociety ? `
  <!-- Playlist moved to top left -->
  <div class="playlist-container">
    <iframe src="https://open.spotify.com/embed/playlist/12sFokgtLMlhcYVVbLFoqP?utm_source=generator" 
            width="100%" height="380" frameBorder="0" 
            allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture">
    </iframe>
  </div>
  ` : `
  <!-- fsociety background YouTube music (Society track) - hidden player -->
  <div style="display:none;">
    <iframe id="ytPlayer" width="0" height="0" 
            src="https://www.youtube.com/embed/5NLdlIggmKj4G7RB6l8Tm1?autoplay=1&loop=1&playlist=5NLdlIggmKj4G7RB6l8Tm1&controls=0&modestbranding=1" 
            frameborder="0" allow="autoplay; encrypted-media"></iframe>
  </div>
  `}

  <script>
    // Live time
    function updateTime() {
      document.getElementById("currentTime").innerText = "Time: " + new Date().toLocaleTimeString('en-US', { hour12: false });
    }
    setInterval(updateTime, 1000);
    updateTime();

    ${!isFsociety ? `
    // Radiation lines (normal mode only)
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let points = [];
    let intensity = 1;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < 48; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9
      });
    }

    function animate() {
      ctx.fillStyle = 'rgba(10, 0, 30, 0.13)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let p of points) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 175) {
            const alpha = (1 - dist / 175) * 0.65 * intensity;
            ctx.strokeStyle = \`rgba(110, 170, 255, \${alpha})\`;
            ctx.lineWidth = 1.6 * intensity;
            ctx.shadowBlur = 18 * intensity;
            ctx.shadowColor = '#88bbff';
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

    // Beat pulse
    setInterval(() => {
      intensity = 2.5;
      setTimeout(() => intensity = 1, 140);
    }, 450);
    ` : ''}

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
