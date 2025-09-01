// index.js
const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const KEY_LENGTH = 30;
const CHARS = 'qwerztzuioQWRZUOPASDLKHFGYXCDVNMpasdf$@ghjklycvbnm1.9123456789+';

let currentKey = generateKey(KEY_LENGTH);
console.log(`[${new Date().toISOString()}] Initial key: ${currentKey}`);

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
    rotateKey(); // rotate on the minute
    setInterval(rotateKey, 60000); // then every minute
  }, msUntilNextMinute);
}

function rotateKey() {
  currentKey = generateKey(KEY_LENGTH);
  console.log(`[${new Date().toISOString()}] New key: ${currentKey}`);
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

// root: dark UI with glowing magenta key and lightning effects
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
          align-items: center;
          justify-content: center;
          background: #0b0b0b;
          overflow: hidden;
          font-family: "Courier New", Courier, monospace;
        }

        .lightning {
          position: absolute;
          width: 2px;
          height: 100%;
          background: linear-gradient(to bottom, #ff00ff 0%, transparent 80%);
          opacity: 0;
          animation: strike 0.3s linear infinite;
        }

        @keyframes strike {
          0%, 80%, 100% { opacity: 0; transform: translateX(0); }
          10%, 20% { opacity: 1; transform: translateX(calc(var(--pos) * 1vw)); }
        }

        .flash {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0; left: 0;
          background: #ff00ff10;
          opacity: 0;
          pointer-events: none;
          animation: flash 5s infinite;
        }

        @keyframes flash {
          0%, 90%, 100% { opacity: 0; }
          5%, 10% { opacity: 0.15; }
          20%, 25% { opacity: 0.08; }
        }

        .box {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 30px 50px;
          border-radius: 12px;
          background: rgba(20, 0, 20, 0.6);
          box-shadow: 0 0 20px #ff00ff, 0 0 40px #ff00ff55, 0 0 60px #ff00ff33;
          border: 2px solid #ff00ff;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 20px #ff00ff, 0 0 40px #ff00ff55, 0 0 60px #ff00ff33; }
          50% { box-shadow: 0 0 35px #ff00ff, 0 0 70px #ff00ff88, 0 0 100px #ff00ff55; }
        }

        .key {
          font-size: 3rem;
          letter-spacing: 6px;
          font-weight: 700;
          color: #ff00ff;
          text-shadow:
            0 0 5px #ff00ff,
            0 0 10px #ff00ff,
            0 0 20px #ff00ff,
            0 0 40px #ff00ff;
          animation: glow 2s infinite alternate;
        }

        @keyframes glow {
          0% { text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff; }
          50% { text-shadow: 0 0 20px #ff00ff, 0 0 40px #ff00ff, 0 0 80px #ff00ff; }
          100% { text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff; }
        }

        .time {
          margin-top: 0.6rem;
          color: #ff99ffaa;
          font-size: 1rem;
        }

        .note {
          margin-top: 1rem;
          color: #ff99ff88;
          font-size: 0.85rem;
        }
      </style>
    </head>
    <body>
      <div class="flash"></div>
      <div class="box">
        <div class="key">${currentKey}</div>
        <div class="time">Generated at: ${new Date().toISOString()}</div>
        <div class="note">Key<code></code> for Kryth C.</div>
      </div>

      <script>
        for(let i=0;i<6;i++){
          const strike = document.createElement('div');
          strike.className = 'lightning';
          strike.style.setProperty('--pos', Math.random() * 100);
          strike.style.animationDelay = (Math.random()*5)+'s';
          document.body.appendChild(strike);
        }
      </script>
    </body>
  </html>
  `;
  res.send(html);
});

app.listen(PORT, () => {
  console.log(\`Key service listening on port \${PORT}\`);
  scheduleKeyRotation();
});
