# 🔧 HATA ÇÖZÜMÜ: Infinite Recursion in Profiles

## 🐛 Hata

```
Kullanıcı profili bulunamadı: infinite recursion detected in policy for relation "profiles"
```

## 🎯 Sebep

Supabase RLS (Row Level Security) politikaları sonsuz döngüye girmiş. 

**Sorunlu Policy:**
```sql
CREATE POLICY "HR can view company profiles" ON profiles 
USING (
  EXISTS (
    SELECT 1 FROM profiles p  -- ❌ profiles tablosunu kontrol ederken
    WHERE p.id = auth.uid()   -- tekrar profiles'ı sorguluyoruz
    ...                       -- SONSUZ DÖNGÜ!
  )
);
```

## ✅ ÇÖZÜM 1: YENİ POLİTİKALARI YÜKLE

Supabase SQL Editor'de:

```bash
scripts/FIX_RLS_POLICIES.sql
```

Bu dosyayı **TAMAMEN** kopyala ve **Run** bas!

Bu, tüm RLS politikalarını temizleyip **recursion olmayan** yeni politikalar kurar.

---

## ✅ ÇÖZÜM 2: GEÇİCİ (Development İçin)

Eğer hala sorun yaşıyorsan, **geçici olarak** RLS'yi kapat:

```sql
-- Supabase SQL Editor'de:
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE survey_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE dimension_scores DISABLE ROW LEVEL SECURITY;
```

⚠️ **UYARI:** Bu sadece development için! Production'da ASLA yapma!

---

## 🧪 TEST

1. Yukarıdaki SQL'i çalıştır
2. Browser'ı yenile (Ctrl+R veya Cmd+R)
3. Survey'i tekrar doldur
4. ✅ "Anket başarıyla tamamlandı! 🎉"

---

## 📋 YENİ POLİTİKALAR (Recursion Yok!)

### ✅ Profiles
- Kullanıcılar **sadece kendi** profillerini görebilir
- Başkalarının profillerini görmek için **recursion olmayan** bir yöntem

### ✅ Survey
- Kullanıcılar **sadece kendi** yanıtlarını yönetir
- `survey_responses` üzerinden kontrol edilir (recursion yok)

### ✅ Public Tables
- `wellbeing_dimensions`, `survey_questions`, `marketplace_services`
- Herkes okuyabilir (RLS yok)

---

## 🔄 Kalıcı Çözüm (İleride)

HR adminlerin şirket içi profilleri görmesi için:

1. **Materalized View** kullan (profiles'ı cache'le)
2. **Function-based Policy** kullan (PL/pgSQL)
3. **Service Role** kullan (backend'den sor)

Şimdilik basit politikalarla devam ediyoruz.

---

## 🎉 SONUÇ

`FIX_RLS_POLICIES.sql` dosyasını çalıştır, problem çözülür!

**Detay:** [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)

