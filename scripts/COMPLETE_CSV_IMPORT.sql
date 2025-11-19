-- ========================================
-- WELLSCORE - TÜM CSV EVENT'LERİ (114 ADET)
-- 8 Kategori + Tüm Etkinlikler
-- ========================================

-- ========================================
-- 1. ESKİ VERİLERİ TEMİZLE
-- ========================================
TRUNCATE TABLE event_registrations CASCADE;
TRUNCATE TABLE events CASCADE;
TRUNCATE TABLE wellbeing_dimensions CASCADE;
TRUNCATE TABLE survey_questions CASCADE;

-- ========================================
-- 2. 8 KATEGORİ EKLE
-- ========================================
INSERT INTO wellbeing_dimensions (name, name_tr, description, icon, color, order_index) VALUES
  ('Physical Health', 'Fiziksel Sağlık', 'Bedensel sağlık, egzersiz, beslenme ve uyku alışkanlıkları', '💪', '#22c55e', 1),
  ('Social Health', 'Sosyal Sağlık', 'İlişkiler, iletişim ve sosyal bağlantılar', '🤝', '#3b82f6', 2),
  ('Intellectual Health', 'Entelektüel Sağlık', 'Öğrenme, merak ve zihinsel gelişim', '🧠', '#a855f7', 3),
  ('Emotional and Mental Health', 'Duygusal ve Zihinsel Sağlık', 'Duygu yönetimi, stres, zihinsel netlik ve psikolojik sağlık', '❤️', '#f43f5e', 4),
  ('Occupational Health', 'Mesleki Sağlık', 'Kariyer tatmini, iş-yaşam dengesi ve profesyonel gelişim', '💼', '#f59e0b', 5),
  ('Environmental Health', 'Çevresel Sağlık', 'Fiziksel çevre, sürdürülebilirlik ve çevre bilinci', '🌍', '#10b981', 6),
  ('Financial Health', 'Finansal Sağlık', 'Mali güvenlik, bütçe yönetimi ve finansal planlama', '💰', '#eab308', 7),
  ('Spiritual Health', 'Ruhsal / Manevi Sağlık', 'Anlam, değerler ve manevi tatmin', '✨', '#8b5cf6', 8);

-- ========================================
-- 3. SURVEY QUESTIONS (Her kategori için 5 soru = 40 soru)
-- ========================================
-- Fiziksel Sağlık
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Son bir ayda düzenli olarak fiziksel aktivite yaptınız mı?', 1 FROM wellbeing_dimensions WHERE name = 'Physical Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Beslenme alışkanlıklarınızdan ne kadar memnunsunuz?', 2 FROM wellbeing_dimensions WHERE name = 'Physical Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Uyku kalitenizi nasıl değerlendiriyorsunuz?', 3 FROM wellbeing_dimensions WHERE name = 'Physical Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Genel enerji seviyeniz nasıl?', 4 FROM wellbeing_dimensions WHERE name = 'Physical Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Bedensel olarak kendinizi ne kadar sağlıklı hissediyorsunuz?', 5 FROM wellbeing_dimensions WHERE name = 'Physical Health';

-- Sosyal Sağlık
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'İş arkadaşlarınızla ilişkilerinizden memnun musunuz?', 6 FROM wellbeing_dimensions WHERE name = 'Social Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Sosyal destek ağınızı yeterli buluyor musunuz?', 7 FROM wellbeing_dimensions WHERE name = 'Social Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Kendinizi toplumun bir parçası olarak hissediyor musunuz?', 8 FROM wellbeing_dimensions WHERE name = 'Social Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'İletişim becerilerinizden ne kadar memnunsunuz?', 9 FROM wellbeing_dimensions WHERE name = 'Social Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'İş dışı sosyal aktiviteleriniz yeterli mi?', 10 FROM wellbeing_dimensions WHERE name = 'Social Health';

-- Entelektüel Sağlık
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Yeni şeyler öğrenme fırsatları buluyor musunuz?', 11 FROM wellbeing_dimensions WHERE name = 'Intellectual Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Zihinsel olarak kendinizi ne kadar gelişmiş hissediyorsunuz?', 12 FROM wellbeing_dimensions WHERE name = 'Intellectual Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Problem çözme becerilerinizden memnun musunuz?', 13 FROM wellbeing_dimensions WHERE name = 'Intellectual Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Yaratıcılığınızı ifade edebiliyor musunuz?', 14 FROM wellbeing_dimensions WHERE name = 'Intellectual Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'İşiniz size entelektüel tatmin sağlıyor mu?', 15 FROM wellbeing_dimensions WHERE name = 'Intellectual Health';

-- Duygusal ve Zihinsel Sağlık
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Duygularınızı yönetmekte zorlanıyor musunuz?', 16 FROM wellbeing_dimensions WHERE name = 'Emotional and Mental Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Stres seviyenizi nasıl değerlendiriyorsunuz?', 17 FROM wellbeing_dimensions WHERE name = 'Emotional and Mental Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Duygusal olarak kendinizi iyi hissediyor musunuz?', 18 FROM wellbeing_dimensions WHERE name = 'Emotional and Mental Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Odaklanma ve konsantrasyon gücünüz yeterli mi?', 19 FROM wellbeing_dimensions WHERE name = 'Emotional and Mental Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Genel ruh halinizden ve zihinsel netliğinizden memnun musunuz?', 20 FROM wellbeing_dimensions WHERE name = 'Emotional and Mental Health';

