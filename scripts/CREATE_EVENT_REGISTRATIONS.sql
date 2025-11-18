-- ========================================
-- CREATE EVENT_REGISTRATIONS TABLE
-- Çalışanların etkinlik taleplerini yönetir
-- ========================================

-- Önce mevcut event_registrations tablosunu kaldır (eğer varsa)
DROP TABLE IF EXISTS event_registrations CASCADE;

-- Yeni event_registrations tablosunu oluştur
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'rejected', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- RLS'yi kapat (development için)
ALTER TABLE event_registrations DISABLE ROW LEVEL SECURITY;

-- Index ekle (performans için)
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX idx_event_registrations_status ON event_registrations(status);

-- RPC Function (eğer lazım olursa)
CREATE OR REPLACE FUNCTION request_event_registration(
  p_user_id UUID,
  p_event_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO event_registrations (user_id, event_id, status)
  VALUES (p_user_id, p_event_id, 'requested')
  ON CONFLICT (user_id, event_id) DO NOTHING;
END;
$$;

-- Başarılı!
SELECT 'event_registrations table created successfully!' as result;

