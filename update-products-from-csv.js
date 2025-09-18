const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const csv = require('csv-parser')
const path = require('path')

// Supabase configuration
const supabaseUrl = 'https://pmqcegwfucfbwwmwumkk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtcWNlZ3dmdWNmYnd3bXd1bWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTc3NzMsImV4cCI6MjA3MjkzMzc3M30.1oXas_KE7PBq6GyjOkV9lFZaAqQZGlE-8YLCSNgnDjc'

const supabase = createClient(supabaseUrl, supabaseKey)

// Enhanced category mapping based on detailed product analysis
const categoryMapping = {
  'chocolate-bars': ['chocolate', 'bar', 'labubu', 'angel hair', 'dubai'],
  'cookies': ['cookie', 'biscuit', 'wafer', 'cracker', 'oreo', 'ritz'],
  'sodas': ['soda', 'drink', 'beverage', 'cola', 'fanta', 'sprite', 'pepsi', 'coca', 'jarritos', 'qdol'],
  'chips': ['chip', 'crisp', 'potato', 'corn', 'snack', 'cheetos', 'doritos', 'buldak potato'],
  'spicy': ['spicy', 'hot', 'chili', 'pepper', 'flamin', 'fire', 'buldak', 'habanero', 'carbo'],
  'gummies': ['gummy', 'gummi', 'jelly', 'bear', 'worm', 'fruit', 'peelerz', 'jarritos bottle gummies'],
  'hard-candies': ['candy', 'sweet', 'sugar', 'lollipop', 'sucker', 'hard', 'mochi', 'marshmallow', 'pickle kit'],
  'mints': ['mint', 'breath', 'fresh', 'peppermint'],
  'pastries': ['cannoli', 'pastry', 'cake', 'dessert', 'bakery', 'pennisi']
}

// Enhanced function to determine category based on product title, description, and vendor
function determineCategory(title, description, vendor) {
  const text = `${title} ${description} ${vendor}`.toLowerCase()
  
  // Check for specific patterns first
  if (text.includes('ramen') && (text.includes('buldak') || text.includes('spicy') || text.includes('hot'))) {
    return 'spicy'
  }
  
  if (text.includes('pickle kit') && text.includes('spicy')) {
    return 'spicy'
  }
  
  if (text.includes('pickle kit') && !text.includes('spicy')) {
    return 'hard-candies'
  }
  
  if (text.includes('mochi')) {
    return 'hard-candies'
  }
  
  if (text.includes('marshmallow')) {
    return 'gummies'
  }
  
  // Standard keyword matching
  for (const [category, keywords] of Object.entries(categoryMapping)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category
    }
  }
  
  return 'hard-candies' // Default category for uncategorized items
}

// Function to create slug from title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Function to clean HTML description
function cleanDescription(html) {
  if (!html) return null
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .substring(0, 500) // Limit length
}

async function getCategoryId(slug) {
  const { data, error } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .single()
  
  if (error) {
    console.warn(`Category not found: ${slug}`)
    return null
  }
  
  return data.id
}

async function clearExistingProducts() {
  console.log('🗑️  Clearing existing products...')
  
  const { error } = await supabase
    .from('products')
    .delete()
    .neq('id', 0) // Delete all products
  
  if (error) {
    throw new Error(`Failed to clear products: ${error.message}`)
  }
  
  console.log('✅ Existing products cleared')
}

