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

    /* Top Right Key - now with key on the left side */
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

    /* Center Box - key removed from center */
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
      margin-bottom: 10px;
    }

    .note {
      font-size: 1.1rem;
      color: #bbddff;
      opacity: 0.9;
    }

    /* Radiation effect - particles + lines (no cursor follow, music synced) */
    #particleCanvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 3;
      pointer-events: none;
      opacity: 0.85;
    }

    /* Spotify Players */
    .spotify-container {
      margin-top: 25px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .spotify-main {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 0 30px rgba(30, 215, 96, 0.7);
    }

    .spotify-mini {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 0 18px rgba(30, 215, 96, 0.5);
    }

    /* Bigger & clearer Discord button */
    .discord-btn {
      position: fixed;
      top: 20px;
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

  <!-- Top Right Key with label on left -->
  <div class="top-key" id="topKey">
    <span class="top-key-label">KEY:</span>
    ${currentKey}
  </div>

  <!-- Bigger Discord Button -->
  <a class="discord-btn" href="https://discord.gg/AAnmrCTRk6" target="_blank">
    <img src="https://cdn-icons-png.flaticon.com/512/2111/2111370.png" alt="Discord">
  </a>

  <div class="box">
    <div class="time" id="currentTime">Time: --:--:--</div>
    <div class="note">Key changes every minute • Music starts on load</div>

    <div class="spotify-container">
      <div class="spotify-main">
        <iframe style="border-radius:12px" 
                src="https://open.spotify.com/embed/track/7LKfKpO56W1l3AUbfiwAeF?utm_source=generator" 
                width="100%" height="152" frameBorder="0" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
        </iframe>
      </div>
      <div class="spotify-mini">
        <iframe style="border-radius:12px" 
                src="https://open.spotify.com/embed/track/6kexauPCWYPmDtmHzDf3Hw?utm_source=generator" 
                width="100%" height="80" frameBorder="0" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
        </iframe>
      </div>
      <div class="spotify-mini">
        <iframe style="border-radius:12px" 
                src="https://open.spotify.com/embed/track/2ZuMOcabaMzyXPPjFoYQGe?utm_source=generator" 
                width="100%" height="80" frameBorder="0" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
        </iframe>
      </div>
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

    // Radiation effect - particles + connecting lines (music synced, no cursor)
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let intensity = 1.0;
    let hueShift = 200; // starts in blue-purple range

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height * 0.7;
        this.vx = (Math.random() - 0.5) * 1.6;
        this.vy = (Math.random() - 0.5) * 1.4 + 0.6;
        this.size = Math.random() * 4 + 2;
        this.life = 140 + Math.random() * 80;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.985;
        this.vy *= 0.985;
        this.life -= 1.1;
        if (this.life <= 0 || this.y > canvas.height) this.reset();
      }
      draw() {
        const color = \`hsl(\${hueShift}, 100%, 75%)\`;
        ctx.shadowBlur = 22 * intensity;
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.globalAlpha = (this.life / 200) * 0.85;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Spawn radiation particles
    for (let i = 0; i < 85; i++) {
      particles.push(new Particle());
    }

    function connectRadiation() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.55 * intensity;
            ctx.strokeStyle = \`rgba(120, 180, 255, \${alpha})\`;
            ctx.lineWidth = 1.4 * intensity;
            ctx.shadowBlur = 15 * intensity;
            ctx.shadowColor = '#88ccff';
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    // Music-synced color & intensity pulse (radiation reacts to beat)
    let beatInterval = 460; // tuned to the tracks
    setInterval(() => {
      intensity = 2.4;
      hueShift = 260; // shift toward magenta/purple on beat
      setTimeout(() => {
        intensity = 1.0;
        hueShift = 200; // back to blue-purple
      }, 160);
    }, beatInterval);

    function animate() {
      ctx.fillStyle = 'rgba(10, 0, 30, 0.11)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
      }

      connectRadiation();

      // Occasional extra radiation burst
      if (Math.random() < 0.28) {
        for (let i = 0; i < 6; i++) {
          particles.push(new Particle());
        }
      }

      requestAnimationFrame(animate);
    }
    animate();

    // Auto refresh key
    setInterval(() => {
      fetch('/key')
        .then(res => res.json())
        .then(data => {
          const keyEl = document.getElementById('topKey');
          // Keep the label and replace only the key part
          keyEl.innerHTML = '<span class="top-key-label">KEY:</span> ' + data.key;
        })
        .catch(() => {});
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