-- Mesleki Sağlık
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'İşinizden memnun musunuz?', 21 FROM wellbeing_dimensions WHERE name = 'Occupational Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'İş-yaşam dengenizden memnun musunuz?', 22 FROM wellbeing_dimensions WHERE name = 'Occupational Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Kariyer gelişiminizden memnun musunuz?', 23 FROM wellbeing_dimensions WHERE name = 'Occupational Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'İşyerinde takdir ediliyor musunuz?', 24 FROM wellbeing_dimensions WHERE name = 'Occupational Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Mesleki hedeflerinize ulaşabiliyor musunuz?', 25 FROM wellbeing_dimensions WHERE name = 'Occupational Health';

-- Çevresel Sağlık
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Çalışma ortamınızdan memnun musunuz?', 26 FROM wellbeing_dimensions WHERE name = 'Environmental Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Çevre bilincine sahip olduğunuzu düşünüyor musunuz?', 27 FROM wellbeing_dimensions WHERE name = 'Environmental Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Yaşadığınız ortamdan memnun musunuz?', 28 FROM wellbeing_dimensions WHERE name = 'Environmental Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Sürdürülebilir yaşam alışkanlıklarınız var mı?', 29 FROM wellbeing_dimensions WHERE name = 'Environmental Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Doğayla bağlantınız yeterli mi?', 30 FROM wellbeing_dimensions WHERE name = 'Environmental Health';

-- Finansal Sağlık
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Mali durumunuzdan memnun musunuz?', 31 FROM wellbeing_dimensions WHERE name = 'Financial Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Bütçe yönetiminizden memnun musunuz?', 32 FROM wellbeing_dimensions WHERE name = 'Financial Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Mali geleceğiniz konusunda endişeli misiniz?', 33 FROM wellbeing_dimensions WHERE name = 'Financial Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Tasarruf alışkanlıklarınız yeterli mi?', 34 FROM wellbeing_dimensions WHERE name = 'Financial Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Finansal hedeflerinize ulaşabiliyor musunuz?', 35 FROM wellbeing_dimensions WHERE name = 'Financial Health';

-- Ruhsal / Manevi Sağlık
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Hayatınızda anlam ve amaç hissediyor musunuz?', 36 FROM wellbeing_dimensions WHERE name = 'Spiritual Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Değerlerinizle uyumlu yaşıyor musunuz?', 37 FROM wellbeing_dimensions WHERE name = 'Spiritual Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'İçsel huzurunuzdan memnun musunuz?', 38 FROM wellbeing_dimensions WHERE name = 'Spiritual Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Manevi tatmin yaşıyor musunuz?', 39 FROM wellbeing_dimensions WHERE name = 'Spiritual Health';
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT id, 'Yaşam amacınızı biliyor musunuz?', 40 FROM wellbeing_dimensions WHERE name = 'Spiritual Health';

-- ========================================
-- 4. FITTY ÖZEL HİZMETİ
-- ========================================
INSERT INTO events (company_id, dimension_id, title, description, event_type, location, start_time, end_time, max_participants, base_price, per_person_price)
VALUES (
  NULL::UUID,
  NULL::UUID,
  'Fitty - Esnek Spor ve Wellness Programı',
  'Üyelik gerektirmeden 500+ spor salonunda, 60+ şehirde dilediğiniz zaman spor yapın. Kullandığınız kadar ödeyin, yaptığınız antrenmanlarda puan kazanın. Yoga, pilates, fitness, yüzme ve daha fazlası - tek bir uygulama ile tüm spor aktivitelerine erişim.',
  'Tüm ihtiyaçlarınız için',
  'Türkiye Geneli - 500+ Anlaşmalı Spor Salonu',
  NOW(),
  NOW() + INTERVAL '365 days',
  999999,
  NULL,
  NULL
);

-- ========================================
-- 5. TÜM CSV EVENT'LERİ (114 ADET)
-- ========================================

