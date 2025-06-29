#!/bin/bash

echo "🎵 Discord Müzik Botu Başlatılıyor..."

# Config dosyası kontrolü
if [ ! -f "config.json" ]; then
    echo "❌ config.json dosyası bulunamadı!"
    echo "Lütfen config.json.example dosyasını kopyalayıp düzenleyin."
    exit 1
fi

# Log klasörü kontrolü
if [ ! -d "logs" ]; then
    mkdir -p logs
    echo "📁 Log klasörü oluşturuldu."
fi

# PM2 ile başlat
echo "🚀 PM2 ile bot başlatılıyor..."
pm2 start ecosystem.config.js

echo "✅ Bot başlatıldı!"
echo ""
echo "📊 Faydalı komutlar:"
echo "pm2 status              - Bot durumunu göster"
echo "pm2 logs discord-music-bot - Logları izle"
echo "pm2 restart discord-music-bot - Botu yeniden başlat"
echo "pm2 stop discord-music-bot - Botu durdur"
