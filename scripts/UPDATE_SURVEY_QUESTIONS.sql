-- ========================================
-- UPDATE SURVEY QUESTIONS
-- Yeni 50 soruluk wellbeing anketi
-- Her boyutun total puanlamaya eşit etkisi olacak
-- ========================================

-- Önce mevcut soruları sil
TRUNCATE TABLE survey_questions CASCADE;

-- ========================================
-- 1. FİZİKSEL SAĞLIK (8 SORU)
-- ========================================
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'),
  'Haftada en az 3 gün fiziksel aktivite yapıyorum.',
  1
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'),
  'Günde en az 7 saat uyuyorum.',
  2
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'),
  'Günlük beslenmem dengeli ve sağlıklıdır.',
  3
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'),
  'Gün içinde enerjik hissediyorum.',
  4
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'),
  'Su tüketimim yeterlidir (en az 1.5–2 litre/gün).',
  5
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'),
  'Fiziksel olarak herhangi bir ağrı ya da yorgunluk yaşamıyorum.',
  6
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'),
  'Son 1 yıl içinde sağlık kontrolü yaptırdım.',
  7
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Physical Health'),
  'Vücudumla ve fiziksel görünümümle barışığım.',
  8;

-- ========================================
-- 2. ZİHİNSEL / DUYGUSAL SAĞLIK (7 SORU)
-- ========================================
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Emotional and Mental Health'),
  'Son haftalarda genellikle iyi hissettim.',
  1
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Emotional and Mental Health'),
  'Günlük hayatımdaki zorluklarla başa çıkabiliyorum.',
  2
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Emotional and Mental Health'),
  'Kendimi sık sık stresli veya baskı altında hissediyorum.',
  3
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Emotional and Mental Health'),
  'Duygularımı ifade etmekte zorlanmıyorum.',
  4
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Emotional and Mental Health'),
  'İş dışındaki zamanlarda zihinsel olarak dinlenebiliyorum.',
  5
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Emotional and Mental Health'),
  'Uyandığımda hayata karşı motivasyon hissediyorum.',
  6
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Emotional and Mental Health'),
  'Son 6 ayda profesyonel bir ruh sağlığı desteği aldım/almak istedim.',
  7;

-- ========================================
-- 3. SOSYAL SAĞLIK (6 SORU)
-- ========================================
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Social Health'),
  'Yakın ilişki kurabildiğim arkadaşlarım veya aile bireylerim var.',
  1
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Social Health'),
  'İş arkadaşlarımla sağlıklı bir iletişimim var.',
  2
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Social Health'),
  'Kendimi sosyal ortamlarda rahat hissediyorum.',
  3
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Social Health'),
  'Gönüllü olarak bir topluluğa/gruba üyeyim.',
  4
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Social Health'),
  'Son bir ay içinde sosyal bir etkinliğe katıldım.',
  5
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Social Health'),
  'Yalnızlık hissini sık sık yaşamıyorum.',
  6;

-- ========================================
-- 4. MESLEKİ SAĞLIK (7 SORU)
-- ========================================
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Occupational Health'),
  'Yaptığım iş bana anlamlı geliyor.',
  1
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Occupational Health'),
  'İş yerinde kendimi değerli hissediyorum.',
  2
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Occupational Health'),
  'İş-yaşam dengem iyi durumda.',
  3
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Occupational Health'),
  'Yöneticimle olan iletişimim sağlıklı.',
  4
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Occupational Health'),
  'Yeteneklerimi kullanabildiğim bir pozisyondayım.',
  5
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Occupational Health'),
  'Geleceğim için iş yerimde gelişim fırsatları olduğunu düşünüyorum.',
  6
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Occupational Health'),
  'Her gün iş yerinde kaliteli bir şeyler yaptığımı hissediyorum.',
  7;

-- ========================================
-- 5. ENTELEKTÜEL SAĞLIK (5 SORU)
-- ========================================
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Intellectual Health'),
  'Yeni şeyler öğrenmekten keyif alırım.',
  1
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Intellectual Health'),
  'İş dışında zihnimi geliştirecek etkinliklere (kitap, seminer, kurs) zaman ayırırım.',
  2
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Intellectual Health'),
  'Güncel gelişmeleri takip ederim.',
  3
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Intellectual Health'),
  'Merak ettiğim konuları araştırmak için zaman ayırıyorum.',
  4
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Intellectual Health'),
  'Problem çözme ve analiz konularında kendime güveniyorum.',
  5;

