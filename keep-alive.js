const express = require("express")
const app = express()

// Health check endpoint
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>🎵 PauMusic Bot</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                margin: 0;
                padding: 50px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: rgba(255,255,255,0.1);
                padding: 40px;
                border-radius: 20px;
                backdrop-filter: blur(10px);
            }
            h1 { font-size: 3em; margin-bottom: 20px; }
            .status { 
                background: #4CAF50; 
                padding: 10px 20px; 
                border-radius: 25px; 
                display: inline-block;
                margin: 20px 0;
            }
            .features {
                text-align: left;
                margin: 30px 0;
            }
            .feature {
                margin: 10px 0;
                padding: 10px;
                background: rgba(255,255,255,0.1);
                border-radius: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎵 PauMusic Bot</h1>
            <div class="status">✅ Bot is Online!</div>
            
            <div class="features">
                <div class="feature">🎵 YouTube Music Support</div>
                <div class="feature">🎧 Spotify Playlists</div>
                <div class="feature">📻 10+ Radio Stations</div>
                <div class="feature">🌍 Multilingual (TR/EN)</div>
                <div class="feature">🗳️ Top.gg Voting System</div>
            </div>
            
            <p><strong>Uptime:</strong> ${Math.floor(process.uptime() / 60)} minutes</p>
            <p><strong>Memory:</strong> ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB</p>
            <p><strong>Node.js:</strong> ${process.version}</p>
            
            <p>
                <a href="https://github.com/Baran12344/paumusic" style="color: #FFD700;">
                    📚 GitHub Repository
                </a>
            </p>
        </div>
    </body>
    </html>
  `)
})

app.get("/ping", (req, res) => {
  res.json({
    status: "alive",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version,
  })
})

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "paumusic-discord-bot",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime() / 60)} minutes`,
  })
})

const PORT = process.env.PORT || 3000

function startKeepAlive() {
  app.listen(PORT, () => {
    console.log(`🌐 Keep-alive server running on port ${PORT}`)
    console.log(`🔗 Health check: http://localhost:${PORT}/ping`)
  })
}

module.exports = { startKeepAlive }
