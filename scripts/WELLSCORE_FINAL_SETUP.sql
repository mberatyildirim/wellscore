-- ========================================
-- WELLSCORE - FINAL DATABASE SETUP
-- PRD'ye göre hazırlanmış tam kurulum
-- ========================================
-- KULLANIM: Supabase SQL Editor'de bu dosyayı çalıştırın
-- ========================================

-- UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 1. COMPANIES (Şirketler)
-- ========================================
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  industry TEXT,
  employee_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 2. PROFILES (Kullanıcı Profilleri)
-- auth.users'ı genişletir
-- ========================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('employee', 'hr_admin')),
  full_name TEXT,
  email TEXT,
  department TEXT,
  city TEXT,
  age_group TEXT CHECK (age_group IN ('18-24', '25-34', '35-44', '45-54', '55+')),
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 3. WELLBEING DIMENSIONS (8 Boyut)
-- ========================================
CREATE TABLE IF NOT EXISTS wellbeing_dimensions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  name_tr TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 4. SURVEY QUESTIONS (40 Soru)
-- ========================================
CREATE TABLE IF NOT EXISTS survey_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dimension_id UUID REFERENCES wellbeing_dimensions(id) ON DELETE CASCADE,
  question_text_tr TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 5. SURVEY RESPONSES (Anket Yanıtları)
-- ========================================
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  overall_score DECIMAL(3,1),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 6. SURVEY ANSWERS (Cevaplar 1-5)
-- ========================================
CREATE TABLE IF NOT EXISTS survey_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  response_id UUID REFERENCES survey_responses(id) ON DELETE CASCADE,
  question_id UUID REFERENCES survey_questions(id) ON DELETE CASCADE,
  dimension_id UUID REFERENCES wellbeing_dimensions(id) ON DELETE CASCADE,
  answer_value INTEGER NOT NULL CHECK (answer_value BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 7. DIMENSION SCORES (Boyut Skorları)
-- Her anket için boyut bazlı skorlar
-- ========================================
CREATE TABLE IF NOT EXISTS dimension_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  response_id UUID REFERENCES survey_responses(id) ON DELETE CASCADE,
  dimension_id UUID REFERENCES wellbeing_dimensions(id) ON DELETE CASCADE,
  score DECIMAL(3,1) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(response_id, dimension_id)
);

-- ========================================
-- 8. RECOMMENDATIONS (AI Önerileri)
-- ========================================
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  response_id UUID REFERENCES survey_responses(id) ON DELETE CASCADE,
  dimension_id UUID REFERENCES wellbeing_dimensions(id),
  recommendation_text TEXT NOT NULL,
  recommendation_type TEXT CHECK (recommendation_type IN ('short_term', 'medium_term', 'long_term')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 9. WELLBEING CONTENT (İçerik Kütüphanesi)
-- ========================================
CREATE TABLE IF NOT EXISTS wellbeing_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  dimension_id UUID REFERENCES wellbeing_dimensions(id),
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT CHECK (content_type IN ('article', 'video', 'workshop', 'webinar', 'podcast')),
  content_url TEXT,
  thumbnail_url TEXT,
  duration_minutes INTEGER,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 10. EVENTS (Etkinlik Takvimi)
-- ========================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  dimension_id UUID REFERENCES wellbeing_dimensions(id),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT CHECK (event_type IN ('physical', 'online', 'hybrid')),
  location TEXT,
  meeting_url TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  max_participants INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 11. EVENT PARTICIPANTS (Katılımcılar)
-- ========================================
CREATE TABLE IF NOT EXISTS event_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ========================================
-- 12. MARKETPLACE SERVICES (Hizmetler)
-- ========================================
CREATE TABLE IF NOT EXISTS marketplace_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_name TEXT NOT NULL,
  service_name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  dimension_id UUID REFERENCES wellbeing_dimensions(id),
  price_range TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 13. CART (Sepet/Aksiyon Listesi)
-- HR adminler için
-- ========================================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  service_id UUID REFERENCES marketplace_services(id) ON DELETE CASCADE,
  added_by UUID REFERENCES profiles(id),
  notes TEXT,
  status TEXT DEFAULT 'in_cart' CHECK (status IN ('in_cart', 'requested', 'approved', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 14. MEETING REQUESTS (Toplantı Talepleri)
-- ========================================
CREATE TABLE IF NOT EXISTS meeting_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  requested_by UUID REFERENCES profiles(id),
  cart_items JSONB,
  preferred_date TIMESTAMPTZ,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellbeing_dimensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE dimension_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellbeing_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
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

-- PROFILES
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "HR can view company profiles" ON profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.company_id = profiles.company_id 
    AND p.role = 'hr_admin'
  )
);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- PUBLIC READ
CREATE POLICY "Public read dimensions" ON wellbeing_dimensions FOR SELECT USING (true);
CREATE POLICY "Public read questions" ON survey_questions FOR SELECT USING (true);
CREATE POLICY "Public read marketplace" ON marketplace_services FOR SELECT USING (is_active = true);

-- SURVEY RESPONSES & ANSWERS
CREATE POLICY "Users manage own responses" ON survey_responses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own answers" ON survey_answers FOR ALL USING (
  EXISTS (
    SELECT 1 FROM survey_responses sr 
    WHERE sr.id = survey_answers.response_id 
    AND sr.user_id = auth.uid()
  )
);
CREATE POLICY "HR view company responses" ON survey_responses FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.company_id = survey_responses.company_id 
    AND p.role = 'hr_admin'
  )
);