-- FİZİKSEL SAĞLIK (34 event)
INSERT INTO events (company_id, dimension_id, title, description, event_type, location, start_time, end_time, max_participants, base_price, per_person_price)
SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Doğa Yürüyüşü ve Nefes Egzersizleri', 'Belgrad Ormanı''nda hafif tempolu yürüyüş ve stres azaltan nefes çalışmaları.', 'physical', 'Belgrad Ormanı', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '3 hours', 30, 5000.00, 150.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Lunch Time Pilates', 'Öğle arasında enerjiyi artıran 30 dakikalık pilates seansı.', 'physical', 'Ofis', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '30 minutes', 20, 3000.00, 100.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Ofiste Mobilite ve Esneme Seansı', 'Boyun–sırt–bel bölgelerine özel rahatlatıcı esneme hareketleri.', 'physical', 'Ofis', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '1 hour', 25, 2500.00, 80.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Postür Düzeltme Eğitimi', 'Masa başı duruş bozukluklarını gidermeye yönelik uygulamalı eğitim.', 'hybrid', 'Ofis / Online', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '2 hours', 30, 4000.00, 120.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Kurumsal Adım Yarışması', 'Ekipler arası adım yarışmasıyla günlük hareket motivasyonu.', 'physical', 'Şirket Çapında', NOW() + INTERVAL '10 days', NOW() + INTERVAL '40 days', 100, 8000.00, 50.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Ofiste Yoga Seansı', 'Rahatlama, esneme ve nefes çalışmalarını içeren yoga uygulaması.', 'physical', 'Ofis', NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days' + INTERVAL '1 hour', 20, 3500.00, 125.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Ofis İçi Medikal Egzersiz', 'Bel ve boyun ağrılarını azaltmak için fizyoterapist eşliğinde egzersizler.', 'physical', 'Ofis', NOW() + INTERVAL '6 days', NOW() + INTERVAL '6 days' + INTERVAL '1 hour', 15, 4500.00, 180.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Bisiklet Turu – Kurumsal Ride Day', 'Ekiplerle şehir içi/orman bisiklet etkinliği.', 'physical', 'Şehir / Orman', NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days' + INTERVAL '4 hours', 40, 12000.00, 200.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Spor Yapmaya Başlama Eğitimi', 'Hiç spor yapmamış kişiler için başlangıç rehberi.', 'online', 'Online', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '1 hour', 50, 2000.00, 75.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Kurumiçi Futbol Turnuvası', 'Kurumiçi Futbol Turnuvası', 'physical', 'Spor Sahası', NOW() + INTERVAL '20 days', NOW() + INTERVAL '20 days' + INTERVAL '6 hours', 60, 15000.00, 150.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Şirket Koşu Takımı Kurulumu', 'Koşu rutini, programlama ve antrenör desteği.', 'physical', 'Şehir', NOW() + INTERVAL '15 days', NOW() + INTERVAL '15 days' + INTERVAL '2 hours', 40, 6000.00, 120.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Doğa Fotograflı Yürüyüş Etkinliği', 'Yürüyüş + fotoğraf keşfi bir arada.', 'physical', 'Doğa', NOW() + INTERVAL '12 days', NOW() + INTERVAL '12 days' + INTERVAL '4 hours', 35, 5500.00, 140.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Ofis Dışı Fit Piknik', 'Hareket, oyun ve nefes çalışmalarının olduğu sosyal etkinlik.', 'physical', 'Park', NOW() + INTERVAL '18 days', NOW() + INTERVAL '18 days' + INTERVAL '5 hours', 50, 8000.00, 130.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), '5K Fun Run (şirket çapında koşu)', '5K Fun Run (şirket çapında koşu)', 'physical', 'Şehir', NOW() + INTERVAL '25 days', NOW() + INTERVAL '25 days' + INTERVAL '2 hours', 100, 10000.00, 100.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Postür analizi', 'Postür analizi', 'physical', 'Ofis', NOW() + INTERVAL '8 days', NOW() + INTERVAL '8 days' + INTERVAL '30 minutes', 30, 4000.00, 150.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Bioimpedans vücut analiz cihazı (yağ, kas, su oranı)', 'Bioimpedans vücut analiz cihazı (yağ, kas, su oranı)', 'physical', 'Ofis', NOW() + INTERVAL '9 days', NOW() + INTERVAL '9 days' + INTERVAL '15 minutes', 50, 3000.00, 80.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Kürek (Rowing) – Kurumsal Deneyim Etkinliği', 'Kürek (Rowing) – Kurumsal Deneyim Etkinliği', 'physical', 'Sahil', NOW() + INTERVAL '22 days', NOW() + INTERVAL '22 days' + INTERVAL '3 hours', 25, 12000.00, 250.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Bowling Turnuvası', 'Bowling Turnuvası', 'physical', 'Bowling Salonu', NOW() + INTERVAL '11 days', NOW() + INTERVAL '11 days' + INTERVAL '3 hours', 40, 6000.00, 120.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Okçuluk Deneyimi', 'Okçuluk Deneyimi', 'physical', 'Okçuluk Sahası', NOW() + INTERVAL '16 days', NOW() + INTERVAL '16 days' + INTERVAL '2 hours', 30, 7000.00, 150.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Masa Tenisi Challenge', 'Masa Tenisi Challenge', 'physical', 'Ofis / Spor Salonu', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '2 hours', 20, 3000.00, 80.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Dart Turnuvası', 'Dart Turnuvası', 'physical', 'Ofis / Mekan', NOW() + INTERVAL '9 days', NOW() + INTERVAL '9 days' + INTERVAL '2 hours', 25, 2500.00, 70.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Tırmanış Duvarı Etkinliği', 'Tırmanış Duvarı Etkinliği', 'physical', 'Tırmanış Merkezi', NOW() + INTERVAL '19 days', NOW() + INTERVAL '19 days' + INTERVAL '3 hours', 20, 8000.00, 180.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'VR Spor Deneyimi', 'VR Spor Deneyimi', 'physical', 'VR Center', NOW() + INTERVAL '13 days', NOW() + INTERVAL '13 days' + INTERVAL '2 hours', 30, 5000.00, 120.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Tenis Klubü', 'Tenis Klubü', 'physical', 'Tenis Kortu', NOW() + INTERVAL '21 days', NOW() + INTERVAL '21 days' + INTERVAL '2 hours', 16, 6000.00, 150.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Basketbol Turnuvası', 'Basketbol Turnuvası', 'physical', 'Basketbol Sahası', NOW() + INTERVAL '24 days', NOW() + INTERVAL '24 days' + INTERVAL '4 hours', 40, 8000.00, 100.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Denizde Kürek Board (SUP)', 'Denizde Kürek Board (SUP)', 'physical', 'Sahil', NOW() + INTERVAL '28 days', NOW() + INTERVAL '28 days' + INTERVAL '3 hours', 20, 10000.00, 200.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Kurumsal Voleybol Mini Turnuvası', 'Kurumsal Voleybol Mini Turnuvası', 'physical', 'Voleybol Sahası', NOW() + INTERVAL '17 days', NOW() + INTERVAL '17 days' + INTERVAL '3 hours', 36, 5000.00, 90.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Petwalk – Çalışanlar ve Evcil Hayvanlarıyla Yürüyüş', 'Şirket çalışanları evcil hayvanlarıyla buluşarak yürüyüş yapar.', 'physical', 'Park', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days' + INTERVAL '2 hours', 50, 3000.00, 60.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Egzersiz & Hareket Webinarları', 'Egzersiz & Hareket Webinarları', 'online', 'Online', NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days' + INTERVAL '1 hour', 100, 2000.00, 50.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'İş Yerinde Sağlıklı Atıştırmalık Workshop', 'İş Yerinde Sağlıklı Atıştırmalık Workshop', 'physical', 'Ofis', NOW() + INTERVAL '6 days', NOW() + INTERVAL '6 days' + INTERVAL '1 hour', 40, 3500.00, 80.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Egzersiz – Hareket Temelli Workshop''lar', 'Egzersiz – Hareket Temelli Workshop''lar', 'physical', 'Ofis', NOW() + INTERVAL '8 days', NOW() + INTERVAL '8 days' + INTERVAL '2 hours', 30, 4000.00, 100.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Yoga – Pilates – Esneklik Workshop''ları', 'Yoga – Pilates – Esneklik Workshop''ları', 'physical', 'Ofis', NOW() + INTERVAL '11 days', NOW() + INTERVAL '11 days' + INTERVAL '2 hours', 25, 4500.00, 120.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Nefes – Stres Azaltma Workshop''ları', 'Nefes – Stres Azaltma Workshop''ları', 'hybrid', 'Ofis / Online', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '1 hour', 40, 3000.00, 85.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'), 'Biyomekanik – Postür – Sağlık Workshop''ları', 'Biyomekanik – Postür – Sağlık Workshop''ları', 'physical', 'Ofis', NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days' + INTERVAL '2 hours', 30, 5000.00, 130.00;

