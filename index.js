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

  res.json({
    key: currentKey,
    generatedAt: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');

  const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<meta http-equiv="refresh" content="60">
<title>Current Key</title>
<style>
body {
  margin: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #05050a;
  overflow: hidden;
  font-family: "Courier New", Courier, monospace;
  color: #dfe8ff;
}

.box {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 28px 48px;
  border-radius: 12px;
  background: rgba(12,6,30,0.6);
  border: 1px solid rgba(255,255,255,0.03);
  min-width: 320px;
  max-width: 92vw;
  animation: glowAnim 2.5s infinite alternate;
}

@keyframes glowAnim {
  0% {
    box-shadow: 0 0 15px #ff69b4, 0 0 30px #d67fff, 0 8px 30px rgba(0,0,0,0.6);
  }
  50% {
    box-shadow: 0 0 25px #ff85d0, 0 0 40px #bb33ff, 0 8px 30px rgba(0,0,0,0.6);
  }
  100% {
    box-shadow: 0 0 15px #ff69b4, 0 0 30px #d67fff, 0 8px 30px rgba(0,0,0,0.6);
  }
}

.key {
  font-size: 2.6rem;
  letter-spacing: 6px;
  font-weight: 700;
  color: #dfe8ff;
}

.time {
  margin-top: 0.6rem;
  color: rgba(200,210,255,0.8);
  font-size: 0.95rem;
}

.note {
  margin-top: 0.9rem;
  color: rgba(170,170,210,0.8);
  font-size: 0.82rem;
}

.snow {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  overflow: hidden;
}

.flake {
  position: absolute;
  top: -10vh;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(122,162,255,0.98), rgba(155,107,255,0.92));
  opacity: 0.85;
  filter: blur(0.2px);
  animation-name: fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  width: 8px;
  height: 8px;
}

@keyframes fall {
  0% { transform: translateY(-10vh); }
  100% { transform: translateY(120vh); }
}

/* Controls */
.controls {
  margin-top: 20px;
  z-index: 10;
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn {
  padding: 10px 22px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff69b4, #d67fff);
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s all;
  box-shadow: 0 0 10px rgba(214,127,255,0.6), 0 0 20px rgba(255,105,180,0.6);
}

.btn:hover {
  box-shadow: 0 0 20px #ff85d0, 0 0 35px #bb33ff;
  transform: scale(1.05);
}

.slider {
  -webkit-appearance: none;
  width: 120px;
  height: 8px;
  background: linear-gradient(135deg, #ff69b4, #d67fff);
  border-radius: 8px;
  outline: none;
  cursor: pointer;
  transition: 0.2s;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #d67fff;
  cursor: pointer;
  transition: 0.2s;
}

.slider::-webkit-slider-thumb:hover {
  background: #ff69b4;
  border-color: #ff85d0;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #d67fff;
  cursor: pointer;
  transition: 0.2s;
}

.slider::-moz-range-thumb:hover {
  background: #ff69b4;
  border-color: #ff85d0;
}
</style>
</head>
<body>
<div class="snow" id="snow"></div>
<div class="box">
  <div class="key">${currentKey}</div>
  <div class="time">Generated at: ${new Date().toISOString()}</div>
  <div class="note">Key for Kryth C.</div>
</div>

<div class="controls">
  <button class="btn" onclick="togglePlay()">Play / Pause</button>
  <input type="range" class="slider" id="volumeSlider" min="0" max="100" value="50" onchange="setVolume(this.value)">
</div>

<iframe id="ytPlayer" width="0" height="0"
  src="https://www.youtube.com/embed/Bah5yfKPDB4?enablejsapi=1&autoplay=1&loop=1&playlist=Bah5yfKPDB4"
  frameborder="0" allow="autoplay; encrypted-media"></iframe>

<script src="https://www.youtube.com/iframe_api"></script>
<script>
let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('ytPlayer', {
    events: { 'onReady': onPlayerReady }
  });
}
function onPlayerReady(event) {
  player.setVolume(50);
  player.playVideo();
}
function togglePlay() {
  const state = player.getPlayerState();
  if (state === YT.PlayerState.PLAYING) player.pauseVideo();
  else player.playVideo();
}
function setVolume(value) {
  player.setVolume(value);
}

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