-- CART & MARKETPLACE
CREATE POLICY "HR manage cart" ON cart_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.company_id = cart_items.company_id 
    AND p.role = 'hr_admin'
  )
);

-- ========================================
-- SEED DATA
-- ========================================

-- 8 WELLBEING DIMENSIONS
INSERT INTO wellbeing_dimensions (name, name_tr, description, icon, color, order_index) VALUES
('Physical Health', 'Fiziksel Sağlık', 'Bedensel sağlık, uyku ve beslenme', '💪', '#10b981', 1),
('Mental Health', 'Zihinsel Sağlık', 'Stres yönetimi, konsantrasyon', '🧠', '#3b82f6', 2),
('Emotional Wellbeing', 'Duygusal İyilik Hali', 'Mutluluk, pozitiflik', '❤️', '#ef4444', 3),
('Social Connections', 'Sosyal Bağlar', 'İlişkiler ve topluluk', '👥', '#8b5cf6', 4),
('Career Satisfaction', 'Kariyer Memnuniyeti', 'İş tatmini, gelişim', '📈', '#f59e0b', 5),
('Financial Security', 'Finansal Güvenlik', 'Mali yönetim, tasarruf', '💰', '#06b6d4', 6),
('Environmental Factors', 'Çevresel Faktörler', 'Yaşam ve çalışma ortamı', '🌍', '#ec4899', 7),
('Purpose and Meaning', 'Amaç ve Anlam', 'Hayat amacı, değerler', '🎯', '#6366f1', 8)
ON CONFLICT (name) DO NOTHING;

-- 40 SURVEY QUESTIONS (Her boyutta 5 soru)
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT d.id, q.text, q.idx FROM wellbeing_dimensions d
CROSS JOIN LATERAL (VALUES
  ('Düzenli egzersiz yapıyorum', 1),
  ('Yeterli ve kaliteli uyku alıyorum', 2),
  ('Dengeli besleniyorum', 3),
  ('Fiziksel olarak kendimi enerjik hissediyorum', 4),
  ('Kronik ağrı veya rahatsızlıklarım yok', 5)
) AS q(text, idx)
WHERE d.name = 'Physical Health'
ON CONFLICT DO NOTHING;

INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT d.id, q.text, q.idx FROM wellbeing_dimensions d
CROSS JOIN LATERAL (VALUES
  ('Stresle başa çıkabiliyorum', 6),
  ('Konsantre olabiliyorum', 7),
  ('Yeni şeyler öğrenmeye ilgi duyuyorum', 8),
  ('Zihinsel olarak kendimi taze hissediyorum', 9),
  ('Problemleri çözmede başarılıyım', 10)
) AS q(text, idx)
WHERE d.name = 'Mental Health'
ON CONFLICT DO NOTHING;

INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT d.id, q.text, q.idx FROM wellbeing_dimensions d
CROSS JOIN LATERAL (VALUES
  ('Genellikle mutlu ve pozitif hissediyorum', 11),
  ('Duygularımı sağlıklı şekilde ifade edebiliyorum', 12),
  ('Hayattan zevk alıyorum', 13),
  ('Umutlu ve iyimser hissediyorum', 14),
  ('Duygusal olarak dengeli hissediyorum', 15)
) AS q(text, idx)
WHERE d.name = 'Emotional Wellbeing'
ON CONFLICT DO NOTHING;

INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT d.id, q.text, q.idx FROM wellbeing_dimensions d
CROSS JOIN LATERAL (VALUES
  ('Yakın ve destekleyici arkadaşlıklarım var', 16),
  ('Ailemi ve sevdiklerimle kaliteli zaman geçiriyorum', 17),
  ('Sosyal aktivitelere katılıyorum', 18),
  ('İş yerinde iyi ilişkiler kuruyorum', 19),
  ('Kendimi topluma ait hissediyorum', 20)
) AS q(text, idx)
WHERE d.name = 'Social Connections'
ON CONFLICT DO NOTHING;

INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT d.id, q.text, q.idx FROM wellbeing_dimensions d
CROSS JOIN LATERAL (VALUES
  ('İşimden memnunum', 21),
  ('Kariyerimde ilerleme fırsatlarım var', 22),
  ('İş-yaşam dengemi koruyabiliyorum', 23),
  ('İşim becerilerime uygun', 24),
  ('İş yerinde değer gördüğümü hissediyorum', 25)
) AS q(text, idx)
WHERE d.name = 'Career Satisfaction'
ON CONFLICT DO NOTHING;

INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT d.id, q.text, q.idx FROM wellbeing_dimensions d
CROSS JOIN LATERAL (VALUES
  ('Gelirimi iyi yönetebiliyorum', 26),
  ('Mali durumum hakkında endişelenmiyorum', 27),
  ('Geleceğim için tasarruf yapabiliyorum', 28),
  ('Temel ihtiyaçlarımı karşılayabiliyorum', 29),
  ('Finansal hedeflerime ulaşabiliyorum', 30)
) AS q(text, idx)
WHERE d.name = 'Financial Security'
ON CONFLICT DO NOTHING;

INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT d.id, q.text, q.idx FROM wellbeing_dimensions d
CROSS JOIN LATERAL (VALUES
  ('Yaşadığım ortamdan memnunum', 31),
  ('Güvenli bir çevrede yaşıyorum', 32),
  ('Çalışma ortamım rahat ve uygun', 33),
  ('Doğaya ve temiz çevreye erişimim var', 34),
  ('Yaşam alanım ihtiyaçlarıma uygun', 35)
) AS q(text, idx)
WHERE d.name = 'Environmental Factors'
ON CONFLICT DO NOTHING;

INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT d.id, q.text, q.idx FROM wellbeing_dimensions d
CROSS JOIN LATERAL (VALUES
  ('Hayatımın bir amacı olduğunu hissediyorum', 36),
  ('Yaptığım işin anlamlı olduğunu düşünüyorum', 37),
  ('Kişisel değerlerime göre yaşıyorum', 38),
  ('Kendimi geliştirmek için çaba gösteriyorum', 39),
  ('Gelecek hakkında net hedeflerim var', 40)
) AS q(text, idx)
WHERE d.name = 'Purpose and Meaning'
ON CONFLICT DO NOTHING;

-- MARKETPLACE SERVICES (Örnek)
INSERT INTO marketplace_services (provider_name, service_name, description, category, price_range, image_url) VALUES
('Mindful Life', 'Kurumsal Meditasyon Programı', 'Haftalık online meditasyon seansları', 'Zihinsel Sağlık', '5.000-10.000 TL', '/placeholder.svg'),
('FitCorp', 'Ofis Egzersiz Programı', 'Haftada 3 gün fiziksel aktivite', 'Fiziksel Sağlık', '10.000-20.000 TL', '/placeholder.svg'),
('Career Boost', 'Profesyonel Gelişim Koçluğu', 'Kişisel kariyer danışmanlığı', 'Kariyer', '15.000-30.000 TL', '/placeholder.svg'),
('Financial Wellness', 'Mali Planlama Eğitimi', 'Kişisel finans yönetimi workshopu', 'Finansal Güvenlik', '8.000-15.000 TL', '/placeholder.svg'),
('Social Connect', 'Takım Etkinlikleri', 'Aylık sosyal aktivite organizasyonu', 'Sosyal Bağlar', '20.000-40.000 TL', '/placeholder.svg')
ON CONFLICT DO NOTHING;

-- ========================================
-- KURULUM TAMAMLANDI! ✅
-- ========================================
-- Sonraki adımlar:
-- 1. Supabase Dashboard > Authentication'da kullanıcı oluşturun
-- 2. Companies tablosuna şirket ekleyin
-- 3. Profiles tablosuna profil oluşturun
-- ========================================