async function importProductsFromCSV() {
  const csvPath = path.join(__dirname, 'public', 'products_export_1(2).csv')
  
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found: ${csvPath}`)
  }
  
  console.log('📊 Reading CSV file...')
  
  const products = []
  const processedHandles = new Set()
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        // Skip rows without title or with empty handle
        if (!row.Title || !row.Handle || processedHandles.has(row.Handle)) {
          return
        }
        
        processedHandles.add(row.Handle)
        
        const title = row.Title.trim()
        const description = cleanDescription(row['Body (HTML)'])
        const vendor = row.Vendor || null
        const price = parseFloat(row['Variant Price']) || 0
        const sku = row['Variant SKU'] || null
        const weightGrams = parseFloat(row['Variant Grams']) || null
        const imageSrc = row['Image Src'] || null
        const published = row.Published === 'true'
        
        if (price <= 0) {
          console.warn(`Skipping product with invalid price: ${title}`)
          return
        }
        
        const categorySlug = determineCategory(title, description, vendor)
        const slug = createSlug(title)
        
        const product = {
          name: title,
          description: description,
          price: price,
          currency: 'USD',
          sku: sku,
          stock_quantity: 100, // Default stock
          weight_grams: weightGrams,
          origin_country: null, // Will be determined by vendor/context
          brand: vendor,
          image_urls: imageSrc ? [imageSrc] : null,
          slug: slug,
          is_active: published,
          featured: false, // Will set some as featured later
          category_slug: categorySlug // Temporary field for mapping
        }
        
        products.push(product)
      })
      .on('end', async () => {
        console.log(`📦 Found ${products.length} products to import`)
        
        try {
          // Get category IDs
          const categoryIds = {}
          for (const slug of Object.keys(categoryMapping)) {
            const id = await getCategoryId(slug)
            if (id) {
              categoryIds[slug] = id
            }
          }
          
          // Map products to category IDs
          const productsWithCategoryIds = products.map(product => {
            const categoryId = categoryIds[product.category_slug]
            delete product.category_slug // Remove temporary field
            
            return {
              ...product,
              category_id: categoryId
            }
          })
          
          // Insert products in batches
          const batchSize = 50
          let inserted = 0
          
          for (let i = 0; i < productsWithCategoryIds.length; i += batchSize) {
            const batch = productsWithCategoryIds.slice(i, i + batchSize)
            
            const { error } = await supabase
              .from('products')
              .insert(batch)
            
            if (error) {
              console.error(`Error inserting batch ${Math.floor(i/batchSize) + 1}:`, error)
              continue
            }
            
            inserted += batch.length
            console.log(`✅ Inserted batch ${Math.floor(i/batchSize) + 1}: ${inserted}/${productsWithCategoryIds.length} products`)
          }
          
          // Set some products as featured (first 20 products)
          const { error: featuredError } = await supabase
            .from('products')
            .update({ featured: true })
            .in('id', productsWithCategoryIds.slice(0, 20).map((_, index) => index + 1))
          
          if (featuredError) {
            console.warn('Failed to set featured products:', featuredError.message)
          } else {
            console.log('⭐ Set 20 products as featured')
          }
          
          console.log(`🎉 Successfully imported ${inserted} products!`)
          resolve(inserted)
          
        } catch (error) {
          reject(error)
        }
      })
      .on('error', reject)
  })
}

async function main() {
  try {
    console.log('🚀 Starting product import process...')
    
    // Step 1: Clear existing products
    await clearExistingProducts()
    
    // Step 2: Import new products from CSV
    const importedCount = await importProductsFromCSV()
    
    console.log(`\n🎉 Import completed successfully!`)
    console.log(`📊 Total products imported: ${importedCount}`)
    
    // Show category distribution
    const { data: categoryStats } = await supabase
      .from('products')
      .select('category_id, categories(name, slug)')
      .not('category_id', 'is', null)
    
    if (categoryStats) {
      const stats = {}
      categoryStats.forEach(product => {
        const categoryName = product.categories?.name || 'Unknown'
        stats[categoryName] = (stats[categoryName] || 0) + 1
      })
      
      console.log('\n📈 Category distribution:')
      Object.entries(stats).forEach(([category, count]) => {
        console.log(`  ${category}: ${count} products`)
      })
    }
    
  } catch (error) {
    console.error('❌ Import failed:', error.message)
    process.exit(1)
  }
}

// Check if csv-parser is available
try {
  require.resolve('csv-parser')
} catch (e) {
  console.log('Installing csv-parser...')
  const { execSync } = require('child_process')
  execSync('npm install csv-parser', { stdio: 'inherit' })
}

main()
