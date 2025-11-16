# 🚀 WELLSCORE - YENİ KURULUM REHBERİ

## ⚠️ ÖNCEKİ KURULUMU SİL!

Eğer daha önce Supabase'de tablo oluşturduysan, ÖNCE HEPSİNİ SİL:

```sql
-- Supabase SQL Editor'de çalıştır:
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS meeting_requests CASCADE;
DROP TABLE IF EXISTS marketplace_services CASCADE;
DROP TABLE IF EXISTS event_participants CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS wellbeing_content CASCADE;
DROP TABLE IF EXISTS recommendations CASCADE;
DROP TABLE IF EXISTS dimension_scores CASCADE;
DROP TABLE IF EXISTS survey_answers CASCADE;
DROP TABLE IF EXISTS survey_responses CASCADE;
DROP TABLE IF EXISTS survey_questions CASCADE;
DROP TABLE IF EXISTS wellbeing_dimensions CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
```

---

## 📋 ADIM 1: Supabase'de YENİ Şemayı Kur

1. Supabase Dashboard → **SQL Editor** → **New query**
2. `scripts/WELLSCORE_FINAL_SETUP.sql` dosyasını aç
3. **TAMAMINI** kopyala (Ctrl+A, Ctrl+C)
4. SQL Editor'e yapıştır (Ctrl+V)
5. **Run** butonuna bas (▶️)
6. ✅ "Success. No rows returned" görmelisin

---

## 📦 ADIM 2: Projeyi Hazırla

Terminal'de:

```bash
cd /Applications/wellscore

# Eski build dosyalarını temizle
rm -rf .next

# node_modules varsa güncelle
npm install --legacy-peer-deps

# .env.local dosyası var mı kontrol et
cat .env.local
```

`.env.local` dosyası şöyle olmalı:

