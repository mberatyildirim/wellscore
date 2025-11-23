-- ========================================
-- ADD AI_RECOMMENDATIONS TO PROFILES TABLE
-- ========================================
-- This script adds an ai_recommendations JSONB field to the profiles table
-- to store AI-generated recommendations including event suggestions and wellbeing tips

-- Add ai_recommendations column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS ai_recommendations JSONB DEFAULT NULL;

-- Add comment to column
COMMENT ON COLUMN profiles.ai_recommendations IS 'AI-generated recommendations including recommended events and wellbeing tips. Format: { "wellbeing_tips": [...], "recommended_events": [{ "event_id": "...", "reason": "..." }], "generated_at": "..." }';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_ai_recommendations ON profiles USING GIN (ai_recommendations);

-- Success message
SELECT '✅ AI recommendations field added to profiles table!' as result;

