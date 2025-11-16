# 🚀 Supabase Sıfırdan Kurulum Rehberi

## Adım 1: Supabase Projesi Oluşturun

### 1.1 Supabase Hesabı
1. **https://supabase.com** adresine gidin
2. Sağ üstteki **"Start your project"** veya **"Sign In"** butonuna tıklayın
3. GitHub hesabınızla giriş yapın (önerilen) veya email ile kayıt olun

### 1.2 Yeni Proje Oluşturun
1. Dashboard'da **"New Project"** butonuna tıklayın
2. Bir organizasyon seçin (yoksa **"New organization"** ile oluşturun)
3. Proje bilgilerini doldurun:
   ```
   Name: WellScore
   Database Password: [Güvenli bir şifre - KAYDET!]
   Region: Europe West (Germany) - veya size yakın bölge
   Pricing Plan: Free (başlangıç için yeterli)
   ```
4. **"Create new project"** butonuna tıklayın
5. ⏳ Projenizin hazır olmasını bekleyin (1-2 dakika)

---

## Adım 2: API Anahtarlarınızı Alın

### 2.1 Settings > API'ye Gidin
1. Sol menüden ⚙️ **Settings** > **API** seçeneğine tıklayın
2. Aşağıdaki bilgileri kopyalayın ve bir yere kaydedin:

#### 📋 Project URL
```
Configuration bölümünde "Project URL" yazısının altında
Örnek: https://xyzabcd1234567890.supabase.co
```

#### 🔑 Anon (Public) Key
```
Project API keys bölümünde "anon public" key
Örnek: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ...
(çok uzun bir string olacak - tamamını kopyalayın)
```

> ⚠️ **ÖNEMLİ:** Service Role key'i ASLA frontend'de kullanmayın! Sadece "anon public" key'i kullanın.

---

## Adım 3: Veritabanı Şemasını Oluşturun

### 3.1 SQL Editor'ü Açın
1. Sol menüden 🔨 **SQL Editor** seçeneğine tıklayın
2. Yeşil **"New query"** butonuna tıklayın

### 3.2 SQL Scriptini Çalıştırın
1. `scripts/COMPLETE_SETUP.sql` dosyasını açın (bu dizindeki dosya)
2. **TAMAMINI** seçin (Ctrl+A veya Cmd+A)
3. Kopyalayın (Ctrl+C veya Cmd+C)
4. Supabase SQL Editor'e yapıştırın (Ctrl+V veya Cmd+V)
5. Sağ alttaki **"Run"** (▶️) butonuna tıklayın
6. ✅ "Success. No rows returned" mesajını görmelisiniz

### 3.3 Tabloları Kontrol Edin
1. Sol menüden 🗂️ **Table Editor** seçeneğine tıklayın
2. Şu tabloları görmelisiniz:
   - ✅ companies
   - ✅ profiles
   - ✅ wellbeing_dimensions (8 satır veri ile)
   - ✅ survey_questions (40 satır veri ile)
   - ✅ survey_responses
   - ✅ survey_answers
   - ✅ recommendations
   - ✅ hr_actions
   - ✅ wellbeing_content
   - ✅ content_assignments
   - ✅ events
   - ✅ event_registrations
   - ✅ marketplace_providers (5 satır veri ile)
   - ✅ marketplace_requests

---

## Adım 4: Yerel Projeyi Yapılandırın

### 4.1 .env.local Dosyası Oluşturun

Terminal'de proje dizininde şu komutu çalıştırın:

```bash
cp .env.local.template .env.local
```

Veya manuel olarak:
1. Proje kök dizininde `.env.local` adında yeni bir dosya oluşturun
2. Şu içeriği ekleyin:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=buraya_project_url_yapistirin
NEXT_PUBLIC_SUPABASE_ANON_KEY=buraya_anon_key_yapistirin
```

3. **Adım 2.1'de** kopyaladığınız değerleri yapıştırın

**Örnek (gerçek değerlerinizle değiştirin):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xyzabcd1234567890.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emFiY2QxMjM0NTY3ODkwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQxNDU2MDAsImV4cCI6MTk5OTcyMTYwMH0.abcdefghijklmnopqrstuvwxyz123456789
```

### 4.2 Bağımlılıkları Yükleyin

```bash
pnpm install
```

Veya npm kullanıyorsanız:
```bash
npm install
```

### 4.3 Development Sunucusunu Başlatın

```bash
pnpm dev
```

Tarayıcınızda açın: **http://localhost:3000**

---

## Adım 5: İlk Kullanıcıyı Oluşturun

### 5.1 Sign Up Yapın
1. Uygulamada **"Sign Up"** butonuna tıklayın
2. Email ve şifre girin (örn: test@example.com / Test1234!)
3. **"Sign Up"** butonuna tıklayın

### 5.2 Email'i Doğrulayın
Supabase size bir doğrulama emaili gönderecek. 

**Geliştirme ortamında email almıyorsanız, manuel olarak doğrulayın:**

1. Supabase Dashboard'da 👤 **Authentication** > **Users** menüsüne gidin
2. Oluşturduğunuz kullanıcıyı bulun
3. Kullanıcının yanındaki **"..."** menüsüne tıklayın
4. **"Confirm email"** seçeneğine tıklayın
5. ✅ Email confirmed!

### 5.3 Auth User ID'nizi Alın
1. Aynı sayfada kullanıcınızın **ID** sütunundaki değeri kopyalayın
   ```
   Örnek: 12345678-abcd-1234-efgh-1234567890ab
   ```
2. Bu ID'yi bir yere kaydedin - sonra lazım olacak!

---

## Adım 6: Şirket ve Profil Oluşturun

### 6.1 SQL Editor'de Şirket Oluşturun

