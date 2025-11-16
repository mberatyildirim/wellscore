export type UserRole = 'employee' | 'hr_admin' | 'super_admin';

export type RecommendationTimeframe = 'short_term' | 'medium_term' | 'long_term';

export type BudgetLevel = 'low' | 'medium' | 'high';

export type ContentType = 'article' | 'video' | 'workshop' | 'webinar' | 'exercise';

export type EventType = 'physical' | 'online' | 'hybrid';

export interface Company {
  id: string;
  name: string;
  industry: string | null;
  employee_count: number | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  company_id: string | null;
  role: UserRole;
  email: string;
  full_name: string | null;
  department: string | null;
  city: string | null;
  age: number | null;
  gender: string | null;
  anonymous_token: string;
  created_at: string;
  updated_at: string;
}

export interface WellbeingDimension {
  id: string;
  name: string;
  name_tr: string;
  description: string | null;
  order_index: number;
  created_at: string;
}

export interface SurveyQuestion {
  id: string;
  dimension_id: string;
  question_text: string;
  question_text_tr: string;
  order_index: number;
  created_at: string;
}

export interface SurveyResponse {
  id: string;
  user_id: string;
  company_id: string;
  completed_at: string;
  created_at: string;
}

export interface SurveyAnswer {
  id: string;
  response_id: string;
  question_id: string;
  score: number;
  created_at: string;
}

export interface Recommendation {
  id: string;
  user_id: string;
  response_id: string;
  dimension_id: string | null;
  timeframe: RecommendationTimeframe;
  recommendation_text: string;
  created_at: string;
}

export interface HRAction {
  id: string;
  company_id: string;
  dimension_id: string | null;
  title: string;
  description: string | null;
  budget_level: BudgetLevel | null;
  target_employee_count: number | null;
  status: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface WellbeingContent {
  id: string;
  title: string;
  description: string | null;
  content_type: ContentType;
  dimension_id: string | null;
  url: string | null;
  thumbnail_url: string | null;
  duration_minutes: number | null;
  visible_to_all: boolean;
  created_at: string;
}

export interface Event {
  id: string;
  company_id: string;
  title: string;
  description: string | null;
  event_type: EventType;
  dimension_id: string | null;
  location: string | null;
  meeting_url: string | null;
  start_time: string;
  end_time: string;
  capacity: number | null;
  created_by: string | null;
  created_at: string;
}

export interface MarketplaceService {
  id: string;
  provider_name: string;
  service_name: string;
  description: string | null;
  dimension_id: string | null;
  price_range: string | null;
  duration: string | null;
  service_type: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website_url: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}
