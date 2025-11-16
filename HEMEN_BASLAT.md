# ⚡ HEMEN BAŞLAT - WELLSCORE

## 🚨 SUPABASE'DE YENİ ŞEMAYI KUR!

### 1️⃣ Eski Tabloları Sil (Varsa)

Supabase SQL Editor'de:

```sql
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

### 2️⃣ Yeni Şemayı Kur

1. `scripts/WELLSCORE_FINAL_SETUP.sql` dosyasını aç
2. TAMAMINI kopyala
3. Supabase SQL Editor'e yapıştır
4. **Run** bas ▶️
5. ✅ "Success" gör!

---

## 👤 İLK KULLANICI

### 1. Sign Up

```bash
npm run dev
```

http://localhost:3000 → Sign Up
- Email: `test@example.com`
- Şifre: `Test1234!`

### 2. Email Doğrula

Supabase → Authentication → Users → **Confirm email**

USER ID'yi kopyala: `12345678-abcd-1234-...`

### 3. Şirket & Profil Oluştur

SQL Editor'de:

```sql
-- Şirket
INSERT INTO companies (name, industry, employee_count)
VALUES ('Test Şirketi', 'Teknoloji', 50)
RETURNING id;
```

COMPANY ID'yi kopyala: `98765432-wxyz-...`

```sql
-- Profil (YUKARID AKI ID'LERI KULLAN!)
INSERT INTO profiles (
  id,
  company_id,
  role,
  full_name,
  email
)
VALUES (
  'BURAYA_USER_ID',
  'BURAYA_COMPANY_ID',
  'employee',
  'Test User',
  'test@example.com'
);
```

---

## ✅ TEST

1. Login yap
2. Survey'e git
3. 40 soruyu cevapla
4. **"Anketi Tamamla"** bas
5. ✅ Dashboard'da skorları gör!

---

## 📊 NELER DEĞİŞTİ?

### ✅ Database
- 8 boyut, 40 soru (PRD'deki TAM liste)
- `dimension_scores` tablosu eklendi
- `marketplace_services` ve `cart_items` eklendi
- Tüm kolonlar doğru şekilde adlandırıldı

### ✅ Survey
- Artık çalışıyor! 🎉
- Boyut skorları otomatik hesaplanıyor
- Overall score kaydediliyor
- Hata mesajları daha açıklayıcı

### ✅ Employee Dashboard
- Dimension scores'dan skorları çekiyor
- Overall score gösteriyor
- Daha hızlı ve doğru

### ✅ HR Marketplace
- Hizmetleri listeleme
- Sepet görüntüleme
- Toplantı talebi hazır

---

## 🐛 Sorun Yaşarsan

### Survey gönderilmiyor?

1. Browser Console (F12) → Hatayı oku
2. Supabase Logs → API hatalarını gör
3. Profile var mı kontrol et: `SELECT * FROM profiles WHERE id = 'USER_ID';`

### "Kullanıcı profili bulunamadı"?

```sql
-- Profil kontrolü
SELECT * FROM profiles WHERE id = 'USER_ID';

-- Yoksa oluştur
INSERT INTO profiles (id, company_id, role, full_name, email)
VALUES ('USER_ID', 'COMPANY_ID', 'employee', 'Name', 'email');
```

### RLS Hatası?

```sql
-- Development için geçici kapat
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE survey_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE dimension_scores DISABLE ROW LEVEL SECURITY;
```

---

## 🎉 HAZıR!

Artık Wellscore ÇALIŞIYOR ve HAZIR!

Detaylı bilgi: `YENI_KURULUM.md`