-- ========================================
-- 6. ÇEVRESEL SAĞLIK (6 SORU)
-- ========================================
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Environmental Health'),
  'Çalışma ortamım fiziksel olarak güvenli ve rahattır.',
  1
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Environmental Health'),
  'Doğal ışık ve temiz hava aldığım bir ortamda çalışıyorum.',
  2
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Environmental Health'),
  'Ofisteki ekipmanlar (masa, sandalye, monitör) ergonomik.',
  3
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Environmental Health'),
  'Ev/çevre düzenim bana huzur veriyor.',
  4
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Environmental Health'),
  'Geri dönüşüm veya çevre bilinci konularında farkındalığım var.',
  5
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Environmental Health'),
  'Doğayla temas ettiğim aktivitelere zaman ayırıyorum.',
  6;

-- ========================================
-- 7. FİNANSAL SAĞLIK (6 SORU)
-- ========================================
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Financial Health'),
  'Temel ihtiyaçlarımı karşılarken zorlanmıyorum.',
  1
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Financial Health'),
  'Aylık harcamalarımı kontrol altında tutabiliyorum.',
  2
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Financial Health'),
  'Beklenmedik harcamalara karşı birikimim var.',
  3
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Financial Health'),
  'Finansal geleceğimle ilgili planlama yapıyorum.',
  4
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Financial Health'),
  'Borçlarım yaşam kalitemi olumsuz etkilemiyor.',
  5
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Financial Health'),
  'Finansal konularda kendimi bilgili ve yeterli hissediyorum.',
  6;

-- ========================================
-- 8. RUHSAL / MANEVİ SAĞLIK (5 SORU)
-- ========================================
INSERT INTO survey_questions (dimension_id, question_text_tr, order_index)
SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Spiritual Health'),
  'Hayatımın bir anlamı ve amacı olduğuna inanıyorum.',
  1
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Spiritual Health'),
  'Zor zamanlarda içsel gücüm bana destek olur.',
  2
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Spiritual Health'),
  'Manevi/dini değerlerim hayatıma yön verir.',
  3
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Spiritual Health'),
  'Meditasyon, dua, farkındalık gibi uygulamalar yaparım.',
  4
UNION ALL SELECT 
  (SELECT id FROM wellbeing_dimensions WHERE name = 'Spiritual Health'),
  'Yaşadığım olaylarda pozitif bir anlam bulabilirim.',
  5;

-- ========================================
-- BAŞARI MESAJI
-- ========================================
SELECT 
  '✅ ANKET SORULARI GÜNCELLENDİ!' as result,
  '' as blank1,
  '📊 YENİ ANKET SİSTEMİ:' as section1,
  '• Toplam 50 soru' as total_questions,
  '• 8 wellbeing boyutu' as dimensions,
  '• Her boyutun eşit ağırlığı var' as equal_weight,
  '' as blank2,
  '📈 SORU DAĞILIMI:' as section2,
  '1️⃣ Fiziksel Sağlık: 8 soru' as dim1,
  '2️⃣ Zihinsel/Duygusal: 7 soru' as dim2,
  '3️⃣ Sosyal Sağlık: 6 soru' as dim3,
  '4️⃣ Mesleki Sağlık: 7 soru' as dim4,
  '5️⃣ Entelektüel: 5 soru' as dim5,
  '6️⃣ Çevresel: 6 soru' as dim6,
  '7️⃣ Finansal: 6 soru' as dim7,
  '8️⃣ Ruhsal/Manevi: 5 soru' as dim8,
  '' as blank3,
  '⚙️ SKORLAMA:' as scoring,
  '• Likert 1-5 (Hiç katılmıyorum → Tamamen katılıyorum)' as scale,
  '• Her boyutun ortalaması alınır (eşit ağırlık)' as method,
  '• 8 boyutun ortalaması = Genel WellScore' as final;

