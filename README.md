# 🎵 PauMusic - Discord Müzik Botu

[![GitHub stars](https://img.shields.io/github/stars/Baran12344/paumusic?style=social)](https://github.com/Baran12344/paumusic)
[![GitHub forks](https://img.shields.io/github/forks/Baran12344/paumusic?style=social)](https://github.com/Baran12344/paumusic)
[![GitHub issues](https://img.shields.io/github/issues/Baran12344/paumusic)](https://github.com/Baran12344/paumusic/issues)
[![License](https://img.shields.io/github/license/Baran12344/paumusic)](https://github.com/Baran12344/paumusic/blob/main/LICENSE)
[![Deploy to Render](https://img.shields.io/badge/Deploy%20to-Render-46E3B7.svg)](https://render.com/deploy?repo=https://github.com/Baran12344/paumusic)

YouTube, Spotify ve **Radyo** desteği olan gelişmiş Discord müzik botu. **Çok dilli destek** ve **Top.gg entegrasyonu** ile!

## ✨ Özellikler

- 🎵 **YouTube müzik çalma** (URL ve arama)
- 🎧 **Spotify şarkı ve playlist** desteği
- 📻 **10+ Radyo İstasyonu** (Butonlarla seçim)
- 🌍 **Çok dilli destek** (Türkçe/İngilizce)
- 📋 **Müzik kuyruğu** sistemi
- 📊 **Detaylı bot istatistikleri**
- ⚡ **Modern Slash Komutları** (/)
- 🗳️ **Top.gg Voting Sistemi**
- 🎨 **Güzel embed tasarımları**
- 🔄 **Otomatik yeniden başlatma**

## 🚀 Hızlı Deployment

### 1-Click Deploy (Önerilen)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Baran12344/paumusic)

### Manuel Kurulum

#### 1. Repository'yi Fork/Clone Edin
\`\`\`bash
git clone https://github.com/Baran12344/paumusic.git
cd paumusic
\`\`\`

#### 2. Bağımlılıkları Yükleyin
\`\`\`bash
npm install
\`\`\`

#### 3. Environment Variables Ayarlayın
\`\`\`bash
# .env dosyası oluşturun
DISCORD_TOKEN=your_discord_bot_token
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
\`\`\`

#### 4. Botu Başlatın
\`\`\`bash
npm start
\`\`\`

## 🌐 Hosting Platformları

### Render.com (Önerilen - Ücretsiz)
1. [Render.com](https://render.com) hesabı oluşturun
2. **New Web Service** seçin
3. Bu repository'yi bağlayın
4. Environment variables ekleyin
5. Deploy edin!

### Railway.app (Alternatif)
1. [Railway.app](https://railway.app) hesabı oluşturun
2. **Deploy from GitHub** seçin
3. Repository'yi seçin
4. Environment variables ekleyin

### Heroku (Ücretli)
1. [Heroku](https://heroku.com) hesabı oluşturun
2. **Create new app**
3. GitHub'dan deploy edin

## 📝 Komutlar

| Komut | Açıklama |
|-------|----------|
| `/play <şarkı/URL>` | YouTube veya Spotify müziği çalar |
| `/radio` | **Radyo istasyonları menüsünü açar** |
| `/stop` | Müziği durdurur ve kuyruğu temizler |
| `/skip` | Mevcut şarkıyı atlar |
| `/queue` | Müzik kuyruğunu gösterir |
| `/stats` | Bot istatistiklerini gösterir |
| `/ping` | Bot pingini gösterir |
| `/oy` / `/vote` | **Top.gg'de oy ver ve 12 saat kesintisiz kullan** |
| `/dil` / `/language` | **Bot dilini değiştir** |

## 🌍 Desteklenen Diller

- 🇹🇷 **Türkçe** (Varsayılan)
- 🇺🇸 **English**

Dil değiştirmek için `/language` komutunu kullanın!

## 📻 Radyo İstasyonları

- 🎵 **Radyo D** - Pop/Rock
- ⚡ **Power FM** - Hit Music
- 🔥 **Virgin Radio** - Rock/Alternative
- 💫 **Radyo Viva** - Turkish Pop
- 😊 **Joy FM** - Feel Good
- 🌟 **Radyo Fenomen** - Turkish Hits
- 🏆 **Best FM** - Best Hits
- 🎧 **Radyo Mydonose** - Electronic
- 💝 **Slow Türk** - Slow/Romantic
- 🇹🇷 **Radyo Turkuvaz** - Turkish Music

## 🗳️ Voting Sistemi

### Nasıl Çalışır?
- ✅ **30 dakika ücretsiz** kullanım hakkı
- ⏰ Süre dolunca bot **otomatik durur**
- 🗳️ **Top.gg'de oy vererek** 12 saat kesintisiz kullanım kazanın
- 🔄 **12 saatte bir** tekrar oy verebilirsiniz

## 🎯 Desteklenen Formatlar

- ✅ YouTube URL: `https://youtube.com/watch?v=...`
- ✅ YouTube arama: `/play despacito`
- ✅ Spotify şarkı: `https://open.spotify.com/track/...`
- ✅ Spotify playlist: `https://open.spotify.com/playlist/...`
- ✅ **Radyo İstasyonları**: `/radio` komutu ile butonlardan seçim

## 🛠️ Geliştirme

### Gereksinimler
- Node.js 18+
- FFmpeg
- Discord Bot Token
- Spotify API Credentials

### Local Development
\`\`\`bash
# Development modunda çalıştır
npm run dev

# Linting
npm run lint

# Test
npm test
\`\`\`

### Yeni Dil Ekleme
1. `languages/` klasörüne yeni dil dosyası ekleyin
2. `utils/language.js` dosyasını güncelleyin
3. Komutlarda yeni dil desteği ekleyin

## 📋 Gerekli İzinler

Bot'unuzun şu izinlere sahip olması gerekir:
- Send Messages
- Embed Links
- Connect
- Speak
- Use Voice Activity
- Use Slash Commands

## 🐛 Sorun Giderme

### FFmpeg Hatası
\`\`\`bash
# Ubuntu/Debian
sudo apt update
sudo apt install ffmpeg

# macOS
brew install ffmpeg

# Windows
# FFmpeg'i indirip PATH'e ekleyin
\`\`\`

### Node.js Sürüm Hatası
Node.js v18 veya üzeri gereklidir. [nodejs.org](https://nodejs.org)'dan güncel sürümü indirin.

### Spotify API Hatası
1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)'a gidin
2. Yeni uygulama oluşturun
3. Client ID ve Client Secret'ı kopyalayın

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📊 İstatistikler

- ⭐ **GitHub Stars**: Projeyi beğendiyseniz yıldız verin!
- 🍴 **Forks**: Kendi versiyonunuzu oluşturun
- 🐛 **Issues**: Bug report ve feature request için
- 📈 **Aktif Geliştirme**: Sürekli güncelleniyor

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 Destek

- 🐛 **Bug Report**: [GitHub Issues](https://github.com/Baran12344/paumusic/issues)
- 💡 **Feature Request**: [GitHub Issues](https://github.com/Baran12344/paumusic/issues)
- 📧 **İletişim**: [GitHub Profile](https://github.com/Baran12344)
- 💬 **Discord**: [Destek Sunucusu](https://discord.gg/your-server)

## 🏆 Teşekkürler

Bu projeyi kullanan ve katkıda bulunan herkese teşekkürler! ❤️

### Katkıda Bulunanlar
- [@Baran12344](https://github.com/Baran12344) - Proje sahibi ve ana geliştirici

## ⭐ Yıldız Geçmişi

[![Star History Chart](https://api.star-history.com/svg?repos=Baran12344/paumusic&type=Date)](https://star-history.com/#Baran12344/paumusic&Date)

---

**Made with ❤️ by [Baran](https://github.com/Baran12344)**

**🎵 Müzik keyfini Discord'da yaşayın!**