```env
NEXT_PUBLIC_SUPABASE_URL=https://oyevlrynbxgjaycqmrhu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 👤 ADIM 3: İlk Kullanıcıyı Oluştur

### 3.1 Sign Up

```bash
# Development server'ı başlat
npm run dev
```

Tarayıcıda: http://localhost:3000

1. **Sign Up** butonuna tıkla
2. Email: `test@example.com`
3. Şifre: `Test1234!`
4. Sign Up yap

### 3.2 Email Doğrula

Supabase Dashboard → **Authentication** → **Users**
- Yeni kullanıcıyı bul
- **"..." menü** → **"Confirm email"** seç

### 3.3 User ID'yi Al

Aynı sayfada kullanıcının **ID** sütunundaki değeri kopyala:
```
Örnek: 12345678-abcd-1234-efgh-123456789012
```

---

## 🏢 ADIM 4: Şirket ve Profil Oluştur

Supabase → **SQL Editor** → **New query**

### 4.1 Şirket Oluştur

```sql
INSERT INTO companies (name, industry, employee_count)
VALUES ('Test Şirketi', 'Teknoloji', 50)
RETURNING id;
```

**Run** bas → Dönen ID'yi kopyala:
```
Örnek: 98765432-wxyz-9876-ijkl-987654321098
```

### 4.2 Profil Oluştur (EMPLOYEE)

```sql
INSERT INTO profiles (
  id,
  company_id,
  role,
  full_name,
  email,
  department,
  city,
  age_group,
  gender
)
VALUES (
  '12345678-abcd-1234-efgh-123456789012',  -- ADIM 3.3'teki User ID
  '98765432-wxyz-9876-ijkl-987654321098',  -- ADIM 4.1'deki Company ID
  'employee',                               -- Role
  'Ahmet Test',                             -- İsim
  'test@example.com',                       -- Email
  'Yazılım',                                -- Departman
  'Istanbul',                               -- Şehir
  '25-34',                                  -- Yaş grubu
  'male'                                    -- Cinsiyet
);
```

### 4.3 HR Admin Profili Oluştur (Opsiyonel)

Farklı bir email ile Sign Up yap, sonra:

```sql
INSERT INTO profiles (
  id,
  company_id,
  role,
  full_name,
  email
)
VALUES (
  'IKINCI_USER_ID',                        -- İkinci kullanıcının ID'si
  '98765432-wxyz-9876-ijkl-987654321098',  -- AYNI Company ID
  'hr_admin',                               -- HR admin rolü
  'Ayşe HR',
  'hr@example.com'
);
```

---

## ✅ ADIM 5: TEST ET!

### Employee Olarak Giriş

1. http://localhost:3000 → **Login**
2. Email: `test@example.com`, Şifre: `Test1234!`
3. **Survey** sayfasına git
4. **40 soruyu** cevapla (8 boyut x 5 soru)
5. **"Anketi Tamamla"** bas
6. ✅ Dashboard'da skorlarını gör!

### HR Admin Olarak Giriş

1. Çıkış yap
2. HR admin email ile giriş yap
3. **HR Dashboard** → Şirket geneli analizleri gör
4. **Marketplace** → Hizmetleri gör, sepete ekle

---

## 🎯 YENİ ÖZELLİKLER

### ✅ Employee Panel
- [x] 8 boyutlu Wellscore anketi (40 soru)
- [x] Kişisel skor özeti
- [x] Boyut bazlı detaylı skorlar
- [ ] AI destekli kişisel öneriler (çok yakında)
- [ ] Wellbeing kütüphanesi
- [ ] Etkinlik takvimi

### ✅ HR Admin Panel
- [x] KPI kartları (toplam çalışan, ortalama skor)
- [x] Departman bazlı segmentasyon
- [x] Şehir/yaş/cinsiyet analizleri
- [x] Marketplace görüntüleme
- [ ] Sepet sistemi ve toplantı talebi
- [ ] AI aksiyon önerileri

### ✅ Database
- [x] 8 wellbeing boyutu
- [x] 40 anket sorusu (PRD'deki tam liste)
- [x] Dimension scores tablosu
- [x] Marketplace ve cart yapısı
- [x] Meeting requests
- [x] KVKK uyumlu RLS politikaları

---

## 🐛 Sorun Giderme

### "Kullanıcı profili bulunamadı"
- `profiles` tablosunda kaydın var mı kontrol et
- Auth user ID'nin doğru olduğundan emin ol

### "Kullanıcı şirket bilgisi eksik"
- Profile kaydında `company_id` dolu mu kontrol et

### Survey gönderilmiyor
- Browser console'da (F12) hata mesajını oku
- Supabase Dashboard → **Logs** → **API** kısmında hatayı gör

### RLS hatası
Development için geçici olarak kapat:

```sql
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE survey_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE dimension_scores DISABLE ROW LEVEL SECURITY;
```

⚠️ **Production'da ASLA yapma!**

---

## 📊 DATABASE YAPISI

```
companies (şirketler)
└── profiles (kullanıcılar - employee/hr_admin)
    ├── survey_responses (anket yanıtları)
    │   ├── survey_answers (40 cevap)
    │   └── dimension_scores (8 boyut skoru)
    ├── recommendations (AI önerileri)
    └── cart_items (HR sepeti)

wellbeing_dimensions (8 boyut)
└── survey_questions (40 soru)

marketplace_services (hizmetler)
└── cart_items (sepetteki hizmetler)

events (etkinlikler)
└── event_participants (katılımcılar)
```

---

## 🎉 BAŞARILI!

Artık Wellscore tamamen çalışıyor:

- ✅ 8 boyutlu wellbeing değerlendirmesi
- ✅ Çalışan ve HR admin ayrımı
- ✅ Survey gönderimi çalışıyor
- ✅ Dashboard skorları gösteriyor
- ✅ Marketplace hazır
- ✅ KVKK uyumlu güvenlik

**Sıradaki:** AI öneriler, içerik kütüphanesi, etkinlik sistemi!

---

**Sorun yaşarsan:** Browser console (F12) ve Supabase Logs'a bak!

