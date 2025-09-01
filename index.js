// index.js
const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const KEY_LENGTH = 20;
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // uppercase letters + digits

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

// HTTP endpoint that returns the current key
app.get('/key', (req, res) => {
  // prevent caches and allow cross-origin requests
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
  res.send('Key generator service is running. GET /key for current key.');
});

app.listen(PORT, () => {
  console.log(`Key service listening on port ${PORT}`);
  scheduleKeyRotation();
});
