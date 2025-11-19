-- ========================================
-- DEPARTMENT & NEW FEATURES SCHEMA
-- HR Panel ve Çalışan Panel için yeni özellikler
-- ========================================

-- ========================================
-- 1. PROFILES TABLOSUNA DEPARTMENT EKLE
-- ========================================

-- Department sütunu ekle
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS department TEXT;

-- Index ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_profiles_department ON profiles(department);
CREATE INDEX IF NOT EXISTS idx_profiles_company_department ON profiles(company_id, department);

COMMENT ON COLUMN profiles.department IS 'Çalışanın departmanı (İK, Finans, Satış, vb.)';


-- ========================================
-- 2. EMPLOYEE SUGGESTIONS TABLOSU
-- Çalışanların önerileri (HR panelde listelenecek)
-- ========================================

DROP TABLE IF EXISTS employee_suggestions CASCADE;

CREATE TABLE employee_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  suggestion_type TEXT DEFAULT 'content' CHECK (suggestion_type IN ('content', 'event', 'program', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected', 'implemented')),
  hr_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS'yi kapat (development için)
ALTER TABLE employee_suggestions DISABLE ROW LEVEL SECURITY;

-- Index ekle
CREATE INDEX idx_employee_suggestions_employee_id ON employee_suggestions(employee_id);
CREATE INDEX idx_employee_suggestions_company_id ON employee_suggestions(company_id);
CREATE INDEX idx_employee_suggestions_status ON employee_suggestions(status);

COMMENT ON TABLE employee_suggestions IS 'Çalışanların HR''a gönderdiği içerik/etkinlik önerileri';


-- ========================================
-- 3. EVENT PLANS TABLOSU
-- HR'ın planladığı etkinlikler (Planlarım sayfası)
-- ========================================

DROP TABLE IF EXISTS event_plans CASCADE;

CREATE TABLE event_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  hr_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  planned_date DATE,
  estimated_participants INTEGER,
  budget_notes TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'quote_requested', 'approved', 'completed', 'cancelled')),
  quote_requested_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, event_id, planned_date)
);

-- RLS'yi kapat (development için)
ALTER TABLE event_plans DISABLE ROW LEVEL SECURITY;

-- Index ekle
CREATE INDEX idx_event_plans_company_id ON event_plans(company_id);
CREATE INDEX idx_event_plans_event_id ON event_plans(event_id);
CREATE INDEX idx_event_plans_hr_id ON event_plans(hr_id);
CREATE INDEX idx_event_plans_status ON event_plans(status);

COMMENT ON TABLE event_plans IS 'HR''ın planladığı etkinlikler ve teklifler';


-- ========================================
-- 4. WELLBEING DAYS TABLOSU
-- Şirket için düzenlenen Wellbeing Day etkinlikleri
-- ========================================

DROP TABLE IF EXISTS wellbeing_days CASCADE;

CREATE TABLE wellbeing_days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  location TEXT,
  activities JSONB, -- Array of activities/events planned
  participant_count INTEGER,
  budget DECIMAL(10,2),
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'confirmed', 'completed', 'cancelled')),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS'yi kapat (development için)
ALTER TABLE wellbeing_days DISABLE ROW LEVEL SECURITY;

-- Index ekle
CREATE INDEX idx_wellbeing_days_company_id ON wellbeing_days(company_id);
CREATE INDEX idx_wellbeing_days_event_date ON wellbeing_days(event_date);
CREATE INDEX idx_wellbeing_days_status ON wellbeing_days(status);

COMMENT ON TABLE wellbeing_days IS 'Şirketler için özel Wellbeing Day organizasyonları';


-- ========================================
-- 5. CONTENT LIBRARY TABLOSU
-- Çalışanlar için içerik kütüphanesi
-- ========================================

DROP TABLE IF EXISTS content_library CASCADE;

