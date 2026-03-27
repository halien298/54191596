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
      background: linear-gradient(180deg, #1a0033, #330066, #ff00aa);
      font-family: 'VT323', monospace;
      color: #ffccff;
      position: relative;
    }

    /* Vaporwave Background */
    .bg-grid {
      position: absolute;
      inset: 0;
      background: 
        linear-gradient(rgba(255,0,255,0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,255,255,0.08) 1px, transparent 1px);
      background-size: 50px 50px;
      pointer-events: none;
      z-index: 1;
    }

    .sunset {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 30%, rgba(255,100,200,0.4), transparent 70%);
      z-index: 2;
      animation: sunsetPulse 20s infinite alternate;
    }

    @keyframes sunsetPulse {
      0% { opacity: 0.6; }
      100% { opacity: 1; }
    }

    /* Top Right Key */
    .top-key {
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0,0,0,0.7);
      padding: 12px 24px;
      border: 3px solid #ff00ff;
      border-radius: 8px;
      font-size: 1.8rem;
      letter-spacing: 4px;
      z-index: 100;
      box-shadow: 0 0 20px #ff00ff;
      text-shadow: 0 0 10px #ff00ff;
    }

    /* Center Box */
    .box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      padding: 40px 60px;
      background: rgba(10, 5, 40, 0.85);
      border: 4px solid #ff00ff;
      border-radius: 15px;
      z-index: 10;
      box-shadow: 0 0 40px #ff00ff, 0 0 80px rgba(255,0,255,0.5);
      min-width: 420px;
    }

    .key-center {
      font-size: 3.2rem;
      letter-spacing: 8px;
      font-weight: bold;
      text-shadow: 0 0 15px #ff00ff, 0 0 30px #aa00ff;
      margin-bottom: 15px;
    }

    .time {
      font-size: 1.4rem;
      color: #ccffcc;
      margin-bottom: 10px;
    }

    .note {
      font-size: 1.1rem;
      color: #ffccff;
      opacity: 0.9;
    }

    /* Radiation Particle Canvas */
    #particleCanvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 3;
      pointer-events: none;
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
      box-shadow: 0 0 30px rgba(30, 215, 96, 0.8);
    }

    .spotify-mini {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(30, 215, 96, 0.6);
      opacity: 0.95;
    }

    .discord-btn {
      position: fixed;
      top: 20px;
      left: 20px;
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #7289da, #5865f2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      box-shadow: 0 0 25px #7289da;
      transition: all 0.3s;
      z-index: 100;
    }

    .discord-btn:hover {
      transform: scale(1.15) rotate(10deg);
      box-shadow: 0 0 40px #99aaff;
    }

    .discord-btn img {
      width: 34px;
      height: 34px;
    }
  </style>
</head>
<body>

  <div class="bg-grid"></div>
  <div class="sunset"></div>
  
  <!-- Radiation Particle Canvas (dots + lines that follow cursor and react) -->
  <canvas id="particleCanvas"></canvas>

  <!-- Top Right Key -->
  <div class="top-key" id="topKey">${currentKey}</div>

  <!-- Discord Button -->
  <a class="discord-btn" href="https://discord.gg/AAnmrCTRk6" target="_blank">
    <img src="https://cdn-icons-png.flaticon.com/512/2111/2111370.png" alt="Discord">
  </a>

  <div class="box">
    <div class="key-center" id="centerKey">${currentKey}</div>
    <div class="time" id="currentTime">Time: --:--:--</div>
    <div class="note">Key changes every minute • Music starts automatically</div>

    <!-- Spotify Players - Music plays on visit + more songs added -->
    <div class="spotify-container">
      <!-- Main track - auto plays on visit -->
      <div class="spotify-main">
        <iframe style="border-radius:12px" 
                src="https://open.spotify.com/embed/track/7LKfKpO56W1l3AUbfiwAeF?utm_source=generator" 
                width="100%" 
                height="152" 
                frameBorder="0" 
                allowfullscreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
        </iframe>
      </div>

      <!-- Additional songs (more tracks added) -->
      <div class="spotify-mini">
        <iframe style="border-radius:12px" 
                src="https://open.spotify.com/embed/track/6kexauPCWYPmDtmHzDf3Hw?utm_source=generator" 
                width="100%" 
                height="80" 
                frameBorder="0" 
                allowfullscreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
        </iframe>
      </div>

      <div class="spotify-mini">
        <iframe style="border-radius:12px" 
                src="https://open.spotify.com/embed/track/2ZuMOcabaMzyXPPjFoYQGe?utm_source=generator" 
                width="100%" 
                height="80" 
                frameBorder="0" 
                allowfullscreen="" 
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

    // Radiation environment particle system (dots + glowing lines that follow cursor)
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let intensity = 1; // for music-sync pulse effect

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4.5;
        this.vy = (Math.random() - 0.5) * 4.5;
        this.size = Math.random() * 4 + 2.5;
        this.life = 110 + Math.random() * 40;
        this.color = Math.random() > 0.5 ? '#00ffff' : '#ff00ff';
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.975;
        this.vy *= 0.975;
        this.life -= 1.2;
        this.size *= 0.99;
      }
      draw() {
        ctx.shadowBlur = 14 * intensity;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life / 120;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Resize canvas
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Mouse movement - spawn radiation particles + lines
    document.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      // Spawn many particles at cursor for "following" effect
      for (let i = 0; i < 7; i++) {
        particles.push(new Particle(mouse.x, mouse.y));
      }
    });

    // Connect particles with glowing lines (radiation network)
    function connect() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.hypot(dx, dy);
          
          if (distance < 155) {
            ctx.strokeStyle = `rgba(0, 255, 255, ${(1 - distance / 155) * 0.9})`;
            ctx.lineWidth = 1.8 * intensity;
            ctx.shadowBlur = 18 * intensity;
            ctx.shadowColor = '#00ffff';
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    // Fake music sync pulse (lines and glow get stronger on beat)
    setInterval(() => {
      intensity = 2.2;
      setTimeout(() => { intensity = 1; }, 180);
    }, 420); // ~142 BPM feel - matches the energy of the tracks

    // Animation loop
    function animate() {
      // Soft trail fade for radiation glow
      ctx.fillStyle = 'rgba(26, 0, 51, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update & draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) particles.splice(i, 1);
      }

      connect();

      // Extra random radiation particles for "more and more" effect
      if (Math.random() < 0.35) {
        const rx = Math.random() * canvas.width;
        const ry = Math.random() * canvas.height;
        particles.push(new Particle(rx, ry));
      }

      requestAnimationFrame(animate);
    }
    animate();

    // Auto-refresh key display
    setInterval(() => {
      fetch('/key')
        .then(res => res.json())
        .then(data => {
          document.getElementById('topKey').textContent = data.key;
          document.getElementById('centerKey').textContent = data.key;
        })
        .catch(() => {});
    }, 5000);
  </script>
</body>
</html>`;

  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Idiot's Playground running on port ${PORT}`);
  scheduleKeyRotation();
});
