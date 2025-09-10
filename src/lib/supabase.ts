import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pmqcegwfucfbwwmwumkk.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtcWNlZ3dmdWNmYnd3bXd1bWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTc3NzMsImV4cCI6MjA3MjkzMzc3M30.1oXas_KE7PBq6GyjOkV9lFZaAqQZGlE-8YLCSNgnDjc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Category {
  id: number
  name: string
  description: string | null
  slug: string
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  currency: string
  category_id: number | null
  sku: string | null
  stock_quantity: number
  weight_grams: number | null
  origin_country: string | null
  brand: string | null
  image_urls: string[] | null
  slug: string
  is_active: boolean
  featured: boolean
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  date_of_birth: string | null
  preferred_currency: string
  shipping_address: any | null
  billing_address: any | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: number
  user_id: string
  product_id: number
  quantity: number
  created_at: string
  updated_at: string
}

export interface Order {
  id: number
  user_id: string | null
  order_number: string
  status: string
  total_amount: number
  currency: string
  shipping_address: any | null
  billing_address: any | null
  customer_email: string | null
  coupon_code: string | null
  discount_amount: number
  shipping_cost: number
  stripe_payment_intent_id: string | null
  created_at: string
  updated_at: string
}

export interface Review {
  id: number
  product_id: number
  user_id: string
  rating: number
  title: string | null
  comment: string | null
  verified_purchase: boolean
  created_at: string
  updated_at: string
}

export interface Coupon {
  id: number
  code: string
  description: string | null
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  minimum_order_amount: number
  usage_limit: number | null
  times_used: number
  expires_at: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// World Cup 2026 Types
export interface Country {
  id: number
  country_code: string
  country_name: string
  flag_emoji: string
  continent: string
  fifa_ranking: number
  traditional_candy: string
  candy_description: string
  cultural_background: string
  flag_colors: string[]
  capital_city: string
  created_at: string
}

export interface Match {
  id: number
  match_number: number
  home_team_code: string
  away_team_code: string
  match_date: string
  venue: string
  stage: string
  home_score: number | null
  away_score: number | null
  status: string
  created_at: string
  updated_at: string
}

export interface Prediction {
  id: number
  user_id: string
  match_id: number
  predicted_home_score: number
  predicted_away_score: number
  points_earned: number
  is_correct: boolean | null
  prediction_type: string
  created_at: string
  updated_at: string
}

export interface UserAchievement {
  id: number
  user_id: string
  achievement_type: string
  achievement_name: string
  achievement_description: string
  badge_image_url: string | null
  points_awarded: number
  earned_at: string
  metadata: any
}

export interface UserCountryCollection {
  id: number
  user_id: string
  country_code: string
  products_purchased: number
  first_purchase_date: string | null
  total_spent: number
  collection_complete: boolean
  badge_earned: boolean
  created_at: string
  updated_at: string
}

export interface CulturalStory {
  id: number
  title: string
  content: string
  story_type: string
  related_country_code: string | null
  related_product_id: number | null
  author: string
  publish_date: string
  is_featured: boolean
  image_url: string | null
  tags: string[]
  reading_time: number
  created_at: string
  updated_at: string
}

export interface Notification {
  id: number
  user_id: string
  notification_type: string
  title: string
  message: string
  data: any
  is_read: boolean
  is_sent: boolean
  scheduled_for: string | null
  created_at: string
}