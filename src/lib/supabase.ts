import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://boklgnsennmynedivddb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJva2xnbnNlbm5teW5lZGl2ZGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NzU3MDEsImV4cCI6MjA3MjE1MTcwMX0.s5AU5NsxYZ6Yz9dWbRBA0_3gURiyDBTp8hiNxGhOsPc'

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