-- SOSYAL SAĞLIK (17 event)
INSERT INTO events (company_id, dimension_id, title, description, event_type, location, start_time, end_time, max_participants, base_price, per_person_price)
SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Social Health'), 'Ofiste Quiz Night', 'Ekiplerden oluşan gruplarla eğlenceli bilgi yarışması.', 'physical', 'Ofis', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '2 hours', 40, 3000.00, 100.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Social Health'), 'Blind Coffee / Random Coffee', 'Çalışanlar rastgele eşleşir ve kahve içip tanışır.', 'physical', 'Ofis / Cafe', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '1 hour', 30, 2000.00, 80.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Social Health'), 'Tanışma Bingo (Icebreaker Oyunu)', 'Departmanlar arası kaynaşmayı artıran eğlenceli bingo kartları.', 'physical', 'Ofis', NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days' + INTERVAL '1 hour', 50, 2500.00, 75.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Social Health'), 'Social Picnic (Ekip Pikniği)', 'Oyun + sohbet + tanışma aktiviteleri içeren sosyal piknik.', 'physical', 'Park / Açık Alan', NOW() + INTERVAL '12 days', NOW() + INTERVAL '12 days' + INTERVAL '4 hours', 60, 8000.00, 120.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Social Health'), 'Takım Yemekleri / Potluck Day', 'Her çalışan bir yemek getirir → kültür paylaşımı artar.', 'physical', 'Ofis', NOW() + INTERVAL '8 days', NOW() + INTERVAL '8 days' + INTERVAL '2 hours', 40, 3500.00, 100.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Social Health'), 'Oyun Gecesi (Board Game Night)', 'Tabu, Dixit, Monopoly, Uno, Jenga vb.', 'physical', 'Ofis / Event Space', NOW() + INTERVAL '6 days', NOW() + INTERVAL '6 days' + INTERVAL '3 hours', 35, 4000.00, 90.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Social Health'), 'Team Building Parkuru (İstasyon Görevleri)', 'Takımlar iş birliği ile fiziksel ve zihinsel görev çözer.', 'physical', 'Açık Alan', NOW() + INTERVAL '15 days', NOW() + INTERVAL '15 days' + INTERVAL '4 hours', 50, 10000.00, 150.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Social Health'), 'Kültür Buluşması Günü', 'Her çalışan kendi kültürel öğesini tanıtır.', 'physical', 'Ofis', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days' + INTERVAL '2 hours', 45, 3500.00, 85.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Social Health'), 'Comedy Night', 'Stand-up veya doğaçlama komedi etkinliği.', 'physical', 'Event Space', NOW() + INTERVAL '18 days', NOW() + INTERVAL '18 days' + INTERVAL '2 hours', 80, 12000.00, 150.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Social Health'), 'Kitap Kulübü', 'Aylık seçilen kitap üzerine çalışan sohbeti.', 'hybrid', 'Ofis / Online', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days' + INTERVAL '1 hour', 25, 1500.00, 60.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Social Health'), 'Fotoğraf Yürüyüşü', 'Çalışanlar şehirde çekim yapar ve en iyiler oylanır.', 'physical', 'Şehir', NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days' + INTERVAL '3 hours', 30, 4000.00, 100.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Social Health'), 'Online Quiz Night', 'Zoom üzerinden interaktif quiz.', 'online', 'Online', NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days' + INTERVAL '1 hour', 100, 2000.00, 50.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Social Health'), 'Online Kahve Sohbetleri', 'Rastgele eşleşme + 15 dakika tanışma.', 'online', 'Online', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '15 minutes', 50, 1000.00, 30.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Social Health'), 'Online Tabu / Skribbl / Gartic Phone', 'Dijital oyunlarla sosyal bağlantı.', 'online', 'Online', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '1 hour', 60, 1500.00, 40.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Social Health'), 'Sosyal Sağlık Webinarları (Eğitim İçerikleri)', 'Beslenme kapsamında hazırlanan etkinlik. Çalışan wellbeing düzeyini artırmak için tasarlanmıştır.', 'online', 'Online', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '1 hour', 100, 2000.00, 50.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Social Health'), 'İletişim Becerileri Workshop', 'Dinleme, soru sorma, geri bildirim.', 'physical', 'Ofis', NOW() + INTERVAL '9 days', NOW() + INTERVAL '9 days' + INTERVAL '2 hours', 30, 4000.00, 110.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Social Health'), 'Sosyal Sağlık Workshopları', 'Sosyal Sağlık Workshopları', 'physical', 'Ofis', NOW() + INTERVAL '12 days', NOW() + INTERVAL '12 days' + INTERVAL '2 hours', 35, 4500.00, 120.00;