CREATE TABLE content_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dimension_id UUID REFERENCES wellbeing_dimensions(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT DEFAULT 'article' CHECK (content_type IN ('article', 'video', 'podcast', 'guide', 'tool', 'exercise')),
  content_url TEXT,
  thumbnail_url TEXT,
  duration_minutes INTEGER,
  tags TEXT[],
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS'yi kapat (development için)
ALTER TABLE content_library DISABLE ROW LEVEL SECURITY;

-- Index ekle
CREATE INDEX idx_content_library_dimension_id ON content_library(dimension_id);
CREATE INDEX idx_content_library_content_type ON content_library(content_type);
CREATE INDEX idx_content_library_tags ON content_library USING GIN(tags);

COMMENT ON TABLE content_library IS 'Çalışanlar için wellbeing içerik kütüphanesi';


-- ========================================
-- 6. USER CONTENT INTERACTIONS
-- Çalışanların içeriklerle etkileşimi
-- ========================================

DROP TABLE IF EXISTS user_content_interactions CASCADE;

CREATE TABLE user_content_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content_id UUID REFERENCES content_library(id) ON DELETE CASCADE NOT NULL,
  interaction_type TEXT DEFAULT 'viewed' CHECK (interaction_type IN ('viewed', 'completed', 'bookmarked', 'liked')),
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_id, interaction_type)
);

-- RLS'yi kapat (development için)
ALTER TABLE user_content_interactions DISABLE ROW LEVEL SECURITY;

-- Index ekle
CREATE INDEX idx_user_content_interactions_user_id ON user_content_interactions(user_id);
CREATE INDEX idx_user_content_interactions_content_id ON user_content_interactions(content_id);

COMMENT ON TABLE user_content_interactions IS 'Çalışanların içerik kütüphanesi etkileşimleri';


-- ========================================
-- 7. SAMPLE DATA - CONTENT LIBRARY
-- Örnek içerik kütüphanesi verileri
-- ========================================

INSERT INTO content_library (dimension_id, title, description, content_type, content_url, duration_minutes, tags) 
SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'),
  '10 Dakikada Ofis Egzersizleri',
  'Masa başında yapabileceğiniz 10 basit egzersiz ile fiziksel sağlığınızı koruyun.',
  'video',
  'https://example.com/office-exercises',
  10,
  ARRAY['egzersiz', 'ofis', 'fiziksel']
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Emotional and Mental Health'),
  'Stres Yönetimi Rehberi',
  'Günlük stresi azaltmak için kanıtlanmış 7 teknik.',
  'guide',
  'https://example.com/stress-guide',
  15,
  ARRAY['stres', 'zihinsel', 'rehber']
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Social Health'),
  'Etkili İletişim Becerileri',
  'İş yerinde ve özel hayatta daha iyi iletişim kurmanın yolları.',
  'article',
  'https://example.com/communication',
  8,
  ARRAY['iletişim', 'sosyal', 'beceri']
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Intellectual Health'),
  'Mindfulness Meditasyonu',
  'Günde 5 dakika ile zihninizi rahatlatın ve odaklanma gücünüzü artırın.',
  'exercise',
  'https://example.com/mindfulness',
  5,
  ARRAY['meditasyon', 'odaklanma', 'zihinsel'];


-- ========================================
-- SUCCESS MESSAGE
-- ========================================

SELECT 
  '✅ YENİ ÖZELLİKLER EKLENDİ!' as result,
  '' as blank1,
  '📊 EKLENEN TABLOLAR:' as section1,
  '1️⃣ profiles.department → Departman field' as table1,
  '2️⃣ employee_suggestions → Çalışan önerileri' as table2,
  '3️⃣ event_plans → Etkinlik planları' as table3,
  '4️⃣ wellbeing_days → Wellbeing Day organizasyonları' as table4,
  '5️⃣ content_library → İçerik kütüphanesi' as table5,
  '6️⃣ user_content_interactions → İçerik etkileşimleri' as table6,
  '' as blank2,
  '🎯 4 örnek içerik eklendi!' as sample_data;

