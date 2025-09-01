// index.js
const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const KEY_LENGTH = 30;
const CHARS = 'qwerztzuioQWRZUOPASDLKHFGYXCDVNMpasdf$@ghjklycvbnm1.9123456789+';

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

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Current Key</title>
<style>
body {
  margin: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #05050a;
  overflow: hidden;
  font-family: "Courier New", monospace;
  color: #dfe8ff;
}

/* Glowing box */
.box {
  text-align: center;
  padding: 28px 48px;
  border-radius: 12px;
  background: rgba(12,6,30,0.6);
  border: 2px solid rgba(0,150,255,0.7);
  animation: glowAnim 2s infinite alternate;
  min-width: 320px;
  max-width: 92vw;
}
@keyframes glowAnim {
  0% { box-shadow: 0 0 12px #00f0ff, 0 0 25px #0088ff; }
  50% { box-shadow: 0 0 25px #00f0ff, 0 0 40px #00b0ff; }
  100% { box-shadow: 0 0 12px #00f0ff, 0 0 25px #0088ff; }
}

.key { font-size: 2.6rem; letter-spacing: 6px; font-weight: 700; }
.time { margin-top: 0.6rem; color: rgba(200,210,255,0.8); font-size: 0.95rem; }
.note { margin-top: 0.9rem; color: rgba(170,170,210,0.8); font-size: 0.82rem; }

/* Snow */
.snow { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
.flake { position: absolute; top: -10vh; border-radius: 50%; background: radial-gradient(circle at 30% 30%, rgba(122,162,255,0.98), rgba(155,107,255,0.92)); opacity: 0.85; filter: blur(0.2px); animation-name: fall; animation-timing-function: linear; animation-iteration-count: infinite; width: 8px; height: 8px; }
@keyframes fall { 0% { transform: translateY(-10vh); } 100% { transform: translateY(120vh); } }

/* Modern music player */
.controls { margin-top: 20px; z-index: 10; display: flex; gap: 12px; align-items: center; justify-content: center; }
.btn { padding: 10px 22px; border: none; border-radius: 12px; background: linear-gradient(135deg, #00f0ff, #0088ff); color: #fff; font-weight: bold; cursor: pointer; transition: 0.3s all; box-shadow: 0 0 10px rgba(0,200,255,0.6); }
.btn:hover { box-shadow: 0 0 20px #00b0ff; transform: scale(1.05); }
.slider { -webkit-appearance: none; width: 120px; height: 8px; background: linear-gradient(135deg, #00f0ff, #0088ff); border-radius: 8px; outline: none; cursor: pointer; transition: 0.2s; }
.slider::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #fff; border: 2px solid #0088ff; cursor: pointer; transition: 0.2s;}
.slider::-webkit-slider-thumb:hover { background: #00f0ff; border-color: #00b0ff; }
.slider::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: #fff; border: 2px solid #0088ff; cursor: pointer; transition: 0.2s; }
.slider::-moz-range-thumb:hover { background: #00f0ff; border-color: #00b0ff; }

/* Discord button */
.discord-btn { position: fixed; top:16px; left:16px; width:50px; height:50px; background: linear-gradient(135deg, #7289da, #99aaff); border-radius: 12px; display:flex; align-items:center; justify-content:center; text-decoration:none; transition:0.3s all; box-shadow: 0 0 12px #7289da, 0 0 25px #99aaff; z-index:15; }
.discord-btn:hover { transform: scale(1.1); box-shadow:0 0 20px #99aaff,0 0 35px #7289da; }
.discord-btn img { width:28px; height:28px; }

</style>
</head>
<body>
<div class="snow" id="snow"></div>

<a class="discord-btn" href="https://discord.gg/Nt6fkTU2Au" target="_blank">
  <img src="https://cdn-icons-png.flaticon.com/512/2111/2111370.png"/>
</a>

<div class="box">
  <div class="key">${currentKey}</div>
  <div class="time" id="currentTime">Name: Kryth C. | Time: --:--:--</div>
  <div class="note">Refresh page if key is wrong.</div>
</div>

<div class="controls">
  <button class="btn" onclick="togglePlay()">Play / Pause</button>
  <input type="range" class="slider" id="volumeSlider" min="0" max="100" value="50" onchange="setVolume(this.value)">
</div>

<audio id="music" autoplay loop>
  <source src="https://www.youtube.com/watch?v=uPhUOMKa5cM" type="audio/mp3">
  Your browser does not support the audio element.
</audio>

<script>
const music = document.getElementById("music");
function togglePlay() {
  if(music.paused) music.play();
  else music.pause();
}
function setVolume(val) { music.volume = val / 100; }

// Update time
function updateTime() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString();
  document.getElementById("currentTime").innerText = "Name: Kryth C. | Time: " + timeStr;
}
setInterval(updateTime, 1000);

// Snow animation
const snowRoot = document.getElementById("snow");
for(let i=0;i<70;i++){
  const f = document.createElement("div");
  f.className = "flake";
  f.style.left = Math.random()*100+"%";
  const duration = 8 + Math.random()*10;
  f.style.animationDuration = duration+"s";
  f.style.animationDelay = (Math.random()*-12)+"s";
  const size = 6 + Math.random()*12;
  f.style.width = size+"px";
  f.style.height = size+"px";
  f.style.opacity = 0.5 + Math.random()*0.6;
  f.style.filter = "blur(" + Math.random()*1.6 + "px)";
  snowRoot.appendChild(f);
}
</script>
</body>
</html>
`;

  res.send(html);
});

app.listen(PORT, () => {
  console.log("Key service listening on port " + PORT);
  scheduleKeyRotation();
});
