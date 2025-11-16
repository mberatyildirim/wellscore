-- ========================================
-- FIX: Infinite Recursion in RLS Policies
-- ========================================
-- Supabase SQL Editor'de bu dosyayı çalıştır
-- ========================================

-- Önce tüm mevcut politikaları kaldır
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "HR can view company profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Public read dimensions" ON wellbeing_dimensions;
DROP POLICY IF EXISTS "Public read questions" ON survey_questions;
DROP POLICY IF EXISTS "Users manage own responses" ON survey_responses;
DROP POLICY IF EXISTS "Users manage own answers" ON survey_answers;
DROP POLICY IF EXISTS "HR view company responses" ON survey_responses;
DROP POLICY IF EXISTS "Public read marketplace" ON marketplace_services;
DROP POLICY IF EXISTS "HR manage cart" ON cart_items;

-- ========================================
-- YENİ POLİTİKALAR (Recursion Yok!)
-- ========================================

-- PROFILES: Basit ve güvenli politikalar
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- PUBLIC: Herkes okuyabilir
CREATE POLICY "Public read dimensions" 
  ON wellbeing_dimensions FOR SELECT 
  USING (true);

CREATE POLICY "Public read questions" 
  ON survey_questions FOR SELECT 
  USING (true);

CREATE POLICY "Public read marketplace" 
  ON marketplace_services FOR SELECT 
  USING (is_active = true);

-- SURVEY RESPONSES: Sadece kendi yanıtları
CREATE POLICY "Users manage own responses" 
  ON survey_responses FOR ALL 
  USING (auth.uid() = user_id);

-- SURVEY ANSWERS: Yanıtlarını yöneten kullanıcıya ait
CREATE POLICY "Users manage own answers" 
  ON survey_answers FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM survey_responses sr 
      WHERE sr.id = survey_answers.response_id 
      AND sr.user_id = auth.uid()
    )
  );

-- DIMENSION SCORES: Yanıtlarla aynı mantık
CREATE POLICY "Users manage own dimension scores" 
  ON dimension_scores FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM survey_responses sr 
      WHERE sr.id = dimension_scores.response_id 
      AND sr.user_id = auth.uid()
    )
  );

-- RECOMMENDATIONS: Sadece kendi önerileri
CREATE POLICY "Users view own recommendations" 
  ON recommendations FOR SELECT 
  USING (auth.uid() = user_id);

-- WELLBEING CONTENT: Herkes görebilir
CREATE POLICY "Users view content" 
  ON wellbeing_content FOR SELECT 
  USING (is_published = true);

-- EVENTS: Herkes görebilir
CREATE POLICY "Users view events" 
  ON events FOR SELECT 
  USING (true);

-- EVENT PARTICIPANTS: Kendi katılımlarını yönetir
CREATE POLICY "Users manage own participation" 
  ON event_participants FOR ALL 
  USING (auth.uid() = user_id);

-- ========================================
-- GEÇİCİ ÇÖZÜM: Development İçin RLS'yi Kapat
-- (Production'da ASLA yapma!)
-- ========================================
-- Eğer hala sorun yaşıyorsan, aşağıdaki satırları aç:

-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE survey_responses DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE survey_answers DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE dimension_scores DISABLE ROW LEVEL SECURITY;

-- ========================================
-- KURULUM TAMAMLANDI! ✅
-- ========================================

