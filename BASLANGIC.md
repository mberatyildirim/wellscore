# ⚡ WellScore - Hızlı Başlangıç

## 🎯 3 Dakikada Başlat!

### 1️⃣ Supabase Key'lerini Alın

1. https://supabase.com → Yeni proje oluşturun
2. Settings > API'den şunları kopyalayın:
   - **Project URL**
   - **anon public key**

### 2️⃣ Environment Dosyasını Oluşturun

```bash
# Bu komutu çalıştırın
cp env.example .env.local
```

Sonra `.env.local` dosyasını açın ve key'leri yapıştırın.

### 3️⃣ Veritabanını Kurun

1. Supabase'de **SQL Editor** açın
2. `scripts/COMPLETE_SETUP.sql` dosyasını tamamen kopyalayın
3. SQL Editor'e yapıştırın ve **Run** butonuna basın
4. ✅ Tüm tablolar ve veriler oluşturuldu!

### 4️⃣ Uygulamayı Başlatın

```bash
# Bağımlılıkları yükle
pnpm install

# Başlat
pnpm dev
```

Tarayıcıda aç: http://localhost:3000

---

## 🆕 İlk Kullanıcı

### Sign Up
1. Uygulamada Sign Up yapın
2. Supabase Dashboard > Authentication > Users'dan email'i confirm edin

### Şirket ve Profil Oluştur

SQL Editor'de:

```sql
-- 1. Şirket oluştur
INSERT INTO companies (name, industry, employee_count)
VALUES ('Test Şirketi', 'Teknoloji', 10)
RETURNING id;

-- 2. Auth user ID'nizi alın
SELECT id, email FROM auth.users;

-- 3. Profil oluştur (yukarıdaki ID'leri kullanarak)
INSERT INTO profiles (id, company_id, role, full_name, department)
VALUES (
  'YOUR_AUTH_USER_ID',    -- auth.users'dan
  'YOUR_COMPANY_ID',      -- companies'den
  'employee',             -- veya 'hr_admin'
  'Adınız Soyadınız',
  'Yazılım'
);
```

---

## ✅ Test Et!

1. **Login** yapın
2. **Survey** sayfasında 40 soruyu cevaplayın
3. **Dashboard**'da skorlarınızı görün
4. 🎉 Çalışıyor!

---

## 📚 Detaylı Rehber

Daha fazla bilgi için:
- **SETUP_SUPABASE.md** - Adım adım Supabase kurulumu
- **KURULUM.md** - Detaylı Türkçe kurulum rehberi
- **QUICK_START.md** - Düzeltmeler ve sorun giderme

---

## 🐛 Sorun mu var?

### "Failed to fetch"
- `.env.local` dosyasını kontrol et
- Dev sunucusunu yeniden başlat

### "Table not found"
- `scripts/COMPLETE_SETUP.sql`'i çalıştırdın mı?

### "User not found"
- Profil oluşturdun mu? (yukarıdaki SQL'i çalıştır)

---

## 🎯 Özellikler

- ✅ 8 boyutlu wellbeing değerlendirmesi
- ✅ Gerçek zamanlı skor hesaplama
- ✅ AI destekli öneriler
- ✅ Employee & HR Admin panelleri
- ✅ Marketplace entegrasyonu
- ✅ Event takvimi
- ✅ Dark mode

**Başarılar! 🚀**

