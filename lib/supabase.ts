import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Product, Category, Review, Coupon } from './types'

export const supabase = createClientComponentClient()

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .eq('is_active', true)
    .limit(8)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) throw error
  return data || []
}

export async function getProducts(params?: {
  category?: string
  search?: string
  limit?: number
  offset?: number
}): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)

  if (params?.category) {
    query = query.eq('category_id', params.category)
  }

  if (params?.search) {
    query = query.ilike('name', `%${params.search}%`)
  }

  if (params?.limit) {
    query = query.limit(params.limit)
  }

  if (params?.offset) {
    query = query.range(params.offset, params.offset + (params.limit || 20) - 1)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getProduct(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function getCategory(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      user:profiles(name, avatar_url)
    `)
    .eq('product_id', productId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function validateCoupon(code: string): Promise<Coupon | null> {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  // Check if coupon is expired
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return null
  }

  return data
}


