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
      background: linear-gradient(180deg, #0a001f, #1a0033, #2a004d);
      font-family: 'VT323', monospace;
      color: #ccddff;
      position: relative;
    }

    /* Darker Vaporwave Background */
    .bg-grid {
      position: absolute;
      inset: 0;
      background: 
        linear-gradient(rgba(100,0,255,0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,180,255,0.06) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
      z-index: 1;
    }

    .sunset {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 40%, rgba(80,40,255,0.25), transparent 75%);
      z-index: 2;
      animation: sunsetPulse 25s infinite alternate;
    }

    @keyframes sunsetPulse {
      0% { opacity: 0.5; }
      100% { opacity: 0.85; }
    }

    /* Top Right Key */
    .top-key {
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0,0,0,0.75);
      padding: 12px 24px;
      border: 3px solid #aa44ff;
      border-radius: 8px;
      font-size: 1.8rem;
      letter-spacing: 4px;
      z-index: 100;
      box-shadow: 0 0 20px #aa44ff;
      text-shadow: 0 0 10px #aa44ff;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .top-key-label {
      font-size: 1.1rem;
      color: #88aaff;
      opacity: 0.9;
    }

    /* Center Box - no key */
    .box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      padding: 40px 60px;
      background: rgba(8, 4, 35, 0.88);
      border: 4px solid #aa44ff;
      border-radius: 15px;
      z-index: 10;
      box-shadow: 0 0 40px #aa44ff, 0 0 70px rgba(170,68,255,0.4);
      min-width: 420px;
    }

    .time {
      font-size: 1.4rem;
      color: #aaccff;
      margin-bottom: 15px;
    }

    .note {
      font-size: 1.1rem;
      color: #bbddff;
      opacity: 0.9;
    }

    /* Radiation - ONLY LINES (no particles) */
    #particleCanvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 3;
      pointer-events: none;
      opacity: 0.9;
    }

    /* Spotify Controls - Top Left */
    .music-controls {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 100;
      background: rgba(0,0,0,0.7);
      padding: 12px 18px;
      border-radius: 12px;
      border: 2px solid #7289da;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 0 20px #7289da;
    }

    .music-controls button {
      background: #7289da;
      color: white;
      border: none;
      padding: 8px 14px;
      border-radius: 8px;
      font-family: 'VT323', monospace;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .music-controls button:hover {
      background: #5865f2;
      transform: scale(1.08);
    }

    .volume-slider {
      width: 140px;
      accent-color: #7289da;
    }

    .discord-btn {
      position: fixed;
      top: 95px;
      left: 20px;
      width: 68px;
      height: 68px;
      background: linear-gradient(135deg, #7289da, #5865f2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      box-shadow: 0 0 30px #7289da;
      transition: all 0.3s;
      z-index: 100;
    }

    .discord-btn:hover {
      transform: scale(1.15);
      box-shadow: 0 0 45px #99aaff;
    }

    .discord-btn img {
      width: 38px;
      height: 38px;
      filter: brightness(1.1);
    }
  </style>
</head>
<body>

  <div class="bg-grid"></div>
  <div class="sunset"></div>
  <canvas id="particleCanvas"></canvas>

  <!-- Top Right Key -->
  <div class="top-key" id="topKey">
    <span class="top-key-label">KEY:</span>
    ${currentKey}
  </div>

  <!-- Music Controls - Top Left (autoplay on load) -->
  <div class="music-controls">
    <button id="playBtn">▶</button>
    <button id="nextBtn">⏭</button>
    <button id="stopBtn">■</button>
    <input type="range" id="volumeSlider" class="volume-slider" min="0" max="100" value="70">
  </div>

  <!-- Discord Button (moved below controls) -->
  <a class="discord-btn" href="https://discord.gg/AAnmrCTRk6" target="_blank">
    <img src="https://cdn-icons-png.flaticon.com/512/2111/2111370.png" alt="Discord">
  </a>

  <div class="box">
    <div class="time" id="currentTime">Time: --:--:--</div>
    <div class="note">Key changes every minute • Music starts automatically</div>

    <!-- Hidden Spotify Players -->
    <div id="spotifyPlayers" style="display:none;">
      <iframe id="player1" src="https://open.spotify.com/embed/track/7LKfKpO56W1l3AUbfiwAeF?utm_source=generator" width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
      <iframe id="player2" src="https://open.spotify.com/embed/track/6kexauPCWYPmDtmHzDf3Hw?utm_source=generator" width="100%" height="80" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
      <iframe id="player3" src="https://open.spotify.com/embed/track/2ZuMOcabaMzyXPPjFoYQGe?utm_source=generator" width="100%" height="80" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
    </div>
  </div>

  <script>
    // Live time
    function updateTime() {
      const now = new Date();
      document.getElementById("currentTime").innerText = 
        "Time: " + now.toLocaleTimeString('en-US', { hour12: false });
    }
    setInterval(updateTime, 1000);
    updateTime();

    // ONLY RADIATION LINES (no particles)
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let points = [];
    let intensity = 1.0;
    let hue = 200;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Create random points for lines
    function createPoints() {
      points = [];
      for (let i = 0; i < 45; i++) {
        points.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8
        });
      }
    }
    createPoints();

    function updatePoints() {
      for (let p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }
    }

    function drawRadiationLines() {
      ctx.fillStyle = 'rgba(10, 0, 30, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.65 * intensity;
            ctx.strokeStyle = \`rgba(100, 180, 255, \${alpha})\`;
            ctx.lineWidth = 1.6 * intensity;
            ctx.shadowBlur = 18 * intensity;
            ctx.shadowColor = '#77aaff';
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }
    }

    // Music sync pulse for lines
    setInterval(() => {
      intensity = 2.6;
      hue = 270;
      setTimeout(() => {
        intensity = 1.0;
        hue = 200;
      }, 140);
    }, 450);

    function animate() {
      updatePoints();
      drawRadiationLines();
      requestAnimationFrame(animate);
    }
    animate();

    // Auto refresh key
    setInterval(() => {
      fetch('/key')
        .then(res => res.json())
        .then(data => {
          const keyEl = document.getElementById('topKey');
          keyEl.innerHTML = '<span class="top-key-label">KEY:</span> ' + data.key;
        });
    }, 5000);

    // Spotify Music Controls with Autoplay on load
    let currentTrack = 0;
    const tracks = [
      document.getElementById('player1'),
      document.getElementById('player2'),
      document.getElementById('player3')
    ];

    const playBtn = document.getElementById('playBtn');
    const nextBtn = document.getElementById('nextBtn');
    const stopBtn = document.getElementById('stopBtn');
    const volumeSlider = document.getElementById('volumeSlider');

    // Autoplay first track when site loads
    window.addEventListener('load', () => {
      tracks[0].style.display = 'block';
      tracks[0].src = tracks[0].src + "&autoplay=1"; // force autoplay
      setTimeout(() => {
        try { tracks[0].contentWindow.postMessage('play', '*'); } catch(e) {}
      }, 800);
    });

    function switchTrack(newIndex) {
      tracks.forEach((t, i) => {
        t.style.display = i === newIndex ? 'block' : 'none';
      });
      currentTrack = newIndex;
    }

    playBtn.addEventListener('click', () => {
      try {
        tracks[currentTrack].contentWindow.postMessage('play', '*');
      } catch(e) {}
    });

    nextBtn.addEventListener('click', () => {
      let next = (currentTrack + 1) % tracks.length;
      switchTrack(next);
    });

    stopBtn.addEventListener('click', () => {
      try {
        tracks[currentTrack].contentWindow.postMessage('pause', '*');
      } catch(e) {}
    });

    volumeSlider.addEventListener('input', () => {
      const vol = volumeSlider.value;
      tracks.forEach(track => {
        try {
          track.contentWindow.postMessage({volume: vol}, '*');
        } catch(e) {}
      });
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
