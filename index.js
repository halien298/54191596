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
  <!-- New website icon - cropped to block style -->
  <link rel="icon" type="image/png" href="https://media.discordapp.net/attachments/1347659584868847688/1487075902205726921/image.png?ex=69c7d2db&is=69c6815b&hm=b50ac181d7dd30ba50f664c8cb390bd91a5ae914bd7dc038eebda35a8a16f87f&=&format=webp&quality=lossless&width=415&height=412">
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

    /* Normal mode */
    ${!isFsociety ? `
    .bg-grid {
      position: absolute; inset: 0;
      background: linear-gradient(rgba(100,0,255,0.04) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,180,255,0.04) 1px, transparent 1px);
      background-size: 60px 60px;
      z-index: 1;
    }
    ` : `
    /* fsociety mode */
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

    /* Top Center Time */
    .time-top {
      position: fixed;
      top: 25px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 2.1rem;
      color: ${isFsociety ? '#00ff41' : '#aaccff'};
      z-index: 100;
      text-shadow: 0 0 10px ${isFsociety ? '#00ff41' : '#aa44ff'};
    }

    /* Center Area - Discord + YouTube + Cropped Icon */
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
      object-position: center 30%;
      border: 6px solid ${isFsociety ? '#00ff41' : '#aa44ff'};
      border-radius: 12px;
      box-shadow: 0 0 40px ${isFsociety ? '#00ff41' : '#aa44ff'};
      margin-bottom: 30px;
    }

    .links {
      display: flex;
      gap: 40px;
      justify-content: center;
    }

    .link-btn {
      background: rgba(0,0,0,0.8);
      color: ${isFsociety ? '#00ff41' : '#ccddff'};
      padding: 14px 32px;
      border: 3px solid ${isFsociety ? '#00ff41' : '#aa44ff'};
      border-radius: 12px;
      font-size: 1.5rem;
      text-decoration: none;
      transition: all 0.3s;
      box-shadow: 0 0 20px ${isFsociety ? '#00ff41' : '#aa44ff'};
    }

    .link-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 0 35px ${isFsociety ? '#00ff41' : '#ff00ff'};
    }

    /* Top Right Key */
    .top-key {
      position: fixed; top: 25px; right: 25px;
      background: rgba(0,0,0,0.85); padding: 12px 24px;
      border: 3px solid ${isFsociety ? '#00ff41' : '#aa44ff'};
      border-radius: 8px; font-size: 1.8rem; letter-spacing: 4px;
      z-index: 100; box-shadow: 0 0 20px ${isFsociety ? '#00ff41' : '#aa44ff'};
      display: flex; align-items: center; gap: 12px;
    }

    .top-key-label { font-size: 1.1rem; color: ${isFsociety ? '#00ff41' : '#88aaff'}; }

    /* Radiation lines - normal mode only */
    ${!isFsociety ? `
    #particleCanvas {
      position: absolute; top:0; left:0; width:100%; height:100%; z-index:3; pointer-events:none; opacity:0.8;
    }
    ` : ''}
  </style>
</head>
<body>

  ${!isFsociety ? '<div class="bg-grid"></div>' : '<div class="scanline"></div>'}
  ${!isFsociety ? '<canvas id="particleCanvas"></canvas>' : ''}

  <!-- Top Center Time -->
  <div class="time-top" id="currentTime">Time: --:--:--</div>

  <!-- Top Right Key -->
  <div class="top-key" id="topKey">
    <span class="top-key-label">KEY:</span>
    ${currentKey}
  </div>

  ${isFsociety ? `
  <div class="terminal">
    fsociety00<br>
    INITIATING SYSTEM COMPROMISE...<br>
    ACCESS GRANTED
  </div>
  ` : ''}

  <!-- Center Content: Cropped Icon + Discord + YouTube -->
  <div class="center-content">
    <img src="https://i.pinimg.com/736x/8b/b8/87/8bb887efbcf379cff28271ea480e705f.jpg" 
         class="main-icon" alt="Idiot's Playground">
    
    <div class="links">
      <a href="https://discord.gg/AAnmrCTRk6" target="_blank" class="link-btn">DISCORD</a>
      <a href="https://www.youtube.com/@ladapagalaga" target="_blank" class="link-btn">YOUTUBE</a>
    </div>
  </div>

  ${!isFsociety ? `
  <!-- Spotify Playlist - top left -->
  <div style="position: fixed; top: 95px; left: 20px; z-index: 50; width: 380px;">
    <iframe src="https://open.spotify.com/embed/playlist/12sFokgtLMlhcYVVbLFoqP?utm_source=generator" 
            width="100%" height="380" frameBorder="0" 
            allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture">
    </iframe>
  </div>
  ` : `
  <!-- fsociety YouTube background music -->
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
    // Radiation lines only in normal mode
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