1. **SQL Editor** > **New query**
2. Şu SQL'i çalıştırın:

```sql
-- Şirket oluştur
INSERT INTO companies (name, industry, employee_count)
VALUES ('Test Şirketi', 'Teknoloji', 10)
RETURNING id;
```

3. ✅ Dönen **id** değerini kopyalayın
   ```
   Örnek: 98765432-wxyz-9876-ijkl-9876543210ab
   ```

### 6.2 Profil Oluşturun

Şu SQL'i çalıştırın (ID'leri yukarıda aldığınız değerlerle değiştirin):

```sql
-- Profil oluştur
INSERT INTO profiles (id, company_id, role, full_name, department)
VALUES (
  'BURAYA_AUTH_USER_ID',    -- Adım 5.3'ten aldığınız auth user ID
  'BURAYA_COMPANY_ID',      -- Adım 6.1'den aldığınız company ID
  'employee',               -- Rol: 'employee' veya 'hr_admin'
  'Adınız Soyadınız',       -- Tam adınız
  'Yazılım'                 -- Departmanınız
);
```

**Gerçek Örnek:**
```sql
INSERT INTO profiles (id, company_id, role, full_name, department)
VALUES (
  '12345678-abcd-1234-efgh-1234567890ab',
  '98765432-wxyz-9876-ijkl-9876543210ab',
  'employee',
  'Ahmet Yılmaz',
  'Yazılım'
);
```

4. ✅ "Success" mesajı görmelisiniz

---

## Adım 7: Giriş Yapın ve Test Edin!

### 7.1 Login
1. Uygulamada **"Login"** sayfasına gidin
2. Email ve şifrenizi girin
3. **"Giriş Yap"** butonuna tıklayın
4. ✅ Dashboard'a yönlendirilmelisiniz!

### 7.2 Anket Doldurun
1. Sol menüden **"Survey"** seçeneğine tıklayın
2. 8 boyuttaki 40 soruyu cevaplayın (her soru için emoji seçin)
3. Her boyutu tamamladıktan sonra **"Sonraki Boyut"** butonuna tıklayın
4. Son boyutta **"Anketi Tamamla"** butonuna tıklayın
5. ✅ Dashboard'da skorlarınızı görmelisiniz!

### 7.3 HR Admin Oluşturun (Opsiyonel)

HR Dashboard'ı test etmek için ikinci bir kullanıcı oluşturun:

1. Sign Up yapın (farklı email)
2. Email doğrulayın
3. SQL Editor'de profil oluşturun (bu sefer `role='hr_admin'` kullanın):

```sql
INSERT INTO profiles (id, company_id, role, full_name, department)
VALUES (
  'IKINCI_USER_AUTH_ID',
  'AYNI_COMPANY_ID',  -- Aynı şirket ID'sini kullanın
  'hr_admin',         -- HR admin rolü
  'Ayşe Demir',
  'İnsan Kaynakları'
);
```

4. Bu kullanıcıyla giriş yapın
5. ✅ HR Dashboard'ı görebilmeniz gerekir!

---

## 🎉 Kurulum Tamamlandı!

Artık WellScore tam olarak çalışıyor:

- ✅ Supabase bağlantısı aktif
- ✅ Veritabanı tabloları oluşturuldu
- ✅ Başlangıç verileri yüklendi
- ✅ Authentication çalışıyor
- ✅ Survey sistemi çalışıyor
- ✅ Dashboard skorları gösteriyor
- ✅ RLS güvenlik politikaları aktif

---

## 🐛 Sorun Giderme

### "Failed to fetch" hatası
- `.env.local` dosyasını kontrol edin
- URL ve Key'in doğru kopyalandığından emin olun
- Dev sunucusunu yeniden başlatın (Ctrl+C, sonra `pnpm dev`)

### "Table not found" hatası
- `scripts/COMPLETE_SETUP.sql` dosyasını tamamen çalıştırdınız mı?
- Table Editor'de tabloları görebiliyor musunuz?
- SQL çalıştırırken hata aldınız mı?

### "User not found" hatası
- Profile kaydınız var mı? (Adım 6.2'yi kontrol edin)
- Auth user ID'yi doğru kullandınız mı?
- Company ID'yi doğru kullandınız mı?

### "RLS policy violation" hatası
Geliştirme aşamasında RLS'yi geçici olarak kapatabilirsiniz:

```sql
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE survey_answers DISABLE ROW LEVEL SECURITY;
```

> ⚠️ **UYARI:** Production'da RLS'yi ASLA kapatmayın!

### Daha fazla yardım
- `KURULUM.md` dosyasına bakın (detaylı Türkçe rehber)
- `QUICK_START.md` dosyasına bakın (hızlı özet)
- Supabase Dashboard > Logs > API logs'a bakın (hata mesajları için)
- Browser Console'a bakın (F12 - hata mesajları için)

---

## 📝 Notlar

- **Free tier** 500MB veritabanı, 2GB file storage ve 50MB file upload sunar
- **Pause policy:** 7 gün inaktif kalırsa proje pause olur (dashboard'a girerek aktif edebilirsiniz)
- **RLS:** Tüm tablolarda Row Level Security aktif - kullanıcılar sadece kendi verilerini görebilir
- **Backup:** Supabase otomatik backup yapar (paid plan'lerde)

---

## 🚀 Sonraki Adımlar

1. ✅ Proje çalışıyor mu? Test edin!
2. 🎨 UI'ı keşfedin (Dark mode var!)
3. 📊 Dashboard'da skorları inceleyin
4. 👥 Daha fazla kullanıcı ekleyin
5. 📈 HR Dashboard'ı test edin
6. 🛍️ Marketplace'i inceleyin
7. 📅 Event takvimini kullanın

**Kolay gelsin! 🎉**