-- ENTELEKTÜEL SAĞLIK (10 event)
INSERT INTO events (company_id, dimension_id, title, description, event_type, location, start_time, end_time, max_participants, base_price, per_person_price)
SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Intellectual Health'), 'Kitap Kulübü Buluşması', 'Aylık seçilen bir kitabın tartışıldığı entelektüel sohbet etkinliği.', 'hybrid', 'Ofis / Online', NOW() + INTERVAL '8 days', NOW() + INTERVAL '8 days' + INTERVAL '1 hour', 30, 2000.00, 70.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Intellectual Health'), 'Merak Günü Etkinliği', 'Çalışanlar iş dışı ilgilerini 5 dakikalık kısa sunumlarla paylaşır.', 'physical', 'Ofis', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days' + INTERVAL '2 hours', 40, 2500.00, 80.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Intellectual Health'), 'Fikir Paylaşım Çemberi (Think Circle)', 'Bir konu belirlenir → herkes sırayla fikir ve deneyim paylaşır.', 'physical', 'Ofis', NOW() + INTERVAL '6 days', NOW() + INTERVAL '6 days' + INTERVAL '1 hour', 25, 1800.00, 65.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Intellectual Health'), 'Lego Serious Play Seansı', 'Çalışanlar lego ile soyut kavramları somut olarak modeller.', 'physical', 'Workshop Space', NOW() + INTERVAL '12 days', NOW() + INTERVAL '12 days' + INTERVAL '3 hours', 20, 8000.00, 250.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Intellectual Health'), 'Fikir Maratonu (Idea Marathon)', 'Çalışanlar bir sorun üzerine 2 saatlik fikir üretir.', 'physical', 'Ofis', NOW() + INTERVAL '9 days', NOW() + INTERVAL '9 days' + INTERVAL '2 hours', 30, 3500.00, 100.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Intellectual Health'), 'Reverse Brainstorming', 'Bu sorunu nasıl çözemeyiz? üzerinden tersine düşünme tekniği.', 'physical', 'Ofis', NOW() + INTERVAL '11 days', NOW() + INTERVAL '11 days' + INTERVAL '1 hour', 25, 3000.00, 90.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Intellectual Health'), 'Şehir Keşif Etkinliği (Cultural Walk)', 'Tarihi bölgeler, sergiler veya müzeler gezilir.', 'physical', 'Şehir', NOW() + INTERVAL '16 days', NOW() + INTERVAL '16 days' + INTERVAL '4 hours', 35, 6000.00, 130.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Intellectual Health'), 'ChatGPT ile Brainstorming Oturumu', 'AI destekli fikir üretme aktivitesi.', 'online', 'Online', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '1 hour', 50, 2500.00, 75.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Intellectual Health'), 'Entelektüel Sağlık Webinarları', 'Entelektüel Sağlık Webinarları', 'online', 'Online', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '1 hour', 100, 2000.00, 50.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Intellectual Health'), 'Entelektüel Sağlık Workshopları', 'Entelektüel Sağlık Workshopları', 'physical', 'Ofis', NOW() + INTERVAL '13 days', NOW() + INTERVAL '13 days' + INTERVAL '2 hours', 30, 4000.00, 110.00;

