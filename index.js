// index.js
const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const KEY_LENGTH = 30;
const CHARS = 'qwerztzuioQWRZUOPASDLKHFGYXCDVNMpasdf$@ghjklycvbnm1.9123456789+';

let currentKey = generateKey(KEY_LENGTH);
console.log("Initial key: " + currentKey);

// generate a random key
function generateKey(length) {
  const bytes = crypto.randomBytes(length);
  let key = '';
  for (let i = 0; i < length; i++) {
    key += CHARS[bytes[i] % CHARS.length];
  }
  return key;
}

// schedule alignment: wait until next exact minute, then rotate every 60s
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

// JSON endpoint - returns current key
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

// root: dark UI with blue-purple falling snow, no text glow, no lightning
app.get('/', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');

  const htmlParts = [
    '<!doctype html>',
    '<html>',
    '<head>',
    '<meta charset="utf-8"/>',
    '<meta http-equiv="refresh" content="60">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    '<title>Current Key</title>',
    '<style>',
    '  :root {',
    '    --bg-dark: #05050a;',
    '    --panel-bg: rgba(12,6,30,0.6);',
    '    --accent-1: #7aa2ff; /* light blue */',
    '    --accent-2: #9b6bff; /* purple */',
    '    --accent-mix: linear-gradient(135deg, #7aa2ff 0%, #9b6bff 100%);',
    '  }',
    '  html,body{ height:100%; }',
    '  body {',
    '    margin: 0;',
    '    height: 100vh;',
    '    display: flex;',
    '    align-items: center;',
    '    justify-content: center;',
    '    background: var(--bg-dark);',
    '    overflow: hidden;',
    '    font-family: "Courier New", Courier, monospace;',
    '    color: #dfe8ff;',
    '  }',
    '  /* snow container sits behind the panel */',
    '  .snow {',
    '    position: absolute;',
    '    inset: 0;',
    '    z-index: 5;',
    '    pointer-events: none;',
    '    overflow: hidden;',
    '  }',
    '  .flake {',
    '    position: absolute;',
    '    top: -10vh;',
    '    border-radius: 50%;',
    '    will-change: transform, opacity;',
    '    box-shadow: 0 0 6px rgba(255,255,255,0.06) inset;',
    '    background: radial-gradient(circle at 30% 30%, var(--accent-1), var(--accent-2));',
    '    opacity: 0.85;',
    '    filter: blur(0.2px);',
    '    animation-name: fall;',
    '    animation-timing-function: linear;',
    '    animation-iteration-count: infinite;',
    '  }',
    '  @keyframes fall {',
    '    0% { transform: translateY(-10vh) translateX(0) rotate(0deg); }',
    '    50% { transform: translateY(50vh) translateX(20px) rotate(180deg); }',
    '    100% { transform: translateY(120vh) translateX(-10px) rotate(360deg); }',
    '  }',
    '  /* center panel */',
    '  .box {',
    '    position: relative;',
    '    z-index: 10;',
    '    text-align: center;',
    '    padding: 28px 48px;',
    '    border-radius: 12px;',
    '    background: var(--panel-bg);',
    '    box-shadow: 0 8px 30px rgba(0,0,0,0.6);',
    '    border: 1px solid rgba(255,255,255,0.03);',
    '    min-width: 320px;',
    '    max-width: 92vw;',
    '  }',
    '  .title {',
    '    font-size: 0.9rem;',
    '    color: rgba(220,230,255,0.9);',
    '    margin-bottom: 10px;',
    '    letter-spacing: 1px;',
    '  }',
    '  .key {',
    '    font-size: 2.6rem;',
    '    letter-spacing: 6px;',
    '    font-weight: 700;',
    '    color: #dfe8ff;', /* plain color, no glow */',
    '  }',
    '  .time {',
    '    margin-top: 0.6rem;',
    '    color: rgba(200,210,255,0.8);',
    '    font-size: 0.95rem;',
    '  }',
    '  .note {',
    '    margin-top: 0.9rem;',
    '    color: rgba(170,170,210,0.8);',
    '    font-size: 0.82rem;',
    '  }',
    '  /* small responsive tweaks */',
    '  @media (max-width:420px){',
    '    .key { font-size: 1.6rem; letter-spacing: 4px; }',
    '    .box { padding: 20px 22px; }',
    '  }',
    '</style>',
    '</head>',
    '<body>',
    '  <div class="snow" id="snow"></div>',
    '  <div class="box" role="main" aria-live="polite">',
    '    <div class="title">Current Key</div>',
    '    <div class="key">' + currentKey + '</div>',
    '    <div class="time">Generated at: ' + new Date().toISOString() + '</div>',
    '    <div class="note">Key for Kryth C.</div>',
    '  </div>',
    '  <script>',
    '    (function(){',
    '      const snowRoot = document.getElementById("snow");',
    '      const flakes = 70; // number of flakes',
    '      for (let i = 0; i < flakes; i++) {',
    '        const f = document.createElement("div");',
    '        f.className = "flake";',
    '        // randomized size',
    '        const size = Math.floor(Math.random() * 12) + 6; // 6px - 18px',
    '        f.style.width = size + "px";',
    '        f.style.height = size + "px";',
    '        // left start',
    '        f.style.left = Math.random() * 100 + "%";',
    '        // speed and delay randomization',
    '        const duration = 8 + Math.random() * 10; // 8s - 18s',
    '        const delay = Math.random() * -12; // start some already falling',
    '        f.style.animationDuration = duration + "s";',
    '        f.style.animationDelay = delay + "s";',
    '        // depth via opacity and blur',
    '        f.style.opacity = 0.5 + Math.random() * 0.6;',
    '        const blur = Math.random() * 1.6; // 0 - 1.6px',
    '        f.style.filter = "blur(" + blur + "px)";',
    '        // slight rotation and scale variation',
    '        const scale = 0.8 + Math.random() * 0.9;',
    '        f.style.transform = "scale(" + scale + ") translateY(-10vh)";',
    '        // color variation via background gradient angle',
    '        const angle = Math.floor(Math.random() * 360);',
    '        f.style.background = "radial-gradient(circle at 30% 30%, rgba(122,162,255,0.98), rgba(155,107,255,0.92))";',
    '        // append',
    '        snowRoot.appendChild(f);',
    '      }',
    '      // update key in page every 60s without refresh (optional)',
    '      function refreshKeyDisplay(){',
    '        fetch("/key").then(r => r.json()).then(j => {',
    '          const el = document.querySelector(".key");',
    '          const t = document.querySelector(".time");',
    '          if(el && j.key){ el.textContent = j.key; }',
    '          if(t && j.generatedAt){ t.textContent = "Generated at: " + j.generatedAt; }',
    '        }).catch(()=>{});',
    '      }',
    '      setInterval(refreshKeyDisplay, 60000);',
    '    })();',
    '  </script>',
    '</body>',
    '</html>'
  ];

  res.send(htmlParts.join('\n'));
});

app.listen(PORT, () => {
  console.log("Key service listening on port " + PORT);
  scheduleKeyRotation();
});
