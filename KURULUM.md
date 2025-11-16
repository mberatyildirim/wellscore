# WellScore - Yerel Kurulum Rehberi 🚀

WellScore'u yerel makinenizde çalıştırmak için bu adımları takip edin.

## 📋 Gereksinimler

- Node.js 18+ 
- pnpm (veya npm/yarn)
- Bir Supabase hesabı (ücretsiz)

## 🔧 Adım 1: Supabase Projesi Oluşturun

### 1.1 Supabase Hesabı Oluşturun
1. [https://supabase.com](https://supabase.com) adresine gidin
2. "Start your project" butonuna tıklayın
3. GitHub hesabınızla giriş yapın (veya email ile kayıt olun)

### 1.2 Yeni Proje Oluşturun
1. Supabase Dashboard'da "New Project" butonuna tıklayın
2. Organizasyon seçin veya yeni bir organizasyon oluşturun
3. Proje bilgilerini doldurun:
   - **Name**: WellScore
   - **Database Password**: Güvenli bir şifre seçin (kaydedin!)
   - **Region**: Size en yakın bölgeyi seçin (örn: Europe West)
4. "Create new project" butonuna tıklayın
5. Projenizin hazır olmasını bekleyin (1-2 dakika)

### 1.3 API Bilgilerini Alın
1. Sol menüden **Settings** > **API** seçeneğine gidin
2. Aşağıdaki bilgileri kopyalayın:
   - **Project URL** (Configuration bölümünde)
   - **anon public** key (Project API keys bölümünde)

## 🗄️ Adım 2: Veritabanı Şemasını Oluşturun

### 2.1 SQL Editor'ü Açın
1. Supabase Dashboard'da sol menüden **SQL Editor** seçeneğine gidin
2. "New query" butonuna tıklayın

### 2.2 Şema SQL'ini Çalıştırın
1. `scripts/001_complete_schema.sql` dosyasının içeriğini kopyalayın
2. SQL Editor'e yapıştırın
3. "Run" butonuna tıklayın (sağ altta)
4. Hata olmadığından emin olun

### 2.3 Seed Verilerini Ekleyin
1. Yeni bir SQL sorgusu açın
2. `scripts/015_seed_wellbeing_data.sql` dosyasını kopyalayıp yapıştırın
3. "Run" butonuna tıklayın
4. Bu, wellbeing boyutlarını ve anket sorularını ekleyecektir

## 🔑 Adım 3: Ortam Değişkenlerini Ayarlayın

### 3.1 .env.local Dosyası Oluşturun
Proje kök dizininde `.env.local` adında bir dosya oluşturun:

```bash
# Terminal'de çalıştırın:
touch .env.local
```

### 3.2 Supabase Bilgilerini Ekleyin
`.env.local` dosyasını açın ve aşağıdaki içeriği ekleyin:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=buraya_supabase_url_yapistirin
NEXT_PUBLIC_SUPABASE_ANON_KEY=buraya_anon_key_yapistirin
```

**Önemli:** Yukarıdaki değerleri Adım 1.3'te kopyaladığınız gerçek değerlerle değiştirin!

Örnek:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xyzabcd1234.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📦 Adım 4: Bağımlılıkları Yükleyin

Terminal'de proje dizinine gidin ve bağımlılıkları yükleyin:

```bash
# pnpm kullanıyorsanız (önerilen):
pnpm install

# npm kullanıyorsanız:
npm install

# yarn kullanıyorsanız:
yarn install
```

## 🚀 Adım 5: Uygulamayı Başlatın

Development sunucusunu başlatın:

```bash
# pnpm ile:
pnpm dev

# npm ile:
npm run dev

# yarn ile:
yarn dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin.

## 👥 Adım 6: İlk Kullanıcıyı Oluşturun

### 6.1 Kayıt Olun
1. Uygulamada "Sign Up" butonuna tıklayın
2. Email ve şifre girin
3. Supabase size bir doğrulama emaili gönderecek
4. Email'i doğrulayın

### 6.2 Profil Oluşturun
İlk giriş yaptığınızda profil bilgilerinizi tamamlamanız gerekecek. Ancak, veritabanında henüz şirket kaydı olmadığı için bir hata alabilirsiniz.

### 6.3 Manuel Olarak Şirket ve Profil Ekleyin (Gerekirse)

Supabase SQL Editor'de şu sorguları çalıştırın:

```sql
-- 1. Önce bir şirket oluşturun
INSERT INTO companies (name, industry, employee_count)
VALUES ('Örnek Şirket', 'Teknoloji', 50);

-- 2. Oluşturduğunuz şirketin ID'sini alın
SELECT id, name FROM companies;

-- 3. Auth kullanıcınızın ID'sini alın
SELECT id, email FROM auth.users;

-- 4. Profile kaydı oluşturun (yukarıdaki ID'leri kullanarak)
INSERT INTO profiles (id, company_id, role, full_name)
VALUES (
  'buraya_auth_user_id',  -- auth.users tablosundan aldığınız ID
  'buraya_company_id',     -- companies tablosundan aldığınız ID
  'employee',              -- veya 'hr_admin'
  'Adınız Soyadınız'
);
```

## 📊 Anket Gönderme

1. Employee olarak giriş yapın
2. Sol menüden "Survey" seçeneğine tıklayın
3. 8 boyutta toplam 40 soruyu cevaplayın
4. Her boyutu tamamladıktan sonra "Sonraki Boyut" butonuna tıklayın
5. Son boyutu tamamladıktan sonra "Anketi Tamamla" butonuna tıklayın
6. Anket gönderildikten sonra otomatik olarak dashboard'a yönlendirileceksiniz

## 🔧 Sorun Giderme

### Supabase Bağlantı Hatası
**Hata:** "Failed to fetch" veya "Invalid API key"

**Çözüm:**
1. `.env.local` dosyasının proje kök dizininde olduğundan emin olun
2. `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_ANON_KEY` değerlerinin doğru olduğunu kontrol edin
3. Development sunucusunu yeniden başlatın (Ctrl+C ile durdurun, sonra `pnpm dev` ile tekrar başlatın)
4. Tarayıcı önbelleğini temizleyin (Ctrl+Shift+R veya Cmd+Shift+R)

### Tablo Bulunamadı Hatası
**Hata:** "relation does not exist" veya "table not found"

**Çözüm:**
1. Supabase SQL Editor'de `scripts/001_complete_schema.sql` dosyasını çalıştırdığınızdan emin olun
2. SQL sorgusu hatasız tamamlandığından emin olun
3. Table Editor'de tabloların oluşturulduğunu kontrol edin (sol menüden "Table Editor")

### Authentication Hatası
**Hata:** "User not found" veya "Invalid login credentials"

**Çözüm:**
1. Email doğrulaması yaptığınızdan emin olun
2. Supabase Dashboard > Authentication > Users bölümünden kullanıcınızın "Confirmed" durumda olduğunu kontrol edin
3. Gerekirse Supabase Dashboard'dan manuel olarak email'i doğrulayabilirsiniz

### Anket Gönderilememe Hatası
**Hata:** "Kullanıcı şirketi bulunamadı" veya "RLS policy violation"

**Çözüm:**
1. Kullanıcınızın `profiles` tablosunda kaydı olduğundan emin olun
2. Profile kaydının geçerli bir `company_id` değeri olduğundan emin olun
3. Yukarıdaki "6.3 Manuel Olarak Şirket ve Profil Ekleyin" adımlarını takip edin

### Row Level Security (RLS) Hataları
Eğer RLS policy hataları alıyorsanız, Supabase SQL Editor'de şu sorguyu çalıştırarak geçici olarak RLS'yi devre dışı bırakabilirsiniz:

```sql
-- SADECE DEVELOPMENT İÇİN! Production'da ASLA kullanmayın!
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE wellbeing_dimensions DISABLE ROW LEVEL SECURITY;
ALTER TABLE survey_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE survey_answers DISABLE ROW LEVEL SECURITY;
```

## 🎨 Özellikler

- ✅ Modern ve responsive UI (TailwindCSS)
- ✅ 8 boyutlu wellbeing değerlendirmesi
- ✅ Employee ve HR Admin rolleri
- ✅ Gerçek zamanlı skor hesaplama
- ✅ AI destekli öneriler
- ✅ Marketplace entegrasyonu
- ✅ Event yönetimi
- ✅ Dark mode desteği

## 📚 Proje Yapısı

```
wellscore/
├── app/                    # Next.js 13+ App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── employee/          # Employee dashboard & pages
│   └── hr/                # HR admin pages
├── components/            # React components
│   ├── survey/           # Survey form components
│   ├── dashboard/        # Dashboard components
│   └── ui/               # Reusable UI components
├── lib/                   # Utilities & helpers
│   ├── supabase/         # Supabase client configuration
│   └── types/            # TypeScript type definitions
└── scripts/               # Database migration scripts
```

## 🔐 Güvenlik Notları

- `.env.local` dosyası Git'e eklenmemelidir (zaten .gitignore'da)
- Production'da mutlaka RLS (Row Level Security) politikalarını etkinleştirin
- ANON key'i frontend'de kullanmak güvenlidir (RLS korumalı)
- SERVICE ROLE key'i asla frontend'de kullanmayın!

## 🤝 Yardım

Herhangi bir sorunla karşılaşırsanız:
1. Bu README'deki "Sorun Giderme" bölümünü kontrol edin
2. Supabase Dashboard'da logs'ları inceleyin (Logs > API)
3. Browser console'da hata mesajlarına bakın (F12)
4. Terminal'deki Next.js server loglarını kontrol edin

## 📝 Sonraki Adımlar

Proje çalıştıktan sonra:
1. HR Admin hesabı oluşturun (role='hr_admin')
2. Seed verilerini ekleyin (marketplace, events, content)
3. AI öneriler için OpenAI API key ekleyin (opsiyonel)
4. Production deployment için Vercel kullanın

Başarılar! 🎉


