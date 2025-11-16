# 🚀 WellScore Hızlı Başlangıç

## Supabase ASLA ÇALIŞMIYORDU - ŞİMDİ DÜZELTİLDİ! ✅

### Sorun Ne Oldu?

1. **Eksik .env.local dosyası** - Supabase bağlantı bilgileri yoktu
2. **Yanlış tablo isimleri** - Kod `users` tablosunu arıyordu ama DB'de `profiles` var
3. **Yanlış sütun isimleri** - Anket yanıtlarında `score` yerine `answer_value` kullanılmalı

### ✅ Yapılan Düzeltmeler

- ✅ Tüm `from("users")` referansları `from("profiles")` olarak değiştirildi
- ✅ Tüm `score` sütunları `answer_value` olarak güncellendi
- ✅ Survey form düzeltildi - artık anketler gönderilebilir!
- ✅ Dashboard skorları düzeltildi
- ✅ HR admin paneli düzeltildi

## 🔧 3 Adımda Kurulum

### 1️⃣ .env.local Dosyası Oluşturun

Proje kök dizininde `.env.local` adında bir dosya oluşturun:

```bash
# Terminal'de çalıştırın:
touch .env.local
```

Dosyayı açın ve şunu ekleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Supabase bilgilerinizi nasıl bulursunuz?**
1. https://supabase.com → Projenizi açın
2. Settings > API
3. "Project URL" ve "anon public" key'i kopyalayın

### 2️⃣ Supabase Veritabanını Kurun

1. Supabase Dashboard'da **SQL Editor**'ü açın
2. `scripts/001_complete_schema.sql` dosyasının tamamını kopyalayın
3. SQL Editor'e yapıştırıp **Run** butonuna basın
4. ✅ Tüm tablolar ve veriler oluşturuldu!

### 3️⃣ Uygulamayı Başlatın

```bash
# Bağımlılıkları yükleyin
pnpm install

# Development sunucusunu başlatın
pnpm dev
```

Tarayıcıda açın: http://localhost:3000

## 🎯 Test Etmek İçin

### Yeni Kullanıcı Oluşturun

1. Sign Up butonuna tıklayın
2. Email ve şifre ile kayıt olun
3. Email doğrulama yapın (Supabase Dashboard > Authentication > Users'dan manuel onaylayabilirsiniz)

### Profil Oluşturun (Manuel - İlk Kullanım)

Supabase SQL Editor'de şu komutları çalıştırın:

```sql
-- 1. Şirket oluşturun
INSERT INTO companies (name, industry, employee_count)
VALUES ('Test Şirketi', 'Teknoloji', 10)
RETURNING id;

-- 2. Auth kullanıcı ID'nizi alın
SELECT id, email FROM auth.users;

-- 3. Profil oluşturun (yukarıdaki ID'leri kullanarak)
INSERT INTO profiles (id, company_id, role, full_name, department)
VALUES (
  'BURAYA_AUTH_USER_ID',  -- auth.users'dan aldığınız ID
  'BURAYA_COMPANY_ID',    -- companies'den aldığınız ID
  'employee',             -- veya 'hr_admin' HR paneli için
  'Adınız Soyadınız',
  'Yazılım'
);
```

### Anket Gönderin

1. Giriş yapın
2. "Survey" sayfasına gidin
3. 8 boyuttaki soruları cevaplayın
4. ✅ Anket başarıyla gönderilir!
5. Dashboard'da skorlarınızı görün

## 🐛 Sorun Yaşıyorsanız

### "Failed to fetch" hatası?
- `.env.local` dosyasını kontrol edin
- Supabase URL ve Key'in doğru olduğundan emin olun
- Dev sunucusunu yeniden başlatın (Ctrl+C, sonra `pnpm dev`)

### "Table not found" hatası?
- Supabase SQL Editor'de `scripts/001_complete_schema.sql` çalıştırıldı mı?
- Table Editor'de tabloları görebiliyor musunuz?

### "RLS policy violation" hatası?
- Profile kaydınız var mı?
- Company'ye bağlı mısınız?
- Geliştirme için geçici olarak RLS'yi kapatabilirsiniz (yukarıdaki SQL komutlarıyla)

## 📚 Daha Fazla Bilgi

Detaylı kurulum için: `KURULUM.md`

## 🎉 Başarılar!

Artık WellScore tamamen çalışıyor! Survey gönderebilir, skorları görebilir ve HR panelini kullanabilirsiniz.


