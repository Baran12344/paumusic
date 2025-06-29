#!/bin/bash

echo "🚀 Discord Müzik Botu Kurulum Scripti"
echo "======================================"

# Sistem güncellemesi
echo "📦 Sistem güncelleniyor..."
sudo apt update && sudo apt upgrade -y

# Node.js kurulumu (NodeSource repository)
echo "📦 Node.js kuruluyor..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# FFmpeg kurulumu
echo "🎵 FFmpeg kuruluyor..."
sudo apt install ffmpeg -y

# PM2 kurulumu (global)
echo "⚙️ PM2 kuruluyor..."
sudo npm install -g pm2

# Proje bağımlılıklarını yükle
echo "📚 Proje bağımlılıkları yükleniyor..."
npm install

# Log klasörü oluştur
echo "📁 Log klasörü oluşturuluyor..."
mkdir -p logs

# PM2 startup script
echo "🔧 PM2 startup yapılandırılıyor..."
sudo pm2 startup
pm2 save

echo "✅ Kurulum tamamlandı!"
echo ""
echo "🎯 Sonraki adımlar:"
echo "1. config.json dosyasını düzenleyin"
echo "2. npm run pm2:start komutu ile botu başlatın"
echo "3. pm2 logs discord-music-bot ile logları izleyin"
