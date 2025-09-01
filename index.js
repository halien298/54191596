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
  // disable caching
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

// root: pretty HTML that refreshes every 60s
app.get('/', (req, res) => {
  // disable caching
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
          body { background:#0b0b0b; color:#e6ffcc; font-family: "Courier New", Courier, monospace;
                 display:flex; align-items:center; justify-content:center; height:100vh; margin:0; }
          .box { text-align:center; padding:20px; border-radius:8px; box-shadow: 0 8px 30px rgba(0,0,0,0.6); }
          .key { font-size:2.4rem; letter-spacing:6px; font-weight:700; }
          .time { margin-top:0.6rem; color:#99a; font-size:0.9rem; }
          .note { margin-top:1rem; color:#888; font-size:0.8rem; }
        </style>
      </head>
      <body>
        <div class="box">
          <div class="key">${currentKey}</div>
          <div class="time">Generated at: ${new Date().toISOString()}</div>
          <div class="note">Auto-refreshes every 60s. Use <code>/key</code> for JSON.</div>
        </div>
      </body>
    </html>
  `;
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Key service listening on port ${PORT}`);
  scheduleKeyRotation();
});
