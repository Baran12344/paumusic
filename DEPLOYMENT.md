# 🚀 Deployment Rehberi

PauMusic botunu farklı platformlarda nasıl deploy edeceğinizi öğrenin.

## 🌐 Render.com (Önerilen - Ücretsiz)

### 1-Click Deploy
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Baran12344/paumusic)

### Manuel Deploy
1. [Render.com](https://render.com) hesabı oluşturun
2. **New Web Service** seçin
3. GitHub repository'nizi bağlayın
4. Ayarları yapın:
   \`\`\`
   Name: paumusic-bot
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   \`\`\`
5. Environment Variables ekleyin:
   \`\`\`
   DISCORD_TOKEN=your_bot_token
   SPOTIFY_CLIENT_ID=your_spotify_id
   SPOTIFY_CLIENT_SECRET=your_spotify_secret
   \`\`\`
6. **Create Web Service** tıklayın

## 🚂 Railway.app

1. [Railway.app](https://railway.app) hesabı oluşturun
2. **Deploy from GitHub** seçin
3. Repository'yi seçin
4. Environment variables ekleyin
5. Deploy edin

## 🟣 Heroku (Ücretli)

1. [Heroku](https://heroku.com) hesabı oluşturun
2. **Create new app**
3. GitHub'dan deploy edin
4. Config vars ekleyin
5. Deploy edin

## 🐳 Docker

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

\`\`\`bash
docker build -t paumusic .
docker run -p 3000:3000 \
  -e DISCORD_TOKEN=your_token \
  -e SPOTIFY_CLIENT_ID=your_id \
  -e SPOTIFY_CLIENT_SECRET=your_secret \
  paumusic
\`\`\`

## 🖥️ VDS/VPS

### Ubuntu/Debian
\`\`\`bash
# Node.js kurulumu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# FFmpeg kurulumu
sudo apt install ffmpeg -y

# PM2 kurulumu
sudo npm install -g pm2

# Projeyi klonla
git clone https://github.com/Baran12344/paumusic.git
cd paumusic

# Bağımlılıkları yükle
npm install

# Environment variables ayarla
cp .env.example .env
nano .env

# PM2 ile başlat
pm2 start ecosystem.config.js
pm2 save
pm2 startup
\`\`\`

## 🔧 Environment Variables

Tüm platformlarda şu environment variables'ları ayarlamanız gerekir:

\`\`\`
DISCORD_TOKEN=MTIzNDU2Nzg5MDEyMzQ1Njc4OTA...
SPOTIFY_CLIENT_ID=1a2b3c4d5e6f7g8h9i0j...
SPOTIFY_CLIENT_SECRET=a1b2c3d4e5f6g7h8i9j0...
\`\`\`

## 🐛 Sorun Giderme

### Build Hatası
- Node.js 18+ kullandığınızdan emin olun
- `npm install` komutunun başarılı olduğunu kontrol edin

### Runtime Hatası
- Environment variables'ların doğru ayarlandığını kontrol edin
- Bot token'ının geçerli olduğunu kontrol edin
- Spotify API credentials'larını kontrol edin

### FFmpeg Hatası
- Hosting platformunun FFmpeg desteği olduğunu kontrol edin
- Render.com ve Railway.app otomatik olarak FFmpeg sağlar

## 📊 Monitoring

### Health Check
- `GET /health` - Bot durumu
- `GET /ping` - Ping kontrolü
- `GET /` - Web interface

### Logs
\`\`\`bash
# Render.com
Render Dashboard → Logs

# Railway.app
Railway Dashboard → Logs

# PM2
pm2 logs paumusic-bot
\`\`\`

## 🔄 Auto-Deploy

GitHub Actions ile otomatik deployment:

\`\`\`yaml
name: Deploy to Render
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Deploy to Render
      run: echo "Auto-deploy configured"
\`\`\`

## 💡 İpuçları

1. **Free Tier Limits**: Ücretsiz planların sınırlarını bilin
2. **Keep-Alive**: Express server bot'un uyumasını engeller
3. **Environment Variables**: Güvenlik için config dosyası kullanmayın
4. **Monitoring**: Bot durumunu düzenli kontrol edin
5. **Backup**: Önemli verileri yedekleyin

## 📞 Destek

Deployment sorunları için:
- [GitHub Issues](https://github.com/Baran12344/paumusic/issues)
- [Discord Sunucusu](https://discord.gg/your-server)

Happy Deploying! 🚀