-- DUYGUSAL VE ZİHİNSEL SAĞLIK (12 event)
INSERT INTO events (company_id, dimension_id, title, description, event_type, location, start_time, end_time, max_participants, base_price, per_person_price)
SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Emotional and Mental Health'), 'Sanat Terapisi Atölyesi (Art Therapy)', 'Renk, çizim ve şekillerle ifade odaklı terapi etkinliği.', 'physical', 'Workshop Space', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days' + INTERVAL '2 hours', 20, 5000.00, 180.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Emotional and Mental Health'), 'Mandala Boyama Etkinliği', 'Odaklanma ve duygu düzenleme sağlayan rahatlatıcı etkinlik.', 'physical', 'Ofis', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '1 hour', 25, 2500.00, 90.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Emotional and Mental Health'), 'Gratitude (Şükran) Aktivitesi', 'Gün içinde minnet duyulan şeyleri yazma ve paylaşma.', 'physical', 'Ofis', NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days' + INTERVAL '30 minutes', 40, 1500.00, 50.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Emotional and Mental Health'), 'Stres Çözme Günleri', 'Foam roller, nefes, esneme ve rahatlama alanları kurulur.', 'physical', 'Ofis', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '4 hours', 50, 6000.00, 100.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Emotional and Mental Health'), 'Duygusal İlk Yardım Eğitimi', 'Zor anlarda kendine destek pratikleri.', 'online', 'Online', NOW() + INTERVAL '8 days', NOW() + INTERVAL '8 days' + INTERVAL '1 hour', 60, 3000.00, 85.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Emotional and Mental Health'), 'Duygusal Sağlık Webinarları', 'Duygusal Sağlık Webinarları', 'online', 'Online', NOW() + INTERVAL '6 days', NOW() + INTERVAL '6 days' + INTERVAL '1 hour', 100, 2000.00, 50.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Emotional and Mental Health'), 'Duygusal Sağlık Workshopları', 'Duygusal Sağlık Workshopları', 'physical', 'Ofis', NOW() + INTERVAL '11 days', NOW() + INTERVAL '11 days' + INTERVAL '2 hours', 30, 4000.00, 110.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Emotional and Mental Health'), 'Mindfulness Seansı', 'Zihni sakinleştirme, nefes ve farkındalık çalışması.', 'hybrid', 'Ofis / Online', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '45 minutes', 30, 2500.00, 85.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Emotional and Mental Health'), 'Koku Terapisi Etkinliği', 'Aromaterapi ile zihni rahatlatma.', 'physical', 'Wellness Center', NOW() + INTERVAL '9 days', NOW() + INTERVAL '9 days' + INTERVAL '1 hour', 20, 3500.00, 120.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Emotional and Mental Health'), 'Zihin Haritalama Etkinliği', 'Mind map oluşturma ve fikir düzenleme.', 'physical', 'Ofis', NOW() + INTERVAL '6 days', NOW() + INTERVAL '6 days' + INTERVAL '1 hour', 25, 2000.00, 75.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Emotional and Mental Health'), 'Zihinsel Sağlık Webinarları', 'Zihinsel Sağlık Webinarları', 'online', 'Online', NOW() + INTERVAL '8 days', NOW() + INTERVAL '8 days' + INTERVAL '1 hour', 100, 2000.00, 50.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Emotional and Mental Health'), 'Zihinsel Sağlık Workshopları', 'Zihinsel Sağlık Workshopları', 'physical', 'Ofis', NOW() + INTERVAL '12 days', NOW() + INTERVAL '12 days' + INTERVAL '2 hours', 30, 4000.00, 110.00;

-- MESLEKİ SAĞLIK (10 event)
INSERT INTO events (company_id, dimension_id, title, description, event_type, location, start_time, end_time, max_participants, base_price, per_person_price)
SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Occupational Health'), 'Kariyer Buluşmaları – Tecrübe Paylaşımı', 'Farklı departmanlar kendi kariyer hikâyelerini paylaşır.', 'physical', 'Ofis', NOW() + INTERVAL '12 days', NOW() + INTERVAL '12 days' + INTERVAL '2 hours', 35, 2500.00, 80.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Occupational Health'), 'İşini Anlat Mini Sunumları', 'Her çalışan rolünü 5 dakikalık hızlı sunumla tanıtır → görünürlük artar.', 'physical', 'Ofis', NOW() + INTERVAL '8 days', NOW() + INTERVAL '8 days' + INTERVAL '1 hour', 40, 2000.00, 70.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Occupational Health'), 'Mentorluk Launch Etkinliği', 'Şirkette mentor–mentee eşleşmeleri duyurulur.', 'physical', 'Ofis', NOW() + INTERVAL '15 days', NOW() + INTERVAL '15 days' + INTERVAL '2 hours', 50, 3500.00, 90.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Occupational Health'), 'Hedef Planlama Oturumu', 'Kariyer hedefleri için ekip destekli seans.', 'hybrid', 'Ofis / Online', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days' + INTERVAL '1 hour', 30, 2800.00, 95.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Occupational Health'), 'Sektör Sohbetleri (Guest Talk)', 'Sektörden misafir konuşmacılar davet edilerek bilgi paylaşımı yapılır.', 'hybrid', 'Ofis / Online', NOW() + INTERVAL '18 days', NOW() + INTERVAL '18 days' + INTERVAL '1 hour', 60, 5000.00, 100.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Occupational Health'), 'Kariyer Netliği Programı', 'İçsel değerler, kariyer yönü, güç–zayıf analizleri yapılır.', 'physical', 'Ofis', NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days' + INTERVAL '2 hours', 25, 4500.00, 130.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Occupational Health'), 'Online Mentorluk Buluşmaları', 'Zoom üzerinden mentor–mentee seansları.', 'online', 'Online', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '30 minutes', 40, 1500.00, 60.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Occupational Health'), 'Digital Networking Day', 'Breakout rooms ile tanışma ve bilgi paylaşımı.', 'online', 'Online', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '2 hours', 80, 3000.00, 70.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Occupational Health'), 'Mesleki Sağlık Webinarları', 'Mesleki Sağlık Webinarları', 'online', 'Online', NOW() + INTERVAL '9 days', NOW() + INTERVAL '9 days' + INTERVAL '1 hour', 100, 2000.00, 50.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Occupational Health'), 'Mesleki Sağlık Workshopları', 'Mesleki Sağlık Workshopları', 'physical', 'Ofis', NOW() + INTERVAL '13 days', NOW() + INTERVAL '13 days' + INTERVAL '2 hours', 30, 4000.00, 110.00;

