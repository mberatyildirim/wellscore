-- ========================================
-- CHECK EVENT_PLANS TABLE
-- Mevcut event plan'ları kontrol et ve temizle
-- ========================================

-- 1. Tüm event_plans'ı listele
SELECT 
  ep.id,
  ep.company_id,
  ep.event_id,
  ep.status,
  ep.created_at,
  e.title as event_title,
  c.name as company_name
FROM event_plans ep
LEFT JOIN events e ON e.id = ep.event_id
LEFT JOIN companies c ON c.id = ep.company_id
ORDER BY ep.created_at DESC;

-- 2. Test için: Tüm draft planları sil (İSTERSEN ÇALIŞTIR)
-- DELETE FROM event_plans WHERE status = 'draft';

-- 3. Başarılı mesaj
SELECT 
  'ℹ️ EVENT_PLANS KONTROL EDİLDİ' as result,
  COUNT(*) as total_plans
FROM event_plans;

