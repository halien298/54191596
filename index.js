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
        /* Dark background with animated magenta lightning */
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

        /* Lightning strike effect */
        .lightning {
          position: absolute;
          width: 2px;
          height: 100%;
          background: linear-gradient(to bottom, #ff00ff 0%, transparent 80%);
          opacity: 0;
          animation: strike 1s infinite;
        }

        @keyframes strike {
          0%, 90%, 100% { opacity: 0; transform: translateX(0); }
          10%, 20% { opacity: 1; transform: translateX(calc(var(--pos) * 1vw)); }
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
      <div class="box">
        <div class="key">${currentKey}</div>
        <div class="time">Generated at: ${new Date().toISOString()}</div>
        <div class="note">Key<code></code> for Kryth C.</div>
      </div>

      <script>
        // generate multiple lightning strikes
        for(let i=0;i<5;i++){
          const strike = document.createElement('div');
          strike.className = 'lightning';
          strike.style.setProperty('--pos', Math.random() * 100);
          strike.style.animationDelay = (Math.random()*2)+'s';
          document.body.appendChild(strike);
        }
      </script>
    </body>
  </html>
  `;
  res.send(html);
});
