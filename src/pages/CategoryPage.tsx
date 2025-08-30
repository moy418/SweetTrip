import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase, Product, Category } from '../lib/supabase'
import ProductGrid from '../components/ProductGrid'
import toast from 'react-hot-toast'

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      loadCategoryData()
    }
  }, [slug])

  const loadCategoryData = async () => {
    try {
      setLoading(true)
      
      // Load category
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()
      
      if (categoryError) throw categoryError
      if (!categoryData) {
        toast.error('Category not found')
        return
      }
      
      setCategory(categoryData)
      
      // Load products in this category
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryData.id)
        .eq('is_active', true)
        .order('name')
      
      if (productsError) throw productsError
      setProducts(productsData || [])
      
    } catch (error) {
      console.error('Error loading category:', error)
      toast.error('Failed to load category')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8" />
            <ProductGrid products={[]} loading={true} />
          </div>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600">The category you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{category.name}</h1>
            {category.description && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {category.description}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-4">
              {products.length} products available
            </p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 py-8">
        <ProductGrid 
          products={products} 
          loading={loading}
          emptyMessage={`No products found in ${category.name}`}
        />
      </div>
    </div>
  )
}