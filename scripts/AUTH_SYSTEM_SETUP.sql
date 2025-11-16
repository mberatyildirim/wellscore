-- ========================================
-- WELLSCORE - YENİ AUTH SYSTEM
-- Company-Based Authentication
-- ========================================

-- ========================================
-- 1. ÖNCE TÜM MEVCUT TABLOLARI SİL
-- ========================================
DROP TABLE IF EXISTS employee_invitations CASCADE;
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

-- UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 2. COMPANIES (Şirketler) - HR Signup'ta oluşur
-- ========================================
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  industry TEXT,
  employee_count INTEGER,
  subscription_plan TEXT DEFAULT 'trial' CHECK (subscription_plan IN ('trial', 'basic', 'premium', 'enterprise')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 3. PROFILES - Auth.users'a bağlı
-- HR ve Employee için tek tablo
-- ========================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('hr_admin', 'employee')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT,
  city TEXT,
  age_group TEXT CHECK (age_group IN ('18-24', '25-34', '35-44', '45-54', '55+')),
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 4. EMPLOYEE INVITATIONS
-- HR'lar buradan çalışan davet eder
-- ========================================
CREATE TABLE employee_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  department TEXT,
  invited_by UUID REFERENCES profiles(id),
  invitation_token TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 5. WELLBEING DIMENSIONS (8 Boyut)
-- ========================================
CREATE TABLE wellbeing_dimensions (
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
-- 6. SURVEY QUESTIONS (40 Soru)
-- ========================================
CREATE TABLE survey_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dimension_id UUID REFERENCES wellbeing_dimensions(id) ON DELETE CASCADE,
  question_text_tr TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 7. SURVEY RESPONSES
-- ========================================
CREATE TABLE survey_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  overall_score DECIMAL(3,1),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 8. SURVEY ANSWERS
-- ========================================
CREATE TABLE survey_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  response_id UUID REFERENCES survey_responses(id) ON DELETE CASCADE,
  question_id UUID REFERENCES survey_questions(id) ON DELETE CASCADE,
  dimension_id UUID REFERENCES wellbeing_dimensions(id) ON DELETE CASCADE,
  answer_value INTEGER NOT NULL CHECK (answer_value BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 9. DIMENSION SCORES
-- ========================================
CREATE TABLE dimension_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  response_id UUID REFERENCES survey_responses(id) ON DELETE CASCADE,
  dimension_id UUID REFERENCES wellbeing_dimensions(id) ON DELETE CASCADE,
  score DECIMAL(3,1) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(response_id, dimension_id)
);

-- ========================================
-- 10. RECOMMENDATIONS
-- ========================================
CREATE TABLE recommendations (
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
-- 11. WELLBEING CONTENT
-- ========================================
CREATE TABLE wellbeing_content (
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
-- 12. EVENTS
-- ========================================
CREATE TABLE events (
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
-- 13. EVENT PARTICIPANTS
-- ========================================
CREATE TABLE event_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ========================================
-- 14. MARKETPLACE SERVICES
-- ========================================
CREATE TABLE marketplace_services (
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
-- 15. CART ITEMS
-- ========================================
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  service_id UUID REFERENCES marketplace_services(id) ON DELETE CASCADE,
  added_by UUID REFERENCES profiles(id),
  notes TEXT,
  status TEXT DEFAULT 'in_cart' CHECK (status IN ('in_cart', 'requested', 'approved', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 16. MEETING REQUESTS
-- ========================================
CREATE TABLE meeting_requests (
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
-- RLS: GELİŞTİRME İÇİN KAPALI!
-- ========================================
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE employee_invitations DISABLE ROW LEVEL SECURITY;
ALTER TABLE wellbeing_dimensions DISABLE ROW LEVEL SECURITY;
ALTER TABLE survey_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE survey_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE dimension_scores DISABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations DISABLE ROW LEVEL SECURITY;
ALTER TABLE wellbeing_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_services DISABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_requests DISABLE ROW LEVEL SECURITY;

-- ========================================
-- SEED DATA: 8 DIMENSIONS
-- ========================================
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

-- ========================================
-- SEED DATA: 40 SURVEY QUESTIONS
-- ========================================

-- Fiziksel Sağlık (5 soru)
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT d.id, q.text, q.idx FROM wellbeing_dimensions d
CROSS JOIN LATERAL (VALUES
  ('Düzenli egzersiz yapıyorum', 1),
  ('Yeterli ve kaliteli uyku alıyorum', 2),
  ('Dengeli besleniyorum', 3),
  ('Fiziksel olarak kendimi enerjik hissediyorum', 4),
  ('Kronik ağrı veya rahatsızlıklarım yok', 5)
) AS q(text, idx)
WHERE d.name = 'Physical Health';

-- Zihinsel Sağlık (5 soru)
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT d.id, q.text, q.idx FROM wellbeing_dimensions d
CROSS JOIN LATERAL (VALUES
  ('Stresle başa çıkabiliyorum', 6),
  ('Konsantre olabiliyorum', 7),
  ('Yeni şeyler öğrenmeye ilgi duyuyorum', 8),
  ('Zihinsel olarak kendimi taze hissediyorum', 9),
  ('Problemleri çözmede başarılıyım', 10)
) AS q(text, idx)
WHERE d.name = 'Mental Health';

-- Duygusal İyilik Hali (5 soru)
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT d.id, q.text, q.idx FROM wellbeing_dimensions d
CROSS JOIN LATERAL (VALUES
  ('Genellikle mutlu ve pozitif hissediyorum', 11),
  ('Duygularımı sağlıklı şekilde ifade edebiliyorum', 12),
  ('Hayattan zevk alıyorum', 13),
  ('Umutlu ve iyimser hissediyorum', 14),
  ('Duygusal olarak dengeli hissediyorum', 15)
) AS q(text, idx)
WHERE d.name = 'Emotional Wellbeing';

-- Sosyal Bağlar (5 soru)
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT d.id, q.text, q.idx FROM wellbeing_dimensions d
CROSS JOIN LATERAL (VALUES
  ('Yakın ve destekleyici arkadaşlıklarım var', 16),
  ('Ailemi ve sevdiklerimle kaliteli zaman geçiriyorum', 17),
  ('Sosyal aktivitelere katılıyorum', 18),
  ('İş yerinde iyi ilişkiler kuruyorum', 19),
  ('Kendimi topluma ait hissediyorum', 20)
) AS q(text, idx)
WHERE d.name = 'Social Connections';

-- Kariyer Memnuniyeti (5 soru)
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT d.id, q.text, q.idx FROM wellbeing_dimensions d
CROSS JOIN LATERAL (VALUES
  ('İşimden memnunum', 21),
  ('Kariyerimde ilerleme fırsatlarım var', 22),
  ('İş-yaşam dengemi koruyabiliyorum', 23),
  ('İşim becerilerime uygun', 24),
  ('İş yerinde değer gördüğümü hissediyorum', 25)
) AS q(text, idx)
WHERE d.name = 'Career Satisfaction';

-- Finansal Güvenlik (5 soru)
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT d.id, q.text, q.idx FROM wellbeing_dimensions d
CROSS JOIN LATERAL (VALUES
  ('Gelirimi iyi yönetebiliyorum', 26),
  ('Mali durumum hakkında endişelenmiyorum', 27),
  ('Geleceğim için tasarruf yapabiliyorum', 28),
  ('Temel ihtiyaçlarımı karşılayabiliyorum', 29),
  ('Finansal hedeflerime ulaşabiliyorum', 30)
) AS q(text, idx)
WHERE d.name = 'Financial Security';

-- Çevresel Faktörler (5 soru)
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT d.id, q.text, q.idx FROM wellbeing_dimensions d
CROSS JOIN LATERAL (VALUES
  ('Yaşadığım ortamdan memnunum', 31),
  ('Güvenli bir çevrede yaşıyorum', 32),
  ('Çalışma ortamım rahat ve uygun', 33),
  ('Doğaya ve temiz çevreye erişimim var', 34),
  ('Yaşam alanım ihtiyaçlarıma uygun', 35)
) AS q(text, idx)
WHERE d.name = 'Environmental Factors';

-- Amaç ve Anlam (5 soru)
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT d.id, q.text, q.idx FROM wellbeing_dimensions d
CROSS JOIN LATERAL (VALUES
  ('Hayatımın bir amacı olduğunu hissediyorum', 36),
  ('Yaptığım işin anlamlı olduğunu düşünüyorum', 37),
  ('Kişisel değerlerime göre yaşıyorum', 38),
  ('Kendimi geliştirmek için çaba gösteriyorum', 39),
  ('Gelecek hakkında net hedeflerim var', 40)
) AS q(text, idx)
WHERE d.name = 'Purpose and Meaning';

-- ========================================
-- SEED DATA: MARKETPLACE SERVICES
-- ========================================
INSERT INTO marketplace_services (provider_name, service_name, description, category, price_range, image_url) VALUES
('Mindful Life', 'Kurumsal Meditasyon Programı', 'Haftalık online meditasyon seansları', 'Zihinsel Sağlık', '5.000-10.000 TL', '/placeholder.svg'),
('FitCorp', 'Ofis Egzersiz Programı', 'Haftada 3 gün fiziksel aktivite', 'Fiziksel Sağlık', '10.000-20.000 TL', '/placeholder.svg'),
('Career Boost', 'Profesyonel Gelişim Koçluğu', 'Kişisel kariyer danışmanlığı', 'Kariyer', '15.000-30.000 TL', '/placeholder.svg'),
('Financial Wellness', 'Mali Planlama Eğitimi', 'Kişisel finans yönetimi workshopu', 'Finansal Güvenlik', '8.000-15.000 TL', '/placeholder.svg'),
('Social Connect', 'Takım Etkinlikleri', 'Aylık sosyal aktivite organizasyonu', 'Sosyal Bağlar', '20.000-40.000 TL', '/placeholder.svg');

-- ========================================
-- ✅ KURULUM TAMAMLANDI!
-- ========================================
-- Sonraki adım: HR signup sayfasından şirket kaydı yap
-- ========================================

