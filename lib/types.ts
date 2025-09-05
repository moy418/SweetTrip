export interface Product {
  id: string
  name: string
  description?: string
  price: number
  image_urls: string[]
  stock_quantity: number
  featured: boolean
  brand?: string
  origin_country?: string
  weight_grams?: number
  slug: string
  category_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description?: string
  slug: string
  image_url?: string
  parent_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  image_urls: string[]
  quantity: number
  slug: string
}

export interface Order {
  id: string
  user_id: string
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shipping_address: any
  billing_address: any
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  product: Product
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  comment?: string
  created_at: string
  user: {
    name: string
    avatar_url?: string
  }
}

export interface Coupon {
  id: string
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  minimum_amount?: number
  expires_at?: string
  is_active: boolean
}