-- ÇEVRESEL SAĞLIK (12 event)
INSERT INTO events (company_id, dimension_id, title, description, event_type, location, start_time, end_time, max_participants, base_price, per_person_price)
SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Environmental Health'), 'Ofis Yeşillendirme Etkinliği (Plant Your Desk Day)', 'Çalışanlar masalarına bitki eker → bitki bakım eğitimi verilir.', 'physical', 'Ofis', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '2 hours', 50, 4000.00, 100.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Environmental Health'), 'Sıfır Atık Günü – Atık Ayrıştırma Etkinliği', 'Ofis içinde geri dönüşüm istasyonları kurulup farkındalık sağlanır.', 'physical', 'Ofis', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days' + INTERVAL '4 hours', 60, 5000.00, 80.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Environmental Health'), 'Eko-Yürüyüş (Eco Walk)', 'Doğada rehber eşliğinde çevresel farkındalık yürüyüşü.', 'physical', 'Doğa', NOW() + INTERVAL '12 days', NOW() + INTERVAL '12 days' + INTERVAL '3 hours', 40, 6000.00, 120.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Environmental Health'), 'Masa Düzeni & Temizlik Challenge', 'Minimalist masa düzeni → en düzenli masaya ödül.', 'physical', 'Ofis', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '1 hour', 50, 2000.00, 60.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Environmental Health'), 'Kıyı / Orman Temizliği Etkinliği', 'Kurumsal gönüllülük + doğal alan temizliği.', 'physical', 'Kıyı / Orman', NOW() + INTERVAL '18 days', NOW() + INTERVAL '18 days' + INTERVAL '4 hours', 50, 7000.00, 90.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Environmental Health'), 'Çevre Dostu Alışkanlıklar Görev Programı', 'Her gün uygulanabilir küçük değişiklikler.', 'hybrid', 'Ofis / Online', NOW() + INTERVAL '6 days', NOW() + INTERVAL '6 days' + INTERVAL '1 hour', 60, 2500.00, 65.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Environmental Health'), 'Toprakla Buluşma – Mini Bahçe Aktivitesi', 'Ofis bahçesinde veya masada mini saksı ekimi.', 'physical', 'Ofis / Bahçe', NOW() + INTERVAL '8 days', NOW() + INTERVAL '8 days' + INTERVAL '1 hour', 40, 3000.00, 80.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Environmental Health'), 'Online Sıfır Atık Eğitimi + Quiz', 'Online Sıfır Atık Eğitimi + Quiz', 'online', 'Online', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '1 hour', 100, 2000.00, 50.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Environmental Health'), 'Evde Sürdürülebilir Yaşam Atölyesi', 'Ev içi enerji, su ve plastik kullanımını azaltma teknikleri.', 'online', 'Online', NOW() + INTERVAL '9 days', NOW() + INTERVAL '9 days' + INTERVAL '1 hour', 70, 2500.00, 70.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Environmental Health'), 'Dijital Temizlik Günü', 'Dosyaları, e-postaları, masaüstünü temizleme.', 'online', 'Online', NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days' + INTERVAL '1 hour', 100, 1500.00, 40.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Environmental Health'), 'Çevresel Sağlık Webinarları', 'Çevresel Sağlık Webinarları', 'online', 'Online', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '1 hour', 100, 2000.00, 50.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Environmental Health'), 'Çevresel Sağlık Workshopları', 'Çevresel Sağlık Workshopları', 'physical', 'Ofis', NOW() + INTERVAL '11 days', NOW() + INTERVAL '11 days' + INTERVAL '2 hours', 30, 4000.00, 110.00;

