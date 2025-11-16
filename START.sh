#!/bin/bash
# WellScore Development Server Starter
# Bu script'i çalıştırmak için: bash START.sh

echo "🚀 WellScore Development Server Başlatılıyor..."
echo ""

# Lock dosyasını temizle (eğer varsa)
if [ -f ".next/dev/lock" ]; then
    echo "🧹 Eski lock dosyası temizleniyor..."
    rm -rf .next/dev/lock
fi

# Supabase key'lerini kontrol et
if [ ! -f ".env.local" ]; then
    echo "❌ HATA: .env.local dosyası bulunamadı!"
    echo "Lütfen önce .env.local dosyasını oluşturun."
    exit 1
fi

# node_modules kontrolü
if [ ! -d "node_modules" ]; then
    echo "📦 node_modules bulunamadı, yükleniyor..."
    npm install --legacy-peer-deps
fi

echo ""
echo "✅ Hazır! Server başlatılıyor..."
echo "📍 http://localhost:3000"
echo ""
echo "Durdurmak için: Ctrl+C"
echo ""

# Development server'ı başlat
npm run dev

