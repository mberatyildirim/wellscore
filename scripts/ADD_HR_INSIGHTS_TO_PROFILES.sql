-- ========================================
-- ADD HR INSIGHTS COLUMN TO PROFILES
-- Stores HR AI insights as JSONB
-- ========================================

-- Add hr_insights column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS hr_insights JSONB;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_hr_insights ON profiles USING GIN (hr_insights) WHERE hr_insights IS NOT NULL;

COMMENT ON COLUMN profiles.hr_insights IS 'HR admin için AI tarafından oluşturulan şirket geneli wellbeing içgörüleri (JSONB formatında)';

