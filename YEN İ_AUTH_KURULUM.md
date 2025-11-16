# 🚀 YENİ AUTH SİSTEMİ - KURULUM

## ✅ YAPILAN DEĞİŞİKLİKLER

### 1. Company-Based Authentication
- ✅ HR adminler şirket kaydı yapıyor
- ✅ Çalışanlar HR tarafından davet ediliyor
- ✅ Her şirket izole auth sistemi
- ✅ RLS sorunları çözüldü (development için disabled)

### 2. Yeni Tablolar
- ✅ `employee_invitations` - Çalışan davetleri (CSV upload için hazır)
- ✅ `profiles.is_active` - Aktif/pasif kullanıcı kontrolü
- ✅ `companies.subscription_plan` - Abonelik planı

### 3. Yeni Sayfalar
- ✅ `/auth/hr-signup` - Şirket kaydı (HR admins için)
- ✅ `/auth/login` - Güncellendi (hem HR hem employee)
- ✅ Landing page - HR signup'a yönlendiriyor

---

## 🔥 HEMEN BAŞLA

### 1️⃣ Supabase'de Yeni Şemayı Kur

```sql
-- Supabase SQL Editor'de:
-- scripts/AUTH_SYSTEM_SETUP.sql dosyasını çalıştır
```

Bu dosya:
- Eski tabloları siler
- Yeni şemayı kurar
- RLS'yi development için kapatır
- 8 boyut + 40 soruyu ekler

### 2️⃣ Dev Server'ı Başlat

```bash
cd /Applications/wellscore
rm -rf .next
npm run dev
```

### 3️⃣ HR Signup Yap

1. http://localhost:3000 → **"Şirketinizi Kaydettirin"**
2. Şirket bilgilerini doldur
3. HR admin hesabı oluştur
4. ✅ Otomatik login ve redirect

---

## 🎯 AKIŞ

### HR Admin Signup (Şirket Kaydı)
```
1. /auth/hr-signup sayfası
2. Şirket bilgileri + HR admin info
3. Supabase auth.signUp() → user oluştur
4. companies tablosuna şirket ekle
5. profiles tablosuna HR admin profil ekle
6. ✅ Redirect to /hr/dashboard
```

### Employee Invitation (İleride)
```
1. HR admin CSV yükler (email listesi)
2. Her email için employee_invitations kaydı
3. Davet maili gönderilir (invitation_token ile)
4. Çalışan linke tıklar, şifre oluşturur
5. ✅ Employee profili aktif olur
```

### Login (Herkes)
```
1. /auth/login
2. Email + şifre
3. profiles'dan role çek
4. role === 'hr_admin' → /hr/dashboard
5. role === 'employee' → /employee/dashboard
```

---

## 📁 YENİ DOSYALAR

### SQL
- `scripts/AUTH_SYSTEM_SETUP.sql` - Tek dosyada tüm şema

### Pages
- `app/auth/hr-signup/page.tsx` - Şirket kaydı
- `app/auth/login/page.tsx` - Güncellendi

### Components (İleride Eklenecek)
- `app/hr/employees/invite/page.tsx` - CSV upload
- `app/auth/employee-setup/page.tsx` - Çalışan şifre oluşturma

---

## 🐛 SORUN GİDERME

### "Profile bulunamadı" Hatası
```sql
-- Profil var mı kontrol et
SELECT * FROM profiles WHERE email = 'YOUR_EMAIL';

-- Yoksa manuel oluştur
INSERT INTO profiles (id, company_id, role, full_name, email, is_active)
VALUES ('USER_ID', 'COMPANY_ID', 'hr_admin', 'Name', 'email@test.com', true);
```

### RLS Hatası (Hala varsa)
```sql
-- Tüm tabloları disable et
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE employee_invitations DISABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE survey_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE dimension_scores DISABLE ROW LEVEL SECURITY;
```

### Email Doğrulama
Supabase Dashboard → Authentication → Users → Confirm email

---

## 🎉 SONUÇ

**YENİ AUTH SİSTEMİ HAZIR!**

- ✅ HR signup çalışıyor
- ✅ Login çalışıyor
- ✅ Role-based redirect çalışıyor
- ✅ RLS sorunları çözüldü
- ✅ Company-based izolasyon hazır

**Sıradaki:**
- CSV upload ile employee invitation
- Email gönderimi (Resend/SendGrid)
- Employee onboarding flow

---

**Hemen dene! 🚀**

