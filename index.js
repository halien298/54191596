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

  // 1 in 10 chance for fsociety secret mode
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
        'background: #001100; color: #00ff41; font-family: monospace;' : 
        'background: linear-gradient(180deg, #0a0014, #1a0028, #2a003d); font-family: "VT323", monospace; color: #ccddff;'
      }
      position: relative;
    }

    /* Normal Vaporwave Dark */
    ${!isFsociety ? `
    .bg-grid {
      position: absolute; inset: 0;
      background: linear-gradient(rgba(100,0,255,0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,180,255,0.05) 1px, transparent 1px);
      background-size: 60px 60px;
      z-index: 1;
    }
    .sunset {
      position: absolute; inset: 0;
      background: radial-gradient(circle at 50% 40%, rgba(80,40,255,0.2), transparent 75%);
      z-index: 2;
      animation: sunsetPulse 25s infinite alternate;
    }
    @keyframes sunsetPulse { 0% { opacity: 0.45; } 100% { opacity: 0.75; } }
    ` : `
    /* fsociety style */
    body { animation: glitch 0.8s infinite alternate; }
    @keyframes glitch {
      0% { transform: translate(0); }
      20% { transform: translate(-2px, 2px); }
      40% { transform: translate(-2px, -2px); }
      60% { transform: translate(2px, 2px); }
      80% { transform: translate(2px, -2px); }
      100% { transform: translate(0); }
    }
    .scanline {
      position: absolute; inset: 0; background: repeating-linear-gradient(transparent 0px, transparent 2px, rgba(0,255,65,0.08) 2px, rgba(0,255,65,0.08) 4px);
      pointer-events: none; z-index: 5; animation: scan 4s linear infinite;
    }
    @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
    `}

    .top-key {
      position: fixed; top: 20px; right: 20px;
      background: rgba(0,0,0,0.8); padding: 12px 24px;
      border: 3px solid ${isFsociety ? '#00ff41' : '#aa44ff'};
      border-radius: 8px; font-size: 1.8rem; letter-spacing: 4px;
      z-index: 100; box-shadow: 0 0 20px ${isFsociety ? '#00ff41' : '#aa44ff'};
      display: flex; align-items: center; gap: 12px;
    }

    .top-key-label { font-size: 1.1rem; color: ${isFsociety ? '#00ff41' : '#88aaff'}; }

    /* Center - only time */
    .box {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      text-align: center; padding: 30px 50px;
      background: rgba(8,4,35,0.9); border: 4px solid ${isFsociety ? '#00ff41' : '#aa44ff'};
      border-radius: 15px; z-index: 10; min-width: 340px;
      box-shadow: 0 0 40px ${isFsociety ? '#00ff41' : '#aa44ff'};
    }

    .time { font-size: 1.8rem; color: ${isFsociety ? '#00ff41' : '#aaccff'}; margin: 0; }

    /* Radiation - only lines */
    #particleCanvas { position: absolute; top:0; left:0; width:100%; height:100%; z-index:3; pointer-events:none; opacity:0.85; }

    /* Music info + playlist */
    .music-info {
      text-align: center; margin-bottom: 15px;
    }
    .music-cover {
      width: 180px; height: 180px; border-radius: 12px; border: 3px solid #7289da; box-shadow: 0 0 25px #7289da;
    }
    .music-title { font-size: 1.6rem; margin: 12px 0 4px; }
    .music-artist { font-size: 1.2rem; opacity: 0.85; }

    /* Spotify Playlist Embed */
    .spotify-container iframe {
      border-radius: 12px; box-shadow: 0 0 30px rgba(30,215,96,0.6);
    }

    /* Music controls top left */
    .music-controls {
      position: fixed; top: 20px; left: 20px; z-index: 100;
      background: rgba(0,0,0,0.75); padding: 12px 18px; border-radius: 12px;
      border: 2px solid #7289da; display: flex; align-items: center; gap: 12px;
      box-shadow: 0 0 20px #7289da;
    }
    .music-controls button {
      background: #7289da; color: white; border: none; padding: 8px 14px;
      border-radius: 8px; font-family: 'VT323', monospace; font-size: 1.2rem; cursor: pointer;
    }
    .music-controls button:hover { background: #5865f2; transform: scale(1.08); }
    .volume-slider { width: 130px; accent-color: #7289da; }
  </style>
</head>
<body>

  ${!isFsociety ? '<div class="bg-grid"></div><div class="sunset"></div>' : '<div class="scanline"></div>'}
  <canvas id="particleCanvas"></canvas>

  <!-- Top Right Key -->
  <div class="top-key" id="topKey">
    <span class="top-key-label">KEY:</span>
    ${currentKey}
  </div>

  <!-- Music Controls -->
  <div class="music-controls">
    <button id="playBtn">▶</button>
    <button id="nextBtn">⏭</button>
    <button id="stopBtn">■</button>
    <input type="range" id="volumeSlider" class="volume-slider" min="0" max="100" value="75">
  </div>

  <div class="box">
    <div class="time" id="currentTime">Time: --:--:--</div>
  </div>

  <!-- Music Info + Playlist -->
  <div style="position:absolute; bottom:40px; left:50%; transform:translateX(-50%); z-index:10; text-align:center; width:90%; max-width:520px;">
    <div class="music-info">
      ${isFsociety ? `
        <img src="https://i.imgur.com/2fQJ8kP.png" class="music-cover" alt="fsociety">
        <div class="music-title">Society</div>
        <div class="music-artist">pathetic240px</div>
      ` : `
        <img src="https://i.scdn.co/image/ab67616d0000b273... (playlist cover would go here)" class="music-cover" alt="Playlist">
        <div class="music-title">Idiot's Vibes</div>
        <div class="music-artist">Curated Playlist</div>
      `}
    </div>
    <iframe id="spotifyPlaylist" 
            src="https://open.spotify.com/embed/playlist/12sFokgtLMlhcYVVbLFoqP?utm_source=generator&autoplay=1" 
            width="100%" height="380" frameBorder="0" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
    </iframe>
  </div>

  <script>
    // Live time
    function updateTime() {
      document.getElementById("currentTime").innerText = "Time: " + new Date().toLocaleTimeString('en-US', { hour12: false });
    }
    setInterval(updateTime, 1000);
    updateTime();

    // Only radiation lines
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
        for (let j = i+1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 175) {
            const alpha = (1 - dist / 175) * 0.7 * intensity;
            ctx.strokeStyle = \`rgba(110, 170, 255, \${alpha})\`;
            ctx.lineWidth = 1.7 * intensity;
            ctx.shadowBlur = 20 * intensity;
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

    // Beat sync for lines
    setInterval(() => { intensity = 2.8; setTimeout(() => intensity = 1, 130); }, 440);

    // Auto refresh key
    setInterval(() => {
      fetch('/key').then(r => r.json()).then(d => {
        document.getElementById('topKey').innerHTML = '<span class="top-key-label">KEY:</span> ' + d.key;
      });
    }, 5000);

    // Music controls (with autoplay already in iframe)
    const volumeSlider = document.getElementById('volumeSlider');
    volumeSlider.addEventListener('input', () => {
      const vol = volumeSlider.value;
      const iframe = document.getElementById('spotifyPlaylist');
      try { iframe.contentWindow.postMessage({volume: vol}, '*'); } catch(e) {}
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