-- FİNANSAL SAĞLIK (11 event)
INSERT INTO events (company_id, dimension_id, title, description, event_type, location, start_time, end_time, max_participants, base_price, per_person_price)
SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Financial Health'), 'Finansal Farkındalık Günü', 'Sosyal İyilik kapsamında hazırlanan etkinlik. Çalışan wellbeing düzeyini artırmak için tasarlanmıştır.', 'physical', 'Ofis', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days' + INTERVAL '4 hours', 50, 4000.00, 90.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Financial Health'), 'Finansal Sağlık', 'Ofiste mini stantlar, ipuçları panosu, quiz alanı.', 'physical', 'Ofis', NOW() + INTERVAL '8 days', NOW() + INTERVAL '8 days' + INTERVAL '3 hours', 60, 3500.00, 80.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Financial Health'), 'Paramı Yönetiyorum Mini Etkinlik', 'Kısa bireysel bütçe analizleri ve öneriler.', 'physical', 'Ofis', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '1 hour', 30, 3000.00, 100.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Financial Health'), 'Kahve ile Bütçe Sohbeti', 'Finansal koç eşliğinde küçük gruplarla sohbet.', 'physical', 'Cafe / Ofis', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '45 minutes', 20, 2500.00, 110.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Financial Health'), 'Finansal Sağlık Check-Up Standı', 'Hızlı borç–gelir–tasarruf analizi.', 'physical', 'Ofis', NOW() + INTERVAL '9 days', NOW() + INTERVAL '9 days' + INTERVAL '2 hours', 40, 3500.00, 95.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Financial Health'), 'Kahveyle Emeklilik Sohbeti', 'Emeklilik fonları, bireysel tasarruflar üzerine kısa konuşmalar.', 'physical', 'Cafe / Ofis', NOW() + INTERVAL '12 days', NOW() + INTERVAL '12 days' + INTERVAL '45 minutes', 25, 2800.00, 105.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Financial Health'), 'Market Challenge (Fiyat Bilinci Oyunu)', 'Çalışanlar fiyat tahmin yarışması yapar (eğlenceli + öğretici).', 'physical', 'Ofis', NOW() + INTERVAL '8 days', NOW() + INTERVAL '8 days' + INTERVAL '1 hour', 40, 2000.00, 75.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Financial Health'), 'No Spend Day – Harcamasız Gün', 'Ayda bir gün çalışanlar planlı harcama yapmadan geçirmeyi dener.', 'hybrid', 'Ofis / Online', NOW() + INTERVAL '6 days', NOW() + INTERVAL '6 days' + INTERVAL '1 hour', 50, 1500.00, 50.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Financial Health'), 'Abonelik Temizliği Challenge', 'Çalışanlar kullanmadığı dijital abonelikleri listeler.', 'online', 'Online', NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days' + INTERVAL '30 minutes', 100, 1000.00, 30.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Financial Health'), 'Finansal Sağlık Webinarları', 'Finansal Sağlık Webinarları', 'online', 'Online', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '1 hour', 100, 2000.00, 50.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Financial Health'), 'Finansal Sağlık Workshopları', 'Finansal Sağlık Workshopları', 'physical', 'Ofis', NOW() + INTERVAL '11 days', NOW() + INTERVAL '11 days' + INTERVAL '2 hours', 30, 4000.00, 110.00;

-- RUHSAL / MANEVİ SAĞLIK (8 event)
INSERT INTO events (company_id, dimension_id, title, description, event_type, location, start_time, end_time, max_participants, base_price, per_person_price)
SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Spiritual Health'), 'Farkındalık Yürüyüşü (Mindful Walk)', 'Sessiz, nefes odaklı rehberli yürüyüş.', 'physical', 'Park / Doğa', NOW() + INTERVAL '8 days', NOW() + INTERVAL '8 days' + INTERVAL '2 hours', 30, 3000.00, 95.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Spiritual Health'), 'Aromaterapi Deneyim Alanı', 'Lavanta, bergamot, adaçayı kokularıyla rahatlama.', 'physical', 'Wellness Center', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days' + INTERVAL '1 hour', 20, 3500.00, 125.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Spiritual Health'), 'Teşekkür Panosu (Gratitude Wall)', 'Çalışanlar minnettarlık notlarını duvara bırakır.', 'physical', 'Ofis', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '30 minutes', 50, 1500.00, 50.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Spiritual Health'), 'Değerler Keşfi Programı', 'Bireyin yaşam değerlerini bulması için adım adım görevler.', 'hybrid', 'Ofis / Online', NOW() + INTERVAL '15 days', NOW() + INTERVAL '15 days' + INTERVAL '2 hours', 25, 4000.00, 135.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Spiritual Health'), 'Duygu – Zihin – Ruh Bütünlüğü Programı', 'Bedensel ve ruhsal farkındalık görevleri birlikte yapılır.', 'physical', 'Ofis', NOW() + INTERVAL '12 days', NOW() + INTERVAL '12 days' + INTERVAL '3 hours', 30, 5000.00, 140.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Spiritual Health'), 'Online Ruhsal / Manevi Etkinlikler', 'Online Ruhsal / Manevi Etkinlikler', 'online', 'Online', NOW() + INTERVAL '6 days', NOW() + INTERVAL '6 days' + INTERVAL '1 hour', 80, 2000.00, 60.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Spiritual Health'), 'Ruhsal / Manevi Sağlık Webinarları', 'Ruhsal / Manevi Sağlık Webinarları', 'online', 'Online', NOW() + INTERVAL '8 days', NOW() + INTERVAL '8 days' + INTERVAL '1 hour', 100, 2000.00, 50.00
UNION ALL SELECT NULL::UUID, (SELECT id FROM wellbeing_dimensions WHERE name = 'Spiritual Health'), 'Ruhsal / Manevi Sağlık Workshopları', 'Ruhsal / Manevi Sağlık Workshopları', 'physical', 'Ofis', NOW() + INTERVAL '13 days', NOW() + INTERVAL '13 days' + INTERVAL '2 hours', 30, 4000.00, 110.00;

-- ========================================
-- BAŞARILI!
-- ========================================
SELECT 
  'Import completed!' as status,
  (SELECT COUNT(*) FROM wellbeing_dimensions) as dimensions_count,
  (SELECT COUNT(*) FROM survey_questions) as questions_count,
  (SELECT COUNT(*) FROM events) as events_count;

